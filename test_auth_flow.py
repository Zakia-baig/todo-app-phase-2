#!/usr/bin/env python
"""
Test script to verify the authentication and task management flow.
This script tests the complete flow of user authentication and task management.
"""
import requests
import json

BASE_URL = "http://localhost:8000"

def test_auth_flow():
    print("Testing Authentication Flow...")

    # Test signup
    print("\n1. Testing Signup...")
    signup_data = {
        "email": "testuser@example.com",
        "password": "securepassword123",
        "first_name": "Test",
        "last_name": "User"
    }

    response = requests.post(f"{BASE_URL}/api/auth/signup", json=signup_data)
    if response.status_code == 200:
        print("[SUCCESS] Signup successful")
        signup_result = response.json()
        access_token = signup_result.get("access_token")
        user_id = signup_result["user"].get("id")
        print(f"  - User ID: {user_id}")
        print(f"  - Token: {access_token[:20]}..." if access_token else "  - No token received")
    elif response.status_code == 409 or "already exists" in response.text.lower():  # Handle duplicate user
        print("[INFO] User already exists, proceeding with login...")
        # Login with existing user instead
        login_data = {
            "email": "testuser@example.com",
            "password": "securepassword123"
        }
        login_response = requests.post(f"{BASE_URL}/api/auth/login", json=login_data)
        if login_response.status_code == 200:
            login_result = login_response.json()
            access_token = login_result.get("access_token")
            user_id = login_result.get("user_id")
            print(f"  - Retrieved User ID: {user_id}")
            print(f"  - Retrieved Token: {access_token[:20]}..." if access_token else "  - No token received")
        else:
            print(f"[ERROR] Login after failed signup: {login_response.text}")
            return False
    else:
        print(f"[ERROR] Signup failed: {response.text}")
        return False

    # Test login
    print("\n2. Testing Login...")
    login_data = {
        "email": "testuser@example.com",
        "password": "securepassword123"
    }

    response = requests.post(f"{BASE_URL}/api/auth/login", json=login_data)
    if response.status_code == 200:
        print("[SUCCESS] Login successful")
        login_result = response.json()
        access_token = login_result.get("access_token")
        user_id = login_result.get("user_id")
        print(f"  - User ID: {user_id}")
        print(f"  - Token: {access_token[:20]}..." if access_token else "  - No token received")
    else:
        print(f"[ERROR] Login failed: {response.text}")
        return False

    # Test creating a task
    print(f"\n3. Testing Task Creation for user {user_id}...")
    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json"
    }

    task_data = {
        "title": "Test Task from Script",
        "description": "This task was created by the test script",
        "user_id": user_id,
        "due_date": "2026-12-31T23:59:59"
    }

    response = requests.post(f"{BASE_URL}/api/{user_id}/tasks", json=task_data, headers=headers)
    if response.status_code == 200:
        print("[SUCCESS] Task creation successful")
        task_result = response.json()
        task_id = task_result.get("id")
        print(f"  - Task ID: {task_id}")
        print(f"  - Title: {task_result.get('title')}")
    else:
        print(f"[ERROR] Task creation failed: {response.text}")
        return False

    # Test getting tasks
    print(f"\n4. Testing Task Retrieval for user {user_id}...")
    response = requests.get(f"{BASE_URL}/api/{user_id}/tasks", headers=headers)
    if response.status_code == 200:
        print("[SUCCESS] Task retrieval successful")
        tasks = response.json()
        print(f"  - Number of tasks: {len(tasks)}")
        for i, task in enumerate(tasks):
            print(f"    Task {i+1}: {task.get('title')} (ID: {task.get('id')})")
    else:
        print(f"[ERROR] Task retrieval failed: {response.text}")
        return False

    # Test updating a task
    print(f"\n5. Testing Task Update for task {task_id}...")
    update_data = {
        "title": "Updated Test Task",
        "description": "This task was updated by the test script",
        "completed": True
    }

    response = requests.put(f"{BASE_URL}/api/{user_id}/tasks/{task_id}", json=update_data, headers=headers)
    if response.status_code == 200:
        print("[SUCCESS] Task update successful")
        updated_task = response.json()
        print(f"  - Updated title: {updated_task.get('title')}")
        print(f"  - Completed: {updated_task.get('completed')}")
    else:
        print(f"[ERROR] Task update failed: {response.text}")
        return False

    # Test getting the specific task
    print(f"\n6. Testing Specific Task Retrieval for task {task_id}...")
    response = requests.get(f"{BASE_URL}/api/{user_id}/{task_id}", headers=headers)
    if response.status_code == 200:
        print("[SUCCESS] Specific task retrieval successful")
        task_detail = response.json()
        print(f"  - Title: {task_detail.get('title')}")
        print(f"  - Completed: {task_detail.get('completed')}")
    else:
        print(f"[ERROR] Specific task retrieval failed: {response.text}")
        return False

    print("\n[SUCCESS] All tests passed! Authentication and task management flow is working correctly.")
    return True

if __name__ == "__main__":
    success = test_auth_flow()
    if success:
        print("\n[SUCCESS] Authentication and task management system is fully functional!")
    else:
        print("\n[ERROR] Some tests failed. Please check the backend configuration.")