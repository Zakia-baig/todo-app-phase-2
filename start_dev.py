#!/usr/bin/env python
"""
Development startup script for Todo App.

This script starts both backend and frontend servers simultaneously
with optimized settings for faster development.
"""

import subprocess
import sys
import os
import threading
import time
from pathlib import Path

def start_backend():
    """Start the backend server."""
    print("🚀 Starting backend server...")
    try:
        # Install updated dependencies first
        subprocess.run([sys.executable, "-m", "pip", "install", "-r", "backend/requirements.txt"],
                      cwd=".", shell=True)

        # Start backend server
        result = subprocess.run([
            sys.executable, "-m", "uvicorn",
            "src.main:app",
            "--host", "127.0.0.1",  # Changed from 0.0.0.0 for faster binding
            "--port", "8000",
            "--reload",  # Enable hot reload
            "--workers", "1"  # Single worker for development
        ], cwd="backend", shell=True)

        return result.returncode
    except Exception as e:
        print(f"❌ Backend startup failed: {e}")
        return 1

def start_frontend():
    """Start the frontend server."""
    print("🎯 Starting frontend server...")
    try:
        # Install dependencies if needed
        frontend_dir = Path("frontend")
        node_modules_exists = (frontend_dir / "node_modules").exists()

        if not node_modules_exists:
            print("📦 Installing frontend dependencies...")
            subprocess.run(["npm", "install"], cwd="frontend", shell=True)

        # Start frontend server
        result = subprocess.run([
            "npm", "run", "dev"
        ], cwd="frontend", shell=True)

        return result.returncode
    except Exception as e:
        print(f"❌ Frontend startup failed: {e}")
        return 1

def main():
    """Main function to start both servers."""
    print("🚀 Starting Todo App Development Environment...")
    print("🔧 Backend: http://127.0.0.1:8000")
    print("🎨 Frontend: http://localhost:3000")
    print("-" * 50)

    # Start both servers in separate threads
    backend_thread = threading.Thread(target=start_backend)
    frontend_thread = threading.Thread(target=start_frontend)

    # Start the threads
    backend_thread.start()
    time.sleep(2)  # Give backend a slight head start
    frontend_thread.start()

    # Wait for both threads to complete
    backend_thread.join()
    frontend_thread.join()

if __name__ == "__main__":
    main()