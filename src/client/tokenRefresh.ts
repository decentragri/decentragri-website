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

export async function setupTokenRefresh() {
  clearTokenRefresh();
  // Import AuthClient dynamically to avoid circular dependency
  const { AuthClient } = await import('./auth/clientAuth');
  const authClient = new AuthClient();
  // Validate session to get new access token and expiry
  const session = await authClient.validateSession();
  console.debug('[setupTokenRefresh] validateSession result:', session);
  if (session instanceof Error) return;
  const accessToken = session.accessToken;
  const exp = getJwtExpiry(accessToken) || (Date.now() / 1000 + 14 * 60);
  const msUntilRefresh = (exp * 1000) - Date.now() - 30 * 1000; // refresh 30s before expiry
  console.debug('[setupTokenRefresh] accessToken:', accessToken);
  console.debug('[setupTokenRefresh] exp:', exp, 'msUntilRefresh:', msUntilRefresh);
  if (msUntilRefresh > 0) {
    refreshTimer = setTimeout(async () => {
      try {
        await refreshAccessToken();
        await setupTokenRefresh();
      } catch (err) {
        const { useAuthStore } = await import('../context/AuthContext');
        useAuthStore.getState().logout();
      }
    }, msUntilRefresh);
  }
}

export async function refreshAccessToken() {
  // Import AuthClient dynamically to avoid circular dependency
  const { AuthClient } = await import('./auth/clientAuth');
  const authClient = new AuthClient();
  if (isRefreshing) return;
  isRefreshing = true;
  try {
    const result = await authClient.renewAccessToken();
    if (result instanceof Error) throw result;
    // Debug: Check if cookie is present after renew
    if (typeof document !== 'undefined') {
      console.debug('Cookies after renewAccessToken:', document.cookie);
    }
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
