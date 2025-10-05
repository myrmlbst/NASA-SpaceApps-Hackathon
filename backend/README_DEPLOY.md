Deploying the backend on Render.com

Service type: Web Service (Docker)

Options:
- You can either use Render's Docker deployment (connect repo, select Dockerfile) or use a Python service with a custom build command.

Recommended (Docker):
1. In Render Dashboard -> New -> Web Service.
2. Connect your GitHub/GitLab repo and select the `backend/` folder as the root (Render will detect Dockerfile).
3. Environment: Python 3.11 (not required if using Dockerfile).
4. Build Command: (not needed with Dockerfile)
5. Start Command (not needed with Dockerfile). If you choose not to use Docker, set start command to:
   gunicorn -w 4 -b 0.0.0.0:5050 app:app
6. Add environment variables (if any). For example, to allow CORS from your frontend URL, set FRONTEND_URL.

Notes:
- Ensure `backend/requirements.txt` contains valid plain pip requirements (no fenced code blocks). If the file has triple-backticks, remove them.
- The Dockerfile exposes port 5050. Render will map that internal port automatically.
