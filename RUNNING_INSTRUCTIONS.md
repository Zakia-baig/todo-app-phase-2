# Todo App - Running Instructions

## Overview
This is a full-stack Todo application with authentication. It consists of:
- Backend: Python FastAPI server with PostgreSQL database
- Frontend: Next.js application

## Fixed Issues
The main issue was that the backend was not loading environment variables from the `.env` file properly, causing database connection failures with the default placeholder credentials.

## Services Running
- **Backend API**: http://localhost:8000
- **Frontend**: http://localhost:3000

## Setup and Running Instructions

### Prerequisites
- Python 3.8+
- Node.js 18+
- npm/yarn

### Backend Setup (Already Done)
1. Navigate to the backend directory: `cd backend`
2. Install Python dependencies: `pip install -r requirements.txt`
3. The database connection has been fixed to properly load environment variables from `.env`

### Frontend Setup (Already Done)
1. Navigate to the frontend directory: `cd frontend`
2. Install Node.js dependencies: `npm install`

### Running the Applications

#### Start Backend Server
```bash
cd backend
python run_server.py
```
Or alternatively:
```bash
cd backend
PYTHONPATH=. uvicorn src.main:app --host 0.0.0.0 --port 8000
```

The backend will be accessible at http://localhost:8000

#### Start Frontend Server
```bash
cd frontend
npm run dev
```

The frontend will be accessible at http://localhost:3000

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/login` - Login and get access token
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user info

### Task Management
- `GET /api/{user_id}/` - Get all tasks for a user
- `POST /api/{user_id}/` - Create a new task for a user
- `GET /api/{user_id}/{task_id}` - Get a specific task
- `PUT /api/{user_id}/{task_id}` - Update a specific task
- `DELETE /api/{user_id}/{task_id}` - Delete a specific task

### Health Check
- `GET /health` - Check API health status

## Authentication Flow
1. Register a user via `/api/auth/signup`
2. Login via `/api/auth/login` to get a JWT token
3. Use the token in the Authorization header (`Bearer <token>`) for protected endpoints
4. Access task management endpoints using the user's ID in the URL path

## Database
- The application uses PostgreSQL database configured in the `.env` file
- Tables are automatically created on startup
- Connection string is loaded from `DATABASE_URL` environment variable

## Troubleshooting
- If you get database connection errors, verify that the `.env` file in the backend directory has the correct database credentials
- Make sure both backend and frontend are running simultaneously
- Check that the frontend's `.env.local` points to the correct backend URL