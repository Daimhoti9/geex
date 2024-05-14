import React from 'react';
import { useState } from 'react';
import axios from 'axios';

import Cross from '../../Resources/Icons/x.png'
import Upload from '../../Resources/Icons/Upload.png'
import CV from '../../Resources/Icons/CV.png'
import Logo from '../../Resources/logo.jpg'
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { toast } from 'react-toastify';



const Modal = ({ newRecruiterModelStep, setNewRecruiterModelStep, newRecruiterFormData, setNewRecruiterFormData, setUpdate, update, methodOfPayment }) => {





    function checkImageExists(imagePath) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(true); // Image loaded successfully
            img.onerror = () => resolve(false); // Image failed to load
            img.src = imagePath;
        });
    }
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }




    function generateRandom5DigitString() {
        // Generate a random number between 10000 (inclusive) and 99999 (inclusive)
        const randomNumber = Math.floor(Math.random() * 90000) + 10000;

        // Convert the random number to a string
        const randomString = randomNumber.toString();

        return randomString;
    }


    const generateInvoicePdf = async () => {
        // Create a new jsPDF instance
        const doc = new jsPDF();

        // Set properties for border and padding
        const borderWidth = 5; // Border width
        const padding = 10; // Padding within the border
        const contentWidth = doc.internal.pageSize.getWidth() - 2 * (padding);
        const tableWidth = 60; // Adjusted table width

        // Draw black border with padding
        doc.setDrawColor(0); // Black border color
        doc.rect(padding, padding, contentWidth, doc.internal.pageSize.getHeight() - 2 * (padding), 'D'); // Draw border (D = 'stroke' only)

        const textBoxX = padding + contentWidth - 35; // X position for text box
        const textBoxY = padding + borderWidth - 10; // Y position for text box
        const textBoxWidth = 100; // Width of the text box
        const textBoxHeight = 15; // Height of the text box
        doc.setFillColor(0, 0, 0); // Black background color
        doc.rect(textBoxX, textBoxY, textBoxWidth, textBoxHeight, 'F'); // Draw filled rectangle
        doc.setTextColor(255, 165, 0); // Orange text color
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(19);
        doc.text('INVOICE', textBoxX + 5, textBoxY + 10); // Adjust text position within the box
        doc.setFont('helvetica', 'normal');

        doc.setTextColor(0, 0, 0); // Orange text color

        const logoImg = new Image();
        logoImg.src = Logo; // Provide path to your logo image
        await sleep(1000); // Wait for the image to load (simulating async behavior)
        const logoWidth = 25; // Adjust width of logo as needed
        const logoHeight = Math.round((logoWidth * logoImg.height) / logoImg.width);
        const logoX = padding + borderWidth; // X position of logo (inside the border)
        const logoY = padding + borderWidth; // Y position of logo (inside the border)
        doc.addImage(logoImg, 'JPEG', logoX, logoY, logoWidth, logoHeight);

        // Add Invoice Info at top right
        const invoiceNo = 'INV-' + generateRandom5DigitString();

        // Extract day, month, and year from the current date
        const currentDate = new Date();

        const day = currentDate.getDate().toString().padStart(2, '0'); // Day (with leading zero if needed)
        const month = (currentDate.getMonth() + 1).toString().padStart(2, '0'); // Month (adding 1 because January is 0)
        const year = currentDate.getFullYear(); // Full year

        // Form the desired date string in 'DD/MM/YYYY' format
        const date = `${day}/${month}/${year}`;

        const invoiceInfoX = padding + contentWidth - 50; // X position at top right
        const invoiceInfoY = padding + borderWidth + 40; // Y position (inside the border)
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text(`Invoice#:`, invoiceInfoX, invoiceInfoY);
        doc.setFont('helvetica', 'normal');
        doc.text(`${invoiceNo}`, invoiceInfoX + 25, invoiceInfoY);

        doc.setFont('helvetica', 'bold');
        doc.text(`Date:`, invoiceInfoX, invoiceInfoY + 7);
        doc.setFont('helvetica', 'normal');
        doc.text(`${date}`, invoiceInfoX + 25, invoiceInfoY + 7);
        // Add Invoice To section in the body
        const invoiceToY = padding + borderWidth + 50; // Y position below border and top info
        doc.setFontSize(15);
        doc.setFont('helvetica', 'bold');
        doc.text('Invoice To', padding + borderWidth, invoiceToY);
        doc.setFont('helvetica', 'normal');
        const recruiterName = newRecruiterFormData.firstName + " " + newRecruiterFormData.lastName;
        const recruiterAddress = newRecruiterFormData.email;
        const recruiterPhone = newRecruiterFormData.nationality | '0342055086';

        doc.setFontSize(10);
        doc.text(`${recruiterName}`, padding + borderWidth, invoiceToY + 8);
        doc.setFontSize(8);
        doc.text(`${recruiterAddress}`, padding + borderWidth, invoiceToY + 8 + 8);
        doc.text(`${recruiterPhone}`, padding + borderWidth, invoiceToY + 8 + 8 + 5);


        // Define table headers and data
        const tableHeaders = ['SL', 'ITEM', 'PRICE', 'QTY', 'TOTAL'];
        const tableData = [
            ['1', 'REGISTRATION FEE', '30 €', '1', '30 €'],
            [''],
            [''],
            [''],
            [''],
            [''],
            [''],


        ];

        // Position the table
        const tableY = invoiceToY + 40; // Y position below Invoice To section

        // Configure table styles
        doc.autoTable({
            startY: tableY,
            head: [tableHeaders],
            body: tableData,
            theme: 'striped',
            styles: {
                lineWidth: 0.5,
                fontSize: 8,
                cellPadding: 4,
                valign: 'middle',
                halign: 'center',
                tableWidth: tableWidth, // Set the table width
            },
            headStyles: {
                fillColor: [0, 0, 0], // Black background for header
                textColor: [255, 165, 0], // Orange text color for header
                fontSize: 10,
                fontStyle: 'bold',
                cellPadding: 4,
            },
            columnStyles: {
                0: { halign: 'center' }, // SL column
                1: { cellWidth: 'center' }, // ITEM column (allow wrapping)
                2: { halign: 'center' }, // PRICE column
                3: { halign: 'center' }, // QTY column
                4: { halign: 'center' }, // TOTAL column
            },

            
        });

        // Add Sub Total and Terms & Conditions on the right side
        const subtotalX = padding + contentWidth - 70; // X position at top right
        const subtotalY = tableY + (tableData.length + 1) * 15 - 10; // Y position below table
        doc.setFontSize(10);

        doc.text('Sub Total:', subtotalX, subtotalY);
        doc.text('30 €', subtotalX + 50, subtotalY);

        const totalX = padding + contentWidth - 70; // X position at top right
        const totalY = doc.internal.pageSize.getHeight() - padding - borderWidth - 55; // Y position at bottom right
        doc.setFillColor(255, 165, 0); // Orange fill color
        doc.rect(totalX - 5, totalY - 5, 70, 10, 'F'); // Draw filled rectangle for background
        doc.setFontSize(11);

        doc.setFont('helvetica', 'bold');
        doc.text('Total:', totalX, totalY + 2);
        doc.text('30 €', totalX + 50, totalY + 2);

        doc.setFont('helvetica', 'normal');

        doc.setFontSize(8);

        const termsX = padding + borderWidth; // X position at top left
        const termsY = subtotalY + 14; // Y position below Sub Total
        doc.setFont('helvetica', 'bold');

        doc.setFont('helvetica', 'normal');


        // Add Payment Method at the bottom left
        const paymentMethodX = padding + borderWidth; // X position at bottom left
        const paymentMethodY = doc.internal.pageSize.getHeight() - padding - borderWidth - 40; // Y position at bottom left
        doc.setFont('helvetica', 'bold');

        doc.text('Payment Method', paymentMethodX, totalY + 2);
        doc.setFont('helvetica', 'normal');

        doc.text(methodOfPayment, paymentMethodX, totalY + 10);

        console.log("CREATONG PDF")

        // Add a new page for terms and conditions
        doc.addPage();

        // Set properties for border and padding for the terms and conditions page
        const tcBorderWidth = 1; // Border width
        const tcPadding = 20; // Padding within the border
        const tcContentWidth = doc.internal.pageSize.getWidth() - 2 * (tcPadding);


        // Set font and size for terms and conditions


        doc.setFontSize(15);
        doc.setFont('helvetica', 'bold');
        doc.text("Terms and Conditions for Payment of Service Fee", (doc.internal.pageSize.getWidth()/2) - 70, 25)
        

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(12);
        

        // Define terms and conditions content
        const termsAndConditions = `
1. Service Fee: By registering for our services, you agree to pay the specified service fee as outlined during the registration process. This fee is non-refundable and constitutes a registration fee for accessing and utilizing our services.

2. Payment Terms: Payment of the service fee is due upon registration and must be made in full before accessing any services offered by Global Consultancy Services. We accept payment through bank transfer and cash.

3. Non-Refundable Tariffs: Please note that the tariffs or fees associated with our services are non-refundable. Once payment is made, it is considered final and cannot be refunded under any circumstances, including but not limited to cancellation of services, changes in plans, or dissatisfaction with the services provided.

4. Service Activation: Upon successful payment of the service fee, your registration will be activated, and you will gain access to the services as per the terms and conditions outlined in our service agreement.

5. Cancellation and Termination: Global Consultancy Services reserves the right to cancel or terminate your registration and access to services if payment is not received as per the agreed terms or if there is a violation of our terms and conditions.

6. Changes to Terms: Global Consultancy Services reserves the right to modify or update these terms and conditions regarding payment of service fees. Any changes will be communicated to you in advance, and your continued use of our services will indicate your acceptance of the modified terms.

7. Contact Information: If you have any questions or concerns regarding the payment of service fees or these terms and conditions, please contact us at info@gcs-eu.com 

By proceeding with the registration and payment of the service fee, you acknowledge that you have read, understood, and agreed to abide by these terms and conditions.`;

        // Add terms and conditions content to the page
        const termsAndConditionsLines = doc.splitTextToSize(termsAndConditions, tcContentWidth - 10); // Adjust the width as needed
        doc.text(termsAndConditionsLines, tcPadding + 5, tcPadding + 10);
        // Add terms and conditions content to the page

        // Save the PDF with a filename

        try {
            // Save the PDF as a blob
            const pdfBlob=doc.output('blob');
            doc.save(date+"-"+invoiceNo+'.pdf');

            
            // Create FormData to send the PDF file
            const formData = new FormData();
            formData.append('filePDFF', pdfBlob, newRecruiterFormData.email+"_"+date+"-"+invoiceNo+'.pdf');

            // Send the PDF file to the backend using fetch
            const url = `${process.env.REACT_APP_BACKEND_URL}/invoice/addInvoicePDF`;

            const response = await fetch(url, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            console.log('PDF file sent successfully to the backend.');

            // Handle success response from backend if needed
            const responseData = await response.json();
            console.log('Backend response:', responseData);
        } catch (error) {
            console.error('Error occurred while sending PDF file:', error);
            // Handle fetch error
        }
    };



    const handleAddRecruiter = async () => {
        try {
            console.log("sending data", newRecruiterFormData);
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/recruiter/addrecruiter`, newRecruiterFormData);
            setUpdate(!update);
            generateInvoicePdf();
            setNewRecruiterFormData({
                firstName: '',
                lastName: '',
                email: '',
                passport: '',
                dateOfBirth: Date.now(),
                birthPlace: '',
                gender: '',
                nationality: '',
                issuance: Date.now(),
                expiry: Date.now(),
                id: '',
                coverLetter: '',
                status: 'Active',
                serviceFee: 30,
                progress: 0,
            })
        } catch (error) {
            console.error('Error adding Recruiter', error.message);
            toast.error(error.message);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewRecruiterFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const [paymentMethod, setPaymentMethod] = useState();
    const [payment, setPayment] = useState(false);


    return (
        <>
            {newRecruiterModelStep && (
                <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
                    <div className="fixed inset-0 bg-black opacity-50"></div>
                    <div className="relative w-auto mx-auto my-6">
                        <div className="relative flex flex-col w-full bg-white border-0 rounded-lg shadow-lg outline-none focus:outline-none">
                            <div className='flex flex-col items-center w-full gap-5 px-32 py-10 font-normal text-black '>
                                <div className='text-center'>
                                    <p className='mb-3 text-lg'>Have you received the fee amount of 30 euros?</p>
                                    <button
                                        onClick={() => setPayment(true)}
                                        className={`px-6 py-3 mb-3 text-sm font-bold text-black border-[#FFF500] border-[1px]  rounded-full uppercase transition-all duration-150 hover:bg-[#FFF500] ease-linear outline-none background-transparent focus:outline-none 
                                        ${payment ? 'bg-[#FFF500]' : 'bg-transparent'}`}
                                    >
                                        Yes
                                    </button>
                                </div>
                                <textarea
                                    className='w-full p-2 border-[2px] outline-[#FFF500] outline-[1px] border-[#FFF500] bg-white rounded'
                                    rows={4}
                                    placeholder='Additional comments...'
                                    onChange={handleInputChange}
                                    name='additionalComments'
                                />
                                <div className="flex items-end justify-end w-full gap-2">
                                    <button
                                        className="px-6 py-1 text-sm font-bold text-red-500 uppercase transition-all duration-150 ease-linear bg-white border-2 border-red-500 rounded outline-none background-transparent focus:outline-none"
                                        type="button"
                                        onClick={() => setNewRecruiterModelStep(false)}
                                    >
                                        Anulo
                                    </button>
                                    <button
                                        className="px-6 py-1 text-sm font-bold text-black bg-[#FFF500] rounded uppercase transition-all duration-150 ease-linear border-2 border-[#FFF500] outline-none background-transparent focus:outline-none"
                                        type="button"
                                        onClick={() => {
                                            handleAddRecruiter();
                                            setNewRecruiterModelStep(false);
                                        }}
                                    >
                                        Confirm
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default Modal;
