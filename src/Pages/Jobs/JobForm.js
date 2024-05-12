import React from 'react';
import axios from 'axios';
import { useState } from 'react';

import Cross from '../../Resources/Icons/x.png'
import Upload from '../../Resources/Icons/Upload.png'
import CV from '../../Resources/Icons/CV.png'
import { toast } from 'react-toastify';

const JobModel = ({ showModal, setShowModal, setUpdate, update }) => {

    const [formData, setFormData] = useState({
        company: '',
        category: '',
        position: '',
        location: '',
        period: '',
        qualification: '',
        amenities: '',
        permit: '',
        overtime: 0,
        available: true    
    });

    const handleAddJob = async () => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/job/addjob`, formData);
            setUpdate(!update);
        } catch (error) {
            console.error('Error adding Recruiter', error.message);
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
    };
    
    return (
        <>
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center py-10 overflow-x-hidden overflow-y-auto outline-none focus:outline-none sm:py-0">
                    <div className="fixed inset-0 bg-black opacity-50"></div>
                    <div className="relative max-w-screen-sm mx-auto my-6 min-w-fit m-screen">
                        <div className="relative flex flex-col w-full bg-white border-0 rounded-lg shadow-lg outline-none focus:outline-none">
                            <div className="flex items-center justify-between gap-10 p-5 border-b border-gray-200 border-solid rounded-t sm:px-10">
                                <img src={Cross} className='w-10 h-10 transition-all duration-200 cursor-pointer hover:scale-110' onClick={() => setShowModal(false)} />
                                <h className='text-xl font-bold sm:text-3xl'>Create Job Position</h>
                            </div>
                            <div className='flex flex-col sm:flex-row gap-10 px-10 sm:px-20 font-normal text-black w-fit bg-[#F8FAFB] py-10 pb-20'>
                                <div className='flex flex-col gap-3'>
                                    <div className='flex flex-col justify-end gap-2 w-[250px] sm:w-[200px] md:w-[250px] lg:w-[300px] text-right'>
                                        <label>Company</label>
                                        <input type='text' name='company' onChange={handleInputChange} className='w-full p-2 border-[2px] outline-gray-100 outline-[1px] border-gray-200 bg-white rounded' />
                                    </div>
                                    <div className='flex flex-col justify-end gap-2 w-[250px] sm:w-[200px] md:w-[250px] lg:w-[300px] text-right'>
                                        <label>Job Category</label>
                                        <input type='text' name='category' onChange={handleInputChange} className='w-full p-2 border-[2px] outline-gray-100 outline-[1px] border-gray-200 bg-white rounded' />
                                    </div>
                                    <div className='flex flex-col justify-end gap-2 w-[250px] sm:w-[200px] md:w-[250px] lg:w-[300px] text-right'>
                                        <label>Job Position</label>
                                        <input type='text' name='position' onChange={handleInputChange} className='w-full p-2 border-[2px] outline-gray-100 outline-[1px] border-gray-200 bg-white rounded' />
                                    </div>
                                    <div className='flex flex-col justify-end gap-2 w-[250px] sm:w-[200px] md:w-[250px] lg:w-[300px] text-right'>
                                        <label>Job Location</label>
                                        <input type='text' name='location' onChange={handleInputChange} className='w-full p-2 border-[2px] outline-gray-100 outline-[1px] border-gray-200 bg-white rounded' />
                                    </div>
                                </div>
                                <div className='flex flex-col gap-3'>
                                    <div className='flex flex-col justify-end gap-2 w-[250px] sm:w-[200px] md:w-[250px] lg:w-[300px] text-right'>
                                        <label>Period of Contract</label>
                                        <input type='text' name='period' onChange={handleInputChange} className='w-full p-2 border-[2px] outline-gray-100 outline-[1px] border-gray-200 bg-white rounded' />
                                    </div>
                                    <div className='flex flex-col justify-end gap-2 w-[250px] sm:w-[200px] md:w-[250px] lg:w-[300px] text-right'>
                                        <label>Qualification</label>
                                        <input type='text' name='qualification' onChange={handleInputChange} className='w-full p-2 border-[2px] outline-gray-100 outline-[1px] border-gray-200 bg-white rounded' />
                                    </div>
                                    <div className='flex flex-col justify-end gap-2 w-[250px] sm:w-[200px] md:w-[250px] lg:w-[300px] text-right'>
                                        <label>Food and Accommodation</label>
                                        <input type='text' name='amenities' onChange={handleInputChange} className='w-full p-2 border-[2px] outline-gray-100 outline-[1px] border-gray-200 bg-white rounded' />
                                    </div>
                                    <div className='flex flex-col justify-end gap-2 w-[250px] sm:w-[200px] md:w-[250px] lg:w-[300px] text-right'>
                                        <label>Resident permit</label>
                                        <input type='text' name='permit' onChange={handleInputChange} className='w-full p-2 border-[2px] outline-gray-100 outline-[1px] border-gray-200 bg-white rounded' />
                                    </div>
                                    <div className='flex flex-col justify-end gap-2 w-[250px] sm:w-[200px] md:w-[250px] lg:w-[300px] text-right'>
                                        <label>Overtime</label>
                                        <input type='text' name='overtime' onChange={handleInputChange} className='w-full p-2 border-[2px] outline-gray-100 outline-[1px] border-gray-200 bg-white rounded' />
                                    </div>
                                </div>
                                
                            </div>
                            <div className="flex items-center justify-between max-w-full p-4 border-t border-solid rounded-b border-Gray-200 sm:max-w-full">
                                <button
                                    className="px-5 sm:px-10 md:px-20 py-4 mb-1 mr-1 text-sm font-bold text-white bg-[#CA9731] bg-opacity-[75%] rounded-full uppercase transition-all duration-150 ease-linear outline-none background-transparent focus:outline-none"
                                    type="button"
                                    onClick={() => {
                                        if(!formData.company || !formData.amenities || !formData.category || !formData.location || !formData.overtime || !formData.period || !formData.permit || !formData.position || !formData.qualification)
                                        {
                                            toast.error('Fill all the Fields')
                                        } else {
                                            setShowModal(false); handleAddJob()
                                        }
                                    }}
                                >
                                    Add Job Position
                                </button>
                                <button
                                    className="px-5 sm:px-10 md:px-20 py-4 mb-1 mr-1 text-sm font-bold text-gray-400 bg-[#F8FAFB] rounded-full uppercase transition-all duration-150 ease-linear outline-none background-transparent focus:outline-none"
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default JobModel;
