import requests
import json

BASE_URL = "http://localhost:8000"

def test_auth_apis():
    print("=== Testing Authentication APIs ===")
    
    # Test login (assuming superuser exists)
    login_data = {
        "username": "admin",
        "password": "admin123"
    }
    
    response = requests.post(f"{BASE_URL}/api/auth/login/", json=login_data)
    print(f"Login: {response.status_code} - {response.text}")
    
    if response.status_code == 200:
        token = response.json().get('token')
        headers = {'Authorization': f'Token {token}'}
        
        # Test token verification
        verify_response = requests.get(f"{BASE_URL}/api/auth/verify/", headers=headers)
        print(f"Verify Token: {verify_response.status_code} - {verify_response.text}")
        
        return token, headers
    
    return None, None

def test_tasks_apis(headers):
    print("\n=== Testing Tasks APIs ===")
    
    # Create task
    task_data = {
        "title": "Test Task",
        "description": "Test Description",
        "priority": "high",
        "status": "todo",
        "assigned_user": 1
    }
    
    response = requests.post(f"{BASE_URL}/api/tasks/", json=task_data, headers=headers)
    print(f"Create Task: {response.status_code} - {response.text}")
    
    # List tasks
    response = requests.get(f"{BASE_URL}/api/tasks/", headers=headers)
    print(f"List Tasks: {response.status_code} - {response.text}")
    
    if response.status_code == 200 and response.json():
        task_id = response.json()[0]['id']
        
        # Get specific task
        response = requests.get(f"{BASE_URL}/api/tasks/{task_id}/", headers=headers)
        print(f"Get Task: {response.status_code} - {response.text}")
        
        # Update task
        update_data = {"status": "in_progress"}
        response = requests.patch(f"{BASE_URL}/api/tasks/{task_id}/", json=update_data, headers=headers)
        print(f"Update Task: {response.status_code} - {response.text}")
        
        return task_id
    
    return None

def test_notifications_apis(headers):
    print("\n=== Testing Notifications APIs ===")
    
    # List notifications
    response = requests.get(f"{BASE_URL}/api/notifications/", headers=headers)
    print(f"List Notifications: {response.status_code} - {response.text}")

def test_filtering(headers):
    print("\n=== Testing Task Filtering ===")
    
    # Filter by priority
    response = requests.get(f"{BASE_URL}/api/tasks/?priority=high", headers=headers)
    print(f"Filter by Priority: {response.status_code} - {response.text}")
    
    # Filter by status
    response = requests.get(f"{BASE_URL}/api/tasks/?status=todo", headers=headers)
    print(f"Filter by Status: {response.status_code} - {response.text}")

def main():
    print("Starting API Tests...")
    
    # Test authentication
    token, headers = test_auth_apis()
    
    if not token:
        print("Authentication failed. Please ensure:")
        print("1. Services are running: docker-compose up")
        print("2. Migrations are applied")
        print("3. Superuser is created with username 'admin' and password 'admin123'")
        return
    
    # Test other APIs
    task_id = test_tasks_apis(headers)
    test_notifications_apis(headers)
    test_filtering(headers)
    
    print("\n=== API Tests Completed ===")

if __name__ == "__main__":
    main()