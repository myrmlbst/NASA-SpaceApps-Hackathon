Deploying the frontend on Render.com

Service type: Static Site or Web Service (Docker)

Option A — Static Site (recommended for Vite static builds):
1. Build Command: `npm ci && npm run build`
2. Publish Directory: `dist`
3. Set environment variables as needed (e.g., VITE_API_URL for your backend).

Option B — Web Service (Docker):
1. Create a Web Service in Render and point to the repository root /frontend.
2. Render will use the `frontend/Dockerfile` to build the app and serve with nginx.

Notes:
- If your frontend calls the backend at runtime, configure `VITE_API_URL` in Render environment variables to point to the backend service URL (e.g., `https://your-backend.onrender.com`).
- For local testing use `docker-compose up --build` from the repo root.
