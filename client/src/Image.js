import React, { useState, useEffect } from "react";

// reads image blob and returns an image element

function Image(props) {
    const [imageSrc, setImageSrc] = useState("");

    useEffect(() => {
        const reader = new FileReader();
        reader.readAsDataURL(props.blob);
        reader.onloadend = function () {
            setImageSrc(reader.result);
        }
    }, [props.blob]);

    return (
        // no alt because it spoils if image loads slowly
        <img style={{ width: 550, height: "auto", maxHeight: 655, borderRadius:20 }} src={imageSrc}></img>
    );
}

export default Image;