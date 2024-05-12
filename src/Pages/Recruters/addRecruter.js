import React, { useEffect } from 'react';
import { useState } from 'react';
import axios from 'axios';

import Cross from '../../Resources/Icons/x.png'
import Upload from '../../Resources/Icons/Upload.png'
import CV from '../../Resources/Icons/CV.png'
import { toast } from 'react-toastify';

const Modal = ({ newRecruiterModelStep, setNewRecruiterModelStep, setNextStep, setThirdStep, newRecruiterFormData ,setNewRecruiterFormData, setPaymentMethod, questionaire }) => {

    function generateRandomString(length) {
        const characters = '0123456789';
        let randomString = 'EMP-'; // Initialize with 'EMP'
        for (let i = 3; i < length; i++) {
            randomString += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return randomString;
    }

    function handleGenerateRandomId() {
        const randomId = generateRandomString(8); // Change 10 to desired length
        setNewRecruiterFormData({
            ...newRecruiterFormData,
            id: randomId,
        });
    }

    useEffect(() => {
        handleGenerateRandomId();
    }, [newRecruiterModelStep]);


    
    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setNewRecruiterFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const hanldeClose = () => {
        setNewRecruiterFormData({
            firstName: '',
            lastName: '',
            email: '',
            passport: '',
            dateOfBirth: Date.now(),
            birthPlace: '',
            gender: '',
            nationality: '',
            issuance: Date.now(),
            expiry: Date.now(),
            id: '',
            coverLetter: '',
            status: 'Active',
            serviceFee: 30,
            progress: 0,
        })
        setNewRecruiterModelStep(false)
    }
    
    return (
        <>
            {newRecruiterModelStep && (
                <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
                    <div className="fixed inset-0 bg-black opacity-50"></div>
                    <div className="relative w-auto mx-auto my-6">
                        <div className="relative flex flex-col w-full bg-white border-0 rounded-lg shadow-lg outline-none focus:outline-none">
                            <div className="flex items-center justify-between gap-20 p-5 px-10 border-b border-solid rounded-t border-blueGray-200 bg-[#FFF500]">
                                <h3 className="text-xl font-bold text-black">Registration</h3>
                                <img src={Cross} className='w-10 h-10 transition-all duration-200 cursor-pointer hover:scale-110' onClick={() => hanldeClose()} />
                            </div>
                            <div className='flex flex-col gap-3 px-20 font-normal text-black w-fit bg-[#F8FAFB] py-10 pb-20 max-h-[70vh] overflow-auto'>
                                <div className='flex flex-row gap-20'>
                                    <div className='flex flex-col gap-2'>
                                        <div className='flex flex-col justify-end w-[300px] text-right'>
                                            <label>First Name</label>
                                            <input type='text' name='firstName' value={newRecruiterFormData?.firstName} onChange={handleInputChange} className='w-full p-2 border-[2px] outline-gray-100 outline-[1px] border-gray-200 bg-white rounded' placeholder='Enter Your First Name' />
                                        </div>
                                        <div className='flex flex-col justify-end  w-[300px] text-right'>
                                            <label>Last Name</label>
                                            <input type='text' name='lastName' value={newRecruiterFormData?.lastName} onChange={handleInputChange} className='w-full p-2 border-[2px] outline-gray-100 outline-[1px] border-gray-200 bg-white rounded' placeholder='Enter Your Last Name' />
                                        </div>
                                        <div className='flex flex-col justify-end w-[300px] text-right'>
                                            <label>Email</label>
                                            <input type='text' name='email' value={newRecruiterFormData?.email} onChange={handleInputChange} className='w-full p-2 border-[2px] outline-gray-100 outline-[1px] border-gray-200 bg-white rounded' placeholder='Enter Your Email ID' />
                                        </div>
                                    </div>
                                    <div className='relative w-[300px] min-h-full'>
                                        <div className='w-[68%] h-full bg-gray-300 rounded-full'></div>
                                        <img src={Upload} className='absolute bottom-0 w-20 cursor-pointer right-10 h-14' />
                                    </div>
                                </div>
                                <div className='flex flex-col gap-2'>
                                    <div className='flex flex-row gap-20'>
                                        <div className='flex flex-col justify-end w-[300px] text-right'>
                                            <label>Phone</label>
                                            <input type='text' name='phone' value={newRecruiterFormData?.phone} onChange={handleInputChange} className='w-full p-2 border-[2px] outline-gray-100 outline-[1px] border-gray-200 bg-white rounded' placeholder='Enter Your Phone Number' />
                                        </div>
                                        <div className='flex flex-col justify-end w-[300px] text-right'>
                                            <label>ID</label>
                                            <input type='text' readOnly name='id' value={newRecruiterFormData?.id} onChange={handleInputChange} className='w-full p-2 border-[2px] outline-gray-100 outline-[1px] border-gray-200 bg-white rounded' placeholder='Enter Your ID' />
                                        </div>
                                    </div>
                                    <div className='flex flex-row gap-20'>
                                        <div className='flex flex-col justify-end w-[300px] text-right'>
                                            <label>Date of Birth</label>
                                            <input type='date' name='dateOfBirth' value={newRecruiterFormData?.dateOfBirth} onChange={handleInputChange} className='w-full p-2 border-[2px] outline-gray-100 outline-[1px] border-gray-200 bg-white rounded' placeholder='' />
                                        </div>
                                        <div className={`flex flex-col justify-end w-[300px] text-right`}>
                                            <label>Questionary</label>
                                            <button onClick={() => {setNextStep(true); setNewRecruiterModelStep(false)}} type='text' name='' className={`w-full p-2 border-[2px] outline-gray-100 outline-[1px] border-gray-200  rounded hover:bg-gray-300 hover:scale-105 transition-all duration-300 ${ questionaire ? 'bg-green-500' : 'bg-red-300'}`}>Questionaire</button>
                                        </div>
                                    </div>
                                    <div className='flex flex-row items-start gap-20'>
                                        <div className='flex flex-col gap-2'>
                                            <div className='flex flex-col justify-end w-[300px] text-right'>
                                                <label>Place of Birth</label>
                                                <input type='text' name='birthPlace' value={newRecruiterFormData?.birthPlace} onChange={handleInputChange} className='w-full p-2 border-[2px] outline-gray-100 outline-[1px] border-gray-200 bg-white rounded' placeholder='' />
                                            </div>
                                            <div className='flex flex-col justify-end w-[300px] text-right'>
                                                <label htmlFor='gender'>Gender</label>
                                                <select id='gender' name='gender' value={newRecruiterFormData?.gender} onChange={handleInputChange} className='w-full p-2 border-[2px] outline-gray-100 outline-[1px] border-gray-200 bg-white rounded'>
                                                    <option>Select Gender</option>
                                                    <option value='male'>Male</option>
                                                    <option value='female'>Female</option>
                                                </select>
                                            </div>

                                            <div className='flex flex-col justify-end w-[300px] text-right'>
                                                <label>Nationality</label>
                                                <input type='text' name='nationality' value={newRecruiterFormData?.nationality} onChange={handleInputChange} className='w-full p-2 border-[2px] outline-gray-100 outline-[1px] border-gray-200 bg-white rounded' placeholder='' />
                                            </div>
                                            <div className='flex flex-col justify-end w-[300px] text-right'>
                                                <label>Passport Number</label>
                                                <input type='text' name='passport' value={newRecruiterFormData?.passport} onChange={handleInputChange} className='w-full p-2 border-[2px] outline-gray-100 outline-[1px] border-gray-200 bg-white rounded' placeholder='' />
                                            </div>
                                            <div className='flex flex-col justify-end w-[300px] text-right'>
                                                <label>Date of Issue</label>
                                                <input type='date' name='issuance' value={newRecruiterFormData?.issuance} onChange={handleInputChange} className='w-full p-2 border-[2px] outline-gray-100 outline-[1px] border-gray-200 bg-white rounded' placeholder='' />
                                            </div>
                                            <div className='flex flex-col justify-end w-[300px] text-right'>
                                                <label>Date of Expiry</label>
                                                <input type='date' name='expiry' value={newRecruiterFormData?.expiry} onChange={handleInputChange} className='w-full p-2 border-[2px] outline-gray-100 outline-[1px] border-gray-200 bg-white rounded' placeholder='' />
                                            </div>
                                        </div>
                                        <div className='flex flex-col gap-2'>
                                            <div className='flex flex-col justify-end w-[300px] text-right mt-6'>
                                                <textarea type='text' name='coverLetter' onChange={handleInputChange} className='w-full p-2 border-[2px] outline-gray-100 outline-[1px] border-gray-200 bg-white rounded min-h-[100px]' placeholder='Note' />
                                            </div>
                                            <div className='flex flex-col justify-end w-[300px] text-right'>
                                                <label>Service Fee</label>
                                                <input type='number' readOnly name='fee' value={newRecruiterFormData?.serviceFee} onChange={handleInputChange} className='w-full p-2 border-[2px] outline-gray-100 outline-[1px] border-gray-200 bg-white rounded' placeholder='' />
                                            </div>
                                            <div className='flex flex-col justify-start w-full gap-2 text-right'>
                                                <label>Select Payment Method</label>
                                                <div className='flex flex-row w-full gap-2'>
                                                    <input type='radio' readOnly name='payment' value='Cash' onClick={(e) => setPaymentMethod(e.target.value)}  placeholder='' />
                                                    <label>Cash</label>
                                                </div>
                                                <div className='flex flex-row w-full gap-2'>
                                                    <input type='radio' readOnly name='payment' value='Card' onClick={(e) => setPaymentMethod(e.target.value)}  placeholder='' />
                                                    <label>Card</label>
                                                </div>
                                                <div className='flex flex-row w-full gap-2'>
                                                    <input type='radio' readOnly name='payment' value='Bank Transfer' onClick={(e) => setPaymentMethod(e.target.value)}  placeholder='' />
                                                    <label>Bank Transfer</label>
                                                </div>
                                            </div>
                                            
                                        </div>
                                    </div>

                                </div>
                            </div>
                            <div className="flex items-center justify-between p-4 border-t border-solid rounded-b">
                                <button
                                    className="px-20 py-4 mb-1 mr-1 text-black text-md font-bold bg-[#FFF500] rounded uppercase transition-all duration-150 ease-linear outline-none background-transparent focus:outline-none"
                                    type="button"
                                    onClick={() => {
                                        if(newRecruiterFormData?.firstName && newRecruiterFormData?.lastName && newRecruiterFormData?.email 
                                            && newRecruiterFormData?.passport && newRecruiterFormData?.dateOfBirth
                                            && newRecruiterFormData?.birthPlace && newRecruiterFormData?.gender && newRecruiterFormData?.nationality
                                            && newRecruiterFormData?.issuance && newRecruiterFormData?.expiry) {
                                            setThirdStep(true);
                                            setNewRecruiterModelStep(false);
                                        } else {
                                            toast.error('Fill all the fields!')
                                        }
                                    }}
                                >
                                    Add Recruter
                                </button>
                                <button
                                    className="px-20 py-4 mb-1 mr-1 text-sm font-bold bg-[#F8FAFB] rounded uppercase transition-all duration-150 ease-linear outline-none background-transparent focus:outline-none"
                                    type="button"
                                    onClick={() => {hanldeClose()}}
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
