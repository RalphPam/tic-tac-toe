const mongoose = require('mongoose');
const { Schema } = mongoose;

const RoomSchema = new Schema({
    roomName: String,
    players: Array
})

module.exports = RoomSchema;