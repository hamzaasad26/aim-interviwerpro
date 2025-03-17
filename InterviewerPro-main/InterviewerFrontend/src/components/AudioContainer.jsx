import React from 'react'
import {useEffect,useState,useRef} from 'react';
import {MediaRecorder, register} from 'extendable-media-recorder';
import {useNavigate} from 'react-router-dom';


import axios from 'axios';


function AudioContainer(props) {

  let navigate = useNavigate();
  const [isRecording, setIsRecording] = useState(true);
  const [audioChunks, setAudioChunks] = useState([]);
  const mediaRecorderRef = useRef(null);
  const intervalRef = useRef(null);

  let emotions = useRef([]);

  useEffect(() => {
    startRecording();
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  useEffect(()=>{
    if(props.unmount){
      console.log('changed audio')
      setIsRecording(false);
      stopRecording();
      props.setFunc(emotions.current);
      props.setAllowGraph(true);
      navigate('/graph')
    }
  },[props.unmount])

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          setAudioChunks((chunks) => [...chunks, event.data]);
        }
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);

      intervalRef.current = setInterval(() => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
          mediaRecorderRef.current.stop();
          mediaRecorderRef.current.start();
        }
      }, 2500);
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setIsRecording(false);
  };

  useEffect(() => {
    if (audioChunks.length > 0) {
      const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
      sendAudioToBackend(audioBlob);
      setAudioChunks([]);
    }
  }, [audioChunks]);

  const sendAudioToBackend = async (audioBlob) => {
    const formData = new FormData();
    formData.append('audio', audioBlob, 'audio.webm');
  
    console.log('Audio blob size:', audioBlob.size);
    if(audioBlob.size>=10000){
      try {
        const response = await axios.post('http://127.0.0.1:5000/getAudioEmotion', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        //console.log('Audio sent successfully:', response.data);
        emotions.current.push(response.data.emotion)
      } catch (error) {
        console.error('Error sending audio to backend:', error);
        if (error.response) {
          console.error('Error data:', error.response.data);
          console.error('Error status:', error.response.status);
          console.error('Error headers:', error.response.headers);
        } else if (error.request) {
          // The request was made but no response was received
          console.error('Error request:', error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.error('Error message:', error.message);
        }
      }
    }
    
  };

  return (
    <> 
    </>
  );
};


export default AudioContainer;