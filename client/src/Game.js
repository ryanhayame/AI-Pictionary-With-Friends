import Image from "./Image";
import GameChat from "./GameChat";
import Prompt from "./Prompt";
import LobbyPlayers from "./LobbyPlayers";
import PointsChange from "./PointsChange";

import { useState, useEffect } from "react";
import { socket } from "./App";

function Game(props) { 

    const STARTTIME = 5;
    const GAPTIME = 5;
    const GUESSTIME = 50;

    // phaseObj = "GAP" or "GUESS"
    const [phaseObj, setPhaseObj] = useState({
        phase: "START",
        index: 0
    });

    const [images, setImages] = useState(props.gameImages.map(conversion));

    // converts image from image object to blob
    function conversion(imageObj) {
        const blob = new Blob([imageObj.body], { type: imageObj.type});
        return <Image fileName={imageObj.fileName} blob={blob} />
    }

    // create timer component in here because you want timer state to reset if game.js is re-rendered
    function Timer(props) { 

        const [timer, setTimer] = useState(props.phaseObj.phase);
    
        // manages timer countdown and phase changes
        useEffect(() => {
            // if phase was just changed to one of these
            if (timer === "GAP" || timer === "GUESS" || timer === "START") {
                if (props.phaseObj.phase === "GAP") {
                    setTimer(GAPTIME);
                } else if (props.phaseObj.phase === "GUESS") {
                    setTimer(GUESSTIME);
                } else {
                    setTimer(STARTTIME);
                }
            } else if (timer >= 0) {
                setTimeout(() => setTimer((prevTimer) => {
                    return prevTimer - 1;
                }), 1000)
            } else {
                // when timer runs out, switch phases
                if (props.phaseObj.phase === "GAP") {
                    props.setPhaseObj((prevPhaseObj) => {
                        return {
                            phase: "GUESS",
                            index: prevPhaseObj.index + 1
                        }
                    })
                } else if (props.phaseObj.phase === "GUESS") {
                    props.setPhaseObj((prevPhaseObj) => {
                        return {
                            phase: "GAP",
                            index: prevPhaseObj.index
                        }
                    })
                } else {
                    props.setPhaseObj({phase: "GUESS", index: 0});
                }
            };
        }, [timer]);
    
        return (
            <div className="timer-container">
                <h4>Time</h4>
                <h2>{timer}</h2>
            </div>
        )
    }

    // converts prompt to array that matches format of displayed prompt
    // must match format of displayed prompt so indices match
    function getKeyArray(prompt) {
        let temp = prompt.replace(/ /g, "   ");
        let temp2 = temp.replace(/[a-z]/gi, match => {
            return match + ' ';
        });
        return [...temp2];
    }

    // used to disable chat box if it is your own picture
    function isMyImageDisplayed () {
        if (props.gameImages[phaseObj.index].id === socket.id && phaseObj.phase !== "START") {
            return true;
        }
        return false;
    }

    // if statement needed to prevent crash
    // no point in putting these in useEffect because they both need
    // to re-render everytime phaseObj state changes anyways
    let keyArray;
    let myImage;
    if (phaseObj.index < props.gameImages.length) {
        myImage = isMyImageDisplayed();
        keyArray = getKeyArray(props.gameImages[phaseObj.index].prompt);
    }

    // checks when game finished
    useEffect(() => {
        if (phaseObj.index === images.length) {
            props.changePhase();
        }
    }, [phaseObj]);

    return (
        <div className="game-container">
            <div className="game-header-container">
                <h1>AI Pictionary with Friends!</h1>
                <div className="game-info">
                    <Timer phaseObj={phaseObj} setPhaseObj={setPhaseObj} />
                    <LobbyPlayers room={props.room}/>
                </div>
                {phaseObj.index < props.gameImages.length && <Prompt promptString={props.gameImages[phaseObj.index].prompt} phaseObj={phaseObj} keyArray={keyArray} room={props.room}/>}
            </div>
            <div className="image-chat-container">
                <div className="game-image">
                    <h4>Image {phaseObj.index + 1} out of {props.gameImages.length}</h4>
                    {phaseObj.phase === "GUESS" && images[phaseObj.index]}
                    {phaseObj.phase === "GAP" && <hr name="IMAGE PLACEHOLDER" style={{ width: 550, opacity: 0 }}></hr>}
                    <section style={{display: phaseObj.phase === "GAP" ? 'block' :'none'}}>
                        {phaseObj.index < props.gameImages.length && <PointsChange key={phaseObj.index} index={phaseObj.index}/>}
                    </section>
                </div>
                <div className="game-chat">
                    {phaseObj.index < props.gameImages.length && <GameChat guesstime={GUESSTIME} phase={phaseObj.phase} index={phaseObj.index} setPhaseObj={setPhaseObj} answer={props.gameImages[phaseObj.index].prompt.toLowerCase()} username={props.username} room={props.room} myImage={myImage}/>}
                </div>
            </div>
        </div>
    )
}

export default Game;