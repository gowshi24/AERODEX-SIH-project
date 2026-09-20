@echo off
echo =====================================================================
echo   Starting AERODEX Full Stack (Backend + Frontend)
echo =====================================================================
echo.

echo Launching Backend Server on port 8000 (new window)...
start "AERODEX Backend Server (Port 8000)" cmd /k "%~dp0run_backend.bat"

echo Waiting 3 seconds for backend initialization...
timeout /t 3 /nobreak > nul

echo Launching Next.js Frontend on port 3000 (new window)...
start "AERODEX Frontend (Port 3000)" cmd /k "cd /d "%~dp0" && npm run dev"

echo.
echo =====================================================================
echo   Services are running!
echo   - Backend API & Live Scraper: http://localhost:8000
echo   - Next.js Web Application:    http://localhost:3000
echo =====================================================================
echo.
pause
