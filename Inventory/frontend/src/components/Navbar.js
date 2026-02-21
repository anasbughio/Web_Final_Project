import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const isAdmin = user?.role === 'Admin';
  const isStoreManager = user?.role === 'Store Manager';

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <h1 onClick={() => navigate('/dashboard')} style={{ cursor: 'pointer' }}>
            📦 Inventory Management
          </h1>
        </div>

        {/* Mobile menu toggle */}
        <button
          className="mobile-menu-toggle"
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          ☰
        </button>

        {user && (
          <div className={`navbar-content ${mobileMenuOpen ? 'mobile-open' : ''}`}>
            {/* Navigation Links */}
            <div className="navbar-menu">
              {/* Common Links for All Authenticated Users */}
              <Link to="/dashboard" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
                🏠 Dashboard
              </Link>
              <Link to="/products" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
                📊 Products
              </Link>
              <Link to="/orders" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
                📦 Orders
              </Link>

              {/* Admin Only Links */}
              {isAdmin && (
                <>
                  <Link to="/users" className="nav-link admin-link" onClick={() => setMobileMenuOpen(false)}>
                    👥 Users
                  </Link>
                  <span className="nav-divider">|</span>
                  <span className="admin-badge">👑 Admin Panel</span>
                </>
              )}

              {/* Store Manager Links */}
              {isStoreManager && (
                <>
                  <span className="nav-divider">|</span>
                  <span className="manager-badge">⚙️ Manager</span>
                </>
              )}
            </div>

            {/* User Info & Logout */}
            <div className="navbar-right">
              <div className="user-info">
                <span className="user-name">{user.name}</span>
                <span className={`user-role role-${user.role.toLowerCase().replace(' ', '-')}`}>
                  {user.role}
                </span>
              </div>
              <button onClick={handleLogout} className="logout-btn">
                🚪 Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
