import React from 'react'
import '../css/PlayArea.scss'
import {Logo} from '../index'

function PlayArea({
    turn,
    handleRefresh,
    markInput,
    board,
    player,
    scores,
    user="",
    opponent="",
}) {
  return (
    <div className='play-area'>
        <section className='top-layer'>
            <div></div>
            <div className="turn" style={{borderColor: (turn ==="X")? "#31C4BE" : "#F2B237"}}>
                {turn==="X"? <span>&#215;</span> : <span style={{height: "3.8rem"}}>o</span>}&nbsp; TURN
            </div>
            <div className="refresh" onClick={handleRefresh}><img src='./images/refresh.png' alt='refresh-icon'/></div>
        </section>
        <main className="tic-tac-cards" style={{pointerEvents: turn===player? "auto":"none"}}>
            {board.map((card, index)=> (
                <div key={index} onClick={()=> markInput(index)}>
                    {(card&&card!=="-")? (card==="X"? <Logo width='50' height='52'>X</Logo> : <Logo width='53' height='53'>O</Logo>) : ""}
                </div>
            ))}
        </main>
        <section className="scores">
            <div className={player==="X"? "aqua":"yellow"}>
                {player} {user!=="user"? `(${user})`: "(YOU)"} <h3>{scores[user]}</h3>
            </div>
            <div>TIES <h3>{scores["tie"]}</h3></div>
            <div className={player==="X"? "yellow":"aqua"}>
                {player==="X"? "O" : "X"} {opponent!=="cpu"? `(${opponent})` : "(CPU)"} <h3>{scores[opponent]}</h3>
            </div>
        </section>
    </div>
  )
}

export default PlayArea