const express = require('express');
const router = express.Router();

const PlayerController = require('../controllers/player');

router.post('/create', PlayerController.createPlayer);
router.get('/getAllPlayers', PlayerController.getAllPlayers);

module.exports = router;