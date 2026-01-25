from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from typing import List

from ..database.connection import get_session
from ..models.task_model import Task, TaskCreate, TaskRead, TaskUpdate
from ..models.user_model import User
from ..services.task_service import TaskService
from ..auth.auth_handler import AuthHandler
from ..utils.exceptions import TaskNotFoundException, ForbiddenException
from ..utils.logger import app_logger

router = APIRouter()
auth_handler = AuthHandler()


@router.get("/", response_model=List[TaskRead])
def get_tasks(
    user_id: str,
    status: str = None,
    current_user: User = Depends(auth_handler.get_current_user),
    session: Session = Depends(get_session)
):
    """Get all tasks for a user, optionally filtered by status."""
    # Verify that the user is accessing their own tasks
    if current_user.id != user_id:
        raise ForbiddenException()

    task_service = TaskService(session)
    tasks = task_service.get_tasks_by_user(user_id, status)

    app_logger.info("Retrieved tasks", user_id=user_id, task_count=len(tasks))
    return tasks


@router.post("/", response_model=TaskRead)
def create_task(
    user_id: str,
    task: TaskCreate,
    current_user: User = Depends(auth_handler.get_current_user),
    session: Session = Depends(get_session)
):
    """Create a new task for a user."""
    # Log the user IDs for debugging
    app_logger.debug("Creating task", requested_user_id=user_id, authenticated_user_id=current_user.id)

    # Verify that the user is creating tasks for themselves
    if current_user.id != user_id:
        app_logger.warning("Forbidden task creation attempt",
                          requested_user_id=user_id,
                          authenticated_user_id=current_user.id)
        raise ForbiddenException()

    # Ensure the task is assigned to the correct user
    task_data = task.dict()
    task_data['user_id'] = user_id

    task_create = TaskCreate(**task_data)

    task_service = TaskService(session)
    db_task = task_service.create_task(task_create)

    app_logger.info("Task created", task_id=db_task.id, user_id=user_id)
    return db_task


@router.get("/{task_id}", response_model=TaskRead)
def get_task(
    user_id: str,
    task_id: str,
    current_user: User = Depends(auth_handler.get_current_user),
    session: Session = Depends(get_session)
):
    """Get a specific task by ID."""
    # Verify that the user is accessing their own tasks
    if current_user.id != user_id:
        raise ForbiddenException()

    task_service = TaskService(session)
    task = task_service.get_task_by_id(task_id, user_id)

    app_logger.info("Task retrieved", task_id=task_id, user_id=user_id)
    return task


@router.put("/{task_id}", response_model=TaskRead)
def update_task(
    user_id: str,
    task_id: str,
    task_update: TaskUpdate,
    current_user: User = Depends(auth_handler.get_current_user),
    session: Session = Depends(get_session)
):
    """Update a task."""
    # Verify that the user is updating their own task
    if current_user.id != user_id:
        raise ForbiddenException()

    task_service = TaskService(session)
    updated_task = task_service.update_task(task_id, user_id, task_update)

    if not updated_task:
        raise TaskNotFoundException(task_id)

    app_logger.info("Task updated", task_id=task_id, user_id=user_id)
    return updated_task


@router.delete("/{task_id}")
def delete_task(
    user_id: str,
    task_id: str,
    current_user: User = Depends(auth_handler.get_current_user),
    session: Session = Depends(get_session)
):
    """Delete a task."""
    # Verify that the user is deleting their own task
    if current_user.id != user_id:
        raise ForbiddenException()

    task_service = TaskService(session)
    success = task_service.delete_task(task_id, user_id)

    if not success:
        raise TaskNotFoundException(task_id)

    app_logger.info("Task deleted", task_id=task_id, user_id=user_id)
    return {"message": "Task deleted successfully"}