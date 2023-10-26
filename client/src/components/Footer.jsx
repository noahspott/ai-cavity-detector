import React from 'react'

export default function Footer() {
    return(
        <div id='footer-container'>
            <div className='footer-column'>
                <h3>Disclaimer</h3>
                <p>The Cavity Detection AI model's results are for informational purposes 
                    and should not replace professional medical advice.</p>
            </div>
            <div className='footer-column'>
                <h3>Data</h3>
                <p>The Cavity Detection machine learning model was trained on 
                    the <a>DENTEX training set</a></p>
            </div>
            <div className='footer-column'>
                <h3>Credit</h3>
                <p>This web application was designed and created by:</p>
                <ul>
                    <li>Michael Stanley</li>
                    <li>Noah Spott</li>
                    <li>Mason Ticehurst</li>
                    <li>Keian Kaserman</li>
                </ul>
            </div>
        </div>
    )
}