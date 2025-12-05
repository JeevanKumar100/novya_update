# backend/Dockerfile
FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

# system deps for psycopg2 and other compiled libs
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential libpq-dev gcc && rm -rf /var/lib/apt/lists/*

# NOTE: since build context is ./backend, requirements.txt is at the root of the context
COPY requirements.txt ./requirements.txt
RUN pip install --upgrade pip
RUN pip install -r ./requirements.txt

# copy entire backend context into container
COPY . ./

EXPOSE 8000
CMD ["gunicorn", "config.wsgi:application", "--bind", "0.0.0.0:8000", "--workers", "3", "--timeout", "120"]
