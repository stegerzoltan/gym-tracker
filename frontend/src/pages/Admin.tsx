import React, { useState } from 'react';
import { authService } from '../services/api';
import { useNavigate } from 'react-router-dom';

const Admin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authService.login(email, password);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('isAdmin', 'true');
      navigate('/workouts');
      window.location.reload();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Admin login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('isAdmin');
    window.location.reload();
  };

  const isAdmin = localStorage.getItem('isAdmin') === 'true';

  if (isAdmin) {
    return (
      <div className="workouts-container">
        <div className="workout-form" style={{ maxWidth: '500px', margin: '0 auto' }}>
          <h2>🔐 Admin Panel</h2>
          <p style={{ marginBottom: '2rem', color: '#4a5568' }}>
            You are logged in as admin. You can now add, edit, and delete content.
          </p>
          <button onClick={handleLogout} className="btn btn-danger">
            Logout Admin
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="workouts-container">
      <form onSubmit={handleLogin} className="workout-form" style={{ maxWidth: '500px', margin: '0 auto' }}>
        <h2>🔐 Admin Login</h2>
        <p style={{ marginBottom: '2rem', color: '#4a5568' }}>
          Login to manage content (add, edit, delete)
        </p>

        {error && (
          <div style={{ 
            padding: '1rem', 
            marginBottom: '1rem', 
            backgroundColor: '#fed7d7', 
            color: '#c53030',
            borderRadius: '8px',
            fontSize: '0.9rem'
          }}>
            {error}
          </div>
        )}

        <div className="form-group">
          <label>Admin Email</label>
          <input
            type="email"
            className="form-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            className="form-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Logging in...' : 'Admin Login'}
        </button>
      </form>
    </div>
  );
};

export default Admin;
