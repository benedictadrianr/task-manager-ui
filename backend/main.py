# main.py
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
from datetime import datetime
import sqlite3
import uuid

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://task-manager-ui-ten.vercel.app/"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize SQLite database
def init_db():
    conn = sqlite3.connect('tasks.db')
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS tasks (
            id TEXT PRIMARY KEY,
            title TEXT NOT NULL,
            description TEXT,
            completed BOOLEAN DEFAULT FALSE,
            created_at TEXT,
            updated_at TEXT
        )
    ''')
    conn.commit()
    conn.close()

init_db()

class TaskCreate(BaseModel):
    title: str
    description: Optional[str] = None

class Task(BaseModel):
    id: str
    title: str
    description: Optional[str] = None
    completed: bool = False
    created_at: str
    updated_at: str

@app.get("/api/tasks")
async def get_tasks():
    conn = sqlite3.connect('tasks.db')
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM tasks ORDER BY created_at DESC')
    rows = cursor.fetchall()
    conn.close()
    
    tasks = []
    for row in rows:
        tasks.append({
            "id": row[0],
            "title": row[1],
            "description": row[2],
            "completed": bool(row[3]),
            "created_at": row[4],
            "updated_at": row[5]
        })
    
    return {"data": tasks, "message": "Tasks retrieved successfully", "success": True}

@app.post("/api/tasks")
async def create_task(task_data: TaskCreate):
    task_id = str(uuid.uuid4())
    now = datetime.now().isoformat()
    
    conn = sqlite3.connect('tasks.db')
    cursor = conn.cursor()
    cursor.execute('''
        INSERT INTO tasks (id, title, description, completed, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?)
    ''', (task_id, task_data.title, task_data.description, False, now, now))
    conn.commit()
    conn.close()
    
    new_task = {
        "id": task_id,
        "title": task_data.title,
        "description": task_data.description,
        "completed": False,
        "created_at": now,
        "updated_at": now
    }
    
    return {"data": new_task, "message": "Task created successfully", "success": True}

@app.patch("/api/tasks/{task_id}/toggle")
async def toggle_task(task_id: str):
    conn = sqlite3.connect('tasks.db')
    cursor = conn.cursor()
    
    # Get current task
    cursor.execute('SELECT * FROM tasks WHERE id = ?', (task_id,))
    task = cursor.fetchone()
    
    if not task:
        conn.close()
        raise HTTPException(status_code=404, detail="Task not found")
    
    # Toggle completed status
    new_completed = not bool(task[3])
    now = datetime.now().isoformat()
    
    cursor.execute('''
        UPDATE tasks SET completed = ?, updated_at = ? WHERE id = ?
    ''', (new_completed, now, task_id))
    conn.commit()
    
    # Get updated task
    cursor.execute('SELECT * FROM tasks WHERE id = ?', (task_id,))
    updated_task = cursor.fetchone()
    conn.close()
    
    return {
        "data": {
            "id": updated_task[0],
            "title": updated_task[1],
            "description": updated_task[2],
            "completed": bool(updated_task[3]),
            "created_at": updated_task[4],
            "updated_at": updated_task[5]
        },
        "message": "Task updated successfully",
        "success": True
    }

@app.delete("/api/tasks/{task_id}")
async def delete_task(task_id: str):
    conn = sqlite3.connect('tasks.db')
    cursor = conn.cursor()
    cursor.execute('DELETE FROM tasks WHERE id = ?', (task_id,))
    
    if cursor.rowcount == 0:
        conn.close()
        raise HTTPException(status_code=404, detail="Task not found")
    
    conn.commit()
    conn.close()
    
    return {"data": None, "message": "Task deleted successfully", "success": True}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)