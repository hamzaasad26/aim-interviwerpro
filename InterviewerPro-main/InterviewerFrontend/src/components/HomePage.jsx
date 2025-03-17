import React, {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { ReactTyped, Typed } from "react-typed";
import axios from 'axios';
import '../stylesheet/global.css'

const LoadingModal = () => (
    <div className="tw-fixed tw-inset-0 tw-bg-gray-600 tw-bg-opacity-50 tw-overflow-y-auto tw-h-full tw-w-full tw-flex tw-items-center tw-justify-center tw-z-10">
        <div className="tw-bg-white tw-p-8 tw-rounded-md tw-shadow-xl tw-max-w-md tw-w-full">
            <h2 className="tw-text-2xl tw-font-bold tw-mb-4 tw-text-center">Analyzing Your Resume</h2>
            <div className="tw-flex tw-justify-center tw-mb-4">
                <div className="tw-animate-spin tw-rounded-full tw-h-12 tw-w-12 tw-border-t-2 tw-border-b-2 tw-border-blue-500"></div>
            </div>
            <p className="tw-text-center tw-text-gray-600">
                Please wait while we process your resume. This may take a few moments.
            </p>
        </div>
    </div>
);





const HomePage = ({ setFunc }) => {
    let navigate = useNavigate();

    const [selectedFile, setSelectedFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const [typed, setTyped] = useState(null);

    const handleCVUpload = async (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedFile(file);
            console.log("File selected:", file.name);
            // Gotta add code here to send the file to server using axios  
            setIsLoading(true);
            const formData = new FormData();
            formData.append('file', file);

            try {
                const response = await axios.post('http://127.0.0.1:5000/uploadCV', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                console.log('File uploaded successfully:', response.data);
                setFunc(response.data)
                setIsLoading(false);
                navigate('/interview');
                // You can add additional logic here, such as showing a success message
            } catch (error) {
                console.error('Error uploading file:', error);
                // You can add error handling logic here, such as showing an error message
                setIsLoading(false);
            }
        }
    };

    const handleClick = async () => {
        const request_function = async () => {
            try {
                let resp = await axios.get('http://127.0.0.1:5000/getQuestions');
                console.log(resp.data);
                setFunc(resp.data)
            } catch (error) {
                console.error("Error fetching questions:", error);
            }
        }
        
        await request_function();
        navigate('/interview');
    }

    return (
        <div className="tw-relative tw-flex tw-flex-col tw-items-center tw-justify-center tw-min-h-screen tw-text-black tw-overflow-hidden" style={{background: '#222831'}}>

            <div className="tw-absolute tw-top-0 tw-left-0 tw-right-0 tw-overflow-hidden tw-w-screen">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="tw-w-full tw-h-auto tw-min-w-[100vw] portrait:tw-h-[]">
                    <path fill="#4ade80" fillOpacity="0.5" className="wave-top" d="M0,96L48,112C96,128,192,160,288,165.3C384,171,480,149,576,128C672,107,768,85,864,96C960,107,1056,149,1152,165.3C1248,181,1344,171,1392,165.3L1440,160L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"></path>
                </svg>
            </div>
            <div className="tw-absolute tw-top-0 tw-left-0 tw-right-0 tw-overflow-hidden tw-w-screen">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="tw-w-full tw-h-auto tw-min-w-[100vw]">
                    <path fill="#60a5fa" fillOpacity="0.5" className="wave-top" d="M0,160L48,170.7C96,181,192,203,288,202.7C384,203,480,181,576,165.3C672,149,768,139,864,154.7C960,171,1056,213,1152,218.7C1248,224,1344,192,1392,176L1440,160L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"></path>
                </svg>
            </div>

            <div className="tw-absolute tw-inset-x-0 tw-z-0 tw-bottom-0">
                <svg viewBox="0 0 1440 320" xmlns="http://www.w3.org/2000/svg" className="tw-w-full tw-h-full">
                    <defs>
                        <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#4ade80" />
                            <stop offset="100%" stopColor="#60a5fa" />
                        </linearGradient>
                    </defs>
                    <path 
                        fill="url(#waveGradient)" 
                        fillOpacity="0.7" 
                        className="wave-bottom"
                        d="M0,160 C320,300,420,10,740,160 C1060,300,1180,20,1440,160 V320 H0 Z"
                    />
                </svg>
            </div>

            {/* Content */}
            <div className="tw-z-10 tw-flex tw-flex-col tw-items-center">
                <h1 className="tw-text-6xl tw-font-bold tw-font-poppins tw-mb-4 tw-text-center tw-text-white">
                    Welcome to{' '}
                    <span className="tw-font-extrabold tw-text-transparent tw-bg-clip-text tw-bg-gradient-to-br tw-from-blue-400 tw-to-green-400"> 
                        InterviewPro
                    </span>
                </h1>
                <div className="tw-text-xl tw-mb-8 tw-text-center tw-text-white tw-max-w-2xl">
                    <ReactTyped
                        typedRef={setTyped}
                        strings={[
                            "Real-time audio and video emotion detection",
                            "Enhanced soft skills feedback",
                            "Improve your interview performance"
                        ]}
                        typeSpeed={40}
                        backSpeed={50}
                        loop
                    />
                </div>
                <div className="tw-flex tw-space-x-4">
                    <button 
                        type="button" 
                        onClick={handleClick}
                        className="tw-text-white tw-font-semibold tw-py-3 tw-px-8 tw-rounded-full tw-shadow-lg tw-transition-all tw-duration-300 tw-ease-in-out tw-transform hover:tw-scale-105 tw-bg-[length:400%_400%] hover:tw-bg-[length:100%_100%] tw-bg-[position:100%_100%] hover:tw-bg-[position:0%_0%]"
                        style={{
                            backgroundImage: 'linear-gradient(to bottom right, #4ade80, #60a5fa, #60a5fa, #4ade80)',
                        }}
                    >
                        Get Started
                    </button>
                    <label 
                        className="tw-text-white tw-font-semibold tw-py-3 tw-px-8 tw-rounded-full tw-shadow-lg tw-transition-all tw-duration-300 tw-ease-in-out tw-transform hover:tw-scale-105 tw-bg-[length:400%_400%] hover:tw-bg-[length:100%_100%] tw-bg-[position:100%_100%] hover:tw-bg-[position:0%_0%] tw-cursor-pointer tw-flex tw-items-center tw-justify-center tw-space-x-2"
                        style={{
                            backgroundImage: 'linear-gradient(to bottom right, #60a5fa, #4ade80, #4ade80, #60a5fa)',
                        }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="tw-h-5 tw-w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                        <span>Upload CV</span>
                        <input 
                            type="file" 
                            onChange={handleCVUpload} 
                            accept=".pdf,.doc,.docx"
                            className="tw-hidden"
                        />
                    </label>
                </div>
            </div>
            {isLoading && <LoadingModal />}
        </div>
    );
};

export default HomePage;