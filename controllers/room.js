const Room = require('../models/Room');
const { check, validationResult } = require('express-validator')

const enterRoom = (

    [
        check('playerId', 'Player ID is required').not().isEmpty(),
        check('roomName', 'Room Name is requred').not().isEmpty()
    ],

    async (req, res) => {

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { playerId, roomName } = req.body;

        try {
            let room = await Room.findOne({ roomName });

            if (!room) {
                return res.status(400).json({ error: ["Room doesn't exists"]});
            }

            if (room.players.includes(playerId)) {
                return res.status(400).json({ error: ["Player already in room"]});
            }

            if (room.players.length === 2) {
                return res.status(400).json({ error: ["Room already full"]});
            }

            room.players.push(playerId);

            await room.save();

            res.json({ room });
            
        } catch (err) {
            console.error(err);
            res.status(500).send('Server Error');
        }
    }

);

const leaveRoom = (

    [
        check('playerId', 'Player ID is required').not().isEmpty(),
        check('roomName', 'Room Name is requred').not().isEmpty()
    ],

    async (req, res) => {

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { playerId, roomName } = req.body;

        try {
            let room = await Room.findOne({ roomName });

            if (!room) {
                return res.status(400).json({ error: ["Room doesn't exists"]});
            }

            if (!room.players.includes(playerId)) {
                return res.status(400).json({ error: ["Player is not in room"]});
            }

            if (room.players.length === 0) {
                return res.status(400).json({ error: ["Room already empty"]});
            }

            const indexOfPlayer = room.players.indexOf(playerId);
            // Remove player in the room
            room.players.splice(indexOfPlayer, 1);

            await room.save();

            res.json({ room });
            
        } catch (err) {
            console.error(err);
            res.status(500).send('Server Error');
        }
    }

);

const getAllRooms = (
    async (req, res) => {
        try {
            let rooms = await Room.find();
            res.json({ rooms });
        } catch (err) {
            console.error(err);
            res.status(500).send('Server Error')
        }
    }
);

module.exports = { enterRoom, leaveRoom, getAllRooms };