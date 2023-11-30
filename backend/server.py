#!/usr/bin/env python3
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS, cross_origin
from PIL import Image
from ML.predict_scripts.predict import runPrediction

app = Flask(__name__)
CORS(app, supports_credentials=True)

def process_image(input_image):
    """Processes and returns the xray image"""
    img = Image.open(input_image)
    return runPrediction(img)

@app.route('/process', methods=['POST'])
@cross_origin()
def process_request():

    if 'file' not in request.files:
        return "No file part in the request", 400

    file = request.files['file']

    if file.filename == '':
        return "No selected file", 400
    
    if file:
        return process_image(file)
    

if __name__ == '__main__':
    app.run()