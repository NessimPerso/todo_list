// pages/AuthenticationPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Container, 
  Paper, 
  Box, 
  Typography, 
  ToggleButton, 
  ToggleButtonGroup 
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';

export default function AuthenticationPage() {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const { user } = useAuth();
  const navigate = useNavigate();

  // Redirection automatique si déjà connecté
  useEffect(() => {
    if (user) {
      navigate('/main', { replace: true });
    }
  }, [user, navigate]);

  const handleModeChange = (
    event: React.MouseEvent<HTMLElement>,
    newMode: 'login' | 'register'
  ) => {
    if (newMode !== null) {
      setMode(newMode);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Bienvenue
          </Typography>
          
          <Typography variant="body1" align="center" color="text.secondary" sx={{ mb: 3 }}>
            {mode === 'login' 
              ? 'Connectez-vous à votre compte' 
              : 'Créez votre compte'
            }
          </Typography>
          
          {/* Toggle entre Connexion et Inscription */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
            <ToggleButtonGroup
              value={mode}
              exclusive
              onChange={handleModeChange}
              aria-label="authentication mode"
            >
              <ToggleButton value="login" aria-label="login">
                Connexion
              </ToggleButton>
              <ToggleButton value="register" aria-label="register">
                Inscription
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>
          
          {/* Formulaires */}
          {mode === 'login' ? <LoginForm /> : <RegisterForm />}
        </Paper>
      </Box>
    </Container>
  );
}
