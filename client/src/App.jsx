import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Upload from './components/Upload'
import Footer from './components/Footer'
import Header from './components/Header'
import Xray from './components/Xray'
import Hero from './components/Hero'
import LoadingOverlay from 'react-loading-overlay';

function App() {
  const azureBaseURL = 'http://172.203.184.169'   // Azure URL for deployment
  const localBaseURL = 'http://127.0.0.1:5000'    // local URL for testing
  const processEndPoint = '/process'

  const baseURL = localBaseURL                    // switch this to azureBaseURL for deployment!

  const [userImage, setUserImage] = useState(null)
  const [isProcessed, setIsProcessed] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [processedImageResults, setProcessedImageResults] = useState(null)
  
  useEffect(() => {
    if(userImage != null) {
      setProcessedImageResults(null)
      setIsLoading(false)
    }
  }, [userImage]);

  function processButtonClick() {
    // TODO: make button unclickable if no userImage

    if(userImage){
      document.getElementById('process-button').disabled = true
      // setIsProcessed(false)
      setIsLoading(true)
      
      const formData = new FormData();
      formData.append('file', userImage, userImage.name)
  
      axios.post(baseURL + processEndPoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data' // Set the content type to multipart form-data
        }
      })
      .then(response => {
        setIsProcessed(true)
        setIsLoading(false)
        setProcessedImageResults(response.data)
        document.getElementById('process-button').disabled = false
      })
      .catch(error => {
        setIsProcessed(false)
        console.error('Error:', error)
        document.getElementById('process-button').disabled = false
      })
    }
  }

  return (
    <>
      <Header />
      <Hero />
      <div className='content-container'>

        <h2 id='action-text'>Try our <span className='blue'>AI Cavity Detection model</span><br/> trained on 1000+ Dental X-rays</h2>

        <Upload
          userImage={userImage}
          setUserImage={setUserImage}
          processButtonClick={processButtonClick}
        />

        <div className="spacer-lg"></div>

        {isProcessed && <p className="instruction-text">Hover over the boxes for tooth info.</p>}

        <div className="spacer-sm"></div>

        <LoadingOverlay
          active={isLoading}
          spinner
          text='Loading predictions...'
        >
          <Xray 
            userImage={userImage}
            xrayData={processedImageResults}
            isProcessed={isProcessed}
          />
        </LoadingOverlay>

        <div className="spacer-lg"></div>

      </div>
      <Footer />
    </>
  )
}

export default App
