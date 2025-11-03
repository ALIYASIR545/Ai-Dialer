# Troubleshooting 404 Error

## Understanding the Error

```
Failed to load resource: the server responded with a status of 404 (NOT FOUND)
(index):1
```

This error means a file or resource cannot be found. Let's diagnose and fix it.

## Common Causes & Solutions

### 1. Frontend Not Built Yet (Most Likely)

**Problem:** Frontend files haven't been built/served yet.

**Solution:** Install frontend dependencies and start the dev server.

```bash
# Fix npm first
cd "c:\Users\ADMIN\Ai Dailer\frontend"
npm cache clean --force
npm install

# Or use yarn
npm install -g yarn
yarn install

# Then start the dev server
npm run dev
# or
yarn dev
```

**Expected Result:** Frontend runs on http://localhost:3000

---

### 2. Backend Not Running

**Problem:** Backend server is not started.

**Solution:** Start the backend server.

```bash
cd "c:\Users\ADMIN\Ai Dailer\backend"
venv\Scripts\activate
python run.py
```

**Expected Result:** Server runs on http://localhost:5000

---

### 3. Wrong URL/Port

**Problem:** Accessing wrong URL or port.

**Check:**
- Frontend should be: `http://localhost:3000`
- Backend should be: `http://localhost:5000`

**Don't access:**
- ❌ `http://localhost:3000/index.html` (Vite uses root)
- ❌ `http://localhost:5000` (Backend is API only)
- ❌ `file:///C:/Users/...` (Must use dev server)

---

### 4. Build Files Missing

**Problem:** Production build not generated.

**Solution:** Build the frontend.

```bash
cd frontend
npm run build
# Creates dist/ folder with built files
```

---

## Step-by-Step Diagnosis

### Step 1: Check What's Running

Open browser console (F12) and check:

```
Failed to load resource: http://localhost:XXXX/...
```

Note the port number.

### Step 2: Verify Services

**Check Backend:**
```bash
curl http://localhost:5000/api/health
```

Should return:
```json
{"status":"healthy","model":"microsoft/DialoGPT-medium"}
```

**Check Frontend:**
Open: `http://localhost:3000`

Should show the AI Dialer interface.

### Step 3: Check Browser Console

Open Developer Tools (F12) → Console tab

Look for specific error:
- `GET http://localhost:3000/ 404` → Frontend not running
- `GET http://localhost:5000/api/... 404` → Backend not running or wrong endpoint
- `GET http://localhost:3000/src/... 404` → Vite dev server issue

---

## Quick Fix Guide

### Scenario A: Trying to Open Frontend

**Error:** `http://localhost:3000` shows 404

**Fix:**
```bash
# Terminal 1 - Start Frontend
cd "c:\Users\ADMIN\Ai Dailer\frontend"

# Install dependencies first (if not done)
npm install  # or yarn install

# Start dev server
npm run dev  # or yarn dev
```

Wait for:
```
VITE v5.3.3  ready in XXX ms
➜  Local:   http://localhost:3000/
```

Then open: `http://localhost:3000`

---

### Scenario B: API Calls Failing

**Error:** Frontend shows but API calls return 404

**Fix:**
```bash
# Terminal 2 - Start Backend
cd "c:\Users\ADMIN\Ai Dailer\backend"
venv\Scripts\activate
python run.py
```

Wait for:
```
AI Dialer Backend Server
Server starting on http://localhost:5000
```

---

### Scenario C: Production Build

**Error:** Deployed app shows 404

**Fix:**
```bash
cd frontend
npm run build
npm run preview
```

Or configure your hosting platform correctly.

---

## File-Specific 404s

### Missing index.html

**Error:** `GET /index.html 404`

**Check:** File exists at `frontend/index.html`

**Create if missing:**
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>AI Dialer</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

### Missing main.jsx

**Error:** `GET /src/main.jsx 404`

**Check:** File exists at `frontend/src/main.jsx`

**Verify content** (already created).

### Missing CSS

**Error:** `GET /src/index.css 404`

**Check:** File exists at `frontend/src/index.css`

**Verify content** (already created).

---

## Complete Startup Procedure

### 1. Backend (Terminal 1)

```bash
# Navigate
cd "c:\Users\ADMIN\Ai Dailer\backend"

# Activate environment
venv\Scripts\activate

# Start server
python run.py
```

