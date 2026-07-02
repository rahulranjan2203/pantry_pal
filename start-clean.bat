@echo off
echo Stopping any processes on port 5000...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :5000') do (
    echo Killing process %%a
    taskkill /f /pid %%a >nul 2>&1
)

echo.
echo Starting Pantry Pal Application...
echo.

echo Installing backend dependencies...
cd backend
call npm install
echo.

echo Setting up database...
node setup_db.js
echo.

echo Installing frontend dependencies...
cd ..\frontend
call npm install
echo.

echo Starting backend server...
cd ..\backend
start "Backend Server" cmd /k "npm run dev"

echo Waiting for backend to start...
timeout /t 5 /nobreak > nul

echo Starting frontend development server...
cd ..\frontend
start "Frontend Server" cmd /k "npm run dev"

echo.
echo Both servers are starting...
echo Backend: http://localhost:5000
echo Frontend: http://localhost:5174 (or 5173)
echo.
echo If you see login page directly, the app is working correctly!
pause