import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // MOCK_MODE: Set to true for development testing
  const MOCK_MODE = true;
  
  // Default to LOGGED OUT
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Optionally load from localStorage here if we were persisting mock state
    const savedUser = localStorage.getItem('mockUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setIsAuthenticated(true);
    }
  }, []);

  const login = (role) => {
    if (!MOCK_MODE) return; // Prevent real API bypass in prod
    
    let mockUser = null;
    switch(role) {
      case 'Customer':
        mockUser = { id: 1, name: 'John Doe', role: 'Customer', email: 'customer@test.com' };
        break;
      case 'Provider':
        mockUser = { id: 2, name: 'Service Pro', role: 'Provider', email: 'provider@test.com' };
        break;
      case 'Admin':
        mockUser = { id: 3, name: 'Admin', role: 'Admin', email: 'admin@test.com' };
        break;
      default:
        mockUser = null;
    }
    
    if (mockUser) {
      setUser(mockUser);
      setIsAuthenticated(true);
      localStorage.setItem('mockUser', JSON.stringify(mockUser));
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('mockUser');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout, MOCK_MODE }}>
      {children}
    </AuthContext.Provider>
  );
};
