from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .api import task_routes, auth_routes
from .database.connection import create_db_and_tables
from .auth.auth_handler import AuthHandler
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

app = FastAPI(title="Todo App API", version="1.0.0")

# CORS settings
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Production me apne frontend domain se replace karein
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routers
app.include_router(task_routes.router, prefix="/api/{user_id}/tasks", tags=["tasks"])
app.include_router(auth_routes.router, prefix="/api/auth", tags=["auth"])

# Run DB table creation ONLY once, comment later
@app.on_event("startup")
async def startup_event():
    """Create database tables on startup - only first run."""
    print("Connecting to database and verifying tables...")
    create_db_and_tables()
    print("Database tables created / verified!")

# Health check
@app.get("/health")
def health_check():
    return {"status": "healthy"}

@app.get("/")
def read_root():
    return {"message": "Todo App API is running!"}

