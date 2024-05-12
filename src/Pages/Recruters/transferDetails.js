import React from 'react';
import axios from 'axios';
import { useState, useEffect } from 'react';

import Cross from '../../Resources/Icons/x.png'
import Upload from '../../Resources/Icons/Upload.png'
import CV from '../../Resources/Icons/CV.png'
import Jobs from '../../Pages/Jobs';

const Modal = ({ transferModal, setTransferModal, recruiterId }) => {

    const [job, setJob] = useState({
        company: '',
        category: '',
        position: '',
        location: '',
        period: '',
        qualification: '',
        amenities: '',
        permit: '',
        overtime: '',
    });
    const [recruiter, setRecruiter] = useState({
        id: '',
        firstName: '',
        lastName: '',
        email: '',
        mobile: '',
        status: 'Inactive',
        coverLetter: '',
        dateEdited: Date.now(),
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (recruiterId) {
                    // Fetch recruiter details
                    const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/recruiter/getrecruiter/${recruiterId}`);
                    setRecruiter(response.data)
                    const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/job/getjob/${response.data.job}`);
                    setJob(res.data)
                    console.log(recruiter, job);
                } 
            } catch (error) {
                console.error('Error fetching details:', error);
            }
        };
        if (recruiter) {
            fetchData();
        }
    }, [recruiterId]);
    
    return (
        <>
            {transferModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
                    <div className="fixed inset-0 bg-black opacity-50"></div>
                    <div className="relative w-auto mx-auto my-6">
                        <div className="relative flex flex-col w-full bg-white border-0 rounded-lg shadow-lg outline-none focus:outline-none">
                            <div className="flex items-center justify-between gap-20 p-5 px-10 border-b border-solid rounded-t border-blueGray-200">
                                <img src={Cross} className='w-10 h-10 transition-all duration-200 cursor-pointer hover:scale-110' onClick={() => setTransferModal(false)} />
                                <h3 className="text-xl font-bold text-black">Transfero</h3>
                            </div>
                            <div className='px-10 pt-5 bg-[#F8FAFB]'>
                                <div className='w-[150px] h-[150px] bg-gray-300 rounded-full'></div>
                            </div>
                            <div className='flex flex-row gap-28 px-10 font-normal text-black w-fit py-5 pb-10 bg-[#F8FAFB]'>
                                <div className='flex flex-col gap-5'>
                                    <div className='flex flex-col gap-3'>
                                        <div className='flex flex-col justify-end gap-2 w-[300px] text-right'>
                                            <label>Full Name</label>
                                            <input readOnly value={recruiter.firstName} className='w-full p-2 border-[2px] outline-gray-100 outline-[1px] border-gray-200 bg-white rounded' placeholder='Select Recruiter' />
                                                
                                        </div>
                                        <div className='flex flex-col justify-end gap-2 w-[300px] text-right'>
                                            <label>Email ID</label>
                                            <input readOnly type='text' name='email' value={recruiter.email} className='w-full p-2 border-[2px] outline-gray-100 outline-[1px] border-gray-200 bg-white rounded' placeholder='Enter Your Email ID' />
                                        </div>
                                        <div className='flex flex-col justify-end gap-2 w-[300px] text-right'>
                                            <label>Mobile No</label>
                                            <input readOnly type='text' name='mobile' value={recruiter.mobile} className='w-full p-2 border-[2px] outline-gray-100 outline-[1px] border-gray-200 bg-white rounded' placeholder='Enter Phone' />
                                        </div>
                                    </div>
                                </div>
                                <div className='flex flex-col gap-3'>
                                    <div className='flex flex-col justify-end gap-2 w-[300px] text-right'>
                                        <label>Company</label>
                                        <input readOnly type='text' name='jobCategory' value={job.company} className='w-full p-2 border-[2px] outline-gray-100 outline-[1px] border-gray-200 bg-white rounded' />                
                                    </div>
                                    <div className='flex flex-col justify-end gap-2 w-[300px] text-right'>
                                        <label>Job Category</label>
                                        <input readOnly type='text' name='jobCategory' value={job.category} className='w-full p-2 border-[2px] outline-gray-100 outline-[1px] border-gray-200 bg-white rounded' placeholder='Manufacturing and Production' />
                                    </div>
                                    <div className='flex flex-col justify-end gap-2 w-[300px] text-right'>
                                        <label>Job Position</label>
                                        <input readOnly type='text' name='jobPosition' value={job.position} className='w-full p-2 border-[2px] outline-gray-100 outline-[1px] border-gray-200 bg-white rounded' placeholder='Manager' />
                                    </div>
                                    <div className='flex flex-col justify-end gap-2 w-[300px] text-right'>
                                        <label>Job Location</label>
                                        <input readOnly type='text' name='jobLocation' value={job.location} className='w-full p-2 border-[2px] outline-gray-100 outline-[1px] border-gray-200 bg-white rounded' placeholder='ALBANIA' />
                                    </div>
                                </div>
                                <div className='flex flex-col gap-3'>
                                    <div className='flex flex-col justify-end gap-2 w-[300px] text-right'>
                                        <label>Period of Contract</label>
                                        <input readOnly type='text' name='period' value={job.period} className='w-full p-2 border-[2px] outline-gray-100 outline-[1px] border-gray-200 bg-white rounded'  />
                                    </div>
                                    <div className='flex flex-col justify-end gap-2 w-[300px] text-right'>
                                        <label>Qualification</label>
                                        <input readOnly type='text' name='qualification' value={job.qualification} className='w-full p-2 border-[2px] outline-gray-100 outline-[1px] border-gray-200 bg-white rounded'  />
                                    </div>
                                    <div className='flex flex-col justify-end gap-2 w-[300px] text-right'>
                                        <label>Food and Accommodation</label>
                                        <input readOnly type='text' name='foodAndAcc' value={job.amenities} className='w-full p-2 border-[2px] outline-gray-100 outline-[1px] border-gray-200 bg-white rounded' />
                                    </div>
                                    <div className='flex flex-col justify-end gap-2 w-[300px] text-right'>
                                        <label>Pesident Permit</label>
                                        <input readOnly type='text' name='permit' value={job.permit} className='w-full p-2 border-[2px] outline-gray-100 outline-[1px] border-gray-200 bg-white rounded' />
                                    </div>
                                    <div className='flex flex-col justify-end gap-2 w-[300px] text-right'>
                                        <label>Over Time</label>
                                        <input readOnly type='text' name='overTime' value={job.overtime} className='w-full p-2 border-[2px] outline-gray-100 outline-[1px] border-gray-200 bg-white rounded' />
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center justify-end p-4 px-10 border-t border-solid rounded-b border-blueGray-200">
                                <button
                                    className="px-28 py-4 mb-1 mr-1 text-sm font-bold text-gray-400 bg-[#F8FAFB] hover:bg-slate-300 rounded-full uppercase transition-all duration-150 ease-linear outline-none background-transparent focus:outline-none"
                                    type="button"
                                    onClick={() => setTransferModal(false)}
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
