#!/usr/bin/env python
"""
Backend server startup script for Todo App.

This script allows the backend to be started from the project root
without import issues.
"""

import subprocess
import sys
import os

if __name__ == "__main__":
    # Get port from environment variable or default to 8000
    port = int(os.getenv("PORT", 8000))

    # Install updated dependencies first
    print("[INFO] Installing/updating backend dependencies...")
    subprocess.run([sys.executable, "-m", "pip", "install", "-r", "backend/requirements.txt"],
                  cwd=".", shell=True)

    # Run the server using python -m from the backend/src directory
    print(f"[INFO] Starting backend server on http://127.0.0.1:{port}...")
    result = subprocess.run([
        sys.executable, "-m", "uvicorn",
        "src.main:app",
        "--host", "127.0.0.1",  # Changed for faster binding
        "--port", str(port),
        "--reload",
        "--workers", "1"  # Single worker for development
    ], cwd="backend", shell=True)  # Use shell=True for Windows compatibility

    sys.exit(result.returncode)