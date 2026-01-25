from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime
import uuid
from .user_model import User  # Import User model for foreign key reference


class TaskBase(SQLModel):
    title: str = Field(max_length=255)
    description: Optional[str] = Field(default=None, max_length=1000)
    completed: bool = Field(default=False)
    user_id: str = Field(foreign_key="users.id")  # Foreign key reference to User
    due_date: Optional[datetime] = Field(default=None)


class Task(TaskBase, table=True):
    """Task model for the application."""
    __tablename__ = "tasks"
    __table_args__ = (
        {'sqlite_autoincrement': True}  # Optimize for SQLite
    )

    id: str = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True, index=True)
    user_id: str = Field(index=True, foreign_key="users.id")  # Add index for faster lookups
    completed: bool = Field(default=False, index=True)  # Add index for filtering
    created_at: datetime = Field(default_factory=datetime.utcnow, index=True)
    updated_at: datetime = Field(default_factory=datetime.utcnow, index=True)


class TaskCreate(TaskBase):
    pass


class TaskRead(TaskBase):
    id: str
    created_at: datetime
    updated_at: datetime
    due_date: Optional[datetime] = None


class TaskUpdate(SQLModel):
    title: Optional[str] = None
    description: Optional[str] = None
    completed: Optional[bool] = None
    due_date: Optional[datetime] = None