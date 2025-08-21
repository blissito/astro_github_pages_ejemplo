const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { TextToSpeechClient } = require('@google-cloud/text-to-speech');
const logger = require('../utils/logger');

class TTSEngine {
  constructor() {
    this.outputDir = path.join(__dirname, '../../uploads/audio');
    // Configurar cliente de Google TTS con API Key si está disponible
    const clientOptions = {};
    if (process.env.GOOGLE_API_KEY) {
      clientOptions.apiKey = process.env.GOOGLE_API_KEY;
    }
    this.googleTtsClient = new TextToSpeechClient(clientOptions);
    this.ensureOutputDir();
  }

  async ensureOutputDir() {
    try {
      await fs.mkdir(this.outputDir, { recursive: true });
    } catch (error) {
      logger.error('Failed to create output directory:', error);
    }
  }

  async synthesize(text, voice, options = {}) {
    try {
      const { speed = 1.0, format = 'mp3' } = options;

      // Usar Google TTS como proveedor principal
      if (voice.provider === 'google' || !voice.provider) {
        return await this.synthesizeWithGoogle(text, voice, options);
      } else {
        // Fallback para demostración
        return await this.synthesizeWithFallback(text, voice, options);
      }
    } catch (error) {
      logger.error('TTS synthesis error:', error);
      // Si falla, intentar con fallback
      return await this.synthesizeWithFallback(text, voice, options);
    }
  }

  async synthesizeWithGoogle(text, voiceRecord, options = {}) {
    try {
      const { speed = 1.0, format = 'mp3' } = options;
      
      // Usar la información de la base de datos para la voz
      const voiceName = voiceRecord.voice_id || voiceRecord.name;
      const languageCode = voiceRecord.language || 'es-ES';
      const ssmlGender = voiceRecord.gender?.toUpperCase() || 'FEMALE';
      
      // Configurar la solicitud para Google TTS
      const request = {
        input: { text: text },
        voice: {
          languageCode: languageCode,
          name: voiceName,
          ssmlGender: ssmlGender
        },
        audioConfig: {
          audioEncoding: format === 'wav' ? 'LINEAR16' : 'MP3',
          speakingRate: speed,
          pitch: 0.0,
          volumeGainDb: 0.0
        }
      };

      // Llamar a la API de Google TTS
      const [response] = await this.googleTtsClient.synthesizeSpeech(request);

      const fileName = `${uuidv4()}.${format}`;
      const filePath = path.join(this.outputDir, fileName);
      
      // Escribir el audio al archivo
      await fs.writeFile(filePath, response.audioContent, 'binary');

      const stats = await fs.stat(filePath);

      return {
        filePath: `uploads/audio/${fileName}`,
        format: format,
        size: stats.size,
        duration: this.estimateDuration(text, speed)
      };
    } catch (error) {
      logger.error('Google TTS error:', error.message);
      throw error;
    }
  }

  getLanguageFromVoice(voiceName) {
    // Extraer el código de idioma del nombre de voz
    // Por ejemplo: "es-ES-Wavenet-A" -> "es-ES"
    if (voiceName.includes('es-')) return 'es-ES';
    if (voiceName.includes('en-')) return 'en-US';
    if (voiceName.includes('fr-')) return 'fr-FR';
    if (voiceName.includes('de-')) return 'de-DE';
    if (voiceName.includes('it-')) return 'it-IT';
    if (voiceName.includes('pt-')) return 'pt-BR';
    
    // Fallback por defecto
    return 'en-US';
  }

  getGenderFromVoice(voiceName) {
    // Intentar determinar el género basado en el nombre
    if (voiceName.toLowerCase().includes('female') || voiceName.includes('-A') || voiceName.includes('-C')) {
      return 'FEMALE';
    }
    if (voiceName.toLowerCase().includes('male') || voiceName.includes('-B') || voiceName.includes('-D')) {
      return 'MALE';
    }
    
    // Fallback neutral
    return 'NEUTRAL';
  }

  async synthesizeWithFallback(text, voice, options) {
    const fileName = `${uuidv4()}.mp3`;
    const filePath = path.join(this.outputDir, fileName);
    
    const dummyAudioData = Buffer.from([
      0x49, 0x44, 0x33, 0x03, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00
    ]);
    
    await fs.writeFile(filePath, dummyAudioData);

    return {
      filePath: `uploads/audio/${fileName}`,
      format: 'mp3',
      size: dummyAudioData.length,
      duration: this.estimateDuration(text, options.speed || 1.0)
    };
  }

  estimateDuration(text, speed = 1.0) {
    const wordsPerMinute = 150;
    const words = text.split(/\s+/).length;
    const baseSeconds = (words / wordsPerMinute) * 60;
    return Math.round(baseSeconds / speed);
  }

  async convertFormat(inputPath, outputFormat) {
    try {
      const outputPath = inputPath.replace(/\.[^/.]+$/, `.${outputFormat}`);
      
      return outputPath;
    } catch (error) {
      logger.error('Format conversion error:', error);
      throw new Error('Failed to convert audio format');
    }
  }

  async getCachedAudio(textHash, voiceId) {
    try {
      const cachePath = path.join(this.outputDir, 'cache', `${textHash}_${voiceId}.mp3`);
      await fs.access(cachePath);
      return cachePath;
    } catch {
      return null;
    }
  }

  async cacheAudio(textHash, voiceId, audioPath) {
    try {
      const cacheDir = path.join(this.outputDir, 'cache');
      await fs.mkdir(cacheDir, { recursive: true });
      
      const cachePath = path.join(cacheDir, `${textHash}_${voiceId}.mp3`);
      await fs.copyFile(audioPath, cachePath);
    } catch (error) {
      logger.warn('Failed to cache audio:', error);
    }
  }
}

module.exports = new TTSEngine();