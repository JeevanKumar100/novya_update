#!/usr/bin/env bash
set -e

# Wait for Postgres to be ready (use pg_isready if available)
echo "Waiting for Postgres..."
MAX_RETRIES=30
RETRY=0
until pg_isready -h "${POSTGRES_HOST:-postgres}" -p "${POSTGRES_PORT:-5432}" -U "${POSTGRES_USER:-postgres}" >/dev/null 2>&1; do
  RETRY=$((RETRY+1))
  if [ $RETRY -ge $MAX_RETRIES ]; then
    echo "Postgres did not become available after $MAX_RETRIES tries. Exiting."
    exit 1
  fi
  echo "Postgres isn't ready yet. Sleeping 2s (try: $RETRY/$MAX_RETRIES)..."
  sleep 2
done

echo "Postgres available, running migrations..."
# run migrations
python manage.py migrate --noinput

# collect static files (optional)
if [ "${COLLECTSTATIC:-true}" = "true" ]; then
  echo "Collecting static files..."
  python manage.py collectstatic --noinput || true
fi

# You can add other pre-start tasks here (e.g., create default users)

# finally start gunicorn
echo "Starting gunicorn..."
exec gunicorn config.wsgi:application --bind 0.0.0.0:8000 --workers 3 --timeout 120
