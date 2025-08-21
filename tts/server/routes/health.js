const express = require('express');
const router = express.Router();
const db = require('../../database/db');

router.get('/', async (req, res) => {
  try {
    await db.raw('SELECT 1');
    
    res.json({
      success: true,
      data: {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development'
      }
    });
  } catch (error) {
    res.status(503).json({
      success: false,
      error: {
        message: 'Service unavailable',
        code: 'HEALTH_CHECK_FAILED'
      }
    });
  }
});

module.exports = router;