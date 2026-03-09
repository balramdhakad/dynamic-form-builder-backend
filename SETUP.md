# Form System — Setup Guide

Before you start, make sure you have **Node.js 20+**, **Docker Desktop**, and **Git** installed on your machine.

## 1. Clone the repo

```bash
git clone <your-repository-url>
cd form-system
```

## 2. Create your `.env` file

Create a `.env` file in the root of the project and paste this in, changing the password and JWT secret to something only you know:

```env
PORT=8080
NODE_ENV=development

POSTGRES_USER=admin
POSTGRES_PASSWORD=admin123
POSTGRES_DB=form_system
POSTGRES_PORT=5432
DATABASE_URL=postgresql://admin:admin123@localhost:5432/form_system
REDIS_HOST=localhost
REDIS_PORT=6379


JWT_SECRET=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2
JWT_EXPIRY=1d
```

## 3. Start the database

```bash
docker-compose up -d
```

Give it a few seconds, then run `docker ps` to confirm `postgres-forms` and `redis-forms` shows as `healthy`. If something looks off, `docker logs postgres-forms` will tell you why.

## 4. Install packages

```bash
npm install
```

## 5. Run the server

```bash
npm run dev
```

That's it. The server starts at **http://localhost:8080** and runs all database migrations automatically on first boot, so you don't need to do anything extra.

## Quick sanity check

Open a new terminal and hit the health endpoint:

```bash
curl http://localhost:8080/health
```

If you see `"status": "OK"` and `"postgres": "connected"` you're good to go.
