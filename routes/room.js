const express = require('express');
const router = express.Router();

const RoomController = require('../controllers/room');

router.post('/enterRoom', RoomController.enterRoom);
router.post('/leaveRoom', RoomController.leaveRoom);

module.exports = router;