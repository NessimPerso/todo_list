import React from 'react';
import { 
  Box, 
  Typography, 
  IconButton, 
  Divider, 
  Paper, 
  Chip,
  Stack,
  Button
} from '@mui/material';
import { 
  Close as CloseIcon,
  CalendarToday as CalendarIcon,
  Schedule as ClockIcon,
  Delete as TrashIcon
} from '@mui/icons-material';
import { useTaskContext } from '../../context/TaskContext';
import { formatDate } from '../../utils/helpers';

export const RightSidebar: React.FC = () => {
  const { selectedTask, deselectTask, confirmDeleteTask } = useTaskContext();

  if (!selectedTask) return null;

  const handleDelete = () => confirmDeleteTask(selectedTask);

  return (
    <Box sx={{ 
      width: 320, 
      bgcolor: 'background.paper', 
      boxShadow: 3,
      height: '100%',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <Box sx={{ p: 3 }}>
        {/* Header */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          mb: 3
        }}>
          <Typography variant="h6" fontWeight="bold">
            Détails de la tâche
          </Typography>
          <IconButton onClick={deselectTask}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Task Details */}
        <Stack spacing={3}>
          {/* Description courte */}
          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Description courte
            </Typography>
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Typography>{selectedTask.shortDescription}</Typography>
            </Paper>
          </Box>

          {/* Description longue */}
          {selectedTask.longDescription && (
            <Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Description longue
              </Typography>
              <Paper variant="outlined" sx={{ p: 2, whiteSpace: 'pre-wrap' }}>
                <Typography>{selectedTask.longDescription}</Typography>
              </Paper>
            </Box>
          )}

          {/* Dates */}
          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Dates
            </Typography>
            <Stack direction="row" spacing={2}>
              <Paper variant="outlined" sx={{ p: 2, flex: 1 }}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <CalendarIcon fontSize="small" color="action" />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Échéance
                    </Typography>
                    <Typography>{formatDate(selectedTask.dueDate)}</Typography>
                  </Box>
                </Stack>
              </Paper>
              
              <Paper variant="outlined" sx={{ p: 2, flex: 1 }}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <ClockIcon fontSize="small" color="action" />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Création
                    </Typography>
                    <Typography>{formatDate(selectedTask.createdAt)}</Typography>
                  </Box>
                </Stack>
              </Paper>
            </Stack>
          </Box>

          {/* Statut */}
          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Statut
            </Typography>
            <Chip 
              label={selectedTask.completed ? 'Terminée' : 'En cours'} 
              color={selectedTask.completed ? 'success' : 'warning'}
              variant="outlined"
            />
          </Box>
        </Stack>
      </Box>
      
      {/* Actions */}
      <Box sx={{ p: 2, mt: 'auto' }}>
        <Button
          fullWidth
          variant="contained"
          color="error"
          startIcon={<TrashIcon />}
          onClick={handleDelete}
        >
          Supprimer la tâche
        </Button>
      </Box>
    </Box>
  );
};