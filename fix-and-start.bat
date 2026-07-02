@echo off
echo Fixing Database and Starting Pantry Pal...
echo.

echo Stopping any processes on port 5000...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :5000') do (
    echo Killing process %%a
    taskkill /f /pid %%a >nul 2>&1
)

echo.
cd backend

echo Installing backend dependencies...
call npm install

echo.
echo Running database migration...
node migrate_db.js

echo.
echo Setting up database...
node setup_db.js

echo.
echo Starting backend server...
start "Backend Server" cmd /k "npm run dev"

echo Waiting for backend to start...
timeout /t 3 /nobreak > nul

echo.
cd ..\frontend

echo Installing frontend dependencies...
call npm install

echo.
echo Starting frontend server...
start "Frontend Server" cmd /k "npm run dev"

echo.
echo Setup complete!
echo Backend: http://localhost:5000
echo Frontend: http://localhost:5174 (or 5173)
echo.
pause