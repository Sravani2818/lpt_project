# LPT Backend — Spring Boot (PS-25)

REST API with **JWT authentication**, **role-based access control**, and **CRUD** for courses, users, and progress. Uses **PostgreSQL** and matches the `lpt-dashboard` frontend contract.

## Rubric coverage

| Requirement | Implementation |
|-------------|----------------|
| JWT | `JwtService`, `JwtAuthFilter`, `POST /api/auth/login` |
| CRUD | Courses, Users, Progress controllers |
| RBAC | `@PreAuthorize` — `ROLE_LEARNER`, `ROLE_INSTRUCTOR`, `ROLE_ADMIN` |
| PostgreSQL | JPA entities + `lpt-database/schema.sql` |

## Prerequisites

- Java 17+
- PostgreSQL 16 (or Docker — see root `docker-compose.yml`)
- Maven 3.9+ (or run from IDE)

## Quick start

### 1. Start PostgreSQL

```powershell
cd C:\Users\srava\Projects
docker compose up -d
```

### 2. Run backend

```powershell
cd C:\Users\srava\Projects\lpt-backend
mvn spring-boot:run
```

API: http://localhost:8080

On first run, `DataInitializer` seeds roles, users, courses, and progress (same data as the React mock).

### 3. Demo logins

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@lpt.com | admin123 |
| Learner | learner@lpt.com | learner123 |
| Instructor | instructor@lpt.com | instructor123 |

## API endpoints

| Method | Path | Auth | Roles |
|--------|------|------|-------|
| POST | `/api/auth/login` | No | — |
| GET | `/api/auth/me` | JWT | All |
| GET | `/api/courses` | No | Public read |
| POST/PUT/DELETE | `/api/courses` | JWT | Instructor, Admin |
| GET | `/api/progress?userId=` | JWT | Learner (own), Instructor/Admin (all) |
| GET | `/api/progress/summary/{userId}` | JWT | Own or staff |
| POST/PUT | `/api/progress` | JWT | Staff / Learner update |
| GET | `/api/users` | JWT | Instructor, Admin |
| POST/PUT | `/api/users` | JWT | Admin |

### Login example

```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email_id\":\"learner@lpt.com\",\"password\":\"learner123\"}"
```

## Configuration

Environment variables (optional):

| Variable | Default |
|----------|---------|
| `DB_HOST` | localhost |
| `DB_PORT` | 5432 |
| `DB_NAME` | lpt_db |
| `DB_USER` | lpt_user |
| `DB_PASSWORD` | lpt_pass |
| `JWT_SECRET` | (see application.yml) |

## Project layout

```
src/main/java/com/lpt/
  config/       DataInitializer
  controller/   REST APIs
  dto/          Request/response records
  entity/       JPA models
  repository/   Spring Data JPA
  security/     JWT + SecurityConfig
  service/      Business logic
```
