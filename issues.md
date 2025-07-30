🛠️ Project Issues Log
This file lists all tracked issues for the modular Django backend + Next.js frontend project. Issues are grouped and described to aid planning and prioritization.

🧱 Architecture & Project Structure
✅ [ISSUE-001] Split Django Project into Independent Services
Description:
Decouple the monolithic Django app into three separate services: users, tasks, and notifications, each with its own manage.py, settings, and Docker container.

✅ [ISSUE-002] Setup API Gateway / Reverse Proxy
Description:
Configure NGINX (or Next.js backend proxy) to act as the single entrypoint and route requests to the appropriate Django service based on URL prefixes (e.g., /api/users/ → users-service).

🔐 [ISSUE-003] Central Authentication Service (JWT)
Description:
Implement a dedicated users service responsible for user registration, login, and JWT issuance. Other services must validate tokens via shared secret/public key.

🧰 Infrastructure & DevOps
🐳 [ISSUE-004] Dockerize Each Django Service
Description:
Create a separate Dockerfile and docker-compose.yml entry for each Django microservice (users, tasks, notifications). Share volumes and link shared services like Redis and PostgreSQL.

🌐 [ISSUE-005] Inter-Service Communication Strategy
Description:
Define how services talk to each other — use HTTP REST internally via gateway or explore message brokers (RabbitMQ/SQS) for decoupled async events like task-created → notify-user.

🔐 [ISSUE-006] Enable HTTPS in Development
Description:
Set up HTTPS locally using self-signed certs or mkcert for local testing of secure routes, WebSockets, and auth.

📦 [ISSUE-007] Add Redis for Caching and Channels
Description:
Configure a shared Redis instance for:

Django Channels backend

Celery broker

API-level caching in tasks service

🔁 [ISSUE-008] Add Celery to Task & Notification Services
Description:
Use Celery for background jobs like sending scheduled reminders, notifications, and async DB cleanups.

⚙️ Observability & Reliability
📊 [ISSUE-009] Implement Logging Across All Services
Description:
Use Python's logging or structlog in each service. Configure logs to be JSON-formatted and container-aware (stdout). Future-ready for ELK or Prometheus.

📈 [ISSUE-010] Add Prometheus Metrics Exporter (Optional)
Description:
Add Prometheus-compatible metrics to track API latency, request count, WebSocket connections, and cache hit ratio.

🧪 Testing & CI
🔄 [ISSUE-011] Setup Unit & Integration Tests per Service
Description:
Each service should include pytest or Django's native test suite, and have clear test coverage reports per service.

⚙️ [ISSUE-012] Setup GitHub Actions / GitLab CI Pipeline
Description:
Create a reusable CI pipeline that builds Docker images, runs tests, and verifies formatting & linting on every PR.

🖼️ Frontend-Specific
🧩 [ISSUE-013] Implement Next.js API Proxy
Description:
Configure Next.js to act as a proxy for all API routes (e.g., /api/tasks → internal tasks service) during development and production builds.

🔐 [ISSUE-014] Sync JWT Login State with Frontend
Description:
Integrate JWT flow between Next.js and users service. Store token securely in HTTP-only cookies or memory for SSR access.

📚 Documentation
📝 [ISSUE-015] Write Developer Onboarding Guide
Description:
Include a README.md for each microservice with run commands, API endpoints, environment variable examples, and local setup.

🧾 [ISSUE-016] Add API Specs for All Services
Description:
Document all endpoints (using Swagger/OpenAPI or Markdown) for users, tasks, and notifications services.
