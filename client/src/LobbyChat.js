import { useEffect, useRef, useState } from "react";
import ScrollToBottom from "react-scroll-to-bottom";
import { socket } from "./App"

function LobbyChat(props) {
    const [currentMessage, setCurrentMessage] = useState("");
    const [messageList, setMessageList] = useState([]);

    // used for keeping focus
    const textBoxRef = useRef(null);

    const sendMessage = async () => {
        if (currentMessage !== "") {
            const messageData = {
                room: props.room,
                author: props.username,
                authorId: socket.id,
                message: currentMessage,
            };

            await socket.emit("send_message", messageData);
            setMessageList((list) => [...list, messageData]);
            setCurrentMessage("");
            textBoxRef.current.focus();
        }
    };

    useEffect(() => {
        socket.on("receive_message", (data) => {
            setMessageList((list) => [...list, data]);
        });
        return () => {
            socket.off("receive_message");
        }
    }, [socket]);

    return (
        <div className="chat-window">
            <div className="chat-header">
                <h4>Live Chat</h4>
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
                    className="chat-input-box"
                    autoFocus
                    ref={textBoxRef}
                    type="text"
                    value={currentMessage}
                    placeholder="Message..."
                    onChange={(event) => {
                        setCurrentMessage(event.target.value);
                    }}
                    onKeyPress={(event) => {
                        event.key === "Enter" && sendMessage();
                    }}
                />
                <button className="chat-send-box" onClick={sendMessage}>&#9658;</button>
            </div>
        </div>
    );
}

export default LobbyChat;