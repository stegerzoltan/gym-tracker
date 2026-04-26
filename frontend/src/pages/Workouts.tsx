import React, { useState, useEffect } from 'react';

interface Exercise {
  name: string;
  sets: number;
  reps: number;
  weight: number;
  notes: string;
}

interface Workout {
  _id: string;
  name: string;
  date: string;
  exercises: Exercise[];
  duration: number;
  notes: string;
  exerciseName?: string;
  rounds?: number;
  weight?: number;
  descriptionLines?: string[];
}

interface EditState {
  id: string;
  clientName: string;
  exerciseName: string;
  rounds: string;
  weight: string;
  descriptionText: string;
  durationMinutes: string;
  durationSeconds: string;
  date: string;
}

const SAMPLE_WORKOUTS: Workout[] = [
  { _id: 's1', name: 'Kempf Tamás', date: '2026-02-09', exercises: [], duration: 23 + 3/60, notes: '', exerciseName: 'Hyrox', rounds: 8, descriptionLines: ['220m Run', '11x Devil press', '11x Sumo squat'] },
  { _id: 's2', name: 'Nagy Péter', date: '2026-02-11', exercises: [], duration: 35 + 22/60, notes: '', exerciseName: 'Crossfit WOD', rounds: 5, descriptionLines: ['400m Run', '15x Thruster (40kg)', '10x Pull-up'] },
  { _id: 's3', name: 'Kovács Anna', date: '2026-02-13', exercises: [], duration: 28 + 45/60, notes: '', exerciseName: 'HIIT Circuit', rounds: 4, descriptionLines: ['30x Burpee', '20x KB Swing (16kg)', '15x Box Jump'] },
  { _id: 's4', name: 'Szabó Béla', date: '2026-02-15', exercises: [], duration: 52 + 10/60, notes: '', exerciseName: 'Strength Day', rounds: 6, descriptionLines: ['5x Squat (100kg)', '5x Deadlift (120kg)', '8x Bench Press (80kg)'] },
  { _id: 's5', name: 'Horváth Eszter', date: '2026-02-17', exercises: [], duration: 19 + 55/60, notes: '', exerciseName: 'Cardio Blast', rounds: 10, descriptionLines: ['200m Sprint', '20x Mountain Climber', '10x Jump Squat'] },
  { _id: 's6', name: 'Tóth Gábor', date: '2026-02-19', exercises: [], duration: 41 + 30/60, notes: '', exerciseName: 'Functional Training', rounds: 3, descriptionLines: ['15x Kettlebell Row (20kg)', '12x TRX Row', '20x Plank Tap'] },
  { _id: 's7', name: 'Fekete Réka', date: '2026-02-21', exercises: [], duration: 31 + 12/60, notes: '', exerciseName: 'Hyrox Szimulátor', rounds: 6, descriptionLines: ['150m Evezés (ergométer)', '10x Sandbag Lunge (10kg)', '8x Wall Ball (6kg)'] },
  { _id: 's8', name: 'Molnár Zoltán', date: '2026-02-23', exercises: [], duration: 44 + 48/60, notes: '', exerciseName: 'Endurance Mix', rounds: 7, descriptionLines: ['500m Kerékpár (ergométer)', '25x Sit-up', '15x Push-up'] },
];

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '0.55rem 0.75rem', border: '1.5px solid #e2e8f0',
  borderRadius: '8px', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box',
  fontFamily: 'inherit',
};

const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#4a5568',
  marginBottom: '0.3rem', textTransform: 'uppercase', letterSpacing: '0.04em',
};

const HISTORY_KEY = 'workout_history';

export const saveSnapshot = (workouts: Workout[], action: string) => {
  const history = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
  history.unshift({ timestamp: new Date().toISOString(), action, workouts });
  if (history.length > 30) history.pop();
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
};

const WORKOUTS_KEY = 'zolcoach_workouts';

