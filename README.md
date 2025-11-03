# AI Dialer

A minimalist, browser-based AI dialer web app that simulates phone call experiences with AI assistants. Supports both voice and text interaction, with modular architecture for easy extension.

## Features

### Core Functionality
- **Call Simulation UI**: Mobile-friendly interface with call screen, timer, and controls
- **Voice Interaction**: Speech-to-Text and Text-to-Speech using Web Speech API
- **Text Mode**: Toggle between voice and text-based chat
- **Real-time Waveform**: Animated audio visualization during calls
- **Live Transcript**: View and export conversation transcripts
- **User Personalization**: Customize name, voice, tone, and AI personality

### AI Backend
- **HuggingFace Integration**: Use models from HuggingFace (default: DialoGPT-medium)
- **OpenAI Support**: Optional OpenAI API integration
- **Conversation Context**: Maintains conversation history and context
- **Intent Detection**: Detects user intent and routes to plugins

### Plugin System
- **Note Taker**: Take and store notes during conversation
- **Summarizer**: Summarize conversations or text passages
- **Translator**: Translate text between languages
- **Extensible**: Easy to add new plugins

## Tech Stack

### Frontend
- React 18 with Hooks
- Tailwind CSS for styling
- Vite for fast development
- Web Speech API (STT/TTS)
- Canvas API for waveform visualization

### Backend
- Python Flask (lightweight REST API)
- HuggingFace Transformers
- PyTorch for model inference
- Modular plugin architecture

### Storage
- LocalStorage for preferences
- Optional Supabase/Firebase integration

## Project Structure

```
ai-dialer/
├── frontend/           # React frontend
│   ├── src/
│   │   ├── components/    # UI components
│   │   ├── modules/       # Core modules (voice, api, storage)
│   │   ├── context/       # React context
│   │   └── hooks/         # Custom hooks
│   └── package.json
│
├── backend/            # Flask backend
│   ├── app/
│   │   ├── routes/        # API endpoints
│   │   ├── ai/            # AI logic
│   │   └── plugins/       # Plugin system
│   ├── config.py
│   ├── requirements.txt
│   └── run.py
│
├── docs/               # Documentation
└── ARCHITECTURE.md     # System architecture
```

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- Python 3.9+
- 4GB+ RAM (for AI model)

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend will start at http://localhost:3000

### Backend Setup

1. Create a virtual environment:
```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate

# Mac/Linux
source venv/bin/activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Configure environment:
```bash
cp .env.example .env
# Edit .env with your settings
```

4. Start the server:
```bash
python run.py
```

The backend will start at http://localhost:5000

### First Run

The first time you start the backend, it will download the AI model from HuggingFace. This may take a few minutes depending on your internet connection.

## Configuration

### AI Model Configuration

Edit `backend/.env`:

```env
# Use HuggingFace model (default)
AI_MODEL_TYPE=huggingface
AI_MODEL_NAME=microsoft/DialoGPT-medium

# Or use OpenAI
AI_MODEL_TYPE=openai
OPENAI_API_KEY=your-key-here
OPENAI_MODEL=gpt-3.5-turbo
```

### Available HuggingFace Models
- `microsoft/DialoGPT-small` (117M params) - Fastest
- `microsoft/DialoGPT-medium` (345M params) - Balanced
- `microsoft/DialoGPT-large` (774M params) - Best quality
- `facebook/blenderbot-400M-distill` - Alternative option

### Voice Configuration

Voice settings are managed in the frontend. Users can select from predefined voice personalities:
- Assistant (balanced)
- Friendly (warm)
- Professional (formal)
- Energetic (upbeat)
- Calm (soothing)

## API Endpoints

### Chat
- `POST /api/chat` - Send message to AI
- `GET /api/models` - List available models

### Configuration
- `GET /api/config/preferences` - Get user preferences
- `PUT /api/config/preferences` - Update preferences
- `GET /api/config/voices` - List voice presets
- `GET /api/config/personalities` - List AI personalities

### Transcript
- `POST /api/transcript/save` - Save conversation
- `POST /api/transcript/export` - Export transcript (txt, json, md)
- `POST /api/transcript/stats` - Get conversation stats

### Plugins
- `GET /api/plugins` - List all plugins
- `POST /api/plugins/invoke` - Invoke a plugin
- `GET /api/plugins/<name>` - Get plugin info

## Creating Plugins

Create a new file in `backend/app/plugins/`:

```python
from app.plugins.base import BasePlugin

class MyPlugin(BasePlugin):
    def get_description(self):
        return "Description of what the plugin does"

    def execute(self, context):
        # Plugin logic here
        return {
            'result': 'Plugin output'
        }
```

The plugin will be automatically discovered and registered.

## Deployment

### Frontend (Vercel)

1. Push code to GitHub
2. Import project in Vercel
3. Set build command: `cd frontend && npm install && npm run build`
4. Set output directory: `frontend/dist`
5. Add environment variable: `VITE_API_URL=https://your-backend-url.com`

### Backend (Render)

1. Push code to GitHub
2. Create new Web Service in Render
3. Connect your repository
4. Render will auto-detect `render.yaml`
5. Add environment variables in Render dashboard

### Environment Variables for Production

Backend:
```
SECRET_KEY=<random-secret>
AI_MODEL_NAME=microsoft/DialoGPT-medium
AI_MODEL_TYPE=huggingface
DEBUG=False
CORS_ORIGINS=https://your-frontend-url.vercel.app
```

Frontend:
```
VITE_API_URL=https://your-backend.onrender.com
```

## Performance Optimization

### Model Size Selection
- Small model (117M): Fastest, lower quality
- Medium model (345M): Balanced (recommended)
- Large model (774M): Best quality, slower

### Caching
Models are cached after first load. Subsequent starts are faster.

### GPU Support
If you have a CUDA-compatible GPU, PyTorch will automatically use it for faster inference.

## Troubleshooting

### Model Loading Issues
- **Out of memory**: Use a smaller model or add more RAM
- **Slow downloads**: HuggingFace models are large (100MB-3GB)
- **CUDA errors**: Install CUDA toolkit or use CPU mode

### Voice Issues
- **Speech recognition not working**: Check browser support (Chrome/Edge recommended)
- **No voice output**: Ensure browser has TTS support and volume is up
- **Microphone access denied**: Grant microphone permissions in browser

### CORS Errors
- Update `CORS_ORIGINS` in backend `.env`
- Ensure frontend URL matches CORS settings

## Browser Support

| Feature | Chrome | Firefox | Safari | Edge |
|---------|--------|---------|--------|------|
| Speech Recognition | ✅ | ❌ | ✅ | ✅ |
| Text-to-Speech | ✅ | ✅ | ✅ | ✅ |
| Web Audio API | ✅ | ✅ | ✅ | ✅ |

**Recommended**: Chrome or Edge for full voice support

## Architecture

See [ARCHITECTURE.md](ARCHITECTURE.md) for detailed system design and data flow.

## License

MIT License - See LICENSE file for details

## Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## Support

For issues, questions, or feature requests, please open an issue on GitHub.

## Roadmap

- [ ] WebRTC support for multi-user calls
- [ ] Calendar integration plugin
- [ ] Email/SMS transcript delivery
- [ ] Custom model fine-tuning guide
- [ ] Mobile app (React Native)
- [ ] Voice cloning support
- [ ] Real-time translation during calls

## Acknowledgments

- HuggingFace for transformers library
- Microsoft for DialoGPT model
- Web Speech API for browser-native voice support
