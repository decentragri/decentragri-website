// Token refresh functionality is not needed for a static site

export function clearTokenRefresh() {
  // No-op for static site
}

export async function setupTokenRefresh() {
  // No-op for static site
  return Promise.resolve();
}

export async function refreshAccessToken() {
  // No-op for static site
  return Promise.resolve(null);
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
