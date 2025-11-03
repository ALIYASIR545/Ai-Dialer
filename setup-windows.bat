@echo off
echo ========================================
echo AI Dialer - Windows Setup Script
echo ========================================
echo.

REM Check Python
echo Checking Python installation...
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python is not installed or not in PATH
    echo Please install Python 3.9+ from https://www.python.org/
    pause
    exit /b 1
)
echo Python found!
echo.

REM Check Node.js
echo Checking Node.js installation...
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)
echo Node.js found!
echo.

echo ========================================
echo Step 1: Backend Setup
echo ========================================
cd backend

echo Creating virtual environment...
python -m venv venv
if errorlevel 1 (
    echo ERROR: Failed to create virtual environment
    pause
    exit /b 1
)

echo Activating virtual environment...
call venv\Scripts\activate

echo Installing backend dependencies...
echo This may take 5-10 minutes, please wait...
python -m pip install --upgrade pip
pip install flask==3.0.3
pip install flask-cors==4.0.1
pip install transformers==4.41.2
pip install torch==2.3.1
pip install accelerate==0.31.0
pip install sentencepiece==0.2.0
pip install protobuf==5.27.1
pip install python-dotenv==1.0.1
pip install requests==2.32.3
pip install gunicorn==22.0.0

if errorlevel 1 (
    echo ERROR: Failed to install backend dependencies
    pause
    exit /b 1
)

echo.
echo Creating .env file...
if not exist .env (
    copy .env.example .env
    echo .env file created! Please edit it with your settings.
) else (
    echo .env file already exists.
)

echo.
echo Backend setup complete!
echo.

cd ..

echo ========================================
echo Step 2: Frontend Setup
echo ========================================
cd frontend

echo Installing frontend dependencies...
call npm install

if errorlevel 1 (
    echo ERROR: Failed to install frontend dependencies
    pause
    exit /b 1
)

echo.
echo Frontend setup complete!
echo.

cd ..

echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo To start the application:
echo.
echo 1. Backend (in one terminal):
echo    cd backend
echo    venv\Scripts\activate
echo    python run.py
echo.
echo 2. Frontend (in another terminal):
echo    cd frontend
echo    npm run dev
echo.
echo 3. Open browser to: http://localhost:3000
echo.
echo NOTE: First run will download AI model (~1.5GB)
echo.
pause
