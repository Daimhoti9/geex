import React from 'react';
import axios from 'axios';
import { useState, useEffect } from 'react';

import Cross from '../Resources/Icons/x.png'
import Upload from '../Resources/Icons/Upload.png'
import CV from '../Resources/Icons/CV.png'
import Jobs from '../Pages/Jobs';
import { toast } from 'react-toastify';

const Modal = ({ transferModal, setTransferModal, jobId, recruiterId }) => {

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
    const [recruiters, setRecruiters] = useState([]);

    const [jobs, setJobs] = useState([]);

    const fetchRecruiter =  async() => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/recruiter/getallrecruiters`);
            const filteredRecruters = response.data.filter((recruter) => { return recruter.status == 'Active'})
            setRecruiters(filteredRecruters);
        } catch (error) {
            console.error('Error fetching the Agents: ', error.message);
        }
    }

    const fetchJobs =  async() => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/job/getalljobs`);
            const filteredJobs = response.data.filter((job) => {    return job.available})
            setJobs(filteredJobs);
        } catch (error) {
            console.error('Error fetching the Agents: ', error.message);
        }
    }

    useEffect(() => {
        fetchRecruiter();
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


    const [formData, setFormData] = useState({
        recruter: '',
        email: '',
        mobile: '',
        jobCategory: '',
        jobPosition: '',
        jobLocation: '',
        period: '',
        qualification: '',
        foodAndAcc: '',
        permit: '',
        overTime: ''
    });

    const handleTrasfer = async () => {
        try {
            const mail = sessionStorage.getItem('user');
            console.log(mail);
            const role = 'admin';
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/job/transferJob`, {job, recruiter, mail, role});
            setJobs(response.data);
        } catch (error) {
            console.error('Error fetching the Agents: ', error.message);
        }
    }
    
    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleOnCLickRecruiter = async (recruiter) => {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/recruiter/getrecruiter/${recruiter}`);
        setRecruiter(response.data);
    }

    const handleOnCLickJob = async (job) => {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/job/getjob/${job}`);
        setJob(response.data);
    }
    
    return (
        <>
            {transferModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
                    <div className="fixed inset-0 bg-black opacity-50"></div>
                    <div className="relative w-auto mx-auto my-6">
                        <div className="relative flex flex-col w-full bg-white border-0 rounded-lg shadow-lg outline-none focus:outline-none">
                            <div className="flex items-center justify-between gap-20 p-5 px-10 border-b border-solid rounded-t border-blueGray-200">
                                <img src={Cross} className='w-10 h-10 transition-all duration-200 cursor-pointer hover:scale-110' onClick={() => setTransferModal(false)} />
                                <h3 className="text-xl font-bold text-black">Transfero Puntorin</h3>
                            </div>
                            <div className='px-10 pt-5 bg-[#F8FAFB]'>
                                <div className='w-[150px] h-[150px] bg-gray-300 rounded-full'></div>
                            </div>
                            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 md:gap-28 px-10 font-normal text-black w-fit py-5 pb-10 bg-[#F8FAFB]'>
                                <div className='flex flex-col gap-5'>
                                    <div className='flex flex-col gap-3'>
                                        <div className='flex flex-col justify-end gap-2 w-[300px] text-right'>
                                            <label>Select Candidate</label>
                                            <select onChange={(e) => handleOnCLickRecruiter(e.target.value)} className='w-full p-2 border-[2px] outline-gray-100 outline-[1px] border-gray-200 bg-white rounded' placeholder='Select Recruiter'>
                                                {
                                                    recruiters.map((recruiter) => 
                                                        <option value={recruiter._id}>{recruiter.firstName} {recruiter.lastName}</option>
                                                    )
                                                }
                                            </select>
                                        </div>
                                        <div className='flex flex-col justify-end gap-2 w-[300px] text-right'>
                                            <label>Name</label>
                                            <input readOnly type='text' name='name' value={recruiter.firstName} onChange={handleInputChange} className='w-full p-2 border-[2px] outline-gray-100 outline-[1px] border-gray-200 bg-white rounded' placeholder='Enter Your Email ID' />
                                        </div>
                                        <div className='flex flex-col justify-end gap-2 w-[300px] text-right'>
                                            <label>Email ID</label>
                                            <input readOnly type='text' name='email' value={recruiter.email} onChange={handleInputChange} className='w-full p-2 border-[2px] outline-gray-100 outline-[1px] border-gray-200 bg-white rounded' placeholder='Enter Your Email ID' />
                                        </div>
                                        <div className='flex flex-col justify-end gap-2 w-[300px] text-right'>
                                            <label>Mobile No</label>
                                            <input readOnly type='text' name='mobile' value={recruiter.mobile} onChange={handleInputChange} className='w-full p-2 border-[2px] outline-gray-100 outline-[1px] border-gray-200 bg-white rounded' placeholder='Enter Phone' />
                                        </div>
                                    </div>
                                </div>
                                <div className='flex flex-col gap-3'>
                                    <div className='flex flex-col justify-end gap-2 w-[300px] text-right'>
                                        <label>Company</label>
                                        <select type='text' name='jobCategory' onChange={(e) => handleOnCLickJob(e.target.value)} className='w-full p-2 border-[2px] outline-gray-100 outline-[1px] border-gray-200 bg-white rounded'>
                                            <option>Select Company</option>
                                                {
                                                    jobs.map((job) => 
                                                        <option value={job._id}>{job.company}</option>
                                                    )
                                                }
                                        </select>
                                    </div>
                                    <div className='flex flex-col justify-end gap-2 w-[300px] text-right'>
                                        <label>Company</label>
                                        <input readOnly type='text' name='company' value={job.company} onChange={handleInputChange} className='w-full p-2 border-[2px] outline-gray-100 outline-[1px] border-gray-200 bg-white rounded' placeholder='Manufacturing and Production' />
                                    </div>
                                    <div className='flex flex-col justify-end gap-2 w-[300px] text-right'>
                                        <label>Job Category</label>
                                        <input readOnly type='text' name='jobCategory' value={job.category} onChange={handleInputChange} className='w-full p-2 border-[2px] outline-gray-100 outline-[1px] border-gray-200 bg-white rounded' placeholder='Manufacturing and Production' />
                                    </div>
                                    <div className='flex flex-col justify-end gap-2 w-[300px] text-right'>
                                        <label>Job Position</label>
                                        <input readOnly type='text' name='jobPosition' value={job.position} onChange={handleInputChange} className='w-full p-2 border-[2px] outline-gray-100 outline-[1px] border-gray-200 bg-white rounded' placeholder='Manager' />
                                    </div>
                                    <div className='flex flex-col justify-end gap-2 w-[300px] text-right'>
                                        <label>Job Location</label>
                                        <input readOnly type='text' name='jobLocation' value={job.location} onChange={handleInputChange} className='w-full p-2 border-[2px] outline-gray-100 outline-[1px] border-gray-200 bg-white rounded' placeholder='ALBANIA' />
                                    </div>
                                </div>
                                <div className='flex flex-col gap-3'>
                                    <div className='flex flex-col justify-end gap-2 w-[300px] text-right'>
                                        <label>Period of Contract</label>
                                        <input readOnly type='text' name='period' value={job.period} onChange={handleInputChange} className='w-full p-2 border-[2px] outline-gray-100 outline-[1px] border-gray-200 bg-white rounded'  />
                                    </div>
                                    <div className='flex flex-col justify-end gap-2 w-[300px] text-right'>
                                        <label>Qualification</label>
                                        <input readOnly type='text' name='qualification' value={job.qualification} onChange={handleInputChange} className='w-full p-2 border-[2px] outline-gray-100 outline-[1px] border-gray-200 bg-white rounded'  />
                                    </div>
                                    <div className='flex flex-col justify-end gap-2 w-[300px] text-right'>
                                        <label>Food and Accommodation</label>
                                        <input readOnly type='text' name='foodAndAcc' value={job.amenities} onChange={handleInputChange} className='w-full p-2 border-[2px] outline-gray-100 outline-[1px] border-gray-200 bg-white rounded' />
                                    </div>
                                    <div className='flex flex-col justify-end gap-2 w-[300px] text-right'>
                                        <label>Pesident Permit</label>
                                        <input readOnly type='text' name='permit' value={job.permit} onChange={handleInputChange} className='w-full p-2 border-[2px] outline-gray-100 outline-[1px] border-gray-200 bg-white rounded' />
                                    </div>
                                    <div className='flex flex-col justify-end gap-2 w-[300px] text-right'>
                                        <label>Over Time</label>
                                        <input readOnly type='text' name='overTime' value={job.overtime} onChange={handleInputChange} className='w-full p-2 border-[2px] outline-gray-100 outline-[1px] border-gray-200 bg-white rounded' />
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center justify-between p-4 px-10 border-t border-solid rounded-b border-blueGray-200">
                                <button
                                    className="px-20 py-4 mb-1 mr-1 text-sm font-bold text-white bg-[#CA9731] bg-opacity-[75%] rounded-full uppercase transition-all duration-150 ease-linear outline-none background-transparent focus:outline-none"
                                    type="button"
                                    onClick={() => {
                                        if(!job.company) {
                                            toast.error('Select the Company first.')
                                        } else if (!recruiter.email) {
                                            toast.error('Select the Candidate first.')
                                        } else {
                                            setTransferModal(false); handleTrasfer()
                                        }
                                    }}
                                >
                                    Transfero Puntorin
                                </button>
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
