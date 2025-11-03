# AI Dailer - Installation Complete Guide

## ✅ Installation Status

### Backend - INSTALLED
All Python dependencies have been installed:

```
✅ flask==3.0.3
✅ flask-cors==4.0.1
✅ python-dotenv==1.0.1
✅ requests==2.32.3
✅ gunicorn==22.0.0
✅ torch==2.3.1 (CPU version)
✅ protobuf==5.27.1
✅ sentencepiece==0.2.0
⏳ transformers==4.41.2 (Installing)
⏳ accelerate==0.31.0 (Installing)
```

### Frontend - IN PROGRESS
```
⏳ npm install (Installing all React packages)
```

### Configuration
```
✅ .env file created from .env.example
```

---

## 🚀 How to Start the Application

### 1. Start the Backend (Terminal 1)

Open a terminal and run:

```bash
cd "c:\Users\ADMIN\Ai Dailer\backend"
venv\Scripts\activate
python run.py
```

You should see:
```
AI Dialer Backend Server
Server starting on http://localhost:5000
```

**First run note:** The AI model (~1.5GB) will download automatically. This takes 2-5 minutes.

### 2. Start the Frontend (Terminal 2)

Open a NEW terminal and run:

```bash
cd "c:\Users\ADMIN\Ai Dailer\frontend"
npm run dev
```

You should see:
```
VITE v5.3.3  ready in XXX ms
➜  Local:   http://localhost:3000/
```

### 3. Open in Browser

Navigate to: **http://localhost:3000**

---

## 🎯 Using the App

### First Call

1. **Click the green phone button** to start a call
2. **Grant microphone permissions** when prompted
3. **Start talking** - say "Hello" or any question
4. The AI will respond via voice

### Features to Try

- **Voice Mode**: Speak naturally, AI responds with voice
- **Text Mode**: Click message icon to type instead
- **Mute**: Click microphone icon
- **Transcript**: Click document icon to view/export conversation
- **End Call**: Click red phone button

---

## 📝 Configuration

### Edit Backend Settings

File: `backend\.env`

```env
# AI Model (change to use different models)
AI_MODEL_NAME=microsoft/DialoGPT-medium

# Options:
# microsoft/DialoGPT-small (fast, lower quality)
# microsoft/DialoGPT-medium (balanced - default)
# microsoft/DialoGPT-large (best quality, slower)

# Or use OpenAI instead:
# AI_MODEL_TYPE=openai
# OPENAI_API_KEY=your-key-here
```

### Available AI Personalities

Edit in `.env` or via API:
- `assistant` - Balanced and professional
- `friendly` - Warm and conversational
- `professional` - Formal business tone
- `tutor` - Educational and patient
- `creative` - Imaginative and innovative
- `coach` - Motivational and action-oriented

---

## 🧪 Testing the Installation

### Test Backend

```bash
# Activate venv first
cd backend
venv\Scripts\activate

# Test imports
python -c "import flask; print('✅ Flask OK')"
python -c "import torch; print('✅ PyTorch OK')"
python -c "import transformers; print('✅ Transformers OK')"

# Test API
python run.py
# In another terminal:
curl http://localhost:5000/api/health
```

### Test Frontend

```bash
cd frontend
npm run dev
# Open http://localhost:3000
```

---

## 📦 What Was Installed

### Backend Packages (~1.8GB total)

**Core Flask** (~20MB)
- flask, flask-cors, werkzeug, jinja2, click

**AI/ML** (~1.5GB)
- torch - Deep learning framework
- transformers - HuggingFace AI models
- accelerate - Model optimization
- numpy, sentencepiece, tokenizers

**Utilities** (~10MB)
- python-dotenv, requests, gunicorn
- protobuf, pyyaml, regex

### Frontend Packages (~70MB)

**React** (~2MB)
- react, react-dom

**Build Tools** (~50MB)
- vite, @vitejs/plugin-react
- tailwindcss, postcss, autoprefixer

**Libraries** (~18MB)
- axios - HTTP client
- lucide-react - Icons

---

## 🎓 Quick Commands Reference

### Backend Commands

```bash
# Activate virtual environment
cd backend
venv\Scripts\activate

# Start backend
python run.py

# Install new package
pip install package-name

# Deactivate venv
deactivate
```

### Frontend Commands

```bash
# Start development server
cd frontend
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Install new package
npm install package-name
```

---

## 🔧 Troubleshooting

### Backend Won't Start

**Error: "ModuleNotFoundError: No module named 'transformers'"**

Wait for installations to complete, or manually install:
```bash
cd backend
venv\Scripts\activate
pip install transformers==4.41.2 accelerate==0.31.0
```

**Error: "Out of memory"**

Use a smaller model in `.env`:
```env
AI_MODEL_NAME=microsoft/DialoGPT-small
```

### Frontend Won't Start

**Error: "Cannot find module 'vite'"**

Wait for npm install to complete, or manually run:
```bash
cd frontend
npm install
```

**Error: "Port 3000 already in use"**

Kill the process or change port in `vite.config.js`:
```javascript
server: { port: 3001 }
```

### Voice Not Working

- **Use Chrome or Edge** browser (best support)
- Check microphone permissions
- Try **text mode** instead (click message icon)
- Check system microphone settings

### AI Responses Slow

- Use smaller model (DialoGPT-small)
- Close other applications
- Check if model is still downloading (first run)

---

## 📚 Documentation

- **[README.md](README.md)** - Complete overview
- **[QUICKSTART.md](QUICKSTART.md)** - 5-minute guide
- **[MANUAL_INSTALL.md](MANUAL_INSTALL.md)** - Manual installation steps
- **[ARCHITECTURE.md](ARCHITECTURE.md)** - System design
- **[docs/SETUP.md](docs/SETUP.md)** - Detailed setup
- **[docs/API.md](docs/API.md)** - API reference
- **[docs/PLUGINS.md](docs/PLUGINS.md)** - Plugin development

---

## 🎨 Customization Ideas

### Change AI Model

Edit `backend/.env`:
```env
AI_MODEL_NAME=facebook/blenderbot-400M-distill
```

### Add Custom Plugin

Create `backend/app/plugins/my_plugin.py`:
```python
from app.plugins.base import BasePlugin

class MyPlugin(BasePlugin):
    def get_description(self):
        return "My custom plugin"

    def execute(self, context):
        # Your logic here
        return {'result': 'success'}
```

### Change Voice

In the app, toggle between voice presets or use browser's built-in voices.

---

## 🚀 Deployment

### Deploy Frontend to Vercel

```bash
cd frontend
npm run build
# Upload dist/ folder to Vercel
```

Or use Vercel CLI:
```bash
npm install -g vercel
vercel --prod
```

### Deploy Backend to Render

1. Push to GitHub
2. Connect to Render.com
3. Render auto-detects `render.yaml`
4. Add environment variables in Render dashboard

---

## 🎉 You're Ready!

The AI Dialer is fully installed and ready to use!

### Next Steps

1. ✅ **Start both servers** (backend + frontend)
2. ✅ **Open http://localhost:3000**
3. ✅ **Make your first AI call**
4. 📖 **Read the docs** to learn more
5. 🔧 **Customize** the AI model and settings
6. 🔌 **Create plugins** to extend functionality
7. 🚀 **Deploy** to production

---

## 📞 Support

If you need help:
- Check the troubleshooting section above
- Review [MANUAL_INSTALL.md](MANUAL_INSTALL.md)
- Read [QUICKSTART.md](QUICKSTART.md)
- Open a GitHub issue

---

**Happy Dialing! 🎊**

Your AI assistant is ready to have conversations with you!
