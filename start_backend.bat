@echo off
echo Starting Todo App Backend...
echo.

REM Navigate to the project root
cd /d "%~dp0"

REM Run the Python backend script
python run_backend.py

pause