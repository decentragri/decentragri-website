//** ELYSIA IMPORT */
import type { Elysia } from "elysia";

//** SERVICE IMPORTS */
import AuthService from "../auth.services/auth.service";

//** MEMGRAPH IMPORt */
import { getDriver } from "../db/memgraph";

//** TYPE IMPORTS */
import type { UserLoginResponse } from "../auth.services/auth.interface";
import type { SuccessMessage } from "../onchain.services/onchain.interface";

//** SCHEMA IMPORTS */
import { fcmTokenSchema, loginSchema, registerSchema } from "../auth.services/auth.schema";


const Auth = (app: Elysia) =>
  app
    .post('/register', async ({ body }): Promise<UserLoginResponse> => {
      try {
        const driver = getDriver();
        const authService = new AuthService(driver);
        const output = await authService.register(body);
        return output;
      } catch (error) {
        console.error(error);
        throw error;
      }
    }, registerSchema)
    .post('/login', async ({ body, set }) => {
      try {
        const driver = getDriver();
        const authService = new AuthService(driver);
        const output = await authService.login(body);
        // Set tokens as httpOnly, secure cookies (Elysia: assign to set.cookie)
        set.cookie = {
          accessToken: {
            value: output.accessToken,
            httpOnly: false,
            secure: true,
            sameSite: 'strict',
            path: '/',
            maxAge: 60 * 5 // 5 minutes
          },
          refreshToken: {
            value: output.refreshToken,
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            path: '/',
            maxAge: 60 * 60 * 24 * 30 // 30 days
          }
        };
        // Remove tokens from response body
        const { accessToken, refreshToken, ...rest } = output;
        return rest;
      } catch (error) {
        console.error(error);
        throw error;
      }
    }, loginSchema)
    .post('/validate-session', async ({ cookie }): Promise<UserLoginResponse> => {
      try {
        // Use refreshToken from httpOnly cookie
        const refreshToken = cookie?.refreshToken?.value;
        if (!refreshToken) throw new Error('No refresh token cookie found');
        const driver = getDriver();
        const authService = new AuthService(driver);
        const output = await authService.validateSession(refreshToken);
        return output;
      } catch (error) {
        console.error(error);
        throw error;
      }
    })
    .post('/renew', async ({ cookie, set }) => {
      try {
        // Use refreshToken from httpOnly cookie
        const refreshToken = cookie?.refreshToken?.value;
        if (!refreshToken) throw new Error('No refresh token cookie found');
        const driver = getDriver();
        const authService = new AuthService(driver);
        const output = await authService.refreshSession(refreshToken);
        // Set new tokens as httpOnly, secure cookies
        set.cookie = {
          accessToken: {
            value: output.accessToken,
            httpOnly: false,
            secure: true,
            sameSite: 'strict',
            path: '/',
            maxAge: 60 * 5
          },
          refreshToken: {
            value: output.refreshToken,
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            path: '/',
            maxAge: 60 * 60 * 24 * 30
          }
        };
        // Remove tokens from response body
        const { accessToken, refreshToken: _refreshToken, ...rest } = output;
        return rest;
      } catch (error) {
        console.error(error);
        throw error;
      }
    })
    .post('/api/save/fcm-token/android', async ({ headers, body }): Promise<SuccessMessage> => {
      try {
        const authorizationHeader: string = headers.authorization;
        if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
          throw new Error('Bearer token not found in Authorization header');
        }
        const jwtToken: string = authorizationHeader.substring(7);
        const driver = getDriver();
        const authService = new AuthService(driver);
        const output: SuccessMessage = await authService.saveFcmToken(jwtToken, body);
        return output;
      } catch (error) {
        console.error(error);
        throw error;
      }
    }, fcmTokenSchema);

export default Auth;