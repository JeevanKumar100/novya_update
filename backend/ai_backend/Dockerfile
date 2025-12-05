# ai_backend/Dockerfile
FROM python:3.11-slim

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential && rm -rf /var/lib/apt/lists/*

COPY ai_backend/requirements.txt ./requirements.txt
RUN pip install --upgrade pip
RUN pip install -r ./requirements.txt

COPY ai_backend/ ./

EXPOSE 5000
# assuming app.py uses 'app' variable and uses gunicorn or uvicorn; choose accordingly
CMD ["gunicorn", "app:app", "--bind", "0.0.0.0:5000", "--workers", "2"]
