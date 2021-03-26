import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { io } from 'socket.io-client';
import { Players } from '../utils/player';
import { Rooms } from '../utils/rooms';

import Popup from './Popup';

type Player = {
    _id: string,
    isPlaying: Boolean,
    name: string,
    wins: number
};

type Room = {
    _id: string,
    roomName: string,
    players: string[] | Player[]
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

const possibleWinningCombinations: CellNumber[][] = [
    [1, 5, 9],
    [1, 6, 8],
    [2, 4, 9],
    [2, 5, 8],
    [2, 6, 7],
    [3, 4, 8],
    [3, 5, 7],
    [4, 5, 6]
];

const check = (letter: string, cellValues: CellValues) => {
    for (let i = 0; i < possibleWinningCombinations.length; i++) {
        let sum = 0;
        possibleWinningCombinations[i].forEach(cellKey => {
            if (cellValues[cellKey] === letter) {
                sum += cellKey;
            }
        })

        if (sum === 15) return true;
    }
    return false;
} 

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
    const [letter, setLetter] = useState<"X" | "O" | "" >("");
    const [turn, setTurn] = useState<string>("");
    const [result, setResult] = useState("");

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

    const playAgainHandler = () => {
        setResult("");
        setCellValues({
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
        setTurn("X");
        setReady({
            X: false,
            O: false
        })
    }
    
    const generatePlayers = () => {

        const playerElements = [];

        if (players) {
            for (let i = 0; i < 2; i++) {
                playerElements.push(
                    <div key={i}>
                        <p>{`Player ${i + 1} ${ready[i === 0 ? 'X' : 'O'] ? '- READY' : ''}`}</p>
                        <p>{`${i === 0 ? 'X' : 'O'} : ${players[i] ? players[i].name : 'Waiting...'}`}</p>
                    </div>
                );
            }
        }

        return playerElements;
    }

    useEffect(() => {

        if (players) {

            if (check("X", cellValues)) {
                setResult("X WINS");
                letter === "X" && Players.addWinCount(players[0]._id);
            } else if (check("O", cellValues)) {
                setResult("Y WINS");
                letter === "O" && Players.addWinCount(players[1]._id);
            } else if (cellNumbers.every(cellKey => cellValues[cellKey])) {
                setResult("DRAW");
            }

        }
    }, [cellValues, letter, players])

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
            {result !== "" && 
                <Popup 
                    result="YOU WIN" 
                    leaveRoomHandler={leaveRoomHandler}
                    playAgainHandler={playAgainHandler}
                />
            }
            <div className="gameRoom-game">
                <div className="players">
                    {generatePlayers()}         
                </div>
                <div className="box-container">
                {cellNumbers.map((cellNumber, index) =>
                    <button className="box" key={index} onClick={() => moveHandler(cellNumber)}>{cellValues[cellNumber]}</button>
                )}
                </div>
                {(ready["X"] && ready["O"]) && 
                    <h3>{`${letter === turn ? "Your" : "Opponent's"} Turn`}</h3>
                }
                <div className="menu" style={{justifyContent: (ready["X"] && ready["O"]) ? "center" : "space-between"}}>
                    {(!ready["X"] || !ready["O"]) && 
                        <button className="start" onClick={readyHandler}>START</button>
                    }
                    <button className="leave" onClick={leaveRoomHandler}>LEAVE</button>
                </div>
            </div>
        </div>
    )
}

export default GameRoom;
