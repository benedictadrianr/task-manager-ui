"use client";
import type { Task } from "@/types/task";
import { useTaskContext } from "@/contexts/TaskContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Circle, Trash2, Calendar } from "lucide-react";
import { format } from "date-fns";

interface TaskItemProps {
  task: Task;
}

export default function TaskItem({ task }: TaskItemProps) {
  const { toggleTask, deleteTask } = useTaskContext();

  const handleToggle = () => {
    toggleTask(task.id);
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      deleteTask(task.id);
    }
  };

  return (
    <Card
      className={`transition-all duration-200 hover:shadow-md ${
        task.completed
          ? "bg-green-50 border-green-200"
          : "bg-white border-gray-200"
      }`}>
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleToggle}
            className={`mt-1 p-1 h-auto ${
              task.completed
                ? "text-green-600 hover:text-green-700"
                : "text-gray-400 hover:text-gray-600"
            }`}>
            {task.completed ? (
              <CheckCircle2 className="w-5 h-5" />
            ) : (
              <Circle className="w-5 h-5" />
            )}
          </Button>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h4
                  className={`font-medium ${
                    task.completed
                      ? "text-green-800 line-through"
                      : "text-gray-900"
                  }`}>
                  {task.title}
                </h4>
                {task.description && (
                  <p
                    className={`mt-1 text-sm ${
                      task.completed ? "text-green-600" : "text-gray-600"
                    }`}>
                    {task.description}
                  </p>
                )}
                <div className="flex items-center gap-4 mt-3">
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Calendar className="w-3 h-3" />
                    Created: {format(task.createdAt, "MMM dd, yyyy")}
                  </div>
                  {task.updatedAt.getTime() !== task.createdAt.getTime() && (
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      Updated: {format(task.updatedAt, "MMM dd, yyyy")}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex text-background items-center gap-2">
                <Badge variant={task.completed ? "default" : "secondary"}>
                  {task.completed ? "Completed" : "Pending"}
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDelete}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 h-auto">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
