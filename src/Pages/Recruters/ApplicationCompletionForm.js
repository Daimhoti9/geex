import React from 'react';
import { useState } from 'react';
import axios from 'axios';

import Cross from '../../Resources/Icons/x.png'
import Upload from '../../Resources/Icons/Upload.png'
import CV from '../../Resources/Icons/CV.png'

const Modal = ({ newRecruiterModelStep, setNewRecruiterModelStep,newRecruiterFormData ,setNewRecruiterFormData }) => {


    // const handleAddRecruiter = async () => {
    //     try {
    //         console.log("sending data");
    //         const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/recruiter/addrecruiter`, formData);
    //         console.log("data sent");
    //     } catch (error) {
    //         console.error('Error adding Recruiter', error.message);
    //     }
    // };
    
    // const [formData, setFormData] = useState({
    //     firstName: '',
    //     lastName: '',
    //     email: '',
    //     id: '',
    //     mobile: '',
    //     coverLetter: '',
    //     status: 'Active',
    // });

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setNewRecruiterFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };
    const updateStatus = async () => {
        try {
            const formData = new FormData();
            formData.append("recuiterEmail", newRecruiterFormData.email);
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/recruiter/updateStatus`, formData);
        } catch (error) {
            console.error('Error uploading documents:', error.message);
        }
    }

    return (
        <>
            {newRecruiterModelStep && (
                <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
                    <div className="fixed inset-0 bg-black opacity-50"></div>
                    <div className="relative w-auto mx-auto my-6">
                        <div className="relative flex flex-col w-full bg-white border-0 rounded-lg shadow-lg outline-none focus:outline-none">
                            <div className="flex items-center justify-between gap-20 p-5 px-10 border-b border-solid rounded-t border-blueGray-200 bg-[#26CF86]">
                                <h3 className="text-xl font-bold text-white">Application Completed</h3>
                                <img src={Cross} className='w-10 h-10 transition-all duration-200 cursor-pointer hover:scale-110' onClick={() => setNewRecruiterModelStep(false)} />
                            </div>
                            <div className='flex flex-col gap-3 px-20 font-normal text-black w-fit bg-[#F8FAFB] py-10 pb-20 max-h-[70vh] overflow-auto'>
                                <div className='flex flex-row gap-20'>
                                    <div className='flex flex-col gap-2'>
                                        <div className='flex flex-col justify-end w-[300px] text-right'>
                                            <input type='text' name='firstName' value={newRecruiterFormData?.firstName} onChange={handleInputChange} className='w-full p-2 border-[2px] outline-gray-100 outline-[1px] border-gray-200 bg-white rounded' placeholder='Enter Your First Name' />
                                        </div>
                                        <div className='flex flex-col justify-end  w-[300px] text-right'>
                                            <input type='text' name='lastName' value={newRecruiterFormData?.lastName} onChange={handleInputChange} className='w-full p-2 border-[2px] outline-gray-100 outline-[1px] border-gray-200 bg-white rounded' placeholder='Enter Your Last Name' />
                                        </div>
                                        <div className='flex flex-col justify-end w-[300px] text-right'>
                                            <input type='text' name='email' value={newRecruiterFormData?.email} onChange={handleInputChange} className='w-full p-2 border-[2px] outline-gray-100 outline-[1px] border-gray-200 bg-white rounded' placeholder='Enter Your Email ID' />
                                        </div>
                                        <div className='flex flex-col w-[300px] text-right'>
                                            <input type='text' name='passport' value={newRecruiterFormData?.passport} onChange={handleInputChange} className='w-full p-2 border-[2px] outline-gray-100 outline-[1px] border-gray-200 bg-white rounded' placeholder='' />
                                        </div>
                                    </div>
                                    <div className='relative w-[300px] min-h-full'>
                                        <div className='w-[65%] h-full bg-gray-300 rounded-full'></div>
                                        <img src={Upload} className='absolute bottom-0 w-20 cursor-pointer right-10 h-14' />
                                        <div className='flex flex-col justify-end w-[300px] text-right'>
                                            <label>ID</label>
                                            <input type='text' name='id' readOnly value={newRecruiterFormData?.id} onChange={handleInputChange} className='w-full p-2 border-[2px] outline-gray-100 outline-[1px] border-gray-200 bg-white rounded' placeholder='Enter Your ID' />
                                        </div>
                                    </div>
                                </div>
                                <div className='flex flex-col gap-2'>
                                    <div className='flex flex-row gap-20'>
                                        
                                    </div>
                                    <div className='flex flex-row gap-20'>
                                        <div className='flex flex-col justify-end w-[300px] text-right'>
                                            <input type='Date' name='dateOfBirth' value={newRecruiterFormData?.passport} onChange={handleInputChange} className='w-full p-2 border-[2px] outline-gray-100 outline-[1px] border-gray-200 bg-white rounded' placeholder='' />
                                        </div>
                                    </div>
                                    <div className='flex flex-row items-start gap-20'>
                                        <div className='flex flex-col gap-2'>
                                            <div className='flex flex-col justify-end w-[300px] text-right'>
                                                <input type='text' name='birthPlace' value={newRecruiterFormData?.birthPlace} onChange={handleInputChange} className='w-full p-2 border-[2px] outline-gray-100 outline-[1px] border-gray-200 bg-white rounded' placeholder='' />
                                            </div>
                                            <div className='flex flex-col justify-end w-[300px] text-right'>
                                                <input type='text' name='gender' value={newRecruiterFormData?.gender} onChange={handleInputChange} className='w-full p-2 border-[2px] outline-gray-100 outline-[1px] border-gray-200 bg-white rounded' placeholder='' />
                                            </div>
                                            <div className='flex flex-col justify-end w-[300px] text-right'>
                                                <input type='text' name='nationality' value={newRecruiterFormData?.nationality} onChange={handleInputChange} className='w-full p-2 border-[2px] outline-gray-100 outline-[1px] border-gray-200 bg-white rounded' placeholder='' />
                                            </div>
                                            <div className='flex flex-col justify-end w-[300px] text-right'>
                                                <input type='date' name='issuance' value={newRecruiterFormData?.issuance} onChange={handleInputChange} className='w-full p-2 border-[2px] outline-gray-100 outline-[1px] border-gray-200 bg-white rounded' placeholder='' />
                                            </div>
                                            <div className='flex flex-col justify-end w-[300px] text-right'>
                                                <input type='date' name='expiry' value={newRecruiterFormData?.expiry} onChange={handleInputChange} className='w-full p-2 border-[2px] outline-gray-100 outline-[1px] border-gray-200 bg-white rounded' placeholder='' />
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                            <div className="flex items-center justify-between p-4 border-t border-solid rounded-b">
                                <button
                                    className="px-10 py-4 mb-1 mr-1 text-white text-sm font-bold bg-[#26CF86] rounded uppercase transition-all duration-150 ease-linear outline-none background-transparent focus:outline-none"
                                    type="button"
                                    onClick={() => {
                                        updateStatus();
                                        setNewRecruiterModelStep(false)
                                    }}
                                >
                                    Application Completed
                                </button>
                                <button
                                    className="px-20 py-4 mb-1 mr-1 text-sm font-bold bg-[#F8FAFB] rounded uppercase transition-all duration-150 ease-linear outline-none background-transparent focus:outline-none"
                                    type="button"
                                    onClick={() => setNewRecruiterModelStep(false)}
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
