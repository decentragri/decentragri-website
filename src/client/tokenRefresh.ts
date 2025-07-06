import { api } from './api';
// Do NOT import AuthClient at the top to avoid circular deps

let refreshTimer: ReturnType<typeof setTimeout> | null = null;
let isRefreshing = false;

export function clearTokenRefresh() {
  if (refreshTimer) clearTimeout(refreshTimer);
  refreshTimer = null;
}

function getJwtExpiry(token: string): number | null {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp;
  } catch {
    return null;
  }
}

export async function setupTokenRefresh(attempt = 1): Promise<void> {
  const maxRetries = 3;
  const retryDelay = 5000; // 5 seconds
  
  try {
    clearTokenRefresh();
    
    // Import AuthClient dynamically to avoid circular dependency
    const { AuthClient } = await import('./auth/clientAuth');
    const authClient = new AuthClient();
    
    // Validate session to get new access token and expiry
    const session = await authClient.validateSession();
    console.debug('[setupTokenRefresh] validateSession result:', session);
    
    if (session instanceof Error) {
      if (attempt < maxRetries) {
        console.warn(`[setupTokenRefresh] Session validation failed (attempt ${attempt}/${maxRetries}), retrying in ${retryDelay}ms...`);
        await new Promise(resolve => setTimeout(resolve, retryDelay));
        return setupTokenRefresh(attempt + 1);
      }
      console.error('[setupTokenRefresh] Max retries reached, giving up');
      return;
    }
    
    const accessToken = session.accessToken;
    if (!accessToken) {
      console.error('[setupTokenRefresh] No access token in session');
      return;
    }
    
    const exp = getJwtExpiry(accessToken) || (Date.now() / 1000 + 14 * 60);
    let msUntilRefresh = (exp * 1000) - Date.now() - 30 * 1000; // refresh 30s before expiry
    
    // Ensure we don't set a negative or too small timeout
    msUntilRefresh = Math.max(10000, msUntilRefresh); // At least 10 seconds
    
    console.debug('[setupTokenRefresh] Token will expire in', Math.floor(msUntilRefresh / 1000), 'seconds');
    
    refreshTimer = setTimeout(async () => {
      try {
        console.debug('[setupTokenRefresh] Refreshing token...');
        const newSession = await refreshAccessToken();
        
        if (newSession) {
          console.debug('[setupTokenRefresh] Token refresh successful, setting up next refresh');
          await setupTokenRefresh();
        } else {
          console.warn('[setupTokenRefresh] Token refresh did not return a new session, will retry next time');
          // Schedule a retry in 1 minute if refresh failed but didn't log us out
          refreshTimer = setTimeout(() => setupTokenRefresh(), 60000);
        }
      } catch (err) {
        console.error('[setupTokenRefresh] Error during token refresh:', err);
        // Don't call logout here, let refreshAccessToken handle it
        // Instead, schedule a retry in case it was a temporary issue
        refreshTimer = setTimeout(() => setupTokenRefresh(), 60000);
      }
    }, msUntilRefresh);
    
    console.debug(`[setupTokenRefresh] Next token refresh in ${Math.floor(msUntilRefresh / 1000)} seconds`);
  } catch (error) {
    console.error('[setupTokenRefresh] Unexpected error:', error);
    // Don't log out on unexpected errors, just log and retry
    refreshTimer = setTimeout(() => setupTokenRefresh(), 60000);
  }
}

export async function refreshAccessToken() {
  // Import AuthClient dynamically to avoid circular dependency
  const { AuthClient } = await import('./auth/clientAuth');
  const authClient = new AuthClient();
  
  // If already refreshing, wait for the current refresh to complete
  if (isRefreshing) {
    return new Promise<void>((resolve, reject) => {
      let attempts = 0;
      const maxAttempts = 30; // 3 seconds max wait (30 * 100ms)
      
      const checkRefresh = setInterval(() => {
        attempts++;
        if (!isRefreshing) {
          clearInterval(checkRefresh);
          resolve();
        } else if (attempts >= maxAttempts) {
          clearInterval(checkRefresh);
          console.warn('Token refresh is taking too long, giving up');
          resolve(); // Don't reject, just continue with the current token
        }
      }, 100);
    });
  }
  
  isRefreshing = true;
  try {
    console.debug('Attempting to refresh access token...');
    
    // First, check if we have a valid session
    const currentSession = await authClient.validateSession();
    if (currentSession instanceof Error) {
      console.warn('Current session is invalid, attempting to renew token');
    }
    
    const result = await authClient.renewAccessToken();
    
    if (result instanceof Error) {
      // If it's a network error, don't log out - just log and continue with current token
      if (result.message.toLowerCase().includes('network') || 
          result.message.toLowerCase().includes('failed to fetch')) {
        console.warn('Network error during token refresh, will retry next time');
        return null;
      }
      console.error('Token refresh failed:', result);
      throw result;
    }
    
    // Debug: Check if cookie is present after renew
    if (typeof document !== 'undefined') {
      console.debug('Cookies after renewAccessToken:', document.cookie);
    }
    
    // Get the latest session data after token refresh
    const session = await authClient.validateSession();
    if (session instanceof Error) {
      console.error('Failed to validate session after token refresh:', session);
      // Don't throw here, just log and continue with current token
      return null;
    }
    
    // Update the auth store with the new token
    const { useAuthStore } = await import('../context/AuthContext');
    const { userInfo } = useAuthStore.getState();
    
    if (userInfo) {
      useAuthStore.setState({
        userInfo: {
          ...userInfo,
          accessToken: session.accessToken
        }
      });
      console.debug('Token refresh successful');
      return session;
    }
    
    return null;
  } catch (error) {
    console.error('Error in refreshAccessToken:', error);
    
    // Only logout for authentication errors, not for network issues
    if (error instanceof Error) {
      const errorMsg = error.message.toLowerCase();
      const isAuthError = errorMsg.includes('jwt') || 
                         errorMsg.includes('401') ||
                         errorMsg.includes('unauthorized') ||
                         errorMsg.includes('invalid token');
      
      if (isAuthError) {
        console.warn('Authentication error, logging out');
        const { useAuthStore } = await import('../context/AuthContext');
        useAuthStore.getState().logout();
      } else if (!errorMsg.includes('network') && !errorMsg.includes('failed to fetch')) {
        // For non-network errors, log but don't log out
        console.warn('Non-critical error during token refresh, will retry later');
      }
    }
    
    return null;
  } finally {
    isRefreshing = false;
  }
}

// fetchWithAutoRefresh remains as before
export async function fetchWithAutoRefresh(fetchFn: () => Promise<any>) {
  try {
    return await fetchFn();
  } catch (err: any) {
    if (
      err?.message?.toLowerCase().includes('jwt') ||
      err?.message?.toLowerCase().includes('401') ||
      err?.code === 'FAST_JWT_EXPIRED'
    ) {
      try {
        await refreshAccessToken();
        // Retry original request
        return await fetchFn();
      } catch (refreshErr) {
        // If refresh fails, force logout
        const { useAuthStore } = await import('../context/AuthContext');
        useAuthStore.getState().logout();
        throw refreshErr;
      }
    }
    throw err;
  }
}
