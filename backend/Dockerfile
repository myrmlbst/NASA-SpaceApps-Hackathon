# backend/Dockerfile  (build context = repo root in App Runner)
FROM python:3.11-slim AS base

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app

# System deps (only what you actually need)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential gcc libpq-dev \
 && rm -rf /var/lib/apt/lists/*

# Install Python deps
# NOTE: path is from repo root because App Runner's context is the repo
COPY backend/requirements.txt ./requirements.txt
RUN pip install --upgrade pip setuptools wheel \
 && pip install --no-cache-dir -r requirements.txt

# Copy backend source only (keeps image smaller)
COPY backend/ /app/

# Gunicorn config
ENV FLASK_APP=app.py
ENV PORT=8080
# EXPOSE cannot use env vars; set literal
EXPOSE 8080
# Optional: tweak workers/threads/timeouts to your needs
ENV GUNICORN_CMD_ARGS="--workers=2 --threads=2 --timeout=120"

# (Optional) run as non-root for security
RUN useradd -m appuser
USER appuser

# Start the server
CMD ["sh", "-c", "gunicorn -b 0.0.0.0:${PORT} app:app"]
