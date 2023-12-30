import React, { useEffect, useState } from 'react'
import {getGameRef} from '../../firebase/databaseConf'
import '../css/FriendPlayConf.scss'
import { onValue, child, get, update, remove } from 'firebase/database';
import auth from '../../firebase/authConf';
import {FaClipboard, FaClipboardCheck ,FaWhatsapp} from 'react-icons/fa6'

function FriendPlayConf({
    player,
    gameCode,
    codeRef,
    userName,
    updateGameCode,
    gameStarts,
    changePlayer,
    handleCopyCode,
}) {
    const [isCodeGenerated, setCodeGenerated] = useState(false);
    const [isCodeValid, setCodeValid] = useState(false);
    const [confMsg, setConfMsg] = useState("");
    const [gameCounter, setGameCounter] = useState(-1);
    const [isCodeCopied, setCodeCopied] = useState(false);

    useEffect(()=> {
        let startCounter, startTimer, unsubscribe;
        let user, opponent="Opponent";
        if(gameCode) {
            const playersRef = getGameRef(`${gameCode}/players`);
            unsubscribe = onValue(playersRef, (snapshot)=> {
                if(snapshot.exists()) {
                    const players = snapshot.val();
                    if(players.length===2) {

                        if(isCodeGenerated) {
                            user = players[0].username;
                            opponent = players[1].username;
                            
                            setConfMsg(`(${opponent}) joined the game!`);
                        } else {
                            user = players[1].username;
                            opponent = players[0].username;
                            
                            setConfMsg("Game joined successfully!")
                        }
                        //Initializing timers and players.
                        setGameCounter(3);
                        startCounter = setInterval(()=> {
                            setGameCounter((prev)=> prev-1);
                        }, 1000)
                        startTimer = setTimeout(gameStarts, 3000);
                        localStorage.setItem('user', user);
                        localStorage.setItem('opponent', opponent);
                    }
                } else {
                    if(startTimer) {
                        clearTimeout(startTimer);
                        clearInterval(startCounter);
                        updateGameCode("");
                        setGameCounter(-1);
    
                        if(isCodeGenerated) {
                            setCodeGenerated(false);
                            setConfMsg(`${opponent} has left, generate new code!`)
                        } else if(isCodeValid) {
                            setCodeValid(false);
                            setConfMsg(`${opponent} has removed this game!`)
                        }
    
                        ['user', 'opponent'].forEach((keys)=> localStorage.removeItem(`${keys}`));
                    }
                }
            })
        }

        window.addEventListener('beforeunload', handleBeforeUnload);

        return async()=> {
            startTimer && clearTimeout(startTimer);
            startCounter && clearInterval(startCounter);

            if(!localStorage.getItem('gameStart') && (isCodeGenerated || isCodeValid)) {
                updateGameCode("");
                await remove(getGameRef(`${gameCode}`));
            }

            unsubscribe && unsubscribe(); //Unsubscribe onValue Listener on players.
            window.removeEventListener('beforeunload', handleBeforeUnload)
        }

    }, [isCodeGenerated, isCodeValid])

    //Game Code Generation or Joining Functions
    const createUniqueCode = async()=> {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'; // Chars for code
        let uniqueCode = '';

        // Ensure a mix of chars and numbers:
        for (let i = 0; i < 6; i++) {
            uniqueCode += chars.charAt(Math.floor(Math.random() * chars.length))
        }

        try {
            const gameRef = getGameRef();
            const existingGameSnapshot = await get(child(gameRef, uniqueCode));
            if (existingGameSnapshot.exists()) {
                return createUniqueCode();
            }

            return {uniqueCode, gameRef};

        } catch (error) {
            setConfMsg("Error Occurred, Try Again!");
            return {};
        }

    }

    const createGame = async()=> {
        const {uniqueCode, gameRef} = await createUniqueCode();

        if(uniqueCode) {
            const updates = {};
            updates[uniqueCode] = {
                board: ["-", "-", "-", "-", "-", "-", "-", "-", "-"],
                currentPlayer: player,
                firstTurn: player,
                gameStarts: false,
                newRound: false,
                turnCount: 0,
                winner: "",
                players: [{
                    username: userName,
                    choice: player,
                    playerId: auth.currentUser.uid,
                }],
                scores: {
                    [userName]: 0,
                    tie: 0,
                }
            }
    
            update(gameRef, updates);
        }
        return uniqueCode;
    }

    const generateGameCode = async()=> {
        const gameCode = await createGame();
        if(gameCode) {
            updateGameCode(gameCode)
            setCodeGenerated(true)
            if(confMsg) setConfMsg("")
        }
    }

    const joinGame = async()=> {
        if(gameCode.length < 6) {
            setConfMsg("Error: Code should be of 6 digits!");
            return;
        }
        
        const gameRef = getGameRef(`${gameCode}`)
        const gameSnapshot = await get(gameRef)
        if(gameSnapshot.exists()) {
            const gameData = gameSnapshot.val();

            if(gameData?.players.length===2) {
                setConfMsg("Game already have 2 players!")
                return;
            }

            const players = gameData?.players;
            players.push({
                username: players[0].username===userName? userName+"2":userName,
                choice: players[0].choice==="X"? "O" : "X",
                playerId: auth.currentUser.uid,
            })

            const scores = gameData?.scores;
            scores[players[1].username] = 0

            update(gameRef, {players, gameStarts: true, scores})
            setCodeValid(true);
            changePlayer(players[1].choice);
        } else {
            setConfMsg("No game found with this code!")
        }

    }

    //Handlers
    const handleShare = () => {
        const message = `Join me on ${window.location.href} with my game code ${gameCode}`;
        const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    };

    const handleBeforeUnload = (event) => {
        // Check if the game data is in a state where leaving might cause data loss
        const isLeaving = gameCode && !localStorage.getItem('gameStart');
       
        if (isLeaving) {
          // Custom confirmation message
          const confirmationMessage = 'Leaving now will result in losing game data. Are you sure?';
          event.returnValue = confirmationMessage; // Standard for most browsers
          return confirmationMessage; // For some older browsers
        }
    };

  return (
    <div className='code-conf'>
        <section className='enter-code'>
            <label htmlFor="code-input">Do you have a code?</label>
            <div id="code-input">
                <input type="text" value={!isCodeGenerated? gameCode : ""} disabled={isCodeGenerated || isCodeValid}
                 onChange={(e)=> updateGameCode(e.target.value.toUpperCase())} placeholder='CODE...' maxLength={6}/>
                <button disabled={isCodeGenerated || isCodeValid} onClick={joinGame}>Join</button>
            </div>
        </section>
        <div className="ruler">
        <span><hr /></span>
        <p>OR</p>
        <span><hr /></span>
        </div>
        <section className='generate-code'>
            <button onClick={generateGameCode} disabled={isCodeGenerated || isCodeValid}>Generate Code</button>
            {(isCodeGenerated && !isCodeValid) && <p>Unique Game Code: <span>{gameCode}</span></p>}
            {isCodeGenerated && <div className='copy-share'>
                <button ref={codeRef} onClick={()=> {handleCopyCode(); setCodeCopied(true)}}>{!isCodeCopied?<FaClipboard/>:<FaClipboardCheck/>}</button>
                <button onClick={handleShare}><FaWhatsapp/></button>
            </div>}
        </section>
        <footer className='conf-response'>
            <p style={(isCodeGenerated || isCodeValid)? {color: "#19D319"}:{color: "rgb(249, 85, 85)"}}>{confMsg}</p>
            {(isCodeGenerated || isCodeValid) && 
                <h3>{gameCounter===-1? "Waiting for opponent to join..." : `Game will start in ${gameCounter} sec(s)`}</h3>}
        </footer>
    </div>
  )
}

export default FriendPlayConf