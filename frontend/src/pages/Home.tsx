import React, { useState } from 'react';
import Workouts from './Workouts';

const CORRECT_PASSWORD = 'szeretekedzeni';
const STORAGE_KEY = 'zolcoach_access';

function checkAccess() {
  if (localStorage.getItem(STORAGE_KEY) === 'true') return true;
  if (sessionStorage.getItem(STORAGE_KEY) === 'true') return true;
  if (document.cookie.split(';').some(c => c.trim() === `${STORAGE_KEY}=true`)) return true;
  return false;
}

function saveAccess() {
  localStorage.setItem(STORAGE_KEY, 'true');
  sessionStorage.setItem(STORAGE_KEY, 'true');
  const expires = new Date();
  expires.setFullYear(expires.getFullYear() + 1);
  document.cookie = `${STORAGE_KEY}=true; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
}

const Home: React.FC = () => {
  const [isUnlocked, setIsUnlocked] = useState(checkAccess);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === CORRECT_PASSWORD) {
      saveAccess();
      setIsUnlocked(true);
    } else {
      setError('Hibás jelszó! Próbálja újra.');
      setPassword('');
    }
  };

  if (isUnlocked) {
    return <Workouts />;
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      }}
    >
      <div
        style={{
          background: 'white',
          borderRadius: '20px',
          padding: '2.5rem 2rem',
          maxWidth: '420px',
          width: '90%',
          boxShadow: '0 25px 60px rgba(0,0,0,0.35)',
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>🏋️</div>
        <h1
          style={{
            fontSize: '1.25rem',
            fontWeight: 700,
            color: '#2d3748',
            marginBottom: '0.75rem',
            lineHeight: 1.4,
          }}
        >
          Kizárólag Zoli coach vendégei számára!
        </h1>
        <p style={{ color: '#718096', marginBottom: '2rem', fontSize: '0.9rem' }}>
          Kérjük, adja meg a jelszót a belépéshez.
        </p>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            value={password}
            onChange={e => {
              setPassword(e.target.value);
              setError('');
            }}
            placeholder="Jelszó"
            autoFocus
            style={{
              width: '100%',
              padding: '0.85rem 1rem',
              border: error ? '2px solid #e53e3e' : '2px solid #e2e8f0',
              borderRadius: '10px',
              fontSize: '1rem',
              marginBottom: '0.5rem',
              outline: 'none',
              transition: 'border-color 0.2s',
              boxSizing: 'border-box',
            }}
          />
          {error && (
            <p
              style={{
                color: '#e53e3e',
                fontSize: '0.85rem',
                marginBottom: '0.75rem',
                marginTop: '0.25rem',
              }}
            >
              {error}
            </p>
          )}
          <button
            type="submit"
            style={{
              width: '100%',
              padding: '0.85rem',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              fontSize: '1rem',
              fontWeight: 600,
              cursor: 'pointer',
              marginTop: error ? '0' : '0.5rem',
              boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
              transition: 'opacity 0.2s',
            }}
            onMouseOver={e => (e.currentTarget.style.opacity = '0.9')}
            onMouseOut={e => (e.currentTarget.style.opacity = '1')}
          >
            Belépés
          </button>
        </form>
      </div>
    </div>
  );
};

export default Home;
