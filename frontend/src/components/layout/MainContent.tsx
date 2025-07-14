import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemText, 
  ListItemSecondaryAction,
  Checkbox,
  Divider,
  IconButton,
  Paper
} from '@mui/material';
import { 
  Add as PlusIcon, 
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Description as FileTextIcon
} from '@mui/icons-material';
import { useTaskContext } from '../../context/TaskContext';
import TaskCard from '../TaskCard';
import NewTaskForm from '../NewTaskForm';

export const MainContent: React.FC = () => {
  const [showNewTaskForm, setShowNewTaskForm] = useState(false);
  const { 
    selectedList, 
    selectedTask, 
    activeTasks, 
    completedTasks, 
    showCompletedTasks, 
    setShowCompletedTasks,
    selectTask,
    toggleTaskCompletion 
  } = useTaskContext();

  const handleNewTaskClick = () => setShowNewTaskForm(true);
  const handleNewTaskCancel = () => setShowNewTaskForm(false);
  const handleNewTaskSuccess = () => setShowNewTaskForm(false);
  const toggleCompletedTasks = () => setShowCompletedTasks(!showCompletedTasks);

  if (!selectedList) {
    return (
      <Box sx={{ 
        flex: 1, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        p: 3,
        bgcolor: 'grey.50'
      }}>
        <Paper sx={{ p: 4, textAlign: 'center', maxWidth: 400 }}>
          <Box sx={{ 
            width: 96, 
            height: 96, 
            bgcolor: 'grey.300', 
            borderRadius: '50%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            mx: 'auto',
            mb: 3
          }}>
            <FileTextIcon sx={{ fontSize: 48, color: 'grey.500' }} />
          </Box>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            Sélectionnez une liste
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Choisissez une liste dans la barre latérale pour afficher vos tâches
          </Typography>
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      flex: 1, 
      p: 3, 
      bgcolor: 'grey.50',
      overflowY: 'auto',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Header */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        mb: 3 
      }}>
        <Typography variant="h4" fontWeight="bold">
          {selectedList.name}
        </Typography>
        <Button
          variant="contained"
          startIcon={<PlusIcon />}
          onClick={handleNewTaskClick}
        >
          Nouvelle Tâche
        </Button>
      </Box>

      {/* New Task Form */}
      {showNewTaskForm && (
        <NewTaskForm 
          onCancel={handleNewTaskCancel}
          onSuccess={handleNewTaskSuccess}
        />
      )}

      {/* Active Tasks Section */}
      <Paper sx={{ mb: 3, p: 2 }}>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          Tâches à réaliser ({activeTasks.length})
        </Typography>
        
        {activeTasks.length === 0 ? (
          <Box sx={{ 
            textAlign: 'center', 
            py: 4,
            bgcolor: 'action.hover',
            borderRadius: 1
          }}>
            <Typography variant="body1" color="text.secondary" gutterBottom>
              Aucune tâche active. Créez votre première tâche !
            </Typography>
            {!showNewTaskForm && (
              <Button
                variant="contained"
                startIcon={<PlusIcon />}
                onClick={handleNewTaskClick}
              >
                Créer une tâche
              </Button>
            )}
          </Box>
        ) : (
          <List>
            {activeTasks.map(task => (
              <TaskCard
                key={task.id}
                task={task}
                isSelected={selectedTask?.id === task.id}
                onSelect={() => selectTask(task)}
                onToggleComplete={() => toggleTaskCompletion(task.id)}
                isCompleted={false}
              />
            ))}
          </List>
        )}
      </Paper>

      {/* Completed Tasks Section */}
      <Paper sx={{ p: 2 }}>
        <Button
          fullWidth
          onClick={toggleCompletedTasks}
          startIcon={showCompletedTasks ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          sx={{ 
            justifyContent: 'flex-start', 
            textTransform: 'none',
            fontWeight: 'bold',
            color: 'text.primary'
          }}
        >
          Mes tâches terminées ({completedTasks.length})
        </Button>
        
        {showCompletedTasks && (
          <Box sx={{ mt: 2 }}>
            {completedTasks.length === 0 ? (
              <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                Aucune tâche terminée
              </Typography>
            ) : (
              <List>
                {completedTasks.map(task => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    isSelected={selectedTask?.id === task.id}
                    onSelect={() => selectTask(task)}
                    onToggleComplete={() => toggleTaskCompletion(task.id)}
                    isCompleted={true}
                  />
                ))}
              </List>
            )}
          </Box>
        )}
      </Paper>
    </Box>
  );
};