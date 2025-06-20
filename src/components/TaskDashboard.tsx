"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import TaskList from "./TaskList"
import TaskForm from "./TaskForm"
import TaskStats from "./TaskStats"
import PDFReportGenerator from "./PDFReportGenerator"
import { CheckSquare, Plus, BarChart3, Download } from "lucide-react"

export default function TaskDashboard() {
  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Task Management Dashboard</h1>
        <p className="text-gray-600">Manage your tasks efficiently and generate comprehensive reports</p>
      </div>

      <TaskStats />

      <Tabs defaultValue="tasks" className="mt-8">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="tasks" className="flex items-center gap-2">
            <CheckSquare className="w-4 h-4" />
            Tasks
          </TabsTrigger>
          <TabsTrigger value="create" className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Create Task
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Reports
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tasks" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckSquare className="w-5 h-5" />
                All Tasks
              </CardTitle>
              <CardDescription>
                View and manage all your tasks. Toggle completion status or delete tasks as needed.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TaskList />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="create" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Create New Task
              </CardTitle>
              <CardDescription>
                Add a new task to your list. Title is required, description is optional.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TaskForm />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="w-5 h-5" />
                Generate Reports
              </CardTitle>
              <CardDescription>
                Download comprehensive PDF reports of your tasks with timestamps and completion status.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PDFReportGenerator />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
