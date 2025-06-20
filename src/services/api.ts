import type { Task, ApiResponse } from "@/types/task";

// Simulated API service for demonstration
// In a real application, this would make actual HTTP requests to your FastAPI backend

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://task-manager-ui-ten.vercel.app/api";

class ApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      throw new Error(
        `API request failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  async getTasks(): Promise<ApiResponse<Task[]>> {
    return this.request<Task[]>("/tasks");
  }

  async createTask(
    task: Omit<Task, "id" | "createdAt" | "updatedAt">
  ): Promise<ApiResponse<Task>> {
    return this.request<Task>("/tasks", {
      method: "POST",
      body: JSON.stringify(task),
    });
  }

  async updateTask(
    id: string,
    task: Partial<Task>
  ): Promise<ApiResponse<Task>> {
    return this.request<Task>(`/tasks/${id}`, {
      method: "PUT",
      body: JSON.stringify(task),
    });
  }

  async deleteTask(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/tasks/${id}`, {
      method: "DELETE",
    });
  }

  async toggleTask(id: string): Promise<ApiResponse<Task>> {
    return this.request<Task>(`/tasks/${id}/toggle`, {
      method: "PATCH",
    });
  }
}

export const apiService = new ApiService();
