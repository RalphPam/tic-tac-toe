import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { io } from 'socket.io-client';
import { Rooms } from '../utils/rooms';
import { Players } from '../utils/player';

const socket = io();

type Room = {
    _id: string,
    roomName: string,
    players: string[]
};

type RoomsType = Room[];

const Home: React.FC = () => {

    const history = useHistory();

    const [rooms, setRooms] = useState<RoomsType>([]);
    const [name, setName] = useState<string>('');
    const [room, setRoom] = useState<string>('');

    const enterHandler = () => {
        Players.createPlayer({ name })
        .then(playerData => {

            if (playerData) {
                Rooms.enterRoom({ playerId: playerData.player._id, roomName: room})
                .then(roomData => {
                    if (roomData) {
                        socket.emit('enterOrLeaveRoom', roomData.room);
                        history.push(`/gameRoom?playerId=${playerData.player._id}&roomId=${roomData.room._id}`)
                    }
                })
            }

        })
    }

    useEffect(() => {
        Rooms.getAllRooms()
        .then(data => {
            if (data) {
                setRooms(data.rooms);
            }
        })
    }, [])

    useEffect(() => {
        socket.on('Someone Entered or Leaved', roomEntered => {
            // Get Room Data again if someone has entered the same room
            Rooms.getAllRooms()
            .then(data => {
                if (data) {
                    setRooms(data.rooms);
                }
            })
        })  
    }, [])

    return (
        <div className="home">
            <div className="home-menu">
                <h2>TIC TAC TOE</h2>
                <input value={name} type="text" placeholder="Enter your name here..." onChange={e => setName(e.target.value)} />
                <select name="rooms" id="rooms" value={room} onChange={e => setRoom(e.target.value)} >
                    <option value="">Select Room</option>
                    {rooms.length > 0 && rooms.map((room, index) => 
                        <option key={index} value={room.roomName}>
                            {`${room.roomName} - ${room.players.length} / 2`}
                        </option>
                    )}
                </select>
                <button onClick={enterHandler}>Enter</button>
                <Link to='/leaderboard'>LEADERBOARD</Link>
            </div>
        </div>
    )
}

export default Home;
