import { useState, useEffect } from "react";
import { socket } from "./App";


function LobbyPlayers(props) {

    const [lobby, setLobby] = useState([]);

    // if you are the first one into the pregame menu, find out how big the lobby is
    if (lobby.length === 0) {
        requestLobbyInfo(props.room);
    }

    // requests lobby info from server
    async function requestLobbyInfo(room) {
        socket.emit("request_lobby_info", room);
    }

    // processes emit from server
    // specifically: the request to see who is in lobby when first joining
    useEffect(() => {
        const eventListener1 = (allUsersInLobby) => {
            allUsersInLobby.sort((a, b) => (a.points < b.points) ? 1 : -1);
            setLobby([...allUsersInLobby]);
        };
        socket.on("send_lobby_info", eventListener1);
    
        return () => socket.off("send_lobby_info", eventListener1);
    }, [socket]);

    // listens for updates from people leaving/joining lobby or start game
    useEffect(() => {
        const eventListener2 = (allUsersInLobby) => {
            setLobby(allUsersInLobby.sort((a, b) => (a.points < b.points) ? 1 : -1));
        };
        socket.on("get_lobby_info", eventListener2);
    
        return () => socket.off("get_lobby_info", eventListener2);
    }, [socket]);

    return (
        <div className="lobby">
            <h3>Players</h3>
            <div className="player-list">
                {lobby.map((user) => {
                    return <div className="player" key={user.username}>
                        <h4>{user.username}: {user.points}</h4>
                    </div>
                })}
            </div>
        </div>
    )
}
  
export default LobbyPlayers;