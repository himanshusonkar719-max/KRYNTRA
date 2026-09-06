@echo off
echo Starting KRYNTRA Backend & Frontend...

start "KRYNTRA Backend (FastAPI)" cmd /k "cd backend && python -m uvicorn main:app --reload --port 8000"
start "KRYNTRA Frontend (Next.js)" cmd /k "cd frontend && npm run dev"

echo.
echo ========================================================
echo KRYNTRA is launching!
echo Backend:  http://localhost:8000 (Swagger: http://localhost:8000/docs)
echo Frontend: http://localhost:3000
echo ========================================================
