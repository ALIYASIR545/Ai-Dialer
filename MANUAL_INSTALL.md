# AI Dialer - Manual Installation Guide

Complete step-by-step manual installation without using requirements.txt or package.json.

## Prerequisites Check

### 1. Check Python
```bash
python --version
# Should show Python 3.9 or higher
```

If not installed: Download from https://www.python.org/downloads/

### 2. Check Node.js
```bash
node --version
# Should show v18 or higher
```

If not installed: Download from https://nodejs.org/

### 3. Check npm
```bash
npm --version
# Should show npm 8 or higher
```

Comes with Node.js installation.

---

## Backend Installation (Python)

### Step 1: Navigate to Backend
```bash
cd backend
```

### Step 2: Create Virtual Environment

**Windows:**
```bash
python -m venv venv
venv\Scripts\activate
```

**Mac/Linux:**
```bash
python3 -m venv venv
source venv/bin/activate
```

### Step 3: Upgrade pip
```bash
python -m pip install --upgrade pip
```

### Step 4: Install Backend Dependencies One by One

```bash
# Core Flask Framework
pip install flask==3.0.3

# CORS Support for Flask
pip install flask-cors==4.0.1

# HuggingFace Transformers Library (AI Models)
pip install transformers==4.41.2

# PyTorch (Deep Learning Framework)
pip install torch==2.3.1

# Accelerate (Model Loading Optimization)
pip install accelerate==0.31.0

# SentencePiece (Tokenization)
pip install sentencepiece==0.2.0

# Protocol Buffers (Serialization)
pip install protobuf==5.27.1

# Environment Variables
pip install python-dotenv==1.0.1

# HTTP Library
pip install requests==2.32.3

# Production Server
pip install gunicorn==22.0.0
```

**Note:** PyTorch installation may take 5-10 minutes as it's a large package (~800MB).

### Step 5: Verify Installation
```bash
python -c "import flask; print('Flask:', flask.__version__)"
python -c "import transformers; print('Transformers:', transformers.__version__)"
python -c "import torch; print('PyTorch:', torch.__version__)"
```

### Step 6: Create Environment File
```bash
# Windows
copy .env.example .env

# Mac/Linux
cp .env.example .env
```

Edit `.env` file with your settings:
```env
SECRET_KEY=your-secret-key-here
DEBUG=True
CORS_ORIGINS=http://localhost:3000
AI_MODEL_NAME=microsoft/DialoGPT-medium
AI_MODEL_TYPE=huggingface
MAX_LENGTH=100
TEMPERATURE=0.7
TOP_P=0.9
MAX_CONVERSATION_HISTORY=10
STORAGE_TYPE=local
PLUGINS_ENABLED=True
```

### Step 7: Test Backend
```bash
python run.py
```

Should see:
```
AI Dialer Backend Server
Server starting on http://localhost:5000
```

Keep this terminal open. Backend is now running!

---

## Frontend Installation (Node.js)

### Step 1: Navigate to Frontend (New Terminal)
```bash
cd frontend
```

### Step 2: Install Frontend Dependencies

Install each package individually:

```bash
# Core React
npm install react@18.3.1
npm install react-dom@18.3.1

# HTTP Client
npm install axios@1.7.2

# Icons
npm install lucide-react@0.400.0

# Development Tool - Vite
npm install --save-dev vite@5.3.3

# React Plugin for Vite
npm install --save-dev @vitejs/plugin-react@4.3.1

# Tailwind CSS
npm install --save-dev tailwindcss@3.4.4
npm install --save-dev autoprefixer@10.4.19
npm install --save-dev postcss@8.4.39
```

### Step 3: Verify Installation
```bash
npm list --depth=0
```

Should show all packages installed.

### Step 4: Test Frontend
```bash
npm run dev
```

Should see:
```
VITE ready in XXX ms
➜  Local:   http://localhost:3000/
```

---

## Alternative: Quick Install Scripts

I've created automated setup scripts for you:

### Windows Users
```bash
setup-windows.bat
```

### Mac/Linux Users
```bash
chmod +x setup-unix.sh
./setup-unix.sh
```

These scripts will install everything automatically.

---

## Troubleshooting Installation

### Backend Issues

#### Issue: "pip: command not found"
**Solution:**
```bash
python -m pip install <package>
# Instead of: pip install <package>
```

#### Issue: PyTorch installation fails
**Solution - Install CPU version:**
```bash
pip install torch==2.3.1 --index-url https://download.pytorch.org/whl/cpu
```

#### Issue: "No module named 'flask'"
**Solution:**
```bash
# Make sure virtual environment is activated
# Windows: venv\Scripts\activate
# Mac/Linux: source venv/bin/activate

# Then reinstall
pip install flask==3.0.3
```

#### Issue: Transformers installation takes too long
**Solution:**
```bash
# Install with no cache
pip install --no-cache-dir transformers==4.41.2
```

### Frontend Issues

