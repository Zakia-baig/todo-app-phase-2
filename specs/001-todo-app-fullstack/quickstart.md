# Quickstart Guide: Todo App Fullstack

## Overview
Quickstart guide for setting up and running the full-stack Todo Web Application with authentication and CRUD operations.

## Prerequisites
- Node.js 18+ (for frontend)
- Python 3.11+ (for backend)
- PostgreSQL-compatible database (Neon recommended)
- Git
- Package managers: npm/yarn and pip

## Environment Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd todo-web-app
```

### 2. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration
```

Required environment variables:
- `DATABASE_URL`: PostgreSQL connection string
- `BETTER_AUTH_SECRET`: Secret for JWT signing
- `BETTER_AUTH_URL`: Base URL for the application

### 3. Frontend Setup
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Set up environment variables
cp .env.local.example .env.local
# Edit .env.local with your configuration
```

Required environment variables:
- `NEXT_PUBLIC_API_BASE_URL`: Base URL for backend API
- `NEXT_PUBLIC_BETTER_AUTH_URL`: URL for Better Auth

## Database Setup

### 1. Set up Neon PostgreSQL
1. Create a Neon account and project
2. Get your connection string from the Neon dashboard
3. Update the `DATABASE_URL` in your environment files

### 2. Run Database Migrations
```bash
cd backend
source venv/bin/activate  # Activate virtual environment
python -m alembic upgrade head
```

## Running the Application

### 1. Start the Backend
```bash
cd backend
source venv/bin/activate
uvicorn src.main:app --reload --port 8000
```

### 2. Start the Frontend
```bash
cd frontend
npm run dev
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- Backend Docs: http://localhost:8000/docs

## Key Features

### Authentication
- User registration at `/signup`
- User login at `/login`
- Protected routes for authenticated users

### Task Management
- Create new tasks
- View all tasks
- Update task status (complete/incomplete)
- Delete tasks
- Filter tasks by status

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Tasks
- `GET /api/{user_id}/tasks` - Get all user tasks
- `POST /api/{user_id}/tasks` - Create a new task
- `GET /api/{user_id}/tasks/{task_id}` - Get a specific task
- `PUT /api/{user_id}/tasks/{task_id}` - Update a task
- `DELETE /api/{user_id}/tasks/{task_id}` - Delete a task

## Configuration

### Environment Variables
- `DATABASE_URL`: Database connection string
- `SECRET_KEY`: Secret for signing JWT tokens
- `ALGORITHM`: Algorithm for JWT (default: HS256)
- `ACCESS_TOKEN_EXPIRE_MINUTES`: Token expiration time

### Development vs Production
- Development: Use `--reload` flag for hot reloading
- Production: Use proper WSGI server like Gunicorn
- Adjust environment variables accordingly

## Troubleshooting

### Common Issues
1. **Database Connection**: Ensure PostgreSQL is running and credentials are correct
2. **Port Conflicts**: Check if ports 3000 (frontend) and 8000 (backend) are available
3. **Environment Variables**: Verify all required environment variables are set

### Useful Commands
```bash
# Check backend health
curl http://localhost:8000/health

# Check frontend build
npm run build

# Run backend tests
pytest tests/

# Run frontend tests
npm run test
```

## Next Steps
1. Implement additional UI components
2. Add more sophisticated task filtering
3. Implement task sharing between users
4. Add notifications for task deadlines