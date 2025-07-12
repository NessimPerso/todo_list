import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider,createTheme  } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';

// Pages
import AuthenticationPage from './pages/AuthenticationPage';
import MainPage from './pages/MainPage';

const theme = createTheme(); // theme par défaut de Material-UI

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Routes>
            {/* Page d'authentification (par défaut pour les non connectés) */}
            <Route path="/auth" element={<AuthenticationPage />} />
            
            {/* Page principale (protégée) */}
            <Route 
              path="/main" 
              element={
                <ProtectedRoute>
                  {<MainPage></MainPage>/* Remplacez ceci par votre composant de dashboard */}
                </ProtectedRoute>
              } 
            />
            
            {/* Redirection par défaut */}
            <Route path="/" element={<Navigate to="/auth" replace />} />
            <Route path="*" element={<Navigate to="/auth" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}
export default App;