//** API EDEN TREATY IMPORT */
import { api } from "../api";
//** TYPE IMPORTS */
import type { UserRegistration, userLogin, UserLoginResponse } from "@server/auth.services/auth.interface";
import { fetchWithAutoRefresh } from '../tokenRefresh';

export class AuthClient {
  /**
   * Register a new user (POST /register)
   */
  public async registerUser(body: UserRegistration): Promise<UserLoginResponse | Error> {
    try {
      return await fetchWithAutoRefresh(async () => {
        const res = await api.register.post(body);
        if (!res.data) throw new Error("Registration failed");
        return res.data as UserLoginResponse;
      });
    } catch (error) {
      return error as Error;
    }
  }

  /**
   * Login a user (POST /login)
   */
  public async loginUser(body: userLogin): Promise<UserLoginResponse | Error> {
    try {
      return await fetchWithAutoRefresh(async () => {
        // Send credentials, let browser handle cookies
        const res = await api.login.post(body, { fetch: { credentials: 'include' } });

        if (res.error) {
          const errorMessage = typeof res.error.value === "string"
            ? res.error.value
            : res.error.value?.message || res.error.value?.summary || "Login failed";
          throw new Error(errorMessage);
        }
        return res.data as UserLoginResponse;
      });
    } catch (error) {
      return error as Error;
    }
  }

  /**
   * Validate a user session (POST /validate-session)
   */
  public async validateSession(): Promise<UserLoginResponse | Error> {
    try {
      return await fetchWithAutoRefresh(async () => {
        // No token needed, cookies sent automatically
        const res = await api["validate-session"].post(undefined, { fetch: { credentials: 'include' } });
        if (!res.data) throw new Error("Session validation failed");
        return res.data as UserLoginResponse;
      });
    } catch (error) {
      return error as Error;
    }
  }

  /**
   * Renew access token (POST /renew-access)
   * @returns The user login response with new tokens or an error
   */
  public async renewAccessToken(): Promise<UserLoginResponse | Error> {
    try {
      return await fetchWithAutoRefresh(async () => {
        // First, get the current session to ensure we have the latest user data
        const session = await this.validateSession();
        if (session instanceof Error) {
          throw new Error('Failed to validate current session');
        }

        // Then make the renew request
        const res = await api.renew.post(undefined, { 
          fetch: { 
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              'Cache-Control': 'no-store, no-cache, must-revalidate',
              'Pragma': 'no-cache',
              'Expires': '0'
            },
            mode: 'cors',
            cache: 'no-store'
          } 
        });
        
        if (!res.data) {
          throw new Error('No data received in renew response');
        }
        
        // The server should return a UserLoginResponse
        // Merge the response with the existing session data to ensure all required fields are present
        const responseData = res.data as Partial<UserLoginResponse>;
        
        // Create a complete UserLoginResponse object with all required fields
        const renewedSession: UserLoginResponse = {
          username: responseData.username || session.username,
          walletAddress: responseData.walletAddress || session.walletAddress,
          accessToken: responseData.accessToken || '', // This should be provided by the server
          refreshToken: responseData.refreshToken || session.refreshToken,
          loginType: responseData.loginType || session.loginType,
          level: responseData.level ?? session.level,
          experience: responseData.experience ?? session.experience,
          walletData: responseData.walletData || session.walletData,
          // Include any additional fields that might be needed
          ...responseData
        };
        
        if (!renewedSession.accessToken) {
          throw new Error('No access token in renew response');
        }
        
        return renewedSession;
      });
    } catch (error) {
      console.error('Error in renewAccessToken:', error);
      return error as Error;
    }
  }
}
