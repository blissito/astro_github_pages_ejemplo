const db = require('../../database/db');
const textEnhancer = require('../services/textEnhancer');
const ttsEngine = require('../services/ttsEngine');
const { v4: uuidv4 } = require('uuid');
const logger = require('../utils/logger');

const synthesize = async (req, res, next) => {
  try {
    const { text, voiceId, voice, speed = 1.0, enhance = false, options = {} } = req.body;
    const userId = req.user?.id;

    // Soportar ambos formatos: voiceId directo o voice.voice_id
    const actualVoiceId = voiceId || voice?.voice_id || 'en-US-Neural2-A';
    const actualSpeed = options.speed || speed || 1.0;

    if (!text || !text.trim()) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Text is required',
          code: 'MISSING_TEXT'
        }
      });
    }

    let processedText = text;
    if (enhance) {
      processedText = textEnhancer.enhanceText(text);
    }

    const voiceRecord = await db('voices').where('voice_id', actualVoiceId).first();
    if (!voiceRecord) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Invalid voice ID',
          code: 'INVALID_VOICE'
        }
      });
    }

    const audioFileId = uuidv4();
    const audioData = await ttsEngine.synthesize(processedText, voiceRecord, { speed: actualSpeed });

    const [historyId] = await db('tts_history').insert({
      user_id: userId,
      input_text: text,
      enhanced_text: enhance ? processedText : null,
      voice_id: voiceRecord.id,
      character_count: text.length,
      settings: JSON.stringify({ speed: actualSpeed, enhance }),
      status: 'completed'
    });

    await db('audio_files').insert({
      file_id: audioFileId,
      file_path: audioData.filePath,
      format: audioData.format,
      size_bytes: audioData.size,
      duration_seconds: audioData.duration,
      history_id: historyId
    });

    res.json({
      success: true,
      data: {
        audioId: audioFileId,
        url: `/api/audio/${audioFileId}`,
        duration: audioData.duration,
        enhancedText: enhance ? processedText : undefined
      }
    });
  } catch (error) {
    logger.error('TTS synthesis error:', error);
    next(error);
  }
};

const enhanceText = async (req, res, next) => {
  try {
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Text is required',
          code: 'MISSING_TEXT'
        }
      });
    }

    const enhancedText = textEnhancer.enhanceText(text);

    res.json({
      success: true,
      data: {
        originalText: text,
        enhancedText
      }
    });
  } catch (error) {
    logger.error('Text enhancement error:', error);
    next(error);
  }
};

const getVoices = async (req, res, next) => {
  try {
    const voices = await db('voices')
      .where('is_active', true)
      .select('voice_id', 'name', 'language', 'gender', 'description', 'provider');

    res.json({
      success: true,
      data: voices
    });
  } catch (error) {
    logger.error('Get voices error:', error);
    next(error);
  }
};

const getHistory = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { limit = 50, offset = 0 } = req.query;

    const history = await db('tts_history')
      .where('user_id', userId)
      .join('voices', 'tts_history.voice_id', 'voices.id')
      .leftJoin('audio_files', 'tts_history.id', 'audio_files.history_id')
      .select(
        'tts_history.*',
        'voices.name as voice_name',
        'voices.voice_id',
        'audio_files.file_id as audio_id'
      )
      .orderBy('tts_history.created_at', 'desc')
      .limit(limit)
      .offset(offset);

    res.json({
      success: true,
      data: history
    });
  } catch (error) {
    logger.error('Get history error:', error);
    next(error);
  }
};

const deleteHistory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const history = await db('tts_history')
      .where({ id, user_id: userId })
      .first();

    if (!history) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'History item not found',
          code: 'NOT_FOUND'
        }
      });
    }

    await db('tts_history').where({ id }).delete();

    res.json({
      success: true,
      data: { message: 'History item deleted' }
    });
  } catch (error) {
    logger.error('Delete history error:', error);
    next(error);
  }
};

module.exports = {
  synthesize,
  enhanceText,
  getVoices,
  getHistory,
  deleteHistory
};