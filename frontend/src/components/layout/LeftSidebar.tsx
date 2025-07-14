import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  IconButton, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText, 
  Divider,
  Avatar,
  Button,
  Collapse
} from '@mui/material';
import { 
  Add as PlusIcon, 
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Person as UserIcon,
  Settings as SettingsIcon,
  Logout as LogOutIcon,
  Folder as FolderIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { useTaskContext } from '../../context/TaskContext';
import NewListForm from '../NewListForm';
import { useAuth } from '../../context/AuthContext';

export const LeftSidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [showNewListForm, setShowNewListForm] = useState(false);
  const { user } = useAuth();
  const { lists, selectedList, selectList, confirmDeleteList } = useTaskContext();

  const toggleSidebar = () => setIsOpen(!isOpen);
  const handleNewListClick = () => setShowNewListForm(true);
  const handleNewListCancel = () => setShowNewListForm(false);
  const handleNewListSuccess = () => setShowNewListForm(false);

  return (
    <Box sx={{
      width: isOpen ? 280 : 64,
      bgcolor: 'grey.900',
      color: 'common.white',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      transition: 'width 0.3s ease',
    }}>
      {/* Header */}
      <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'grey.700' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', display: isOpen ? 'block' : 'none' }}>
            Mes Listes
          </Typography>
          <IconButton onClick={toggleSidebar} sx={{ color: 'inherit' }}>
            {isOpen ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </Box>
      </Box>

      {/* User Info */}
      <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'grey.700' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar sx={{ bgcolor: 'primary.main' }}>
            <UserIcon />
          </Avatar>
          {isOpen && (
            <Box>
              <Typography variant="body1" fontWeight="medium">
                {user?.firstName} {user?.lastName}
              </Typography>
              <Typography variant="body2" color="grey.400">
                {user?.email}
              </Typography>
            </Box>
          )}
        </Box>
      </Box>

      {/* Lists Section */}
      <Box sx={{ flex: 1, overflowY: 'auto', p: 2 }}>
        {/* New List Button */}
        <Box sx={{ mb: 2 }}>
          {isOpen ? (
            <Button
              fullWidth
              variant="contained"
              startIcon={<PlusIcon />}
              onClick={handleNewListClick}
              sx={{ justifyContent: 'flex-start' }}
            >
              Nouvelle Liste
            </Button>
          ) : (
            <IconButton onClick={handleNewListClick} sx={{ color: 'inherit' }}>
              <PlusIcon />
            </IconButton>
          )}
        </Box>

        {/* New List Form */}
        <Collapse in={showNewListForm && isOpen}>
          <NewListForm 
            onCancel={handleNewListCancel}
            onSuccess={handleNewListSuccess}
          />
        </Collapse>

        {/* Lists */}
        <List>
          {lists.map(list => (
            <ListItem 
              key={list.id} 
              disablePadding
              secondaryAction={
                isOpen && (
                  <IconButton 
                    edge="end" 
                    onClick={() => confirmDeleteList(list)}
                    sx={{ color: 'grey.400' }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                )
              }
            >
              <ListItemButton
                selected={selectedList?.id === list.id}
                onClick={() => selectList(list)}
                sx={{
                  borderRadius: 1,
                  '&.Mui-selected': { bgcolor: 'primary.dark' },
                  '&.Mui-selected:hover': { bgcolor: 'primary.dark' }
                }}
              >
                <ListItemIcon sx={{ minWidth: '40px', color: 'inherit' }}>
                  <FolderIcon />
                </ListItemIcon>
                {isOpen && (
                  <ListItemText 
                    primary={list.name} 
                    primaryTypographyProps={{ noWrap: true }}
                  />
                )}
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>

      {/* Footer */}
      <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'grey.700' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton sx={{ color: 'inherit' }}>
            <SettingsIcon />
          </IconButton>
          {isOpen && (
            <Button 
              startIcon={<LogOutIcon />}
              sx={{ color: 'inherit', justifyContent: 'flex-start' }}
              fullWidth
            >
              Déconnexion
            </Button>
          )}
        </Box>
      </Box>
    </Box>
  );
};