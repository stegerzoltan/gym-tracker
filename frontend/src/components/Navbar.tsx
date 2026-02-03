import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (!token) return null;

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar-brand" onClick={() => navigate('/workouts')} style={{ cursor: 'pointer' }}>
        <span>💪</span>
        <span>Gym Tracker</span>
      </div>
      <div className="navbar-links">
        <a 
          href="/workouts" 
          className="navbar-link" 
          style={{ color: isActive('/workouts') ? '#667eea' : undefined }}
        >
          Workouts
        </a>
        <a 
          href="/exercises" 
          className="navbar-link"
          style={{ color: isActive('/exercises') ? '#667eea' : undefined }}
        >
          Exercises
        </a>
        <a 
          href="/measurements" 
          className="navbar-link"
          style={{ color: isActive('/measurements') ? '#667eea' : undefined }}
        >
          Measurements
        </a>
        <a 
          href="/goals" 
          className="navbar-link"
          style={{ color: isActive('/goals') ? '#667eea' : undefined }}
        >
          Goals
        </a>
        <a 
          href="/analytics" 
          className="navbar-link"
          style={{ color: isActive('/analytics') ? '#667eea' : undefined }}
        >
          Analytics
        </a>
        <button onClick={handleLogout} className="btn btn-secondary" style={{ width: 'auto', padding: '0.5rem 1.5rem' }}>
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