const Workouts: React.FC = () => {
  const [workouts, setWorkouts] = useState<Workout[]>(() => {
    try {
      const saved = localStorage.getItem(WORKOUTS_KEY);
      if (saved) { const parsed = JSON.parse(saved); if (Array.isArray(parsed) && parsed.length > 0) return parsed; }
    } catch { /* ignore */ }
    return SAMPLE_WORKOUTS;
  });
  const [loading, setLoading] = useState(true);
  const [editState, setEditState] = useState<EditState | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const isAdmin = localStorage.getItem('admin_logged_in') === 'true';
  const [addForm, setAddForm] = useState({ clientName: '', exerciseName: '', rounds: '', weight: '', descriptionText: '', durationMinutes: '', durationSeconds: '', date: new Date().toISOString().split('T')[0] });

  useEffect(() => {
    (async () => {
      // Check for admin-restored state first
      const restored = localStorage.getItem('restored_workouts');
      if (restored) {
        try {
          const parsed = JSON.parse(restored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setWorkouts(parsed);
            localStorage.setItem(WORKOUTS_KEY, JSON.stringify(parsed));
            localStorage.removeItem('restored_workouts');
            setLoading(false);
            return;
          }
        } catch { /* ignore */ }
      }
      setLoading(false);
    })();
  }, []);

  const openEdit = (workout: Workout) => {
    const mins = Math.floor(workout.duration);
    const secs = Math.round((workout.duration - mins) * 60);
    setEditState({
      id: workout._id,
      clientName: workout.exerciseName ? workout.name : workout.name,
      exerciseName: workout.exerciseName || workout.name,
      rounds: String(workout.rounds || ''),
      weight: String(workout.weight || ''),
      descriptionText: (workout.descriptionLines || (workout.notes ? workout.notes.split('\n') : [])).join('\n'),
      durationMinutes: String(mins),
      durationSeconds: String(secs),
      date: workout.date.split('T')[0],
    });
  };

  const saveEdit = () => {
    if (!editState) return;
    const duration = (parseInt(editState.durationMinutes) || 0) + (parseInt(editState.durationSeconds) || 0) / 60;
    const lines = editState.descriptionText.split('\n').map(l => l.trim()).filter(Boolean);
    setWorkouts(prev => {
      const next = prev.map(w =>
        w._id === editState.id
          ? { ...w, name: editState.clientName, exerciseName: editState.exerciseName, rounds: parseInt(editState.rounds) || undefined, weight: parseFloat(editState.weight) || undefined, descriptionLines: lines, duration, date: editState.date, notes: lines.join('\n') }
          : w
      );
      saveSnapshot(next, `Szerkesztés: ${editState.clientName} – ${editState.exerciseName}`);
      localStorage.setItem(WORKOUTS_KEY, JSON.stringify(next));
      return next;
    });
    setEditState(null);
  };

  const deleteCard = (id: string) => {
    setWorkouts(prev => {
      const target = prev.find(w => w._id === id);
      const next = prev.filter(w => w._id !== id);
      saveSnapshot(next, `Törlés: ${target?.exerciseName ? `${target.name} – ${target.exerciseName}` : target?.name || id}`);
      localStorage.setItem(WORKOUTS_KEY, JSON.stringify(next));
      return next;
    });
    setEditState(null);
  };

  const addCard = () => {
    const duration = (parseInt(addForm.durationMinutes) || 0) + (parseInt(addForm.durationSeconds) || 0) / 60;
    const lines = addForm.descriptionText.split('\n').map(l => l.trim()).filter(Boolean);
    const newWorkout: Workout = {
      _id: 'local_' + Date.now(),
      name: addForm.clientName,
      exerciseName: addForm.exerciseName,
      rounds: parseInt(addForm.rounds) || undefined,
      weight: parseFloat(addForm.weight) || undefined,
      descriptionLines: lines,
      duration,
      date: addForm.date,
      exercises: [],
      notes: lines.join('\n'),
    };
    setWorkouts(prev => {
      const next = [newWorkout, ...prev];
      saveSnapshot(next, `Új edzés: ${addForm.clientName} – ${addForm.exerciseName}`);
      localStorage.setItem(WORKOUTS_KEY, JSON.stringify(next));
      return next;
    });
    setAddForm({ clientName: '', exerciseName: '', rounds: '', weight: '', descriptionText: '', durationMinutes: '', durationSeconds: '', date: new Date().toISOString().split('T')[0] });
    setShowAddForm(false);
  };

  if (loading) return <div className="loading">Betöltés...</div>;

  const filteredWorkouts = searchQuery.trim()
    ? workouts.filter(w =>
        w.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (w.exerciseName || '').toLowerCase().includes(searchQuery.toLowerCase())
      )
    : workouts;

  return (
    <div className="workouts-container">
      <div className="workouts-header">
        <h1>💪 Edzésnapló 2026</h1>
        <button onClick={() => setShowAddForm(v => !v)} className="btn btn-primary" style={{ width: 'auto', padding: '0.75rem 2rem' }}>
          {showAddForm ? '✕ Mégse' : '+ Új edzés'}
        </button>
      </div>

      {/* Search filter */}
      <div style={{ marginBottom: '1.25rem', position: 'relative' }}>
        <span style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', fontSize: '1rem', pointerEvents: 'none' }}>🔍</span>
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Keresés névre vagy gyakorlatra..."
          style={{
            ...inputStyle,
            paddingLeft: '2.4rem',
            paddingRight: searchQuery ? '2.4rem' : '0.75rem',
            background: 'rgba(255,255,255,0.92)',
            border: '1.5px solid rgba(255,255,255,0.6)',
            fontSize: '0.95rem',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          }}
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#a0aec0', fontSize: '1.1rem', lineHeight: 1 }}
          >✕</button>
        )}
      </div>

      {/* Add form */}
      {showAddForm && (
        <div className="workout-form" style={{ marginBottom: '1.5rem' }}>
          <h2 style={{ marginBottom: '1.25rem', color: '#2d3748' }}>Új edzés hozzáadása</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div><label style={labelStyle}>Vendég neve</label><input style={inputStyle} value={addForm.clientName} onChange={e => setAddForm(f => ({ ...f, clientName: e.target.value }))} /></div>
            <div><label style={labelStyle}>Gyakorlat neve</label><input style={inputStyle} value={addForm.exerciseName} onChange={e => setAddForm(f => ({ ...f, exerciseName: e.target.value }))} /></div>
            <div><label style={labelStyle}>Körök</label><input style={inputStyle} type="number" min="1" value={addForm.rounds} onChange={e => setAddForm(f => ({ ...f, rounds: e.target.value }))} /></div>
            <div>
              <label style={labelStyle}>Súly (kg)</label>
              <select style={inputStyle} value={addForm.weight} onChange={e => setAddForm(f => ({ ...f, weight: e.target.value }))}>
                <option value="">—</option>
                {Array.from({ length: Math.round((300 - 2.5) / 2.5) + 1 }, (_, i) => +(2.5 + i * 2.5).toFixed(1)).map(w => (
                  <option key={w} value={w}>{w} kg</option>
                ))}
              </select>
            </div>
            <div><label style={labelStyle}>Dátum</label><input style={inputStyle} type="date" value={addForm.date} onChange={e => setAddForm(f => ({ ...f, date: e.target.value }))} /></div>
            <div><label style={labelStyle}>Perc</label><input style={inputStyle} type="number" min="0" value={addForm.durationMinutes} onChange={e => setAddForm(f => ({ ...f, durationMinutes: e.target.value }))} /></div>
            <div><label style={labelStyle}>Másodperc</label><input style={inputStyle} type="number" min="0" max="59" value={addForm.durationSeconds} onChange={e => setAddForm(f => ({ ...f, durationSeconds: e.target.value }))} /></div>
          </div>
          <div style={{ marginTop: '0.75rem' }}>
            <label style={labelStyle}>Leírás (soronként)</label>
            <textarea style={{ ...inputStyle, resize: 'vertical' }} rows={4} value={addForm.descriptionText} onChange={e => setAddForm(f => ({ ...f, descriptionText: e.target.value }))} />
          </div>
          <button onClick={addCard} className="btn btn-primary" style={{ marginTop: '1rem' }}>Hozzáadás</button>
        </div>
      )}

      {filteredWorkouts.length === 0 ? (
        <div className="empty-state">
          <h2>{searchQuery ? '🔍 Nincs találat' : '🏋️ Még nincs edzés'}</h2>
          {searchQuery && <p style={{ color: '#718096' }}>Próbálj más keresési feltételt.</p>}
        </div>
      ) : (
        <div className="workouts-grid">
          {filteredWorkouts.map((workout) => {
            const mins = Math.floor(workout.duration);
            const secs = Math.round((workout.duration - mins) * 60);
            const dateStr = new Date(workout.date).toLocaleDateString('hu-HU', { year: 'numeric', month: '2-digit', day: '2-digit' });
            const exerciseName = workout.exerciseName || workout.name;
            const clientName = workout.exerciseName ? workout.name : '';
            const rounds = workout.rounds;
            const lines: string[] = workout.descriptionLines || (workout.notes ? workout.notes.split('\n').filter(Boolean) : []);

            return (
              <div key={workout._id} className="workout-card" style={{
                background: 'white', borderRadius: '18px', padding: '1.25rem 1.25rem 1rem',
                boxShadow: '0 4px 20px rgba(102,126,234,0.13)', border: '1.5px solid rgba(102,126,234,0.12)',
                display: 'flex', flexDirection: 'column', transition: 'all 0.25s ease',
              }}>
                <div className="card-header-gradient" style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  borderRadius: '12px', padding: '0.9rem 1rem', marginBottom: '1rem',
                }}>
                  {clientName && <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.2rem', letterSpacing: '0.04em' }}>👤 {clientName}</p>}
                  <h3 style={{ color: 'white', fontSize: '1.2rem', fontWeight: 700, margin: 0 }}>{exerciseName}</h3>
                  {rounds && <span style={{ display: 'inline-block', marginTop: '0.5rem', background: 'rgba(255,255,255,0.22)', color: 'white', fontSize: '0.78rem', fontWeight: 700, padding: '0.2rem 0.65rem', borderRadius: '20px' }}>🔄 {rounds} kör</span>}
                  {workout.weight && <span style={{ display: 'inline-block', marginTop: '0.5rem', marginLeft: '0.4rem', background: 'rgba(255,255,255,0.22)', color: 'white', fontSize: '0.78rem', fontWeight: 700, padding: '0.2rem 0.65rem', borderRadius: '20px' }}>⚖️ {workout.weight} kg</span>}
                </div>

                {lines.length > 0 && (
                  <div style={{ background: 'rgba(102,126,234,0.05)', borderRadius: '10px', padding: '0.75rem 0.9rem', marginBottom: '0.85rem' }}>
                    {lines.map((line, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.18rem 0', fontSize: '0.88rem', color: '#2d3748', borderBottom: i < lines.length - 1 ? '1px solid rgba(102,126,234,0.08)' : 'none' }}>
                        <span style={{ color: '#667eea', fontWeight: 700, fontSize: '0.75rem' }}>▸</span>{line}
                      </div>
                    ))}
                  </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', marginTop: 'auto' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: '#4a5568' }}>
                    <span>⏱️</span><span style={{ fontWeight: 600 }}>{mins > 0 || secs > 0 ? `${mins} perc${secs > 0 ? ` ${secs} mp` : ''}` : '—'}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#718096' }}>
                    <span>📅</span><span>{dateStr}</span>
                  </div>
                </div>

                <button
                  onClick={() => openEdit(workout)}
                  style={{
                    marginTop: '1rem', padding: '0.5rem', border: 'none', borderRadius: '10px', width: '100%',
                    background: 'rgba(102,126,234,0.1)', color: '#667eea', fontWeight: 700,
                    cursor: 'pointer', fontSize: '0.9rem', transition: 'background 0.2s',
                  }}
                  onMouseOver={e => (e.currentTarget.style.background = 'rgba(102,126,234,0.2)')}
                  onMouseOut={e => (e.currentTarget.style.background = 'rgba(102,126,234,0.1)')}
                >
                  ✏️ Szerkesztés
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Edit Modal */}
      {editState && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', zIndex: 1000,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem',
        }} onClick={() => setEditState(null)}>
          <div style={{
            background: 'white', borderRadius: '20px', padding: '1.5rem',
            width: '100%', maxWidth: '480px', maxHeight: '90vh', overflowY: 'auto',
            boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
          }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h2 style={{ color: '#2d3748', fontSize: '1.2rem', margin: 0 }}>✏️ Kártya szerkesztése</h2>
              <button onClick={() => setEditState(null)} style={{ background: 'none', border: 'none', fontSize: '1.4rem', cursor: 'pointer', color: '#a0aec0' }}>✕</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div><label style={labelStyle}>Vendég neve</label><input style={inputStyle} value={editState.clientName} onChange={e => setEditState(s => s && ({ ...s, clientName: e.target.value }))} /></div>
              <div><label style={labelStyle}>Gyakorlat neve</label><input style={inputStyle} value={editState.exerciseName} onChange={e => setEditState(s => s && ({ ...s, exerciseName: e.target.value }))} /></div>
              <div><label style={labelStyle}>Körök</label><input style={inputStyle} type="number" min="1" value={editState.rounds} onChange={e => setEditState(s => s && ({ ...s, rounds: e.target.value }))} /></div>
              <div>
                <label style={labelStyle}>Súly (kg)</label>
                <select style={inputStyle} value={editState.weight} onChange={e => setEditState(s => s && ({ ...s, weight: e.target.value }))}>
                  <option value="">—</option>
                  {Array.from({ length: Math.round((300 - 2.5) / 2.5) + 1 }, (_, i) => +(2.5 + i * 2.5).toFixed(1)).map(w => (
                    <option key={w} value={w}>{w} kg</option>
                  ))}
                </select>
              </div>
              <div><label style={labelStyle}>Dátum</label><input style={inputStyle} type="date" value={editState.date} onChange={e => setEditState(s => s && ({ ...s, date: e.target.value }))} /></div>
              <div><label style={labelStyle}>Perc</label><input style={inputStyle} type="number" min="0" value={editState.durationMinutes} onChange={e => setEditState(s => s && ({ ...s, durationMinutes: e.target.value }))} /></div>
              <div><label style={labelStyle}>Másodperc</label><input style={inputStyle} type="number" min="0" max="59" value={editState.durationSeconds} onChange={e => setEditState(s => s && ({ ...s, durationSeconds: e.target.value }))} /></div>
            </div>

            <div style={{ marginTop: '0.75rem' }}>
              <label style={labelStyle}>Leírás (soronként)</label>
              <textarea style={{ ...inputStyle, resize: 'vertical' }} rows={5} value={editState.descriptionText} onChange={e => setEditState(s => s && ({ ...s, descriptionText: e.target.value }))} />
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
              <button onClick={saveEdit} className="btn btn-primary" style={{ flex: isAdmin ? 2 : 1 }}>💾 Mentés</button>
              {isAdmin && (
                <button onClick={() => { if (window.confirm('Biztosan törlöd?')) deleteCard(editState.id); }} style={{ flex: 1, padding: '0.75rem', border: 'none', borderRadius: '10px', background: '#fed7d7', color: '#c53030', fontWeight: 700, cursor: 'pointer', fontSize: '0.9rem' }}>🗑️ Törlés</button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Workouts;
