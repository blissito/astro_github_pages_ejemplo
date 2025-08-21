const db = require('../../database/db');
const path = require('path');
const fs = require('fs').promises;
const logger = require('../utils/logger');

const streamAudio = async (req, res, next) => {
  try {
    const { id } = req.params;

    const audioFile = await db('audio_files')
      .where('file_id', id)
      .first();

    if (!audioFile) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Audio file not found',
          code: 'NOT_FOUND'
        }
      });
    }

    const filePath = path.join(__dirname, '../../', audioFile.file_path);
    
    try {
      await fs.access(filePath);
    } catch {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Audio file not found on disk',
          code: 'FILE_NOT_FOUND'
        }
      });
    }

    const stat = await fs.stat(filePath);
    const fileSize = stat.size;
    const range = req.headers.range;

    if (range) {
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunksize = (end - start) + 1;
      const file = require('fs').createReadStream(filePath, { start, end });
      const head = {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': `audio/${audioFile.format}`,
      };
      res.writeHead(206, head);
      file.pipe(res);
    } else {
      const head = {
        'Content-Length': fileSize,
        'Content-Type': `audio/${audioFile.format}`,
      };
      res.writeHead(200, head);
      require('fs').createReadStream(filePath).pipe(res);
    }
  } catch (error) {
    logger.error('Stream audio error:', error);
    next(error);
  }
};

const downloadAudio = async (req, res, next) => {
  try {
    const { id } = req.params;

    const audioFile = await db('audio_files')
      .where('file_id', id)
      .first();

    if (!audioFile) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Audio file not found',
          code: 'NOT_FOUND'
        }
      });
    }

    const filePath = path.join(__dirname, '../../', audioFile.file_path);
    
    try {
      await fs.access(filePath);
    } catch {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Audio file not found on disk',
          code: 'FILE_NOT_FOUND'
        }
      });
    }

    res.download(filePath, `tts-audio-${id}.${audioFile.format}`);
  } catch (error) {
    logger.error('Download audio error:', error);
    next(error);
  }
};

const deleteAudio = async (req, res, next) => {
  try {
    const { id } = req.params;

    const audioFile = await db('audio_files')
      .where('file_id', id)
      .first();

    if (!audioFile) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Audio file not found',
          code: 'NOT_FOUND'
        }
      });
    }

    const filePath = path.join(__dirname, '../../', audioFile.file_path);
    
    try {
      await fs.unlink(filePath);
    } catch (error) {
      logger.warn('Could not delete audio file from disk:', error);
    }

    await db('audio_files').where('file_id', id).delete();

    res.json({
      success: true,
      data: { message: 'Audio file deleted' }
    });
  } catch (error) {
    logger.error('Delete audio error:', error);
    next(error);
  }
};

module.exports = {
  streamAudio,
  downloadAudio,
  deleteAudio
};