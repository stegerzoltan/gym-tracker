import React, { useState, useEffect } from 'react';
import { goalService } from '../services/api';

interface Goal {
  _id: string;
  type: string;
  title: string;
  target: number;
  current: number;
  unit: string;
  deadline?: string;
  completed: boolean;
  completedAt?: string;
}

const Goals: React.FC = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    type: 'strength',
    title: '',
    target: '',
    current: '0',
    unit: 'lbs',
    deadline: ''
  });

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      const response = await goalService.getAll();
      setGoals(response.data);
    } catch (error) {
      console.error('Failed to fetch goals:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await goalService.create(formData);
      setShowForm(false);
      setFormData({ type: 'strength', title: '', target: '', current: '0', unit: 'lbs', deadline: '' });
      fetchGoals();
    } catch (error) {
      console.error('Failed to create goal:', error);
    }
  };

  const updateProgress = async (id: string, current: number) => {
    try {
      await goalService.update(id, { current });
      fetchGoals();
    } catch (error) {
      console.error('Failed to update goal:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Delete this goal?')) {
      try {
        await goalService.delete(id);
        fetchGoals();
      } catch (error) {
        console.error('Failed to delete goal:', error);
      }
    }
  };

  const getProgress = (goal: Goal) => {
    return Math.min((goal.current / goal.target) * 100, 100);
  };

  return (
    <div className="workouts-container">
      <div className="workouts-header">
        <h1>🎯 Goals & Targets</h1>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="btn btn-primary"
          style={{ width: 'auto', padding: '0.75rem 2rem' }}
        >
          {showForm ? '✕ Cancel' : '+ New Goal'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="workout-form">
          <h2>Create New Goal</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div className="form-group">
              <label>Type</label>
              <select className="form-input" value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })} required>
                <option value="strength">Strength</option>
                <option value="weight">Weight</option>
                <option value="workout_frequency">Workout Frequency</option>
                <option value="custom">Custom</option>
              </select>
            </div>
            <div className="form-group">
              <label>Goal Title</label>
              <input className="form-input" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="e.g., Bench 225 lbs" required />
            </div>
            <div className="form-group">
              <label>Target</label>
              <input type="number" className="form-input" value={formData.target} onChange={(e) => setFormData({ ...formData, target: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>Unit</label>
              <input className="form-input" value={formData.unit} onChange={(e) => setFormData({ ...formData, unit: e.target.value })} placeholder="lbs, kg, reps..." required />
            </div>
            <div className="form-group">
              <label>Current Progress</label>
              <input type="number" className="form-input" value={formData.current} onChange={(e) => setFormData({ ...formData, current: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Deadline (optional)</label>
              <input type="date" className="form-input" value={formData.deadline} onChange={(e) => setFormData({ ...formData, deadline: e.target.value })} />
            </div>
          </div>
          <button type="submit" className="btn btn-primary">Create Goal</button>
        </form>
      )}

      {/* Goals Grid */}
      <div className="workouts-grid">
        {goals.map((goal) => {
          const progress = getProgress(goal);
          return (
            <div key={goal._id} className="workout-card" style={{ position: 'relative', overflow: 'hidden' }}>
              {/* Progress Background */}
              <div style={{ 
                position: 'absolute', 
                top: 0, 
                left: 0, 
                height: '100%', 
                width: `${progress}%`, 
                background: goal.completed ? 'rgba(72, 187, 120, 0.1)' : 'rgba(102, 126, 234, 0.1)', 
                transition: 'width 0.5s ease',
                zIndex: 0
              }}></div>

              <div style={{ position: 'relative', zIndex: 1 }}>
                <h3>{goal.completed ? '✅ ' : ''}{goal.title}</h3>
                <div className="workout-info">
                  <p>🎯 {goal.current} / {goal.target} {goal.unit}</p>
                  <p>📊 Progress: {progress.toFixed(0)}%</p>
                  {goal.deadline && <p>📅 {new Date(goal.deadline).toLocaleDateString()}</p>}
                  {goal.completed && goal.completedAt && (
                    <p style={{ color: '#48bb78', fontWeight: 'bold' }}>
                      Completed: {new Date(goal.completedAt).toLocaleDateString()}
                    </p>
                  )}
                </div>

                {!goal.completed && (
                  <div style={{ marginTop: '1rem' }}>
                    <div className="form-group">
                      <label style={{ fontSize: '0.875rem' }}>Update Progress</label>
                      <input
                        type="number"
                        className="form-input"
                        defaultValue={goal.current}
                        onBlur={(e) => updateProgress(goal._id, parseFloat(e.target.value))}
                        style={{ padding: '0.5rem' }}
                      />
                    </div>
                  </div>
                )}

                <div className="workout-actions" style={{ marginTop: '1rem' }}>
                  <button onClick={() => handleDelete(goal._id)} className="btn btn-danger">Delete</button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {goals.length === 0 && (
        <div className="empty-state">
          <h2>No Goals Set</h2>
          <p>Set goals to track your fitness progress and stay motivated!</p>
        </div>
      )}
    </div>
  );
};

export default Goals;
