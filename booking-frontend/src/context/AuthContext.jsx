import React, { createContext, useState, useEffect, useCallback, useContext } from 'react';
import apiClient from '../services/apiClient';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Function to load the user profile from the token
  const loadProfile = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await apiClient.get('/auth/profile');
      if (response.data && response.data.success) {
        setUser(response.data.data.user);
        setIsAuthenticated(true);
      } else {
        throw new Error('Failed to load profile');
      }
    } catch (error) {
      console.error("Profile load failed:", error);
      logout(); // clear invalid token
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const sendOtp = async (phone) => {
    const response = await apiClient.post('/auth/send-otp', { phone });
    return response.data;
  };

  const verifyOtp = async (phone, otp) => {
    const response = await apiClient.post('/auth/verify-otp', { phone, otp });
    const { token, refreshToken, user: userData, requiresRegistration } = response.data.data;
    
    if (token) {
      localStorage.setItem('token', token);
    }
    if (refreshToken) {
      localStorage.setItem('refreshToken', refreshToken);
    }
    
    // Only fully authenticate if registration is not required
    if (!requiresRegistration && userData) {
      setUser(userData);
      setIsAuthenticated(true);
    }
    
    return response.data;
  };

  const register = async (userData) => {
    const response = await apiClient.post('/auth/register', userData);
    const { token, refreshToken, user: newUserData } = response.data.data;
    
    if (token) {
      localStorage.setItem('token', token);
    }
    if (refreshToken) {
      localStorage.setItem('refreshToken', refreshToken);
    }
    
    setUser(newUserData);
    setIsAuthenticated(true);
    
    return response.data;
  };

  const logout = async () => {
    try {
      const refreshTokenValue = localStorage.getItem('refreshToken');
      // If backend requires refresh token for logout, pass it
      if (refreshTokenValue) {
         await apiClient.post('/auth/logout', { refreshToken: refreshTokenValue });
      }
    } catch (error) {
      console.error("Logout API failed, continuing local logout", error);
    }
    
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, sendOtp, verifyOtp, register, logout, loadProfile }}>
      {children}
    </AuthContext.Provider>
  );
};


export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
