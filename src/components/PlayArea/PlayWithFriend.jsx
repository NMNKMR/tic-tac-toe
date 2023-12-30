import React, { useEffect, useState } from 'react'
import {getGameRef} from '../../firebase/databaseConf';
import { checkWinning } from './PlayLogic';
import { get, onValue, remove, update } from 'firebase/database';
import {PlayArea, Popup, GameOver} from '../'

let gameOverData = {};
let turnCount, startTurn, user="You", opponent="Opponent";
function PlayWithFriend({player, removePlayArea, gameCode, updateGameCode}) {
  const [turn, setTurn] = useState("");
  const [board, setBoard] = useState([]);
  const [showGameOver, setShowGameOver] = useState(false);
  const [scores, setScores] = useState({});
  const [newRoundTimer, setNewRoundTimer] = useState(null);
  const [showQuitPopup, setShowQuitPopup] = useState(false);

  useEffect(()=> {
    turnCount = 0;
    const gameRef = getGameRef(`${gameCode}`);
    
    get(gameRef).then((snapshot)=> {
      if(snapshot.exists()) {
        const {firstTurn, currentPlayer, board, scores} = snapshot.val();
        startTurn = firstTurn;
        user = localStorage.getItem('user')
        opponent = localStorage.getItem('opponent');
  
        setScores({
          [user]: scores[user],
          "tie": scores["tie"],
          [opponent]: scores[opponent],
        })
  
        setBoard(board);
        setTurn(currentPlayer);
      }

    })

    let gameOvertimer;
    const unsubscribe = onValue(gameRef, (snapshot)=> {
      if(snapshot.exists()) {

        if(snapshot.val().gameStarts) {
          const {board: realBoard, currentPlayer, turnCount: realCount, winner, scores, firstTurn} = snapshot.val();
          
          (turnCount!==realCount) && setBoard(realBoard);
          if(winner) gameOver({isWin: true, currentPlayer, winner, scores, firstTurn})
          else if(realCount===9) gameOver({isWin: false, scores, winner: "tie", firstTurn})
          else setTurn(currentPlayer);
          
          turnCount = realCount

        } else if(snapshot.val().newRound) {
            gameOvertimer = setTimeout(()=> {setShowGameOver(false)}, 2500)
            if(!newRoundTimer) setNewRoundTimer(gameOvertimer);
        }
      } else {
        if(newRoundTimer) clearTimeout(newRoundTimer);
        setShowGameOver(false);
        setShowQuitPopup(true);
        setTimeout(handleQuit, 2000);
      }
    })

    return ()=> {
      unsubscribe();
      if(gameOvertimer) clearTimeout(gameOvertimer);
    }

  }, [])

  const markInput = (index)=> {
    if(board[index]==="-") {
      turnCount++;
      const updatedBoard = [...board];
      updatedBoard[index] = player;
      setBoard(updatedBoard);
      const isWin = (turnCount>=5) ? checkWinning(index, turn, updatedBoard) : false;
      const newTurn = (!isWin && turnCount<9)? (turn==="X"? "O":"X") : turn;
      setTurn(newTurn);
      update(getGameRef(`${gameCode}`), 
      {board: updatedBoard, currentPlayer: newTurn, turnCount, winner: isWin? user:""});
    }
  }

  
  const gameOver = ({isWin, currentPlayer, winner, scores, firstTurn}) => {
        
    setTimeout(() => {
        isWin ?
            gameOverData = {
                gameResult: (currentPlayer === player) ? "YOU WON!" : "YOU LOST!",
                message: "TAKES THE ROUND",
                winner: currentPlayer,
            }
            :
            gameOverData = {
                gameResult: "IT'S A TIE!",
                message: "NICE TRY, REMATCH ?",
            }
            setShowGameOver(true)
            setNewRoundTimer(null);
            update(getGameRef(`${gameCode}`), {gameStarts: false, scores: {...scores, [winner]: scores[winner]+1}})
            updateScores(winner);
            startTurn = firstTurn;
    }, 500);
  }

  //Handler Functions
  const handleRefresh = ()=> {
    gameOverData = {
      message: "Do you want to quit ?",
      refresh: true,
      showNewGameButton: false,
    }
    setShowGameOver(true);
    setNewRoundTimer(null);
  }

  const handlePlayAgain = ()=> {
    if(!newRoundTimer) {
      const gameRef = getGameRef(`${gameCode}`);
      update(gameRef, {newRound: true}).then(()=> {
        const timer = setTimeout(handleNewRound, 2000, gameRef)
        setNewRoundTimer(timer);
      })
    }
  }

  const handleQuit = ()=> {
    setShowGameOver(false);
    removePlayArea();
    remove(getGameRef(`${gameCode}`));
    updateGameCode("");

    ['player', 'gameStart', 'gameCode', 'user', 'opponent'].forEach((keys)=> localStorage.removeItem(`${keys}`));
  }

  const handleNewRound = (gameRef)=> {
    startTurn = startTurn==="X"? "O":"X";
    update(gameRef, {
      board: ["-", "-", "-", "-", "-", "-", "-", "-", "-"],
      currentPlayer: startTurn,
      firstTurn: startTurn,
      gameStarts: true,
      newRound: false,
      turnCount: 0,
      winner: "",
    })
  }

  const updateScores = (winner) => {
    setScores((prevScores)=> ({...prevScores, [winner]: prevScores[winner]+1}));
  }

  return (
    <>
      {board.length > 0 &&
          <PlayArea player={player} turn={turn} board={board} scores={scores} handleRefresh={handleRefresh}
            markInput={markInput} user={user} opponent={opponent}
          />}
          {
            showGameOver && <Popup handleClosePopup={() => setShowGameOver(false)} showClosePopup={gameOverData.refresh}>
              <GameOver {...gameOverData} handlePlayAgain={handlePlayAgain} handleQuit={handleQuit} newRoundTimer={newRoundTimer} />
            </Popup>
          }
      {
        showQuitPopup && <Popup>
          <div>
            <h3 style={{ marginTop: 0, color: "#D9D9D9" }}>{`"${opponent}, has quit this game!"`}</h3>
            <p style={{ marginBottom: 0, color: "#FFF" }}>closing the game...</p>
          </div>
        </Popup>
      }
    </>
  )
}

export default PlayWithFriend