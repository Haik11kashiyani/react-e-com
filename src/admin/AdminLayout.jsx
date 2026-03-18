import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, Users, Ticket, Star, Mail, LogOut, Menu, X, ChevronRight, Sun, Moon } from 'lucide-react';
import useAuth from '../hooks/useAuth';
import AdminThemeProvider, { useAdminTheme } from './AdminThemeContext';
import './AdminLayout.css';

const navItems = [
  { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/admin/products', icon: Package, label: 'Products' },
  { to: '/admin/orders', icon: ShoppingCart, label: 'Orders' },
  { to: '/admin/users', icon: Users, label: 'Users' },
  { to: '/admin/coupons', icon: Ticket, label: 'Coupons' },
  { to: '/admin/reviews', icon: Star, label: 'Reviews' },
  { to: '/admin/contacts', icon: Mail, label: 'Messages' },
];

const AdminLayoutInner = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { mode, toggleTheme } = useAdminTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className={`admin-wrapper ${mode}`}>
      {/* Mobile overlay */}
      {sidebarOpen && <div className="admin-overlay" onClick={() => setSidebarOpen(false)} />}

      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="admin-sidebar-header">
          <div className="admin-logo">
            <div className="admin-logo-icon">T</div>
            <span className="admin-logo-text">TechOrbit</span>
          </div>
          <button className="admin-sidebar-close" onClick={() => setSidebarOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <nav className="admin-nav">
          {navItems.map(({ to, icon: Icon, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}
              onClick={() => setSidebarOpen(false)}
            >
              <Icon size={20} />
              <span>{label}</span>
              <ChevronRight size={16} className="admin-nav-arrow" />
            </NavLink>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <div className="admin-user-info">
            <div className="admin-user-avatar">
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </div>
            <div className="admin-user-details">
              <span className="admin-user-name">{user?.firstName} {user?.lastName}</span>
              <span className="admin-user-role">Administrator</span>
            </div>
          </div>
          <button className="admin-logout-btn" onClick={handleLogout}>
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        <header className="admin-topbar">
          <button className="admin-hamburger" onClick={() => setSidebarOpen(true)}>
            <Menu size={22} />
          </button>
          <div className="admin-topbar-title">Admin Panel</div>
          <div className="admin-topbar-right">
            <button className="admin-theme-toggle" onClick={toggleTheme} title={mode === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}>
              {mode === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <NavLink to="/" className="admin-view-store-btn">
              View Store
            </NavLink>
          </div>
        </header>
        <div className="admin-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

const AdminLayout = () => (
  <AdminThemeProvider>
    <AdminLayoutInner />
  </AdminThemeProvider>
);

export default AdminLayout;
