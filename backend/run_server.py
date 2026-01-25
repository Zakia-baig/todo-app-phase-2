#!/usr/bin/env python
"""
Backend server startup script for Todo App.

This script allows the backend to be started from the project root
without import issues.
"""

import sys
import os
from pathlib import Path

# Add the backend/src directory to the Python path so imports work correctly
backend_dir = Path(__file__).parent
src_dir = backend_dir / "src"
sys.path.insert(0, str(src_dir))

# Change to the src directory to ensure relative imports work correctly
original_cwd = os.getcwd()
os.chdir(src_dir)

try:
    if __name__ == "__main__":
        import uvicorn

        # Get port from environment variable or default to 8000
        port = int(os.getenv("PORT", 8000))

        # Run the server using the proper module path
        uvicorn.run(
            "main:app",  # Reference the app from the main module in src directory
            host="0.0.0.0",
            port=port,
            reload=True,  # Enable auto-reload for development
            reload_dirs=[str(src_dir)],
        )
finally:
    # Restore original working directory
    os.chdir(original_cwd)