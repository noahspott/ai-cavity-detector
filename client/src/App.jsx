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
      <Upload />
      <Xray />
      <Footer />
    </>
  )
}

export default App
