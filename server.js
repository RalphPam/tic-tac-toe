const express = require('express');
const http = require('http');
const connectDB = require('./config/db');
const playerRoutes = require('./routes/player');

const app = express();
const server = http.createServer(app);

connectDB();

//Allows us to access the request data
app.use(express.json({ extended: false }));

app.use('/player', playerRoutes);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
})