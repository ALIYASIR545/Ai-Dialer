# AI Dialer - Setup Guide

Complete setup instructions for development and production environments.

## Development Setup

### System Requirements

#### Minimum Requirements
- CPU: 2+ cores
- RAM: 4GB (8GB recommended)
- Storage: 5GB free space
- OS: Windows 10+, macOS 10.15+, or Linux

#### Software Requirements
- Node.js 18+ and npm
- Python 3.9+
- Git

### Step 1: Clone Repository

```bash
git clone https://github.com/yourusername/ai-dialer.git
cd ai-dialer
```

### Step 2: Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will be available at: http://localhost:3000

#### Frontend Configuration

Create `frontend/.env.local`:

```env
VITE_API_URL=http://localhost:5000
```

### Step 3: Backend Setup

#### Create Virtual Environment

**Windows:**
```bash
cd backend
python -m venv venv
venv\Scripts\activate
```

**macOS/Linux:**
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
```

#### Install Dependencies

```bash
pip install -r requirements.txt
```

This will install:
- Flask (web framework)
- Transformers (AI models)
- PyTorch (deep learning)
- And other dependencies

**Note**: PyTorch installation may take 5-10 minutes.

#### Configure Environment

```bash
cp .env.example .env
```

Edit `.env` with your preferences:

```env
# Flask
SECRET_KEY=your-secret-key-here
DEBUG=True

# CORS
CORS_ORIGINS=http://localhost:3000

# AI Model
AI_MODEL_NAME=microsoft/DialoGPT-medium
AI_MODEL_TYPE=huggingface

# Optional: HuggingFace token for gated models
HUGGINGFACE_TOKEN=

# Optional: OpenAI API
OPENAI_API_KEY=
```

#### Start Backend Server

```bash
python run.py
```

The backend will be available at: http://localhost:5000

**First Run**: The AI model will download automatically. This takes 2-5 minutes depending on your connection.

### Step 4: Test the Application

1. Open http://localhost:3000 in Chrome or Edge
2. Click the green phone button to start a call
3. Grant microphone permissions when prompted
4. Start speaking or toggle to text mode

## AI Model Selection

### HuggingFace Models

The backend supports various models from HuggingFace:

#### Recommended Models

**DialoGPT (Microsoft)**
- `microsoft/DialoGPT-small` (117M params, ~500MB)
  - Fast, lower quality
  - Good for testing
- `microsoft/DialoGPT-medium` (345M params, ~1.5GB)
  - **Recommended**: Balanced speed and quality
- `microsoft/DialoGPT-large` (774M params, ~3GB)
  - Best quality, slower

**BlenderBot (Meta)**
- `facebook/blenderbot-400M-distill` (~1.6GB)
  - Good conversational model
- `facebook/blenderbot-1B-distill` (~4GB)
  - Higher quality, needs more RAM

#### Changing Models

Edit `backend/.env`:

```env
AI_MODEL_NAME=microsoft/DialoGPT-large
```

Restart the backend. The new model will download automatically.

### OpenAI Models

To use OpenAI instead of HuggingFace:

1. Get API key from https://platform.openai.com
2. Edit `backend/.env`:

```env
AI_MODEL_TYPE=openai
OPENAI_API_KEY=sk-...your-key...
OPENAI_MODEL=gpt-3.5-turbo
```

3. Restart backend

**Note**: OpenAI requires internet connection and API credits.

## GPU Acceleration (Optional)

If you have an NVIDIA GPU with CUDA support:

### Windows

```bash
pip install torch --index-url https://download.pytorch.org/whl/cu118
```

### Linux

```bash
pip install torch --index-url https://download.pytorch.org/whl/cu118
```

The backend will automatically detect and use GPU if available.

**Benefits**: 2-5x faster response times

## Common Setup Issues

### Issue: Module not found errors

**Solution**:
```bash
# Make sure virtual environment is activated
# Windows: venv\Scripts\activate
# Mac/Linux: source venv/bin/activate

