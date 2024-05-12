import React from 'react';
import axios from "axios";
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

import Cross from '../../Resources/Icons/x.png'
import Upload from '../../Resources/Icons/Upload.png'
import CV from '../../Resources/Icons/CV.png'
import s3 from "../../Components/s3";

const Modal = ({ showModal, setShowModal, update, setUpdate }) => {

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        id: '',
        mobile: '',
        image: '',
        agentType: 'International (B) Agent',
    });

    function generateRandomString(length) {
        const characters = '0123456789';
        let randomString = 'AG-'; // Initialize with 'EMP'
        for (let i = 3; i < length; i++) {
            randomString += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return randomString;
    }

    function handleGenerateRandomId() {
        const randomId = generateRandomString(8); // Change 10 to desired length
        setFormData({
            ...formData,
            id: randomId,
        });
    }

    useEffect(() => {
        handleGenerateRandomId();
    }, [showModal]);

    const handleAddAgent = async () => {
        try {
            console.log("sending data");
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/agent/addagent`, formData);
            setUpdate(!update)
            console.log("data sent");
        } catch (error) {
            console.error('Error fetching employee details:', error.message);
        }
    };
    
    const handleInputChange = (e) => {
        const {name, value} = e.target;
        console.log(name, value);
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };
    const handleStatusChange = (name, value) => {
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
        console.log(formData.premium);
    };

    const handleImageChange = (e) => {
        setFormData({...formData,image:e.target.files[0]});

    }

    const handleImageUpload = () => {
        const blob = formData.image;
        const params = {
            Body: blob,
            Bucket: `${process.env.REACT_APP_SPACES_NAME}`,
            Key: 'Agents/'+blob.name
        };
        // Sending the file to the Spaces
        s3.putObject(params)
            .on('build', request => {
                request.httpRequest.headers.Host = `${process.env.REACT_APP_SPACES_BUCKET}`;
                request.httpRequest.headers['Content-Length'] = blob.size;
                request.httpRequest.headers['Content-Type'] = blob.type;
                request.httpRequest.headers['x-amz-acl'] = 'public-read';
            })
            .send((err) => {
                if (err) {
                    // If there is an error sending the file to the Spaces
                    console.error(err);
                }
                else {
                    // If there is no error updating the editor with the imageUrl
                    const imageUrl = `${process.env.REACT_APP_SPACES_BUCKET}` + blob.name
                    console.log(imageUrl, blob.name)
                }
            });
    }
    
    return (
        <>
            {showModal && (
                <div className="fixed z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none inset-y-5 inset-2 sm:inset-y-0 sm:inset-0 focus:outline-none">
                    <div className="fixed inset-0 bg-black opacity-50"></div>
                    <div className="relative w-auto mx-auto my-6">
                        <div className="relative flex flex-col w-full bg-white border-0 rounded-lg shadow-lg outline-none focus:outline-none">
                            <div className="flex items-center justify-between gap-5 p-5 px-5 border-b border-solid rounded-t border-blueGray-200">
                                <div className='flex flex-row gap-2'>
                                    <span onClick={(e) => handleStatusChange('agentType', 'International (B) Agent')} name='agentType' value='International (B) Agent' className={`rounded-full shadow-md py-2 px-5 cursor-pointer ${formData.agentType == 'International (B) Agent' ? 'bg-[#CA9731] bg-opacity-[75%] text-white' : 'bg-white bg-opacity-100'}`}>International (B) Agent</span>
                                    <span onClick={(e) => handleStatusChange('agentType', 'International (P) Agent')} name='agentType' value='International (P) Agent' className={`rounded-full shadow-md py-2 px-5 cursor-pointer ${formData.agentType == 'International (P) Agent' ? 'bg-[#CA9731] bg-opacity-[75%] text-white' : 'bg-white bg-opacity-100'}`}>International (P) Agent</span>
                                    <span onClick={(e) => handleStatusChange('agentType', 'Local (B) Agent')} name='agentType' value='Local (B) Agent' className={`rounded-full shadow-md py-2 px-5 cursor-pointer ${formData.agentType == 'Local (B) Agent' ? 'bg-[#CA9731] bg-opacity-[75%] text-white' : 'bg-white bg-opacity-100'}`}>Local (B) Agent</span>
                                    <span onClick={(e) => handleStatusChange('agentType', 'Local (P) Agent')} name='agentType' value='Local (P) Agent' className={`rounded-full shadow-md py-2 px-5 cursor-pointer ${formData.agentType == 'Local (P) Agent' ? 'bg-[#CA9731] bg-opacity-[75%] text-white' : 'bg-white bg-opacity-100'}`}>Local (P) Agent</span>
                                </div>
                                <img src={Cross} className='w-10 h-10 transition-all duration-200 cursor-pointer hover:scale-110' onClick={() => setShowModal(false)} />
                            </div>
                            <div className='flex flex-col gap-3 px-20 font-normal text-black w-fit bg-[#F8FAFB] py-10 pb-20'>
                                <div className='flex flex-col-reverse gap-10 sm:gap-20 sm:flex-row'>
                                    <div className='flex flex-col gap-3'>
                                        <div className='flex flex-col justify-end gap-2 w-[300px] sm:w-[200px] md:w-[250px] lg:w-[300px] text-right'>
                                            <label>First Name</label>
                                            <input type='text' name='firstName' onChange={handleInputChange} className='w-full p-2 border-[2px] outline-gray-100 outline-[1px] border-gray-200 bg-white rounded' placeholder='Enter Your First Name' />
                                        </div>
                                        <div className='flex flex-col justify-end gap-2 w-[300px] sm:w-[200px] md:w-[250px] lg:w-[300px] text-right'>
                                            <label>Last Name</label>
                                            <input type='text' name='lastName' onChange={handleInputChange} className='w-full p-2 border-[2px] outline-gray-100 outline-[1px] border-gray-200 bg-white rounded' placeholder='Enter Your Last Name' />
                                        </div>
                                    </div>
                                    <div className='relative min-h-full w-[300px] sm:w-[200px] md:w-[250px] lg:w-[300px]'>
                                        {
                                            formData.image ? <img src={URL.createObjectURL(formData.image)}
                                                                  className='w-48 h-48 rounded-full'/> :
                                                <div className='w-[130px] h-[130px] md:w-[150px] md:h-[150px] lg:w-[200px] lg:h-[200px] bg-gray-300 rounded-full'></div>
                                        }

                                        <input onChange={handleImageChange} type={'file'} className='absolute bottom-0 hidden w-full cursor-pointer h-14' id='image' />
                                        <img onClick={()=>{
                                            document.getElementById('image').click();
                                        }} src={Upload} className='absolute bottom-0 w-20 cursor-pointer right-10 h-14' />
                                    </div>
                                </div>
                                <div className='flex flex-col gap-3'>
                                    <div className='flex flex-col gap-3 sm:gap-20 sm:flex-row'>
                                        <div className='flex flex-col justify-end gap-2 w-[300px] sm:w-[200px] md:w-[250px] lg:w-[300px] text-right'>
                                            <label>Email ID</label>
                                            <input type='text' name='email' onChange={handleInputChange} className='w-full p-2 border-[2px] outline-gray-100 outline-[1px] border-gray-200 bg-white rounded' placeholder='Enter Your Email ID' />
                                        </div>
                                        <div className='flex flex-col justify-end gap-2 w-[300px] sm:w-[200px] md:w-[250px] lg:w-[300px] text-right'>
                                            <label>ID</label>
                                            <input type='text' name='id' readOnly value={formData.id} onChange={handleInputChange} className='w-full p-2 border-[2px] outline-gray-100 outline-[1px] border-gray-200 bg-white rounded' placeholder='Enter Your ID' />
                                        </div>
                                    </div>
                                    <div className='flex flex-col items-start gap-3 sm:flex-row sm:gap-20'>
                                        <div className='flex flex-col gap-3'>
                                            <div className='flex flex-col justify-end gap-2 w-[300px] sm:w-[200px] md:w-[250px] lg:w-[300px] text-right'>
                                                <label>Phone</label>
                                                <input type='text' name='mobile' onChange={handleInputChange} className='w-full p-2 border-[2px] outline-gray-100 outline-[1px] border-gray-200 bg-white rounded' placeholder='Enter Your Mobile No' />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center justify-between p-4 border-t border-solid rounded-b border-blueGray-200">
                                <button
                                    className="px-20 py-4 mb-1 mr-1 text-sm font-bold text-white bg-[#CA9731] bg-opacity-[75%] rounded uppercase transition-all duration-150 ease-linear outline-none background-transparent focus:outline-none"
                                    type="button"
                                    onClick={() => {setShowModal(false); handleAddAgent()}}
                                >
                                    Add Agent
                                </button>




                                <button
                                    className="px-20 py-4 mb-1 mr-1 text-sm font-bold text-gray-400 bg-[#F8FAFB] rounded uppercase transition-all duration-150 ease-linear outline-none background-transparent focus:outline-none"
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default Modal;
