"use client";

import { TaskProvider } from "@/contexts/TaskContext";
import TaskDashboard from "@/components/TaskDashboard";

export default function Home() {
  return (
    <TaskProvider>
      <div className="min-h-screen bg-gray-50">
        <TaskDashboard />
      </div>
    </TaskProvider>
  );
}
