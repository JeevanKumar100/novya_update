# ai_backend/Dockerfile
FROM python:3.11-slim

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential && rm -rf /var/lib/apt/lists/*

# since build context is ./backend/ai_backend, requirements.txt is at the root of that context
COPY requirements.txt ./requirements.txt
RUN pip install --upgrade pip
RUN pip install -r ./requirements.txt

COPY . ./

EXPOSE 5000
# adjust command to how your app exposes WSGI/ASGI app; if Flask app variable is 'app' in app.py:
CMD ["gunicorn", "app:app", "--bind", "0.0.0.0:5000", "--workers", "2"]
