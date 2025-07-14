import React from 'react';
import { Card, CardContent, Typography, IconButton, Box } from '@mui/material';
import { CheckCircle, RotateCcw } from 'lucide-react';
import { Task } from '../types/task.types';

interface Props {
  task: Task;
  isSelected: boolean;  
  onSelect: () => void;
  onToggleComplete: (taskId: string | number) => void;
  isCompleted?: boolean; 
}

export default function TaskCard({ 
  task, 
  isSelected, 
  onSelect, 
  onToggleComplete, 
  isCompleted = false 
}: Props) {
  return (
    <Card 
      variant="outlined" 
      onClick={onSelect} 
      sx={{ 
        mb: 2, 
        backgroundColor: task.completed ? '#f0f0f0' : '#fff',
        border: isSelected ? '2px solid #1976d2' : '1px solid #e0e0e0',  // 
        cursor: 'pointer',  
        '&:hover': {
          backgroundColor: isSelected ? '#e3f2fd' : '#f5f5f5'  // 
        }
      }}
    >
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography 
              variant="subtitle1" 
              fontWeight="bold"
              sx={{ 
                textDecoration: task.completed ? 'line-through' : 'none',
                color: task.completed ? '#666' : 'inherit'
              }}
            >
              {task.shortDescription}
            </Typography>
            {task.longDescription && (
              <Typography 
                variant="body2" 
                color="text.secondary"
                sx={{ 
                  textDecoration: task.completed ? 'line-through' : 'none'
                }}
              >
                {task.longDescription}
              </Typography>
            )}
            <Typography variant="caption" color="text.secondary">
              À faire avant le : {new Date(task.dueDate).toLocaleDateString()}
            </Typography>
          </Box>
          <IconButton 
            onClick={(e) => {
              e.stopPropagation();  // Pour Empêcher la sélection lors du clic sur le bouton
              onToggleComplete(task.id);
            }} 
            color="primary"
          >
            {task.completed ? <RotateCcw /> : <CheckCircle />}
          </IconButton>
        </Box>
      </CardContent>
    </Card>
  );
}