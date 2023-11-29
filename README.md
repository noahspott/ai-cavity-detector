# AI Cavity Detector
This web app allows the user to upload an x-ray image and provides an 
output image showing the areas of cavities.
<br/>
*This project was created for CMPSC 445 (Fall 2023) at PSU World Campus.*
<br/>
<br/>
**Project Team:**
- Michael Stanley
- Noah Spott
- Mason Ticehurst
- Keian Kaserman

## Project Requirements
### fr-01
The system should allow the user to upload an X-ray image or a folder of X-ray images.

### fr-02
The system should detect the location of cavities in the uploaded X-ray images.

### fr-03
The system should display the X-ray images with an indication of where the cavity is.

### fr-04
The system should allow the user to download the images with the cavity indicators.

### fr-05
The system should preprocess the uploaded images to enhance image quality, reduce noise, and prepare the image for the ML model.

## Setting Up Development Environment
### Client
1. Clone repository
   
2. Open project folder in terminal

3. npm install

4. npm run dev

5. Copy the Local or Network address and paste it into your web browser.

### Server
1. Open project folder in new terminal

2. Run
<pre>
python3 ./server/server.py
</pre>

## Demo
<p align="center">
  <img src="https://s5.gifyu.com/images/SRtsQ.gif" alt="animated" />
</p>