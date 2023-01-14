import { useState, useEffect } from "react";

function Prompt(props) { 

    const [displayedPrompt, setDisplayedPrompt] = useState("Get ready to start guessing!".split('').join(' '));

    // pseudorandom number generator
    function PRNG(seed, modulo) {
        let str = `${(2**31-1&Math.imul(48271,seed))/2**31}`
        .split('')
        .slice(-10)
        .join('') % modulo
        return str
    }

    // reveals a hidden letter of the prompt
    function revealLetter(displayedLetters) {
        let displayedArray = [...displayedLetters];
        // algorithm could be optimized by storing seed variable somewhere else
        // every re-render resets seed's value back to props.room
        // results in "random" numbers being generated in same order every time
        let seed = props.room;
        // loops is used to break while loop and prevent crash if no more letters to reveal
        let loops = 0;
        // keeps trying random indices until it finds an underscore that can be converted to a letter
        while (1) {
            const randomIndex = parseInt(PRNG(seed++, displayedArray.length - 1))
            if (loops > 30) {
                break;
            }
            if (displayedArray[randomIndex] === '_') {
                displayedArray[randomIndex] = props.keyArray[randomIndex];
                setDisplayedPrompt(displayedArray.join(""));
                break;
            }
            loops++;
        }
    }

    useEffect(() => {
        // hides prompt during guess phase
        if (props.phaseObj.phase === "GUESS") {
            setDisplayedPrompt(hideLetters(props.promptString));
        } 
        // reveals prompt during gap phase
        else if (props.phaseObj.phase === "GAP") {
            setDisplayedPrompt(props.promptString.split('').join(' '));
        }
    }, [props.phaseObj.phase]);

    // starts revealing letters every 5 seconds during guess phase
    useEffect(() => {
        let timer1;
        if (props.phaseObj.phase === "GUESS") {
            timer1 = setTimeout(() => {
                revealLetter(displayedPrompt);
            }, 5000);
        }
        // cleanup function to stop
        return () => {
            if (props.phaseObj.phase === "GUESS") {
                clearTimeout(timer1);
            }
        }
    }, [displayedPrompt]);

    // turns all spaces into triple spaces and all letters into underscores
    function hideLetters(prompt) {
        let temp = prompt.replace(/ /g, "   ");
        return temp.replace(/[a-z]/gi, "_ ");
    }

    return (
        <div className="prompt-container">
            <h4><pre>{displayedPrompt}</pre></h4>
        </div>
    )
}

export default Prompt;