# Reinstall dependencies
pip install -r requirements.txt
```

### Issue: Out of memory when loading model

**Solutions**:
1. Use a smaller model (DialoGPT-small)
2. Close other applications
3. Increase system swap/page file
4. Use OpenAI API instead

### Issue: Microphone not working

**Solutions**:
1. Use Chrome or Edge browser
2. Grant microphone permissions
3. Check system microphone settings
4. Try text mode instead

### Issue: CORS errors in browser

**Solution**:
- Verify `CORS_ORIGINS` in `backend/.env` matches frontend URL
- Restart backend after changes

### Issue: Port already in use

**Frontend (port 3000)**:
```bash
# Change port in vite.config.js
server: {
  port: 3001
}
```

**Backend (port 5000)**:
```bash
# Change port in run.py
app.run(port=5001)
```

## Production Setup

### Frontend Deployment (Vercel)

#### Step 1: Prepare for Deployment

Update `frontend/vite.config.js`:

```javascript
export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser'
  }
})
```

#### Step 2: Deploy to Vercel

**Via Vercel CLI:**
```bash
npm install -g vercel
cd frontend
vercel --prod
```

**Via Vercel Dashboard:**
1. Go to https://vercel.com
2. Import your GitHub repository
3. Set root directory: `frontend`
4. Build command: `npm install && npm run build`
5. Output directory: `dist`
6. Add environment variable:
   - `VITE_API_URL`: Your backend URL

### Backend Deployment (Render)

#### Step 1: Prepare for Deployment

Ensure these files exist:
- `backend/requirements.txt`
- `backend/Procfile`
- `backend/render.yaml`

#### Step 2: Deploy to Render

1. Go to https://render.com
2. Create new Web Service
3. Connect your GitHub repository
4. Render auto-detects `render.yaml`
5. Add environment variables:
   - `SECRET_KEY`: Generate random string
   - `AI_MODEL_NAME`: `microsoft/DialoGPT-medium`
   - `AI_MODEL_TYPE`: `huggingface`
   - `DEBUG`: `False`
   - `CORS_ORIGINS`: Your frontend URL

#### Step 3: Update Frontend

After backend is deployed, update frontend environment:

```env
VITE_API_URL=https://your-app.onrender.com
```

Redeploy frontend.

### Alternative: Docker Deployment

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      - VITE_API_URL=http://localhost:5000

  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      - AI_MODEL_NAME=microsoft/DialoGPT-medium
      - DEBUG=False
    volumes:
      - model-cache:/root/.cache
    deploy:
      resources:
        limits:
          memory: 4G

volumes:
  model-cache:
```

Run:
```bash
docker-compose up
```

## Development Workflow

### Making Changes

#### Frontend Changes
```bash
cd frontend
npm run dev
# Make changes - hot reload enabled
```

#### Backend Changes
```bash
cd backend
source venv/bin/activate  # or venv\Scripts\activate on Windows
python run.py
# Make changes - auto-reload enabled in DEBUG mode
```

### Testing

#### Frontend
```bash
cd frontend
npm run build
npm run preview
```

#### Backend
```bash
cd backend
# Test API endpoints
curl http://localhost:5000/api/health
```

### Code Style

#### Frontend
- Follow React best practices
- Use functional components with hooks
- Keep components small and focused

#### Backend
- Follow PEP 8 style guide
- Add docstrings to functions
- Keep routes simple, logic in modules

## Next Steps

- Read [ARCHITECTURE.md](../ARCHITECTURE.md) for system design
- Check [API.md](API.md) for API documentation
- See [PLUGINS.md](PLUGINS.md) to create plugins
- Review [README.md](../README.md) for feature overview

## Getting Help

- Check [troubleshooting section](#common-setup-issues)
- Open an issue on GitHub
- Review error logs in terminal
