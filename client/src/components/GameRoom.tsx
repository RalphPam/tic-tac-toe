import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
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

const GameRoom = () => {

    const history = useHistory();

    const params = new URLSearchParams(window.location.search);
    const playerId = params.get('playerId');
    const roomId = params.get('roomId');

    const [players, setPlayers] = useState<Player[] | null>(null);
    const [room, setRoom] = useState<Room | null>(null);

    const leaveRoomHandler = () => {
        Rooms.leaveRoom({playerId, roomName: room && room.roomName})
            .then(data => {
                if (data) {
                    history.push('/');
                }
            })
    }

    const generatePlayers = () => {
        if (players) {
            let playerElements = [];
            for (let i = 0; i < 2; i++) {
                playerElements.push(<p>{`Player ${i + 1}: ${players[i] ? players[i].name : 'Waiting...'}`}</p>);
            }
            return playerElements;
        }
    }
    
    useEffect(() => {
        let room: Room | undefined;
        Rooms.getRoomById(roomId)
            .then(data => {
                if (data) {
                    room = data.room;
                    setRoom(data.room);
                }

                // Get Players
                for (let i = 0; i < (room ? room.players.length : 0); i++) {
                    Players.getPlayerById(room?.players[i])
                    .then(data => {
                        if (data) {
                            setPlayers(prev => prev ? [...prev, data.player] : [data.player]);
                        }
                    })
                }
            })
    }, [playerId, roomId])

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
                    <button className="start">START - 0/2</button>
                    <button className="leave" onClick={leaveRoomHandler}>LEAVE ROOM</button>
                </div>
            </div>
        </div>
    )
}

export default GameRoom;
