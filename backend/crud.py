from sqlalchemy.orm import Session
from database import TaskModel
from schemas import TaskCreate, TaskUpdate
from datetime import datetime
import uuid

def get_tasks(db: Session):
    """Get all tasks ordered by creation date (newest first)"""
    return db.query(TaskModel).order_by(TaskModel.created_at.desc()).all()

def get_task(db: Session, task_id: str):
    """Get a single task by ID"""
    return db.query(TaskModel).filter(TaskModel.id == task_id).first()

def create_task(db: Session, task: TaskCreate):
    """Create a new task"""
    db_task = TaskModel(
        id=str(uuid.uuid4()),
        title=task.title,
        description=task.description,
        completed=False,
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow()
    )
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task

def update_task(db: Session, task_id: str, task_update: TaskUpdate):
    """Update an existing task"""
    db_task = db.query(TaskModel).filter(TaskModel.id == task_id).first()
    if db_task:
        update_data = task_update.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_task, field, value)
        db_task.updated_at = datetime.utcnow()
        db.commit()
        db.refresh(db_task)
    return db_task

def toggle_task(db: Session, task_id: str):
    """Toggle task completion status"""
    db_task = db.query(TaskModel).filter(TaskModel.id == task_id).first()
    if db_task:
        db_task.completed = not db_task.completed
        db_task.updated_at = datetime.utcnow()
        db.commit()
        db.refresh(db_task)
    return db_task

def delete_task(db: Session, task_id: str):
    """Delete a task"""
    db_task = db.query(TaskModel).filter(TaskModel.id == task_id).first()
    if db_task:
        db.delete(db_task)
        db.commit()
        return True
    return False