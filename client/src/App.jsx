import { useState } from 'react'
import Upload from './components/Upload'
import Footer from './components/Footer'
import Header from './components/Header'
import Xray from './components/Xray'
import Hero from './components/Hero'

function App() {

  return (
    <>
      <Header />
      <Hero />

      <div className='content-container'>
        
        
        <h2 id='action-text'>Try our <span className='blue'>AI Cavity Detection model</span><br/> trained on 1000+ Dental X-rays</h2>

        <Upload />
        <Xray />

      </div>

      <Footer />
    </>
  )
}

export default App
