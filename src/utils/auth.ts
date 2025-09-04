// Development authentication utilities
// This is a simple implementation for development - replace with your actual auth system

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  token: string;
}

// Mock auth functions for development
export const mockLogin = (email: string, password: string): Promise<AuthUser> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (email && password) {
        const mockUser: AuthUser = {
          id: 'dev-user-1',
          email,
          name: 'Development User',
          token: 'dev-token-' + Date.now(), // Mock JWT token
        };
        
        // Store token for API calls
        localStorage.setItem('authToken', mockUser.token);
        localStorage.setItem('user', JSON.stringify(mockUser));
        
        resolve(mockUser);
      } else {
        reject(new Error('Invalid credentials'));
      }
    }, 1000);
  });
};

export const mockLogout = (): void => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('user');
  sessionStorage.removeItem('authToken');
  sessionStorage.removeItem('user');
};

export const getCurrentUser = (): AuthUser | null => {
  try {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  } catch {
    return null;
  }
};

export const isAuthenticated = (): boolean => {
  const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
  return !!token;
};

// Set a development token for testing
export const setDevelopmentToken = (): void => {
  const devToken = 'dev-token-' + Date.now();
  localStorage.setItem('authToken', devToken);
  localStorage.setItem('user', JSON.stringify({
    id: 'dev-user-1',
    email: 'dev@example.com',
    name: 'Development User',
    token: devToken,
  }));
  console.log('Development token set:', devToken);
};
