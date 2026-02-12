import React, { useState, useEffect } from 'react';
import { workoutService } from '../services/api';

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
}

const Workouts: React.FC = () => {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    date: new Date().toISOString().split('T')[0],
    exercises: [],
    durationMinutes: 0,
    durationSeconds: 0,
    notes: ''
  });

  const isAdmin = localStorage.getItem('isAdmin') === 'true';

  useEffect(() => {
    fetchWorkouts();
  }, []);

  const fetchWorkouts = async () => {
    try {
      const response = await workoutService.getAll();
      setWorkouts(response.data);
    } catch (error) {
      console.error('Failed to fetch workouts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const totalDuration = formData.durationMinutes + (formData.durationSeconds / 60);
      const workoutData = {
        name: formData.name,
        date: formData.date,
        exercises: formData.exercises,
        duration: totalDuration,
        notes: formData.notes
      };

      if (editingId) {
        await workoutService.update(editingId, workoutData);
        setEditingId(null);
      } else {
        await workoutService.create(workoutData);
      }
    const minutes = Math.floor(workout.duration);
    const seconds = Math.round((workout.duration - minutes) * 60);
    
    setFormData({
      name: workout.name,
      date: workout.date.split('T')[0],
      exercises: workout.exercises,
      durationMinutes: minutes,
      durationSeconds: seconds,
      notes: workout.notes
    });
    setEditingId(workout._id);
    setShowForm(true);
  };

  const handleCancelEdit = () => {
    setFormData({ name: '', date: new Date().toISOString().split('T')[0], exercises: [], durationMinutes: 0, durationSeconds
      duration: workout.duration,
      notes: workout.notes
    });
    setEditingId(workout._id);
    setShowForm(true);
  };

  const handleCancelEdit = () => {
    setFormData({ name: '', date: new Date().toISOString().split('T')[0], exercises: [], duration: 0, notes: '' });
    setEditingId(null);
    setShowForm(false);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this workout?')) {
      try {
        await workoutService.delete(id);
        fetchWorkouts();
      } catch (error) {
        console.error('Failed to delete workout:', error);
      }
    }
  };

  if (loading) return <div className="loading">Loading your workouts...</div>;

  return (
    <div className="workouts-container">
      <div className="workouts-header">
        <h1>💪 My Workouts</h1>
        {isAdmin && (
          <button 
            onClick={() => {
              if (showForm) handleCancelEdit();
              else setShowForm(true);
            }} 
            className="btn btn-primary"
            style={{ width: 'auto', padding: '0.75rem 2rem' }}
          >
            {showForm ? '✕ Cancel' : '+ New Workout'}
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="workout-form">
          <h2>{editingId ? 'Edit Workout' : 'Create New Workout'}</h2>
          
          <div className="form-group">
            <label>Workout Name</label>
            <input
              type="text"
              className="form-input"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Chest Day, Leg Day"
              required
            />
          </div>
          
          <div className="form-group">
            <label>Date</label>
            <input
              type="date"
              className="form-input"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Duration</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.875rem', color: '#718096' }}>Minutes</label>
                <input
                  type="number"
                  className="form-input"
                  value={formData.durationMinutes}
                  onChange={(e) => setFormData({ ...formData, durationMinutes: parseInt(e.target.value) || 0 })}
                  placeholder="45"
                  min="0"
                />
              </div>
              <div>
                <label style={{ fontSize: '0.875rem', color: '#718096' }}>Seconds</label>
                <input
                  type="number"
                  className="form-input"
                  value={formData.durationSeconds}
                  onChange={(e) => setFormData({ ...formData, durationSeconds: parseInt(e.target.value) || 0 })}
                  placeholder="30"
                  min="0"
                  max="59"
                />
              </div>
            </div>
          </div>
          
          <div className="form-group">
            <label>Notes</label>
            <textarea
              className="form-input"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="How did it go? Any observations?"
              rows={3}
            />
          </div>
          
          <button type="submit" className="btn btn-primary">
            {editingId ? 'Update Workout' : 'Create Workout'}
          </button>
        </form>
      )}

      {workouts.length === 0 ? (
        <div className="empty-state">
          <h2>🏋️ No Workouts Yet</h2>
          <p>Start your fitness journey by creating your first workout!</p>
        </div>
      ) : (
        <div className="workouts-grid">
          {workouts.map((workout) => (
            <div key={workout._id} className="workout-card">
              <h3>{workout.name}</h3>
              <div className="workout-info">
                <p>📅 {new Date(workout.date).toLocaleDateString('en-US', { 
                  weekday: 'short', 
                  year: 'numeric', 
                  month: 'short', 
                  day: 'numeric' 
                })}</p>
                <p>⏱️ {Math.floor(workout.duration)} perc {Math.round((workout.duration - Math.floor(workout.duration)) * 60)} másodperc</p>
                <p>🏋️ {workout.exercises.length} exercises</p>
                {workout.notes && <p>📝 {workout.notes}</p>}
              </div>
              {isAdmin && (
                <div className="workout-actions">
                  <button onClick={() => handleEdit(workout)} className="btn btn-primary" style={{ marginRight: '0.5rem' }}>
                    Edit
                  </button>
                  <button onClick={() => handleDelete(workout._id)} className="btn btn-danger">
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Workouts;
