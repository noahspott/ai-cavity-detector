from flask import Flask, request, jsonify, send_file
from flask_cors import CORS, cross_origin
import sys
from io import BytesIO
from PIL import Image
# import ML.train_scripts.predict as predict
from ML.train_scripts.predict import runPrediction
import base64

app = Flask(__name__)
CORS(app, supports_credentials=True)

def process_image(input_image):
    """Processes and returns the xray image"""
    img = Image.open(input_image)
    
    
    # processed_img = img.resize((50, 50))    # for testing w/o ML model
    processed_img, results_data = runPrediction(img)

    return processed_img

@app.route('/process', methods=['POST'])
@cross_origin()
def process_request():

    if 'file' not in request.files:
        return "No file part in the request", 400

    file = request.files['file']

    if file.filename == '':
        return "No selected file", 400
    
    if file:
        processed_img, results_data = process_image(file)

        # Save the processed image to a byte buffer
        img_byte_array = BytesIO()
        processed_img.save(img_byte_array, format='PNG')
        img_byte_array.seek(0)
        
        b64encoded_img = base64.b64encode(img_byte_array)
        response = {
            'img': b64encoded_img,
            'results_data': results_data
        }

        return jsonify(response)
        #return send_file(img_byte_array, mimetype='image/png')
    

if __name__ == '__main__':
    app.run()