const Player = require('../models/Player');
const { check, validationResult } = require('express-validator')

const createPlayer = (

    [check('name', 'Name is required').not().isEmpty()],
    
    async (req, res) => {

        const { name } = req.body;
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

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

module.exports = { createPlayer };