@echo off
echo =====================================================================
echo   AERODEX - National Airfare Price Index and Realtime Scraping Server
echo   SIH 2026 Problem Statement: SIH26056
echo =====================================================================
echo.

cd /d "%~dp0backendscrap"

echo Checking Python environment...
python --version
if errorlevel 1 (
    echo [ERROR] Python is not installed or not in PATH!
    pause
    exit /b 1
)

echo Ensuring port 8000 is available...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :8000 ^| findstr LISTENING') do (
    echo Freeing port 8000 (PID: %%a)...
    taskkill /f /pid %%a >nul 2>&1
)

echo.
echo Starting REST API server and Live Background Scraper on http://localhost:8000 ...
echo Endpoints:
echo   - GET  /api/v1/live/pulse       (Realtime Laspeyres/Paasche index ^& CPI impact)
echo   - POST /api/v1/search           (Live Google Flights Playwright search)
echo   - GET  /api/v1/db/stats         (Microdata warehouse statistics)
echo   - GET  /api/v1/forecast/calendar (ML nowcasting calendar)
echo   - GET  /api/v1/integrity/audit  (IQR outlier ^& reconciliation audit)
echo.

python main.py

pause
