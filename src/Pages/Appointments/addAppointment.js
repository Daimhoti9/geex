import React from 'react';
import axios from "axios";
import { useState } from 'react';
import { toast } from 'react-toastify';

import Cross from '../../Resources/Icons/x.png'
import Upload from '../../Resources/Icons/Upload.png'
import CV from '../../Resources/Icons/CV.png'
import s3 from "../../Components/s3";

const Modal = ({ showModal, setShowModal, type, update, setUpdate }) => {

    const tpe = type;

    console.log('this is the appointment form', tpe);

    const [formData, setFormData] = useState({
        title: '',
        time: '',
        date: '',
        description: '',
        phone: '',
        email: '',
        name: '',
        surname: ''
    });
    
    const handleInputChange = (e) => {
        const {name, value} = e.target;
        console.log(name, value);
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };
    
    const handleAddAppointment = async () => {
        try {
            console.log("sending data");
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/appointment/addappointment`, {formData, type});
            setUpdate(!update)
            console.log("data sent");
        } catch (error) {
            console.error('Error fetching employee details:', error.message);
        }
    };

    return (
        <>
            {showModal && (
                <div className="fixed z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none inset-y-5 inset-2 sm:inset-y-0 sm:inset-0 focus:outline-none">
                    <div className="fixed inset-0 bg-black opacity-50"></div>
                    <div className="relative w-auto mx-auto my-6">
                        <div className="relative flex flex-col w-full bg-white border-0 rounded-lg shadow-lg outline-none focus:outline-none">
                            <div className="flex items-center justify-between gap-5 p-5 px-5 border-b border-solid rounded-t border-blueGray-200">
                                <img src={Cross} className='w-10 h-10 transition-all duration-200 cursor-pointer hover:scale-110' onClick={() => setShowModal(false)} />
                            </div>
                            <div className='flex flex-row gap-10 px-20 font-normal text-black w-fit bg-[#F8FAFB] py-10 pb-20'>
                                <div className='flex flex-col gap-3 w-[50%]'>
                                    <div className='flex flex-col gap-1'>
                                        <label>Title of Appointment</label>
                                        <input type='text' name='title' onChange={handleInputChange} className='w-full p-2 border-[2px] outline-gray-100 outline-[1px] border-gray-200 bg-white rounded' placeholder='' />
                                    </div>
                                    <div className='flex flex-row gap-3'>
                                        <div className='flex flex-col gap-1'>
                                            <label>Time</label>
                                            <input type='time' name='time' onChange={handleInputChange} className='w-full p-2 border-[2px] outline-gray-100 outline-[1px] border-gray-200 bg-white rounded' placeholder='' />
                                        </div>
                                        <div className='flex flex-col gap-1'>
                                            <label>Date</label>
                                            <input type='date' name='date' onChange={handleInputChange} className='w-full p-2 border-[2px] outline-gray-100 outline-[1px] border-gray-200 bg-white rounded' placeholder='' />
                                        </div>
                                    </div>
                                    <div className='flex flex-col gap-1'>
                                        <label>Phone</label>
                                        <input type='text' name='phone' onChange={handleInputChange} className='w-full p-2 border-[2px] outline-gray-100 outline-[1px] border-gray-200 bg-white rounded' placeholder='' />
                                    </div>
                                    <div className='flex flex-col gap-1'>
                                        <label>Email</label>
                                        <input type='text' name='email' onChange={handleInputChange} className='w-full p-2 border-[2px] outline-gray-100 outline-[1px] border-gray-200 bg-white rounded' placeholder='' />
                                    </div>
                                    <div className='flex flex-col gap-1'>
                                        <label>Description</label>
                                        <textarea type='text' name='description' onChange={handleInputChange} className='w-full p-2 border-[2px] outline-gray-100 outline-[1px] border-gray-200 bg-white rounded' placeholder='' />
                                    </div>
                                </div>
                                <div className='flex flex-col gap-3 w-[50%]'>
                                    
                                    <div className='flex flex-col gap-1'>
                                        <label>Name</label>
                                        <input type='text' name='name' onChange={handleInputChange} className='w-full p-2 border-[2px] outline-gray-100 outline-[1px] border-gray-200 bg-white rounded' placeholder='' />
                                    </div>
                                    <div className='flex flex-col gap-1'>
                                        <label>Surname</label>
                                        <input type='text' name='surname' onChange={handleInputChange} className='w-full p-2 border-[2px] outline-gray-100 outline-[1px] border-gray-200 bg-white rounded' placeholder='' />
                                    </div>
                                </div>
                    
                            </div>
                            <div className="flex items-center justify-between p-4 border-t border-solid rounded-b border-blueGray-200">
                                <button
                                    className="px-20 py-4 mb-1 mr-1 text-sm font-bold text-white bg-[#CA9731] bg-opacity-[75%] rounded uppercase transition-all duration-150 ease-linear outline-none background-transparent focus:outline-none"
                                    type="button"
                                    onClick={() => {setShowModal(false); handleAddAppointment() }}
                                >
                                    Save
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
