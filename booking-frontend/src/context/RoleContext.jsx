import React, { createContext, useContext } from 'react';
import { AuthContext } from './AuthContext';

export const RoleContext = createContext();

export const RoleProvider = ({ children }) => {
  const { user } = useContext(AuthContext);

  const hasRole = (role) => {
    if (!user) return false;
    return user.role === role;
  };

  return (
    <RoleContext.Provider value={{ hasRole }}>
      {children}
    </RoleContext.Provider>
  );
};
