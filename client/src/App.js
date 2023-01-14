import './App.css';
import React from 'react';
import { useState, useEffect } from "react";

// components
import MainMenu from './MainMenu';
import Lobby from './Lobby';
import StableDiffDemo from './StableDiffDemo';
import PreGame from './PreGame'
import Game from './Game';
import PostGame from './PostGame';

// socket stuff
import io from "socket.io-client";
// replace "https://localhost3001/" with own server domain if running online
export const socket = io("https://localhost3001/", {
  extraHeaders: {
    'Access-Control-Allow-Origin': '*'
  }
});


function App() {

  const [gamePhase, setGamePhase] = useState(0);

  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");

  const [gameImages, setGameImages] = useState([]);

  const [reset, setReset] = useState(0);

  function changePhase() {
    setGamePhase((prevGamePhase) => prevGamePhase + 1);
  }

  // downloads image file from server to client after someone in lobby submits to server
  useEffect(() => {
    socket.on("download", (imageObj) => {
      setGameImages((prevGameImages) => [...prevGameImages, imageObj]);
    });
  }, [socket]);

  // starts game whether you are in lobby or at postgame
  useEffect(() => {
    const eventListener = () => {
      setGameImages([]);
      setReset((prevReset) => prevReset + 1);
      setGamePhase(2);
    };
    socket.on("start_game", eventListener);
    return () => socket.off("start_game", eventListener);
  }, [socket]);

  return (
    <div>
      { gamePhase === 0 && <MainMenu changePhase={changePhase} setUsername={setUsername} setRoom={setRoom} username={username} room={room}/> }
      {/* key is necessary so that all components are rendered without previous states */}
      <div key={reset}>
        { gamePhase === 1 && <Lobby changePhase={changePhase} username={username} room={room}/> }
        { gamePhase === 2 && <StableDiffDemo changePhase={changePhase} setGameImages={setGameImages} room={room}/> }
        { gamePhase === 3 && <PreGame changePhase={changePhase} gameImages={gameImages} room={room}/> }
        { gamePhase === 4 && <Game changePhase={changePhase} room={room} username={username} gameImages={gameImages} /> }
        { gamePhase === 5 && <PostGame setGamePhase={setGamePhase} room={room} /> }
      </div>
    </div>
  );
}

export default App;
