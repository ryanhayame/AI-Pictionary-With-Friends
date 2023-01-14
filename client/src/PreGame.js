import { useState, useEffect } from "react";
import { socket } from './App';
import Animation from './Animation';
import Animation2 from "./Animation2";

function PreGame(props) { 

    const [playerCount, setPlayerCount] = useState(0);

    const [joke, setJoke] = useState(fetchJoke);

    function fetchJoke() {
            fetch("https://v2.jokeapi.dev/joke/Any")
            .then(res => res.json())
            .then(data => setJoke(data))
        }
      
    useEffect(() => {
        const interval = setInterval(fetchJoke, 10000);
        return () => clearInterval(interval);
    }, []);

    function formatJoke(data) {
        if (data.type === "twopart") {
            return (
                <div className="twopart-joke">
                    <h2>While you wait for others, heres a <span className="joke-category">{data.category}</span> joke:</h2>
                    <h3 className="joke-setup">{data.setup}</h3>
                    <h3 className="main-joke">{data.delivery}</h3>
                </div>
            )
        } else {
            return (
                <div className="single-joke">
                    <h2>While you wait for others, heres a <span className="joke-category">{data.category}</span> joke:</h2>
                    <h3 className="main-joke">{data.joke}</h3>
                </div>
            )
        }
    } 

    // if you are the first one into the pregame menu, find out how big the lobby is
    if (playerCount === 0) {
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
            setPlayerCount(allUsersInLobby.length)
        };
        socket.on("send_lobby_info", eventListener1);
    
        return () => socket.off("send_lobby_info", eventListener1);
    }, [socket]);

    // listens for updates from people leaving/joining lobby or start game
    useEffect(() => {
        const eventListener2 = (allUsersInLobby) => {
            setPlayerCount(allUsersInLobby.length);
        };
        socket.on("get_lobby_info", eventListener2);
    
        return () => socket.off("get_lobby_info", eventListener2);
    }, [socket]);

    // starts game when everyone in lobby has submitted prompt + image
    useEffect(() => {
        if (playerCount > 0 && props.gameImages.length === playerCount) {
            props.changePhase();
        }
    }, [props.gameImages.length, playerCount]);

    return (
        <div className="pregame-container">
            <h1>PREGAME</h1>
            <h2>
                <span className="span1">{props.gameImages.length}</span> out of <span className="span2">{playerCount}</span> players ready
            </h2>
            <div className="animation-container">
                <Animation2 />
                <Animation />
            </div>
            <div className="joke-container">
                {joke && formatJoke(joke)}
            </div>
        </div>
    )
}

export default PreGame;