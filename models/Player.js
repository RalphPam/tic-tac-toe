const mongoose = require('mongoose');
const { Schema } = mongoose;

const PlayerSchema = new Schema({
    name: String,
    wins: Number
})

module.exports = PlayerSchema;