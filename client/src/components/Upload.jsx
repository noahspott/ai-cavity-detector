import React from 'react'

export default function FileUpload(props) {

    function onFileUpload(event) {
        props.setUserImage(event.target.files[0])
    }

    function getUserImageName() {
        return props.userImage.name
    }

    return(
        <div className='card'>
            <div id='upload-container'>
                <label>
                    <img id='upload-tooth-image' src="client/public/upload-tooth.jpg" alt="Upload Image" />
                    <h3>CLICK TO UPLOAD XRAY</h3>
                    {props.userImage && <p id='image-name'>{getUserImageName()}</p>}
                    <input 
                        type='file'
                        accept='image/*'
                        className='file-input'
                        onChange={onFileUpload}
                        value={props.userFile}
                    />
                </label>
            </div>
            <button onClick={props.processButtonClick} id="process-button">Process</button>
        </div>
    )
}