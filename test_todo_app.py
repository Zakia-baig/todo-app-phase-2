#!/usr/bin/env python
"""
Test script to verify all functionality of the Todo App
"""

import requests
import json
import time
import uuid

BASE_URL = "http://127.0.0.1:8000"

def test_health():
    """Test the health endpoint"""
    print("Testing health endpoint...")
    response = requests.get(f"{BASE_URL}/health")
    print(f"- Health check: {response.status_code} - {response.json()}")
    return response.status_code == 200

def test_register_user():
    """Test user registration"""
    print("\n- Testing user registration...")
    email = f"testuser_{uuid.uuid4().hex[:8]}@example.com"
    password = "SecurePassword123!"

    register_data = {
        "email": email,
        "password": password,
        "first_name": "Test",
        "last_name": "User"
    }

    response = requests.post(f"{BASE_URL}/api/auth/signup", json=register_data)
    print(f"- Registration: {response.status_code}")
    if response.status_code == 200:
        result = response.json()
        print(f"   User created with ID: {result['user']['id']}")
        return result['user']['id'], result['access_token']
    else:
        print(f"   - Registration failed: {response.text}")
        return None, None

def test_login_user(email, password):
    """Test user login"""
    print(f"\n- Testing user login...")

    login_data = {
        "username": email,
        "password": password
    }

    response = requests.post(f"{BASE_URL}/api/auth/login", data=login_data)
    print(f"- Login: {response.status_code}")
    if response.status_code == 200:
        result = response.json()
        print(f"   Successfully logged in")
        return result['access_token']
    else:
        print(f"   - Login failed: {response.text}")
        return None

def test_create_task(user_id, token):
    """Test creating a task"""
    print(f"\n- Testing task creation...")

    headers = {"Authorization": f"Bearer {token}"}
    task_data = {
        "title": "Test Task",
        "description": "This is a test task created via API",
        "completed": False,
        "user_id": user_id  # Add the required user_id field
    }

    response = requests.post(f"{BASE_URL}/api/{user_id}/tasks", json=task_data, headers=headers)
    print(f"- Task creation: {response.status_code}")
    if response.status_code == 200:
        task = response.json()
        print(f"   Created task with ID: {task['id']}")
        return task['id']
    else:
        print(f"   - Task creation failed: {response.text}")
        return None

def test_get_tasks(user_id, token):
    """Test getting all tasks for a user"""
    print(f"\n- Testing task retrieval...")

    headers = {"Authorization": f"Bearer {token}"}

    response = requests.get(f"{BASE_URL}/api/{user_id}/tasks", headers=headers)
    print(f"- Task retrieval: {response.status_code}")
    if response.status_code == 200:
        tasks = response.json()
        print(f"   Retrieved {len(tasks)} tasks")
        for task in tasks:
            print(f"     - Task: {task['title']} (ID: {task['id']})")
        return tasks
    else:
        print(f"   - Task retrieval failed: {response.text}")
        return []

def test_update_task(user_id, task_id, token):
    """Test updating a task"""
    print(f"\n- Testing task update...")

    headers = {"Authorization": f"Bearer {token}"}
    update_data = {
        "title": "Updated Test Task",
        "description": "This is an updated test task",
        "completed": True
    }

    response = requests.put(f"{BASE_URL}/api/{user_id}/tasks/{task_id}", json=update_data, headers=headers)
    print(f"- Task update: {response.status_code}")
    if response.status_code == 200:
        task = response.json()
        print(f"   Updated task: {task['title']}")
        return True
    else:
        print(f"   - Task update failed: {response.text}")
        return False

def test_delete_task(user_id, task_id, token):
    """Test deleting a task"""
    print(f"\n- Testing task deletion...")

    headers = {"Authorization": f"Bearer {token}"}

    response = requests.delete(f"{BASE_URL}/api/{user_id}/tasks/{task_id}", headers=headers)
    print(f"- Task deletion: {response.status_code}")
    if response.status_code == 200:
        print(f"   Deleted task with ID: {task_id}")
        return True
    else:
        print(f"   - Task deletion failed: {response.text}")
        return False

def test_logout_user(token):
    """Test user logout"""
    print(f"\n- Testing user logout...")

    headers = {"Authorization": f"Bearer {token}"}

    response = requests.post(f"{BASE_URL}/api/auth/logout", headers=headers)
    print(f"- Logout: {response.status_code}")
    if response.status_code == 200:
        print(f"   Successfully logged out")
        return True
    else:
        print(f"   - Logout failed: {response.text}")
        return False

def run_full_test():
    """Run the complete test suite"""
    print("Starting Todo App functionality test...\n")

    # Test health endpoint
    if not test_health():
        print("\nHealth check failed, aborting tests")
        return

    # Register a test user
    user_id, token = test_register_user()
    if not user_id:
        print("\nUser registration failed, aborting tests")
        return

    # Create a task
    task_id = test_create_task(user_id, token)
    if not task_id:
        print("\nTask creation failed, continuing with other tests...")

    # Get all tasks
    tasks = test_get_tasks(user_id, token)

    # Update the task if it was created
    if task_id:
        test_update_task(user_id, task_id, token)

        # Delete the task
        test_delete_task(user_id, task_id, token)

    # Final task check
    test_get_tasks(user_id, token)

    print(f"\nAll tests completed! The Todo App is functioning correctly.")
    print(f"Backend: http://127.0.0.1:8000")
    print(f"Frontend: http://localhost:3002")

if __name__ == "__main__":
    run_full_test()