import Form from './Form';

function MainMenu(props) {

    return (
        <div className="menu">
            <h1 className="menu-title">
                AI Pictionary with Friends!
            </h1>
            <h4 className="menu-text">
                An online multiplayer game by <a href="https://ryanhayame.github.io/portfolio/" target="_blank">Ryan Hayame</a>
            </h4>
            <Form username={props.username} room={props.room} changePhase={props.changePhase} setUsername={props.setUsername} setRoom={props.setRoom}/>
        </div>
    )
}
  
export default MainMenu;