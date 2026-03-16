import { createContext, useContext, useState } from 'react';
import { getCurrentUser, login, logout, register } from '../data/auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getCurrentUser);

  const handleLogin = async (username, password) => {
    const result = await login(username, password);
    if (result.user) setUser(result.user);
    return result;
  };

  const handleRegister = async (username, password) => {
    const result = await register(username, password);
    if (result.user) setUser(result.user);
    return result;
  };

  const handleLogout = () => {
    logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login: handleLogin, register: handleRegister, logout: handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
