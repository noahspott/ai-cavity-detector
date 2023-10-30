import React from 'react'
import Upload from './components/Upload'
import Footer from './components/Footer'
import Header from './components/Header'
import Xray from './components/Xray'
import Hero from './components/Hero'

function App() {

  const [userImage, setUserImage] = React.useState(null)
  const [modelOutput, setModelOutput] = React.useState(null)

  function processButtonClick() {
    console.log("Process Button Clicked!")

    console.log(userImage)
  }

  function fileUploadClick() {
    console.log("File Upload Clicked!")
  }

  return (
    <>
      <Header />
      <Hero />
      <div className='content-container'>
        <h2 id='action-text'>Try our <span className='blue'>AI Cavity Detection model</span><br/> trained on 1000+ Dental X-rays</h2>
        <Upload 
          fileUploadClick={fileUploadClick}
          userImage={userImage}
          setUserImage={setUserImage}
          processButtonClick={processButtonClick}
        />
        <Xray 
          userImage={userImage}
          // modelImage={modelOutput.image}
          // modelData={modelOutput.data}
        />
      </div>
      <Footer />
    </>
  )
}

export default App
