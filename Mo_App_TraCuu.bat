@echo off
title TBR Plan Finder Pro - Obamacare 2026
echo.
echo ============================================================
echo   TBR PLAN FINDER PRO - OBAMACARE 2026
echo   The Best Rate Insurance
echo ============================================================
echo.
echo  Dang khoi dong server...

:: Kill any existing instance on port 5050
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :5050 ^| findstr LISTENING 2^>nul') do (
    taskkill /F /PID %%a >nul 2>&1
)

:: Start server
start /B "" "C:\Program Files\dotnet\packs\Microsoft.NET.Runtime.Emscripten.3.1.56.Python.win-x64\10.0.10\tools\python.exe" "E:\Job\app_server.py"

:: Wait for server to start
timeout /t 2 /nobreak >nul

:: Open browser
start http://localhost:5050

echo.
echo  Server dang chay tai: http://localhost:5050
echo  Nhan Ctrl+C hoac dong cua so nay de tat server.
echo.
pause
