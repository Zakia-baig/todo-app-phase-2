# Todo App - Phase 2

A full-stack todo application with authentication and task management features.

## Features
- User authentication and registration
- Task CRUD operations
- Task assignment to users
- Secure JWT-based authentication
- PostgreSQL database integration

## Tech Stack
- **Backend**: FastAPI, SQLModel, PostgreSQL
- **Frontend**: Next.js, TypeScript, Tailwind CSS
- **Authentication**: JWT tokens

## Prerequisites
- Python 3.8+
- Node.js 16+
- PostgreSQL (or use the provided NeonDB connection)

## Quick Start

### Method 1: Using the startup script (Recommended)
```bash
# Install dependencies
cd backend && pip install -r requirements.txt && cd ..
cd frontend && npm install && cd ..

# Start both servers
python start_dev.py
```

### Method 2: Manual start
```bash
# Terminal 1: Start backend
cd backend
python -m uvicorn src.main:app --reload --port 8000

# Terminal 2: Start frontend
cd frontend
npm run dev
```

### Method 3: Using the batch script (Windows)
```bash
start_dev.bat
```

## Environment Variables

### Backend (.env in backend directory)
```env
# Database Configuration
DATABASE_URL=postgresql://username:password@ep-aged-salad-123456.us-east-1.aws.neon.tech/todo_app?sslmode=require

# JWT Settings
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Better Auth Settings
BETTER_AUTH_SECRET=your-better-auth-secret
BETTER_AUTH_URL=http://127.0.0.1:3000

# Application Config
APP_ENV=development
DEBUG=true
```

## Available Endpoints

### Backend API
- `GET /` - Root endpoint
- `GET /health` - Health check
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `GET /api/{user_id}/tasks` - Get user's tasks
- `POST /api/{user_id}/tasks` - Create new task
- `GET /api/{user_id}/tasks/{task_id}` - Get specific task
- `PUT /api/{user_id}/tasks/{task_id}` - Update task
- `DELETE /api/{user_id}/tasks/{task_id}` - Delete task

### Frontend
- `http://localhost:3000` - Main application
- `http://localhost:3000/api/auth/*` - Authentication routes

## Development

### Backend Development
- Located in `backend/` directory
- FastAPI application with automatic API documentation at `/docs`
- SQLModel for database modeling
- Alembic for database migrations

### Frontend Development
- Located in `frontend/` directory
- Next.js 14 with App Router
- TypeScript for type safety
- Tailwind CSS for styling

## Database Setup
The application automatically creates database tables on startup. For manual migrations:
```bash
cd backend
alembic upgrade head
```

## Running Tests
```bash
# Backend tests
cd backend
python -m pytest

# Frontend tests (if any)
cd frontend
npm test
```

## Deployment
For production deployment:
1. Update environment variables with production values
2. Build the frontend: `cd frontend && npm run build`
3. Run the backend with production settings