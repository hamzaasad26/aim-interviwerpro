import numpy as np
import pandas as pd
import matplotlib.pyplot as plt

import time

import tensorflow as tf
from tensorflow import keras

from tensorflow.keras.models import load_model
import soundfile as sf

from Utility import FeatureExtract,AudioProcessor,emotion_dict,normalize

import cv2

import scipy
from scipy import signal
import wave

import feat as ft



model = load_model('SelfNormalizationModel.keras')
# model2 = load_model('ver2_150.h5')


processor = AudioProcessor()

def predictionFunc(filePath):
    X= processor.process_dataset(filePath)
    min_val = np.min(X)
    range_val = np.max(X) - np.min(X)
    X[0] = np.array([normalize(X[0][i],min_val,range_val) for i in range(0,X.shape[1])])
    X = X.reshape((X.shape[0],X.shape[1],1,1))
    prediction = model.predict(X)
    index = np.argmax(prediction)
    
    return emotion_dict[index]

def resize_features(X, target_size=17496):
    current_size = X.shape[1]
    
    if current_size == target_size:
        return X
    elif current_size > target_size:
        # If current size is larger, we'll use truncation
        return X[:, :target_size, ...]
    else:
        # If current size is smaller, we'll use resampling
        resampled = np.zeros((X.shape[0], target_size, *X.shape[2:]))
        for i in range(X.shape[0]):
            resampled[i] = signal.resample(X[i], target_size, axis=0)
        return resampled
    
def predictionFunc2(audio_stream,sr):
    X= processor.process_dataset2(audio_stream,sr)
    X = resize_features(X, target_size=17496)
    
    min_val = np.min(X)
    range_val = np.max(X) - np.min(X)
    X[0] = np.array([normalize(X[0][i],min_val,range_val) for i in range(0,X.shape[1])])
    
    
    X = X.reshape((X.shape[0],X.shape[1],1,1))
    
    prediction = model.predict(X)
    index = np.argmax(prediction)
    
    return emotion_dict[index]


# emotion_labels = ['Angry', 'Disgusted', 'Afraid', 'Happy', 'Neutral', 'Sad', 'Surprise']
# def preprocess_input(x, v2=True):
#     x = x.astype('float32')
#     x = x / 255.0
#     if v2:
#         x = x - 0.5
#         x = x * 2.0
#     return x

# face_detector = cv2.FaceDetectorYN_create('./face_detection_yunet_2023mar.onnx',
#                           "", 
#                           (700, 500),
#                           score_threshold=0.5)
# # was 718 , 538

# def getFaceEmotion(frame_video):
#     ret,faces = face_detector.detect(frame_video)
#     if faces is not None:
#         for i in faces:
#             x=int(i[0])
#             y=int(i[1])
#             w=int(i[2])
#             h=int(i[3])
#             if x<0 or y<0 or w<0 or h<0:
#                 return 'None'
#             gray = cv2.cvtColor(frame_video, cv2.COLOR_BGR2GRAY)
#             roi_gray = gray[y:y+h, x:x+w]
#             roi_gray = cv2.resize(roi_gray, (48, 48))
#             roi_gray = cv2.GaussianBlur(roi_gray,(3,3),0)
#             roi_gray = preprocess_input(roi_gray)
#             roi_gray = roi_gray.reshape(1, 48, 48, 1)

#             prediction = model2.predict(roi_gray)
            
#             max_index = np.argmax(prediction)
            
#             emotion = emotion_labels[max_index]
            
#             return emotion
#     return 'None'


emo_names={
    0:'Angry',
    1:'Disgusted',
    2:'Afraid',
    3:'Happy',
    4:'Sad',
    5:'Surprise',
    6:'Neutral'
}

detector = ft.Detector(
    face_model="retinaface",
    landmark_model="mobilefacenet",
    au_model='svm',
    emotion_model="resmasknet",
    facepose_model="img2pose",
    )

def getFaceEmotion2(frame_video):
    
    try:
        faces = detector.detect_faces(frame_video)
        landmarks = detector.detect_landmarks(frame_video, faces)
        emotions=detector.detect_emotions(frame_video,faces,landmarks)
        return emo_names[np.argmax(emotions[0][0])]
    except:
        return "None"






    

