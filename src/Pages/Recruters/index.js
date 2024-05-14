import React from 'react';
import axios from 'axios';
import { useState, useEffect, useContext } from "react";
import RecruiterContext from '../../Components/RecruterContext';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import NavBar from '../../Components/NavBar'
import Modal from './addRecruter'
import RecruterQuestionaireModel from './addRecruterQuestionaire'
import RecruterConfirmModel from './addRecruterConfirm'
import DocumentUploadForm from './DocumentUploadForm';
import BackgroundCheckFrom from './BackgroundCheckFrom';
import ApplicationCompletionForm from './ApplicationCompletionForm';
import CV from './CV'
import * as XLSX from 'xlsx';
import TransferModal from '../../Components/transferForm'
import TransferDetails from './transferDetails';
import EditModal from './editRecruter'

import Add from '../../Resources/Icons/add.png'
import Download from '../../Resources/Icons/download.png'
import Filter from '../../Resources/Icons/filter.png'
import Arrow from '../../Resources/Icons/downArrow.png'
import Eye from '../../Resources/Icons/eye.png'
import Edit from '../../Resources/Icons/edit.png'
import Delete from '../../Resources/Icons/delete.png'
import Search from '../../Resources/Icons/search.png'
import Profile from '../../Resources/Icons/profile.png'
import ADD from '../../Resources/Icons/Add New.png'
import Import from '../../Resources/Icons/import.png'
import DocsDownload from './downloadDocs';
import Document from '../../Resources/Icons/icons8-documents-96.png'
import Logo from '../../Resources/logo_bg_rm.jpg'
import jsPDF from 'jspdf';

