export interface ITask {
  id: string;
  name: string;
  notes?: string;
  completed: Date | null;
  archived: boolean;
}

export type TaskInput = Omit<ITask, 'id' | 'completed' | 'archived'>;

export interface TaskManagerState {
  tasks: ITask[];
  isLoading: boolean;
  error: string | null;
  showArchived: boolean;
} 