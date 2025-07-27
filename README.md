# Task Management System

A real-time task management application with **microservices architecture**, role-based permissions, advanced filtering, and WebSocket notifications.

## Architecture

- **🏗️ Microservices:** Independent containerized services
- **🌐 API Gateway:** Nginx-based request routing
- **🔐 Authentication:** Token-based with inter-service communication
- **📊 Logging:** Comprehensive DEBUG-level logging
- **🔄 Real-time:** WebSocket support via Django Channels

## Tech Stack

- **Backend:** Django REST Framework (Microservices)
- **Database:** PostgreSQL (3 separate instances)
- **Cache/WebSocket:** Redis + Django Channels
- **Gateway:** Nginx
- **Containerization:** Docker & Docker Compose

## Requirements

- Docker & Docker Compose
- Python 3.11+ (for local development)

## Quick Start

```bash
# Clone and navigate to project
cd "Task Management Software"

# Start all microservices
docker-compose up -d

# Run migrations for each service
docker-compose exec users-service python manage.py migrate
docker-compose exec tasks-service python manage.py makemigrations tasks && docker-compose exec tasks-service python manage.py migrate
docker-compose exec notifications-service python manage.py makemigrations notifications && docker-compose exec notifications-service python manage.py migrate

# Create superuser
docker-compose exec users-service python manage.py createsuperuser

# Test the APIs
python test_apis.py
```

API available at: `http://localhost:8000/api/`
WebSocket: `ws://localhost:8000/ws/tasks/`

## Microservices Architecture

```
backend/
├── services/
│   ├── users-service/         # Authentication & user management (Port 8001)
│   │   ├── users/
│   │   ├── settings.py
│   │   ├── manage.py
│   │   └── Dockerfile
│   ├── tasks-service/         # Task CRUD & WebSocket (Port 8002)
│   │   ├── tasks/
│   │   ├── settings.py
│   │   ├── asgi.py
│   │   └── Dockerfile
│   └── notifications-service/ # Notification system (Port 8003)
│       ├── notifications/
│       ├── settings.py
│       └── Dockerfile
└── gateway/                   # Nginx API Gateway (Port 8000)
    ├── nginx.conf
    └── Dockerfile

docker-compose.yml            # Orchestrates all services
```

## API Endpoints

All requests go through the **API Gateway** at `http://localhost:8000`

### Authentication Service

- `POST /api/auth/login/` - Login (returns token)
- `POST /api/auth/logout/` - Logout
- `GET /api/auth/verify/` - Verify token (internal)

### Tasks Service

- `GET /api/tasks/` - List tasks (with filtering)
- `POST /api/tasks/` - Create task
- `GET /api/tasks/{id}/` - Get task
- `PUT /api/tasks/{id}/` - Update task
- `DELETE /api/tasks/{id}/` - Delete task

**Query Parameters:**

- `due_date` - Filter by due date (YYYY-MM-DD)
- `priority` - Filter by priority (low/medium/high)
- `status` - Filter by status (todo/in_progress/completed)
- `assigned_user` - Filter by user ID

### Notifications Service

- `GET /api/notifications/` - List user notifications

## Database Schema

### Users Database (users_db)
**User**
```sql
- id (Primary Key)
- username (Unique)
- email
- role (admin/user)
- password (hashed)
- is_active, is_staff, is_superuser
- date_joined, last_login
```

### Tasks Database (tasks_db)
**Task**
```sql
- id (Primary Key)
- title
- description
- priority (low/medium/high)
- status (todo/in_progress/completed)
- due_date
- assigned_user (Integer - User ID reference)
- created_at
- updated_at
```

### Notifications Database (notifications_db)
**Notification**
```sql
- id (Primary Key)
- user (Integer - User ID reference)
- message
- is_read (Boolean)
- created_at
```

## Authentication

Include token in headers:
```
Authorization: Token your_token_here
```

### Inter-Service Authentication
- **Users Service:** Issues and verifies tokens
- **Tasks/Notifications Services:** Validate tokens via HTTP calls to users service
- **Authentication Middleware:** Intercepts requests and adds user data to request context

## Features

- **🔄 Auto-Notifications:** Tasks automatically create notifications via Django signals
- **🔍 Advanced Filtering:** Filter tasks by priority, status, due date, assigned user
- **🔐 Role-Based Access:** Admin and user roles with appropriate permissions
- **📱 RESTful APIs:** Complete CRUD operations for all resources
- **🐳 Containerized:** Full Docker setup with separate databases per service

## WebSocket Events (Planned)

Connect to `/ws/tasks/` to receive:
```json
{
  "type": "task_update",
  "action": "task_created|task_updated|task_deleted",
  "task": { /* task data */ }
}
```
*Note: WebSocket implementation is planned for future release*

## Service Communication

- **Gateway → Services:** HTTP proxy routing
- **Tasks/Notifications → Users:** HTTP API calls for authentication
- **Client → Gateway:** Single entry point for all requests

## Permissions

- **Admin:** Full access to all tasks across all services
- **User:** Access only to assigned tasks (enforced per service)

## Logging

- **Level:** DEBUG (all log messages)
- **Format:** `{levelname} {asctime} {module} {message}`
- **Output:** Console (visible in Docker logs)
- **Services:** Individual logging per microservice

## Development

```bash
# View logs for specific service
docker-compose logs users-service
docker-compose logs tasks-service
docker-compose logs notifications-service
docker-compose logs gateway

# Scale individual services
docker-compose up --scale tasks-service=2

# Restart specific service
docker-compose restart users-service
```
