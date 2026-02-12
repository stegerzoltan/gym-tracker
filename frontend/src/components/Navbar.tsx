import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isAdmin = localStorage.getItem('isAdmin') === 'true';

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('isAdmin');
    navigate('/admin');
    window.location.reload();
  };

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
        <a 
          href="/admin" 
          className="navbar-link"
          style={{ 
            color: isActive('/admin') ? '#667eea' : undefined,
            backgroundColor: isAdmin ? 'rgba(102, 126, 234, 0.15)' : 'transparent',
            padding: '0.5rem 1rem',
            borderRadius: '8px'
          }}
        >
          {isAdmin ? '🔐 Admin' : 'Admin'}
        </a>
        {isAdmin && (
          <button onClick={handleLogout} className="btn btn-secondary" style={{ width: 'auto', padding: '0.5rem 1.5rem' }}>
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
