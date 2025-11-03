# AI Dialer - Quick Start Guide

Get up and running in 5 minutes!

## Prerequisites

- Node.js 18+ and npm
- Python 3.9+
- 4GB+ RAM
- Chrome or Edge browser (for voice features)

## Installation

### 1. Clone or Download

If you haven't already, navigate to your project folder:

```bash
cd "Ai Dailer"
```

### 2. Start Backend

```bash
# Navigate to backend folder
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install dependencies (this may take 5-10 minutes)
pip install -r requirements.txt

# Create environment file
copy .env.example .env

# Start the server
python run.py
```

**Note**: The first time you run the backend, it will download the AI model (~1.5GB). This takes 2-5 minutes.

Keep this terminal open - the backend is now running on http://localhost:5000

### 3. Start Frontend (New Terminal)

Open a new terminal window:

```bash
# Navigate to frontend folder
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will start on http://localhost:3000

## Using the App

### 1. Open in Browser

Navigate to: http://localhost:3000

### 2. Start a Call

Click the green phone button to start a call.

### 3. Grant Permissions

Allow microphone access when prompted (for voice mode).

### 4. Start Talking!

- **Voice Mode**: Just speak naturally - the AI will respond
- **Text Mode**: Click the message icon to toggle to text chat

### 5. Try Features

- **Mute**: Click the microphone icon
- **View Transcript**: Click the document icon
- **End Call**: Click the red phone button

## Quick Tips

### Using Text Mode

If voice isn't working or you prefer typing:
1. Click the message bubble icon
2. Type your message
3. Press Enter or click Send

### Viewing Transcript

1. Click the document icon (top right)
2. View conversation history
3. Export as TXT, JSON, or Markdown

### Changing AI Personality

Edit `backend/.env` and restart backend:
```env
# Options: assistant, friendly, professional, tutor, creative, coach
AI_PERSONALITY=friendly
```

## Troubleshooting

### Backend won't start

**Error**: `Module not found`
```bash
# Make sure virtual environment is activated
# Windows: venv\Scripts\activate
# Mac/Linux: source venv/bin/activate

# Reinstall dependencies
pip install -r requirements.txt
```

**Error**: `Out of memory`
```bash
# Use smaller model - edit backend/.env:
AI_MODEL_NAME=microsoft/DialoGPT-small
```

### Frontend won't start

**Error**: `Port 3000 already in use`
```bash
# Kill process using port 3000
# Windows: netstat -ano | findstr :3000
# Mac/Linux: lsof -ti:3000 | xargs kill
```

### Voice not working

- Use Chrome or Edge browser
- Check microphone permissions
- Try text mode instead (click message icon)

### AI responses are slow

- Use smaller model (DialoGPT-small)
- Close other applications
- Check CPU usage in task manager

### CORS errors

Edit `backend/.env`:
```env
CORS_ORIGINS=http://localhost:3000
```
Restart backend.

## Next Steps

### Customize Voice

Try different voice styles in the UI settings (coming soon) or use browser's built-in voices.

### Add Plugins

Create custom plugins to extend functionality:
- Read [docs/PLUGINS.md](docs/PLUGINS.md)
- Check example plugins in `backend/app/plugins/`

### Switch AI Models

Edit `backend/.env`:

```env
# Faster, lower quality
AI_MODEL_NAME=microsoft/DialoGPT-small

# Balanced (default)
AI_MODEL_NAME=microsoft/DialoGPT-medium

# Better quality, slower
AI_MODEL_NAME=microsoft/DialoGPT-large
```

Restart backend to load new model.

### Use OpenAI Instead

1. Get API key from https://platform.openai.com
2. Edit `backend/.env`:
```env
AI_MODEL_TYPE=openai
OPENAI_API_KEY=sk-your-key-here
OPENAI_MODEL=gpt-3.5-turbo
```
3. Restart backend

## Command Reference

### Backend Commands

```bash
# Start backend
python run.py

# Install new dependencies
pip install package-name
pip freeze > requirements.txt

# Activate virtual environment
# Windows: venv\Scripts\activate
# Mac/Linux: source venv/bin/activate

# Deactivate virtual environment
deactivate
```

### Frontend Commands

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Install new package
npm install package-name
```

## Testing API

Test backend directly:

```bash
# Health check
curl http://localhost:5000/api/health

# Send message
curl -X POST http://localhost:5000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello!"}'

# List plugins
curl http://localhost:5000/api/plugins
```

## File Locations

### Configuration
- Backend: `backend/.env`
- Frontend: `frontend/.env.local` (create if needed)

### Logs
- Backend: Terminal output
- Frontend: Browser console (F12)

### Models
Downloaded models are cached in:
- Windows: `C:\Users\YourName\.cache\huggingface\`
- Mac/Linux: `~/.cache/huggingface/`

## Getting Help

1. Check [README.md](README.md) for detailed information
2. Read [docs/SETUP.md](docs/SETUP.md) for setup guide
3. See [docs/API.md](docs/API.md) for API reference
4. Open an issue on GitHub

## What's Next?

- Explore the code in `frontend/src/` and `backend/app/`
- Read [ARCHITECTURE.md](ARCHITECTURE.md) to understand the design
- Create your first plugin with [docs/PLUGINS.md](docs/PLUGINS.md)
- Deploy to production with [docs/SETUP.md](docs/SETUP.md#production-setup)

---

**Happy Dialing! 📞**
