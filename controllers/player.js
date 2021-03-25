const Player = require('../models/Player');
const { check, validationResult } = require('express-validator')

const createPlayer = (

    [check('name', 'Name is required').not().isEmpty()],

    async (req, res) => {

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name } = req.body;

        try {
            let player = await Player.findOne({ name });

            // If player does not exists
            if (!player) {
                player = new Player({
                    name
                });
                await player.save();
            }

            return res.json({ player });

        } catch(err) {
            console.error(err);
            res.status(500).send('Server Error');
        }

    }
);

const getAllPlayers = (
    async (req, res) => {
        try {
            let players = await Player.find();
            res.json({ players });
        } catch (err) {
            console.error(err);
            res.status(500).send('Server Error');
        }
    }
);

const addWinCount = (
    
    [check('playerId', 'PlayerId is required').not().isEmpty()],

    async (req, res) => {
       const errors = validationResult(req);
       
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { playerId } = req.body;

        try {

            let player = await Player.findById(playerId);

            if (!player) {
                return res.status(400).json({ errors: ['Player does not exist'] });
            }

            player.wins = player.wins + 1;

            await player.save();

            return res.json({ player });
            
        } catch (err) {
            console.error(err);
            res.status(500).send('Server Error');
        }
    }

);

const getPlayerById = (

    [check('id', 'Id is required').not().isEmpty()],

    async (req, res) => {

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { id } = req.params;

        try {
            let player = await Player.findById(id);

            // If player does not exists
            if (!player) {
                return res.status(400).json({ errors: ["Player doesn't exists"] });
            }

            return res.json({ player });

        } catch(err) {
            console.error(err);
            res.status(500).send('Server Error');
        }

    }
);

module.exports = { createPlayer, getAllPlayers, addWinCount, getPlayerById };