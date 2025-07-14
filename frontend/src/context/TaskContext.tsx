// src/context/TaskContext.tsx
import React, { createContext, useContext, ReactNode } from 'react';
import { TaskContextType } from '../types/task.types';
import { useTaskManager } from '../hooks/useTaskManager';

// Créer un type compatible avec toutes les modifications
type CompatibleTaskContextType = Omit<TaskContextType, 
  'createList' | 'createTask' | 'deleteList' | 'toggleTaskCompletion' | 'deleteTask' | 'handleDeleteConfirm'
> & {
  createList: (name: string) => Promise<boolean>;
  createTask: (task: {
    shortDescription: string;
    longDescription: string;
    dueDate: string;
  }) => Promise<boolean>;
  deleteList: (id: string | number) => Promise<void>;
  toggleTaskCompletion: (taskId: string | number) => Promise<void>;
  deleteTask: (taskId: string | number) => Promise<void>;
  handleDeleteConfirm: () => Promise<void>;
};

const TaskContext = createContext<CompatibleTaskContextType | undefined>(undefined);

export const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTaskContext must be used within TaskProvider');
  }
  return context;
};

interface TaskProviderProps {
  children: ReactNode;
}

export const TaskProvider: React.FC<TaskProviderProps> = ({ children }) => {
  const taskManager = useTaskManager();
  
  // Créer un objet compatible avec toutes les fonctions asynchrones
  const compatibleTaskManager: CompatibleTaskContextType = {
    ...taskManager,
    createList: taskManager.createList,
    createTask: taskManager.createTask,
    deleteList: async (id) => {
      await taskManager.deleteList(id);
    },
    toggleTaskCompletion: async (taskId) => {
      await taskManager.toggleTaskCompletion(taskId);
    },
    deleteTask: async (taskId) => {
      await taskManager.deleteTask(taskId);
    },
    handleDeleteConfirm: async () => {
      await taskManager.handleDeleteConfirm();
    }
  };
  
  return (
    <TaskContext.Provider value={compatibleTaskManager}>
      {children}
    </TaskContext.Provider>
  );
};