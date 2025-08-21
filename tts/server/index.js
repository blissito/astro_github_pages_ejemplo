require('dotenv').config();
const express = require('express');
const cors = require('cors');
const compression = require('compression');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const logger = require('./utils/logger');

const ttsRoutes = require('./routes/tts');
const audioRoutes = require('./routes/audio');
const healthRoutes = require('./routes/health');
const errorHandler = require('./middleware/errorHandler');
const initializeDatabase = require('../scripts/init-db');

const app = express();
const PORT = process.env.PORT || 3000;

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later.'
});

app.use(helmet({
  contentSecurityPolicy: false,
}));
app.use(compression());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use('/api', limiter);
app.use('/api/tts', ttsRoutes);
app.use('/api/audio', audioRoutes);
app.use('/api/health', healthRoutes);

// Servir archivos estáticos de uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Servir frontend - priorizar build compilado, fallback a HTML simple
const clientBuildPath = path.join(__dirname, '../client/dist');
const publicPath = path.join(__dirname, '../public');
const clientBuildExists = require('fs').existsSync(clientBuildPath);

if (clientBuildExists) {
  console.log('📦 Serving compiled frontend from client/dist');
  app.use(express.static(clientBuildPath));
} else {
  console.log('📄 Serving simple frontend from public/');
  app.use(express.static(publicPath));
}

// Catch-all para rutas del cliente
app.get('*', (req, res) => {
  // Si es una ruta de API que no existe, devolver 404
  if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) {
    return res.status(404).json({ error: 'Not found' });
  }
  
  // Servir el frontend apropiado
  if (clientBuildExists) {
    res.sendFile(path.join(clientBuildPath, 'index.html'));
  } else {
    res.sendFile(path.join(publicPath, 'index.html'));
  }
});

app.use(errorHandler);

// Función para iniciar el servidor
async function startServer() {
  try {
    // Inicializar base de datos antes de empezar el servidor
    await initializeDatabase();
    
    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
}

// Iniciar el servidor
startServer();