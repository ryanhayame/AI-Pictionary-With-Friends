import { useState, useEffect } from "react";
import LobbyPlayers from './LobbyPlayers';
import Confetti from 'react-confetti';

function PostGame(props) { 

    // used to re-render postgame page once
    // solves bug where sometimes LobbyPlayers component does 
    // not re-render even after lobby state changes
    const [firstRender, setFirstRender] = useState(true);

    // used to make confetti dynamic with webpage size
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [windowHeight, setWindowHeight] = useState(window.innerHeight);
    
    useEffect(() => {
        // used to re-render postgame page once
        if (firstRender) {
            setFirstRender(false);
        }
        // resizes confetti to match window size
        function watchSize() {
            setWindowWidth(window.innerWidth)
            setWindowHeight(window.innerHeight)
        }
        window.addEventListener("resize", watchSize)
        // cleanup function
        return function() {
            window.removeEventListener("resize", watchSize)
        }
    }, []);

    // simple way of getting back to lobby
    async function returnToLobby() {
        props.setGamePhase(1);
    }

    // simple way of getting back to main menu
    function refreshPage() {
        window.location.reload();
    }

    return (
        <div>
            <Confetti width={windowWidth} height={windowHeight}/>
            <div className="postgame-header-container">
                <h1>AI Pictionary with Friends!</h1>
                <LobbyPlayers room={props.room}/>
            </div>
            <div className="postgame-btn-container">
                <button className="return-btn" onClick={returnToLobby}>Return to Lobby</button>
                <button className="reset-btn" onClick={refreshPage}>Main Menu</button>
            </div>
        </div>
    )
}

export default PostGame;