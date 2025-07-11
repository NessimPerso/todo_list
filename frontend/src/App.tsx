import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthenticationPage from './pages/AuthenticationPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/auth" element={<AuthenticationPage />} />
        {/* Exemple de route protégée (à compléter plus tard) */}
        {/* <Route path="/dashboard" element={<DashboardPage />} /> */}
        <Route path="*" element={<Navigate to="/auth" />} />
      </Routes>
    </Router>
  );
}

export default App;