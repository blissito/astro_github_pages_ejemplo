const express = require('express');
const router = express.Router();
const ttsController = require('../controllers/ttsController');
const authMiddleware = require('../middleware/auth');

router.post('/synthesize', authMiddleware.optional, ttsController.synthesize);
router.post('/enhance', authMiddleware.optional, ttsController.enhanceText);
router.get('/voices', ttsController.getVoices);
router.get('/history', authMiddleware.required, ttsController.getHistory);
router.delete('/history/:id', authMiddleware.required, ttsController.deleteHistory);

module.exports = router;