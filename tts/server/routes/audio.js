const express = require('express');
const router = express.Router();
const audioController = require('../controllers/audioController');

router.get('/:id', audioController.streamAudio);
router.get('/:id/download', audioController.downloadAudio);
router.delete('/:id', audioController.deleteAudio);

module.exports = router;