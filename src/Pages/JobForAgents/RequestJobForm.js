import React from 'react';
import axios from 'axios';
import { useState, useEffect } from 'react';

import Cross from '../../Resources/Icons/x.png'
import { toast } from 'react-toastify';

const Modal = ({ requestModal, setRequestModal , jobId, recruiterId }) => {

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
        dateEdited: Date.now()
    });
    const [agent, setAgent] = useState({
        firstName: '',
        lastName: '',
        email: '',
        id: '',
        mobile: '',
        image: '',
        agentType: '',
    });
    const [recruiters, setRecruiters] = useState([]);
    const [jobs, setJobs] = useState([]);

    const fetchAgent = async () => {
        try {
            const email = sessionStorage.getItem('user');
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/agent/getAgentByEmail`, {
                params: {
                    email: email
                }
            });
            setAgent(response.data.agent);
        } catch (error) {
            console.error('Error fetching the Agents: ', error.message);
        }
    }
    

    const fetchRecruiter =  async() => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/recruiter/getallrecruiters`);
            setRecruiters(response.data);
        } catch (error) {
            console.error('Error fetching the Agents: ', error.message);
        }
    }

    const fetchJobs =  async() => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/job/getalljobs`);
            setJobs(response.data);
        } catch (error) {
            console.error('Error fetching the Agents: ', error.message);
        }
    }

    useEffect(() => {
        fetchRecruiter();
        fetchAgent();
        fetchJobs();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            console.log('recruiter id = ',recruiterId);
            console.log('job id = ',jobId);
            try {
                if (recruiterId) {
                    // Fetch recruiter details
                    const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/recruiter/getrecruiter/${recruiterId}`);
                    setRecruiter(response.data);
                } else if (jobId) {
                    // Fetch job details
                    const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/job/getjob/${jobId}`);
                    setJob(response.data);
                }
            } catch (error) {
                console.error('Error fetching details:', error);
            }
        };
        if (job || recruiter) {
            fetchData();
        }
    }, [jobId, recruiterId]);
    

    const handleOnCLickRecruiter = async (recruiter) => {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/recruiter/getrecruiter/${recruiter}`);
        setRecruiter(response.data);
    }

    const handleOnCLickJob = async (job) => {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/job/getjob/${job}`);
        setJob(response.data);
    }

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

    const handleSendRequest = async () => {
        try {
            const creationDate = getCurrentDateTimeString()
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/notification/generateNotification`, {job, recruiter, agent, creationDate});
            setJobs(response.data);
        } catch (error) {
            console.error('Error fetching the Agents: ', error.message);
        }
    }
    
    
    return (
        <>
            {requestModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
                    <div className="fixed inset-0 bg-black opacity-50"></div>
                    <div className="relative w-auto mx-auto my-6">
                        <div className="relative flex flex-col w-full bg-white border-0 rounded-lg shadow-lg outline-none focus:outline-none">
                            <div className="flex items-center justify-between gap-20 p-5 px-10 border-b border-solid rounded-t border-blueGray-200">
                                <h3 className="font-bold text-black p-2 px-5 rounded-xl bg-[#FDCF8B]">Send Request</h3>
                                <img src={Cross} className='w-10 h-10 transition-all duration-200 cursor-pointer hover:scale-110' onClick={() => setRequestModal(false)} />
                            </div>
                            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 md:gap-28 px-10 font-normal text-black w-fit py-5 pb-10 bg-[#F8FAFB]'>
                                <div className='flex flex-col gap-5'>
                                    <h className='text-lg'>Agent Details</h>
                                    <div className='flex flex-col gap-3'>
                                        <div className='flex flex-col justify-end gap-2 w-[300px] text-right'>
                                            <label>First Name</label>
                                            <input readOnly type='text' name='firstName' value={agent.firstName} className='w-full p-2 border-[2px] outline-gray-100 outline-[1px] border-gray-200 bg-white rounded' />                                            
                                        </div>
                                        <div className='flex flex-col justify-end gap-2 w-[300px] text-right'>
                                            <label>Last Name</label>
                                            <input readOnly type='text' name='lastName' value={agent.lastName} className='w-full p-2 border-[2px] outline-gray-100 outline-[1px] border-gray-200 bg-white rounded' />                                            
                                        </div>
                                        <div className='flex flex-col justify-end gap-2 w-[300px] text-right'>
                                            <label>Email ID</label>
                                            <input readOnly type='text' name='email' value={agent.email} className='w-full p-2 border-[2px] outline-gray-100 outline-[1px] border-gray-200 bg-white rounded' />
                                        </div>
                                        <div className='flex flex-col justify-end gap-2 w-[300px] text-right'>
                                            <label>Mobile No</label>
                                            <input readOnly type='text' name='mobile' value={agent.mobile} className='w-full p-2 border-[2px] outline-gray-100 outline-[1px] border-gray-200 bg-white rounded'/>
                                        </div>
                                    </div>
                                </div>
                                <div className='flex flex-col gap-5'>
                                    <h className='text-lg'>Employee Details</h>
                                    <div className='flex flex-col gap-3'>
                                        <div className='flex flex-col justify-end gap-2 w-[300px] text-right'>
                                            <label>Full Name</label>
                                            <select onChange={(e) => handleOnCLickRecruiter(e.target.value)} className='w-full p-2 border-[2px] outline-gray-100 outline-[1px] border-gray-200 bg-white rounded' placeholder='Select Recruiter'>
                                                {
                                                    recruiter && recruiters.map((recruiter) => 
                                                        <option value={recruiter._id}>{recruiter.firstName} {recruiter.lastName}</option>
                                                    )
                                                }
                                            </select>
                                        </div>
                                        <div className='flex flex-col justify-end gap-2 w-[300px] text-right'>
                                            <label>Name</label>
                                            <input readOnly type='text' name='name' value={recruiter.firstName} className='w-full p-2 border-[2px] outline-gray-100 outline-[1px] border-gray-200 bg-white rounded' />
                                        </div>
                                        <div className='flex flex-col justify-end gap-2 w-[300px] text-right'>
                                            <label>Email ID</label>
                                            <input readOnly type='text' name='email' value={recruiter.email} className='w-full p-2 border-[2px] outline-gray-100 outline-[1px] border-gray-200 bg-white rounded' />
                                        </div>
                                        <div className='flex flex-col justify-end gap-2 w-[300px] text-right'>
                                            <label readOnly>Mobile No</label>
                                            <input type='text' name='mobile' value={recruiter.mobile} className='w-full p-2 border-[2px] outline-gray-100 outline-[1px] border-gray-200 bg-white rounded'/>
                                        </div>
                                    </div>
                                </div>
                                <div className='flex flex-col gap-5'>
                                    <h className='text-lg'>Company Details</h>
                                    <div className='flex flex-col gap-3'>
                                        <div className='flex flex-col justify-end gap-2 w-[300px] text-right'>
                                            <label>Select</label>
                                            <select type='text' name='jobCategory' onChange={(e) => handleOnCLickJob(e.target.value)} className='w-full p-2 border-[2px] outline-gray-100 outline-[1px] border-gray-200 bg-white rounded'>
                                                    {
                                                        jobs && jobs.map((job) => 
                                                            <option value={job._id}>{job.company}</option>
                                                        )
                                                    }
                                            </select>
                                        </div>
                                        <div className='flex flex-col justify-end gap-2 w-[300px] text-right'>
                                            <label>Company</label>
                                            <input readOnly type='text' name='company' value={job.company} className='w-full p-2 border-[2px] outline-gray-100 outline-[1px] border-gray-200 bg-white rounded' />
                                        </div>
                                        <div className='flex flex-col justify-end gap-2 w-[300px] text-right'>
                                            <label>Category</label>
                                            <input readOnly type='text' name='category' value={job.category} className='w-full p-2 border-[2px] outline-gray-100 outline-[1px] border-gray-200 bg-white rounded' />
                                        </div>
                                        <div className='flex flex-col justify-end gap-2 w-[300px] text-right'>
                                            <label>Location</label>
                                            <input readOnly type='text' name='location' value={job.location} className='w-full p-2 border-[2px] outline-gray-100 outline-[1px] border-gray-200 bg-white rounded'/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center justify-between p-4 px-10 border-t border-solid rounded-b border-blueGray-200">
                                <button
                                    className="px-20 py-4 mb-1 mr-1 text-sm font-bold text-white bg-[#CA9731] bg-opacity-[75%] rounded-full uppercase transition-all duration-150 ease-linear outline-none background-transparent focus:outline-none"
                                    type="button"
                                    onClick={() => {
                                        if(!job.company) {
                                            toast.error('Select the Job first');
                                        } else if(!recruiter.email) {
                                            toast.error('Select the Candidate first');
                                        } else {
                                            handleSendRequest();
                                            setRequestModal(false);
                                        }
                                    }}
                                >
                                    Send Request
                                </button>
                                <button
                                    className="px-28 py-4 mb-1 mr-1 text-sm font-bold text-gray-400 bg-[#F8FAFB] hover:bg-slate-300 rounded-full uppercase transition-all duration-150 ease-linear outline-none background-transparent focus:outline-none"
                                    type="button"
                                    onClick={() => setRequestModal(false)}
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
