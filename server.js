const express = require('express');
const http = require('http');
const connectDB = require('./config/db');

const app = express();
const server = http.createServer(app);

connectDB();

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
})