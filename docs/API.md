# API Documentation

Complete API reference for the AI Dialer backend.

## Base URL

**Development**: `http://localhost:5000`
**Production**: `https://your-backend.onrender.com`

All API endpoints are prefixed with `/api`.

## Authentication

Currently, the API does not require authentication. In production, consider adding:
- API keys
- JWT tokens
- OAuth 2.0

## Response Format

All responses follow this structure:

**Success Response:**
```json
{
  "data": { ... },
  "message": "Success message"
}
```

**Error Response:**
```json
{
  "error": "Error description",
  "message": "User-friendly error message"
}
```

## Endpoints

### Health Check

Check if the API is running.

**Endpoint:** `GET /api/health`

**Response:**
```json
{
  "status": "healthy",
  "model": "microsoft/DialoGPT-medium"
}
```

---

## Chat Endpoints

### Send Message

Send a message to the AI and get a response.

**Endpoint:** `POST /api/chat`

**Request Body:**
```json
{
  "message": "Hello, how are you?",
  "conversation_history": [
    {
      "role": "user",
      "content": "Previous message",
      "timestamp": 1234567890000
    }
  ],
  "personality": "assistant",
  "user_preferences": {
    "name": "John",
    "tone": "professional"
  }
}
```

**Parameters:**
- `message` (required): User's message
- `conversation_history` (optional): Array of previous messages
- `personality` (optional): AI personality type
  - Options: `assistant`, `friendly`, `professional`, `tutor`, `creative`, `coach`
- `user_preferences` (optional): User settings

**Response:**
```json
{
  "message": "I'm doing well, thank you for asking! How can I help you today?",
  "metadata": {
    "personality": "assistant",
    "user_name": "John",
    "timestamp": "2024-01-15T10:30:00"
  },
  "intent": {
    "intents": [],
    "primary_intent": null,
    "has_intent": false
  },
  "plugin_suggestion": null
}
```

**Status Codes:**
- `200`: Success
- `400`: Invalid request
- `500`: Server error

---

### Get Available Models

List available AI models.

**Endpoint:** `GET /api/models`

**Response:**
```json
{
  "current": {
    "name": "microsoft/DialoGPT-medium",
    "type": "huggingface"
  },
  "available": {
    "huggingface": [
      "microsoft/DialoGPT-small",
      "microsoft/DialoGPT-medium",
      "microsoft/DialoGPT-large",
      "facebook/blenderbot-400M-distill"
    ],
    "openai": [
      "gpt-3.5-turbo",
      "gpt-4"
    ]
  }
}
```

---

## Configuration Endpoints

### Get User Preferences

Retrieve user preferences.

**Endpoint:** `GET /api/config/preferences`

**Query Parameters:**
- `user_id` (optional): User identifier (default: "default")

**Response:**
```json
{
  "name": "User",
  "avatar": null,
  "voicePreference": "default",
  "tone": "professional",
  "personality": "assistant"
}
```

---

### Update User Preferences

Update user preferences.

**Endpoint:** `PUT /api/config/preferences`

**Request Body:**
```json
{
  "user_id": "user123",
  "name": "John Doe",
  "voicePreference": "friendly",
  "tone": "casual",
  "personality": "friendly"
}
```

**Response:**
```json
{
  "success": true,
  "preferences": {
    "user_id": "user123",
    "name": "John Doe",
    "voicePreference": "friendly",
    "tone": "casual",
    "personality": "friendly"
  }
}
```

---

### Get Voice Presets

List available voice presets.

**Endpoint:** `GET /api/config/voices`

**Response:**
```json
{
  "presets": [
    {
      "id": "assistant",
      "name": "Assistant",
      "description": "Balanced and professional",
      "rate": 1.0,
      "pitch": 1.0
    },
    {
      "id": "friendly",
      "name": "Friendly",
      "description": "Warm and conversational",
      "rate": 0.95,
      "pitch": 1.1
    }
  ]
}
```

---

### Get AI Personalities

List available AI personalities.

**Endpoint:** `GET /api/config/personalities`

**Response:**
```json
[
  {
    "id": "assistant",
    "name": "Assistant",
    "description": "Helpful and informative"
  },
  {
    "id": "friendly",
    "name": "Friendly",
    "description": "Warm and conversational"
  }
]
```

---

## Transcript Endpoints

### Save Transcript

Save a conversation transcript.

**Endpoint:** `POST /api/transcript/save`

**Request Body:**
```json
{
  "conversation": [
    {
      "role": "user",
      "content": "Hello",
      "timestamp": 1234567890000
    },
    {
      "role": "assistant",
      "content": "Hi! How can I help?",
      "timestamp": 1234567891000
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Transcript saved successfully",
  "stats": {
    "total_messages": 2,
    "user_messages": 1,
    "ai_messages": 1,
    "duration_seconds": 1
  }
}
```

---

### Export Transcript

Export transcript in various formats.

**Endpoint:** `POST /api/transcript/export`

**Request Body:**
```json
{
  "conversation": [ ... ],
  "format": "txt"
}
```

**Parameters:**
- `format`: Export format
  - Options: `txt`, `json`, `md` (markdown)

