# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Text-to-Speech (TTS) application with:
- **Frontend**: React with JSX and TailwindCSS
- **Backend**: Node.js with Express API
- **Database**: SQLite for storing user preferences and TTS history
- **TTS Engine**: Google Cloud Text-to-Speech API with Neural2 voices
- **AI Integration**: OpenRouter API for AI-powered text processing
- **Deployment**: Fly.io

## Development Commands

### Setup
```bash
# Install dependencies for both frontend and backend
npm install
cd client && npm install && cd ..

# Setup environment variables
cp .env.example .env
# Add GOOGLE_API_KEY or GOOGLE_APPLICATION_CREDENTIALS to .env
```

### Development
```bash
# IMPORTANTE: La aplicación completa corre en el puerto 3000
# Frontend y backend servidos desde el mismo servidor Express
# Base de datos se inicializa automáticamente al arrancar

# Setup inicial (solo la primera vez)
npm run setup

# Desarrollo (compila frontend y levanta servidor con nodemon)
npm run dev

# Producción (con inicialización automática de BD)
npm run start

# Otros comandos útiles
npm run build      # Solo compilar frontend (fallback si falla)
npm run init-db    # Inicializar base de datos manualmente
npm run migrate    # Ejecutar migraciones de base de datos
npm run seed       # Poblar base de datos con datos de prueba
```

### Testing & Quality
```bash
# Run all tests
npm test

# Run backend tests
npm run test:backend

# Run frontend tests
npm run test:frontend

# Lint code
npm run lint

# Format code
npm run format

# Type check (if TypeScript is used)
npm run typecheck
```

### Deployment
```bash
# Deploy to Fly.io
fly deploy

# View logs
fly logs

# SSH into production
fly ssh console
```

## Architecture

### Directory Structure
```
tts/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/        # Page components
│   │   ├── hooks/        # Custom React hooks
│   │   ├── utils/        # Frontend utilities
│   │   └── services/     # API client services
│   └── public/           # Static assets
├── server/                # Express backend
│   ├── routes/           # API route handlers
│   ├── controllers/      # Business logic
│   ├── models/          # Database models
│   ├── middleware/      # Express middleware
│   └── services/        # External service integrations
├── database/             # SQLite database files
│   ├── migrations/      # Database migrations
│   └── seeds/          # Seed data
└── shared/              # Shared types/utilities
```

### API Endpoints
- `POST /api/tts/synthesize` - Convert text to speech
- `GET /api/tts/voices` - List available voices
- `GET /api/tts/history` - Get user's TTS history
- `POST /api/tts/enhance` - Enhance text with AI before synthesis
- `GET /api/audio/:id` - Stream synthesized audio

### Database Schema
```sql
-- users table: user preferences and settings
-- tts_history table: tracks all TTS requests
-- voices table: available TTS voices and configurations
-- audio_files table: stores generated audio file metadata
```

### Key Integration Points

1. **Google TTS Integration** (`server/services/ttsEngine.js`)
   - **5 voces Neural2 oficiales en español**: Elena, Carmen, Pablo, Diego, Sofía
   - Detección automática de género y idioma desde la base de datos
   - Audio format conversion (MP3, WAV)
   - Caching strategy

2. **Database Auto-Initialization** (`scripts/init-db.js`)
   - Migraciones automáticas al startup del servidor
   - Seeds automáticos con voces oficiales de Google
   - Detección inteligente del estado de la base de datos

3. **Dual Frontend Strategy** 
   - **Desarrollo**: React + Vite con hot reload
   - **Producción**: HTML simple con React CDN (sin dependencias de build)
   - Fallback automático si falla el build de Vite

4. **OpenRouter Integration** (`server/services/openrouter.js`)
   - Text enhancement before TTS (opcional)
   - Language detection
   - SSML generation

## Important Patterns

### Error Handling
- Use try-catch blocks with proper error logging
- Return consistent error response format: `{ error: { message, code } }`
- Log errors to console in development, to logging service in production

### API Response Format
```javascript
// Success
{ success: true, data: {...} }

// Error
{ success: false, error: { message: "...", code: "ERROR_CODE" } }
```

### Environment Variables
Required in `.env`:
- `GOOGLE_API_KEY` - Google Cloud API key (simple) OR `GOOGLE_APPLICATION_CREDENTIALS` - Path to service account JSON
- `OPENROUTER_API_KEY` - OpenRouter API key (optional, for text enhancement)
- `DATABASE_URL` - SQLite database path (auto-configured for Fly.io: `/data/tts.db`)
- `PORT` - Server port (default: 3000)

**Google Cloud Setup (Option A - API Key):**
1. Create a Google Cloud project and enable Text-to-Speech API
2. Generate an API key in Google Cloud Console
3. Set `GOOGLE_API_KEY=your_api_key` in `.env`

**Google Cloud Setup (Option B - Service Account):**
1. Create a Google Cloud project and enable Text-to-Speech API
2. Create a service account and download the JSON key
3. Set `GOOGLE_APPLICATION_CREDENTIALS=path/to/service-account.json` in `.env`

## Fly.io Deployment Notes

- **Zero-configuration deployment**: `fly deploy` 
- **Database auto-initialization**: Migrations and seeds run automatically on first startup
- **SQLite database**: Persisted in volume mounted at `/data/tts.db`
- **Frontend fallback**: Uses simple HTML if React build fails (no Vite/Rollup issues)
- **Environment variables**: Set via `fly secrets set GOOGLE_API_KEY=your_key`
- **Health check endpoint**: `GET /api/health`
- **Auto-scaling**: Configured in `fly.toml`

### Production Deployment Steps:
1. `fly secrets set GOOGLE_API_KEY=your_google_api_key`
2. `fly deploy`
3. ✅ Done! App will auto-initialize database with Spanish Neural2 voices