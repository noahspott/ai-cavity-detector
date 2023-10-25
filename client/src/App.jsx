import { useState } from 'react'
import Upload from './components/Upload'
import Footer from './components/Footer'
import Header from './components/Header'
import Xray from './components/Xray'

function App() {

  return (
    <>
      <Header />
      <Upload />
      <Xray />
      <Footer />
    </>
  )
}

export default App
