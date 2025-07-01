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
   */
  public async renewAccessToken(): Promise<void | Error> {
    try {
      return await fetchWithAutoRefresh(async () => {
        // No token needed, cookies sent automatically
        await api.renew.post(undefined, { fetch: { credentials: 'include' } });
      });
    } catch (error) {
      return error as Error;
    }
  }
}
