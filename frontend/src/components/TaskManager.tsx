import React from 'react';
import { useTaskContext } from '../context/TaskContext';
import { LeftSidebar } from './layout/LeftSidebar';
import { MainContent } from './layout/MainContent';
import { RightSidebar } from './layout/RightSidebar';
import { DeleteModal } from './common/Modal/DeleteModal';
import { Box } from '@mui/material';

export const TaskManager: React.FC = () => {
  const { 
    showDeleteModal, 
    deleteModalData, 
    handleDeleteConfirm, 
    handleDeleteCancel 
  } = useTaskContext();

  return (
    <Box sx={{ 
      display: 'flex', 
      flex: 1,
      overflow: 'hidden'
    }}>
      {/* Left Sidebar */}
      <LeftSidebar />
      
      {/* Main Content */}
      <MainContent />
      
      {/* Right Sidebar - conditionnelle */}
      {useTaskContext().selectedTask && <RightSidebar />}
      
      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={showDeleteModal}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title={deleteModalData.title}
        message={deleteModalData.message}
      />
    </Box>
  );
};