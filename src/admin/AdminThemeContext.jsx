import React, { createContext, useContext, useState, useEffect } from 'react';

const AdminThemeContext = createContext();

export const useAdminTheme = () => useContext(AdminThemeContext);

export default function AdminThemeProvider({ children }) {
  const [mode, setMode] = useState(() => {
    try {
      return localStorage.getItem('admin_theme') || 'dark';
    } catch {
      return 'dark';
    }
  });

  useEffect(() => {
    localStorage.setItem('admin_theme', mode);
    document.documentElement.setAttribute('data-admin-theme', mode);
  }, [mode]);

  const toggleTheme = () => setMode(m => (m === 'dark' ? 'light' : 'dark'));

  return (
    <AdminThemeContext.Provider value={{ mode, toggleTheme }}>
      {children}
    </AdminThemeContext.Provider>
  );
}
