import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Workouts from './pages/Workouts';

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? <>{children}</> : <Navigate to="/login" />;
};

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/workouts"
          element={
            <PrivateRoute>
              <Workouts />
            </PrivateRoute>
          }
        />
        <Route path="/" element={<Navigate to="/workouts" />} />
      </Routes>
    </Router>
  );
};

export default App;
