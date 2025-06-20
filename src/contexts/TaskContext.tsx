"use client";

import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  type ReactNode,
} from "react";
import type { Task, TaskContextType, TaskAction, ApiTask } from "@/types/task";

const TaskContext = createContext<TaskContextType | undefined>(undefined);

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// Helper function to convert API task to Task
const convertApiTaskToTask = (apiTask: ApiTask): Task => ({
  id: apiTask.id,
  title: apiTask.title,
  description: apiTask.description,
  completed: apiTask.completed,
  createdAt: new Date(apiTask.created_at),
  updatedAt: new Date(apiTask.updated_at),
});

// API functions with proper typing
const apiService = {
  async getTasks(): Promise<Task[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/tasks`);
      const result: { success: boolean; data: ApiTask[]; message: string } =
        await response.json();

      if (result.success && Array.isArray(result.data)) {
        return result.data.map(convertApiTaskToTask);
      }
      return [];
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
      return [];
    }
  },

  async createTask(
    task: Omit<Task, "id" | "createdAt" | "updatedAt">
  ): Promise<Task | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(task),
      });
      const result: { success: boolean; data: ApiTask; message: string } =
        await response.json();

      if (result.success && result.data) {
        return convertApiTaskToTask(result.data);
      }
      return null;
    } catch (error) {
      console.error("Failed to create task:", error);
      return null;
    }
  },

  async toggleTask(taskId: string): Promise<Task | null> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/tasks/${taskId}/toggle`,
        {
          method: "PATCH",
        }
      );
      const result: { success: boolean; data: ApiTask; message: string } =
        await response.json();

      if (result.success && result.data) {
        return convertApiTaskToTask(result.data);
      }
      return null;
    } catch (error) {
      console.error("Failed to toggle task:", error);
      return null;
    }
  },

  async deleteTask(taskId: string): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/tasks/${taskId}`, {
        method: "DELETE",
      });
      const result: { success: boolean; message: string } =
        await response.json();
      return result.success;
    } catch (error) {
      console.error("Failed to delete task:", error);
      return false;
    }
  },
};

function taskReducer(state: Task[], action: TaskAction): Task[] {
  switch (action.type) {
    case "SET_TASKS":
      return action.payload;
    case "ADD_TASK":
      return [...state, action.payload];
    case "UPDATE_TASK":
      return state.map((task) =>
        task.id === action.payload.id ? action.payload : task
      );
    case "DELETE_TASK":
      return state.filter((task) => task.id !== action.payload);
    default:
      return state;
  }
}

export function TaskProvider({ children }: { children: ReactNode }) {
  const [tasks, dispatch] = useReducer(taskReducer, []);

  // Load tasks from API on mount
  useEffect(() => {
    const loadTasks = async () => {
      const apiTasks = await apiService.getTasks();
      dispatch({ type: "SET_TASKS", payload: apiTasks });
    };
    loadTasks();
  }, []);

  const addTask = async (
    task: Omit<Task, "id" | "createdAt" | "updatedAt">
  ) => {
    const savedTask = await apiService.createTask(task);
    if (savedTask) {
      dispatch({ type: "ADD_TASK", payload: savedTask });
    }
  };

  const updateTask = (task: Task) => {
    dispatch({
      type: "UPDATE_TASK",
      payload: { ...task, updatedAt: new Date() },
    });
  };

  const deleteTask = async (id: string) => {
    const success = await apiService.deleteTask(id);
    if (success) {
      dispatch({ type: "DELETE_TASK", payload: id });
    }
  };

  const toggleTask = async (id: string) => {
    const updatedTask = await apiService.toggleTask(id);
    if (updatedTask) {
      dispatch({ type: "UPDATE_TASK", payload: updatedTask });
    }
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        addTask,
        updateTask,
        deleteTask,
        toggleTask,
      }}>
      {children}
    </TaskContext.Provider>
  );
}

export function useTaskContext() {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error("useTaskContext must be used within a TaskProvider");
  }
  return context;
}
