import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InterviewQuestions from './InterviewQuestions';
import VideoContainer from './VideoContainer';
import AudioContainer from './AudioContainer';
import useSpeechToText from '../hooks/useSpeechToText';

function Interview(props) {
  const [textInput, setTextInput] = useState('');
  const [userResponse, setUserResponse] = useState('');
  const [shouldUnmount, setShouldUnmount] = useState(false);
  const audRef = useRef(null);
  const navigate = useNavigate();

  const { isListening, transcript, startListening, stopListening } = useSpeechToText({ continuous: true});

  const stopVoiceInput = () => {
    const newText = textInput + (transcript.length ? (textInput.length ? ' ' : '') + transcript : '');
    setTextInput('');
    setUserResponse(newText);
    stopListening();
  };

  const startStopListening = () => {
    isListening ? stopVoiceInput() : startListening();
  };

  const testArr2 = props.questions.questionsList.slice(0, props.questions.questionsList.length - 1).map(question => ({
    'val': question,
    'type': 'server'
  }));

  useEffect(() => {
    console.log('Change Detected  ', userResponse);
  }, [userResponse]);

  return (
    <div className="tw-container tw-mx-auto tw-px-4 tw-py-8 tw-bg-gray-900 tw-min-h-screen">
      <div className="tw-grid tw-grid-cols-1 lg:tw-grid-cols-2 tw-gap-8">
        <div className="tw-flex tw-flex-col tw-space-y-4">
          <div className="tw-h-[500px]"> {/* This constrains the VideoContainer */}
            <VideoContainer seconds={props.seconds} setFunc={props.setVid} setAllowGraph={props.setAllowGraph} unmount = {shouldUnmount} voiceFunc = {props.setVoiceAllow} />
          </div>
            <AudioContainer seconds={props.seconds} setFunc={props.setAud} ref={audRef} unmount = {props.voiceAllow} setAllowGraph={props.setAllowGraph} />
        </div>
        <div className="tw-bg-gray-800 tw-rounded-lg tw-shadow-xl tw-p-6 tw-flex tw-flex-col tw-h-[500px]">
          <h2 className="tw-text-3xl tw-font-bold tw-mb-4 tw-text-center tw-bg-gradient-to-r tw-from-blue-400 tw-to-purple-500 tw-text-transparent tw-bg-clip-text">
            Interview Questions
          </h2>
          <InterviewQuestions queries={testArr2} userResponse={userResponse} setUnmount = {setShouldUnmount} unmount = {shouldUnmount} />
        </div>
      </div>
      
      <div className="tw-mt-8 tw-flex tw-flex-col md:tw-flex-row tw-items-center tw-justify-center tw-space-y-4 md:tw-space-y-0 md:tw-space-x-4">
        <button 
          className={`tw-px-6 tw-py-3 tw-rounded-full tw-font-semibold tw-text-white tw-transition-colors tw-duration-300 ${
            isListening ? 'tw-bg-red-600 tw-hover:tw-bg-red-700' : 'tw-bg-green-600 tw-hover:tw-bg-green-700'
          }`}
          onClick={startStopListening}
        >
          {isListening ? 'Stop Recording' : 'Start Recording'}
        </button>
        <textarea
          className="tw-w-full md:tw-w-1/2 tw-h-24 tw-px-4 tw-py-2 tw-rounded-lg tw-border-2 tw-border-gray-600 focus:tw-border-blue-500 tw-transition-colors tw-duration-300 tw-bg-gray-700 tw-text-white"
          disabled={isListening}
          value={isListening ? textInput + (transcript.length ? (textInput.length ? ' ' : '') + transcript : '') : ''}
          onChange={(e) => setTextInput(e.target.value)}
          placeholder="Your answer will appear here..."
        />
      </div>
    </div>
  );
}

export default Interview;