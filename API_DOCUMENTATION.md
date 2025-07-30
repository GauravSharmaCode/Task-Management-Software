# Task Management System - API Documentation

## Overview

The Task Management System provides a RESTful API with microservices architecture. All requests go through the API Gateway at `http://localhost:8000`.

## Base URL
```
http://localhost:8000/api/
```

## Authentication

The API uses Token-based authentication. Include the token in the Authorization header:

```http
Authorization: Token your_token_here
```

### Get Authentication Token

**POST** `/auth/login/`

**Request Body:**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Response:**
```json
{
  "token": "5c7ec77473e7ce465e6b9ce3fbe1d4c824d80774",
  "user": {
    "id": 1,
    "username": "admin",
    "email": "admin@test.com",
    "role": "admin"
  }
}
```

**Status Codes:**
- `200 OK` - Login successful
- `400 Bad Request` - Invalid credentials
- `401 Unauthorized` - Authentication failed

---

## Authentication Endpoints

### Login
**POST** `/auth/login/`

Authenticates user and returns access token.

**Request:**
```json
{
  "username": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "token": "string",
  "user": {
    "id": "integer",
    "username": "string",
    "email": "string",
    "role": "string"
  }
}
```

### Logout
**POST** `/auth/logout/`

**Headers:** `Authorization: Token {token}`

**Response:**
```json
{
  "message": "Logged out successfully"
}
```

### Verify Token
**GET** `/auth/verify/`

**Headers:** `Authorization: Token {token}`

**Response:**
```json
{
  "id": 1,
  "username": "admin",
  "email": "admin@test.com",
  "role": "admin"
}
```

---

## Tasks Endpoints

### List Tasks
**GET** `/tasks/`

**Headers:** `Authorization: Token {token}`

**Query Parameters:**
- `due_date` (optional) - Filter by due date (YYYY-MM-DD)
- `priority` (optional) - Filter by priority (`low`, `medium`, `high`)
- `status` (optional) - Filter by status (`todo`, `in_progress`, `completed`)
- `assigned_user` (optional) - Filter by user ID

**Example Request:**
```http
GET /api/tasks/?status=todo&priority=high
Authorization: Token 5c7ec77473e7ce465e6b9ce3fbe1d4c824d80774
```

**Response:**
```json
[
  {
    "id": 1,
    "title": "Complete API Documentation",
    "description": "Write comprehensive API docs",
    "priority": "high",
    "status": "todo",
    "due_date": "2025-08-01",
    "assigned_user": 1,
    "created_at": "2025-07-30T10:00:00Z",
    "updated_at": "2025-07-30T10:00:00Z"
  }
]
```

### Create Task
**POST** `/tasks/`

**Headers:** `Authorization: Token {token}`

**Request Body:**
```json
{
  "title": "New Task",
  "description": "Task description",
  "priority": "medium",
  "status": "todo",
  "due_date": "2025-08-01",
  "assigned_user": 1
}
```

**Response:**
```json
{
  "id": 2,
  "title": "New Task",
  "description": "Task description",
  "priority": "medium",
  "status": "todo",
  "due_date": "2025-08-01",
  "assigned_user": 1,
  "created_at": "2025-07-30T10:30:00Z",
  "updated_at": "2025-07-30T10:30:00Z"
}
```

**Status Codes:**
- `201 Created` - Task created successfully
- `400 Bad Request` - Invalid data
- `401 Unauthorized` - Authentication required

### Get Task
**GET** `/tasks/{id}/`

**Headers:** `Authorization: Token {token}`

**Response:**
```json
{
  "id": 1,
  "title": "Complete API Documentation",
  "description": "Write comprehensive API docs",
  "priority": "high",
  "status": "todo",
  "due_date": "2025-08-01",
  "assigned_user": 1,
  "created_at": "2025-07-30T10:00:00Z",
  "updated_at": "2025-07-30T10:00:00Z"
}
```

### Update Task
**PUT** `/tasks/{id}/`

**Headers:** `Authorization: Token {token}`

**Request Body:**
```json
{
  "title": "Updated Task Title",
  "description": "Updated description",
  "priority": "low",
  "status": "in_progress",
  "due_date": "2025-08-05",
  "assigned_user": 2
}
```

