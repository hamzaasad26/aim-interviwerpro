import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom';

function InterviewQuestions(props) {
    const [questionCounter, setQuestionCounter] = useState(1);
    const [responsesState, setResponsesState] = useState([]);
    const scrollRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        console.log('question Num ', questionCounter);
        if(questionCounter >= 4){
            props.setUnmount(true)
            console.log('set true')
        }

    }, [questionCounter, navigate])

    useEffect(() => {
        console.log(props.userResponse)
        if (props.userResponse) {
            let tempObject = {
                'val': props.userResponse,
                'type': 'user'
            }
            setResponsesState(prevState => [...prevState, tempObject]);
            setQuestionCounter(prevCounter => prevCounter + 1);
        }
    }, [props.userResponse])


    useEffect(() => {
        scrollToBottom();
    }, [responsesState, questionCounter]);

    const scrollToBottom = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    };

    const [dots, setDots] = useState('');

    useEffect(() => {
        const intervalId = setInterval(() => {
            setDots(prev => (prev.length >= 3 ? '' : prev + '.'));
        }, 500);

        return () => clearInterval(intervalId);
    }, []);


    if(props.unmount){
        return(<>
        </>)
    }
    else{
        return (
            <div ref={scrollRef} className='tw-flex-grow tw-overflow-y-auto tw-space-y-4 tw-p-4'>
                {props.queries.slice(0, questionCounter).map((item, index) => {
                    if (item.type === 'server') {
                        return (
                            <React.Fragment key={index}>
                                <div className="tw-flex tw-justify-end">
                                    <span className="tw-bg-green-600 tw-text-white tw-rounded-lg tw-p-3 tw-max-w-[75%]">
                                        {item.val}
                                    </span>
                                </div>
                                
                                <div className="tw-flex tw-justify-start">
                                    {responsesState[index] ? (
                                        <span className="tw-bg-blue-600 tw-text-white tw-rounded-lg tw-p-3 tw-max-w-[75%]">
                                            {responsesState[index].val}
                                        </span>
                                    ) : (
                                        <span className="tw-bg-gray-600 tw-text-white tw-rounded-full tw-p-2 tw-w-10 tw-h-10 tw-flex tw-items-center tw-justify-center">
                                            <span className="tw-text-center">{dots}</span>
                                        </span>
                                    )}
                                </div>
                            </React.Fragment>
                        )
                    }
                    return null;
                })}
            </div>
        )
    }
    
}

export default InterviewQuestions;