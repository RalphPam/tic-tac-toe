import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { io } from 'socket.io-client';
import { Rooms } from '../utils/rooms';

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

type Ready = {
    X: boolean,
    O: boolean
}

type CellValues = {
    8: 'X' | 'O' | '',
    1: 'X' | 'O' | '',
    6: 'X' | 'O' | '',
    3: 'X' | 'O' | '',
    5: 'X' | 'O' | '',
    7: 'X' | 'O' | '',
    4: 'X' | 'O' | '',
    9: 'X' | 'O' | '',
    2: 'X' | 'O' | ''
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
    const [ready, setReady] = useState<Ready>({
        X: false,
        O: false
    });
    const [letter, setLetter] = useState<string>("");
    const [turn, setTurn] = useState<string>("");

    const [cellValues, setCellValues] = useState<CellValues>({
        8: '',
        1: '',
        6: '',
        3: '',
        5: '',
        7: '',
        4: '',
        9: '',
        2: ''
    });

    const moveHandler = (cellValue: CellNumber) => {
        if (letter === turn) {
            setCellValues(prev => ({ ...prev, [cellValue] : letter }));
            setTurn(letter === "X" ? "O" : "X");
            socket.emit("playerMove", {cellValue, letter});
        }
    }

    const readyHandler = () => {
        socket.emit("ready", { letter, roomId });
        setReady(prev => ({ ...prev, [letter]: true }));
    }

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
                playerElements.push(
                    <div key={i}>
                        <p>{`Player ${i + 1} ${ready[i === 0 ? 'X' : 'O'] ? '- READY' : ''}`}</p>
                        <p>{`${i === 0 ? 'X' : 'O'}: ${players[i] ? players[i].name : 'Waiting...'}`}</p>
                    </div>
                );
            }
        }

        return playerElements;
    }

    useEffect(() => {
        socket.on("playerMove", moveData => {
            if (moveData.letter !== letter) {
                setTurn(letter);
                setCellValues(prev => ({ ...prev, [moveData.cellValue] : moveData.letter }));
            }
        })
    }, [letter])

    useEffect(() => {
        // If both players are ready. First turn will be X
        if (ready["X"] && ready["O"]) {
            setTurn("X");
        }

    }, [ready])

    useEffect(() => {
        // "X" for player 1, "O" for player 2
        if (players) {
            if (players.findIndex(player => player._id === playerId) === 0) {
                setLetter("X");
            } else if (players.findIndex(player => player._id === playerId) === 1) {
                setLetter("O");
            }
        }
    }, [players, playerId])

    useEffect(() => {
        socket.on('ready', playerReady => {
            if (playerReady.roomId === roomId) {
                if (playerReady.letter !== letter) {
                    setReady(prev => ({ ...prev, [playerReady.letter] : true }));
                }
            }
        })
    }, [letter, roomId])

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
                    <button className="box" key={index} onClick={() => moveHandler(cellNumber)}>{cellValues[cellNumber]}</button>
                )}
                </div>
                <h3>Your Turn</h3>
                <div className="menu">
                    {room?.players.length === 2 && 
                        <button className="start" onClick={readyHandler}>START</button>
                    }
                    <button className="leave" onClick={leaveRoomHandler}>LEAVE ROOM</button>
                </div>
            </div>
        </div>
    )
}

export default GameRoom;
