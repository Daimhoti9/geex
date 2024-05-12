import React, { useState } from 'react';
import axios from 'axios';

import Cross from '../../Resources/Icons/x.png';
import FileUpload from '../../Resources/Icons/Import Pdf.png';
import Back from '../../Resources/Icons/icons8-back-52.png'

const Modal = ({ newRecruiterModelStep, setNewRecruiterModelStep, newRecruiterFormData, setBack, update, setUpdate }) => {
    const [docs, setDocs] = useState({
        doc1: { name: '', file: null },
        doc2: { name: '', file: null },
        doc3: { name: '', file: null },
        doc4: { name: '', file: null },
        doc5: { name: '', file: null },
        doc6: { name: '', file: null }
    });

    const handleFileChange = (event, docKey) => {
        const file = event.target.files[0];
        const name = docs[docKey]?.name; 
        const updatedDocs = { ...docs };
        updatedDocs[docKey] = { name, file };
        setDocs(updatedDocs);
    };

    const handleUploadRecruiterDocs = async () => {
        try {
            const formData = new FormData();
            formData.append("recuiterEmail", newRecruiterFormData.email);
            for (const key in docs) {
                if (docs[key].file) {
                    formData.append(docs[key].name, docs[key].file); 
                }
            }
            console.log("formData", formData);
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/recruiter/uploadRecruiterDocs`, formData);
            console.log('Documents uploaded successfully:', response.data);
            setUpdate(!update)
        } catch (error) {
            console.error('Error uploading documents:', error.message);
        }
    };

    return (
        <>
            {newRecruiterModelStep && (
                <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
                    <div className="fixed inset-0 bg-black opacity-50"></div>
                    <div className="relative w-auto mx-auto my-6">
                        <div className="relative flex flex-col w-full bg-white border-0 rounded-lg shadow-lg outline-none focus:outline-none">
                            <div className="flex items-center justify-between gap-20 p-5 px-10 border-b border-solid rounded-t border-blueGray-200 bg-opacity-25 bg-[#52FF00]">
                                <div className='flex flex-row gap-5'>
                                    <img onClick={() => {
                                        setNewRecruiterModelStep(false);
                                        setBack(true);
                                    }} src={Back} className='w-8 h-8 cursor-pointer' alt='back' />
                                    <h3 className="text-xl font-bold text-black">Background Check</h3>
                                </div>
                                <img
                                    src={Cross}
                                    className='w-10 h-10 transition-all duration-200 cursor-pointer hover:scale-110'
                                    onClick={() => setNewRecruiterModelStep(false)}
                                    alt="Close"
                                />
                            </div>
                            <div className='flex flex-col gap-3 px-20 font-normal text-black w-fit bg-[#F8FAFB] py-10 pb-20 max-h-[70vh] overflow-auto'>
                                <div className='grid grid-cols-2 gap-3 gap-x-20'>
                                    {[1, 2, 3, 4, 5, 6].map((index) => (
                                        <div key={index} className='flex flex-col w-[300px] text-right gap-2 mb-12'>
                                            <input
                                                type='text'
                                                name={`doc${index}`}
                                                className='w-full p-2 border-[2px] outline-gray-100 outline-[1px] border-gray-200 bg-white rounded'
                                                placeholder={`Document ${index} Name`}
                                                onChange={(e) => {
                                                    const docKey = `doc${index}`;
                                                    const updatedDocs = { ...docs };
                                                    updatedDocs[docKey].name = e.target.value;
                                                    setDocs(updatedDocs);
                                                }}
                                            />
                                            <div className='relative cursor-pointer'>
                                                <div className='flex flex-row gap-2 p-2 border-2 border-black w-[180px] absolute top-0 left-0 cursor-pointer rounded-full'>
                                                    <img src={FileUpload} className='w-5 h-5' alt='' />
                                                    <label className='text-sm font-medium'>Upload Document</label>
                                                </div>
                                                <input
                                                    type='file'
                                                    className='w-[180px] absolute top-0 left-0 opacity-0 cursor-pointer'
                                                    onChange={(e) => handleFileChange(e, `doc${index}`)}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="flex items-center justify-between p-4 border-t border-solid rounded-b">
                                <button
                                    className="px-10 py-4 mb-1 mr-1 text-black text-md font-bold bg-opacity-25 bg-[#52FF00] rounded uppercase transition-all duration-150 ease-linear outline-none background-transparent focus:outline-none"
                                    type="button"
                                    onClick={() => {
                                        handleUploadRecruiterDocs();
                                        setNewRecruiterModelStep(false);
                                    }}
                                >
                                    Document Uploaded
                                </button>
                                <button
                                    className="px-20 py-4 mb-1 mr-1 text-sm font-bold bg-[#F8FAFB] rounded uppercase transition-all duration-150 ease-linear outline-none background-transparent focus:outline-none"
                                    type="button"
                                    onClick={() => setNewRecruiterModelStep(false)}
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
};

export default Modal;
