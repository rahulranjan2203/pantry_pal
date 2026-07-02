@echo off
echo Starting Pantry Pal Application...
echo.

echo Installing backend dependencies...
cd backend
call npm install
echo.

echo Installing frontend dependencies...
cd ..\frontend
call npm install
echo.

echo Starting backend server...
cd ..\backend
start "Backend Server" cmd /k "npm run dev"

echo Waiting for backend to start...
timeout /t 3 /nobreak > nul

echo Starting frontend development server...
cd ..\frontend
start "Frontend Server" cmd /k "npm run dev"

echo.
echo Both servers are starting...
echo Backend: http://localhost:5000
echo Frontend: http://localhost:5173
echo.
pause