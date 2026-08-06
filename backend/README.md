# Retail Shelf Intelligence Backend

This backend is built with FastAPI and provides the API contract for the frontend.

## Install

1. Create a Python virtual environment:

   ```bash
   python -m venv .venv
   ```

2. Activate the environment:

   ```bash
   # Windows PowerShell
   .\.venv\Scripts\Activate.ps1

   # Windows CMD
   .\.venv\Scripts\activate.bat
   ```

3. Install dependencies:

   ```bash
   pip install -r requirements.txt
   ```

## Run the backend

```bash
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

## Available routes

- `GET /api/dashboard`
- `POST /api/analyze` (multipart form with `reference_image` and `current_image`)
- `GET /api/results`
