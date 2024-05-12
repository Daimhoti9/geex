import React, { useEffect } from 'react';
import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


import Bell from '../Resources/Icons/bell.png'

const NavBar = () => {

    const navigate = useNavigate();
    const [div, setDiv] = useState(false);

    const [user, setUser] = useState();
    const email = sessionStorage.getItem('user');
    const role = sessionStorage.getItem('role');

    const getUser = async () => {
        try {
            if(role == 'admin') {
                const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/user/getuser`, {
                                params: {
                                    email: email
                                }
                            })

                setUser(res.data);
                console.log(res.data);
            } else {
                const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/agent/getAgentByEmail`, {
                    params: {
                        email: email
                    }
                });
                setUser(response.data.agent);
                console.log(response.data.agent);
            }
        } catch (error) {
            console.log(error.message);
        }
        
    }

    useEffect(() => {
        getUser();
    },[]) 

    return(
        <div className='flex flex-row items-center gap-10'>
            <div onClick={() => setDiv(!div)} className='relative flex items-center justify-center w-10 h-10 text-center align-middle bg-gray-200 rounded-lg cursor-pointer'>
                {
                    role == 'admin' ? <span className='text-2xl font-bold'>A</span>
                    : user?.profileImage ? <img src={user.profileImage} className='w-full h-full' />
                    : <span className='text-xl font-bold'>{user?.firstName ? user.firstName.charAt(0).toUpperCase() : ''}</span>
                }
                <div className={`flex flex-col gap-2 absolute -bottom-[76px] left-0 bg-gray-200 rounded-lg w-[100px] p-2 ${ div ? 'block' : 'hidden'}`}>
                    {
                        role == 'admin' ? <span className='cursor-pointer border-b-[1px] border-black'>Admin</span>
                        : <span className='cursor-pointer'>{user?.firstName} {user?.lastName}</span>
                    }
                    <span className='cursor-pointer border-b-[1px] border-black' onClick={() => {sessionStorage.clear(); navigate('/')}}>Logout</span>
                </div>
            </div>
        </div>
    )
}

export default NavBar;