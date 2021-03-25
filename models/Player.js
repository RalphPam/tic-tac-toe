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
    },
    isPlaying : {
        type: Boolean,
        default: false
    }
})

module.exports = mongoose.model('players', PlayerSchema);