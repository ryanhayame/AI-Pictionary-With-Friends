import React from "react";
import { socket } from "./App"
import LobbyChat from "./LobbyChat"
import LobbyPlayers from "./LobbyPlayers";


function Lobby(props) {

    // starts game for everyone in room
    function startGame() {
        socket.emit("start_game_request", props.room);
    }

    // simple way of getting back to main menu
    function refreshPage() {
        window.location.reload();
    }

    return (
        <div className="lobby-container">
            <h1>Room {props.room} Lobby</h1>
            <LobbyPlayers room={props.room}/>
            <LobbyChat username={props.username} room={props.room} />
            <div className="postgame-btn-container">
                <button className="return-btn" onClick={refreshPage}>Main Menu</button>
                <button className="start-game-btn" onClick={startGame}>Start Game</button>
            </div>
        </div>
    )
}
  
export default Lobby;