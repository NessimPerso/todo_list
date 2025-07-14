import { useState, useCallback, useEffect, useMemo } from 'react';
import { Task, TaskList } from '../types/task.types';
import api from '../services/api';

export const useTaskManager = () => {
  const [lists, setLists] = useState<TaskList[]>([]);
  const [selectedList, setSelectedList] = useState<TaskList | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showCompletedTasks, setShowCompletedTasks] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteModalData, setDeleteModalData] = useState<{
    type: 'list' | 'task';
    item: TaskList | Task | null;
    title: string;
    message: string;
  }>({
    type: 'list',
    item: null,
    title: '',
    message: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Charger les listes au démarrage
  useEffect(() => {
    const loadLists = async () => {
      setIsLoading(true);
      try {
        const response = await api.get('/tasklists');
        const safeLists = response.data.map((list: any) => ({
          ...list,
          tasks: Array.isArray(list.tasks) ? list.tasks : []
        }));
        setLists(safeLists);
      } catch (err) {
        setError('Failed to load lists');
        console.error('Error loading lists:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadLists();
  }, []);

  // Créer une nouvelle liste
  const createList = useCallback(async (name: string) => {
    const trimmedName = name.trim();
    if (!trimmedName) return false;

    setIsLoading(true);
    try {
      const response = await api.post('/tasklists', { name: trimmedName });
      const newList = {
        ...response.data,
        tasks: Array.isArray(response.data.tasks) ? response.data.tasks : []
      };
      
      setLists(prev => [...prev, newList]);
      return true;
    } catch (err) {
      setError('Failed to create list');
      console.error('Error creating list:', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Supprimer une liste
  const deleteList = useCallback(async (listId: string | number) => {
    setIsLoading(true);
    try {
      await api.delete(`/tasklists/${listId}`);
      
      setLists(prev => prev.filter(list => list.id !== listId));
      
      if (selectedList?.id === listId) {
        setSelectedList(null);
        setSelectedTask(null);
      }
      
      return true;
    } catch (err) {
      setError('Failed to delete list');
      console.error('Error deleting list:', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [selectedList]);

  // Créer une tâche
  const createTask = useCallback(async (taskData: {
    shortDescription: string;
    longDescription: string;
    dueDate: string;
  }) => {
    if (!selectedList?.id || !taskData.shortDescription.trim() || !taskData.dueDate) {
      return false;
    }

    setIsLoading(true);
    try {
      const payload = {
        ...taskData,
        dueDate: new Date(taskData.dueDate).toISOString(),
        taskListId: String(selectedList.id)
      };

      const response = await api.post('/tasks', payload);
      const newTask = response.data;

      const updatedLists = lists.map(list => 
        list.id === selectedList.id
          ? { 
              ...list, 
              tasks: Array.isArray(list.tasks) 
                ? [...list.tasks, newTask] 
                : [newTask] 
            }
          : list
      );

      setLists(updatedLists);
      setSelectedList(updatedLists.find(l => l.id === selectedList.id) || null);
      return true;
    } catch (err) {
      setError('Failed to create task');
      console.error('Error creating task:', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [selectedList, lists]);

  // Basculer l'état d'une tâche
  const toggleTaskCompletion = useCallback(async (taskId: string | number) => {
    if (!selectedList?.id) return;

    setIsLoading(true);
    try {
      await api.patch(`/tasks/${taskId}/toggle-completed`);
      
      const updatedLists = lists.map(list => {
        if (list.id === selectedList.id) {
          return {
            ...list,
            tasks: (Array.isArray(list.tasks) ? list.tasks : []).map(task => 
              task.id === taskId 
                ? { ...task, completed: !task.completed } 
                : task
            )
          };
        }
        return list;
      });

      setLists(updatedLists);
      
      if (selectedTask?.id === taskId) {
        setSelectedTask(prev => 
          prev?.id === taskId 
            ? { ...prev, completed: !prev.completed } 
            : prev
        );
      }
    } catch (err) {
      setError('Failed to toggle task status');
      console.error('Error toggling task:', err);
    } finally {
      setIsLoading(false);
    }
  }, [selectedList, lists, selectedTask]);

  // Supprimer une tâche
  const deleteTask = useCallback(async (taskId: string | number) => {
    if (!selectedList?.id) return false;

    setIsLoading(true);
    try {
      await api.delete(`/tasks/${taskId}`);
      
      const updatedLists = lists.map(list => {
        if (list.id === selectedList.id) {
          return {
            ...list,
            tasks: (Array.isArray(list.tasks) ? list.tasks : []).filter(task => task.id !== taskId)
          };
        }
        return list;
      });

      setLists(updatedLists);
      
      if (selectedTask?.id === taskId) {
        setSelectedTask(null);
      }
      
      return true;
    } catch (err) {
      setError('Failed to delete task');
      console.error('Error deleting task:', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [selectedList, lists, selectedTask]);

  // Sélectionner une liste
  const selectList = useCallback((list: TaskList) => {
    const safeList = {
      ...list,
      tasks: Array.isArray(list.tasks) ? list.tasks : []
    };
    setSelectedList(safeList);
    setSelectedTask(null);
  }, []);

  // Calcul des tâches actives/terminées
  const activeTasks = useMemo(() => (
    selectedList?.tasks?.filter(task => !task.completed) || []
  ), [selectedList]);

  const completedTasks = useMemo(() => (
    selectedList?.tasks?.filter(task => task.completed) || []
  ), [selectedList]);

  return {
    // État
    lists,
    selectedList,
    selectedTask,
    showCompletedTasks,
    showDeleteModal,
    deleteModalData,
    activeTasks,
    completedTasks,
    isLoading,
    error,

    // Actions
    createList,
    deleteList,
    confirmDeleteList: useCallback((list: TaskList) => {
      setDeleteModalData({
        type: 'list',
        item: list,
        title: 'Confirm deletion',
        message: `Delete list "${list.name}" and all its tasks?`
      });
      setShowDeleteModal(true);
    }, []),
    
    createTask,
    toggleTaskCompletion,
    deleteTask,
    confirmDeleteTask: useCallback((task: Task) => {
      setDeleteModalData({
        type: 'task',
        item: task,
        title: 'Confirm deletion',
        message: `Delete task "${task.shortDescription}"?`
      });
      setShowDeleteModal(true);
    }, []),
    
    selectList,
    selectTask: useCallback((task: Task) => {
      setSelectedTask(task);
    }, []),
    
    deselectTask: useCallback(() => {
      setSelectedTask(null);
    }, []),
    
    setShowCompletedTasks,
    handleDeleteConfirm: useCallback(async () => {
      if (!deleteModalData.item) return;

      try {
        if (deleteModalData.type === 'list') {
          await deleteList(deleteModalData.item.id);
        } else {
          await deleteTask(deleteModalData.item.id);
        }
      } catch (err) {
        console.error('Error during deletion:', err);
      } finally {
        setShowDeleteModal(false);
      }
    }, [deleteModalData, deleteList, deleteTask]),
    
    handleDeleteCancel: useCallback(() => {
      setShowDeleteModal(false);
    }, []),
    
    clearError: useCallback(() => {
      setError(null);
    }, [])
  };
};