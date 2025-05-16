import { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { ITask, TaskInput } from '../types/task';

const STORAGE_KEY = 'tasks';

interface StorageError extends Error {
  code?: string;
}

const isStorageError = (error: unknown): error is StorageError => {
  return error instanceof Error && 'code' in error;
};

const loadTasks = (): ITask[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    
    const tasks = JSON.parse(stored);
    if (!Array.isArray(tasks)) {
      throw new Error('Invalid data format in storage');
    }

    return tasks.map((task: unknown) => {
      if (!isValidTask(task)) {
        throw new Error('Invalid task data in storage');
      }
      return {
        ...task,
        completed: task.completed ? new Date(task.completed) : null,
      };
    });
  } catch (error) {
    console.error('Error loading tasks:', error);
    if (isStorageError(error) && error.code === 'QuotaExceededError') {
      throw new Error('Storage quota exceeded. Please clear some space.');
    }
    throw new Error('Failed to load tasks from storage');
  }
};

const saveTasks = (tasks: ITask[]): void => {
  try {
    const serialized = JSON.stringify(tasks);
    localStorage.setItem(STORAGE_KEY, serialized);
  } catch (error) {
    console.error('Error saving tasks:', error);
    if (isStorageError(error) && error.code === 'QuotaExceededError') {
      throw new Error('Storage quota exceeded. Please clear some space.');
    }
    throw new Error('Failed to save tasks to storage');
  }
};

interface StoredTask {
  id: string;
  name: string;
  notes?: string;
  completed: string | null;
  archived: boolean;
}

const isValidTask = (task: unknown): task is StoredTask => {
  if (!task || typeof task !== 'object') return false;
  const t = task as Record<string, unknown>;
  return (
    typeof t.id === 'string' &&
    typeof t.name === 'string' &&
    (t.notes === undefined || typeof t.notes === 'string') &&
    (t.completed === null || typeof t.completed === 'string') &&
    typeof t.archived === 'boolean'
  );
};

export interface TaskManagerState {
  tasks: ITask[];
  isLoading: boolean;
  error: string | null;
  showArchived: boolean;
  searchQuery: string;
}

export const useTaskManager = () => {
  const [state, setState] = useState<TaskManagerState>({
    tasks: [],
    isLoading: true,
    error: null,
    showArchived: false,
    searchQuery: '',
  });

  useEffect(() => {
    const initializeTasks = async () => {
      try {
        const tasks = loadTasks();
        setState(prev => ({ ...prev, tasks, isLoading: false }));
      } catch (error) {
        setState(prev => ({
          ...prev,
          error: error instanceof Error ? error.message : 'Unknown error',
          isLoading: false,
        }));
      }
    };

    initializeTasks();
  }, []);

  const createTask = useCallback((input: TaskInput) => {
    try {
      setState(prev => {
        const newTask: ITask = {
          id: uuidv4(),
          ...input,
          completed: null,
          archived: false,
        };
        const newTasks = [...prev.tasks, newTask];
        saveTasks(newTasks);
        return { ...prev, tasks: newTasks, error: null };
      });
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to create task',
      }));
    }
  }, []);

  const updateTask = useCallback((id: string, input: Partial<TaskInput>) => {
    try {
      setState(prev => {
        const newTasks = prev.tasks.map(task =>
          task.id === id ? { ...task, ...input } : task
        );
        saveTasks(newTasks);
        return { ...prev, tasks: newTasks, error: null };
      });
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to update task',
      }));
    }
  }, []);

  const deleteTask = useCallback((id: string) => {
    try {
      setState(prev => {
        const newTasks = prev.tasks.filter(task => task.id !== id);
        saveTasks(newTasks);
        return { ...prev, tasks: newTasks, error: null };
      });
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to delete task',
      }));
    }
  }, []);

  const toggleTaskCompletion = useCallback((id: string) => {
    try {
      setState(prev => {
        const newTasks = prev.tasks.map(task => {
          if (task.id === id) {
            return {
              ...task,
              completed: task.completed ? null : new Date(),
            };
          }
          return task;
        });
        saveTasks(newTasks);
        return { ...prev, tasks: newTasks, error: null };
      });
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to toggle task',
      }));
    }
  }, []);

  const toggleTaskArchive = useCallback((id: string) => {
    try {
      setState(prev => {
        const newTasks = prev.tasks.map(task => {
          if (task.id === id) {
            return {
              ...task,
              archived: !task.archived,
            };
          }
          return task;
        });
        saveTasks(newTasks);
        return { ...prev, tasks: newTasks, error: null };
      });
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to archive task',
      }));
    }
  }, []);

  const toggleShowArchived = useCallback(() => {
    setState(prev => ({
      ...prev,
      showArchived: !prev.showArchived,
    }));
  }, []);

  const setSearchQuery = useCallback((query: string) => {
    setState(prev => ({
      ...prev,
      searchQuery: query,
    }));
  }, []);

  const filteredTasks = state.tasks.filter(task => {
    const matchesArchive = state.showArchived ? true : !task.archived;
    const matchesSearch = state.searchQuery
      ? task.name.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
        (task.notes?.toLowerCase().includes(state.searchQuery.toLowerCase()) ?? 
          false)
      : true;
    return matchesArchive && matchesSearch;
  });

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  return {
    tasks: filteredTasks,
    isLoading: state.isLoading,
    error: state.error,
    showArchived: state.showArchived,
    searchQuery: state.searchQuery,
    createTask,
    updateTask,
    deleteTask,
    toggleTaskCompletion,
    toggleTaskArchive,
    toggleShowArchived,
    setSearchQuery,
    clearError,
  };
}; 