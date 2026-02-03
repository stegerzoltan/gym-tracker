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
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    exercises: [],
    duration: 0,
    notes: ''
  });

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
      await workoutService.create(formData);
      setFormData({ name: '', date: '', exercises: [], duration: 0, notes: '' });
      setShowForm(false);
      fetchWorkouts();
    } catch (error) {
      console.error('Failed to create workout:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure?')) {
      try {
        await workoutService.delete(id);
        fetchWorkouts();
      } catch (error) {
        console.error('Failed to delete workout:', error);
      }
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div style={{ padding: '20px' }}>
      <h1>My Workouts</h1>
      <button onClick={() => setShowForm(!showForm)}>
        {showForm ? 'Cancel' : 'Add Workout'}
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} style={{ marginTop: '20px', padding: '20px', border: '1px solid #ccc' }}>
          <div>
            <label>Workout Name: </label>
            <input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div>
            <label>Date: </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
            />
          </div>
          <div>
            <label>Duration (minutes): </label>
            <input
              type="number"
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
            />
          </div>
          <div>
            <label>Notes: </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
          </div>
          <button type="submit">Create Workout</button>
        </form>
      )}

      <div style={{ marginTop: '20px' }}>
        {workouts.length === 0 ? (
          <p>No workouts yet. Create your first one!</p>
        ) : (
          workouts.map((workout) => (
            <div key={workout._id} style={{ padding: '15px', border: '1px solid #ddd', marginBottom: '10px' }}>
              <h3>{workout.name}</h3>
              <p>Date: {new Date(workout.date).toLocaleDateString()}</p>
              <p>Duration: {workout.duration} minutes</p>
              <p>Exercises: {workout.exercises.length}</p>
              <button onClick={() => handleDelete(workout._id)}>Delete</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Workouts;
