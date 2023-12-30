import {useEffect, useState} from 'react'
import {Home, Logo, Username, Popup, PlayWithCPU, PlayWithFriend} from './';
import { FaPencil } from 'react-icons/fa6';
import './css/Game.scss';

function Game() {
  const [player, setPlayer] = useState("O");
  const [start, setStart] = useState(false);
  const [showPlayArea, setShowPlayArea] = useState(false);
  const [showUsernameBox, setShowUsernameBox] = useState(false);
  const [userName, setUserName] = useState("");
  const [gameCode, setGameCode] = useState(""); //Game Code for Play With Friend.
  
  useEffect(()=> {
    const userName = localStorage.getItem('username');
    const gameStart = localStorage.getItem('gameStart');
    const player = localStorage.getItem('player')
    const gameCode = localStorage.getItem('gameCode');
  
    if(gameStart) {
      setStart(true);
      setShowPlayArea(true);
    }

    if(player) setPlayer(player);
    if(gameCode) setGameCode(gameCode);

    if(userName) setUserName(userName)
    else setShowUsernameBox(true);
  }, [])
  
  const removePlayArea = () => {
    setStart(false);
    setShowPlayArea(false);
    setPlayer("O");
  }

  const gameStarts = ()=> {
    setStart(true);
    localStorage.setItem('player', player);
    localStorage.setItem('gameStart', true);
    if(gameCode) localStorage.setItem('gameCode', gameCode);
    gameCode ? setShowPlayArea(true) : setTimeout(()=>setShowPlayArea(true), 1000);
  }

  return (
    <div className='game-box'>
      {!start && <h3 title='username'>player name: <span>{userName}</span><FaPencil onClick={()=> setShowUsernameBox(true)}/></h3>}
        <div className="logo" style={(start && !showPlayArea && !gameCode) ? {animation: "slide-text linear both 0.7s"} : (start && (showPlayArea||gameCode))? {left: "3.5rem"} : null}>
                <Logo>X</Logo>
                {"  "}
                <Logo>O</Logo>
        </div>
        {(!start && !localStorage.getItem('gameStart')) ?
            <Home player={player} changePlayer={(player) => setPlayer(player)} gameStarts={gameStarts}
             updateGameCode={(code)=> setGameCode(code)} gameCode={gameCode} userName={userName}
            />
            : showPlayArea && (gameCode? <PlayWithFriend player={player} removePlayArea={removePlayArea} 
              gameCode={gameCode} updateGameCode={(code)=> setGameCode(code)} /> : 
              <PlayWithCPU player={player} removePlayArea={removePlayArea}/>)
        }
        {
          showUsernameBox && <Popup handleClosePopup={()=> setShowUsernameBox(false)} showClosePopup={userName}>
            <Username userName={userName} handleUserName={(username)=> setUserName(username)} closeUsernameBox={()=> setShowUsernameBox(false)}/>
          </Popup>
        }
    </div>
  )
}

export default Game