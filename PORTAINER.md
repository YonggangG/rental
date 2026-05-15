# Portainer Deployment Guide

This project is designed to run as a Portainer Stack with one app container and one PostgreSQL container.

## Image

```text
ghcr.io/yonggangg/rental:latest
```

## Quick Stack Setup

1. In Portainer, open **Stacks** → **Add stack**.
2. Name the stack `rental`.
3. Paste the contents of `docker-compose.portainer.yml`.
4. Add the required environment variables.
5. Deploy the stack.
6. Open `APP_URL`, or use the mapped server port such as `http://server-ip:3000`.

## Required Environment Variables

```env
APP_URL=https://your-domain.example.com
NEXTAUTH_URL=https://your-domain.example.com
NEXTAUTH_SECRET=replace-with-long-random-secret
POSTGRES_DB=rental
POSTGRES_USER=rental
POSTGRES_PASSWORD=replace-with-strong-password
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=replace-with-temporary-admin-password
ADMIN_NAME=Landlord Admin
```

Generate a strong secret:

```bash
openssl rand -base64 32
```

## Stack File

Use `docker-compose.portainer.yml`:

```yaml
services:
  app:
    image: ghcr.io/yonggangg/rental:latest
    ports:
      - "3000:3000"
    environment:
      APP_URL: ${APP_URL}
      NEXTAUTH_URL: ${NEXTAUTH_URL}
      NEXTAUTH_SECRET: ${NEXTAUTH_SECRET}
      DATABASE_URL: "postgresql://rental:${POSTGRES_PASSWORD}@db:5432/rental?schema=public"
      ADMIN_EMAIL: ${ADMIN_EMAIL}
      ADMIN_PASSWORD: ${ADMIN_PASSWORD}
      ADMIN_NAME: ${ADMIN_NAME}
    depends_on:
      db:
        condition: service_healthy
    restart: unless-stopped

  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: "rental"
      POSTGRES_USER: "rental"
      POSTGRES_PASSWORD: "${POSTGRES_PASSWORD}"
    volumes:
      - rental_postgres:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U rental -d rental"]
      interval: 10s
      timeout: 5s
      retries: 5
    restart: unless-stopped

volumes:
  rental_postgres:
```

## First Deployment Notes

- On startup, the app container runs Prisma migrations.
- If `ADMIN_EMAIL` and `ADMIN_PASSWORD` are set, it seeds the initial admin user and lease template.
- Change the temporary admin password after the full auth/account UI is implemented.
- The database is stored in the named Docker volume `rental_postgres`.

## GHCR Access

If the GHCR package is public, Portainer does not need registry credentials.

If the package is private later:

1. In Portainer, go to **Registries**.
2. Add registry `ghcr.io`.
3. Use your GitHub username and a PAT with package read permission.
4. Redeploy the stack.

## Upgrade Flow

When a new image is published:

1. Open the `rental` stack in Portainer.
2. Pull latest image / redeploy the stack.
3. The app will apply migrations on startup.

## Backup Reminder

Back up PostgreSQL before major upgrades. Example from the server:

```bash
docker exec -t <postgres-container> pg_dump -U rental rental > rental-backup.sql
```
