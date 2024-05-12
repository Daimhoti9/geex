import React from 'react';
import Cross from '../../Resources/Icons/x.png';

const DocsDownload = ({ recruiterData, showDocDownload, onClose }) => {

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


    if (!showDocDownload || !recruiterData) {
        return <></>
    }

    const handleDownloadAll = () => {
        recruiterData.docs.forEach(doc => { 
            downloadDocument(doc,parseName(doc))
        });
    }
    

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
            <div className="fixed inset-0 bg-black opacity-50"></div>
            <div className="relative w-auto mx-auto my-6">
                <div className="relative flex flex-col w-full bg-white border-0 rounded-lg shadow-lg outline-none focus:outline-none">
                    <div className="flex items-center justify-between gap-20 p-5 px-10 border-b border-solid rounded-t border-blueGray-200 bg-opacity-25 bg-[#52FF00]">
                        <h3 className="text-xl font-bold text-black">Uploaded Documents</h3>
                        <img
                            src={Cross}
                            className='w-10 h-10 transition-all duration-200 cursor-pointer hover:scale-110'
                            onClick={onClose}
                            alt="Close"
                        />
                    </div>
                    <div className='flex flex-col gap-3 w-full pl-10 font-normal text-black py-10 pb-20 max-h-[70vh] overflow-auto'>
                        {/* Title/Heading */}
                        {/* <h4 className="mb-4 text-lg font-semibold">Available Documents:</h4> */}

                        <button onClick={() => {handleDownloadAll()}} className='px-5 p-2 bg-gray-300 w-[150px] self-end mr-5 hover:bg-gray-400 transition-all duration-300'>Download All</button>

                        {/* List of documents for download */}
                        <ul className="space-y-4">
                            {recruiterData.docs.map((doc, index) => (
                                <li key={index}>
                                    <span className="text-blue-500 hover:underline hover:cursor-pointer" onClick={()=>downloadDocument(doc,parseName(doc))}>
                                        {doc.split("-_-")[1]}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default DocsDownload;
