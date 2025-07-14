export interface Task {
  id: string | number;
  shortDescription: string;
  longDescription: string;
  dueDate: string;
  completed: boolean;
  createdAt: string;
}

export interface TaskList {
  id: string | number;
  name: string;
  tasks: Task[];
}

export interface TaskContextType {
  // État
  lists: TaskList[];
  selectedList: TaskList | null;
  selectedTask: Task | null;
  showCompletedTasks: boolean;
  showDeleteModal: boolean;
  deleteModalData: {
    type: 'list' | 'task';
    item: TaskList | Task | null;
    title: string;
    message: string;
  };
  activeTasks: Task[];
  completedTasks: Task[];

  // Actions
 createList: (name: string) => Promise<boolean>;
  deleteList: (id: string | number) => void;
  confirmDeleteList: (list: TaskList) => void;
  createTask: (task: {
    shortDescription: string;
    longDescription: string;
    dueDate: string;
  }) => boolean;
  toggleTaskCompletion: (taskId: string | number) => void;
  deleteTask: (taskId: string | number) => void;
  confirmDeleteTask: (task: Task) => void;
  selectList: (list: TaskList) => void;
  selectTask: (task: Task) => void;
  deselectTask: () => void;
  setShowCompletedTasks: (val: boolean) => void;
  handleDeleteConfirm: () => void;
  handleDeleteCancel: () => void;
}
