import { useState, useCallback } from 'react';
import { Task, TaskList } from '../types/task.types';
import { generateId } from '../utils/helpers';

export const useTaskManager = () => {
  const [lists, setLists] = useState<TaskList[]>([
    { id: 1, name: 'Travail', tasks: [] },
    { id: 2, name: 'Personnel', tasks: [] }
  ]);
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

  // Créer une nouvelle liste
  const createList = useCallback((name: string) => {
    const trimmedName = name.trim();
    if (trimmedName && !lists.find(l => l.name === trimmedName)) {
      const newList: TaskList = {
        id: generateId(),
        name: trimmedName,
        tasks: []
      };
      setLists(prev => [...prev, newList]);
      return true;
    }
    return false;
  }, [lists]);

  // Supprimer une liste
  const deleteList = useCallback((listId: string | number) => {
    setLists(prev => prev.filter(l => l.id !== listId));
    if (selectedList?.id === listId) {
      setSelectedList(null);
      setSelectedTask(null);
    }
  }, [selectedList]);

  // Confirmer la suppression d'une liste
  const confirmDeleteList = useCallback((list: TaskList) => {
    setDeleteModalData({
      type: 'list',
      item: list,
      title: 'Confirmer la suppression',
      message: `Êtes-vous sûr de vouloir supprimer la liste "${list.name}" ? Toutes les tâches associées seront également supprimées.`
    });
    setShowDeleteModal(true);
  }, []);

  // Créer une nouvelle tâche
  const createTask = useCallback((taskData: {
    shortDescription: string;
    longDescription: string;
    dueDate: string;
  }) => {
    if (!selectedList || !taskData.shortDescription.trim() || !taskData.dueDate) {
      return false;
    }

    const newTask: Task = {
      id: generateId(),
      shortDescription: taskData.shortDescription.trim(),
      longDescription: taskData.longDescription.trim(),
      dueDate: taskData.dueDate,
      completed: false,
      createdAt: new Date().toISOString()
    };

    const updatedLists = lists.map(list =>
      list.id === selectedList.id
        ? { ...list, tasks: [...list.tasks, newTask] }
        : list
    );

    setLists(updatedLists);
    setSelectedList(updatedLists.find(l => l.id === selectedList.id) || null);
    return true;
  }, [selectedList, lists]);

  // Basculer l'état d'une tâche
  const toggleTaskCompletion = useCallback((taskId: string | number) => {
    if (!selectedList) return;

    const updatedLists = lists.map(list =>
      list.id === selectedList.id
        ? {
            ...list,
            tasks: list.tasks.map(task =>
              task.id === taskId ? { ...task, completed: !task.completed } : task
            )
          }
        : list
    );

    setLists(updatedLists);
    const updatedSelectedList = updatedLists.find(l => l.id === selectedList.id);
    setSelectedList(updatedSelectedList || null);

    // Mettre à jour la tâche sélectionnée si c'est celle qui a été modifiée
    if (selectedTask?.id === taskId && updatedSelectedList) {
      const updatedTask = updatedSelectedList.tasks.find(t => t.id === taskId);
      setSelectedTask(updatedTask || null);
    }
  }, [selectedList, lists, selectedTask]);

  // Supprimer une tâche
  const deleteTask = useCallback((taskId: string | number) => {
    if (!selectedList) return;

    const updatedLists = lists.map(list =>
      list.id === selectedList.id
        ? { ...list, tasks: list.tasks.filter(task => task.id !== taskId) }
        : list
    );

    setLists(updatedLists);
    setSelectedList(updatedLists.find(l => l.id === selectedList.id) || null);
    
    if (selectedTask?.id === taskId) {
      setSelectedTask(null);
    }
  }, [selectedList, lists, selectedTask]);

  // Confirmer la suppression d'une tâche
  const confirmDeleteTask = useCallback((task: Task) => {
    setDeleteModalData({
      type: 'task',
      item: task,
      title: 'Confirmer la suppression',
      message: 'Êtes-vous sûr de vouloir supprimer cette tâche ?'
    });
    setShowDeleteModal(true);
  }, []);

  // Gérer la confirmation de suppression
  const handleDeleteConfirm = useCallback(() => {
    if (deleteModalData.item) {
      if (deleteModalData.type === 'list') {
        deleteList(deleteModalData.item.id);
      } else if (deleteModalData.type === 'task') {
        deleteTask(deleteModalData.item.id);
      }
    }
    setShowDeleteModal(false);
    setDeleteModalData({
      type: 'list',
      item: null,
      title: '',
      message: ''
    });
  }, [deleteModalData, deleteList, deleteTask]);

  // Fermer le modal de suppression
  const handleDeleteCancel = useCallback(() => {
    setShowDeleteModal(false);
    setDeleteModalData({
      type: 'list',
      item: null,
      title: '',
      message: ''
    });
  }, []);

  // Sélectionner une liste
  const selectList = useCallback((list: TaskList) => {
    setSelectedList(list);
    setSelectedTask(null);
  }, []);

  // Sélectionner une tâche
  const selectTask = useCallback((task: Task) => {
    setSelectedTask(task);
  }, []);

  // Désélectionner une tâche
  const deselectTask = useCallback(() => {
    setSelectedTask(null);
  }, []);

  // Calculer les tâches actives et terminées
  const activeTasks = selectedList?.tasks.filter(task => !task.completed) || [];
  const completedTasks = selectedList?.tasks.filter(task => task.completed) || [];

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

    // Actions
    createList,
    deleteList,
    confirmDeleteList,
    createTask,
    toggleTaskCompletion,
    deleteTask,
    confirmDeleteTask,
    selectList,
    selectTask,
    deselectTask,
    setShowCompletedTasks,
    handleDeleteConfirm,
    handleDeleteCancel
  };
};