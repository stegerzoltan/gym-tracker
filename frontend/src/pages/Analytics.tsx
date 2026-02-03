import React, { useState, useEffect } from 'react';
import { analyticsService } from '../services/api';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend, ArcElement);

const Analytics: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await analyticsService.getStats();
      setStats(response.data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading analytics...</div>;

  const monthlyData = stats?.workoutsByMonth || {};
  const chartData = {
    labels: Object.keys(monthlyData),
    datasets: [
      {
        label: 'Workouts per Month',
        data: Object.values(monthlyData),
        backgroundColor: 'rgba(102, 126, 234, 0.6)',
        borderColor: 'rgba(102, 126, 234, 1)',
        borderWidth: 2
      }
    ]
  };

  return (
    <div className="workouts-container">
      <div className="workouts-header">
        <h1>📊 Analytics Dashboard</h1>
      </div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="workout-card">
          <h3 style={{ fontSize: '1rem', color: '#718096', marginBottom: '0.5rem' }}>Total Workouts</h3>
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#667eea' }}>{stats?.totalWorkouts || 0}</div>
        </div>

        <div className="workout-card">
          <h3 style={{ fontSize: '1rem', color: '#718096', marginBottom: '0.5rem' }}>Total Hours</h3>
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#764ba2' }}>
            {stats?.totalDuration ? Math.round(stats.totalDuration / 60) : 0}
          </div>
        </div>

        <div className="workout-card">
          <h3 style={{ fontSize: '1rem', color: '#718096', marginBottom: '0.5rem' }}>Avg Duration</h3>
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#667eea' }}>
            {stats?.averageDuration || 0} <span style={{ fontSize: '1rem' }}>min</span>
          </div>
        </div>

        <div className="workout-card">
          <h3 style={{ fontSize: '1rem', color: '#718096', marginBottom: '0.5rem' }}>Current Streak</h3>
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#764ba2' }}>
            {stats?.currentStreak || 0} 🔥
          </div>
        </div>
      </div>

      {/* Charts */}
      {Object.keys(monthlyData).length > 0 && (
        <div className="workout-form">
          <h2>Workout Frequency</h2>
          <Bar data={chartData} options={{
            responsive: true,
            plugins: {
              legend: {
                display: false
              }
            },
            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  stepSize: 1
                }
              }
            }
          }} />
        </div>
      )}

      {stats?.totalWorkouts === 0 && (
        <div className="empty-state">
          <h2>No Data Yet</h2>
          <p>Start logging workouts to see your progress!</p>
        </div>
      )}
    </div>
  );
};

export default Analytics;
