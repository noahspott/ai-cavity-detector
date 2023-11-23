import React, { useEffect, useState } from 'react'
import BoundingBoxImage from './BoundingBoxImage'

export default function Xray(props) {

    // Let's assume we get a JSON object  from props
    // that contains the model output
    // we can parse that data and generate the appropriate number of 
    // p-tags to display the x-ray analysis info

    // props
    //      userImage   - File object from user input
    //      xrayData    - data produced by model 

    const [imageSrc, setImageSrc] = useState(null);

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
    
    return(
        <div id='xray-container' width='40%'>
            {imageSrc && <BoundingBoxImage imageUrl={imageSrc} boundingBoxes={props.xrayData} />}
        </div>
    )
}