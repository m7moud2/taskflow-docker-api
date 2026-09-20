# TaskFlow Docker API

![Docker](https://img.shields.io/badge/Docker-29.0-blue?logo=docker&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-22.x-green?logo=nodedotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?logo=postgresql&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-7-DC382D?logo=redis&logoColor=white)
![Nginx](https://img.shields.io/badge/Nginx-1.25-009639?logo=nginx&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-green)

A production-ready containerized RESTful API microservice built with **TypeScript**, **Node.js**, **PostgreSQL**, **Redis**, and **Nginx**.

This project showcases modern containerization techniques including multi-stage Docker builds, non-root container security, service health checking, volume persistence, caching strategies, and reverse proxy setup.

---

## 🏛️ Architecture Overview

```
                         +-------------------+
                         |    HTTP Client    |
                         +---------+---------+
                                   |
                                   v (Port 80)
                         +-------------------+
                         |    Nginx Proxy    |
                         +---------+---------+
                                   |
                                   v /api/v1
                         +-------------------+
                         | Node.js TS App    |
                         +----+---------+----+
                              |         |
            (Query & Cache)   |         |   (Data Persistence)
                              v         v
                         +-------+   +------------+
                         | Redis |   | PostgreSQL |
                         +-------+   +------------+
```

### Key Components

- **Reverse Proxy**: Nginx handles incoming HTTP traffic on port 80, applies security headers, gzip compression, and proxies `/api` requests to the Node.js backend.
- **Application Server**: Node.js & Express written in TypeScript. Handles REST routing, business logic, and database operations.
- **Data Storage**: PostgreSQL 16 database for persistent task metadata with automated schema initialization scripts.
- **Cache & Rate Limiter**: Redis 7 sliding-window rate limiting middleware and response caching to minimize database load.
- **CI/CD Pipeline**: GitHub Actions workflow verifying TypeScript compilation, unit test execution, and Docker build compliance on every commit.

---

## 🚀 Quick Start

### Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (v24.0+)
- [Docker Compose](https://docs.docker.com/compose/) (v2.20+)
- Node.js v22+ (Optional, for local development outside Docker)

### Running with Docker Compose

1. **Clone the repository:**
   ```bash
   git clone https://github.com/m7moud2/taskflow-docker-api.git
   cd taskflow-docker-api
   ```

2. **Copy environment variables file:**
   ```bash
   cp .env.example .env
   ```

3. **Start all services:**
   ```bash
   docker compose up --build -d
   ```

4. **Verify container status:**
   ```bash
   docker compose ps
   ```

All 4 services (`nginx`, `app`, `postgres`, `redis`) should be up and healthy.

5. **Access the Application:**
   - Landing Dashboard: [http://localhost](http://localhost)
   - Healthcheck Endpoint: [http://localhost/api/v1/health](http://localhost/api/v1/health)
   - Tasks API Endpoint: [http://localhost/api/v1/tasks](http://localhost/api/v1/tasks)

---

## 🛠️ Makefile Commands

For convenience, a `Makefile` is included to streamline container operations:

| Command | Description |
| :--- | :--- |
| `make up` | Start containers in background mode |
| `make down` | Stop and remove running containers |
| `make build` | Rebuild images and start containers |
| `make logs` | Stream logs from all services |
| `make ps` | Display running container status and health |
| `make clean` | Stop containers and wipe volume data |
| `make test` | Run test suite locally |

---

## 📡 API Reference

### Healthcheck

#### `GET /api/v1/health`
Returns system status, database/redis connectivity, uptime, and memory usage.

```json
{
  "status": "healthy",
  "timestamp": "2026-09-20T06:45:00.000Z",
  "uptime": 142.5,
  "services": {
    "database": "up",
    "redis": "up"
  },
  "memory": {
    "rss": "64 MB",
    "heapUsed": "32 MB"
  }
}
```

### Tasks CRUD

#### `GET /api/v1/tasks`
Fetch all tasks. Uses Redis caching for high performance.

#### `GET /api/v1/tasks/:id`
Fetch a specific task by ID.

#### `POST /api/v1/tasks`
Create a new task.

```json
{
  "title": "Configure SSL Certificate",
  "description": "Setup Certbot for HTTPS termination",
  "priority": "high",
  "status": "pending"
}
```

#### `PUT /api/v1/tasks/:id`
Update an existing task status or details.

#### `DELETE /api/v1/tasks/:id`
Remove a task by ID. Automatically invalidates cached queries in Redis.

---

## 🔒 Security & Best Practices

- **Non-root Container Context**: Dockerfile specifies `USER node` to prevent root privilege escalation inside containers.
- **Multi-Stage Builds**: Separates build tools from the final runtime image, resulting in lightweight final images.
- **Health Checks**: Automated probes defined in both `Dockerfile` and `docker-compose.yml` to ensure dependant services boot in order (`service_healthy`).
- **Rate Limiting**: Custom Redis-backed middleware limits client requests to prevent abuse.
- **Clean Architecture**: Separates controllers, middlewares, routes, database access, and configuration settings.

---

## 🧪 Testing

Run unit and integration tests locally or inside Docker:

```bash
npm test
```

---

## 📄 License

Distributed under the MIT License.
