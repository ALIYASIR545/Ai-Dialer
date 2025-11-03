# AI Dialer - Component Overview

## Visual Component Map

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER INTERFACE                          │
│                    (React + Tailwind CSS)                       │
└─────────────────────────────────────────────────────────────────┘
                                │
                                │
                ┌───────────────┴───────────────┐
                │                               │
                ▼                               ▼
┌───────────────────────────┐   ┌───────────────────────────┐
│      CallScreen.jsx       │   │     Transcript.jsx        │
│  ┌─────────────────────┐  │   │  ┌─────────────────────┐  │
│  │  Call Controls      │  │   │  │  Message List       │  │
│  │  - Start/End        │  │   │  │  - User messages    │  │
│  │  - Mute/Unmute      │  │   │  │  - AI responses     │  │
│  │  - Voice/Text toggle│  │   │  │  - Timestamps       │  │
│  └─────────────────────┘  │   │  └─────────────────────┘  │
│  ┌─────────────────────┐  │   │  ┌─────────────────────┐  │
│  │  Waveform           │  │   │  │  Export Controls    │  │
│  │  - Audio visual     │  │   │  │  - TXT, JSON, MD    │  │
│  │  - Real-time update │  │   │  │  - Copy, Download   │  │
│  └─────────────────────┘  │   │  └─────────────────────┘  │
│  ┌─────────────────────┐  │   └───────────────────────────┘
│  │  Text Input         │  │
│  │  - Message box      │  │
│  │  - Send button      │  │
│  └─────────────────────┘  │
└───────────────────────────┘
                │
                │
                ▼
┌─────────────────────────────────────────────────────────────────┐
│                       VOICE MODULES                             │
│                    (Web Speech API)                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │ STTEngine.js │  │ TTSEngine.js │  │AudioProcessor│         │
│  │              │  │              │  │    .js       │         │
│  │ - Start/Stop │  │ - Speak text │  │ - Microphone │         │
│  │ - Continuous │  │ - Voice      │  │ - Waveform   │         │
│  │ - Interim    │  │   selection  │  │   data       │         │
│  │   results    │  │ - Rate/Pitch │  │ - Volume     │         │
│  │ - Final text │  │ - Volume     │  │   analysis   │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                │
                │
                ▼
┌─────────────────────────────────────────────────────────────────┐
│                      API CLIENT MODULE                          │
│                      (modules/api/client.js)                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  API Methods:                                            │  │
│  │  • sendMessage(message, history, options)                │  │
│  │  • getPreferences()                                      │  │
│  │  • updatePreferences(prefs)                              │  │
│  │  • exportTranscript(conversation, format)                │  │
│  │  • invokePlugin(name, context)                           │  │
│  │  • healthCheck()                                         │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                │
                │ HTTP/REST
                │
                ▼
┌─────────────────────────────────────────────────────────────────┐
│                      FLASK BACKEND                              │
│                    (Python + Flask)                             │
└─────────────────────────────────────────────────────────────────┘
                │
        ┌───────┴───────┬───────────┬───────────┐
        │               │           │           │
        ▼               ▼           ▼           ▼
┌─────────────┐ ┌─────────────┐ ┌──────────┐ ┌──────────┐
│   Chat      │ │   Config    │ │Transcript│ │ Plugins  │
│   Routes    │ │   Routes    │ │  Routes  │ │  Routes  │
│             │ │             │ │          │ │          │
│ /api/chat   │ │/api/config/ │ │/api/     │ │/api/     │
│ /api/models │ │preferences  │ │transcript│ │plugins   │
│             │ │/voices      │ │/save     │ │/invoke   │
│             │ │/personalities│ │/export   │ │          │
└─────────────┘ └─────────────┘ └──────────┘ └──────────┘
        │               │           │           │
        └───────┬───────┴───────────┴───────────┘
                │
                ▼
┌─────────────────────────────────────────────────────────────────┐
│                        AI ENGINE                                │
│                    (app/ai/ modules)                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌────────────────────┐  ┌──────────────────┐                  │
│  │ ModelConnector     │  │ Conversation     │                  │
│  │                    │  │ Manager          │                  │
│  │ ┌────────────────┐ │  │                  │                  │
│  │ │ HuggingFace    │ │  │ • Process        │                  │
│  │ │ Connector      │ │  │   messages       │                  │
│  │ │ - Load model   │ │  │ • Build context  │                  │
│  │ │ - Generate     │ │  │ • Format output  │                  │
│  │ │ - Context      │ │  │ • Personality    │                  │
│  │ └────────────────┘ │  │   prompts        │                  │
│  │                    │  │ • Statistics     │                  │
│  │ ┌────────────────┐ │  └──────────────────┘                  │
│  │ │ OpenAI         │ │                                        │
│  │ │ Connector      │ │  ┌──────────────────┐                  │
│  │ │ - API calls    │ │  │ Intent           │                  │
│  │ │ - Messages     │ │  │ Detector         │                  │
│  │ │ - Streaming    │ │  │                  │                  │
│  │ └────────────────┘ │  │ • Pattern match  │                  │
│  └────────────────────┘  │ • Entity extract │                  │
│                          │ • Plugin routing │                  │
│                          └──────────────────┘                  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                │
                │
                ▼
