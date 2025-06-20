"use client";

import { useState } from "react";

import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  type ReactNode,
} from "react";
import type { Task, TaskContextType, TaskAction, ApiTask } from "@/types/task";

const TaskContext = createContext<TaskContextType | undefined>(undefined);

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  (process.env.NODE_ENV === "production"
    ? "https://task-manager-ui-ten.vercel.app"
    : "http://localhost:8000");

const convertApiTaskToTask = (apiTask: ApiTask): Task => ({
  id: apiTask.id,
  title: apiTask.title,
  description: apiTask.description,
  completed: apiTask.completed,
  createdAt: new Date(apiTask.created_at),
  updatedAt: new Date(apiTask.updated_at),
});

const apiService = {
  async getTasks(): Promise<Task[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/tasks`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

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

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

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
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

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
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load tasks from API on mount
  useEffect(() => {
    const loadTasks = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const apiTasks = await apiService.getTasks();
        dispatch({ type: "SET_TASKS", payload: apiTasks });
      } catch (err) {
        setError("Failed to load tasks");
        console.error("Error loading tasks:", err);
      } finally {
        setIsLoading(false);
      }
    };
    loadTasks();
  }, []);

  const addTask = async (
    task: Omit<Task, "id" | "createdAt" | "updatedAt">
  ) => {
    try {
      const savedTask = await apiService.createTask(task);
      if (savedTask) {
        dispatch({ type: "ADD_TASK", payload: savedTask });
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error adding task:", error);
      return false;
    }
  };

  const updateTask = (task: Task) => {
    dispatch({
      type: "UPDATE_TASK",
      payload: { ...task, updatedAt: new Date() },
    });
  };

  const deleteTask = async (id: string) => {
    try {
      const success = await apiService.deleteTask(id);
      if (success) {
        dispatch({ type: "DELETE_TASK", payload: id });
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error deleting task:", error);
      return false;
    }
  };

  const toggleTask = async (id: string) => {
    try {
      const updatedTask = await apiService.toggleTask(id);
      if (updatedTask) {
        dispatch({ type: "UPDATE_TASK", payload: updatedTask });
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error toggling task:", error);
      return false;
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
        isLoading,
        error,
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
