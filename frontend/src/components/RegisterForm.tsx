import React, { useState, ChangeEvent, FormEvent } from 'react';
import {
  TextField,
  Button,
  Box,
  Typography,
  Alert,
  CircularProgress,
  Paper
} from '@mui/material';
import api from '../services/api';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

const RegisterForm: React.FC = () => {
  const [form, setForm] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });
  const [message, setMessage] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      await api.post('/auth/register', form);
      setMessage('Inscription réussie ! Vous pouvez vous connecter.');
      setForm({ firstName: '', lastName: '', email: '', password: '' });
    } catch (err: any) {
      console.error('Erreur lors de l\'inscription:', err);
      setError(err.message || 'Erreur lors de l\'inscription');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 500, mx: 'auto' }}>
      <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>

        {message && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {message}
          </Alert>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <TextField
          fullWidth
          name="firstName"
          label="Prénom"
          value={form.firstName}
          onChange={handleChange}
          margin="normal"
          required
          disabled={loading}
        />

        <TextField
          fullWidth
          name="lastName"
          label="Nom"
          value={form.lastName}
          onChange={handleChange}
          margin="normal"
          required
          disabled={loading}
        />

        <TextField
          fullWidth
          type="email"
          name="email"
          label="Email"
          value={form.email}
          onChange={handleChange}
          margin="normal"
          required
          disabled={loading}
        />

        <TextField
          fullWidth
          type="password"
          name="password"
          label="Mot de passe"
          value={form.password}
          onChange={handleChange}
          margin="normal"
          required
          disabled={loading}
        />

        <Button 
          type="submit" 
          fullWidth 
          variant="contained" 
          sx={{ mt: 3, mb: 2 }}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : "S'inscrire"}
        </Button>
      </Box>
    </Paper>
  );
};

export default RegisterForm;