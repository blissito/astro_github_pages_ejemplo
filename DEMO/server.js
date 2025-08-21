const express = require('express');
const path = require('path');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Voces en español oficiales 2025
const spanishVoices = [
  // España (es-ES)
  { code: 'es-ES-Neural2-A', name: 'España - Femenino (Neural2-A)', gender: 'FEMALE', region: 'España' },
  { code: 'es-ES-Neural2-B', name: 'España - Masculino (Neural2-B)', gender: 'MALE', region: 'España' },
  { code: 'es-ES-Neural2-C', name: 'España - Femenino (Neural2-C)', gender: 'FEMALE', region: 'España' },
  { code: 'es-ES-Neural2-D', name: 'España - Femenino (Neural2-D)', gender: 'FEMALE', region: 'España' },
  { code: 'es-ES-Neural2-E', name: 'España - Femenino (Neural2-E)', gender: 'FEMALE', region: 'España' },
  { code: 'es-ES-Neural2-F', name: 'España - Masculino (Neural2-F)', gender: 'MALE', region: 'España' },
  { code: 'es-ES-WaveNet-B', name: 'España - Masculino (WaveNet-B)', gender: 'MALE', region: 'España' },
  { code: 'es-ES-WaveNet-C', name: 'España - Femenino (WaveNet-C)', gender: 'FEMALE', region: 'España' },
  { code: 'es-ES-WaveNet-D', name: 'España - Femenino (WaveNet-D)', gender: 'FEMALE', region: 'España' },
  
  // México (es-MX)
  { code: 'es-MX-Neural2-A', name: 'México - Femenino (Neural2-A)', gender: 'FEMALE', region: 'México' },
  { code: 'es-MX-Neural2-B', name: 'México - Masculino (Neural2-B)', gender: 'MALE', region: 'México' },
  { code: 'es-MX-Neural2-C', name: 'México - Masculino (Neural2-C)', gender: 'MALE', region: 'México' },
  { code: 'es-MX-WaveNet-A', name: 'México - Femenino (WaveNet-A)', gender: 'FEMALE', region: 'México' },
  { code: 'es-MX-WaveNet-B', name: 'México - Masculino (WaveNet-B)', gender: 'MALE', region: 'México' },
  { code: 'es-MX-WaveNet-C', name: 'México - Masculino (WaveNet-C)', gender: 'MALE', region: 'México' },
  
  // Estados Unidos (es-US) - Latino
  { code: 'es-US-Neural2-A', name: 'EEUU Latino - Femenino (Neural2-A)', gender: 'FEMALE', region: 'EEUU Latino' },
  { code: 'es-US-Neural2-B', name: 'EEUU Latino - Masculino (Neural2-B)', gender: 'MALE', region: 'EEUU Latino' },
  { code: 'es-US-Neural2-C', name: 'EEUU Latino - Masculino (Neural2-C)', gender: 'MALE', region: 'EEUU Latino' },
  { code: 'es-US-WaveNet-A', name: 'EEUU Latino - Femenino (WaveNet-A)', gender: 'FEMALE', region: 'EEUU Latino' },
  { code: 'es-US-WaveNet-B', name: 'EEUU Latino - Masculino (WaveNet-B)', gender: 'MALE', region: 'EEUU Latino' },
  { code: 'es-US-WaveNet-C', name: 'EEUU Latino - Masculino (WaveNet-C)', gender: 'MALE', region: 'EEUU Latino' }
];

// Endpoint para obtener las voces disponibles
app.get('/api/voices', (req, res) => {
  res.json(spanishVoices);
});

// Endpoint para síntesis de texto usando REST API
app.post('/api/synthesize', async (req, res) => {
  try {
    const { text, voiceCode, speed = 1.0, pitch = 0.0 } = req.body;

    if (!text || !voiceCode) {
      return res.status(400).json({ error: 'Texto y código de voz son requeridos' });
    }

    // Configurar la solicitud para la API REST
    const apiKey = process.env.GOOGLE_API_KEY;
    const url = `https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`;

    const requestBody = {
      input: {
        text: text
      },
      voice: {
        languageCode: voiceCode.substring(0, 5),
        name: voiceCode
      },
      audioConfig: {
        audioEncoding: 'MP3',
        speakingRate: speed,
        pitch: pitch
      }
    };

    // Hacer la solicitud a la API de Google
    const fetch = (await import('node-fetch')).default;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Error de la API:', data);
      throw new Error(data.error?.message || 'Error en la API de Google');
    }

    // Enviar el audio como base64
    res.json({
      success: true,
      audio: `data:audio/mp3;base64,${data.audioContent}`,
      voiceUsed: voiceCode
    });

  } catch (error) {
    console.error('Error en síntesis:', error);
    res.status(500).json({ 
      error: 'Error al sintetizar el texto',
      details: error.message 
    });
  }
});

// Ruta principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
  console.log(`🎤 Servidor Text-to-Speech ejecutándose en http://localhost:${port}`);
  console.log(`📢 Voces disponibles: ${spanishVoices.length} voces en español`);
  console.log(`🔑 Usando API Key para autenticación`);
});