const mongoose = require('mongoose');
const { Schema } = mongoose;

const PlayerSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    wins: {
        type: Number,
        default: 0
    }
})

module.exports = mongoose.model('players', PlayerSchema);