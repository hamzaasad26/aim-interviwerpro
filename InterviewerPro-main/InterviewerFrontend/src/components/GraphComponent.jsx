import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import {useEffect,useRef, useState} from 'react';


let vid_emotions = [
  {emotion: 'Angry', count:1},
  {emotion: 'Disgusted', count:1},
  {emotion: 'Afraid', count:1},
  {emotion: 'Happy', count:1},
  {emotion: 'Neutral', count:1},
  {emotion: 'Sad', count:1},
  {emotion: 'Surprised', count:1}
]

let aud_emotions = [
  {emotion: 'Angry', count:1},
  {emotion: 'Disgust', count:1},
  {emotion: 'Fearful', count:1},
  {emotion: 'Happy', count:1},
  {emotion: 'Neutral', count:1},
  {emotion: 'Sad', count:1},
  {emotion: 'Surprise', count:1},
  {emotion: 'Calm', count:1}
]

function GraphComponent(props){

  const [videoTimeData, setVideoTimeData] = useState([]);
  const [audioTimeData, setAudioTimeData] = useState([]);

  useEffect(() => {
    
    if(props.audInfo){
      // Process audInfo
      Object.values(props.audInfo).forEach(emotion => {
        const emotionObj = aud_emotions.find(e => e.emotion === emotion);
        if (emotionObj) {
          emotionObj.count+=5; // scaled cause less data
        }
      });
    }
    

    if(props.vidInfo){
      // Process vidInfo
      Object.values(props.vidInfo).forEach(emotion => {
        const emotionObj = vid_emotions.find(e => e.emotion === emotion);
        if (emotionObj) {
          emotionObj.count++;
        }
      });
    }
    

    console.log('Updated aud_emotions:', aud_emotions);
    console.log('Updated vid_emotions:', vid_emotions);

    if (props.vidInfo) {
      const newVideoData = {
        time: videoTimeData.length + 1,
        positive: 0,
        negative: 0
      };
      
      Object.values(props.vidInfo).forEach(emotion => {
        if (['Neutral', 'Happy'].includes(emotion)) {
          newVideoData.positive++;
        } else {
          newVideoData.negative++;
        }
      });
      
      setVideoTimeData(prevData => [...prevData, newVideoData]);
    }

    if (props.audInfo) {
      const newAudioData = {
        time: audioTimeData.length + 1,
        positive: 0,
        negative: 0
      };
      
      Object.values(props.audInfo).forEach(emotion => {
        if (['Neutral', 'Calm', 'Happy'].includes(emotion)) {
          newAudioData.positive += 5; // scaled because less data
        } else {
          newAudioData.negative += 5; // scaled because less data
        }
      });
      
      setAudioTimeData(prevData => [...prevData, newAudioData]);
    }


  }, [props.audInfo, props.vidInfo]);
  return (
    <div className="tw-flex tw-flex-col tw-items-center tw-mt-10">
      <div className="tw-flex tw-flex-row tw-justify-center tw-items-start tw-w-full">
        {/* Existing Radar Charts */}
        <div className="tw-flex tw-flex-col tw-items-center tw-w-1/2">
          <h2 className="tw-text-lg tw-font-bold tw-mb-4 tw-text-white">Video Emotions</h2>
          <ResponsiveContainer width="100%" height={400}>
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={vid_emotions}>
              <PolarGrid />
              <PolarAngleAxis dataKey="emotion" />
              <PolarRadiusAxis />
              <Radar name="Video Emotions" dataKey="count" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        <div className="tw-flex tw-flex-col tw-items-center tw-w-1/2">
          <h2 className="tw-text-lg tw-font-bold tw-mb-4 tw-text-white">Audio Emotions</h2>
          <ResponsiveContainer width="100%" height={400}>
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={aud_emotions}>
              <PolarGrid />
              <PolarAngleAxis dataKey="emotion" />
              <PolarRadiusAxis />
              <Radar name="Audio Emotions" dataKey="count" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* New Line Charts */}
      <div className="tw-flex tw-flex-row tw-justify-center tw-items-start tw-w-full tw-mt-10">
        <div className="tw-flex tw-flex-col tw-items-center tw-w-1/2">
          <h2 className="tw-text-lg tw-font-bold tw-mb-4 tw-text-white">Video Emotions Over Time</h2>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={videoTimeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="positive" stroke="#82ca9d" />
              <Line type="monotone" dataKey="negative" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="tw-flex tw-flex-col tw-items-center tw-w-1/2">
          <h2 className="tw-text-lg tw-font-bold tw-mb-4 tw-text-white">Audio Emotions Over Time</h2>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={audioTimeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="positive" stroke="#82ca9d" />
              <Line type="monotone" dataKey="negative" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default GraphComponent;