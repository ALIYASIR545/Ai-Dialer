# AI Dialer - System Architecture

## Overview
A minimalist browser-based AI dialer that simulates phone calls with AI assistants using voice and text interaction.

## Design Principles
1. **Modularity**: Each component is isolated and swappable
2. **Minimal Dependencies**: Only essential libraries
3. **Clear Separation**: UI, Voice, AI Logic, and Storage are independent
4. **First Principles**: Every piece is explainable and purposeful
5. **Future-Proof**: Easy to swap AI models, voice engines, or storage

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        FRONTEND (React)                      │
├─────────────────────────────────────────────────────────────┤
│  UI Layer                                                    │
│  ├── CallScreen (Timer, Mute, End, Transcript Toggle)       │
│  ├── DialPad (Optional)                                     │
│  ├── Waveform/Avatar (Visual Feedback)                      │
│  ├── TranscriptView (Live + Export)                         │
│  └── SettingsPanel (Personalization)                        │
├─────────────────────────────────────────────────────────────┤
│  Voice Module                                                │
│  ├── STTEngine (Web Speech API)                             │
│  ├── TTSEngine (Web Speech API / ElevenLabs)                │
│  └── AudioProcessor (Waveform visualization)                │
├─────────────────────────────────────────────────────────────┤
│  State Management                                            │
│  ├── CallState (active, idle, connecting)                   │
│  ├── ConversationHistory                                     │
│  └── UserPreferences                                         │
└─────────────────────────────────────────────────────────────┘
                            │
                    HTTP/WebSocket
                            │
┌─────────────────────────────────────────────────────────────┐
│                     BACKEND (Flask)                          │
├─────────────────────────────────────────────────────────────┤
│  API Layer                                                   │
│  ├── /api/chat (Process messages)                           │
│  ├── /api/config (User preferences)                         │
│  ├── /api/transcript (Export)                               │
│  └── /api/plugins (Plugin invocation)                       │
├─────────────────────────────────────────────────────────────┤
│  AI Engine                                                   │
│  ├── ModelConnector (HuggingFace/OpenAI)                    │
│  ├── ConversationManager (Context + History)                │
│  └── IntentDetector (Route to plugins)                      │
├─────────────────────────────────────────────────────────────┤
│  Plugin System                                               │
│  ├── PluginRegistry                                          │
│  ├── BasePlugin (Interface)                                 │
│  └── Plugins/                                                │
│      ├── NoteTaker                                           │
│      ├── Summarizer                                          │
│      └── Translator                                          │
└─────────────────────────────────────────────────────────────┘
                            │
                            │
┌─────────────────────────────────────────────────────────────┐
│                    STORAGE (Supabase/Local)                  │
├─────────────────────────────────────────────────────────────┤
│  ├── User Profiles (name, avatar, voice preference)         │
│  ├── Conversation History                                    │
│  └── Settings & Preferences                                  │
└─────────────────────────────────────────────────────────────┘
```

## Folder Structure

```
ai-dialer/
├── frontend/                   # React app
│   ├── public/
│   ├── src/
│   │   ├── components/         # UI components
│   │   │   ├── CallScreen/
│   │   │   ├── DialPad/
│   │   │   ├── Transcript/
│   │   │   ├── Waveform/
│   │   │   └── Settings/
│   │   ├── modules/            # Core logic modules
│   │   │   ├── voice/          # STT/TTS engines
│   │   │   ├── api/            # Backend communication
│   │   │   └── storage/        # Local/remote storage
│   │   ├── hooks/              # React hooks
│   │   ├── context/            # React context
│   │   ├── utils/              # Helpers
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── backend/                    # Flask API
│   ├── app/
│   │   ├── __init__.py
│   │   ├── routes/             # API endpoints
│   │   │   ├── chat.py
│   │   │   ├── config.py
│   │   │   └── transcript.py
│   │   ├── ai/                 # AI logic
│   │   │   ├── model_connector.py
│   │   │   ├── conversation_manager.py
│   │   │   └── intent_detector.py
│   │   ├── plugins/            # Plugin system
│   │   │   ├── base.py
│   │   │   ├── registry.py
│   │   │   ├── note_taker.py
│   │   │   ├── summarizer.py
│   │   │   └── translator.py
│   │   └── utils/
│   ├── config.py
│   ├── requirements.txt
│   └── run.py
│
├── docs/                       # Documentation
│   ├── SETUP.md
│   ├── API.md
│   └── PLUGINS.md
│
└── README.md
```

## Data Flow

### Voice Call Flow
1. User speaks → STT → Text
2. Text → Backend API → AI Model
3. AI Response → Frontend
4. Response → TTS → Audio playback
5. Update transcript in real-time

### Text Call Flow
1. User types → Send to Backend
2. Backend → AI Model → Response
3. Display in chat + TTS (optional)

## Key Technologies

### Frontend
- **React 18**: Component-based UI
- **Tailwind CSS**: Utility-first styling
- **Vite**: Fast build tool
- **Web Speech API**: Native STT/TTS
- **Canvas/WebGL**: Waveform visualization

### Backend
- **Flask**: Lightweight Python web framework
- **HuggingFace Transformers**: AI model integration
- **Flask-CORS**: Cross-origin support
- **Flask-SocketIO** (optional): Real-time WebSocket

### Storage
- **LocalStorage**: Quick local persistence
- **Supabase** (optional): Cloud storage for sync

## Module Breakdown

### Frontend Modules

#### 1. Voice Module (`modules/voice/`)
- `STTEngine.js`: Web Speech API wrapper for speech-to-text
- `TTSEngine.js`: Text-to-speech with multiple voices
- `AudioProcessor.js`: Waveform visualization and audio analysis

#### 2. API Module (`modules/api/`)
- `client.js`: Axios/fetch wrapper for backend calls
- `websocket.js`: Real-time connection (optional)

#### 3. Storage Module (`modules/storage/`)
- `local.js`: LocalStorage wrapper
- `supabase.js`: Cloud storage connector

### Backend Modules

#### 1. AI Engine (`app/ai/`)
- `model_connector.py`: Abstraction for HuggingFace/OpenAI
- `conversation_manager.py`: Maintains context and history
- `intent_detector.py`: Extracts user intent for plugin routing

#### 2. Plugin System (`app/plugins/`)
- `base.py`: BasePlugin class with standard interface
- `registry.py`: Discovers and manages plugins
- Individual plugins implement: `execute(context) -> result`

## Security & Privacy
- No call recording without explicit consent
- Transcripts stored locally by default
- API keys in environment variables
- Optional end-to-end encryption for cloud storage

## Performance Targets
- Initial load: < 2 seconds
- Time to first AI response: < 1 second
- UI remains responsive during processing
- Minimal memory footprint

## Extensibility Points
1. Swap AI models: Change `model_connector.py`
2. Add voice providers: Implement `TTSEngine` interface
3. New plugins: Extend `BasePlugin`
4. Alternative storage: Implement storage interface
5. UI themes: Tailwind configuration
