import { useEffect } from 'react';
import { useAuthStore } from '../context/AuthContext';
import { setupTokenRefresh, clearTokenRefresh } from '../client/tokenRefresh';

export function useTokenRefresh() {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  useEffect(() => {
    if (!isLoggedIn) {
      // Clear any existing refresh timers if user is not logged in
      clearTokenRefresh();
      return;
    }

    // Set up token refresh when the component mounts and user is logged in
    let isMounted = true;

    const setupRefresh = async () => {
      try {
        await setupTokenRefresh();
        console.debug('[useTokenRefresh] Token refresh mechanism initialized');
      } catch (error) {
        console.error('[useTokenRefresh] Failed to set up token refresh:', error);
        if (isMounted) {
          // If we can't set up token refresh, it's better to log the user out
          useAuthStore.getState().logout();
        }
      }
    };

    setupRefresh();

    // Clean up on unmount
    return () => {
      isMounted = false;
      // Don't clear the timer here as it's needed across route changes
      // The timer will be cleared when the user logs out or when the page is refreshed
    };
  }, [isLoggedIn]);

  return null;
}
