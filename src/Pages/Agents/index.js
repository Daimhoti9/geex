import React from 'react';
import axios from 'axios';
import { useState, useEffect, useContext } from "react";
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import NavBar from '../../Components/NavBar'
import Modal from './addAgent'
import EditModal from './editAgent'
import RecruiterContext from '../../Components/RecruterContext';
import * as XLSX from 'xlsx';

import Add from '../../Resources/Icons/add.png'
import Download from '../../Resources/Icons/download.png'
import Arrow from '../../Resources/Icons/downArrow.png'
import Eye from '../../Resources/Icons/eye.png'
import Edit from '../../Resources/Icons/edit.png'
import Delete from '../../Resources/Icons/delete.png'
import Search from '../../Resources/Icons/search.png'
import Star from '../../Resources/Icons/Army Star.png'
import Profile from '../../Resources/Icons/profile.png'
import Import from '../../Resources/Icons/import.png'

const Agents = () => {

    const navigate = useNavigate();

    useEffect(() => {
        const token = sessionStorage.getItem('token');
        const userRole = sessionStorage.getItem('role');
        if(!token) {
            navigate('/login');
        } else if (userRole !== 'admin') {
            navigate('/recruters')
        }
    },[])

    const { sideBarStatus } = useContext(RecruiterContext);

    const [update, setUpdate] = useState(false);
    const [agents, setAgents] = useState([]);
    const [allAgents, setAllAgents] = useState([]);
    const [showModal, setShowModal] = React.useState(false);
    const [editModal, setEditModal] = React.useState(false);
    const [agent, setAgent] = useState();

    const fetchData = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/agent/getallagents`);
            setAgents(response.data);
            setAllAgents(response.data);
        } catch (error) {
            console.error('Error fetching the Agents: ', error.message);
        }
    }

    useEffect(() => {
        fetchData();
    }, [update, showModal, editModal]);

    const handleDeleteAgent = async (id) => {
        try {
            const response = await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/agent/deleteagent/${id}`);
            setUpdate(!update)
        } catch (error) {
            console.error('Error deleting the Agent: ', error.message);
        }
    }

    const [searchQuery, setSearchQuery] = useState("");
    const [filterQuery, setfilterQuery] = useState("All");
    const [selectedDate, setSelectedDate] = useState(new Date());

    const filteredAgents = agents.filter((agent) => {
        const agentFNameMatch = agent.firstName.toLowerCase().includes(searchQuery.toLowerCase());
        const agentLNameMatch = agent.lastName.toLowerCase().includes(searchQuery.toLowerCase());
        const premiumMatch = filterQuery === 'All' || (filterQuery == agent.agentType);

        return (agentFNameMatch || agentLNameMatch) && premiumMatch;
    });

    useEffect(() => {
        const filteredAgents = allAgents.filter((agent) => {
            const agentDate = format(new Date(agent.dateCreated), 'yyyy-MM-dd');
            const isSameDay = agentDate === selectedDate;
            return isSameDay;
        });
        setAgents(filteredAgents);
    }, [selectedDate]);

    const [currentPage, setCurrentPage] = useState(1);
    const agentsPerPage = 6;
    const totalPages = Math.ceil(filteredAgents.length / agentsPerPage);

    const startIndex = (currentPage - 1) * agentsPerPage;
    const endIndex = startIndex + agentsPerPage;
    const agentsToDisplay = filteredAgents.slice(startIndex, endIndex);

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1);
    };

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };


    function exportToExcel(users) {
        const headers = ['id', 'firstName', 'lastName', 'email', 'mobile', 'premium', 'comission'];

        const data = users.map(user => ({
            id: user.id || '', // Handle if id is missing
            firstName: user.firstName || '', // Handle if firstName is missing
            lastName: user.lastName || '', // Handle if lastName is missing
            email: user.email || '', // Handle if email is missing
            mobile: user.mobile || '', // Handle if mobile is missing
            premium: user.premium ? 'Yes' : 'No', // Convert premium boolean to string
            comission: user.comission || '', // Handle if comission is missing
        }));

        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.json_to_sheet(data, { header: headers });
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Agents Data');

        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'Agents Data.xlsx';

        document.body.appendChild(link);
        link.click();

        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }


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

    return (
        <div className='w-screen h-screen bg-gray-50'>
            <div className={`h-full absolute top-24 sm:top-0 right-0 flex flex-col items-center pt-10 transition-all duration-500 ${sideBarStatus ? 'w-screen sm:w-[95%] md:w-[95%] lg:w-[80%] xl:w-[85%] 2xl:w-[85%]' : 'w-screen sm:w-[95%] md:w-[95%] xl:w-[95%]'}`}>
                <div className='flex sm:w-[80%] lg:w-[80%] w-[95%] flex-row items-center justify-between gap-10'>
                    <h className='text-3xl font-bold'>Agents</h>
                    <div className='flex flex-row bg-gray-300 w-[50%] rounded-lg p-3'>
                        <input onChange={handleSearchChange} type='text' className='w-full h-full bg-gray-300 border-none rounded-lg outline-none' placeholder='search...' />
                        <img src={Search} className='w-5 h-5' />
                    </div>
                    <div className='hidden sm:block'>
                        <NavBar />
                    </div>
                </div>
                <div className='sm:w-[80%] lg:w-[80%] w-[95%] mt-10 sm:mt-32 h-screen flex flex-col'>
                    <div className='flex flex-col gap-5 md:flex-row justify-between w-full text-[#778CA2] font-semibold text-base items-start md:items-center'>
                        <div className='flex flex-row justify-between w-full gap-5 text-sm lg:gap-10 lg:text-base sm:justify-start'>
                            <div onClick={() => setShowModal(true)} className='flex flex-row gap-2 transition-all duration-200 cursor-pointer lg:gap-5 hover:scale-110'>
                                <span>CREATE FORM</span>
                                <img src={Add} className='w-5 h-5' />
                            </div>
                            <Modal showModal={showModal} setShowModal={setShowModal} update={update} setUpdate={setUpdate} />
                            <div onClick={()=>exportToExcel(allAgents)} className='flex flex-row gap-2 transition-all duration-200 cursor-pointer lg:gap-5 hover:scale-110'>
                                <span>DOWNLOAD</span>
                                <img src={Download} className='w-5 h-5' />
                            </div>
                            <div className='relative flex flex-row gap-2 transition-all duration-200 cursor-pointer lg:gap-5 hover:scale-110'>
                                <span className='cursor-pointer'>IMPORT</span>
                                <img src={Import} className='w-5 h-5 cursor-pointer' />
                                <input type='file' className='absolute top-0 w-full h-full opacity-0 cursor-pointer l-0' />
                            </div>
                        </div>
                        <div className='flex flex-row items-center self-end gap-5 lg:gap-10 max-w-fit'>
                            <input
                                type='date'
                                className="p-2 lg:px-4 font-bold w-[40%] lg:w-full outline-none text-white bg-[#CA9731] bg-opacity-70 rounded hover:bg-[#CA9731]"
                                onChange={(e) => {
                                    setSelectedDate(e.target.value)
                                }}
                            />
                            <div className='flex flex-row gap-3 cursor-pointer max-w-[60px] lg:max-w-full'>
                                <div className='flex flex-row '>
                                    <span>Filter: </span>
                                    <select className='text-black cursor-pointer' onChange={(e) => setfilterQuery(e.target.value)}>
                                        <option value="All">All</option>
                                        <option value="International (P) Agent">International (P) Agent</option>
                                        <option value="Local (P) Agent">Local (P) Agent</option>
                                        <option value="International (B) Agent">International (B) Agent</option>
                                        <option value="Local (B) Agent">Local (B) Agent</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='flex flex-col w-full gap-3 mt-10'>
                        <div className='grid w-full grid-cols-3 gap-5 font-semibold text-center md:grid-cols-4 lg:grid-cols-6'>
                            <span>Actions</span>
                            <div className='hidden opacity-0 lg:block'>Premium</div>
                            <span className='hidden md:block'>Last Edited</span>
                            <span className='hidden lg:block'>Date Created</span>
                            <span>Email</span>
                            <span>User</span>
                        </div>
                        <EditModal showModal={editModal} setShowModal={setEditModal} agent={agent} update={update} setUpdate={setUpdate}/>
                        <div className='flex flex-col w-full h-full gap-5'>
                            {
                                agentsToDisplay.map((agent) =>
                                    <div className='relative grid items-center grid-cols-3 gap-5 py-5 text-center bg-white shadow-inner md:grid-cols-4 lg:grid-cols-6'>
                                        <div className='flex flex-row items-center justify-center gap-5 px-5'>
                                            <img src={Eye} className='w-5 h-5 transition-all duration-200 cursor-pointer hover:scale-125' />
                                            <img onClick={() => { setAgent(agent); setEditModal(true) }} src={Edit} className='w-5 h-5 transition-all duration-200 cursor-pointer hover:scale-125' />
                                            {/* <img onClick={() => { handleDeleteAgent(agent._id) }} src={Delete} className='w-5 h-5 transition-all duration-200 cursor-pointer hover:scale-125' /> */}
                                        </div>
                                        <div className='absolute flex flex-row items-center justify-center -top-2 -left-2 lg:relative'>
                                            {
                                                agent.agentType == 'International (P) Agent' || agent.agentType == 'Local (P) Agent'
                                                    ? <img src={Star} className={`lg:w-10 lg:h-10 w-7 h-7 ${agent.agentType == 'International (P) Agent' || agent.agentType == 'Local (P) Agent' ? 'block' : 'hidden'}`} />
                                                    : <div className='opacity-0'></div>
                                            }
                                        </div>
                                        <span className='hidden md:block'>{format(new Date(agent.dateEdited), 'dd-MM-yyyy')}</span>
                                        <span className='hidden lg:block'>{format(new Date(agent.dateCreated), 'dd-MM-yyyy')}</span>
                                        <span>{agent.email}</span>
                                        <div className='flex flex-row items-center justify-end gap-3'>
                                            <span>{agent.firstName} {agent.lastName}</span>
                                            <img src={agent.profileImage ? agent.profileImage : Profile} className='w-10 h-10 rounded-full' />
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
    )
}

export default Agents;