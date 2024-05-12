import React, { useState, useEffect } from 'react';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import RecruiterContext from '../../Components/RecruterContext';
import NavBar from '../../Components/NavBar'
import Search from '../../Resources/Icons/search.png'
import Calendar from './Calendar'

import personBlack from '../../Resources/Icons/person.png'
import OrganizationBlack from '../../Resources/Icons/icons8-organization-90.png'
import OrganizationWhite from '../../Resources/Icons/organization-white.png'
import personWhite from '../../Resources/Icons/person-white.png'
import Back from '../../Resources/Icons/icons8-back-52.png'


const Appointments = () => {

    const navigate = useNavigate();

    useEffect(() => {
        const token = sessionStorage.getItem('token');
        if(!token) {
            navigate('/login');
        }
    },[])

    const { sideBarStatus } = useContext(RecruiterContext);

    const [type, setType] = useState('');

    const [personHovered, setPersonHovered] = useState(false);
    const [orgHovered, setOrgHovered] = useState(false);

    return (
        <div className='w-screen min-h-screen bg-gray-50'>
            <div className={`min-h-fit absolute top-24 sm:top-0 right-0 flex flex-col items-center pt-10 transition-all duration-500 ${sideBarStatus ? 'w-screen sm:w-[95%] md:w-[95%] lg:w-[80%] xl:w-[85%] 2xl:w-[85%]' : 'w-screen sm:w-[95%] md:w-[95%] xl:w-[95%]'}`}>
                <div className='flex sm:w-[80%] lg:w-[80%] w-[95%] flex-row items-center justify-between gap-10'>
                    <h className='text-3xl font-bold'>Appointments</h>
                    <div className='flex flex-row bg-gray-300 w-[50%] rounded-lg p-3'>
                        <input onChange='' type='text' className='w-full h-full bg-gray-300 border-none rounded-lg outline-none' placeholder='search...' />
                        <img src={Search} className='w-5 h-5' />
                    </div>
                    <div className='hidden sm:block'>
                        <NavBar />
                    </div>
                </div>
                <div className={`sm:w-[80%] lg:w-[80%] w-[95%] mt-10 sm:mt-0 min-h-screen gap-20 flex-row px-10 items-center justify-center align-middle ${ type == '' ? 'flex' : 'hidden'}`}>
                    <div onMouseEnter={() => setPersonHovered(true)}
                         onMouseLeave={() => setPersonHovered(false)} 
                         onClick={() => setType('person')} 
                         className='transition-all duration-300 shadow-lg cursor-pointer hover:scale-105'>
                        <div className='flex flex-col items-center justify-center gap-10 px-16 py-10 pb-20 text-center rounded-lg shadow-inner hover:bg-[#FDCF8B] '>
                            <h className='text-xl font-bold'>Person</h>
                            <img 
                                src={personHovered ? personWhite : personBlack} 
                                className='w-40 h-40' 
                                alt='' 
                            />
                        </div>
                    </div>
                    <div onClick={() => setType('organization')} className='transition-all duration-300 shadow-lg cursor-pointer hover:scale-105'>
                        <div
                            onMouseEnter={() => setOrgHovered(true)}
                            onMouseLeave={() => setOrgHovered(false)}  
                            className='py-10 pb-20 px-16 justify-center flex flex-col rounded-lg shadow-inner text-center items-center hover:bg-[#FDCF8B] gap-10 '>
                            <h className='text-xl font-bold'>Organization</h>
                            <img 
                                src={orgHovered ? OrganizationWhite : OrganizationBlack} 
                                className='w-40 h-40' 
                                alt='' 
                            />
                        </div>
                    </div>
                </div>
                <div className={`h-full w-full items-center align-middle mt-20 min-h-fit flex justify-center ${ type == '' ? 'hidden' : 'block' }`}>
                    <CalendarPage type={type} setType={setType} />
                </div>
            </div>
        </div>
    )
}

const CalendarPage = ({type, setType}) => {

    const [history, setHistory] = useState(true);

    return (
        <div className='sm:w-[80%] lg:w-[80%] w-[95%] mt-10 sm:mt-20 min-h-screen h-full flex flex-col px-10 pb-10'>
            <div className='flex flex-col gap-5 md:flex-row justify-between w-full text-[#778CA2] font-semibold text-base items-start md:items-center'>
                <div className='flex flex-row justify-between gap-5 text-sm lg:gap-10 lg:text-base sm:justify-between'>
                    <div className={`cursor-pointer`}>
                        <img onClick={() => setType('')} src={Back} className='w-10'/>
                    </div>
                    <button onClick={() => setHistory(!history)} className={`px-20 py-2 text-xs font-semibold text-black border-2 rounded-lg hover:bg-[#FDCF8B] hover:border-[#FDCF8B] hover:text-white transition-all duration-300 ${history ? 'bg-transparent border-gray-300' : 'bg-[#FDCF8B] border-[#FDCF8B]'}`}>History</button>
                </div>
            </div>
            <div className='flex flex-col w-full gap-3 mt-10 overflow-auto rounded-lg'>
                <Calendar history={history} type={type} setType={setType} />
            </div>
        </div>
    )
}

export default Appointments;