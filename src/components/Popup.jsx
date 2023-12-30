import React from 'react'
import './css/Popup.scss'

function Popup({
    children,
    showClosePopup=false,
    handleClosePopup
}) {
  return (
    <div className='popup'>
        <main>
            {children}
            {showClosePopup && <div className="close-popup" onClick={handleClosePopup}>
                &#215;
            </div>}
        </main>
    </div>
  )
}

export default Popup