┌─────────────────────────────────────────────────────────────────┐
│                      PLUGIN SYSTEM                              │
│                    (app/plugins/)                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                  Plugin Registry                          │  │
│  │  • Auto-discover plugins                                 │  │
│  │  • Register instances                                     │  │
│  │  • Route invocations                                      │  │
│  └──────────────────────────────────────────────────────────┘  │
│                          │                                      │
│          ┌───────────────┼───────────────┐                      │
│          │               │               │                      │
│          ▼               ▼               ▼                      │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐               │
│  │ NoteTaker  │  │Summarizer  │  │Translator  │               │
│  │            │  │            │  │            │               │
│  │ • Save     │  │ • Extract  │  │ • Detect   │               │
│  │   notes    │  │   key      │  │   language │               │
│  │ • Tag      │  │   points   │  │ • Translate│               │
│  │ • Retrieve │  │ • Compress │  │ • Format   │               │
│  └────────────┘  └────────────┘  └────────────┘               │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │           Add Your Own Plugins Here!                    │   │
│  │  Just inherit from BasePlugin and implement execute()   │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow Diagram

```
┌─────────┐
│  USER   │
└────┬────┘
     │ 1. Speaks/Types
     ▼
┌─────────────────┐
│   STT Engine    │ (if voice mode)
│  Converts to    │
│     text        │
└────┬────────────┘
     │ 2. Text message
     ▼
┌─────────────────┐
│  API Client     │
│  Adds context   │
└────┬────────────┘
     │ 3. HTTP POST /api/chat
     ▼
┌─────────────────┐
│  Flask Routes   │
│  Validates      │
└────┬────────────┘
     │ 4. Processes request
     ▼
┌─────────────────┐
│ Conversation    │
│   Manager       │
│ Builds context  │
└────┬────────────┘
     │ 5. Formatted prompt
     ▼
┌─────────────────┐
│ Intent Detector │
│ Checks for      │
│ plugin triggers │
└────┬────────────┘
     │ 6. Intent + prompt
     ▼
┌─────────────────┐
│ Model Connector │
│ HuggingFace or  │
│    OpenAI       │
└────┬────────────┘
     │ 7. AI generates response
     ▼
┌─────────────────┐
│ Plugin System   │ (if intent detected)
│ Executes plugin │
└────┬────────────┘
     │ 8. Returns JSON
     ▼
┌─────────────────┐
│  API Client     │
│  Receives       │
└────┬────────────┘
     │ 9. Response text
     ▼
┌─────────────────┐
│  TTS Engine     │ (if voice mode)
│  Speaks text    │
└────┬────────────┘
     │ 10. Audio output
     ▼
┌─────────────────┐
│  Transcript     │
│  Updates UI     │
└─────────────────┘
     │
     ▼
┌─────────┐
│  USER   │ Hears/Reads response
└─────────┘
```

## State Management Flow

```
┌────────────────────────────────────────────┐
│         CallContext (React Context)        │
├────────────────────────────────────────────┤
│                                            │
│  State:                                    │
│  ┌──────────────────────────────────────┐  │
│  │ • callState: IDLE/ACTIVE/ENDED       │  │
│  │ • isVoiceMode: true/false            │  │
│  │ • isMuted: true/false                │  │
│  │ • conversation: Message[]            │  │
│  │ • callDuration: number               │  │
│  │ • userPreferences: {}                │  │
│  └──────────────────────────────────────┘  │
│                                            │
│  Actions (via dispatch):                  │
│  ┌──────────────────────────────────────┐  │
│  │ • START_CALL                         │  │
│  │ • END_CALL                           │  │
│  │ • TOGGLE_VOICE_MODE                  │  │
│  │ • TOGGLE_MUTE                        │  │
│  │ • ADD_MESSAGE                        │  │
│  │ • UPDATE_PREFERENCES                 │  │
│  └──────────────────────────────────────┘  │
│                                            │
└────────────────────────────────────────────┘
                    │
        ┌───────────┴───────────┐
        │                       │
        ▼                       ▼
┌──────────────┐        ┌──────────────┐
│ CallScreen   │        │ Transcript   │
│ - Reads state│        │ - Reads      │
│ - Dispatches │        │   conversation│
│   actions    │        │ - Reads state│
└──────────────┘        └──────────────┘
```

