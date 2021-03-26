const express = require('express');
const http = require('http');
const socketio = require('socket.io')
const connectDB = require('./config/db');
const playerRoutes = require('./routes/player');
const roomRoutes = require('./routes/room');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

connectDB();

//Allows us to access the request data
app.use(express.json({ extended: false }));

app.use('/player', playerRoutes);
app.use('/room', roomRoutes);

const PORT = process.env.PORT || 5000;

io.on("connection", socket => {
    console.log("Socket Connected...");

    socket.on("enterOrLeaveRoom", (room) => {
        socket.broadcast.emit("Someone Entered or Leaved",  room);
    })

})

server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
})