import React, { useState, useEffect } from 'react';
import { measurementService } from '../services/api';
import { Line } from 'react-chartjs-2';

interface Measurement {
  _id: string;
  date: string;
  weight?: number;
  bodyFat?: number;
  chest?: number;
  waist?: number;
  hips?: number;
  biceps?: number;
  thighs?: number;
  notes?: string;
}

const Measurements: React.FC = () => {
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    weight: '',
    bodyFat: '',
    chest: '',
    waist: '',
    hips: '',
    biceps: '',
    thighs: '',
    notes: ''
  });

  useEffect(() => {
    fetchMeasurements();
  }, []);

  const fetchMeasurements = async () => {
    try {
      const response = await measurementService.getAll();
      setMeasurements(response.data);
    } catch (error) {
      console.error('Failed to fetch measurements:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = Object.fromEntries(
        Object.entries(formData).filter(([_, v]) => v !== '')
      );
      await measurementService.create(data);
      setShowForm(false);
      setFormData({
        date: new Date().toISOString().split('T')[0],
        weight: '', bodyFat: '', chest: '', waist: '', hips: '', biceps: '', thighs: '', notes: ''
      });
      fetchMeasurements();
    } catch (error) {
      console.error('Failed to create measurement:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Delete this measurement?')) {
      try {
        await measurementService.delete(id);
        fetchMeasurements();
      } catch (error) {
        console.error('Failed to delete measurement:', error);
      }
    }
  };

  // Weight chart data
  const weightData = {
    labels: measurements.map(m => new Date(m.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })).reverse(),
    datasets: [{
      label: 'Weight (lbs/kg)',
      data: measurements.map(m => m.weight).reverse(),
      borderColor: 'rgba(102, 126, 234, 1)',
      backgroundColor: 'rgba(102, 126, 234, 0.1)',
      tension: 0.4,
      fill: true
    }]
  };

  return (
    <div className="workouts-container">
      <div className="workouts-header">
        <h1>📏 Body Measurements</h1>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="btn btn-primary"
          style={{ width: 'auto', padding: '0.75rem 2rem' }}
        >
          {showForm ? '✕ Cancel' : '+ Add Measurement'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="workout-form">
          <h2>New Measurement</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div className="form-group">
              <label>Date</label>
              <input type="date" className="form-input" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>Weight</label>
              <input type="number" step="0.1" className="form-input" value={formData.weight} onChange={(e) => setFormData({ ...formData, weight: e.target.value })} placeholder="lbs or kg" />
            </div>
            <div className="form-group">
              <label>Body Fat %</label>
              <input type="number" step="0.1" className="form-input" value={formData.bodyFat} onChange={(e) => setFormData({ ...formData, bodyFat: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Chest (in/cm)</label>
              <input type="number" step="0.1" className="form-input" value={formData.chest} onChange={(e) => setFormData({ ...formData, chest: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Waist (in/cm)</label>
              <input type="number" step="0.1" className="form-input" value={formData.waist} onChange={(e) => setFormData({ ...formData, waist: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Hips (in/cm)</label>
              <input type="number" step="0.1" className="form-input" value={formData.hips} onChange={(e) => setFormData({ ...formData, hips: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Biceps (in/cm)</label>
              <input type="number" step="0.1" className="form-input" value={formData.biceps} onChange={(e) => setFormData({ ...formData, biceps: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Thighs (in/cm)</label>
              <input type="number" step="0.1" className="form-input" value={formData.thighs} onChange={(e) => setFormData({ ...formData, thighs: e.target.value })} />
            </div>
          </div>
          <div className="form-group">
            <label>Notes</label>
            <textarea className="form-input" value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} rows={2} />
          </div>
          <button type="submit" className="btn btn-primary">Save Measurement</button>
        </form>
      )}

      {/* Weight Chart */}
      {measurements.some(m => m.weight) && (
        <div className="workout-form" style={{ marginBottom: '2rem' }}>
          <h2>Weight Progress</h2>
          <Line data={weightData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
        </div>
      )}

      {/* Measurements List */}
      <div className="workouts-grid">
        {measurements.map((m) => (
          <div key={m._id} className="workout-card">
            <h3>{new Date(m.date).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}</h3>
            <div className="workout-info">
              {m.weight && <p>⚖️ Weight: {m.weight}</p>}
              {m.bodyFat && <p>📊 Body Fat: {m.bodyFat}%</p>}
              {m.chest && <p>💪 Chest: {m.chest}</p>}
              {m.waist && <p>📐 Waist: {m.waist}</p>}
              {m.notes && <p>📝 {m.notes}</p>}
            </div>
            <button onClick={() => handleDelete(m._id)} className="btn btn-danger">Delete</button>
          </div>
        ))}
      </div>

      {measurements.length === 0 && (
        <div className="empty-state">
          <h2>No Measurements Yet</h2>
          <p>Track your body measurements to monitor progress!</p>
        </div>
      )}
    </div>
  );
};

export default Measurements;
