from flask import Flask, request, jsonify

app = Flask(__name__)

if __name__ == '__main__':
    app.run(debug=True)