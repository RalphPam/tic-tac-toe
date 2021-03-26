import React from 'react'

interface Props {
    result: string,
    leaveRoomHandler: any,
    playAgainHandler: any
}

const Popup = (props: Props) => {

    const { result, leaveRoomHandler, playAgainHandler } = props;

    return (
        <div className="popup">
            <div className="popup-menu">
                <p>{result}</p>
                <div>
                    <button onClick={leaveRoomHandler}>LEAVE</button>
                    <button onClick={playAgainHandler}>PLAY AGAIN</button>
                </div>
            </div>
        </div>
    )
}

export default Popup
