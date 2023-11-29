import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Upload from './components/Upload'
import Footer from './components/Footer'
import Header from './components/Header'
import Xray from './components/Xray'
import Hero from './components/Hero'
import LoadingOverlay from 'react-loading-overlay';

function App() {

  const [userImage, setUserImage] = useState(null)
  const [processed, setProcessed] = useState(false)
  const [processedImageResults, setProcessedImageResults] = useState(null)
  
  useEffect(() => {
    if(userImage != null) {
      setProcessedImageResults(null)
      setProcessed(true)
    }
  }, [userImage]);

  // Azure VM
  const baseURL = 'http://172.203.184.169'
  const processEndPoint = '/process'

  function processButtonClick() {
    // TODO: make button unclickable if no userImage

    if(userImage){
      document.getElementById('process-button').disabled = true
      setProcessed(false)
      
      const formData = new FormData();
      formData.append('file', userImage, userImage.name)
  
      axios.post(baseURL + processEndPoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data' // Set the content type to multipart form-data
        }
      })
      .then(response => {
        setProcessed(true)
        setProcessedImageResults(response.data)
        document.getElementById('process-button').disabled = false
      })
      .catch(error => {
        setProcessed(false)
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
        <br/>
        <LoadingOverlay
          active={userImage != null && !processed}
          spinner
          text='Loading predictions...'
        >
          <Xray 
            userImage={userImage}
            xrayData={processedImageResults}
            isProcessed={processed}
          />
        </LoadingOverlay>
        <br/>
      </div>
      <Footer />
    </>
  )
}

export default App
