# Backend Dockerfile - production-ready using Gunicorn
FROM python:3.11-slim as base

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

# system deps for some packages (e.g., compiling or runtime libs)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    gcc \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt ./
# If your requirements file is under backend/requirements.txt with fence markers, ensure it's raw list in production.
RUN pip install --upgrade pip setuptools wheel
RUN pip install --no-cache-dir -r requirements.txt

COPY . /app

# Use Gunicorn to serve the Flask app
ENV FLASK_APP=app.py
# Allow Render or other platforms to override the port
ENV PORT=5050
EXPOSE $PORT

CMD ["sh", "-c", "gunicorn -w 4 -b 0.0.0.0:${PORT} app:app"]
