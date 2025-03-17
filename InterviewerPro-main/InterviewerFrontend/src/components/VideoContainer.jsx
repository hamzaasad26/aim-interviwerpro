import React, { useRef, useState, useEffect, useCallback } from 'react';
import Webcam from 'react-webcam';
import axios from 'axios';

function VideoContainer({ setFunc, setAllowGraph, seconds,unmount, voiceFunc }) {

  const [countup, setCountup] = useState(0);

  let webRef = useRef(null);
    const [imgSrc, setImgSrc] = useState(null);
    const [mount,setMount] = useState(false);

    let promises = useRef([]);
    let emotions = useRef([]);
    let intervalIds = useRef([]);


    const capture = React.useCallback(() => {
      if(unmount===false){
          const imageSrc = webRef.current.getScreenshot();
          if(imageSrc){
              setImgSrc(imageSrc);
          }
      }
      }, [webRef, setImgSrc]);

    useEffect(()=>{
        const interval = setInterval( ()=> {
            if(mount===false){
                capture();
                setMount(true)
            }
            else{
              if(unmount===false){
                if(imgSrc){
                  let resp = axios.post('http://127.0.0.1:5000/getVideoEmotion', { img: imgSrc })
                  promises.current.push(resp)
                }  
              }
            }
    }, 1000);
    intervalIds.current.push(interval);
    },[imgSrc,mount])


      useEffect(() => {
        const countdownInterval = setInterval(() => {
          setCountup((prev) => (prev+1));
        }, 1000);

        return () => {
          clearInterval(countdownInterval);    
        };
      }, []);

      useEffect(()=>{
        if(unmount){
          console.log('changing videos')
          Promise.any(
            promises.current.map((item) => 
              item.then(data => {
                emotions.current.push(data.data.emotion);
              })
            )
          ).then(() => {
            console.log(emotions.current);
            setFunc(emotions.current);
            intervalIds.current.forEach(id => clearInterval(id));
            intervalIds.current = [];
            voiceFunc(true);
            //setAllowGraph(true);
          }).catch(error => {
            console.error("Error processing promises:", error);
          }); // was after return statement below

          //voiceFunc(true);
          
        }
      },[unmount])

  return (
    <div className="tw-bg-gray-900 tw-rounded-lg tw-shadow-xl tw-overflow-hidden tw-flex tw-flex-col tw-h-full">
      <div className="tw-relative tw-flex-grow tw-h-5/6">
        <Webcam
          ref={webRef}
          screenshotFormat="image/jpeg"
          className="tw-w-full tw-h-full tw-object-cover"
          disabled = {unmount}
        />
        <div className="tw-absolute tw-top-4 tw-right-4 tw-bg-black tw-bg-opacity-50 tw-text-white tw-px-3 tw-py-1 tw-rounded-full tw-text-sm tw-font-semibold">
          {countup}s
        </div>
      </div>
      <div className="tw-bg-gray-800 tw-p-4">
        <h2 className="tw-text-xl tw-font-bold tw-text-white tw-mb-2">Video Feed</h2>
        <p className="tw-text-gray-300 tw-text-sm">
          Your video is being analyzed for emotions. Please ensure you're in frame and well-lit.
        </p>
      </div>
    </div>
  );
}

export default VideoContainer;