**Response:**
- File download with appropriate MIME type
- Filename: `transcript.{format}`

---

### Get Transcript Stats

Get statistics about a conversation.

**Endpoint:** `POST /api/transcript/stats`

**Request Body:**
```json
{
  "conversation": [ ... ]
}
```

**Response:**
```json
{
  "total_messages": 10,
  "user_messages": 5,
  "ai_messages": 5,
  "duration_seconds": 120
}
```

---

## Plugin Endpoints

### List Plugins

Get all available plugins.

**Endpoint:** `GET /api/plugins`

**Response:**
```json
{
  "plugins": [
    {
      "name": "NoteTakerPlugin",
      "description": "Takes and stores notes from the conversation",
      "enabled": true
    },
    {
      "name": "SummarizerPlugin",
      "description": "Summarizes conversations and long text passages",
      "enabled": true
    }
  ],
  "count": 2
}
```

---

### Invoke Plugin

Execute a plugin.

**Endpoint:** `POST /api/plugins/invoke`

**Request Body:**
```json
{
  "plugin": "NoteTakerPlugin",
  "context": {
    "content": "Remember to buy milk",
    "tags": ["shopping"]
  }
}
```

**Response:**
```json
{
  "success": true,
  "plugin": "NoteTakerPlugin",
  "result": {
    "note": {
      "id": 1,
      "content": "Remember to buy milk",
      "timestamp": "2024-01-15T10:30:00",
      "tags": ["shopping"]
    },
    "message": "Note saved successfully"
  }
}
```

---

### Get Plugin Info

Get information about a specific plugin.

**Endpoint:** `GET /api/plugins/{plugin_name}`

**Example:** `GET /api/plugins/NoteTakerPlugin`

**Response:**
```json
{
  "name": "NoteTakerPlugin",
  "description": "Takes and stores notes from the conversation",
  "enabled": true
}
```

---

## Plugin-Specific APIs

### Note Taker Plugin

**Context Parameters:**
```json
{
  "content": "Note text (required)",
  "user_id": "Optional user ID",
  "tags": ["optional", "tags"]
}
```

---

### Summarizer Plugin

**Context Parameters:**
```json
{
  "text": "Text to summarize (optional)",
  "conversation": [ ... ],  // Or conversation history
  "max_length": 100  // Optional, default 100 words
}
```

**Response:**
```json
{
  "summary": "Summarized text...",
  "original_length": 500,
  "summary_length": 98,
  "compression_ratio": "19.6%"
}
```

---

### Translator Plugin

**Context Parameters:**
```json
{
  "text": "Text to translate (required)",
  "target_language": "spanish (required)",
  "source_language": "auto (optional)"
}
```

**Response:**
```json
{
  "original_text": "Hello",
  "translated_text": "Hola",
  "source_language": "auto",
  "target_language": "es",
  "message": "Translated to spanish"
}
```

**Supported Languages:**
- Spanish, French, German, Italian, Portuguese
- Russian, Chinese, Japanese, Korean, Arabic

---

## Error Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 400 | Bad Request - Invalid parameters |
| 404 | Not Found - Resource doesn't exist |
| 500 | Internal Server Error |

## Rate Limiting

Currently no rate limiting is implemented. For production:
- Implement rate limiting per IP/user
- Consider using Flask-Limiter
- Suggested: 60 requests per minute

## CORS

CORS is configured via `CORS_ORIGINS` environment variable.

Default development: `http://localhost:3000`

## Example Requests

### cURL Examples

**Send Chat Message:**
```bash
curl -X POST http://localhost:5000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Hello, AI!",
    "personality": "friendly"
  }'
```

**Export Transcript:**
```bash
curl -X POST http://localhost:5000/api/transcript/export \
  -H "Content-Type: application/json" \
  -d '{
    "conversation": [...],
    "format": "txt"
  }' \
  --output transcript.txt
```

**Invoke Plugin:**
```bash
curl -X POST http://localhost:5000/api/plugins/invoke \
  -H "Content-Type: application/json" \
  -d '{
    "plugin": "NoteTakerPlugin",
    "context": {
      "content": "Important note"
    }
  }'
```

### JavaScript Examples

**Send Message:**
```javascript
const response = await fetch('http://localhost:5000/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    message: 'Hello!',
    personality: 'assistant'
  })
})
const data = await response.json()
console.log(data.message)
```

**Get Preferences:**
```javascript
const response = await fetch('http://localhost:5000/api/config/preferences')
const preferences = await response.json()
console.log(preferences)
```

## WebSocket Support (Future)

WebSocket support for real-time conversation is planned:

```javascript
const ws = new WebSocket('ws://localhost:5000/api/ws')

ws.onmessage = (event) => {
  const data = JSON.parse(event.data)
  console.log('AI response:', data.message)
}

ws.send(JSON.stringify({ message: 'Hello!' }))
```

## SDK (Future)

A JavaScript SDK is planned for easier integration:

```javascript
import { AIDialer } from 'ai-dialer-sdk'

const client = new AIDialer({
  apiUrl: 'http://localhost:5000'
})

const response = await client.chat.send('Hello!')
console.log(response.message)
```
