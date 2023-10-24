import { useState } from 'react'
import './App.css'
import Upload from './components/Upload'
import Footer from './components/Footer'
import Header from './components/header'
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
