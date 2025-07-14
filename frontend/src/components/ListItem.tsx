import React from 'react';
import { ListItemButton, ListItemText, IconButton, Box } from '@mui/material';
import { Trash2 } from 'lucide-react';
import { TaskList } from '../types/task.types';

interface Props {
  list: TaskList;
  isSelected: boolean;
  isOpen: boolean;
  onSelect: () => void;
  onDelete: () => void;
}

export default function ListItem({ list, isSelected, onSelect, onDelete }: Props) {
  return (
    <Box display="flex" alignItems="center" justifyContent="space-between">
      <ListItemButton
        selected={isSelected}
        onClick={onSelect}
        sx={{ flexGrow: 1 }}
      >
        <ListItemText primary={list.name} />
      </ListItemButton>
      <IconButton onClick={onDelete} edge="end" size="small" color="error">
        <Trash2 size={18} />
      </IconButton>
    </Box>
  );
}
