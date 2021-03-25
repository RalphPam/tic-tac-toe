const express = require('express');
const router = express.Router();

const RoomController = require('../controllers/room');

router.post('/enterRoom', RoomController.enterRoom);
router.post('/leaveRoom', RoomController.leaveRoom);
router.get('/getAllRooms', RoomController.getAllRooms);
router.get('/getRoomById/:id', RoomController.getRoomById);

module.exports = router;