import React from 'react'

export default function FileUpload() {
    return(
        <div className='card'>
            <div id='upload-container'>
                <img id='upload-tooth-image' src="client/public/upload-tooth.jpg" alt="Upload Image" />
                <h3>DRAG FILE TO UPLOAD</h3>
            </div>
            <button id='process-button'>Process</button>
        </div>
    )
}