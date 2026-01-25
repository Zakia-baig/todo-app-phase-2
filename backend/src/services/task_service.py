from sqlmodel import Session, select
from typing import List, Optional

from ..models.task_model import Task, TaskCreate, TaskUpdate
from ..utils.exceptions import TaskNotFoundException, ForbiddenException


class TaskService:
    def __init__(self, session: Session):
        self.session = session

    def create_task(self, task_create: TaskCreate) -> Task:
        """Create a new task."""
        db_task = Task(
            title=task_create.title,
            description=task_create.description,
            completed=task_create.completed,
            user_id=task_create.user_id
        )

        self.session.add(db_task)
        self.session.commit()
        self.session.refresh(db_task)

        return db_task

    def get_task_by_id(self, task_id: str, user_id: str) -> Optional[Task]:
        """Get a task by ID for a specific user."""
        task = self.session.exec(
            select(Task).where(Task.id == task_id).where(Task.user_id == user_id)
        ).first()

        if not task:
            raise TaskNotFoundException(task_id)

        return task

    def get_tasks_by_user(self, user_id: str, status: Optional[str] = None) -> List[Task]:
        """Get all tasks for a user, optionally filtered by status."""
        query = select(Task).where(Task.user_id == user_id)

        if status:
            if status == 'completed':
                query = query.where(Task.completed == True)
            elif status == 'incomplete':
                query = query.where(Task.completed == False)

        tasks = self.session.exec(query).all()
        return tasks

    def update_task(self, task_id: str, user_id: str, task_update: TaskUpdate) -> Optional[Task]:
        """Update a task."""
        task = self.get_task_by_id(task_id, user_id)

        if not task:
            return None

        # Update fields if they are provided
        if task_update.title is not None:
            task.title = task_update.title
        if task_update.description is not None:
            task.description = task_update.description
        if task_update.completed is not None:
            task.completed = task_update.completed
        if task_update.due_date is not None:
            task.due_date = task_update.due_date

        self.session.add(task)
        self.session.commit()
        self.session.refresh(task)

        return task

    def delete_task(self, task_id: str, user_id: str) -> bool:
        """Delete a task."""
        task = self.get_task_by_id(task_id, user_id)

        if not task:
            return False

        self.session.delete(task)
        self.session.commit()
        return True