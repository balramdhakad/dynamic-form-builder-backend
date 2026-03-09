# Form System - Setup Guide

Before you start, make sure you have **Node.js 20+**, **Docker Desktop**, and **Git** installed on your machine.

## 1. Clone the repo

```bash
git clone https://github.com/balramdhakad/dynamic-form-builder-backend
cd dynamic-form-builder-backend
```

## 2. Create your `.env` file

Create a `.env` file in the root of the project and paste this in, changing the password and JWT secret to something only you know:

## note - take .env.sample as reference

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


JWT_SECRET=your_secret
JWT_EXPIRY=1d
```
<!-- create DATABASE_URL from values like POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DB, POSTGRES_PORT 
`postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@localhost:${POSTGRES_PORT}/
${POSTGRES_DB}`
-->

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
