import { useState, useEffect} from 'react'
import Navigation from './components/Navigation.jsx';
import {Routes,Route,useNavigate} from 'react-router-dom';
import LandingPage from './components/LandingPage.jsx'
import Interview from './components/Interview.jsx';
import HomePage from './components/HomePage.jsx';
import GraphComponent from './components/GraphComponent.jsx';
import './app.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import './stylesheet/global.css';

function App() {

  const [pressed, setPressed] = useState(false);
  const [secondsVal,setSecondsVal] = useState(30);
  const [audioArr, setAudioArr] = useState(null);
  const [videoArr, setVideoArr] = useState(null);
  const [questions,setQuestions] = useState(null);
  const [allowGraph,setAllowGraph] = useState(false);
  const [voiceAllow,setVoiceAllow] = useState(false);

  let navigate = useNavigate();

  useEffect(()=>{
    
    navigate('/')

    return ()=>{
      
    }
    },[])
  
  return (
      <div className = "tw-w-screen tw-h-screen tw-mb-0 mainBackground tw-overflow-x-hidden">

        <Routes>
          <Route path = '/'
          element= {
            // <LandingPage setFunc = {setQuestions} />
            <HomePage setFunc = {setQuestions} />
          }/>
          <Route path = '/interview'
          element ={<>
            <Navigation />
            <Interview seconds = {secondsVal} setAud = {setAudioArr} setVid = {setVideoArr} questions = {questions}
            setAllowGraph = {setAllowGraph} voiceAllow = {voiceAllow} setVoiceAllow = {setVoiceAllow} />
            </>
          } />
          <Route path = '/graph'
          element = {
            <>
              <Navigation />
              {allowGraph?<GraphComponent audInfo = {audioArr} vidInfo = {videoArr}/> :''}
            </>
          } />

        </Routes>
      </div>
  )
}

export default App
