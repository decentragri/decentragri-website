import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { UserLoginResponse } from "@server/auth.services/auth.interface";
import React, { createContext, useContext, useEffect, useState } from 'react';
import { setupTokenRefresh } from '../client/tokenRefresh';

// Interface for numeric values that might come as BigInt objects from the backend


// Interface for wallet data matching the server's WalletData interface
interface WalletData {
  smartWalletAddress: string;
  dagriBalance: string;
  rsWETHBalance: string;
  ethBalance: string;
  swellBalance: string;
  nativeBalance: string;
  dagriPriceUSD: number;
  ethPriceUSD: number;
  swellPriceUSD: number;
}

// Extended user interface with additional fields we need for the dashboard
interface User {
  username: string;
  name?: string;
  profilePicture?: string;
  email?: string;
  accessToken?: string;
  refreshToken?: string;
  walletAddress: string;
  walletData: WalletData;
  loginType: 'decentragri';
  level: number;
  experience: number;
  createdAt?: string;
  rank?: number;
  city?: string;
}

export interface AuthState {
  isLoggedIn: boolean;
  username: string | null;
  userInfo: User | null;
  loading: boolean;
  error: string | null;
  login: (data: User) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

// Create the auth store with persistence
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      username: null,
      userInfo: null,
      loading: false,
      error: null,
      login: (data) => {
        set({
          isLoggedIn: true,
          username: data.username,
          userInfo: data,
          error: null,
        });
        // Initialize token refresh mechanism after successful login
        setupTokenRefresh().catch(console.error);
      },
      logout: () => {
        set({
          isLoggedIn: false,
          username: null,
          userInfo: null,
          error: null,
        });
      },
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
    }),
    {
      name: 'auth-storage',
    }
  )
);

// Create React Context for components that need auth state
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  login: (data: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// AuthProvider component to wrap app with auth context
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isLoggedIn, userInfo, loading, error, login, logout, setLoading } = useAuthStore();
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    // Simulate checking token validity on first load
    const checkAuth = async () => {
      setLoading(true);
      try {
        // In a real app, you would verify the token with your backend here
        // For now, we'll just use the persisted state
        setInitialized(true);
        // If user is already logged in, set up token refresh on app load
        if (isLoggedIn) {
          setupTokenRefresh().catch(console.error);
        }
      } catch (err) {
        console.error('Auth error:', err);
        logout();
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [setLoading, logout, isLoggedIn]);

  // Provide the auth context to children components
  return (
    <AuthContext.Provider
      value={{
        user: userInfo,
        isAuthenticated: isLoggedIn,
        loading: loading || !initialized,
        error,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook for easy access to auth context
export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};
