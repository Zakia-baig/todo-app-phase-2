import requests
import json

# Test the authentication flow
BASE_URL = "http://127.0.0.1:8000/api/auth"

# Generate a unique test email
import time
timestamp = int(time.time())
test_email = f"testuser_{timestamp}@example.com"
test_password = "testpassword123"

print(f"Testing signup and login with email: {test_email}")

# Step 1: Test signup
print("\n1. Testing signup...")
signup_data = {
    "email": test_email,
    "password": test_password,
    "username": "testuser"
}

try:
    signup_response = requests.post(f"{BASE_URL}/signup", json=signup_data)
    print(f"Signup response status: {signup_response.status_code}")
    print(f"Signup response: {signup_response.json()}")

    if signup_response.status_code != 200:
        print("Signup failed!")
        exit(1)

    print("Signup successful!")

except Exception as e:
    print(f"Signup error: {e}")
    exit(1)

# Step 2: Test login with the same credentials
print("\n2. Testing login with the same credentials...")
login_data = {
    "email": test_email,
    "password": test_password
}

try:
    login_response = requests.post(f"{BASE_URL}/login", json=login_data)
    print(f"Login response status: {login_response.status_code}")

    if login_response.status_code == 200:
        print(f"Login response: {login_response.json()}")
        print("LOGIN SUCCESSFUL! The signup → login flow is working correctly.")
    else:
        print(f"Login failed! Response: {login_response.text}")
        print("This indicates the authentication bug still exists.")

except Exception as e:
    print(f"Login error: {e}")

print("\nTest completed.")