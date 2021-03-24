const express = require('express');
const router = express.Router();

const PlayerController = require('../controllers/player');

router.post('/create', PlayerController.createPlayer);

module.exports = router;