**Response:**
```json
{
  "id": 1,
  "title": "Updated Task Title",
  "description": "Updated description",
  "priority": "low",
  "status": "in_progress",
  "due_date": "2025-08-05",
  "assigned_user": 2,
  "created_at": "2025-07-30T10:00:00Z",
  "updated_at": "2025-07-30T11:00:00Z"
}
```

### Partial Update Task
**PATCH** `/tasks/{id}/`

**Headers:** `Authorization: Token {token}`

**Request Body:**
```json
{
  "status": "completed"
}
```

**Response:**
```json
{
  "id": 1,
  "title": "Complete API Documentation",
  "description": "Write comprehensive API docs",
  "priority": "high",
  "status": "completed",
  "due_date": "2025-08-01",
  "assigned_user": 1,
  "created_at": "2025-07-30T10:00:00Z",
  "updated_at": "2025-07-30T11:30:00Z"
}
```

### Delete Task
**DELETE** `/tasks/{id}/`

**Headers:** `Authorization: Token {token}`

**Response:**
```json
{
  "message": "Task deleted successfully"
}
```

**Status Codes:**
- `204 No Content` - Task deleted successfully
- `404 Not Found` - Task not found
- `403 Forbidden` - No permission to delete

---

## Notifications Endpoints

### List Notifications
**GET** `/notifications/`

**Headers:** `Authorization: Token {token}`

**Response:**
```json
[
  {
    "id": 1,
    "user": 1,
    "message": "New task created: Complete API Documentation",
    "is_read": false,
    "created_at": "2025-07-30T10:00:00Z"
  },
  {
    "id": 2,
    "user": 1,
    "message": "Task updated: Complete API Documentation",
    "is_read": true,
    "created_at": "2025-07-30T10:30:00Z"
  }
]
```

### Mark Notification as Read
**PATCH** `/notifications/{id}/`

**Headers:** `Authorization: Token {token}`

**Request Body:**
```json
{
  "is_read": true
}
```

**Response:**
```json
{
  "id": 1,
  "user": 1,
  "message": "New task created: Complete API Documentation",
  "is_read": true,
  "created_at": "2025-07-30T10:00:00Z"
}
```

---

## Data Models

### User
```json
{
  "id": "integer",
  "username": "string",
  "email": "string",
  "role": "string (admin|user)"
}
```

### Task
```json
{
  "id": "integer",
  "title": "string (max 200 chars)",
  "description": "string (optional)",
  "priority": "string (low|medium|high)",
  "status": "string (todo|in_progress|completed)",
  "due_date": "string (YYYY-MM-DD)",
  "assigned_user": "integer (User ID)",
  "created_at": "string (ISO 8601)",
  "updated_at": "string (ISO 8601)"
}
```

### Notification
```json
{
  "id": "integer",
  "user": "integer (User ID)",
  "message": "string (max 255 chars)",
  "is_read": "boolean",
  "created_at": "string (ISO 8601)"
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "error": "Invalid data provided",
  "details": {
    "field_name": ["This field is required."]
  }
}
```

### 401 Unauthorized
```json
{
  "error": "Authentication credentials were not provided."
}
```

### 403 Forbidden
```json
{
  "error": "You do not have permission to perform this action."
}
```

### 404 Not Found
```json
{
  "error": "Not found."
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error"
}
```

---

## Rate Limiting

Currently no rate limiting is implemented. In production, consider implementing rate limiting to prevent abuse.

## WebSocket Support

WebSocket connections are planned for real-time notifications:
- **Endpoint:** `ws://localhost:8000/ws/notifications/`
- **Authentication:** Include user_id in query parameters
- **Events:** Real-time notification updates

---

## Example Usage

### Complete Task Workflow

1. **Login:**
```bash
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "admin123"}'
```

2. **Create Task:**
```bash
curl -X POST http://localhost:8000/api/tasks/ \
  -H "Authorization: Token your_token_here" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "New Task",
    "description": "Task description",
    "priority": "high",
    "status": "todo",
    "due_date": "2025-08-01",
    "assigned_user": 1
  }'
```

3. **Update Task Status:**
```bash
curl -X PATCH http://localhost:8000/api/tasks/1/ \
  -H "Authorization: Token your_token_here" \
  -H "Content-Type: application/json" \
  -d '{"status": "completed"}'
```

4. **Get Notifications:**
```bash
curl -X GET http://localhost:8000/api/notifications/ \
  -H "Authorization: Token your_token_here"
```