const Room = require('../models/Room');
const Player = require('../models/Player');
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
            let player = await Player.findById( playerId );

            if (!player) {
                return res.status(400).json({ error: ["Player doesn't exists"]});
            }

            if (player.isPlaying) {
                return res.status(400).json({ error: ["Player is already in a room/playing"]});
            }

            if (!room) {
                return res.status(400).json({ error: ["Room doesn't exists"]});
            }

            if (room.players.includes(playerId)) {
                return res.status(400).json({ error: ["Player already in room"]});
            }

            if (room.players.length === 2) {
                return res.status(400).json({ error: ["Room already full"]});
            }

            player.isPlaying = true;
            room.players.push(playerId);

            await player.save();
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
            let player = await Player.findById( playerId );

            if (!player) {
                return res.status(400).json({ error: ["Player doesn't exists"]});
            }

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
            player.isPlaying = false;

            await player.save();
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

const getRoomById = (

    [check('id', 'Id is required').not().isEmpty()],

    async (req, res) => {

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { id } = req.params;

        try {
            let room = await Room.findById(id);

            // If player does not exists
            if (!room) {
                return res.status(400).json({ errors: ["Room doesn't exists"] });
            }

            return res.json({ room });

        } catch(err) {
            console.error(err);
            res.status(500).send('Server Error');
        }

    }
);

module.exports = { enterRoom, leaveRoom, getAllRooms, getRoomById };