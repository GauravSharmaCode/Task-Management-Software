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

        # Test logout
        logout_response = requests.post(f"{BASE_URL}/api/auth/logout/", headers=headers)
        print(f"Logout: {logout_response.status_code} - {logout_response.text}")
        # Re-login for further tests
        response = requests.post(f"{BASE_URL}/api/auth/login/", json=login_data)
        token = response.json().get('token')
        headers = {'Authorization': f'Token {token}'}
        
        return token, headers
    
    return None, None

def test_tasks_apis(headers):
    print("\n=== Testing Tasks APIs ===")
    
    # Fetch users for assignment
    users_resp = requests.get(f"{BASE_URL}/api/auth/users/", headers=headers)
    print(f"List Users: {users_resp.status_code} - {users_resp.text}")
    assigned_user = None
    if users_resp.status_code == 200 and users_resp.json():
        assigned_user = users_resp.json()[0]['id']
    else:
        print("No users found for assignment.")
        return None

    # Create task
    task_data = {
        "title": "Test Task",
        "description": "Test Description",
        "priority": "high",
        "status": "todo",
        "assigned_user": assigned_user
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

        # Delete task
        del_resp = requests.delete(f"{BASE_URL}/api/tasks/{task_id}/", headers=headers)
        print(f"Delete Task: {del_resp.status_code} - {del_resp.text}")

        return task_id
    return None

def test_notifications_apis(headers):
    print("\n=== Testing Notifications APIs ===")
    
    # List notifications
    response = requests.get(f"{BASE_URL}/api/notifications/", headers=headers)
    print(f"List Notifications: {response.status_code} - {response.text}")

    if response.status_code == 200 and response.json():
        notif = response.json()[0]
        notif_id = notif['id']
        # Mark as read
        mark_resp = requests.put(f"{BASE_URL}/api/notifications/{notif_id}/", json={"is_read": True}, headers=headers)
        print(f"Mark Notification as Read: {mark_resp.status_code} - {mark_resp.text}")

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

    # Test 401 Unauthorized (invalid token)
    print("\n=== Testing 401 Unauthorized Handling ===")
    bad_headers = {'Authorization': 'Token invalidtoken123'}
    resp = requests.get(f"{BASE_URL}/api/tasks/", headers=bad_headers)
    print(f"401 Test: {resp.status_code} - {resp.text}")
    
    print("\n=== API Tests Completed ===")

if __name__ == "__main__":
    main()