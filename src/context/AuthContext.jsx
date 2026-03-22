import { createContext, useContext, useState, useEffect } from 'react';
import { loginAdmin as loginAPI, registerAdmin as registerAPI, getAdminProfile } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    const savedUser = localStorage.getItem('adminUser');
    if (token && savedUser) {
      setAdmin(JSON.parse(savedUser));
      // Verify token is still valid
      getAdminProfile()
        .then((res) => {
          setAdmin(res.data.data);
          localStorage.setItem('adminUser', JSON.stringify(res.data.data));
        })
        .catch(() => {
          localStorage.removeItem('adminToken');
          localStorage.removeItem('adminUser');
          setAdmin(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const res = await loginAPI({ email, password });
    const { token, ...userData } = res.data.data;
    localStorage.setItem('adminToken', token);
    localStorage.setItem('adminUser', JSON.stringify(userData));
    setAdmin(userData);
    return res.data;
  };

  const register = async (username, email, password) => {
    const res = await registerAPI({ username, email, password });
    const { token, ...userData } = res.data.data;
    localStorage.setItem('adminToken', token);
    localStorage.setItem('adminUser', JSON.stringify(userData));
    setAdmin(userData);
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    setAdmin(null);
  };

  return (
    <AuthContext.Provider value={{ admin, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
