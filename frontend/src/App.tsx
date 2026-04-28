import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SpeedInsights } from '@vercel/speed-insights/react';
import Home from './pages/Home';
import './styles/App.css';

const AdminPanel = lazy(() => import('./pages/AdminPanel'));

const App: React.FC = () => {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Suspense fallback={<div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '1.25rem' }}>Betöltés...</div>}>
        <Routes>
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </Suspense>
      <SpeedInsights />
    </Router>
  );
};

export default App;
