import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Players } from '../utils/player';


type Player = {
    _id: string,
    isPlaying: Boolean,
    name: string,
    wins: number
}

type PlayersType = Player[];

const LeaderBoard = () => {

    const [players, setPlayers] = useState<PlayersType>([]);

    useEffect(() => {
        Players.getAllPlayers()
        .then(data => {
            if (data) {
                setPlayers(data.players.sort((a: Player, b: Player) => b.wins - a.wins));
            }
        })
    }, [])

    return (
        <div className="leaderboard">
            <div className="leaderboard-box">
                <Link to="/">&lt; &lt; HOME</Link>
                <h3>LEADERBOARD</h3>
                <ul>
                    {players.length > 0 && players.map((player, index) =>
                        <li>
                            <span>{index + ". " + player.name}</span>
                            <span>{"WINS: " + player.wins}</span>
                        </li>
                    )}
                </ul>
            </div>
        </div>
    )
}

export default LeaderBoard;
