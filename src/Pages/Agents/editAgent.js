import React, { useEffect } from 'react';
import { useState } from 'react';
import axios from 'axios';

import Cross from '../../Resources/Icons/x.png'
import Upload from '../../Resources/Icons/Upload.png'
import CV from '../../Resources/Icons/CV.png'

const Modal = ({ showModal, setShowModal, agent, setUpdate, update }) => {

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        id: '',
        mobile: '',
        premium: true
    });

    const fetchAgent =  async() => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/agent/getagent/${agent._id}`);
            setFormData(response.data);
        } catch (error) {
            console.error('Error Fetching the Agent: ', error.message);
        }
    }

    useEffect(() =>{
            fetchAgent()
    }, [agent])
    
    const handleEditAgent =  async() => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/agent/editagent/${agent._id}`, formData);
            setUpdate(!update)
        } catch (error) {
            console.error('Error deleting the Agent: ', error.message);
        }
    }

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };
    
    return (
        <>
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
                    <div className="fixed inset-0 bg-black opacity-50"></div>
                    <div className="relative w-auto mx-auto my-6">
                        <div className="relative flex flex-col w-full bg-white border-0 rounded-lg shadow-lg outline-none focus:outline-none">
                            <div className="flex items-center justify-between gap-20 p-5 px-10 border-b border-solid rounded-t border-blueGray-200">
                                <img src={Cross} className='w-10 h-10 transition-all duration-200 cursor-pointer hover:scale-110' onClick={() => setShowModal(false)} />
                                <h3 className="text-xl font-bold text-black">Edit Agent</h3>
                            </div>
                            <div className='flex flex-col gap-3 px-20 font-normal text-black w-fit bg-[#F8FAFB] py-10 pb-20'>
                                <div className='flex flex-row gap-20'>
                                    <div className='flex flex-col gap-3'>
                                        <div className='flex flex-col justify-end gap-2 w-[300px] text-right'>
                                            <label>First Name</label>
                                            <input type='text' value={formData.firstName} name='firstName' onChange={handleInputChange} className='w-full p-2 border-[2px] outline-gray-100 outline-[1px] border-gray-200 bg-white rounded' placeholder='Enter Your First Name' />
                                        </div>
                                        <div className='flex flex-col justify-end gap-2 w-[300px] text-right'>
                                            <label>Last Name</label>
                                            <input type='text' value={formData.lastName} name='lastName' onChange={handleInputChange} className='w-full p-2 border-[2px] outline-gray-100 outline-[1px] border-gray-200 bg-white rounded' placeholder='Enter Your Last Name' />
                                        </div>
                                    </div>
                                    <div className='relative w-[300px] min-h-full'>
                                        <div className='w-[58%] h-full bg-gray-300 rounded-full'></div>
                                        <img src={Upload} className='absolute bottom-0 w-20 cursor-pointer right-10 h-14' />
                                    </div>
                                </div>
                                <div className='flex flex-col gap-3'>
                                    <div className='flex flex-row gap-20'>
                                        <div className='flex flex-col justify-end gap-2 w-[300px] text-right'>
                                            <label>Email ID</label>
                                            <input type='text' value={formData.email} name='email' onChange={handleInputChange} className='w-full p-2 border-[2px] outline-gray-100 outline-[1px] border-gray-200 bg-white rounded' placeholder='Enter Your Email ID' />
                                        </div>
                                        <div className='flex flex-col justify-end gap-2 w-[300px] text-right'>
                                            <label>ID</label>
                                            <input type='text' value={formData.id} name='id' onChange={handleInputChange} className='w-full p-2 border-[2px] outline-gray-100 outline-[1px] border-gray-200 bg-white rounded' placeholder='Enter Your ID' />
                                        </div>
                                    </div>
                                    <div className='flex flex-row items-start gap-20'>
                                        <div className='flex flex-col gap-3'>
                                            <div className='flex flex-col justify-end gap-2 w-[300px] text-right'>
                                                <label>Phone</label>
                                                <input type='text' name='mobile' value={formData.mobile} onChange={handleInputChange} className='w-full p-2 border-[2px] outline-gray-100 outline-[1px] border-gray-200 bg-white rounded' placeholder='Enter Your Mobile No' />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center justify-between p-4 border-t border-solid rounded-b border-blueGray-200">
                                <button
                                    className="px-20 py-4 mb-1 mr-1 text-sm font-bold text-white bg-[#CA9731] bg-opacity-[75%] rounded uppercase transition-all duration-150 ease-linear outline-none background-transparent focus:outline-none"
                                    type="button"
                                    onClick={() => {setShowModal(false); handleEditAgent()}}
                                >
                                    Save Agent
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
