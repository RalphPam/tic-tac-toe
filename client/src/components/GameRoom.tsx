import React from 'react';

type CellNumber = 8 | 1 | 6 | 3 | 5 | 7 | 4 | 9 | 2;
const cellNumbers: CellNumber[] = [ 8, 1, 6, 3, 5, 7, 4, 9, 2 ];

const GameRoom = () => {
    return (
        <div className="gameRoom">
            <div className="gameRoom-game">
                <h2>You WIN</h2>
                <div className="players">
                    <p>Player 1: Name</p>
                    <p>Player 2: Name</p>
                </div>
                <div className="box-container">
                {cellNumbers.map((cellNumber, index) =>
                    <button className="box" key={index}></button>
                )}
                </div>
                <h3>Your Turn</h3>
                <button className="start">START - 0/2</button>
            </div>
        </div>
    )
}

export default GameRoom;
