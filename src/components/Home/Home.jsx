import React, {useRef, useState} from 'react'
import toast, {Toaster} from 'react-hot-toast';
import {Logo, Popup, FriendPlayConf} from '..'
import '../css/Home.scss';

function Home({
    player,
    changePlayer,
    gameStarts,
    updateGameCode,
    gameCode,
    userName,
}) {

    const [showCodeConf, setShowCodeConf] = useState(false);

    const inviteRef = useRef(null);
    const codeRef = useRef(null);
    const notify = (msg) => {
        toast.success(`${msg}`, {
            position: 'top-right',
            iconTheme: {
                primary: "#F2B237",
                secondary: "#192A32"
            },
            style: {
                borderRadius: "0.3125rem",
                backgroundColor: "#192A32",
                color: "#F2B237",
                fontFamily: "DM Sans, sans-serif",
                fontWeight: "800"
            }
        })
    };

    const handleInvite = ()=> {
        inviteRef.current.disabled = true;
        window.navigator.clipboard.writeText(window.location.href);
        notify("Invite link copied");
        setTimeout(()=> inviteRef.current.disabled = false, 2000);
    }
    
    const handleCopyCode = ()=> {
        codeRef.current.disabled = true;
        window.navigator.clipboard.writeText(gameCode);
        notify("Game code copied");
        setTimeout(()=> codeRef.current.disabled = false, 2000);
    }

  return (
    <>
        <div className='home'>
            <div className='pick'>
                <h3>PICK PLAYER</h3>
                <div className="player-options">
                    <div
                        className={player === "X" ? "selected" : ""}
                        onClick={() => changePlayer("X")}
                    >
                        <Logo color={player === "X" ? "#192A32" : "#D9D9D9"}>X</Logo>
                    </div>
                    <div
                        className={player === "O" ? "selected" : ""}
                        onClick={() => changePlayer("O")}
                    >
                        <Logo color={player === "O" ? "#192A32" : "#D9D9D9"}>O</Logo>
                    </div>
                </div>
            </div>
            <div className="new-game">
                <button onClick={gameStarts}>NEW GAME ( VS CPU )</button>
                <button onClick={()=> setShowCodeConf(true)}>NEW GAME ( VS FRIEND )</button>
            </div>
            <div className='invite'>
                <button onClick={handleInvite} ref={inviteRef}>Invite your friend</button>
            </div>
            <Toaster/>
        </div>
        {
            showCodeConf && <Popup showClosePopup handleClosePopup={()=> {setShowCodeConf(false)}}>
                <FriendPlayConf player={player} updateGameCode={updateGameCode} changePlayer={changePlayer}
                 gameCode={gameCode} codeRef={codeRef} userName={userName} gameStarts={gameStarts} handleCopyCode={handleCopyCode}/>
            </Popup>
        }
    </>
  )
} 

export default Home