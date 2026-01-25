# Todo Web Application

A full-stack Todo Web Application with user authentication, task CRUD operations, and responsive UI built with Next.js, FastAPI, and Neon PostgreSQL.

## Features

- User authentication (signup/login/logout)
- Task management (create, read, update, delete)
- Task status tracking (completed/incomplete)
- Task filtering by status
- Responsive design for all devices
- JWT-based authentication
- Secure user data isolation

## Tech Stack

- **Frontend**: Next.js 16+, TypeScript, Tailwind CSS
- **Backend**: FastAPI, Python 3.11+
- **Database**: Neon PostgreSQL
- **Authentication**: JWT-based authentication
- **Styling**: Tailwind CSS

## Prerequisites

- Node.js 18+
- Python 3.11+
- PostgreSQL-compatible database (Neon recommended)
- Git

## Installation

### 1. Clone the repository

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

## Database Setup

### 1. Set up Neon PostgreSQL
1. Create a Neon account and project
2. Get your connection string from the Neon dashboard
3. Update the `DATABASE_URL` in your environment files

### 2. Run Database Migrations
```bash
cd backend
source venv/bin/activate  # Activate virtual environment
alembic upgrade head
```

## Running the Application

### Method 1: Quick Start (Recommended)
Use our enhanced startup script to run both servers simultaneously:

```bash
# From project root
python start_dev.py
```

This will start both backend (port 8000) and frontend (port 3000) servers with optimized settings.

### Method 2: Using Enhanced Helper Script
The improved helper script installs dependencies automatically and optimizes startup:

```bash
# Start backend from project root
python run_backend.py
```

Then in another terminal:
```bash
cd frontend
npm run dev
```

### Method 3: Manual Start (Traditional)
For individual control:

**Terminal 1 - Start the Backend:**
```bash
cd backend
source venv/bin/activate  # On Windows: venv\Scripts\activate
uvicorn src.main:app --reload --port 8000
```

**Terminal 2 - Start the Frontend:**
```bash
cd frontend
npm run dev
```

### Method 4: Windows Batch Script
For Windows users, we provide a batch script:

```bash
start_dev.bat
```

This opens separate command windows for both servers.

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://127.0.0.1:8000
- Backend Docs: http://127.0.0.1:8000/docs

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - User registration
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Tasks
- `GET /api/{user_id}/tasks` - Get all user tasks
- `POST /api/{user_id}/tasks` - Create a new task
- `GET /api/{user_id}/tasks/{task_id}` - Get a specific task
- `PUT /api/{user_id}/tasks/{task_id}` - Update a task
- `DELETE /api/{user_id}/tasks/{task_id}` - Delete a task

## Environment Variables

### Backend (.env)
- `DATABASE_URL`: PostgreSQL connection string
- `SECRET_KEY`: Secret for JWT signing
- `ALGORITHM`: Algorithm for JWT (default: HS256)
- `ACCESS_TOKEN_EXPIRE_MINUTES`: Token expiration time

### Frontend (.env.local)
- `NEXT_PUBLIC_API_BASE_URL`: Base URL for backend API
- `NEXT_PUBLIC_BETTER_AUTH_URL`: URL for Better Auth

## Troubleshooting

### Common Issues and Solutions

#### Backend Import Issues
If you encounter import errors when starting the backend from the project root, use the helper script:
```bash
python run_backend.py
```

This script resolves Python path issues and allows the backend to be started from the project root without import problems.

#### Frontend localStorage Server-Side Errors
This project has been configured to prevent "localStorage is not defined" errors by:
- Wrapping all localStorage access in client-side checks
- Using the `storageUtils` helper to safely access browser APIs
- Marking all auth-related components with `'use client'` directive
- Ensuring all components that access browser APIs are properly designated as client components

#### Authentication Components
All authentication-related components are properly marked as client components:
- `src/app/login/page.tsx`
- `src/app/signup/page.tsx`
- `src/app/page.tsx` (Dashboard)
- `src/components/Header.tsx`
- `src/components/TaskList.tsx`
- `src/components/TaskCard.tsx`
- `src/lib/auth.ts` (uses safe localStorage access)
- `src/services/api.ts` (uses safe localStorage access)

### Development Tips
- Use the `run_backend.py` script from the project root to avoid Python import issues
- All auth-related functionality is contained in `src/lib/auth.ts` and `src/services/api.ts`
- Browser APIs are safely accessed using the `storageUtils` helper in `src/utils/storage.ts`

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

## License

This project is licensed under the MIT License.