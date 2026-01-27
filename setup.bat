@echo off
echo 🏠 Sweet Home Finder - Quick Setup Script
echo ==========================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    pause
    exit /b 1
)

echo ✅ Node.js found
node --version
echo.

REM Install backend dependencies
echo 📦 Installing backend dependencies...
cd backend
call npm install

if %errorlevel% neq 0 (
    echo ❌ Failed to install backend dependencies
    pause
    exit /b 1
)

echo ✅ Backend dependencies installed
echo.

REM Install frontend dependencies
echo 📦 Installing frontend dependencies...
cd ..\frontend
call npm install

if %errorlevel% neq 0 (
    echo ❌ Failed to install frontend dependencies
    pause
    exit /b 1
)

echo ✅ Frontend dependencies installed
cd ..
echo.

echo ✅ Setup complete!
echo.
echo 📝 Next steps:
echo    1. Update backend\.env with your PostgreSQL password
echo    2. Create the database using pgAdmin or psql
echo    3. Run migrations: cd backend ^&^& npx sequelize-cli db:migrate
echo    4. Start backend: cd backend ^&^& npm start
echo    5. Start frontend: cd frontend ^&^& npm start
echo.
echo 📖 For detailed instructions, see DEPLOYMENT_GUIDE.md
echo.
pause
