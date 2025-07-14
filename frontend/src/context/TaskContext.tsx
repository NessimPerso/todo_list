import React, { createContext, useContext, ReactNode } from 'react';
import { TaskContextType } from '../types/task.types';
import { useTaskManager } from '../hooks/useTaskManager';

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTaskContext must be used within TaskProvider');
  }
  return context;
};

export const TaskProvider = ({ children }: { children: ReactNode }) => {
  const taskManager = useTaskManager();
  
  return (
    <TaskContext.Provider value={taskManager}>
      {children}
    </TaskContext.Provider>
  );
};