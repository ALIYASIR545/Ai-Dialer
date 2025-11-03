# 🚀 Start AI Dialer - Quick Guide

## ✅ Installation Complete!

Both backend and frontend are now fully installed and ready to run!

---

## 📋 Start the Application

You need **TWO terminals** running simultaneously.

### Terminal 1 - Backend (Python Flask)

```bash
cd "C:\Users\ADMIN\Ai Dailer\backend"
venv\Scripts\activate
python run.py
```

**Expected Output:**
```
========================================
AI Dialer Backend Server
========================================
Server starting on http://localhost:5000
API endpoints available at http://localhost:5000/api
========================================
 * Serving Flask app 'app'
 * Debug mode: on
WARNING: This is a development server.
 * Running on http://127.0.0.1:5000
```

**First Run Note:** The AI model (~1.5GB) will download automatically. This takes 2-5 minutes.

---

### Terminal 2 - Frontend (React + Vite)

```bash
cd "C:\Users\ADMIN\Ai Dailer\frontend"
pnpm run dev
```

**Expected Output:**
```
VITE v5.4.21  ready in XXX ms

➜  Local:   http://localhost:3000/
➜  Network: use --host to expose
➜  press h + enter to show help
```

---

## 🌐 Access the Application

Once both servers are running, open your browser:

### **👉 http://localhost:3000**

You should see the AI Dialer interface!

---

## 🎯 Using AI Dialer

### First Call

1. **Click the green phone button** 📞
2. **Grant microphone permissions** when prompted
3. **Start talking** - say "Hello" or ask a question
4. The AI will respond with voice!

### Features

- **🎤 Voice Mode**: Speak naturally, AI responds with voice
- **💬 Text Mode**: Click message icon to type instead
- **🔇 Mute**: Click microphone icon to mute/unmute
- **📄 Transcript**: Click document icon to view conversation history
- **📥 Export**: Download transcript as TXT, JSON, or Markdown
- **☎️ End Call**: Click red phone button to end

---

## 🔧 Alternative Commands

### Using npm scripts:

```bash
# Frontend (if npm gets fixed)
npm run dev

# Or using pnpm (current working solution)
pnpm run dev

# Or using yarn
yarn dev
```

### Production Build:

```bash
# Build frontend for production
cd frontend
pnpm run build

# Preview production build
pnpm run preview
```

---

## 📊 What's Running

| Service | Port | URL | Purpose |
|---------|------|-----|---------|
| **Backend** | 5000 | http://localhost:5000 | API Server |
| **Frontend** | 3000 | http://localhost:3000 | User Interface |

---

## 🧪 Test Individual Components

### Test Backend API:

```bash
# Health check
curl http://localhost:5000/api/health

# Send a message
curl -X POST http://localhost:5000/api/chat \
  -H "Content-Type: application/json" \
  -d "{\"message\": \"Hello AI!\"}"

# List plugins
curl http://localhost:5000/api/plugins
```

### Test Frontend:

Just open http://localhost:3000 in your browser.

---

## 🛠️ Troubleshooting

### Backend won't start

**Check Python version:**
```bash
python --version
# Should be 3.9 or higher
```

**Verify virtual environment:**
```bash
cd backend
venv\Scripts\activate
python -c "import flask, torch, transformers; print('All OK')"
```

### Frontend won't start

**Check pnpm installation:**
```bash
pnpm --version
# Should show version 10.x.x
```

**Reinstall if needed:**
```bash
cd frontend
pnpm install
```

### Port already in use

**Change backend port** (edit `backend/run.py`):
```python
app.run(host='0.0.0.0', port=5001, debug=True)
```

**Change frontend port** (edit `frontend/vite.config.js`):
```javascript
server: {
  port: 3001
}
```

### Microphone not working

- Use **Chrome or Edge** browser (best compatibility)
- Check browser permissions
- Try **text mode** instead (click message icon)

### AI responses slow

- First response is slower (model loading)
- Subsequent responses are faster
- Use smaller model in `.env`: `AI_MODEL_NAME=microsoft/DialoGPT-small`

---

## 📝 Configuration

### Change AI Model

Edit `backend/.env`:

```env
# Fast, lower quality
AI_MODEL_NAME=microsoft/DialoGPT-small

# Balanced (default)
AI_MODEL_NAME=microsoft/DialoGPT-medium

# Best quality, slower
AI_MODEL_NAME=microsoft/DialoGPT-large

# Or use OpenAI
AI_MODEL_TYPE=openai
OPENAI_API_KEY=your-key-here
```

### Change AI Personality

Available personalities:
- `assistant` - Balanced and professional
- `friendly` - Warm and conversational
- `professional` - Formal business tone
- `tutor` - Educational and patient
- `creative` - Imaginative
- `coach` - Motivational

---

## 🔌 Using Plugins

During a call, try:

**Note Taking:**
- "Remember to buy milk"
- "Take a note: meeting at 3pm"

**Summarization:**
- "Summarize our conversation"
- "Give me a summary"

**Translation:**
- "Translate 'hello' to Spanish"
- "How do you say 'thank you' in French"

---

## 📚 Documentation

- **[README.md](README.md)** - Complete overview
- **[QUICKSTART.md](QUICKSTART.md)** - 5-minute guide
- **[ARCHITECTURE.md](ARCHITECTURE.md)** - System design
- **[docs/API.md](docs/API.md)** - API reference
- **[docs/PLUGINS.md](docs/PLUGINS.md)** - Create plugins

---

## 🎓 Package Manager Info

This project now uses **pnpm** instead of npm because:

✅ Faster installations
✅ Less disk space
✅ Better dependency management
✅ No npm bugs

### pnpm Commands:

```bash
pnpm install          # Install dependencies
pnpm run dev          # Start dev server
pnpm run build        # Build for production
pnpm add <package>    # Add new package
pnpm remove <package> # Remove package
```

---

## ⚡ Quick Start Summary

**2-Step Process:**

1. **Terminal 1:**
   ```bash
   cd backend
   venv\Scripts\activate
   python run.py
   ```

2. **Terminal 2:**
   ```bash
   cd frontend
   pnpm run dev
   ```

3. **Browser:**
   Open http://localhost:3000

**That's it!** Your AI Dialer is running! 🎉

---

## 🎯 What to Try

1. **Make a voice call** - Click green button, talk to AI
2. **Switch to text mode** - Click message icon
3. **View transcript** - Click document icon
4. **Export conversation** - Download as TXT/JSON
5. **Try different personalities** - Edit `.env`
6. **Use plugins** - Say "take a note"
7. **Change AI model** - Try different models

---

## 💡 Pro Tips

- **Best browser:** Chrome or Edge for voice features
- **First run:** Model downloads, takes 2-5 minutes
- **Faster responses:** Use DialoGPT-small model
- **Keep both terminals open** while using the app
- **Press Ctrl+C** in terminal to stop servers

---

## 📞 Support

If you encounter issues:

1. Check both terminals for error messages
2. Verify both servers are running
3. Try restarting both servers
4. Check browser console (F12)
5. Review documentation

---

**🎊 Enjoy your AI Dialer!**

You now have a fully functional AI-powered phone call simulator with voice and text interaction!
