const mongoose = require('mongoose');
const { Schema } = mongoose;

const RoomSchema = new Schema({
    roomName: {
        type: String
    },
    players: {
        type: Array
    }
})

module.exports = mongoose.model('rooms', RoomSchema);