import React, { useState } from 'react'
import './css/Username.scss'

function Username({
    userName="",
    handleUserName,
    closeUsernameBox,
}) {

    const [error, setError] = useState(false);
    const [username, setUsername] = useState(userName);

    const handleSubmit = ()=> {
        if(username.trim() === "") setError(true)
        else {
            handleUserName(username)
            localStorage.setItem('username', username.trim())
            closeUsernameBox();
        }

    }

  return (
    <div className='username'>
        <h3>Enter your username</h3>
        <div>
            <input type="text" name="username" value={username} maxLength={8} onChange={(e)=> setUsername(e.target.value)} />
            <button onClick={handleSubmit}>Save</button>
        </div>
        {error && <p>username can't be empty!</p>}
    </div>
  )
}

export default Username