#!/usr/bin/env python3
"""
Production-ready startup script for the Todo App backend
"""

import uvicorn
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

if __name__ == "__main__":
    # Configuration for production
    uvicorn.run(
        "src.main:app",
        host=os.getenv("HOST", "127.0.0.1"),
        port=int(os.getenv("PORT", 8000)),
        reload=os.getenv("DEV_MODE", "false").lower() == "true",
        workers=int(os.getenv("WORKERS", 1)),  # Increase for production
        log_level=os.getenv("LOG_LEVEL", "info"),
        timeout_keep_alive=30,
        lifespan="on"
    )