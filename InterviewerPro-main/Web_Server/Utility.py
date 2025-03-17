
import librosa
import numpy as np

import tensorflow as tf
from tensorflow import keras

from tensorflow.keras.models import load_model


class FeatureExtract:
    def __init__(self,frame_length=2048,hop_length=512):
        self.frame_length = frame_length
        self.hop_length = hop_length
    def zcr(self,data):
        return librosa.feature.zero_crossing_rate(data,frame_length = self.frame_length, hop_length = self.hop_length).flatten()
    def rmse(self,data):
        return librosa.feature.rms(y=data,frame_length = self.frame_length, hop_length = self.hop_length).flatten()
    def mfcc(self, data,sr, n_mfcc=13, flatten = True):
        mfcc_features = librosa.feature.mfcc(y=data, sr=sr, n_mfcc = n_mfcc, hop_length= self.hop_length)
        return mfcc_features.T.flatten() if flatten else mfcc_features.T
    def chroma(self,data,sr):
        chroma_features = librosa.feature.chroma_stft(y=data,sr=sr,hop_length = self.hop_length)
        return chroma_features.T.flatten()
    def spectral_contrast(self,data,sr):
        contrast_features = librosa.feature.spectral_contrast(y=data,sr=sr,hop_length=self.hop_length)
        return contrast_features.T.flatten()
    def mel_spectrogram(self, data,sr):
        mel_features = librosa.feature.melspectrogram(y=data,sr=sr,hop_length = self.hop_length)
        return librosa.power_to_db(mel_features).flatten()
    def extract_features(self,data,sr):
        zcr_features = self.zcr(data)
        rmse_features = self.rmse(data)
        mfcc_features = self.mfcc(data,sr)
        chroma_features = self.chroma(data,sr)
        spectral_contrast_features = self.spectral_contrast(data,sr)
        mel_spectrogram_features = self.mel_spectrogram(data,sr)
        return np.concatenate(
            [
                zcr_features,
                rmse_features,
                mfcc_features,
                chroma_features,
                spectral_contrast_features,
                mel_spectrogram_features
            ]
        )
        
class AudioProcessor:
    def __init__(self, frame_length=2048, hop_length=512):
        self.feature_extractor = FeatureExtract(frame_length, hop_length)

    def get_features(self, path, duration=2.5, offset=0.6):
        data, sr = librosa.core.load(path, duration=duration, offset=offset)
        
        features = [self.feature_extractor.extract_features(data, sr)]

        return np.array(features)
    
    def get_features2(self,audio_stream,sr,duration = 2.5, offset = 0.6):

        features = [self.feature_extractor.extract_features(audio_stream,sr)]
        
        return np.array(features)

    def process_feature(self, path):
        features = self.get_features(path)
        X = features
        return X
    
    def process_features2(self, audioFile,sr):
        features = self.get_features2(audioFile,sr)
        X = features
        return X

    def process_dataset(self, paths):

        results = self.process_feature(paths)

        X = np.array(results)

        # Padding or truncating sequences to the same length
        max_len = len(X)
        # X = np.array([np.pad(x, (0, max_len - len(x)), 'constant') if len(x) < max_len else x[:max_len] for x in X])
        if len(X) < max_len:
            X = np.pad(X,(0,max_len-len(X)), 'constant')
        else:
            X = X[:max_len]
            
        return X

    def process_dataset2(self, audioFile,sr):

        results = self.process_features2(audioFile,sr)

        X = np.array(results)

        # Padding or truncating sequences to the same length
        max_len = len(X)
        # X = np.array([np.pad(x, (0, max_len - len(x)), 'constant') if len(x) < max_len else x[:max_len] for x in X])
        if len(X) < max_len:
            X = np.pad(X,(0,max_len-len(X)), 'constant')
        else:
            X = X[:max_len]
            
        return X
    
    
emotion_dict = {
    0:'Angry',1:'Calm',2:'Disgust',3:'Fearful',4:'Happy',
    5:'Neutral',6:'Sad',7:'Surprise'
}


def normalize(val,min_val,range_val):
    return (val-min_val) / range_val


