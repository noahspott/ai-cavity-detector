import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Upload from './components/Upload'
import Footer from './components/Footer'
import Header from './components/Header'
import Xray from './components/Xray'
import Hero from './components/Hero'
import LoadingOverlay from 'react-loading-overlay';
import CardDataTable from './components/CardDataTable'

function App() {
  const azureBaseURL = 'http://172.203.184.169'   // Azure URL for deployment
  const localBaseURL = 'http://127.0.0.1:5000'    // local URL for testing
  const processEndPoint = '/process'

  //const baseURL = localBaseURL                    // for testing
  const baseURL = azureBaseURL                    // for deployment

  const deepCariesColor = '#E9153C'
  const cariesColor = '#FF6F59'
  const impactedColor = '#43AA8B'
  const periapicalLesionColor = '#9649CB'

  const [userImage, setUserImage] = useState(null)      // file object
  const [isProcessed, setIsProcessed] = useState(false) // true when predictions are ready
  const [isLoading, setIsLoading] = useState(false)     // true when waiting for predictions
  const [processedImageResults, setProcessedImageResults] = useState(null)  // object containing predictions
  const [processedImage, setProcessedImage] = useState(null)  // drawn image with bounding boxes
  
  useEffect(() => {
    if(userImage != null) {
      setProcessedImageResults(null)
      setIsLoading(false)
    }
  }, [userImage]);

  function processButtonClick() {

    if(userImage){
      document.getElementById('process-button').disabled = true
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

  const downloadButtonClick = (userImage, detections) => {
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')
  
    const image = new Image()
    image.src = URL.createObjectURL(userImage)
  
    image.onload = () => {
      // Set canvas dimensions to match the image
      canvas.width = image.width
      canvas.height = image.height
  
      // Draw the original image
      context.drawImage(image, 0, 0)
      
      // If no detection object present, skip any bounding box drawing
      if(!detections) return;
      
      // Draw boxes based on detections
      detections.forEach((detection) => {
        const { coordinates, disease } = detection
        const { x, y, width, height } = coordinates
  
        // Set box color based on disease type
        switch (disease) {
          case 'Caries':
            context.strokeStyle = cariesColor
            break
          case 'Deep Caries':
            context.strokeStyle = deepCariesColor
            break
          case 'Impacted':
            context.strokeStyle = impactedColor
            break
          case 'Periapical Lesion':
            context.strokeStyle = periapicalLesionColor
            break
          default:
            context.strokeStyle = 'black'
        }

        // x and y are the center of the box, so we need to offset by half the width and height
        let newX = x - (width / 2)
        let newY = y - (height / 2)
  
        // Draw the box
        context.beginPath()
        context.rect(newX, newY, width, height)
        context.lineWidth = 2
        context.stroke()
      })
  
      // Trigger the download
      const downloadLink = document.createElement('a')
      downloadLink.href = canvas.toDataURL()
      downloadLink.download = 'annotated_image.png'
      downloadLink.click()
    }
  }

  function drawLegend(canvas, context) {
    // Draw legend background card
    const legendCardX = canvas.width - 130;
    const legendCardY = canvas.height - 110;
    const legendCardWidth = 120;
    const legendCardHeight = 100;

    context.fillStyle = 'white';
    context.fillRect(legendCardX, legendCardY, legendCardWidth, legendCardHeight);

    // Draw legend
    const legendX = canvas.width - 120;
    const legendY = canvas.height - 80;
    const legendSpacing = 25;

    drawLegendCircle(context, legendX, legendY, cariesColor);
    drawLegendText(context, legendX + 20, legendY + 5, 'Caries');

    drawLegendCircle(context, legendX, legendY + legendSpacing, deepCariesColor);
    drawLegendText(context, legendX + 20, legendY + legendSpacing + 5, 'Deep Caries');

    drawLegendCircle(context, legendX, legendY + 2 * legendSpacing, impactedColor);
    drawLegendText(context, legendX + 20, legendY + 2 * legendSpacing + 5, 'Impacted');

    drawLegendCircle(context, legendX, legendY + 3 * legendSpacing, periapicalLesionColor);
    drawLegendText(context, legendX + 20, legendY + 3 * legendSpacing + 5, 'Periapical Lesion');
  }

  const drawLegendCircle = (context, x, y, color) => {
    context.beginPath();
    context.arc(x, y, 8, 0, 2 * Math.PI);
    context.fillStyle = color;
    context.fill();
    context.lineWidth = 2;
    context.strokeStyle = 'black';
    context.stroke();
  };
  
  const drawLegendText = (context, x, y, text) => {
    context.fillStyle = 'black';
    context.font = '12px Arial';
    context.fillText(text, x, y);
  };

  return (
    <>
      <Header />
      <Hero />
      <div className='content-container'>

        <h2 id='action-text'>
          Try our <span className='blue'>AI Cavity Detection model</span><br/> trained on 1000+ Dental X-rays
        </h2>

        <Upload
          userImage={userImage}
          setUserImage={setUserImage}
          processButtonClick={processButtonClick}
        />

        <div className="spacer-lg"></div>

        {/* Instructions */}
        {isProcessed && 
          <>
            <p className="instruction-text">Hover over the boxes for tooth info.</p>
            <div className="spacer-sm"></div>
          </>
        }

        <LoadingOverlay
          active={isLoading}
          spinner
          text='Loading predictions...'
        >
          <Xray 
            userImage={userImage}
            xrayData={processedImageResults}
            isProcessed={isProcessed}
            setProcessedImage={setProcessedImage}
          />
        </LoadingOverlay>

        {isProcessed && 
          <>
            <div className="spacer-sm"></div>
            
            <button 
              onClick={() => downloadButtonClick(userImage, processedImageResults.detections)} 
              className="process-button text-sm">
                Download
            </button>

            <div className="spacer-sm"></div>

            <CardDataTable 
              toothData={processedImageResults.detections}
            />
          </>
        }

        <div className="spacer-lg"></div>

      </div>
      <Footer />
    </>
  )
}

export default App
