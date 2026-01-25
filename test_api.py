import requests
import json

# Test script to verify the API is working correctly
BASE_URL = "http://127.0.0.1:8000"

def test_api():
    print("Testing API endpoints...")

    # Test health check
    try:
        response = requests.get(f"{BASE_URL}/health")
        print(f"Health check: {response.status_code} - {response.json()}")
    except Exception as e:
        print(f"Health check failed: {e}")

    # Test the route structure by checking if we get proper 401 for auth-required endpoints
    try:
        response = requests.get(f"{BASE_URL}/api/some-user-id/tasks")
        print(f"Test route (should be 401 Unauthorized): {response.status_code}")
    except Exception as e:
        print(f"Route test failed: {e}")

if __name__ == "__main__":
    test_api()