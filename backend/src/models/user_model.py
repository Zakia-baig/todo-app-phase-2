from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime
import uuid


# Base schema shared for User
class UserBase(SQLModel):
    email: str = Field(unique=True)
    username: Optional[str] = Field(default=None)
    is_active: bool = Field(default=True)


# DB Model
class User(UserBase, table=True):
    __tablename__ = "users"
    __table_args__ = (
        {'sqlite_autoincrement': True}  # Optimize for SQLite
    )

    # UUID primary key as string with index
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True, index=True)
    email: str = Field(unique=True, index=True)  # Add index for faster lookups

    # Hashed password column
    password_hash: str

    # Timestamps with indexes
    created_at: datetime = Field(default_factory=datetime.utcnow, index=True)
    updated_at: datetime = Field(default_factory=datetime.utcnow, index=True)


# Schema for creating a new user (input from frontend)
class UserCreate(UserBase):
    password: str  # plaintext password input


# Schema for reading user (output)
class UserRead(UserBase):
    id: str
    created_at: datetime
    updated_at: datetime


# Schema for updating user
class UserUpdate(SQLModel):
    email: Optional[str] = None
    username: Optional[str] = None
    password: Optional[str] = None
