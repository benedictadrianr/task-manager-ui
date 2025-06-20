export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface TaskContextType {
  tasks: Task[];
  addTask: (
    task: Omit<Task, "id" | "createdAt" | "updatedAt">
  ) => Promise<boolean>;
  updateTask: (task: Task) => void;
  deleteTask: (id: string) => Promise<boolean>;
  toggleTask: (id: string) => Promise<boolean>;
  isLoading: boolean;
  error: string | null;
}

export type TaskAction =
  | { type: "SET_TASKS"; payload: Task[] }
  | { type: "ADD_TASK"; payload: Task }
  | { type: "UPDATE_TASK"; payload: Task }
  | { type: "DELETE_TASK"; payload: string };

export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface TaskFormData {
  title: string;
  description: string;
}

// Add this interface for the API task response
export interface ApiTask {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
}
