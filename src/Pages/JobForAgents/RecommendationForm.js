import React from 'react';
import axios from 'axios';
import { useState } from 'react';

import Cross from '../../Resources/Icons/x.png'
import Upload from '../../Resources/Icons/Upload.png'
import CV from '../../Resources/Icons/CV.png'

const JobModel = ({ showModal, setShowModal }) => {

    const [formData, setFormData] = useState({
        companyName: "",
        businessUniqueNumber: "",
        contactPerson: "",
        address: "",
        city: "",
        zipCode: "",
        employee: "",
        jobProfile: "",
        fromDate: "",
        toDate: "",
        recommendingEmail: ""
    });

    function getCurrentDateTimeString() {
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
        const day = currentDate.getDate().toString().padStart(2, '0');
        const hours = currentDate.getHours().toString().padStart(2, '0');
        const minutes = currentDate.getMinutes().toString().padStart(2, '0');
        const seconds = currentDate.getSeconds().toString().padStart(2, '0');
        const milliseconds = currentDate.getMilliseconds().toString().padStart(3, '0');
        return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}Z`;
    }
    const handleAddJob = async () => {
        try {
            const user = sessionStorage.getItem('user');
            const dataToSend = { ...formData, recommendingEmail: user , creationDate:getCurrentDateTimeString()};
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/notification/addnotification`, dataToSend);
            console.log('Notification added successfully:', response.data);
        } catch (error) {
            console.error('Error adding Notification:', error.message);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        console.log(name, value);
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

                                <h className='bg-[#FDCF8B] px-5 py-2 rounded-xl font-bold'>Recommend Job Position</h>
                                <img src={Cross} className='w-10 h-10 transition-all duration-200 cursor-pointer hover:scale-110' onClick={() => setShowModal(false)} />
                            </div>
                            <div className='flex flex-col sm:flex-col gap-10 px-10 sm:px-20 font-normal text-black w-fit bg-[#F8FAFB] py-10 pb-20 max-h-[70vh] overflow-auto'>
                                <div className='flex flex-row'>
                                    <div className='w-[200px] h-full items-start justify-start'>
                                        <labal>Step 1</labal>
                                    </div>
                                    <div className='flex flex-col gap-3 p-10 bg-white shadow-inner rounded-xl'>
                                        <div className='flex flex-col gap-1'>
                                            <labal>Company Name</labal>
                                            <input type='text'
                                                name='companyName'
                                                value={formData.companyName}
                                                onChange={handleInputChange}
                                                className='outline-none border-[1px] border-gray-300 rounded-xl p-2 w-[300px]' />
                                        </div>
                                        <div className='flex flex-row justify-between w-full gap-5'>
                                            <div className='flex flex-col gap-1'>
                                                <labal>Business Unique Number</labal>
                                                <input
                                                    type='text'
                                                    name='businessUniqueNumber'
                                                    value={formData.businessUniqueNumber}
                                                    onChange={handleInputChange}

                                                    className='outline-none border-[1px] border-gray-300 rounded-xl p-2 w-[300px]' />
                                            </div>
                                            <div className='flex flex-col gap-1'>
                                                <labal>Contact Person</labal>
                                                <input type='text'
                                                    name='contactPerson'
                                                    value={formData.contactPerson}
                                                    onChange={handleInputChange}

                                                    className='outline-none border-[1px] border-gray-300 rounded-xl p-2 w-[300px]' />
                                            </div>
                                        </div>
                                        <div className='flex flex-row gap-5'>
                                            <div className='flex flex-col gap-1'>
                                                <labal>Address</labal>
                                                <input type='text'
                                                    name='address'
                                                    value={formData.address}
                                                    onChange={handleInputChange}

                                                    className='outline-none border-[1px] border-gray-300 rounded-xl p-2 w-[200px]' />
                                            </div>
                                            <div className='flex flex-col gap-1'>
                                                <labal>City</labal>
                                                <input type='text'
                                                    name='city'
                                                    value={formData.city}
                                                    onChange={handleInputChange}

                                                    className='outline-none border-[1px] border-gray-300 rounded-xl p-2 w-[200px]' />
                                            </div>
                                            <div className='flex flex-col gap-1'>
                                                <labal>Zip Code</labal>
                                                <input type='text'
                                                    name='zipCode'
                                                    value={formData.zipCode}
                                                    onChange={handleInputChange}

                                                    className='outline-none border-[1px] border-gray-300 rounded-xl p-2 w-[200px]' />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className='flex flex-row'>
                                    <div className='w-[200px] h-full items-start justify-start'>
                                        <labal>Step 2</labal>
                                    </div>
                                    <div className='flex flex-col gap-3 p-10 bg-white shadow-inner rounded-xl'>
                                        <div className='flex flex-row justify-between w-full gap-5'>
                                            <div className='flex flex-col gap-1'>
                                                <labal>Employee</labal>
                                                <input type='text'
                                                    name='employee'
                                                    value={formData.employee}
                                                    onChange={handleInputChange}

                                                    className='outline-none border-[1px] border-gray-300 rounded-xl p-2 w-[300px]' />
                                            </div>
                                            <div className='flex flex-col gap-1'>
                                                <labal>Job Profile</labal>
                                                <input type='text'
                                                    name='jobProfile'
                                                    value={formData.jobProfile}
                                                    onChange={handleInputChange}

                                                    className='outline-none border-[1px] border-gray-300 rounded-xl p-2 w-[300px]' />
                                            </div>
                                        </div>
                                        <div className='flex flex-row justify-between w-full gap-5'>
                                            <div className='flex flex-col gap-1'>
                                                <labal>From</labal>
                                                <input type='text'
                                                    name='fromDate'
                                                    value={formData.fromDate}
                                                    onChange={handleInputChange}

                                                    className='outline-none border-[1px] border-gray-300 rounded-xl p-2 w-[300px]' />
                                            </div>
                                            <div className='flex flex-col gap-1'>
                                                <labal>To</labal>
                                                <input type='text'
                                                    name='toDate'
                                                    value={formData.toDate}
                                                    onChange={handleInputChange}

                                                    className='outline-none border-[1px] border-gray-300 rounded-xl p-2 w-[300px]' />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                            <div className="flex items-center justify-between max-w-full p-4 border-t border-solid rounded-b border-Gray-200 sm:max-w-full">
                                <button
                                    className="px-5 sm:px-10 md:px-20 py-4 mb-1 mr-1 text-sm font-bold text-white bg-[#CA9731] bg-opacity-[75%] rounded-full uppercase transition-all duration-150 ease-linear outline-none background-transparent focus:outline-none"
                                    type="button"
                                    onClick={() => { setShowModal(false); handleAddJob() }}
                                >
                                    Recommend Job Position
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
