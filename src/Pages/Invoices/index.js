import React from 'react';
import axios from 'axios';
import { useState, useEffect, useContext } from "react";
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import NavBar from '../../Components/NavBar'
import RecruiterContext from '../../Components/RecruterContext';

import Search from '../../Resources/Icons/search.png'

const Invoices = () => {

    const navigate = useNavigate();

    const userEmail = sessionStorage.getItem('user')
    const userRole = sessionStorage.getItem('role');
    useEffect(() => {
        const token = sessionStorage.getItem('token');
        if(!token) {
            navigate('/login');
        } else if (userRole !== 'admin') {
            //navigate('/recruters')
        }
    },[])

    const { sideBarStatus } = useContext(RecruiterContext);
    const [invoicesData, setInvoices] = useState([]);
    const [divStates, setDivStates] = useState(Array(invoicesData.length).fill(false));
    
    const fetchData = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/invoice/getallinvoices`);
            const data = response.data;
    
            const combinedData = [];
    
            const fetchJobDetails = async (jobId) => {
                const jobResponse = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/job/getjob/${jobId}`);
                return jobResponse.data;
            };
            const fetchAgentDetails = async (agentId) => {
                const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/agent/getagent/${agentId}`);
                return response.data;
            };
            const fetchAdminDetails = async (adminId) => {
                const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/user/getuser/${adminId}`);
                return response.data;
            };
    
            for (const invoice of data) {
                let admin;
                let agent;
                if (invoice.admin) {
                    admin = await fetchAdminDetails(invoice.admin)
                }
                if (invoice.agent) {
                    agent = await fetchAgentDetails(invoice.agent)
                }
                const jobDetails = await fetchJobDetails(invoice.job);
                const combinedInvoiceData = {
                    invoice,
                    job: jobDetails,
                    admin: admin,
                    agent: agent
                };
                combinedData.push(combinedInvoiceData);
            }

            console.log("Data", combinedData);
            console.log("email", userEmail);

            if(userRole == "agent") {
                const filteredInvices = combinedData.filter((invoice) => {return invoice.admin == undefined});
                const userIncoices = filteredInvices.filter((invoice) => {return invoice.agent.email == userEmail})
                setInvoices(userIncoices)
            } else {
                setInvoices(combinedData);
            }
        } catch (error) {
            console.error('Error fetching the Invoices: ', error.message);
        }
    };
    

    useEffect(() => {
        fetchData();
    }, []);

    const toggleDiv = (index) => {
        const newDivStates = [...divStates];
        newDivStates[index] = !newDivStates[index];
        console.log(newDivStates)
        setDivStates(newDivStates);
      };

    return(
        <div className='w-screen h-screen bg-white'>
            <div className={`h-full absolute top-0 right-0 flex flex-col items-center pt-10 transition-all duration-500 ${sideBarStatus ? 'w-screen sm:w-[95%] md:w-[95%] lg:w-[80%] xl:w-[85%] 2xl:w-[85%]' : 'w-screen sm:w-[95%] md:w-[95%] xl:w-[95%]'}`}>
                <div className='flex w-screen px-5 sm:px-10 lg:px-0 sm:w-[90%] lg:w-[80%] flex-row items-center justify-between gap-10'>
                    <h className='text-3xl font-bold'>Invoices</h>
                    <div className='flex flex-row bg-gray-300 w-[50%] rounded-lg p-3'>
                        <input type='text' className='w-full h-full bg-gray-300 border-none rounded-lg outline-none' placeholder='search...' />
                        <img src={Search} className='w-5 h-5' />
                    </div>
                    <div className='hidden sm:block'>
                        <NavBar />
                    </div>
                </div>
                <div className='w-screen px-5 sm:px-10 lg:px-0 sm:w-[90%] lg:w-[80%] mt-20 h-screen flex flex-col'>
                    <div className='flex flex-col w-full h-screen gap-3 mt-10'>
                        <div className='flex flex-col w-full h-full gap-5'>
                            {
                                invoicesData && invoicesData.map((invoice, index) => 
                                    <div className={`flex flex-col bg-[#D9D9D9] rounded-lg transition-all duration-500 
                                        ${
                                            divStates[index]
                                            ? 'bg-[#F9FAFC] px-5 md:px-10 lg:px-32 py-10'
                                            : 'bg-[#D9D9D9] px-5 md:px-10 lg:px-14 pt-5'
                                        }
                                    `}>
                                        <div onClick={() => toggleDiv(index)} className='flex flex-col gap-1 cursor-pointer'>
                                            <h className='text-2xl font-bold text-orange-600'>{invoice.invoice.invoiceFor === 'admin' ? 'Admin' : 'Ajenti'}</h>
                                            <div className='flex flex-row justify-between gap-5 lg:gap-10'>
                                                <div className={`flex-col text-sm text-gray-500 ${invoice.invoice.invoiceFor == 'admin' ? 'hidden' : 'flex'}`}>
                                                    <span>{invoice.agent?.firstName} {invoice.agent?.lastName}</span>
                                                    <span>{invoice.agent?.email}</span>
                                                </div>
                                                <div className='flex-col hidden text-sm text-gray-500 md:flex'>
                                                    <span>Invoice Number</span>
                                                    <span className='font-bold text-black'>{invoice.invoice.invoiceNumber}</span>
                                                </div>
                                                <div className='flex-col hidden text-sm text-gray-500 md:flex'>
                                                    <span>{format(new Date(invoice.invoice.dateCreated), 'dd-MM-yyyy')}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div
                                            className={`flex flex-col gap-10 bg-white border-[1px] rounded-3xl border-gray-200 py-5 px-5 transition-all duration-500 overflow-hidden text-sm text-gray-500 ${
                                                divStates[index] ? " mt-10 opacity-100 min-h-fit" : "max-h-0 opacity-0"
                                            }`}
                                        >
                                            <div className='flex flex-row justify-between'>
                                                <div className='flex flex-row gap-10 sm:gap-20 lg:gap-32'>
                                                    <div className='flex flex-col justify-between h-full gap-5'>
                                                        <div className='flex flex-col gap-1'>
                                                            <label>Billed to</label>
                                                            <span className='font-bold text-black'>{invoice.job.company}</span>
                                                            <span>{invoice.job.location}</span>
                                                        </div>
                                                        <div className='flex flex-col'>
                                                            <label>Subject</label>    
                                                            <span className='font-bold text-black'>Recrutimi i puntorit</span>
                                                        </div>
                                                    </div>
                                                    <div className='flex flex-col justify-between h-full gap-8'>
                                                        <div className='flex flex-col'>
                                                            <label>Invoice Number</label>    
                                                            <span className='font-bold text-black'>{invoice.invoice.invoiceNumber}</span>
                                                        </div>
                                                        <div className='flex flex-col'>
                                                            <label>Invoice Date</label>    
                                                            <span className='font-bold text-black'>{format(new Date(invoice.invoice.dateCreated), 'dd-MM-yyyy')}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                {/* <div className='flex flex-col text-sm text-gray-500'>
                                                    <span>Totali</span>
                                                    <span className='text-xl font-bold text-orange-600'>€{invoice.total}</span>
                                                </div> */}
                                            </div>
                                            <div className='flex flex-col py-5 md:py-10'>
                                                <div className='flex flex-row w-full lg:w-[70%] py-2 gap-5 border-y-[1px] border-gray-300 px-1 justify-between lg:text-base text-xs'>
                                                    <label className='font-bold'>ITEM DETAIL</label>
                                                    <div className='flex-row hidden gap-5 sm:flex lg:gap-10'>
                                                        <label className='font-bold w-[30px] md:w-[50px]'>QTY</label>
                                                    </div>
                                                </div>
                                                <div className='flex flex-row w-full lg:w-[70%] py-5 gap-5 border-b-[1px] border-gray-300 px-1 justify-between lg:text-base text-xs'>
                                                    <div className='flex flex-col gap-1'>
                                                        <label className='font-bold text-black'>{invoice.job.position}</label>
                                                        {/* <span>{invoice.itemDetails.description}</span> */}
                                                    </div>
                                                    <div className='flex-row hidden gap-5 text-black sm:flex lg:gap-10'>
                                                        <label className='font-semibold w-[30px] md:w-[50px]'>1</label>
                                                    </div>
                                                </div>
                                                <div className='sm:hidden flex flex-col w-full md:w-[70%] py-2 gap-1 border-b-[1px] border-gray-300 px-1 justify-between md:text-base text-xs'>
                                                    <div className='flex flex-row justify-between gap-10'>
                                                        <label className='font-bold w-[30px] md:w-[50px]'>QTY</label>
                                                    </div>
                                                    <div className='flex flex-row justify-between gap-10 text-black md:gap-10'>
                                                        <label className='font-semibold w-[30px] md:w-[50px]'>1</label>
                                                    </div>
                                                </div>
                                                <div className='flex flex-row w-full lg:w-[70%] pt-2 px-1 justify-end lg:justify-between'>
                                                    <div className='flex flex-col gap-1 min-w-[100px]'>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Invoices;