#### Issue: "npm ERR! EACCES"
**Solution:**
```bash
# Mac/Linux - Fix permissions
sudo chown -R $(whoami) ~/.npm
```

#### Issue: "Cannot find module 'vite'"
**Solution:**
```bash
# Reinstall vite
npm install --save-dev vite@5.3.3
```

#### Issue: Port 3000 already in use
**Solution:**

Edit `vite.config.js`:
```javascript
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3001  // Change to any available port
  }
})
```

---

## Verify Complete Installation

### 1. Check Backend
```bash
cd backend
source venv/bin/activate  # or venv\Scripts\activate on Windows
python run.py
```

Visit: http://localhost:5000/api/health

Should return:
```json
{
  "status": "healthy",
  "model": "microsoft/DialoGPT-medium"
}
```

### 2. Check Frontend
```bash
cd frontend
npm run dev
```

Visit: http://localhost:3000

Should see the AI Dialer interface.

### 3. Test Full Integration
1. Click green phone button
2. Grant microphone permissions
3. Say "Hello"
4. Should get AI response

---

## Package Size Reference

### Backend Packages
| Package | Size | Description |
|---------|------|-------------|
| torch | ~800MB | Deep learning framework |
| transformers | ~300MB | HuggingFace library |
| flask | ~2MB | Web framework |
| flask-cors | ~30KB | CORS support |
| accelerate | ~150MB | Model optimization |
| sentencepiece | ~5MB | Tokenization |
| protobuf | ~5MB | Serialization |
| python-dotenv | ~50KB | Environment vars |
| requests | ~200KB | HTTP client |
| gunicorn | ~500KB | Production server |

**Total Backend:** ~1.5GB

### Frontend Packages
| Package | Size | Description |
|---------|------|-------------|
| react | ~350KB | UI framework |
| react-dom | ~600KB | React DOM |
| axios | ~150KB | HTTP client |
| lucide-react | ~2MB | Icons |
| vite | ~15MB | Build tool |
| tailwindcss | ~40MB | CSS framework |
| autoprefixer | ~5MB | CSS processor |
| postcss | ~3MB | CSS transformer |

**Total Frontend:** ~70MB

---

## Installation Time Estimates

- **Backend:** 10-15 minutes (mostly PyTorch download)
- **Frontend:** 2-3 minutes
- **First Run:** 3-5 minutes (downloads AI model)
- **Total:** ~20 minutes

---

## Minimal Installation (Development Only)

If you want to start quickly and install more later:

### Minimal Backend
```bash
pip install flask==3.0.3
pip install flask-cors==4.0.1
# Skip AI packages for now - will fail but API structure works
```

### Minimal Frontend
```bash
npm install react@18.3.1 react-dom@18.3.1
npm install --save-dev vite@5.3.3 @vitejs/plugin-react@4.3.1
# Skip Tailwind for now - UI will be unstyled but functional
```

---

## GPU Installation (Optional)

For faster AI responses with NVIDIA GPU:

### Check CUDA Version
```bash
nvidia-smi
```

### Install PyTorch with CUDA
```bash
# CUDA 11.8
pip install torch==2.3.1 --index-url https://download.pytorch.org/whl/cu118

# CUDA 12.1
pip install torch==2.3.1 --index-url https://download.pytorch.org/whl/cu121
```

---

## Post-Installation Steps

### 1. Configure Backend
Edit `backend/.env`:
- Set `SECRET_KEY` to random string
- Update `CORS_ORIGINS` if needed
- Choose AI model

### 2. Test All Endpoints
```bash
# Health check
curl http://localhost:5000/api/health

# Chat
curl -X POST http://localhost:5000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello"}'

# Plugins
curl http://localhost:5000/api/plugins
```

### 3. Test Frontend Features
- Voice mode (needs Chrome/Edge)
- Text mode
- Transcript export
- Plugin invocation

---

## Next Steps

1. Read [QUICKSTART.md](QUICKSTART.md) for usage guide
2. Check [ARCHITECTURE.md](ARCHITECTURE.md) to understand structure
3. See [docs/API.md](docs/API.md) for API reference
4. Try [docs/PLUGINS.md](docs/PLUGINS.md) to create plugins

---

## Common Installation Commands Summary

### Backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate          # Windows
source venv/bin/activate       # Mac/Linux
pip install -r requirements.txt  # All at once
# OR install one by one (see above)
python run.py
```

### Frontend
```bash
cd frontend
npm install                     # All at once
# OR install one by one (see above)
npm run dev
```

### Both
```bash
# Use the automated scripts:
setup-windows.bat              # Windows
./setup-unix.sh                # Mac/Linux
```

---

## Getting Help

If installation fails:
1. Check error messages carefully
2. Verify Python/Node versions
3. Try installing packages one by one
4. Check system requirements (RAM, disk space)
5. Search error message online
6. Open GitHub issue with error details

---

**Installation complete! You're ready to use AI Dialer!** 🎉
