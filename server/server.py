from flask import Flask, request, jsonify, send_file
from flask_cors import CORS, cross_origin
import sys

app = Flask(__name__)
CORS(app)
frontend_domain = 'http://192.168.0.124:5173/'
# cors = CORS(app, resources={r"/process": {"origins": frontend_domain}})

@app.route('/process', methods=['POST'])
@cross_origin()
def process_request():
    user_image = request.files['file']

    # Here is where we will process the image
    print(f'user_image: {user_image}')
    processed_user_image = process(user_image)
    
    # Then we should return the image
    # return send_file(processed_user_image, as_attachment=True, mimetype='image/png', download_name='processed_image.png')
    return 'Process Call Made'

def process(user_image):
    """Processes and returns the xray image"""
    processed_user_image = user_image

    return processed_user_image


if __name__ == '__main__':
    app.run(debug=True)