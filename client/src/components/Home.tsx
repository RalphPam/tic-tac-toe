import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Rooms } from '../utils/rooms';

type RoomsType = {
    _id: string,
    roomName: string,
    players: string[]
}[];

const Home: React.FC = () => {

    const [rooms, setRooms] = useState<RoomsType>([]);

    useEffect(() => {
        Rooms.getAllRooms()
            .then(data => {
                if (data) {
                    setRooms(data.rooms);
                }
            })
    }, [])

    return (
        <div className="home">
            <div className="home-menu">
                <input type="text" placeholder="Enter your name here..." />
                <select name="rooms" id="rooms">
                    {rooms.length > 0 && rooms.map((room, index) => 
                        <option key={index} value={room.roomName.toLowerCase()}>
                            {`${room.roomName} - ${room.players.length} / 2`}
                        </option>
                    )}
                </select>
                <Link to='/leaderboards'>LEADERBOARDS</Link>
            </div>
        </div>
    )
}

export default Home;
