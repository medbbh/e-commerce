import { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import jwt_decode from 'jwt-decode';

// Create the context
const AuthContext = createContext();

// Define the provider component
export const AuthProvider = ({ children }) => {
  const [authTokens, setAuthTokens] = useState(() =>
    localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null
  );
  const [user, setUser] = useState(() => (authTokens ? jwt_decode(authTokens.access) : null));
  const [loading, setLoading] = useState(true);

  // Login user and save tokens
  const loginUser = async (email, password) => {
    try {
      const response = await axios.post('http://127.0.0.1:8000/auth/jwt/create/', { email, password });
      setAuthTokens(response.data);
      setUser(jwt_decode(response.data.access));
      localStorage.setItem('authTokens', JSON.stringify(response.data));
      startTokenRefreshTimer(response.data); // Start the refresh timer after login
      return true;
    } catch (error) {
      console.error('Login failed', error);
      return false;
    }
  };

  // Logout function
  const logoutUser = () => {
    setAuthTokens(null);
    setUser(null);
    localStorage.removeItem('authTokens');
  };

  // Refresh token function
  const refreshToken = async () => {
    try {
      const response = await axios.post('http://127.0.0.1:8000/auth/jwt/refresh/', { refresh: authTokens.refresh });
      setAuthTokens(response.data);
      setUser(jwt_decode(response.data.access));
      localStorage.setItem('authTokens', JSON.stringify(response.data));
      startTokenRefreshTimer(response.data); // Reset the timer after refreshing
    } catch (error) {
      console.error('Token refresh failed', error);
      logoutUser();
    }
  };

  // Token refresh timer setup
  const startTokenRefreshTimer = (tokens) => {
    const decoded = jwt_decode(tokens.access);
    const expiresIn = decoded.exp * 1000 - Date.now(); // Time remaining until expiration in milliseconds

    // Refresh the token 1 minute before it expires
    const refreshTime = expiresIn - 60 * 1000;

    if (refreshTime > 0) {
      setTimeout(refreshToken, refreshTime); // Automatically refresh the token before it expires
    }
  };

  // Effect to handle token refresh on app load or token change
  useEffect(() => {
    if (authTokens) {
      startTokenRefreshTimer(authTokens); // Start the timer on page load or token update
    }
    setLoading(false);
  }, [authTokens]);

  // Context data to provide throughout the app
  const contextData = {
    user,
    authTokens,
    loginUser,
    logoutUser,
  };

  return (
    <AuthContext.Provider value={contextData}>
      {loading ? null : children} {/* Only render children when loading is complete */}
    </AuthContext.Provider>
  );
};

export default AuthContext;
