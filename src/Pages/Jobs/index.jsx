import React from 'react';
import axios from "axios";
import { useState, useEffect, useContext } from "react";
import { generatePath, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import NavBar from '../../Components/NavBar'
import TransferModal from '../../Components/transferForm'
import RecruiterContext from '../../Components/RecruterContext';
import SideBar from '../../Components/sidebar';
import JobModel from './JobForm';

import Search from '../../Resources/Icons/search.png'
import ADD from '../../Resources/Icons/Add New.png'
import Location from '../../Resources/Icons/Location.png'
import Arrow from '../../Resources/Icons/downArrow.png'
import Plus from '../../Resources/Icons/Add New.png'

const Jobs = () => {

    const navigate = useNavigate();
    const [update, setUpdate] = useState(false);

    useEffect(() => {
        const token = sessionStorage.getItem('token');
        const userRole = sessionStorage.getItem('role');
        if (!token) {
            navigate('/login');
        } else if (userRole !== 'admin') {
            navigate('/recruters')
        }
    }, [])

    const { sideBarStatus } = useContext(RecruiterContext);
    const [jobs, setJobs] = useState([]);
    const [allJobs, setAllJobs] = useState([]);

    const fetchJobs = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/job/getalljobs/`);
            const jobs = response.data;
            const filteredJobs = jobs.filter((job) => { return job.available })
            setJobs(filteredJobs);
            setAllJobs(filteredJobs);
            console.log(jobs);
        } catch (error) {
            console.error('Error fetching employee details:', error.message);
        }
    };

    useEffect(() => {
        fetchJobs();
    }, [update]);

    const [divStates, setDivStates] = useState(Array(jobs.length).fill(false));

    const toggleDiv = (index) => {
        const newDivStates = [...divStates];
        newDivStates[index] = !newDivStates[index];
        console.log(newDivStates)
        setDivStates(newDivStates);
    };

    const [searchQuery, setSearchQuery] = useState("");
    const [selectedDate, setSelectedDate] = useState(new Date());

    const filteredJobs = jobs.filter((job) => {
        const jobCategoryMatch = job.category.toLowerCase().includes(searchQuery.toLowerCase());
        const jobCompanyMatch = job.company.toLowerCase().includes(searchQuery.toLowerCase());
        const jobLocationMatch = job.location.toLowerCase().includes(searchQuery.toLowerCase());

        return jobCategoryMatch || jobCompanyMatch || jobLocationMatch;
    });

    useEffect(() => {
        const filteredJobs = allJobs.filter((job) => {
            const jobDate = format(new Date(job.createdDate), 'yyyy-MM-dd');
            const isSameDay = jobDate === selectedDate;
            return isSameDay;
        });

        setJobs(filteredJobs);
    }, [selectedDate]);

    const [currentPage, setCurrentPage] = useState(1);
    const jobsPerPage = 9;
    const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);

    const startIndex = (currentPage - 1) * jobsPerPage;
    const endIndex = startIndex + jobsPerPage;
    const jobsToDisplay = filteredJobs.slice(startIndex, endIndex);

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1);
    };

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    const getPageNumbers = () => {
        const pageNumbers = [];
        const maxPageButtonsToShow = 5;

        if (totalPages <= maxPageButtonsToShow) {
            // Show all pages
            for (let i = 1; i <= totalPages; i++) {
                pageNumbers.push(i);
            }
        } else {
            // Show a limited number of pages with ellipsis
            const leftEllipsis = currentPage > 2;
            const rightEllipsis = currentPage < totalPages - 1;

            if (leftEllipsis) {
                pageNumbers.push(1);
                pageNumbers.push("...");
            }
            for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                if (i >= 1 && i <= totalPages) {
                    pageNumbers.push(i);
                }
            }
            if (rightEllipsis) {
                pageNumbers.push("...");
                pageNumbers.push(totalPages);
            }
        }
        return pageNumbers;
    };

    const [transferModal, setTransferModal] = useState(false);
    const [jobModal, setJobModal] = useState(false);
    const [selectedJob, setSelectedJob] = useState(null);




    return (
        <div className='w-screen h-full min-h-full bg-gray-50 -z-50' id='pdf-content'>
            <div className={`h-full absolute sm:top-0 top-24 right-0 flex flex-col items-center pt-10 transition-all duration-500 ${sideBarStatus ? 'w-screen sm:w-[95%] md:w-[95%] lg:w-[80%] xl:w-[85%] 2xl:w-[85%]' : 'w-screen sm:w-[95%] md:w-[95%] xl:w-[95%]'}`}>
                <div className='flex w-screen px-5 sm:px-10 md:px-10 lg:px-0 sm:w-[90%] lg:w-[80%] flex-row items-center justify-between gap-10'>
                    <h className='text-3xl font-bold'>Jobs</h>
                    <div className='hidden sm:block'>
                        <NavBar />
                    </div>
                </div>
                <div className='w-screen lg:px-0 sm:w-[90%] lg:w-[80%] px-5 sm:px-10 md:px-10 sm:mt-20 min-h-screen h-fit flex flex-col'>
                    <div className='flex flex-col w-full min-h-screen gap-3 mt-10 h-fit'>
                        <div className='flex flex-col justify-between gap-16 sm:gap-10 sm:flex-row'>
                            <div className='flex flex-row bg-gray-300 sm:w-[40%] w-full rounded-lg p-3'>
                                <input onChange={handleSearchChange} type='text' className='w-full h-full bg-gray-300 border-none rounded-lg outline-none' placeholder='search...' />
                                <img src={Search} className='w-5 h-5' />
                            </div>
                            <div className='flex flex-row justify-between gap-5 lg:gap-10'>

                               

                                <input
                                    type='date'
                                    className="p-2 px-4 font-bold text-white bg-[#CA9731] bg-opacity-70 rounded hover:bg-[#CA9731] outline-none"
                                    onChange={(e) => {
                                        setSelectedDate(e.target.value)
                                    }}
                                />
                                <div onClick={() => setJobModal(true)} className='flex items-center justify-center cursor-pointer md:flex-col'>
                                    <span className='text-black sm:text-xs md:font-semibold lg:text-base'>Add Job Position</span>






                                    <img src={Plus} className='sm:w-6 sm:h-6 w-7 h-7 md:w-7 md:h-7' />
                                </div>
                            </div>

                        </div>
                        <JobModel showModal={jobModal} setShowModal={setJobModal} update={update} setUpdate={setUpdate} />
                        {
                            selectedJob == null
                                ? <div></div>
                                : <TransferModal transferModal={transferModal} setTransferModal={setTransferModal} jobId={selectedJob} />

                        }
                        <div className='grid grid-cols-1 gap-5 sm:mt-10 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-3'>
                            {
                                jobsToDisplay.map((job, index) =>
                                    <div onClick={() => toggleDiv(index)} className={`flex flex-col bg-white shadow-lg rounded-2xl pt-10 pb-5 px-5 cursor-pointer
                                        ${divStates[index]
                                            ? 'row-span-2'
                                            : 'max-h-[160px]'
                                        }
                                    `}>
                                        <div className={`flex-col gap-1 font-medium cursor-pointer ${divStates[index] ? 'hidden' : 'flex'}`}>
                                            <span>{job.category}</span>
                                            <span>{job.position}</span>
                                            <span className='flex'><img src={Location} className='w-5 h-5' /> {job.location}</span>
                                        </div>
                                        <div
                                            className={`flex flex-row gap-10 sm:gap-5 md:gap-10 pb-5  overflow-hidden justify-between sm:text-xs text-sm md:text-sm text-gray-500 ${divStates[index] ? "opacity-100" : "max-h-0 opacity-0"
                                                }`}
                                        >
                                            <div onClick={() => { setTransferModal(true); setSelectedJob(job._id) }} className='cursor-pointer flex flex-col gap-1 w-[25%] md:w-[20%] items-center justify-center max-h-fit'>
                                                <span className='text-sm font-bold text-black md:text-sm sm:text-xs'>TRASFERO</span>
                                                <img src={ADD} className='w-5 h-5' />
                                            </div>
                                            <div className='flex flex-col gap-2 w-[75%] sm:w-[60%] md:w-[75%]'>
                                                <div className='flex flex-col gap-1 text-end'>
                                                    <label>Company</label>
                                                    <input type='text' name='comapany' value={job.company} className='p-1 border-[1px] border-gray-300 rounded outline-gray-600 max-w-full cursor-pointer' />
                                                </div>
                                                <div className='flex flex-col gap-1 text-end'>
                                                    <label>Category</label>
                                                    <input type='text' name='category' value={job.category} className='p-1 border-[1px] border-gray-300 rounded outline-gray-600 max-w-full cursor-pointer' />
                                                </div>
                                                <div className='flex flex-col gap-1 text-end'>
                                                    <label>postion</label>
                                                    <input type='text' name='position' value={job.position} className='p-1 border-[1px] border-gray-300 rounded outline-gray-600 max-w-full cursor-pointer' />
                                                </div>
                                                <div className='flex flex-col gap-1 text-end'>
                                                    <label>Location</label>
                                                    <input type='text' name='location' value={job.location} className='p-1 border-[1px] border-gray-300 rounded outline-gray-600 max-w-full cursor-pointer' />
                                                </div>
                                                <div className='flex flex-col gap-1 text-end'>
                                                    <label>Qualification</label>
                                                    <input type='text' name='qualification' value={job.qualification} className='p-1 border-[1px] border-gray-300 rounded outline-gray-600 max-w-full cursor-pointer' />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            }
                        </div>
                        <div className="flex justify-start mt-4">
                            <div
                                onClick={currentPage === 1 ? null : () => setCurrentPage(currentPage - 1)}
                                className={`flex flex-row gap-1 mt-1 ml-2 cursor-pointer ${currentPage === 1 ? 'opacity-50' : ''}`} // Adding 'opacity-50' class when currentPage is 1
                            >
                                <img src={Arrow} className='w-3 h-2 mt-[11px] rotate-90' />
                                <span>prev</span>
                            </div>

                            {getPageNumbers().map((pageNumber, index) => (
                                <button
                                    key={index}
                                    onClick={() => handlePageChange(pageNumber)}
                                    className={`mx-2 ${currentPage === pageNumber ? "bg-[#4D7CFE] text-white rounded py-1 px-3" : " text-black rounded- py-1 px-3"
                                        } rounded`}
                                >
                                    {pageNumber}
                                </button>
                            ))}
                            <div
                                onClick={currentPage === totalPages ? null : () => setCurrentPage(currentPage + 1)}
                                className={`flex flex-row gap-1 mt-1 ml-2 cursor-pointer ${currentPage === totalPages ? 'opacity-50' : ''}`} // Adding 'opacity-50' class when currentPage is 1
                            >
                                <span>next</span>
                                <img src={Arrow} className='w-3 h-2 mt-[10px] -rotate-90' />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Jobs;