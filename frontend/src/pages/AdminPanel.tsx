import React, { useState } from 'react';

const ADMIN_USER = 'admin';
const ADMIN_PASS = 'admin';
const HISTORY_KEY = 'workout_history';
const ADMIN_SESSION_KEY = 'admin_logged_in';

interface Workout {
  _id: string;
  name: string;
  date: string;
  duration: number;
  notes: string;
  exerciseName?: string;
  rounds?: number;
  descriptionLines?: string[];
}

interface HistoryEntry {
  timestamp: string;
  action: string;
  workouts: Workout[];
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '0.7rem 1rem', border: '1.5px solid #e2e8f0',
  borderRadius: '10px', fontSize: '1rem', outline: 'none', boxSizing: 'border-box',
  fontFamily: 'inherit',
};

const AdminPanel: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem(ADMIN_SESSION_KEY) === 'true'
  );
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);
  const [restored, setRestored] = useState<string | null>(null);

  const history: HistoryEntry[] = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === ADMIN_USER && password === ADMIN_PASS) {
      localStorage.setItem(ADMIN_SESSION_KEY, 'true');
      setIsLoggedIn(true);
    } else {
      setError('Hibás felhasználónév vagy jelszó!');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem(ADMIN_SESSION_KEY);
    setIsLoggedIn(false);
  };

  const handleRestore = (entry: HistoryEntry) => {
    // Save current state as a new history entry before restoring
    const current: HistoryEntry[] = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
    const ts = new Date().toISOString();
    current.unshift({ timestamp: ts, action: `Visszaállítás előtt – automatikus mentés`, workouts: current[0]?.workouts || [] });
    localStorage.setItem(HISTORY_KEY, JSON.stringify(current.slice(0, 30)));

    // Store restored workouts so Workouts page picks them up on reload
    localStorage.setItem('restored_workouts', JSON.stringify(entry.workouts));
    setRestored(entry.timestamp);
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleString('hu-HU', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  if (!isLoggedIn) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      }}>
        <div style={{
          background: 'white', borderRadius: '20px', padding: '2.5rem 2rem',
          maxWidth: '380px', width: '90%', boxShadow: '0 25px 60px rgba(0,0,0,0.3)', textAlign: 'center',
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>🔐</div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#2d3748', marginBottom: '0.5rem' }}>Admin belépés</h1>
          <p style={{ color: '#718096', fontSize: '0.9rem', marginBottom: '1.75rem' }}>Ez az oldal csak adminisztrátorok számára elérhető.</p>
          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '0.75rem', textAlign: 'left' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#4a5568', display: 'block', marginBottom: '0.3rem' }}>Felhasználónév</label>
              <input style={inputStyle} value={username} onChange={e => { setUsername(e.target.value); setError(''); }} autoFocus />
            </div>
            <div style={{ marginBottom: '1rem', textAlign: 'left' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#4a5568', display: 'block', marginBottom: '0.3rem' }}>Jelszó</label>
              <input style={inputStyle} type="password" value={password} onChange={e => { setPassword(e.target.value); setError(''); }} />
            </div>
            {error && <p style={{ color: '#e53e3e', fontSize: '0.85rem', marginBottom: '0.75rem' }}>{error}</p>}
            <button type="submit" style={{
              width: '100%', padding: '0.85rem', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white', border: 'none', borderRadius: '10px', fontSize: '1rem', fontWeight: 700, cursor: 'pointer',
            }}>
              Belépés
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: '2rem 1rem' }}>
      <div style={{ maxWidth: '700px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <h1 style={{ color: 'white', fontSize: '1.75rem', fontWeight: 700, margin: 0 }}>🔐 Admin Panel</h1>
          <button onClick={handleLogout} style={{
            padding: '0.5rem 1.25rem', background: 'rgba(255,255,255,0.2)', color: 'white',
            border: '1.5px solid rgba(255,255,255,0.4)', borderRadius: '10px', fontWeight: 700, cursor: 'pointer', fontSize: '0.9rem',
          }}>
            Kijelentkezés
          </button>
        </div>

        {/* Restore notice */}
        {restored && (
          <div style={{ background: '#c6f6d5', color: '#276749', borderRadius: '12px', padding: '1rem 1.25rem', marginBottom: '1.25rem', fontWeight: 600 }}>
            ✅ Visszaállítva: {formatDate(restored)} — Az oldal újratöltésekor érvényes lesz.
          </div>
        )}

        {/* History */}
        <div style={{ background: 'white', borderRadius: '18px', padding: '1.5rem', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}>
          <h2 style={{ color: '#2d3748', fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.25rem' }}>📋 Szerkesztési előzmények</h2>

          {history.length === 0 ? (
            <p style={{ color: '#718096', textAlign: 'center', padding: '2rem 0' }}>Még nincs előzmény. A kártyák szerkesztésekor itt jelennek meg a mentési pontok.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {history.map((entry, idx) => (
                <div key={idx} style={{
                  border: '1.5px solid rgba(102,126,234,0.15)', borderRadius: '12px', overflow: 'hidden',
                }}>
                  {/* Entry header */}
                  <div
                    onClick={() => setExpandedIdx(expandedIdx === idx ? null : idx)}
                    style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      padding: '0.85rem 1rem', cursor: 'pointer',
                      background: expandedIdx === idx ? 'rgba(102,126,234,0.07)' : 'white',
                      gap: '0.5rem',
                    }}
                  >
                    <div>
                      <p style={{ fontWeight: 700, color: '#2d3748', fontSize: '0.95rem', margin: 0 }}>{entry.action}</p>
                      <p style={{ color: '#718096', fontSize: '0.8rem', margin: '0.15rem 0 0' }}>🕐 {formatDate(entry.timestamp)}</p>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexShrink: 0 }}>
                      <button
                        onClick={e => { e.stopPropagation(); handleRestore(entry); }}
                        style={{
                          padding: '0.4rem 0.9rem', border: 'none', borderRadius: '8px',
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          color: 'white', fontWeight: 700, cursor: 'pointer', fontSize: '0.82rem',
                        }}
                      >
                        ↩️ Visszaállít
                      </button>
                      <span style={{ color: '#a0aec0', fontSize: '1rem' }}>{expandedIdx === idx ? '▲' : '▼'}</span>
                    </div>
                  </div>

                  {/* Expanded card list */}
                  {expandedIdx === idx && (
                    <div style={{ padding: '0.75rem 1rem 1rem', background: 'rgba(102,126,234,0.03)', borderTop: '1px solid rgba(102,126,234,0.1)' }}>
                      <p style={{ fontSize: '0.8rem', fontWeight: 700, color: '#4a5568', marginBottom: '0.5rem' }}>Kártyák ebben az állapotban ({entry.workouts.length} db):</p>
                      {entry.workouts.map((w, wi) => {
                        const name = w.exerciseName ? `${w.name} – ${w.exerciseName}` : w.name;
                        const mins = Math.floor(w.duration);
                        const secs = Math.round((w.duration - mins) * 60);
                        return (
                          <div key={wi} style={{ fontSize: '0.85rem', color: '#2d3748', padding: '0.3rem 0', borderBottom: wi < entry.workouts.length - 1 ? '1px solid rgba(0,0,0,0.05)' : 'none' }}>
                            <span style={{ color: '#667eea', marginRight: '0.4rem' }}>▸</span>
                            <strong>{name}</strong>
                            {w.rounds ? ` · ${w.rounds} kör` : ''}
                            {` · ${mins} perc${secs > 0 ? ` ${secs} mp` : ''}`}
                            {` · ${new Date(w.date).toLocaleDateString('hu-HU')}`}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
