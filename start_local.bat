@echo off
echo ==========================================================
echo   Starting AIVOA Pharma QMS Complaint System (Local Dev)
echo ==========================================================
echo.

echo [1/2] Starting Python FastAPI Backend on http://localhost:8000...
start cmd /k "cd backend && python run.py"

echo [2/2] Starting React + Redux Frontend on http://localhost:3000...
start cmd /k "cd frontend && npm install && npm run dev"

echo.
echo ==========================================================
echo Both servers launching!
echo Backend API docs: http://localhost:8000/docs
echo Frontend UI:      http://localhost:3000
echo ==========================================================
