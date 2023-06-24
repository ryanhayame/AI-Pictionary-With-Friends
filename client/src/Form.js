import { useEffect, useState, useCallback } from "react";
import { socket } from './App'

function Form(props) {

    const [formData, setFormData] = useState(
        {username: "", room: ""}
    );

    /* Using useCallback will prevent unnecessary re-renders of the Form
    component, when handleChange and handleSubmit functions are being
    passed as props to the child components.*/

    const handleChange = useCallback((event) => {
        setFormData(prevFormData => {
            return {
                ...prevFormData,
                [event.target.name]: event.target.value
            }
        });
    }, []);

    // checks if value is a whole number
    function isNumeric(value) {
        return /^-?\d+$/.test(value);
    }

    const handleSubmit = useCallback(async (event) => {
        event.preventDefault();
        if (!isNumeric(formData.room)) {
            alert("Room number must be an integer");
        } else if (formData.username && formData.room) {
            socket.emit("join_room", formData);
            props.setUsername(formData.username);
            props.setRoom(formData.room);
        } else {
            alert("Must put in a valid username or room number");
        }
    }, [formData]);

    // changes phase once parent state is fully updated by the server
    useEffect(() => {
        if (props.username === formData.username && props.room === formData.room && props.username && props.room) {
            props.changePhase();
        }
    }, [props.username, props.room]);

    return (
        <div className="main-menu-form">
            <form onSubmit={handleSubmit}>
                <input
                    className="main-menu-username-input"
                    type="text"
                    placeholder="Username"
                    onChange={handleChange}
                    name="username"
                    /* for controlled component */
                    value={formData.username}
                />
                <input
                    className="main-menu-room-input"
                    type="text"
                    placeholder="Room Number"
                    onChange={handleChange}
                    name="room"
                    /* for controlled component */
                    value={formData.room}
                />
                <button className="main-menu-submit-btn">Submit</button>
            </form>
        </div>
    )
}
  
export default Form;