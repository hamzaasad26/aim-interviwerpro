import React from 'react'
import {useState,useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import { Form, DropdownButton, Dropdown, Button } from 'react-bootstrap';
import { FaArrowRight } from "react-icons/fa";
import { IoIosTime } from "react-icons/io";
import { FaPerson } from "react-icons/fa6";
import axios from 'axios';


function LandingPage( props ) {
    const [titleState,setTitleState] = useState('Select Time');
    const [firstLoad,setFirstLoad] = useState(false);
    const navigate = useNavigate();

    const handleSelect = (eventKey) => {
        setTitleState(eventKey);
      };

    const handleClick = async ()=>{
        const request_function = async()=>{
            try {
                let resp = await axios.get('http://127.0.0.1:5000/getQuestions');
                console.log(resp.data);
                props.setFunc(resp.data)
            } catch (error) {
                console.error("Error fetching questions:", error);
            }
        }
        
        await request_function();
        navigate('/interview');
        
    }

    useEffect(()=>{
        setFirstLoad(true)
    },[])

    return (
        <div className = 'mainBody tw-grid tw-grid-cols-2'>
            
            <div className = 'firstPage1'>
                
            </div>
            <div className = {`firstPage2 tw-flex tw-items-center tw-justify-center ${firstLoad? 'loadedState': 'nonLoadingState'}`}>
                <div className = "tw-bg-clip-border tw-border-2 tw-pt-20 tw-pb-10 tw-pl-20 tw-pr-20 tw-rounded-3xl tw-border-solid landingDiv1 tw-diagonal-border">
                    <Form className = 'tw-flex tw-flex-col tw-justify-center tw-items-center'>
                        <Form.Group className="mb-3 tw-flex tw-justify-center tw-items-center tw-gap-2" controlId="formName">
                        <Form.Label className="tw-text-white tw-font-bold tw-flex tw-items-center">
                            <FaPerson className = 'tw-text-xl' />
                        </Form.Label>
                        <Form.Control type="text" placeholder="Enter your name" />
                        </Form.Group>

                        <Form.Group className="mb-3 tw-self-start tw-flex tw-justify-center tw-items-center tw-gap-2" controlId="formMinutes">
                            < IoIosTime className = 'tw-text-xl tw-text-white'/>
                            <DropdownButton
                            id="dropdown-basic-button"
                            title={titleState}
                            onSelect={handleSelect}
                            >
                            <Dropdown.Item eventKey="2 Minutes">30 Seconds</Dropdown.Item>
                            <Dropdown.Item eventKey="4 Minutes">5 Minutes</Dropdown.Item>
                            <Dropdown.Item eventKey="6 Minutes">10 Minutes</Dropdown.Item>

                        </DropdownButton>
                        </Form.Group>
                        <button type = "button" className = 'tw-mt-5 tw-self-end tw-bg-white tw-rounded-md tw-p-2 tw-flex tw-justify-center tw-items-center tw-border-1 tw-border-black buttonClass' onClick = {handleClick}>
                            Proceed
                            <FaArrowRight />
                        </button>
                    </Form>
                </div>
                </div>
            </div>
    )
    }

export default LandingPage