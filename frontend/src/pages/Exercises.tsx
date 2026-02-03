import React, { useState, useEffect } from 'react';
import { exerciseService } from '../services/api';

interface Exercise {
  _id: string;
  name: string;
  category: string;
  muscleGroup: string[];
  equipment: string;
  description: string;
  difficulty: string;
  isCustom: boolean;
}

const Exercises: React.FC = () => {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [filteredExercises, setFilteredExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [muscleFilter, setMuscleFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  const muscleGroups = ['chest', 'back', 'shoulders', 'biceps', 'triceps', 'legs', 'glutes', 'abs', 'cardio', 'full body'];
  const categories = ['strength', 'cardio', 'flexibility', 'powerlifting', 'olympic'];

  useEffect(() => {
    fetchExercises();
  }, []);

  useEffect(() => {
    filterExercises();
  }, [searchTerm, muscleFilter, categoryFilter, exercises]);

  const fetchExercises = async () => {
    try {
      const response = await exerciseService.getAll();
      setExercises(response.data);
      setFilteredExercises(response.data);
    } catch (error) {
      console.error('Failed to fetch exercises:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterExercises = () => {
    let filtered = exercises;

    if (searchTerm) {
      filtered = filtered.filter(ex => 
        ex.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (muscleFilter) {
      filtered = filtered.filter(ex => 
        ex.muscleGroup.includes(muscleFilter)
      );
    }

    if (categoryFilter) {
      filtered = filtered.filter(ex => ex.category === categoryFilter);
    }

    setFilteredExercises(filtered);
  };

  const seedExercises = async () => {
    try {
      await exerciseService.seed();
      fetchExercises();
    } catch (error) {
      console.error('Failed to seed exercises:', error);
    }
  };

  if (loading) return <div className="loading">Loading exercises...</div>;

  return (
    <div className="workouts-container">
      <div className="workouts-header">
        <h1>🏋️ Exercise Library</h1>
        <button 
          onClick={seedExercises}
          className="btn btn-secondary"
          style={{ width: 'auto', padding: '0.75rem 2rem' }}
        >
          Load Default Exercises
        </button>
      </div>

      {/* Filters */}
      <div className="workout-form" style={{ marginBottom: '2rem' }}>
        <h2>Search & Filter</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
          <div className="form-group">
            <label>Search</label>
            <input
              type="text"
              className="form-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search exercises..."
            />
          </div>

          <div className="form-group">
            <label>Muscle Group</label>
            <select
              className="form-input"
              value={muscleFilter}
              onChange={(e) => setMuscleFilter(e.target.value)}
            >
              <option value="">All Muscles</option>
              {muscleGroups.map(muscle => (
                <option key={muscle} value={muscle}>{muscle}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Category</label>
            <select
              className="form-input"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Exercise Grid */}
      <div className="workouts-grid">
        {filteredExercises.map((exercise) => (
          <div key={exercise._id} className="workout-card">
            <h3>{exercise.name}</h3>
            <div className="workout-info">
              <p>💪 {exercise.muscleGroup.join(', ')}</p>
              <p>🏷️ {exercise.category}</p>
              <p>🔧 {exercise.equipment}</p>
              <p>📊 {exercise.difficulty}</p>
              {exercise.description && <p style={{ marginTop: '0.5rem', color: '#4a5568' }}>{exercise.description}</p>}
            </div>
            {exercise.isCustom && (
              <span className="badge" style={{ marginTop: '1rem' }}>Custom</span>
            )}
          </div>
        ))}
      </div>

      {filteredExercises.length === 0 && (
        <div className="empty-state">
          <h2>No exercises found</h2>
          <p>Try adjusting your filters or load the default exercises</p>
        </div>
      )}
    </div>
  );
};

export default Exercises;