const Recruters = () => {

    const navigate = useNavigate();
    const [userRole, setUserRole] = useState();
    const [update, setUpdate] = useState(false);

    const { recruitersStatus } = useContext(RecruiterContext);
    const { sideBarStatus } = useContext(RecruiterContext);

    useEffect(() => {
        const token = sessionStorage.getItem('token');
        const userRole = sessionStorage.getItem('role');
        setUserRole(userRole);
        if (!token) {
            navigate('/login');
        }
    }, [])

    const [recruters, setRecruters] = useState([]);
    const [allRecruters, setAllRecruters] = useState([]);

    //All modals are defined here
    const [addModal, setAddModal] = useState(false);
    const [questionareModel, setQuestionareModal] = useState(false);
    const [addRecruiterConfirmModal, setAddRecruiterConfirmModal] = useState(false);
    const [documentModal, setDocumentModal] = useState(false);
    const [backgroundModal, setBackgroundModal] = useState(false);
    const [completionModal, setCompletionModal] = useState(false);
    const [cvModal, setCVModal] = useState(false);
    const [showDocDownload, setShowDocDownload] = useState(false);

    const [newRecruiterModelStep, setNewRecruiterModelStep] = useState(0);
    const [editModal, setEditModal] = useState(false);
    const [transferModal, setTransferModal] = useState(false);
    const [transferDetails, setTransferDetails] = useState(false);
    const [questionaire, setQuestionaire] = useState(false); //to make sure that questionaire is filled

    const [paymentMethod, setPaymentMethod] = useState('');

    const [newRecruiterFormData, setNewRecruiterFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
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
    });

    const fetchData = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/recruiter/getallrecruiters`);
            setRecruters(response.data);
            setAllRecruters(response.data);
        } catch (error) {
            console.error('Error fetching the Agents: ', error.message);
        }
    }

    const handleDeleteAgent = async (id) => {
        try {
            const response = await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/recruiter/deleterecruiter/${id}`);
            setUpdate(!update);
        } catch (error) {
            console.error('Error deleting the Recruiter: ', error.message);
        }
    }

    useEffect(() => {
        fetchData();
    }, [transferModal, update, editModal]);

    const [searchQuery, setSearchQuery] = useState("");
    const [selectedDate, setSelectedDate] = useState(new Date());

    const filteredRecruters = recruters.filter((recruiter) => {
        const agentFNameMatch = recruiter.firstName.toLowerCase().includes(searchQuery.toLowerCase());
        const agentLNameMatch = recruiter.lastName.toLowerCase().includes(searchQuery.toLowerCase());

        const statusMatch = recruiter.status == recruitersStatus
        //const premiumMatch = filterQuery === 'All' || (filterQuery === 'true' && recruiter.premium) || (filterQuery === 'false' && !recruiter.premium);

        return statusMatch && (agentFNameMatch || agentLNameMatch);
    });


    useEffect(() => {
        const filteredRecruiters = allRecruters.filter((recruter) => {
            const recruterDate = format(new Date(recruter.dateCreated), 'yyyy-MM-dd');
            const isSameDay = recruterDate === selectedDate;
            return isSameDay;
        });

        setRecruters(filteredRecruiters);
    }, [selectedDate]);

    const [currentPage, setCurrentPage] = useState(1);
    const recrutersPerPage = 6;
    const totalPages = Math.ceil(filteredRecruters.length / recrutersPerPage);

    const startIndex = (currentPage - 1) * recrutersPerPage;
    const endIndex = startIndex + recrutersPerPage;
    const recrutersToDisplay = filteredRecruters.slice(startIndex, endIndex);

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1);
    };

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    useEffect(() => {
        setCurrentPage(1);
    }, [recruitersStatus]);

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

    function exportToExcel(users) {
        const headers = ['id', 'firstName', 'lastName', 'email', 'mobile', 'status'];
        const data = users.map(user => ({
            id: user.id || '', // Handle if id is missing
            firstName: user.firstName || '', // Handle if firstName is missing
            lastName: user.lastName || '', // Handle if lastName is missing
            email: user.email || '', // Handle if email is missing
            mobile: user.mobile || '', // Handle if mobile is missing
            status: user.status || '', // Handle if status is missing
        }));
        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.json_to_sheet(data, { header: headers });
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Recruiters Data');
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'Recruiters Data.xlsx';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }

    const [selectedRecruiter, setSelectedRecruiter] = useState(null);
    const [selectedRecruiterDetails, setSelectedRecruiterDetails] = useState(null);
    const [recruter, setRecruter] = useState(null);

    const downloadCV = async (originalFilename, downloadFilename) => {
        try {
            console.log(originalFilename)
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/download-cv/${originalFilename}_CV.pdf`);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = downloadFilename; // Use the specified download filename
            a.click();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error downloading CV:', error);
        }
    };

    const handleRecruterClick = () => {
        console.log(recruter);
        if (recruter.informationProgress === 'basic') {
            setNewRecruiterFormData(recruter);
            setDocumentModal(true);
        } else if (recruter.informationProgress === 'documents') {
            setNewRecruiterFormData(recruter);
            setBackgroundModal(true);
        } else if (recruter.informationProgress === 'background') {
            setNewRecruiterFormData(recruter);
            setCompletionModal(true);
        }
    }
    useEffect(() => {
        if (recruter) {
            handleRecruterClick();
        }
    }, [recruter]);


    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }











    return (
        <div className='w-screen h-screen bg-gray-50'>
            <div className={`h-full absolute top-0 right-0 flex flex-col items-center pt-10 transition-all duration-500 ${sideBarStatus ? 'w-screen sm:w-[95%] md:w-[95%] lg:w-[80%] xl:w-[85%] 2xl:w-[85%]' : 'w-screen sm:w-[95%] md:w-[95%] xl:w-[95%]'}`}>
                <div className='flex w-screen sm:w-[90%] lg:w-[80%] flex-row items-center justify-between gap-10'>
                    <h className='text-3xl font-bold'>Candidate</h>
                    <div className='flex flex-row bg-gray-300 w-[50%] rounded-lg p-3'>
                        <input onChange={handleSearchChange} type='text' className='w-full h-full bg-gray-300 border-none rounded-lg outline-none' placeholder='search...' />
                        <img src={Search} className='w-5 h-5' />
                    </div>
                    <NavBar />
                </div>
                <div className=' w-screen sm:w-[90%] lg:w-[80%] mt-32 flex flex-col'>
                    <div className='flex flex-row justify-between w-full text-[#778CA2] font-semibold text-base items-center'>
                        <div className='flex flex-row gap-10'>
                            <div onClick={() => setAddModal(true)} className='flex flex-row gap-5 transition-all duration-200 cursor-pointer hover:scale-110'>
                                <span>Create form</span>
                                <img src={Add} className='w-5 h-5' />
                            </div>
                            {/* <div onClick={() => generateCVTemp()} className='flex flex-row gap-5 transition-all duration-200 cursor-pointer hover:scale-110'>
                                <span>Dummy Button for CV</span>
                                <img src={Add} className='w-5 h-5' />
                            </div> */}


                            <Modal newRecruiterModelStep={addModal} setNewRecruiterModelStep={setAddModal} newRecruiterFormData={newRecruiterFormData} setNewRecruiterFormData={setNewRecruiterFormData} setNextStep={setQuestionareModal} setThirdStep={setAddRecruiterConfirmModal} setPaymentMethod={setPaymentMethod} questionaire={questionaire} />
                            <RecruterQuestionaireModel newRecruiterModelStep={questionareModel} setAddModal={setAddModal} setNewRecruiterModelStep={setQuestionareModal} newRecruiterFormData={newRecruiterFormData} setNewRecruiterFormData={setNewRecruiterFormData} setQuestionaire={setQuestionaire}/>
                            <RecruterConfirmModel newRecruiterModelStep={addRecruiterConfirmModal} setNewRecruiterModelStep={setAddRecruiterConfirmModal} newRecruiterFormData={newRecruiterFormData} setNewRecruiterFormData={setNewRecruiterFormData} setUpdate={setUpdate} update={update} methodOfPayment={paymentMethod} />
                            <DocumentUploadForm newRecruiterModelStep={documentModal} setNewRecruiterModelStep={setDocumentModal} newRecruiterFormData={newRecruiterFormData} setUpdate={setUpdate} update={update} />
                            <BackgroundCheckFrom newRecruiterModelStep={backgroundModal} setNewRecruiterModelStep={setBackgroundModal} newRecruiterFormData={newRecruiterFormData} setBack={setDocumentModal} setUpdate={setUpdate} update={update} />
                            <ApplicationCompletionForm newRecruiterModelStep={completionModal} setNewRecruiterModelStep={setCompletionModal} newRecruiterFormData={newRecruiterFormData} setNewRecruiterFormData={setNewRecruiterFormData} />
                            <CV newRecruiterModelStep={newRecruiterModelStep} setNewRecruiterModelStep={setNewRecruiterModelStep} newRecruiterFormData={newRecruiterFormData} setNewRecruiterFormData={setNewRecruiterFormData} />
                            <DocsDownload showDocDownload={showDocDownload} recruiterData={selectedRecruiter} onClose={() => setShowDocDownload(false)} />

                            <div onClick={() => exportToExcel(allRecruters)} className='flex flex-row gap-5 transition-all duration-200 cursor-pointer hover:scale-110'>
                                <span>DOWNLOAD</span>
                                <img src={Download} className='w-5 h-5' />
                            </div>
                            <div className='relative flex flex-row gap-5 transition-all duration-200 cursor-pointer hover:scale-110'>
                                <span className='cursor-pointer'>IMPORT</span>
                                <img src={Import} className='w-5 h-5 cursor-pointer' />
                                <input type='file' className='absolute top-0 w-full h-full opacity-0 cursor-pointer l-0' />
                            </div>
                        </div>
                        <div className='flex flex-row items-center gap-10'>
                            <input
                                type='date'
                                className="p-2 px-4 font-bold text-white bg-[#CA9731] bg-opacity-70 rounded hover:bg-[#CA9731]"
                                onChange={(e) => {
                                    setSelectedDate(e.target.value)
                                }}
                            />
                            <div className='flex flex-row gap-3'>
                                <div className='flex flex-row cursor-pointer'>
                                    <span>Filter: </span>
                                    <select className='text-black cursor-pointer'>
                                        <option>All</option>
                                        <option>All</option>
                                        <option>All</option>
                                    </select>
                                </div>
                                <img src={Filter} className='w-5 h-5 mt-1' />
                            </div>
                        </div>
                    </div>
                    <div className='flex flex-col w-full gap-3 mt-10'>
                        <div className={`grid w-full gap-5 font-semibold text-center ${recruitersStatus === 'Active' ? 'grid-cols-6' : 'grid-cols-5'}`}>
                            <span className={`${recruitersStatus === 'Active' ? 'col-span-2' : 'col-span-1'}`}>Actions</span>
                            <span>Last Edited</span>
                            <span>Date Created</span>
                            <span>Email</span>
                            <span>User Name</span>

                        </div>
                        {
                            selectedRecruiter == null
                                ? <div></div>
                                : <TransferModal transferModal={transferModal} setTransferModal={setTransferModal} recruiterId={selectedRecruiter._id} />

                        }
                        {
                            selectedRecruiterDetails == null
                                ? <div></div>
                                : <TransferDetails transferModal={transferDetails} setTransferModal={setTransferDetails} recruiterId={selectedRecruiterDetails._id} />

                        }
                        <div className='flex flex-col w-full h-full gap-5'>
                            {
                                recrutersToDisplay.map((recruter) =>
                                    <div className={`grid items-center gap-5 py-5 text-center shadow-inner rounded
                                        ${recruitersStatus === "Active"
                                            ? `grid-cols-6 
                                                ${recruter.informationProgress === 'basic' ? 'bg-[#FFF500]' :
                                                recruter.informationProgress === 'documents' ? 'bg-[#FFA800] bg-opacity-65' :
                                                    recruter.informationProgress === 'background' ? 'bg-[#52FF00] bg-opacity-25' : ''}`
                                            : 'bg-[#F03738] bg-opacity-[25%] grid-cols-5 cursor-pointer'
                                        }
                                        `} onClick={
                                            recruitersStatus === "Inactive"
                                                ? () => { setSelectedRecruiterDetails(recruter); setTransferDetails(true) }
                                                : () => { }
                                        }>
                                        <div className={`flex flex-row items-center justify-center gap-5 ${recruitersStatus === 'Active' ? 'col-span-2' : 'col-span-1'}`}>
                                            <img onClick={() => downloadCV(recruter.email, recruter.firstName + "_CV.pdf")} src={Download} className='w-5 h-5 transition-all duration-200 cursor-pointer hover:scale-125' />
                                            <img onClick={() => { setSelectedRecruiter(recruter); setShowDocDownload(true) }} src={Document} className='w-5 h-5 transition-all duration-200 cursor-pointer hover:scale-125' />
                                            {/* <img src={Eye} className='w-5 h-5 transition-all duration-200 cursor-pointer hover:scale-125' /> */}
                                            <img onClick={
                                                recruitersStatus === "Inactive"
                                                    ? () => { }
                                                    : () => { setRecruter(recruter) }
                                            } src={Edit} className='w-5 h-5 transition-all duration-200 cursor-pointer hover:scale-125' />
                                            {/* <img onClick={() => handleDeleteAgent(recruter._id)} src={Delete} className='w-5 h-5 transition-all duration-200 cursor-pointer hover:scale-125' /> */}
                                            <div
                                                onClick={() => { setTransferModal(true); setSelectedRecruiter(recruter) }}
                                                className={`flex-col justify-center ml-10 items-center cursor-pointer 
                                                            ${recruitersStatus === 'Active' ? 'flex' : 'hidden'}
                                                            ${userRole !== 'admin' ? 'hidden' : 'block'}
                                                        `}>
                                                <span className='text-sm font-semibold'>TRASFERO</span>
                                                <img src={ADD} className='w-5 h-5' />
                                            </div>
                                        </div>
                                        <span>{format(new Date(recruter.dateEdited), 'dd-MM-yyyy')}</span>
                                        <span>{format(new Date(recruter.dateCreated), 'dd-MM-yyyy')}</span>
                                        <span>{recruter.email}</span>
                                        <div className='flex flex-row items-center justify-end gap-3 mr-5' >
                                            <span >{recruter.firstName} {recruter.lastName}</span>
                                            <img src={recruter.profileImage ? recruter.profileImage : Profile} className='w-10 h-10 rounded-full' />
                                        </div>
                                    </div>
                                )
                            }
                        </div>
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
                                className={`mx-2 ${currentPage === pageNumber ? "bg-[#4D7CFE] text-white rounded py-1 px-3" : " text-black rounded py-1 px-3"
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
    )
}

export default Recruters;