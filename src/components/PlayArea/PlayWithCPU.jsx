import React, { useEffect, useState } from 'react'
import { checkWinning, findBlockChoice, findBestChoice } from './PlayLogic';
import {PlayArea, Popup, GameOver} from '../';

let markedIndexes = [];
let gameOverData = {};
function PlayWithCPU({
    player,
    removePlayArea,
}) {
    const [board, setBoard] = useState(Array.from({length: 9}, (_)=> ""));
    const [turn, setTurn] = useState(player);
    const [showGameOver, setShowGameOver] = useState(false);
    const [scores, setScores] = useState({
        "user": 0,
        "tie": 0,
        "cpu": 0
    });

    useEffect(()=> {
        const scores = JSON.parse(localStorage.getItem('scores'));
        if(scores) setScores(scores);
    }, [])
    
    useEffect(()=> {
        if(turn !== player) {
            const cpuWinIndex = findBlockChoice(markedIndexes[markedIndexes.length-2], turn, board);
            const blockIndex = cpuWinIndex < 0 ? findBlockChoice(markedIndexes[markedIndexes.length-1], player, board) : cpuWinIndex;
            setTimeout(()=> {
                blockIndex < 0 ? markInput(findBestChoice(markedIndexes)) : markInput(blockIndex);
            }, 1000)
        }
        
    }, [turn])
    
    useEffect(()=> {
        if(markedIndexes.length >= 5) {
            //check for winning or all input boxes are filled.
            const isWin = checkWinning(markedIndexes[markedIndexes.length-1], turn, board);
            if(isWin || markedIndexes.length === 9) return gameOver(isWin);
        }
        
        markedIndexes.length > 0 && (turn === player)? setTurn(player==="X"? "O" : "X") : setTurn(player);
        
        
    }, [board])
    
    const gameOver = (isWin) => {
        
        setTimeout(() => {
            isWin ?
                gameOverData = {
                    gameResult: (turn === player) ? "YOU WON!" : "YOU LOST!",
                    message: "TAKES THE ROUND",
                    winner: turn,
                }
                :
                gameOverData = {
                    gameResult: "IT'S A TIE!",
                    message: "NICE TRY, REMATCH ?",
                }
                setShowGameOver(true)
                isWin ? ((turn === player) ? updateScores("user") : updateScores("cpu")) : updateScores("tie");
        }, 500);
    }
    
    const handlePlayAgain = ()=> {
        markedIndexes = [];
        setBoard(Array.from({length: 9}, (_)=> ""));
        setShowGameOver(false);
    }

    const handleRefresh = ()=> {
        gameOverData = {
            message: "Do you want to quit ?",
            refresh: true,
        }
        setShowGameOver(true);
    }

    const handleQuit = ()=> {
        markedIndexes = [];
        setShowGameOver(false);
        removePlayArea();

        ['gameStart', 'scores', 'player'].forEach((keys)=> localStorage.removeItem(`${keys}`));
    }

    const handleNewGame = ()=> {
        handlePlayAgain();
        localStorage.removeItem('scores');
        setScores({"user": 0, "tie": 0, "cpu": 0});
    }
    
    const updateScores = (winner) => {
        localStorage.setItem('scores', JSON.stringify({...scores, [winner]: scores[winner]+1}));
        setScores((prevScores)=> ({...prevScores, [winner]: prevScores[winner]+1}));
    }

    const markInput = (index)=> {
        if(!markedIndexes.includes(index)) {
            markedIndexes.push(index);
            setBoard((prev)=> prev.map((input, idx)=> idx===index? turn : input));
        }
    }

  return (
    <>
        <PlayArea player={player} turn={turn} board={board} scores={scores} handleRefresh={handleRefresh}
            markInput={markInput} user='user' opponent='cpu'/>
        {
            showGameOver && <Popup handleClosePopup={()=> setShowGameOver(false)} showClosePopup={gameOverData.refresh}>
                <GameOver {...gameOverData} handlePlayAgain={handlePlayAgain} handleNewGame={handleNewGame} handleQuit={handleQuit} />
            </Popup>
        }
    </>
  )
}

export default PlayWithCPU