import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Admin from './pages/Admin';
import Workouts from './pages/Workouts';
import Exercises from './pages/Exercises';
import Measurements from './pages/Measurements';
import Goals from './pages/Goals';
import Analytics from './pages/Analytics';
import Navbar from './components/Navbar';
import './styles/App.css';

const App: React.FC = () => {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <Routes>
          <Route path="/admin" element={<Admin />} />
          <Route path="/workouts" element={<Workouts />} />
          <Route path="/exercises" element={<Exercises />} />
          <Route path="/measurements" element={<Measurements />} />
          <Route path="/goals" element={<Goals />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/" element={<Navigate to="/workouts" />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
