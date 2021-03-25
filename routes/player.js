const express = require('express');
const router = express.Router();

const PlayerController = require('../controllers/player');

router.post('/addWinCount', PlayerController.addWinCount);
router.post('/create', PlayerController.createPlayer);
router.get('/getAllPlayers', PlayerController.getAllPlayers);
router.get('/getPlayerById/:id', PlayerController.getPlayerById);

module.exports = router;