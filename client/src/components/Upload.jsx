import React from 'react'

export default function FileUpload(props) {
    return(
        <div className='card'>
            <div onClick={props.fileUploadClick} id='upload-container'>
                <img id='upload-tooth-image' src="client/public/upload-tooth.jpg" alt="Upload Image" />
                <h3>DRAG FILE TO UPLOAD</h3>
            </div>
            <button onClick={props.processButtonClick} id='process-button'>Process</button>
        </div>
    )
}