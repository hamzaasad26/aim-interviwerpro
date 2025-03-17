import feat as ft
import pandas as pd
import cv2
import numpy as np
import os

detector = ft.Detector(
    face_model="retinaface",
    landmark_model="mobilefacenet",
    au_model='svm',
    emotion_model="resmasknet",
    facepose_model="img2pose",
)

cap_cam = cv2.VideoCapture(0)

emo_names={
    0:'Angry',
    1:'Disgust',
    2:'Afraid',
    3:'Happy',
    4:'Sad',
    5:'Surprise',
    6:'Neutral'
}

i=0
while True:
    ret, frame = cap_cam.read()
    faces = detector.detect_faces(frame)
    landmarks = detector.detect_landmarks(frame, faces)
    emotions=detector.detect_emotions(frame,faces,landmarks)
    for emotion in emotions:
        cv2.putText(frame,emo_names[np.argmax(emotion)],(10,30),cv2.FONT_HERSHEY_SIMPLEX,1,(0,255,0),2,cv2.LINE_AA)
    cv2.imshow('Emotion Recognition',frame)

    if cv2.waitKey(1) & 0xFF==ord('q'):
        break

cap_cam.release()
cv2.destroyAllWindows()

