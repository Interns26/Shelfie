# Retail Shelf Intelligence Backend

<!-- Copyright (c) UWorx Services 2026. All Rights Reserved. The information contained herein is proprietary and confidential. This proprietary and confidential information, either in whole or in part, shall not be used for any purpose unless permitted by the terms of a valid license agreement. -->

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

## Ultralytics settings (optional)

Ultralytics stores user settings at `%APPDATA%\Ultralytics\settings.json`. After package upgrades the library may recreate defaults and print an informational warning.

To create a minimal settings file and set the `runs_dir` to a local folder inside this repo, run the provided helper script from the backend folder:

```powershell
# from repository root (PowerShell)
python backend\scripts\setup_ultralytics_settings.py
```

This will write `%APPDATA%\Ultralytics\settings.json` and create a `ultralytics_runs` directory in the repository root.
