#!/bin/bash

echo "========================================"
echo "AI Dialer - Unix/Mac Setup Script"
echo "========================================"
echo ""

# Check Python
echo "Checking Python installation..."
if ! command -v python3 &> /dev/null; then
    echo "ERROR: Python3 is not installed"
    echo "Please install Python 3.9+ first"
    exit 1
fi
echo "Python found: $(python3 --version)"
echo ""

# Check Node.js
echo "Checking Node.js installation..."
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js is not installed"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi
echo "Node.js found: $(node --version)"
echo ""

echo "========================================"
echo "Step 1: Backend Setup"
echo "========================================"
cd backend

echo "Creating virtual environment..."
python3 -m venv venv
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to create virtual environment"
    exit 1
fi

echo "Activating virtual environment..."
source venv/bin/activate

echo "Installing backend dependencies..."
echo "This may take 5-10 minutes, please wait..."
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

if [ $? -ne 0 ]; then
    echo "ERROR: Failed to install backend dependencies"
    exit 1
fi

echo ""
echo "Creating .env file..."
if [ ! -f .env ]; then
    cp .env.example .env
    echo ".env file created! Please edit it with your settings."
else
    echo ".env file already exists."
fi

echo ""
echo "Backend setup complete!"
echo ""

cd ..

echo "========================================"
echo "Step 2: Frontend Setup"
echo "========================================"
cd frontend

echo "Installing frontend dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "ERROR: Failed to install frontend dependencies"
    exit 1
fi

echo ""
echo "Frontend setup complete!"
echo ""

cd ..

echo "========================================"
echo "Setup Complete!"
echo "========================================"
echo ""
echo "To start the application:"
echo ""
echo "1. Backend (in one terminal):"
echo "   cd backend"
echo "   source venv/bin/activate"
echo "   python run.py"
echo ""
echo "2. Frontend (in another terminal):"
echo "   cd frontend"
echo "   npm run dev"
echo ""
echo "3. Open browser to: http://localhost:3000"
echo ""
echo "NOTE: First run will download AI model (~1.5GB)"
echo ""
