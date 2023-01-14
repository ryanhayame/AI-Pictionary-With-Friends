import React, { useEffect, useRef, useState } from "react";
import ScrollToBottom from "react-scroll-to-bottom";
import { socket } from "./App"

function GameChat(props) {

    const [currentMessage, setCurrentMessage] = useState("");
    const [messageList, setMessageList] = useState([]);

    // used for making sure i cant answer more than once
    const [alreadyAnswered, setAlreadyAnswered] = useState(false);

    // used for skipping rest of time when everyone in lobby guesses correctly
    const [correctAnswers, setCorrectAnswers] = useState(0);

    // used for bugs ex. if someone disconnects during game
    const [artistPresent, setArtistPresent] = useState(false);
    
    // used to give artist points based on how many others guess correctly
    const [artistInfo, setArtistInfo] = useState(null);

    // needed otherwise wrong states would be used in useEffect checks
    const artistRef = useRef(null);
    artistRef.current = artistPresent;
    const correctAnswersRef = useRef(null);
    correctAnswersRef.current = correctAnswers;
    const artistInfoRef = useRef(null);
    artistInfoRef.current = artistInfo;

    // used for keeping focus
    const textBoxRef = useRef(null);

    // calculates points gained based off time and order of answering
    function calculatePointGain() {
        return Math.round((75 / (correctAnswers + 1)) + props.guesstime);
    }

    // sends message and points to server to be sent to other users
    const sendMessage = async () => {
        if (currentMessage !== "") {
            const messageData = {
                room: props.room,
                author: props.username,
                authorId: socket.id,
                message: ((currentMessage.toLowerCase() === props.answer && !alreadyAnswered && props.phase === "GUESS") ? `${props.username} guessed the word correctly!` : currentMessage),
                pointsGain: ((currentMessage.toLowerCase() === props.answer && !alreadyAnswered && props.phase === "GUESS") ? calculatePointGain() : 0),
                // artist gets 25 points everytime someone in lobby is able to guess their prompt/picture
                artistPoints: ((currentMessage.toLowerCase() === props.answer && !alreadyAnswered && props.phase === "GUESS") ? 25 : 0),
                artistNickname: (artistInfoRef.current ? artistInfoRef.current.artistNickname : null),
                artistId: (artistInfoRef.current ? artistInfoRef.current.artistId : null),
                // if your guess is right, tells server if you are 1st person to guess corrrectly, or 2nd person, or 3rd person, etc
                // if your guess is wrong, tells server how many correct guesses have been submitted before you
                guessOrder: ((currentMessage.toLowerCase() === props.answer && !alreadyAnswered && props.phase === "GUESS") ? correctAnswersRef.current + 1 : correctAnswersRef.current)
            };
            await socket.emit("send_message_game", messageData);
            if (messageData.pointsGain !== 0) {
                setAlreadyAnswered(true);
            }
            setMessageList((list) => [...list, messageData]);
            setCurrentMessage("");
            textBoxRef.current.focus();
        }
    };

    // need to let everyone know artist is in room
    useEffect(() => {
        if (props.myImage && artistRef.current !== true && props.phase !== "GAP") {
            socket.emit("artist_in_room", props.room);
        }
    }, [props.myImage]);

    // resets states after each round
    useEffect(() => {
        if (props.phase === "GAP") {
            setAlreadyAnswered(false);
            setCorrectAnswers(0);
            setArtistPresent(false);
            setArtistInfo(null);
        }
    }, [props.phase]);

    useEffect(() => {
        // server emits this to lobby when artist is in lobby
        socket.on("tell_others_im_here", (artist) => {
            setArtistPresent(true);
            setArtistInfo(artist);
        });
        // server emits this to lobby when someone sends a message
        socket.on("receive_message_game", (data) => {
            setMessageList((list) => [...list, data]);
        });
        // server emits this to lobby when someone guesses correctly
        socket.on("tell_others_im_smart", (playercount) => {
            console.log(`someone guessed correctly out of ${playercount} players`)
            // if artist is in the lobby, check if everyone except artist guessed
            if (artistRef.current && (correctAnswersRef.current + 1 >= playercount - 1)) {
                console.log(`skipping with artist`)
                props.setPhaseObj((prevPhaseObj) => {
                    return {
                        phase: "GAP",
                        index: prevPhaseObj.index
                    }
                });
            }
            // if artist is not in lobby, check if everyone in lobby guessed
            else if (!artistRef.current && correctAnswersRef.current + 1 >= playercount) {
                console.log(`skipping without artist`)
                props.setPhaseObj((prevPhaseObj) => {
                    return {
                        phase: "GAP",
                        index: prevPhaseObj.index
                    }
                });
            }
            // if not everyone has guessed correctly yet, updates number of correct answers
            else {
                console.log(`updating correct answers from ${correctAnswers} to ${correctAnswers + 1}`)
                setCorrectAnswers(prevCorrectAnswers => prevCorrectAnswers + 1);
            }
        })
    }, [socket]);

    return (
        <div className="chat-window">
            <div className="chat-header">
                <p>Live Chat</p>
            </div>
            <div className="chat-body">
                <ScrollToBottom className="message-container">
                {messageList.map((messageContent) => {
                    return (
                        <div
                            className="message"
                            id={socket.id === messageContent.authorId ? "you" : "other"}
                        >
                            <div className="message-content">
                                <p><span className="message-author">{messageContent.author}:</span> {messageContent.message}</p>
                            </div>
                        </div>
                    );
                })}
                </ScrollToBottom>
            </div>
            <div className="chat-footer">
                <input
                    disabled={props.myImage}
                    className="chat-input-box"
                    autoFocus
                    ref={textBoxRef}
                    type="text"
                    value={currentMessage}
                    placeholder={props.myImage ? "Cannot guess on your own picture" : "Message..."}
                    onChange={(event) => {
                        setCurrentMessage(event.target.value);
                    }}
                    onKeyPress={(event) => {
                        event.key === "Enter" && sendMessage();
                    }}
                />
                <button disabled={props.myImage} className="chat-send-box" onClick={sendMessage}>&#9658;</button>
            </div>
        </div>
    );
}

export default GameChat;