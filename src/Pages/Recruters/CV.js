import React from 'react';
import { useState } from 'react';
import axios from 'axios';

import Cross from '../../Resources/Icons/x.png'
import Upload from '../../Resources/Icons/Upload.png'
import CV from '../../Resources/Icons/CV.png'

const Modal = ({ newRecruiterModelStep, setNewRecruiterModelStep,newRecruiterFormData ,setNewRecruiterFormData }) => {


    // const handleAddRecruiter = async () => {
    //     try {
    //         console.log("sending data");
    //         const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/recruiter/addrecruiter`, formData);
    //         console.log("data sent");
    //     } catch (error) {
    //         console.error('Error adding Recruiter', error.message);
    //     }
    // };
    
    // const [formData, setFormData] = useState({
    //     firstName: '',
    //     lastName: '',
    //     email: '',
    //     id: '',
    //     mobile: '',
    //     coverLetter: '',
    //     status: 'Active',
    // });

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setNewRecruiterFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };
    
    return (
        <>
            {newRecruiterModelStep==7 && (
                <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
                    <div className="fixed inset-0 bg-black opacity-50"></div>
                    <div className="relative w-auto mx-auto my-6">
                        <div className="relative flex flex-col w-full bg-white border-0 rounded-lg shadow-lg outline-none focus:outline-none">
                            <div className="flex items-center justify-between gap-20 p-5 px-10 border-b border-solid rounded-t border-blueGray-200 bg-[#26CF86]">
                                <h3 className="text-xl font-bold text-white">CV Generator</h3>
                                <img src={Cross} className='w-10 h-10 transition-all duration-200 cursor-pointer hover:scale-110' onClick={() => setNewRecruiterModelStep(0)} />
                            </div>
                            <div className='flex flex-col gap-10 px-20 font-normal text-black w-fit bg-[#F8FAFB] py-10 pb-20 max-h-[70vh] overflow-auto'>
                                <div className='min-w-full rounded-lg shadow-2xl h-[200px] 2xl:min-w-[600px] p-3'>
                                    <label className='font-semibold'>CV PUBLIC (without Contact Details)</label>
                                </div>
                                <div className='min-w-full rounded-lg shadow-2xl h-[200px] 2xl:min-w-[600px] p-3'>
                                    <label className='font-semibold'>CV Private</label>
                                </div>
                            </div>
                            <div className="flex items-center justify-between p-4 border-t border-solid rounded-b">
                                <button
                                    className="px-10 py-4 mb-1 mr-1 text-white text-sm font-bold bg-[#26CF86] rounded uppercase transition-all duration-150 ease-linear outline-none background-transparent focus:outline-none"
                                    type="button"
                                    onClick={() => {
                                        // handleAddRecruiter();
                                        setNewRecruiterModelStep(7)
                                    }}
                                >
                                    Application Completed
                                </button>
                                <button
                                    className="px-20 py-4 mb-1 mr-1 text-sm font-bold bg-[#F8FAFB] rounded uppercase transition-all duration-150 ease-linear outline-none background-transparent focus:outline-none"
                                    type="button"
                                    onClick={() => setNewRecruiterModelStep(0)}
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
