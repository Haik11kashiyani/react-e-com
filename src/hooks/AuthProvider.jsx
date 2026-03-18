import React, { useState, useEffect, useCallback } from 'react';
import AuthContext from './AuthContext';
import { loginUser, registerUser, getMe } from '../utils/api';

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('techorbit_user'));
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  // Check token on mount
  useEffect(() => {
    const token = localStorage.getItem('techorbit_token');
    if (token) {
      getMe()
        .then((res) => {
          setUser(res.data.user);
          localStorage.setItem('techorbit_user', JSON.stringify(res.data.user));
        })
        .catch(() => {
          setUser(null);
          localStorage.removeItem('techorbit_token');
          localStorage.removeItem('techorbit_user');
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (email, password) => {
    const res = await loginUser({ email, password });
    const { token, user: userData } = res.data;
    localStorage.setItem('techorbit_token', token);
    localStorage.setItem('techorbit_user', JSON.stringify(userData));
    setUser(userData);
    return res.data;
  }, []);

  const register = useCallback(async (formData) => {
    const res = await registerUser(formData);
    const { token, user: userData } = res.data;
    localStorage.setItem('techorbit_token', token);
    localStorage.setItem('techorbit_user', JSON.stringify(userData));
    setUser(userData);
    return res.data;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('techorbit_token');
    localStorage.removeItem('techorbit_user');
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}
