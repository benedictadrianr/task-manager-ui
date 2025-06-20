from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class TaskBase(BaseModel):
    title: str
    description: Optional[str] = None

class TaskCreate(TaskBase):
    pass

class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    completed: Optional[bool] = None

class Task(TaskBase):
    id: str
    completed: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class ApiResponse(BaseModel):
    data: Optional[any] = None
    message: str
    success: bool