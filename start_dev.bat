@echo off
REM Batch script to start both backend and frontend servers

echo 🚀 Starting Todo App Development Environment...
echo 🔧 Backend: http://127.0.0.1:8000
echo 🎨 Frontend: http://localhost:3000
echo ----------------------------------------

REM Start backend in a new window using the run_backend.py script
start cmd /k "python run_backend.py"

REM Give backend a moment to start
timeout /t 5 /nobreak >nul

REM Start frontend in a new window
if exist frontend (
    cd frontend
    if exist node_modules (
        echo Found node_modules, starting frontend...
        start cmd /k "npm run dev"
    ) else (
        echo Installing frontend dependencies...
        npm install
        start cmd /k "npm run dev"
    )
    cd ..
) else (
    echo Frontend directory not found!
)

echo Both servers should be starting...
echo Backend: http://127.0.0.1:8000
echo Frontend: http://localhost:3000
pause