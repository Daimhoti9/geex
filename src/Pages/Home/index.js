import React  from 'react';
import axios from 'axios';
import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BarChart from '../../Components/Home/BarChart';
import DonutChart from '../../Components/Home/DonutChart';
import LineChart from '../../Components/Home/LineChart';
import { format } from 'date-fns';
import NavBar from '../../Components/NavBar'
import RecruiterContext from '../../Components/RecruterContext';
import SideBar from '../../Components/sidebar';

import Search from '../../Resources/Icons/search.png'
import Line from '../../Resources/line.png'

const Dashboard = () => {

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

    const [data, setData] = useState([44, 55, 41, 67, 22, 43, 21]);
    const data2 = [100, -6418, 40056, 3026, 136, -12056, 100, 60418, -456, -3026, 136, -12056, 100, 6418, 456, 3026, 136, 12056, 100, 6418, 456, 3026, 136, 12056];
    const data3 = [100, 6418, 456, 3026, 136, 12056, 100, 6418, 456, 3026, 136, 12056];

    const [recruiters, setRecruiters] = useState([]);
    const [jobs, setJobs] = useState([]);
    const [agents, setAgents] = useState([]);

    const [recrutments, setRecrutments] = useState([]);

    const fetchRecruiter =  async() => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/recruiter/getallrecruiters`);
            setRecruiters(response.data);
            setRecrutments(response.data.filter((recruter) => { return recruter.status == 'Inactive'}))
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
    const fetchAgents =  async() => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/agent/getallagents`);
            setAgents(response.data);
        } catch (error) {
            console.error('Error fetching the Agents: ', error.message);
        }
    }

    function countOccurrences(array) {
        const countMap = {};
        array.forEach(item => {
            const date = item.dateCreated.split('T')[0]; // Extracting only the date part
            countMap[date] = (countMap[date] || 0) + 1;
        });
        return Object.values(countMap); // Return only the count values
    }

    const donutData = [agents.length, recruiters.length, jobs.length ]

    const [agentsCount, setAgentsCount] = useState(countOccurrences(agents));
    const [recrutersCount, setRecrutersCount] = useState(countOccurrences(recruiters));
    const [jobsCount, setJobsCount] = useState(countOccurrences(recrutments));

    useEffect(() => {
        fetchRecruiter();
        fetchJobs();
        fetchAgents();
        const agentsCounts = countOccurrences(agents);
        setAgentsCount(agentsCounts);
        console.log(recrutments);
    }, []);

    useEffect(() => {
        const agentsCounts = countOccurrences(agents);
        setAgentsCount(agentsCounts);
        const recrutersCount = countOccurrences(recruiters);
        setRecrutersCount(recrutersCount);
        const jobsCount = countOccurrences(recrutments);
        setJobsCount(jobsCount);
    }, []);

    const { sideBarStatus } = useContext(RecruiterContext);

    return (
        <div className='w-screen h-screen bg-white'>
            <div className={`h-full absolute top-0 right-0 flex flex-col items-center pt-10 transition-all duration-500 ${sideBarStatus ? 'w-screen sm:w-[95%] md:w-[95%] lg:w-[80%] xl:w-[85%] 2xl:w-[85%]' : 'w-screen sm:w-[95%] md:w-[95%] xl:w-[95%]'}`}>
                <div className='flex sm:w-[90%] lg:w-[80%] w-screen flex-row items-center justify-between gap-10'>
                    <h className='text-3xl font-bold'>Dashboard</h>
                    <div className='flex flex-row bg-gray-300 w-[50%] rounded-lg p-3'>
                        <input type='text' className='w-full h-full bg-gray-300 border-none rounded-lg outline-none' placeholder='search...' />
                        <img src={Search} className='w-5 h-5' />
                    </div>
                    <NavBar />
                </div>
                <div className='sm:w-[90%] lg:w-[80%] w-screen mt-20 h-screen flex flex-col gap-10'>
                    <div className='grid grid-cols-1 gap-10 px-10 sm:grid-cols-3 sm:px-0'>
                        <div className='flex flex-row justify-between gap-5 p-5 shadow-md xl:p-10 rounded-xl'>
                            <div className='flex flex-col gap-3'>
                                <span>Recruiter</span>
                                <span className='text-xl font-bold lg:text-2xl xl:text-3xl'>{recruiters.length}</span>
                            </div>
                            <div className=''>
                                <LineChart data={recrutersCount}/>
                            </div>
                        </div>
                        <div className='flex flex-row justify-between gap-5 p-5 shadow-md xl:p-10 rounded-xl'>
                            <div className='flex flex-col gap-3'>
                                <span>Agents</span>
                                <span className='text-xl font-bold lg:text-2xl xl:text-3xl'>{agents.length}</span>
                            </div>
                            <div>
                                <LineChart data={agentsCount}/>
                            </div>
                        </div>
                        <div className='flex flex-row justify-between gap-5 p-5 shadow-md xl:p-10 rounded-xl'>
                            <div className='flex flex-col justify-between h-full gap-5 xl:gap-10'>
                                <div className='flex flex-col gap-3'>
                                    <span>Successful Recrutment</span>
                                    <span className='text-xl font-bold lg:text-2xl xl:text-3xl'>{recrutments.length}</span>
                                </div>
                            </div>
                            <div>
                                <LineChart data={jobsCount} />
                            </div>
                        </div>
                    </div>
                    <div className='flex flex-col gap-5 px-10 sm:flex-row sm:px-0 sm:gap-10'>
                        <BarChart data={recrutments} />
                        <DonutChart data={donutData}/>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;