#!/usr/bin/env python
"""
Test script to verify authentication fix
"""
import requests
import json
import sys
import os

# Add backend to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'backend'))

def test_auth_flow():
    """Test the signup and login flow"""
    # Assuming the server is running on localhost:8000
    base_url = "http://localhost:8000/api/auth"

    print("Testing authentication flow...")

    # Create a test user
    test_email = f"test_{os.urandom(4).hex()}@example.com"
    test_password = "testpassword123"
    test_username = "testuser"

    print(f"Creating user with email: {test_email}")

    # Test signup
    signup_data = {
        "email": test_email,
        "username": test_username,
        "password": test_password
    }

    try:
        signup_response = requests.post(f"{base_url}/signup", json=signup_data)
        print(f"Signup response status: {signup_response.status_code}")

        if signup_response.status_code == 200:
            print("✓ Signup successful")
            signup_result = signup_response.json()
            print(f"Signup response keys: {list(signup_result.keys())}")
        else:
            print(f"✗ Signup failed: {signup_response.text}")
            return False

    except Exception as e:
        print(f"✗ Signup request failed: {e}")
        return False

    # Test login with the same credentials
    print(f"Attempting to login with email: {test_email}")

    login_data = {
        "email": test_email,
        "password": test_password
    }

    try:
        login_response = requests.post(f"{base_url}/login", json=login_data)
        print(f"Login response status: {login_response.status_code}")

        if login_response.status_code == 200:
            print("✓ Login successful!")
            login_result = login_response.json()
            print(f"Login response keys: {list(login_result.keys())}")

            if "access_token" in login_result:
                print("✓ Access token received")
                return True
            else:
                print("✗ No access token in response")
                return False
        else:
            print(f"✗ Login failed: {login_response.text}")
            return False

    except Exception as e:
        print(f"✗ Login request failed: {e}")
        return False

def main():
    print("Starting authentication flow test...")

    # Check if server is running
    try:
        response = requests.get("http://localhost:8000/health")
        if response.status_code == 200:
            print("✓ Server is running")
        else:
            print("✗ Server is not responding properly")
            print("Please start the backend server with: python run_backend.py")
            return
    except requests.ConnectionError:
        print("✗ Cannot connect to server")
        print("Please start the backend server with: python run_backend.py")
        return

    success = test_auth_flow()

    if success:
        print("\n✓ Authentication flow test PASSED!")
        print("Signup and login are working correctly.")
    else:
        print("\n✗ Authentication flow test FAILED!")
        print("There may still be issues with authentication.")

if __name__ == "__main__":
    main()