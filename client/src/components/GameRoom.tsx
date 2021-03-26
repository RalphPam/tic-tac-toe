import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { io } from 'socket.io-client';
import { Rooms } from '../utils/rooms';
import { Players } from '../utils/player';

type Player = {
    _id: string,
    isPlaying: Boolean,
    name: string,
    wins: number
};

type Room = {
    _id: string,
    roomName: string,
    players: string[]
};

type CellNumber = 8 | 1 | 6 | 3 | 5 | 7 | 4 | 9 | 2;

const cellNumbers: CellNumber[] = [ 8, 1, 6, 3, 5, 7, 4, 9, 2 ];

const socket = io();

const getRoomData = (roomId: string | null, setRoom: Function, setPlayers: Function) => {

    Rooms.getRoomById(roomId)
    .then((data: { room: Room }) => {

        const room = data.room;
        setRoom(room);

        // Reset Players
        setPlayers(room.players);

    })

}


const GameRoom = () => {

    const history = useHistory();

    const params = new URLSearchParams(window.location.search);
    const playerId = params.get('playerId');
    const roomId = params.get('roomId');

    const [players, setPlayers] = useState<Player[] | null>(null);
    const [room, setRoom] = useState<Room | null>(null);

    const leaveRoomHandler = () => {

        if (room) {
            Rooms.leaveRoom({playerId, roomName: room.roomName})
            .then(data => {

                socket.emit("enterOrLeaveRoom", room);

                if (data) {
                    history.push('/');
                }
            })
        }

    }
    
    const generatePlayers = () => {

        const playerElements = [];

        if (players) {
            for (let i = 0; i < 2; i++) {
                playerElements.push(<p key={i}>{`Player ${i + 1}: ${players[i] ? players[i].name : 'Waiting...'}`}</p>);
            }
        }

        return playerElements;
    }

    useEffect(() => {
        socket.on('Someone Entered or Leaved', roomEntered => {
            // Get Room Data again if someone has entered the same room
            if (room) {
                if (roomEntered._id === room._id) {
                    getRoomData(room._id, setRoom, setPlayers);
                }
            }
        })  
    }, [room])
    
    useEffect(() => {
        getRoomData(roomId, setRoom, setPlayers);
    }, [roomId])

    return (
        <div className="gameRoom">
            <div className="gameRoom-game">
                <h2>You WIN</h2>
                <div className="players">
                    {generatePlayers()}         
                </div>
                <div className="box-container">
                {cellNumbers.map((cellNumber, index) =>
                    <button className="box" key={index}></button>
                )}
                </div>
                <h3>Your Turn</h3>
                <div className="menu">
                    {room?.players.length === 2 && <button className="start">START - 0/2</button>}
                    <button className="leave" onClick={leaveRoomHandler}>LEAVE ROOM</button>
                </div>
            </div>
        </div>
    )
}

export default GameRoom;
