import React, { useEffect, useState } from 'react'
import { Tooltip as ReactTooltip } from "react-tooltip";

export default function Xray(props) {

    const [imageSrc, setImageSrc] = useState(null);
    const [windowSize, setWindowSize] = useState({
      width: window.innerWidth,
      height: window.innerHeight,
    });
    
    useEffect(() => {
      if (props.userImage) {
        // Read the File object as a data URL
        const reader = new FileReader();
        reader.onload = () => {
          // Set the data URL as the image source
          setImageSrc(reader.result);
        };
        reader.readAsDataURL(props.userImage);
      }
    }, [props.userImage]);
    
    // Force re-render predictions after window resize so our bounding boxes also resize accordingly
    useEffect(() => {
      const handleResize = () => {
        setWindowSize({
          width: window.innerWidth,
          height: window.innerHeight,
        })
      }
      
      window.addEventListener('resize', handleResize)

      return () => {
        window.removeEventListener('resize', handleResize)
      }
    }, []);

    return(
        <div id='xray-container' width='30%' style={{position: 'relative', margin: 0, padding: 0}}>
          
            {imageSrc && <img src={imageSrc} style={{width: '100%'}} id="xray-img"/>}

            {props.xrayData && props.xrayData.detections && props.xrayData.detections.map(r => {
              var origWidth = document.getElementById("xray-img").naturalWidth
              var origHeight = document.getElementById("xray-img").naturalHeight

              let percentBx = 100 * (r.coordinates.x / origWidth),
              percentBy = 100 * (r.coordinates.y / origHeight),
              percentBw = (r.coordinates.width * 100) / origWidth,
              percentBh = (r.coordinates.height * 100) / origHeight;

              var curWidth = document.getElementById("xray-img").offsetWidth
              var curHeight = document.getElementById("xray-img").offsetHeight

              // then map the values to the current canvas
              let finalBx = (percentBx * curWidth) / 100,
              finalBy = (percentBy * curHeight) / 100,
              finalBw = (percentBw * curWidth) / 100,
              finalBh = (percentBh * curHeight) / 100;

              finalBx -= finalBw / 2;
              finalBy -= finalBh / 2;
              
              var strokeColor;

              // Draw bounding boxes
              switch(r.disease){
                case("Impacted"):
                  strokeColor = "#43AA8B"
                  break;
                case("Caries"):
                  strokeColor = "#FF6F59"
                  break;
                case("Deep Caries"):
                  strokeColor = "#E9153C"
                  break;
                case("Periapical Lesion"):
                default:
                  strokeColor = "#9649CB"
              }

              return (<>
                <div className="bounding-box" data-tooltip-id={r.tooth} style={{
                  position: 'absolute',
                  border: 'solid',
                  borderRadius: '3px',
                  borderWidth: '2px',
                  borderColor: strokeColor,
                  width: finalBw,
                  height: finalBh,
                  left: finalBx,
                  top: finalBy
                }}/>
                {/* Description box for affected teeth */}
                <ReactTooltip
                  id = {r.tooth}
                  style={{zIndex: 99}}
                  place = "top"
                >
                  <div style={{fontSize: '0.5rem'}}>{r.tooth}</div>
                  <div style={{fontSize: '1rem'}}>{r.disease}</div>
                </ReactTooltip>
              </>)
            })}
        </div>
    )
}