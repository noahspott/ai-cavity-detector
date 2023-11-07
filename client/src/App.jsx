import React from 'react'
import axios from 'axios'
import Upload from './components/Upload'
import Footer from './components/Footer'
import Header from './components/Header'
import Xray from './components/Xray'
import Hero from './components/Hero'

function App() {

  const [userImage, setUserImage] = React.useState(null)
  const [processedImageUrl, setProcessedImageUrl] = React.useState(null)

  const baseURL = 'http://127.0.0.1:5000'
  const processEndPoint = '/process'

  function processButtonClick() {
    console.log("Process Button Clicked!")

    // TODO: make button unclickable if no userImage

    if(userImage){
      console.log(userImage)

      const formData = new FormData();
      formData.append('file', userImage, userImage.name);
  
      axios.post(baseURL + processEndPoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data' // Set the content type to multipart form-data
        },
        responseType: 'arraybuffer' // Force to receive data in a Blob Format
      })
      .then(response => {
        // Assuming the response is an array buffer and needs conversion to Blob
        const blob = new Blob([response.data], { type: 'image/png' });
        const objectUrl = URL.createObjectURL(blob)
        setProcessedImageUrl(objectUrl)
      })
      .catch(error => {
        console.error('Error:', error)
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
        <Xray 
          userImage={userImage}
          processedImageUrl={processedImageUrl}
        />
      </div>
      <Footer />
    </>
  )
}

export default App
