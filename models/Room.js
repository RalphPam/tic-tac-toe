const mongoose = require('mongoose');
const { Schema } = mongoose;

const RoomSchema = new Schema({
    roomName: {
        type: String
    },
    players: [
        {
            type: Schema.Types.ObjectId,
            ref: 'players'
        }
    ]
})

module.exports = mongoose.model('rooms', RoomSchema);