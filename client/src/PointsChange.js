import { useState, useEffect, memo } from "react";
import { socket } from "./App";

function PointsChange(props) {

    // object = {pointsGain: data.pointsGain, player: socket.data.nickname}
    const [pointsList, setPointsList] = useState([]);

    // processes emit from server
    // specifically: updates points state everytime someone gains points
    useEffect(() => {
        const eventListener = (dataArray) => {
            // if artist is in lobby, update two peoples' points
            if (dataArray.length === 2) {
                const newPerson = dataArray[0];
                const artist = dataArray[1];
                artist.player = `ARTIST: ${artist.player}`
                setPointsList((prevPointsList) => {
                    const pointsListWithoutArtist = prevPointsList.filter((personInPointsList) => personInPointsList.player !== artist.player);
                    return [...pointsListWithoutArtist, newPerson, artist];
                });
            } 
            // if artist is NOT in lobby, update only one person's points
            else {
                setPointsList((prevPointsList) => {
                    return [...prevPointsList, ...dataArray];
                });
            }
        };
        socket.on("track_points_change", eventListener);
    
        return () => socket.off("track_points_change", eventListener);
    }, [socket]);

    return (
        <div>
            <div className="points-gain-list">
                <h3>Round {props.index + 1} Results</h3>
                {pointsList.map((user) => {
                    return <div className="points-gain-list-player" key={user.player}>
                        <h4>{user.player}: <span>+{user.pointsGain}</span></h4>
                    </div>
                })}
            </div>
        </div>
    )
}

// memo because you only want to re-render if phaseObj.index changes
export default memo(PointsChange);