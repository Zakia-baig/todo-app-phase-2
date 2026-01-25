from sqlmodel import SQLModel, create_engine, Session
from typing import Generator
import os
from dotenv import load_dotenv
from ..models.user_model import User  # noqa: F401
from ..models.task_model import Task  # noqa: F401

# Load environment variables from .env file
load_dotenv()


# Get database URL from environment - defaults to SQLite for development
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./todo_app.db")

# Create engine with appropriate settings
# For SQLite, we need to handle it differently than PostgreSQL
if DATABASE_URL.startswith("sqlite"):
    # SQLite specific configuration with performance optimizations
    engine = create_engine(
        DATABASE_URL,
        echo=False,
        connect_args={
            "check_same_thread": False,
            "timeout": 30,
        },
        pool_pre_ping=True,
        pool_recycle=300,
        pool_size=20,
        max_overflow=30
    )
else:
    # PostgreSQL configuration with connection pooling
    engine = create_engine(
        DATABASE_URL,
        echo=False,
        pool_pre_ping=True,
        pool_recycle=300,
        pool_size=20,
        max_overflow=30
    )


def create_db_and_tables():
    """Create database tables."""
    SQLModel.metadata.create_all(bind=engine)


def get_session() -> Generator:
    """Get database session."""
    with Session(engine) as session:
        yield session