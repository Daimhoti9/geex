import React, { useState } from 'react';
import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import RecruiterContext from '../../Components/RecruterContext';
import NavBar from '../../Components/NavBar'
import Search from '../../Resources/Icons/search.png'
import axios from 'axios';
import dots from '../../Resources/Icons/Group 10.png'
import Profile from '../../Resources/Ellipse 16.png'

const Notifications = () => {

    const navigate = useNavigate();
    const [update, setUpdate] = useState(false);

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
    const [transferNotifications, setTransferNotifications] = React.useState([]);
    const [jobNotifications, setJobNotifications] = useState([]);
    const [notifications, setNotifications] = useState([]);


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

    const fetchData = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/notification/getallnotifications`);
            const notifications = response.data.filter((notification) => {return notification.recruiter !== null});
            const jobNotifications = response.data.filter((notification) => {return notification.recruiter == null});

            console.log('filtered jobs', jobNotifications);
            console.log('filtered transfer', notifications);
    
            // Array to store promises for fetching additional data
            const transferPromises = notifications.map(async (notification) => {
                const agentPromise = axios.get(`${process.env.REACT_APP_BACKEND_URL}/agent/getagent/${notification.agent}`);
                const jobPromise = axios.get(`${process.env.REACT_APP_BACKEND_URL}/job/getjob/${notification.job}`);
                const recruiterPromise = axios.get(`${process.env.REACT_APP_BACKEND_URL}/recruiter/getrecruiter/${notification.recruiter}`);
    
                // Wait for all promises to resolve
                const [agentResponse, jobResponse, recruiterResponse] = await Promise.all([agentPromise, jobPromise, recruiterPromise]);
                // Construct description
                const description = `${agentResponse.data.firstName} recommended ${recruiterResponse.data.firstName} for ${jobResponse.data.company}`;
    
                // Return processed notification
                return {
                    ...notification,
                    time: calculateTimeDifference(notification.creationDate, getCurrentDateTimeString()),
                    description: description
                };
            });

            const JobPromises = jobNotifications.map(async (notification) => {
                const agentPromise = axios.get(`${process.env.REACT_APP_BACKEND_URL}/agent/getagent/${notification.agent}`);
                const jobPromise = axios.get(`${process.env.REACT_APP_BACKEND_URL}/job/getjob/${notification.job}`);
    
                // Wait for all promises to resolve
                const [agentResponse, jobResponse] = await Promise.all([agentPromise, jobPromise]);
                // Construct description
                const description = `${agentResponse.data.firstName} recommended ${jobResponse.data.company}`;
    
                // Return processed notification
                return {
                    ...notification,
                    time: calculateTimeDifference(notification.creationDate, getCurrentDateTimeString()),
                    description: description
                };
            });
    
            // Wait for all promises to resolve
            const processedTransferNotifications = await Promise.all(transferPromises);
            const processedJobNotifications = await Promise.all(JobPromises);

            console.log('processed jobs', processedJobNotifications);
            console.log('prcessed transfers', processedTransferNotifications);
    
            // Update notifications state without resetting
            setTransferNotifications(processedTransferNotifications);
            setJobNotifications(processedJobNotifications);
        } catch (error) {
            console.error('Error fetching notifications: ', error.message);
        }
    };
    
    
    

    const deleteNotification = async (_id) => {
        try {
            const response = await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/notification/deletenotification/${_id}`);
            let updatedNotification=notifications.filter(notification =>response.data._id!=notification._id)
            setNotifications(updatedNotification);
        } catch (error) {
            console.error('Error fetching the Agents: ', error.message);
        }
    }
    const handleAccept = () => {
        //Transfer job to that employee
        //check if that job exists in the data base
    }

    

    React.useEffect(() => {
        fetchData();
    }, [update]);

    useEffect(() => {
        // Combine the arrays using the spread operator
        const combinedArray = [...transferNotifications, ...jobNotifications];

        // Sort the combined array based on the creationDate property
        combinedArray.sort((a, b) => new Date(b.creationDate) - new Date(a.creationDate));

        // Update the state with the sorted combined array
        setNotifications(combinedArray);
    }, [transferNotifications, jobNotifications]);


    function calculateTimeDifference(startDateStr, endDateStr) {
        const startDate = new Date(startDateStr);
        const endDate = new Date(endDateStr);
        const difference = Math.abs(endDate - startDate) / 1000; // Difference in seconds
    
        if (difference < 60) {
            return `${Math.floor(difference)} seconds ago`;
        } else if (difference < 3600) {
            const minutes = Math.floor(difference / 60);
            return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
        } else if (difference < 86400) {
            const hours = Math.floor(difference / 3600);
            return `${hours} hour${hours > 1 ? 's' : ''} ago`;
        } else {
            const days = Math.floor(difference / 86400);
            return `${days} day${days > 1 ? 's' : ''} ago`;
        }
    }

    const handleAcceptClick = async (_id) => {
        try {
            const status = 'accepted';
            const response = await axios.put(`${process.env.REACT_APP_BACKEND_URL}/notification/updatestatus/${_id}`, {
                params: {
                    status: status
                }
            });
            setUpdate(!update)
        } catch (error) {
            console.error('Error fetching the Agents: ', error.message);
        }
    }
    const handleRejectClick = async (_id) => {
        try {
            const status = 'rejected';
            const response = await axios.put(`${process.env.REACT_APP_BACKEND_URL}/notification/updatestatus/${_id}`, {
                params: {
                    status: status
                }
            });
            setUpdate(!update)
        } catch (error) {
            console.error('Error fetching the Agents: ', error.message);
        }
    }

    const [selected, setSelected] = useState();
    const handleTransfer = async (notification) => {
        try {
            const role = 'agent';
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/job/transferjobnotification`, {notification});
        } catch (error) {
            console.error('Error fetching the Agents: ', error.message);
        }
    }

    const handleJob = async (notification) => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/job//updatestatus/${notification.job}`);
        } catch (error) {
            console.error('Error fetching the Agents: ', error.message);
        }
    }

    const downloadDocument = async (originalFilename, downloadFilename) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/download-recruiter-doc/${originalFilename}`);
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

    function parseName(string){
        let str=string.split("-_-")[1]
        let result= str.substring(0,str.lastIndexOf("."))
        return result
    }

    const handleDocDownload = async (recruiter) => {
        try{
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/recruiter/getrecruiter/${recruiter}`);        
            response.data.docs.forEach(doc => { 
                downloadDocument(doc,parseName(doc))
            });
            console.log(response.data);
        } catch (error) {
            console.log(error.message);
        }


    } 
    
    return (
        <div className='w-screen h-screen bg-gray-50'>
            <div className={`h-full absolute top-24 sm:top-0 right-0 flex flex-col items-center pt-10 transition-all duration-500 ${sideBarStatus ? 'w-screen sm:w-[95%] md:w-[95%] lg:w-[80%] xl:w-[85%] 2xl:w-[85%]' : 'w-screen sm:w-[95%] md:w-[95%] xl:w-[95%]'}`}>
                <div className='flex sm:w-[80%] lg:w-[80%] w-[95%] flex-row items-center justify-between gap-10'>
                    <h className='text-3xl font-bold'>Notifications</h>
                    <div className='flex flex-row bg-gray-300 w-[50%] rounded-lg p-3'>
                        <input onChange='' type='text' className='w-full h-full bg-gray-300 border-none rounded-lg outline-none' placeholder='search...' />
                        <img src={Search} className='w-5 h-5' />
                    </div>
                    <div className='hidden sm:block'>
                        <NavBar />
                    </div>
                </div>
                <div className='sm:w-[80%] lg:w-[80%] w-[95%] mt-10 sm:mt-32 h-screen flex flex-col px-10'>
                    
                    <div className='flex flex-col w-full gap-3 mt-10 bg-white max-h-[60vh] overflow-auto rounded-lg p-5'>
                        {notifications.length > 0 ?  (
                            notifications.map((notification, index) => (
                                <div key={index} className={`rounded-lg px-5 py-2 min-w-full flex flex-row justify-between gap-10 ${notification.read ? 'border-gray-200' : 'bg-[#FDCF8B] bg-opacity-30'}`}>
                                    <div className='flex flex-row gap-5'>
                                        <img src={Profile} className='w-12 h-12' alt='' />
                                        <div className='flex flex-col'>
                                            <span>{notification.description}</span>
                                            <span className='text-gray-500'>{notification.time}</span>
                                        </div>
                                    </div>
                                    <div className={`items-center justify-center h-full gap-2 align-middle ${notification.status !== '' ? 'hidden' : 'flex'}`}>
                                        <button className={`p-1 px-5 font-bold text-white bg-gray-300 rounded-lg ${notification.recruiter == null ? 'hidden' : 'block'}`}
                                        onClick={() =>handleDocDownload(notification.recruiter)}
                                        >Download</button>
                                        <button className='p-1 px-5 font-bold text-white bg-red-500 rounded-lg'
                                        onClick={() =>handleRejectClick(notification._id)}
                                        >Reject</button>
                                        <button onClick={() => {
                                            setSelected(notification);
                                            handleAcceptClick(notification._id);
                                            if(notification.recruiter == null) {
                                                handleJob(notification)
                                            } else {
                                                handleTransfer(notification);
                                            }

                                        }} className='p-1 px-5 font-bold text-white bg-green-500 rounded-lg'>Accept</button>
                                    </div>
                                    <div className={`items-center justify-center h-full gap-2 align-middle ${notification.status !== '' ? 'flex' : 'hidden'}`}>
                                        <button className={`p-2 px-10 font-bold text-white bg-red-300 rounded-lg ${notification.status == 'rejected' ? 'bg-red-300' : 'bg-green-300'}`}
                                        >{notification.status}</button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p>No notifications</p>
                        )}
                    </div>

                </div>
            </div>
        </div>
    )
}

export default Notifications;
