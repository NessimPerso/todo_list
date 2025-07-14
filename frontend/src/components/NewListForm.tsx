import React, { useState } from 'react';
import { Box, TextField, Button, Stack } from '@mui/material';

interface Props {
  onSuccess: (name: string) => void;
  onCancel: () => void;
}

export default function NewListForm({ onSuccess, onCancel }: Props) {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (trimmed) {
      onSuccess(trimmed);
      setName('');
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mb: 2 }}>
      <Stack spacing={1}>
        <TextField
          label="Nom de la liste"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
          required
        />
        <Stack direction="row" spacing={1}>
          <Button variant="contained" type="submit">Créer</Button>
          <Button variant="outlined" onClick={onCancel}>Annuler</Button>
        </Stack>
      </Stack>
    </Box>
  );
}
