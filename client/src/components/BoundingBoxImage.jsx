import React, { useRef, useEffect } from "react";

const BoundingBoxImage = ({ imageUrl, boundingBoxes }) => {
  const imageRef = useRef(null);

  useEffect(() => {
    const drawBoundingBoxes = () => {
      const canvas = imageRef.current;
      const ctx = canvas.getContext("2d");

      // Create an image element to load the image
      const img = new Image();
      img.src = imageUrl;

      let origWidth = img.width;
      let origHeight = img.height;

      img.width = 1280;
      img.height = 640;

      let actualWidth = document.getElementById("result").offsetWidth,
        actualHeight = document.getElementById("result").offsetHeight;

      img.onload = () => {
        // Set canvas dimensions to match the image
        canvas.width = img.width;
        canvas.height = img.height;

        // Draw the image on the canvas
        ctx.drawImage(img, 0, 0, img.width, img.height);

        // Don't draw bboxes if we haven't predicted yet
        if (!boundingBoxes || !boundingBoxes.detections) return;

        boundingBoxes.detections.forEach((box) => {
          // Use percent to correctly adapt the coordinate to the scaled image
          let percentBx = 100 * (box.coordinates.x / origWidth),
            percentBy = 100 * (box.coordinates.y / origHeight),
            percentBw = (box.coordinates.width * 100) / origWidth,
            percentBh = (box.coordinates.height * 100) / origHeight;

          // then map the values to the current canvas
          let finalBx = (percentBx * img.width) / 100,
            finalBy = (percentBy * img.height) / 100,
            finalBw = (percentBw * img.width) / 100,
            finalBh = (percentBh * img.height) / 100;
  
          let strokeColor = "black"

          // Draw bounding boxes
          switch(box.disease){
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

          ctx.font = "600 16px Arial";
          ctx.strokeStyle = "black";
          ctx.lineWidth = 3;
          ctx.strokeText(box.disease, finalBx - finalBw / 2, finalBy - finalBh / 2 - 16);
          ctx.strokeText(box.tooth, finalBx - finalBw / 2, finalBy - finalBh / 2 - 2);
          ctx.fillStyle = strokeColor;
          ctx.fillText(box.disease, finalBx - finalBw / 2, finalBy - finalBh / 2 - 16);
          ctx.fillText(box.tooth, finalBx - finalBw / 2, finalBy - finalBh / 2 - 2);

          ctx.lineWidth = 2;
          ctx.strokeStyle = strokeColor;

          ctx.beginPath();
          ctx.rect(
            finalBx - finalBw / 2,
            finalBy - finalBh / 2,
            finalBw,
            finalBh
          );
          ctx.stroke();

          ctx.beginPath();
          ctx.rect(
            finalBx - finalBw / 2 - 1,
            finalBy + finalBh / 2,
            finalBw + 2,
            18
          );
          ctx.fill();

          ctx.font = "600 16px Arial";
          ctx.strokeStyle = "black";
          ctx.lineWidth = 3;
          let conf = "Conf: " + box.confidence.toFixed(2) * 100 + "%";
          ctx.strokeText(conf, finalBx + finalBw / 2 - ctx.measureText(conf).width - 2, finalBy + finalBh / 2 + 14);
          ctx.fillStyle = strokeColor;
          ctx.fillText(conf, finalBx + finalBw / 2 - ctx.measureText(conf).width - 2, finalBy + finalBh / 2 + 14);
        });
      };
    };

    drawBoundingBoxes();
  }, [imageUrl, boundingBoxes]);

  return <canvas id="result" ref={imageRef} />;
};

export default BoundingBoxImage;
