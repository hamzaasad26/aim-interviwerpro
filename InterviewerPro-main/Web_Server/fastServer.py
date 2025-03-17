from liveImplementation import predictionFunc2, getFaceEmotion2
from parsing_sol import parsing_main

import os
import base64
import cv2
import numpy as np
import tempfile
import librosa

from pydub.utils import which


from fastapi import FastAPI,Request, File, UploadFile,HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

app = FastAPI()

app.add_middleware( # allow requests from the frontend
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)



@app.get('/')
async def hello_world():
    return 'It is what it is'

@app.get('/getQuestions')
async def getQuestion():
    return JSONResponse(content = {'questionsList':['Tell me about your past experience','How was your work with python','Is there anything you are passionate about?', 'What is your favorite color', 'What are your future goals']})

@app.post("/getAudioEmotion")
async def ret_aud_emotion(audio: UploadFile = File(...)):
    if not audio:
        raise HTTPException(status_code=400, detail="No audio file provided")

    # Save the uploaded file temporarily
    with tempfile.NamedTemporaryFile(delete=False, suffix='.webm') as temp_file:
        content = await audio.read()
        temp_file.write(content)
        temp_filename = temp_file.name

    try:
        # Load the audio file using librosa
        y, sr = librosa.load(temp_filename, sr=None, duration=2.5, offset=0.6)

        emotion = predictionFunc2(y, sr)
        return JSONResponse(content={
            'message': 'Audio processed successfully',
            'emotion': emotion
        }, status_code=200)

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    finally:
        # Clean up the temporary file
        os.unlink(temp_filename)

@app.post('/getVideoEmotion')
async def ret_emotion(request:Request):
    data = await request.json()
    img_src = data.get('img')

    if img_src is not None:
        base64_encoded_data = img_src.split(',')[1]
        decoded_data = base64.b64decode(base64_encoded_data)

        np_data = np.frombuffer(decoded_data, np.uint8)

        cv_image = cv2.imdecode(np_data, cv2.IMREAD_COLOR)
        
        # resized_cv_image = cv2.resize(cv_image,(700,500))
        
        # emotion = getFaceEmotion(resized_cv_image)
        emotion = getFaceEmotion2(cv_image)
        return JSONResponse(content = {'emotion': emotion}, status_code = 200)
    else:
        return JSONResponse(content={'emotion': 'None'}, status_code = 400)
    
@app.post("/uploadCV")
async def upload_cv(file: UploadFile = File(...)):
    try:
        os.makedirs("uploaded_cvs", exist_ok=True)
        
        file_path = f"uploaded_cvs/{file.filename}"
        with open(file_path, "wb") as buffer:
            content = await file.read()
            buffer.write(content)
        
        new_questions = parsing_main(file_path)
        return JSONResponse(content = {'questionsList':new_questions})
    except Exception as e:
        return {"error": str(e)}