## Plugin Execution Flow

```
User message: "Remember to buy milk"
                │
                ▼
        ┌──────────────┐
        │Chat endpoint │
        └──────┬───────┘
               │
               ▼
        ┌──────────────┐
        │Intent        │
        │Detector      │
        └──────┬───────┘
               │
               ▼ Detects: "note" intent
        ┌──────────────┐
        │Check if      │
        │confidence    │
        │> threshold   │
        └──────┬───────┘
               │
               ▼ Yes (0.8 confidence)
        ┌──────────────┐
        │Suggest plugin│
        │to frontend   │
        └──────┬───────┘
               │
               ▼
        ┌──────────────┐
        │User confirms │
        │(or auto)     │
        └──────┬───────┘
               │
               ▼
        ┌──────────────┐
        │Invoke plugin │
        │endpoint      │
        └──────┬───────┘
               │
               ▼
        ┌──────────────┐
        │Plugin        │
        │Registry      │
        └──────┬───────┘
               │
               ▼
        ┌──────────────┐
        │NoteTaker     │
        │execute()     │
        └──────┬───────┘
               │
               ▼
        ┌──────────────┐
        │Save note     │
        │Return result │
        └──────┬───────┘
               │
               ▼
        ┌──────────────┐
        │Response to   │
        │frontend      │
        └──────────────┘
```

## Configuration Flow

```
┌─────────────────────────────────────────┐
│         Environment Variables           │
│           (backend/.env)                │
├─────────────────────────────────────────┤
│ AI_MODEL_NAME=microsoft/DialoGPT-medium │
│ AI_MODEL_TYPE=huggingface               │
│ SECRET_KEY=...                          │
│ DEBUG=True                              │
│ CORS_ORIGINS=http://localhost:3000      │
└────────────────┬────────────────────────┘
                 │
                 ▼
         ┌──────────────┐
         │  config.py   │
         │  Config class│
         └──────┬───────┘
                │
                ▼
         ┌──────────────┐
         │ Flask app    │
         │ app.config   │
         └──────┬───────┘
                │
     ┌──────────┼──────────┐
     │          │          │
     ▼          ▼          ▼
┌─────────┐ ┌─────────┐ ┌─────────┐
│ Routes  │ │AI Engine│ │ Plugins │
└─────────┘ └─────────┘ └─────────┘
```

## Request/Response Cycle

```
Frontend → Backend → AI Model → Backend → Frontend
   │                                          │
   │  POST /api/chat                          │
   │  {                                       │
   │    message: "Hello",                     │
   │    personality: "friendly"               │
   │  }                                       │
   │                                          │
   ├──────────────────────────────────────────►
                  │
                  ▼
          Process message
          Build context
          Detect intent
                  │
                  ▼
          Generate response
          "Hi! How are you?"
                  │
                  ▼
   ◄──────────────────────────────────────────┤
   │                                          │
   │  200 OK                                  │
   │  {                                       │
   │    message: "Hi! How are you?",          │
   │    intent: {...},                        │
   │    metadata: {...}                       │
   │  }                                       │
   │                                          │
   ▼                                          │
Update UI
Speak response (TTS)
Add to transcript
```

## File Organization Logic

```
Purpose-based organization:

frontend/src/
├── components/     → UI elements (what users see)
├── modules/        → Business logic (how things work)
├── context/        → State management (shared data)
├── hooks/          → Reusable logic (custom hooks)
└── utils/          → Helper functions

backend/app/
├── routes/         → API endpoints (HTTP interface)
├── ai/             → AI logic (model handling)
├── plugins/        → Extension system
└── utils/          → Helper functions

docs/               → User-facing documentation
```

## Key Files Quick Reference

| File | Purpose | When to Edit |
|------|---------|--------------|
| `frontend/src/App.jsx` | Root component | Rarely |
| `frontend/src/components/CallScreen/CallScreen.jsx` | Main UI | Add features |
| `frontend/src/context/CallContext.jsx` | Global state | Add state |
| `frontend/src/modules/api/client.js` | API calls | Add endpoints |
| `backend/run.py` | Entry point | Change port |
| `backend/config.py` | Configuration | Add settings |
| `backend/app/__init__.py` | App setup | Add blueprints |
| `backend/app/routes/chat.py` | Chat API | Change logic |
| `backend/app/ai/model_connector.py` | AI models | Add models |
| `backend/app/plugins/base.py` | Plugin base | Never |
| `.env` | Secrets | Configure |

This overview should help you navigate and understand the codebase structure!
