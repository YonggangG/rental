#!/bin/sh
set -e

if [ -n "$DATABASE_URL" ]; then
  echo "Applying database migrations..."
  npx prisma migrate deploy
  if [ -n "$ADMIN_EMAIL" ] && [ -n "$ADMIN_PASSWORD" ]; then
    echo "Seeding initial admin/template data..."
    npx tsx prisma/seed.ts
  fi
fi

exec "$@"
