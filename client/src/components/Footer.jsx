import React from 'react'

export default function Footer() {
    return(
        <div id='footer-container'>
            <div className='footer-column'>
                <h3 className="text-sm caps">Disclaimer</h3>
                <div className="spacer-sm"></div>
                <p className="text-sm">The Cavity Detection AI model's results are for informational purposes 
                    and should not replace professional medical advice.</p>
            </div>

            <div className='footer-column'>
                <h3 className="text-sm caps">Data</h3>
                <div className="spacer-sm"></div>
                <p className="text-sm">The Cavity Detection machine learning model was trained on 
                    the <a>DENTEX training set</a></p>
            </div>
            
            <div className='footer-column'>
                <h3 className="text-sm caps">Credit</h3>
                <div className="spacer-sm"></div>
                <p className="text-sm">This web application was designed and created by:</p>
                <div className="spacer-sm"></div>
                <ul className="text-sm bold">
                    <li>Michael Stanley</li>
                    <li>Noah Spott</li>
                    <li>Mason Ticehurst</li>
                    <li>Keian Kaserman</li>
                </ul>
            </div>
        </div>
    )
}