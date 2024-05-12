import React, { useState } from 'react';
import { useContext } from 'react';
import RecruiterContext from '../Components/RecruterContext';
import { useNavigate } from 'react-router-dom';
import NavBar from './NavBar';

import Dashboard from '../Resources/Icons/home.png';
import DashboardWhite from '../Resources/Icons/home-active.png';
import Recruter from '../Resources/Icons/New Job.png';
import Agent from '../Resources/Icons/Consultation.png';
import Job from '../Resources/Icons/Job Seeker.png';
import Arrow from '../Resources/Icons/Forward.png';
import AgentWhite from '../Resources/Icons/user-active.png';
import Dollar from '../Resources/Icons/dollar.png';
import DollarWhite from '../Resources/Icons/dollar-active.png';
import Notification from '../Resources/Icons/Alarm.png'
import Logo from '../Resources/global-gsc-logo.svg'
import Appointment from '../Resources/Icons/icons8-calendar-96.png'

const SideBar = () => {
    const token = sessionStorage.getItem('token');
    const userRole = sessionStorage.getItem('role');
    
    const { recruitersStatus, setRecruitersStatus } = useContext(RecruiterContext);
    const { sideBarStatus, setSideBarStatus } = useContext(RecruiterContext);
    const { current, setCurrent } = useContext(RecruiterContext);
    const navigate = useNavigate();

    const [recruiterState, setRecruiterState] = useState("Active");
    const [sidebarExpanded, setSidebarExpanded] = useState(false);

    const toggleSidebar = () => {
        setSidebarExpanded(!sidebarExpanded);
    };

    const [mobileMenu, setMobileMenu] = useState(false)

    return (
        <div className={`fixed left-0 top-0 sm:min-h-screen sm:h-screen w-screen bg-white p-2 transition-all duration-500 overflow-hidden z-50 ${sideBarStatus ? 'xl:w-[20%] md:w-[27%] sm:w-[30%]' : 'md:w-[8%] sm:w-[10%] lg:w-[7%] xl:w-[6%]'} ${ mobileMenu ? 'min-h-[400px]' : 'h-fit'} ${token ? 'block' : 'hidden'}`} onMouseEnter={() => {setSideBarStatus(true)}} onMouseLeave={() => {setSideBarStatus(false)}}>
            <div className='block py-3 sm:hidden min-w-screen min-h-fit'>
                <div className='flex flex-row justify-between w-screen gap-20 px-20'>
                    <div onClick={() => setMobileMenu(!mobileMenu)} className={``}>
                        <img src={Logo} className='w-40 h-20' />
                    </div>
                    <NavBar />
                </div>
                    <div className={`absolute bg-white p-5 left-0 top-24 flex-col items-center w-screen min-w-[300px] h-fit gap-5 text-base font-bold transition-all duration-500 ${mobileMenu ? 'flex' : 'hidden'}`}>
                        <div onClick={() => {setMobileMenu(false); navigate('/home')}}>Home</div>
                        <div className={`flex-row items-center gap-2 rounded-2xl bg-opacity-[67%] cursor-pointer flex`}>
                            <div className='mr-10' onClick={() => {setMobileMenu(false); navigate('/recruters')}}>Recruiters</div>
                            <div onClick={() => { setRecruiterState("Active"); setRecruitersStatus("Active"); }} className={`font-semibold w-full text py-1 px-5 text-center bg-opacity-[67%]  rounded-2xl cursor-pointer hover:bg-[#CA9731] hover:bg-opacity-30 ${recruiterState === "Active" ? 'text-white bg-[#CA9731]' : 'text-black'}`}>Active</div>
                            <div onClick={() => { setRecruiterState("Inactive"); setRecruitersStatus("Inactive"); }} className={`font-semibold w-full text py-1 px-5 text-center bg-opacity-[67%] rounded-2xl cursor-pointer hover:bg-[#CA9731] hover:bg-opacity-30 ${recruiterState === "Inactive" ? 'text-white bg-[#CA9731]' : 'text-black'}`}>Inactive</div>
                        </div>
                        <div onClick={() => {setMobileMenu(false); navigate('/agents')}}>Agents</div>
                        <div onClick={() => {setMobileMenu(false); navigate('/invoices')}}>Invoices</div>
                        <div onClick={() => {setMobileMenu(false); navigate('/jobs')}}>Jobs</div>
                    </div>
            </div>
            <div className={`min-w-full min-h-full bg-gray-100 rounded-3xl ${sideBarStatus ? 'p-2' : 'p-2'} sm:block hidden`}>
                <div className={`${sideBarStatus ? 'block' : 'hidden'}`}>
                    <img src={Logo} className='' />
                </div>
                <div className={`${sideBarStatus ? 'h-0' : 'min-h-16'}`}>
                </div>
                <div className='flex flex-col gap-2 mt-16'>    
                    <div 
                        onClick={() => { setCurrent("Dashboard"); navigate('/home') }} 
                        className={`lg:py-4  md:py-3 sm:py-2 flex flex-row items-center gap-3 lg:gap-5 rounded-lg lg:rounded-2xl bg-opacity-[67%] cursor-pointer hover:bg-[#CA9731] hover:bg-opacity-30 
                                    ${current === "Dashboard" ? 'bg-[#CA9731]' : 'bg-transparent'} 
                                    ${sideBarStatus ? 'lg:px-6 sm:px-3' : 'justify-center sm:px-1 lg:px-0'}
                                    ${userRole == 'agent' ? 'hidden' : 'flex'}
                                `}>
                        <img src={current === "DashBoard" ? Dashboard : Dashboard} className='w-7 h-7' />
                        <span className={`font-semibold text ${current === "Dashboard" ? 'text-white' : 'text-black'} ${sideBarStatus ? 'block' : 'hidden'}`}>Dashboard</span>
                    </div>

                    <div onClick={() => {
                            setCurrent("Appointment");
                            navigate('/appointments');
                        }}
                        className={`lg:py-4 md:py-3 sm:py-2 flex flex-row items-center gap-3 lg:gap-5 rounded-lg lg:rounded-2xl bg-opacity-[67%] cursor-pointer hover:bg-[#CA9731] hover:bg-opacity-30 ${current === "Appointment" ? 'bg-[#CA9731]' : 'bg-transparent'} ${sideBarStatus ? 'lg:px-6 sm:px-3' : 'justify-center sm:px-1 lg:px-0'}`}>
                        <img src={current === "Appointment" ? Appointment : Appointment} className='w-7 h-7' />
                        <span className={`font-semibold text ${current === "Appointment" ? 'text-white' : 'text-black'} ${sideBarStatus ? 'block' : 'hidden'}`}>Book Appointment</span>
                    </div>

                    <div onClick={() => {
                        setCurrent("Candidate");
                        setRecruiterState("Active");
                        setRecruitersStatus("Active");
                        navigate('/recruters');
                    }}
                        className={`lg:py-4 md:py-3 sm:py-2 flex flex-row items-center gap-3 lg:gap-5 rounded-lg lg:rounded-2xl bg-opacity-[67%] cursor-pointer hover:bg-[#CA9731] hover:bg-opacity-30 ${current === "Candidate" ? 'bg-[#CA9731]' : 'bg-transparent'} ${sideBarStatus ? 'lg:px-6 sm:px-3' : 'justify-center sm:px-1 lg:px-0'}`}>
                        <img src={current === "Candidate" ? Recruter : Recruter} className='w-7 h-7' />
                        <span className={`font-semibold text ${current === "Candidate" ? 'text-white' : 'text-black'} ${sideBarStatus ? 'block' : 'hidden'}`}>Candidate</span>
                        <img src={Arrow} className={` h-5 transition-all duration-200 ${current === "Candidate" ? 'rotate-90' : ''} ${sideBarStatus ? 'block' : 'hidden'}`} />
                    </div>

                    <div 
                        className={`flex-col items-center gap-2 rounded-2xl bg-opacity-[67%] cursor-pointer 
                                    ${current === "Candidate" ? 'flex' : 'hidden'} 
                                    ${sideBarStatus ? 'flex' : 'hidden'}
                                `}>
                        <div onClick={() => { setRecruiterState("Active"); setRecruitersStatus("Active"); }} className={`font-semibold w-full text py-1 text-center bg-opacity-[67%]  rounded-2xl cursor-pointer hover:bg-[#CA9731] hover:bg-opacity-30 ${recruiterState === "Active" ? 'text-white bg-[#CA9731]' : 'text-black'}`}>Employees</div>
                        <div onClick={() => { setRecruiterState("Inactive"); setRecruitersStatus("Inactive"); }} className={`font-semibold w-full text py-1 text-center bg-opacity-[67%] rounded-2xl cursor-pointer hover:bg-[#CA9731] hover:bg-opacity-30 ${recruiterState === "Inactive" ? 'text-white bg-[#CA9731]' : 'text-black'}`}>Employed</div>
                    </div>

                    <div 
                        onClick={() => { setCurrent("Agent"); navigate('/agents') }} 
                        className={`lg:py-4 md:py-3 sm:py-2 flex flex-row items-center gap-3 lg:gap-5 rounded-lg lg:rounded-2xl bg-opacity-[67%] cursor-pointer hover:bg-[#CA9731] hover:bg-opacity-30 
                                    ${current === "Agent" ? 'bg-[#CA9731]' : 'bg-transparent'} 
                                    ${sideBarStatus ? 'lg:px-6 sm:px-3' : 'justify-center sm:px-1 lg:px-0'}
                                    ${userRole == 'agent' ? 'hidden' : 'flex'}
                                `}>
                        <img src={current === "Agent" ? Agent : Agent} className='w-7 h-7' />
                        <span className={`font-semibold text ${current === "Agent" ? 'text-white' : 'text-black'} ${sideBarStatus ? 'block' : 'hidden'}`}>Agent</span>
                    </div>

                    <div 
                        onClick={() => { setCurrent("Invoices"); navigate('/invoices'); }} 
                        className={`lg:py-4 md:py-3 sm:py-2 flex flex-row items-center gap-3 lg:gap-5 rounded-lg lg:rounded-2xl bg-opacity-[67%] cursor-pointer hover:bg-[#CA9731] hover:bg-opacity-30 
                                    ${current === "Invoices" ? 'bg-[#CA9731]' : 'bg-transparent'} 
                                    ${sideBarStatus ? 'lg:px-6 sm:px-3' : 'justify-center sm:px-1 lg:px-0'}
                                    
                                `}>
                        <img src={current === "Invoices" ? DollarWhite : Dollar} className='w-7 h-7' />
                        <span className={`font-semibold text ${current === "Invoices" ? 'text-white' : 'text-black'} ${sideBarStatus ? 'block' : 'hidden'}`}>Invoices</span>
                    </div>

                    <div 
                        onClick={() => { setCurrent("Jobs"); navigate('/jobs'); }} 
                        className={`lg:py-4 md:py-3 sm:py-2 flex flex-row items-center gap-3 lg:gap-5 rounded-lg lg:rounded-2xl bg-opacity-[67%] cursor-pointer hover:bg-[#CA9731] hover:bg-opacity-30 
                                    ${current === "Jobs" ? 'bg-[#CA9731]' : 'bg-transparent'} 
                                    ${sideBarStatus ? 'lg:px-6 sm:px-3' : 'justify-center sm:px-1 lg:px-0'}
                                    ${userRole == 'agent' ? 'hidden' : 'flex'}
                                `}>
                        <img src={current === "Jobs" ? Job : Job} className='w-7 h-7' />
                        <span className={`font-semibold text ${current === "Jobs" ? 'text-white' : 'text-black'} ${sideBarStatus ? 'block' : 'hidden'}`}>Jobs</span>
                    </div>

                    <div 
                        onClick={() => { setCurrent("AgentJobs"); navigate('/jobsforagents'); }} 
                        className={`lg:py-4 md:py-3 sm:py-2 flex flex-row items-center gap-3 lg:gap-5 rounded-lg lg:rounded-2xl bg-opacity-[67%] cursor-pointer hover:bg-[#CA9731] hover:bg-opacity-30 
                                    ${current === "AgentJobs" ? 'bg-[#CA9731]' : 'bg-transparent'} 
                                    ${sideBarStatus ? 'lg:px-6 sm:px-3' : 'justify-center sm:px-1 lg:px-0'}
                                    ${userRole == 'admin' ? 'hidden' : 'flex'}
                                `}>
                        <img src={current === "AgentJobs" ? Job : Job} className='w-7 h-7' />
                        <span className={`font-semibold text ${current === "AgentJobs" ? 'text-white' : 'text-black'} ${sideBarStatus ? 'block' : 'hidden'}`}>Jobs for Agents</span>
                    </div>

                    <div 
                        onClick={() => { setCurrent("Notifications"); navigate('/notifications'); }} 
                        className={`lg:py-4 md:py-3 sm:py-2 flex flex-row items-center gap-3 lg:gap-5 rounded-lg lg:rounded-2xl bg-opacity-[67%] cursor-pointer hover:bg-[#CA9731] hover:bg-opacity-30 
                                    ${current === "Notifications" ? 'bg-[#CA9731]' : 'bg-transparent'} 
                                    ${sideBarStatus ? 'lg:px-6 sm:px-3' : 'justify-center sm:px-1 lg:px-0'}
                                    ${userRole == 'agent' ? 'hidden' : 'flex'}
                                `}>
                        <img src={current === "Notifications" ? Notification : Notification} className='w-7 h-7' />
                        <span className={`font-semibold text ${current === "Notifications" ? 'text-white' : 'text-black'} ${sideBarStatus ? 'block' : 'hidden'}`}>Notifications</span>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default SideBar;