**Verify:** Open http://localhost:5000/api/health

Should see:
```json
{"status":"healthy","model":"microsoft/DialoGPT-medium"}
```

### 2. Frontend (Terminal 2)

```bash
# Navigate
cd "c:\Users\ADMIN\Ai Dailer\frontend"

# Install if not done
npm install  # Skip if already installed

# Start dev server
npm run dev
```

**Verify:** Open http://localhost:3000

Should see AI Dialer UI.

### 3. Check Logs

**Backend logs** (Terminal 1):
```
* Running on http://127.0.0.1:5000
* Running on http://192.168.x.x:5000
```

**Frontend logs** (Terminal 2):
```
VITE v5.3.3  ready in 500 ms
➜  Local:   http://localhost:3000/
```

---

## Advanced Diagnostics

### Check Vite Config

File: `frontend/vite.config.js`

Should have:
```javascript
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true
      }
    }
  }
})
```

### Check CORS

File: `backend/.env`

Should have:
```env
CORS_ORIGINS=http://localhost:3000
```

### Check Flask Routes

File: `backend/run.py`

Should start Flask app:
```python
from app import create_app

app = create_app()

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
```

---

## Common Mistakes

### ❌ Don't Do This:

1. **Opening files directly**
   ```
   file:///C:/Users/ADMIN/Ai Dailer/frontend/index.html
   ```
   ❌ Won't work! Use dev server.

2. **Wrong port**
   ```
   http://localhost:5000  (Backend API, not UI)
   ```
   ❌ Should be http://localhost:3000

3. **Not starting both servers**
   - Frontend needs backend for API calls
   - Backend needs to be running

4. **npm not installed**
   - Need to run `npm install` first
   - Or fix npm cache issue

---

## ✅ Correct Workflow

1. **Fix npm** (if needed):
   ```bash
   npm cache clean --force
   npm install -g npm@latest
   ```

2. **Install frontend packages**:
   ```bash
   cd frontend
   npm install
   ```

3. **Start backend** (Terminal 1):
   ```bash
   cd backend
   venv\Scripts\activate
   python run.py
   ```

4. **Start frontend** (Terminal 2):
   ```bash
   cd frontend
   npm run dev
   ```

5. **Open browser**:
   ```
   http://localhost:3000
   ```

---

## Still Getting 404?

### Check Network Tab

1. Open browser DevTools (F12)
2. Go to Network tab
3. Refresh page
4. Look for failed requests (red)
5. Click on failed request
6. Check:
   - Request URL
   - Status code
   - Response

### Check All Files Exist

```bash
cd "c:\Users\ADMIN\Ai Dailer"

# Check frontend files
ls frontend/index.html
ls frontend/src/main.jsx
ls frontend/src/App.jsx
ls frontend/package.json

# Check backend files
ls backend/run.py
ls backend/app/__init__.py
ls backend/.env
```

All should exist (already created).

### Restart Everything

```bash
# Kill all processes
# Press Ctrl+C in both terminals

# Clear caches
cd frontend
npm cache clean --force

# Restart backend
cd ../backend
venv\Scripts\activate
python run.py

# Restart frontend (new terminal)
cd ../frontend
npm run dev
```

---

## Quick Reference

| Issue | Solution |
|-------|----------|
| Frontend 404 | Start dev server: `npm run dev` |
| API 404 | Start backend: `python run.py` |
| npm error | Clean cache: `npm cache clean --force` |
| Port in use | Change port in `vite.config.js` |
| CORS error | Check `.env` CORS_ORIGINS |
| File not found | Verify file exists |

---

## Current Status

Based on your installation:

✅ **Backend:** Fully installed and ready
- All packages installed
- Configuration complete
- Can start with `python run.py`

⚠️ **Frontend:** npm issue
- Files created ✅
- npm needs fixing ⚠️
- See FINAL_SETUP_INSTRUCTIONS.md

**To fix 404:** Complete frontend setup then start both servers.

---

## Get Help

If 404 persists:

1. Share the exact error from browser console
2. Share which URL you're accessing
3. Confirm both servers are running
4. Check the Network tab in DevTools

Error format:
```
GET http://localhost:XXXX/path/to/file 404 (Not Found)
```

Tell me:
- The URL (XXXX and path)
- What you're trying to access
- Which terminal shows what

---

**Most likely fix:** Install frontend packages and start `npm run dev`
