import React, { useState } from 'react';
import {
  TextField,
  Button,
  Stack,
  Typography,
  Box,
} from '@mui/material';
import { useTaskContext } from '../context/TaskContext';

interface Props {
  onCancel: () => void;
  onSuccess: () => void;
}

export default function NewTaskForm({ onCancel, onSuccess }: Props) {
  const [shortDescription, setShortDescription] = useState('');
  const [longDescription, setLongDescription] = useState('');
  const [dueDate, setDueDate] = useState('');

  const { createTask } = useTaskContext();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!shortDescription || !dueDate) return;

    try {
      const success = await createTask({
        shortDescription,
        longDescription,
        dueDate
      });

      if (success) {
        // Réinitialiser le formulaire
        setShortDescription('');
        setLongDescription('');
        setDueDate('');

        // Appeler onSuccess pour fermer le formulaire
        onSuccess();
      }
    } catch (error) {
      console.error('Erreur lors de la création de la tâche:', error);
    }
  };

  const handleCancel = () => {
    // Réinitialiser le formulaire
    setShortDescription('');
    setLongDescription('');
    setDueDate('');
    
    // Appeler onCancel pour fermer le formulaire
    onCancel();
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack spacing={2} sx={{ mb: 4 }}>
        <Typography variant="h6">Créer une nouvelle tâche</Typography>
        <TextField
          label="Description courte"
          value={shortDescription}
          onChange={(e) => setShortDescription(e.target.value)}
          required
        />
        <TextField
          label="Description longue"
          value={longDescription}
          onChange={(e) => setLongDescription(e.target.value)}
          multiline
          rows={2}
        />
        <TextField
          type="date"
          label="Date d'échéance"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          required
        />
        
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
          <Button 
            variant="outlined" 
            onClick={handleCancel}
            color="secondary"
          >
            Annuler
          </Button>
          <Button 
            type="submit" 
            variant="contained" 
            color="primary"
            disabled={!shortDescription || !dueDate}
          >
            Ajouter la tâche
          </Button>
        </Box>
      </Stack>
    </form>
  );
}