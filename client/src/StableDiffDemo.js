import React, { useState } from "react";
import DragDrop from "./DragDrop";
import { socket } from "./App";

function StableDiffDemo(props) {

    const [file, setFile] = useState(null);

    const [prompt, setPrompt] = useState("");

    async function upload(file, prompt) {
        const imageObject = {
            id: socket.id,
            type: "file",
            body: file,
            mimeType: file.type,
            fileName: file.name,
            room: props.room,
            prompt: prompt.toLowerCase()
        };
        socket.emit("upload", imageObject);
        props.changePhase();
    }

    // upload file and prompt to server after submit button clicked
    function handleSubmit(event) {
        event.preventDefault();
        if (file && prompt) {
            upload(file, prompt);
        } else {
            alert("Must put in a valid prompt or image file");
        }
    }

    function handleChange(event) {
        setPrompt(event.target.value);
    }

    return (
        <div className="img-generation-page">
            <div className="img-submit-container">
                <h1>Submit Prompt and Upload Image</h1>
                <h4>Instructions: Come up with a creative prompt and generate images of it using the Stable Diffusion Demos at the bottom of the page</h4>
                <form onSubmit={handleSubmit} className="upload-form">
                    <h2>Submit Prompt</h2>
                    <small className="help-text">This is what other people will try to guess word for word</small>
                    <input type="text" onChange={handleChange} id="prompt-input" placeholder="Write your prompt here..." value={prompt} maxlength="30"></input>
                    <h2>Upload Image</h2>
                    <small className="help-text">To avoid downloading, open the desired image in a new tab and drag & drop here</small>
                    <DragDrop setFile={setFile}/>
                    <input className="stable-diff-submit-btn" type="submit" value="Submit"></input>
                </form>
            </div>
            <br></br>
            <div className="iframes">
                {/*
                <iframe
                src="https://stabilityai-stable-diffusion-1.hf.space"
                frameBorder="0"
                width="850"
                height="845"
                scrolling="no"
                title="1">
                </iframe>
                */}
                <iframe
                src="https://runwayml-stable-diffusion-v1-5.hf.space"
                frameBorder="0"
                width="850"
                height="900"
                scrolling="no"
                title="1.5">
                </iframe>
                <iframe
                src="https://stabilityai-stable-diffusion.hf.space"
                frameBorder="0"
                width="850"
                height="940"
                scrolling="no"
                title="2.1">
                </iframe>
            </div>
        </div>
    )
}

export default StableDiffDemo;
