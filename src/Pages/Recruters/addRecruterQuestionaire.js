import React from 'react';
import { useState } from 'react';
import axios from 'axios';
import RecruterConfirmModel from './addRecruterConfirm'

import Cross from '../../Resources/Icons/x.png'
import Arrow from '../../Resources/Icons/downArrow.png'
import Upload from '../../Resources/Icons/Upload.png'
import CV from '../../Resources/Icons/CV.png'
import { WorkLink } from 'aws-sdk';
import Logo from '../../Resources/logo_bg_rm.jpg'
import jsPDF from 'jspdf';


const Modal = ({ newRecruiterModelStep, setNewRecruiterModelStep, setAddModal, newRecruiterFormData, setNewRecruiterFormData, setQuestionaire}) => {

    
    const [step, setStep] = useState(1);

    const [contactDetails, setContactDetails] = useState({
        completeAddress: '',
        city: '',
        postalCode: '',
        province: '',
        country: '',
        email: '',
        phoneNumber: '',
        fixNumber: '',
    })

    const [careerGoals, setCareerGoals] = useState({
        targetJob: '',
        industry: '',
        workEnvironment: ''
    })

    const [education, setEducation] = useState({
        degree: '',
        field: '',
        university: '',
        place: '',
        experience: '',
        projects: '',
        information: '',
        responsibilities: '',
        toolAndSoftwares: '',
        approach: ''
    })

    const [workExperiences, setWorkExperiences] = useState([]);

    const [skills, setSkills] = useState([]);
    const [skillsInfo, setSkillsInfo] = useState({
        technicalSkills: '',
        softSkills: '',
        specialSkills: ''
    })

    const [certificates, setCertificates] = useState([]);
    const [languages, setLanguages] = useState([]);
    const [memberships, setMemberships] = useState([]);
    const [volunteerExperinces, setVolunteerExperinces] = useState([]);
    const [achievements, setAchievements] = useState([]);
    const [references, setReferences] = useState([]);

    const [problemSolving, setProblemSolving] = useState({
        challengingSituation: '',
        deadlines: '',
        qualityWork: ''
    })

    const [teamWork, setTeamWork] = useState({
        teamProject: '',
        handleConflicts: '',
        communicationStyle: ''
    })

    const [customerService, setCustomerService] = useState({
        customerSatisfaction: '',
        experience: '',
        strategies: ''
    })

    const [adaptibility, setAdaptibility] = useState({
        adaptToChanges: '',
        learningSituation: '',
        careerGoals: ''
    })

    const [companyMotivation, setCompanyMotivation] = useState({
        interests: '',
        contributions: '',
        fitForPosition: ''
    })

    const [additionalQuestions, setAdditionalQuestions] = useState({
        softwareProficiency: '',
        awardsAndRecognition: '',
        problemSolving: '',
        adaptabilityAndInitiative: '',
        continuousLearning: '',
        coreStrengths: '',
        achievements: ''
    })

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    const generateCVTemp = async (contactDetails1) => {
        let recruiterName=newRecruiterFormData.firstName+" "+newRecruiterFormData.lastName
        let contactDetails=[contactDetails1.email, contactDetails1.phoneNumber, contactDetails1.completeAddress]
        let educationInfo={
            first:{
                toDate:education.year,
                heading: education.university,
                subHeading:education.degree+" | "+education.field,
                addrerss:education.place
            },
            second:{
                toDate:education.year,
                heading: education.university,
                subHeading:education.degree+" | "+education.field,
                addrerss:education.place
            }
        }
        let experienceInfo={
            first:{
                fromDate:workExperiences[0].startDate.split("-")[0],
                toDate:workExperiences[0].endDate.split("-")[0],
                heading:workExperiences[0].company,
                subHeading:workExperiences[0].title,
                addrerss:workExperiences[0].location
            },
            second:{
                fromDate:workExperiences[1].startDate.split("-")[0],
                toDate:workExperiences[1].endDate.split("-")[0],
                heading:workExperiences[1].company,
                subHeading:workExperiences[1].title,
                addrerss:workExperiences[1].location
            }
        }

        let processedLanguages=languages.map(lang=> ({name:lang.name, val:parseInt(lang.proficiency)}))
        

        // Create a new jsPDF instance
        const doc = new jsPDF('p', 'pt', 'a4');

        // Set page properties
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();

        // Draw orange rectangle at the top for background color
        doc.setFillColor('#cb9731');
        doc.rect(0, 0, pageWidth, pageHeight * 0.1, 'F');

        // Draw a white circle behind the logo
        const circleRadius = 80; // Adjust circle radius as needed
        const circleX = (pageWidth - circleRadius * 2) / 2;
        const circleY = pageHeight * 0.1 - circleRadius; // Position above the logo
        doc.setFillColor('#FFFFFF'); // Set color to white
        doc.circle(circleX + circleRadius - 1, circleY + circleRadius + 28, circleRadius, 'F');

        // Insert logo image (replace 'Logo' with your image import)
        const logo = new Image();
        logo.src = Logo; // Provide the path to your logo
        await sleep(500); // Assuming sleep function is defined elsewhere
        const logoWidth = 120; // Adjust logo width as needed
        const logoHeight = 105; // Adjust logo height as needed
        const logoX = (pageWidth - logoWidth) / 2;
        doc.addImage(logo, 'JPEG', logoX, pageHeight * 0.1 - 50, logoWidth, logoHeight);

        // Add 'RECRUITER NAME' heading centered on the page
        const usedColor="#cb9731"
        doc.setFontSize(35);
        doc.setFont('helvetica', 'bold');
        doc.text(recruiterName, pageWidth / 2, pageHeight * 0.35, { align: 'center' });
        doc.setFont('helvetica', 'normal');

        // Add 'CONTACT DETAILS' heading centered on the page
        doc.setFontSize(20);
        doc.setTextColor(usedColor);
        doc.text('CONTACT DETAILS', pageWidth / 2, pageHeight * 0.43 - 10, { align: 'center' });
        doc.setTextColor(0);
        // Add a line below 'CONTACT DETAILS' heading
        doc.setLineWidth(1.2);
        const lineWidth = pageWidth * (2 / 3); // Set the desired length of the line
        const lineY = pageHeight * 0.45;
        const lineStartX = (pageWidth - lineWidth) / 2;
        const lineEndX = lineStartX + lineWidth;
        doc.line(lineStartX, lineY, lineEndX, lineY);

        // Manually specify positions for vertical lines below the horizontal line
        const verticalLine1X = lineStartX + lineWidth / 8;
        const verticalLine2X = lineStartX + lineWidth / 2;
        const verticalLine3X = lineStartX + (3 * lineWidth) / 3.5;
        const verticalLineY1 = lineY;
        const verticalLineY2 = lineY + 25; // Adjust vertical line length as needed

        // Draw vertical lines
        doc.line(verticalLine1X, verticalLineY1, verticalLine1X, verticalLineY2);
        doc.line(verticalLine2X, verticalLineY1, verticalLine2X, verticalLineY2);
        doc.line(verticalLine3X, verticalLineY1, verticalLine3X, verticalLineY2);

        // Manually specify email addresses and adjust spacing
        const email1 = contactDetails[0];
        const email2 = contactDetails[1];
        const email3 = contactDetails[2];

        const emailY = verticalLineY2 + 10; // Y position for email text

        doc.setFontSize(12);
        doc.setTextColor(usedColor);
        doc.text(email1, verticalLine1X, emailY, { align: 'center' });
        doc.text(email2, verticalLine2X, emailY, { align: 'center' });
        doc.text(email3, verticalLine3X, emailY, { align: 'center' });


        // Calculate section width and margin
        const sectionWidth = pageWidth * 0.4;
        const margin = (pageWidth - sectionWidth * 2) / 2; // Center-align the sections

        // Manually specify positions for sections
        const sectionY = pageHeight * 0.52; // Start Y position for both sections

        doc.setTextColor(0);
        // Section 1: Left section
        let yT1=sectionY + 35
        const section1X = margin;
        doc.setFontSize(18);
        doc.setFont('helvetica', 'normal');
        doc.text('EDUCATION', section1X, yT1);
        doc.setFontSize(12);

        doc.setFont('helvetica', 'normal');
        doc.setFillColor(usedColor);
        doc.setTextColor(255,255,255);
        yT1+=25
        doc.rect(section1X, yT1, 85, 12, 'F');
        doc.setFillColor(0,0,0);
        yT1+=10
        doc.text(
            "____ - "+educationInfo.first.toDate,
            section1X + 10,
            yT1,
            { maxWidth: sectionWidth - 20 }
        );
        doc.setTextColor(0);

        doc.setFontSize(11);
        let educationHeading = educationInfo.first.heading;
        educationHeading=educationHeading.toUpperCase()
        yT1+=20
        doc.text(educationHeading, section1X, yT1, { maxWidth: sectionWidth - 20 });

        yT1+=15
        educationHeading = educationInfo.first.subHeading;
        doc.text(educationHeading, section1X, yT1, { maxWidth: sectionWidth - 20 });

        doc.setFontSize(10);

        let educationText = educationInfo.first.addrerss;
        let textLines = doc.splitTextToSize(educationText, sectionWidth - 20);
        let textHeight = textLines.length * 10; 

        let y=yT1 + 15

        doc.text(
            educationText,
            section1X,
            y, 
            { maxWidth: sectionWidth - 20 }
        );

        doc.setFontSize(12);
        y=y+textHeight+20

        doc.setFillColor(usedColor);
        doc.setTextColor(255,255,255);
        doc.rect(section1X, y-10, 85, 12, 'F');
        doc.setFillColor(0,0,0);
        
        doc.text(
            "____ - "+educationInfo.second.toDate,
            section1X + 10,
            y,
            { maxWidth: sectionWidth - 20 }
        );
        doc.setTextColor(0);


        y+=20
        doc.setFontSize(10);
        educationHeading = educationInfo.second.heading;
        educationHeading=educationHeading.toUpperCase()
        doc.text(educationHeading, section1X, y, { maxWidth: sectionWidth - 20 });

        y+=15
        educationHeading = educationInfo.second.subHeading;
        doc.text(educationHeading, section1X, y, { maxWidth: sectionWidth - 20 });


        educationText = educationInfo.second.addrerss;
        textLines = doc.splitTextToSize(educationText, sectionWidth - 20);
        textHeight = textLines.length * 10;

        y=y+  15
        doc.text(
            educationText,
            section1X,
            y, 
            { maxWidth: sectionWidth - 20 }
        );



        








        doc.setTextColor(0);
        // Section 1: Left section
        let yT2=sectionY + 35
        const section2X = margin + sectionWidth;
        doc.setFontSize(18);
        doc.setFont('helvetica', 'normal');
        doc.text('EXPERIENCE', section2X, yT2);
        doc.setFontSize(12);

        doc.setFont('helvetica', 'normal');
        doc.setFillColor(usedColor);
        doc.setTextColor(255,255,255);
        yT2+=25
        doc.rect(section2X, yT2, 85, 12, 'F');
        doc.setFillColor(0,0,0);
        yT2+=10
        doc.text(
            experienceInfo.first.fromDate+" - "+experienceInfo.first.toDate,
            section2X + 10,
            yT2,
            { maxWidth: sectionWidth - 20 }
        );
        doc.setTextColor(0);

        doc.setFontSize(11);
        educationHeading = experienceInfo.first.heading;
        educationHeading=educationHeading.toUpperCase()
        yT2+=20
        doc.text(educationHeading, section2X, yT2, { maxWidth: sectionWidth - 20 });

        yT2+=15
        educationHeading = experienceInfo.first.subHeading;
        doc.text(educationHeading, section2X, yT2, { maxWidth: sectionWidth - 20 });

        doc.setFontSize(10);

        educationText = experienceInfo.first.addrerss;
        textLines = doc.splitTextToSize(educationText, sectionWidth - 20);
        textHeight = textLines.length * 10; 

        y=yT2 + 15

        doc.text(
            educationText,
            section2X,
            y, 
            { maxWidth: sectionWidth - 20 }
        );

        doc.setFontSize(12);
        y=y+textHeight+20

        doc.setFillColor(usedColor);
        doc.setTextColor(255,255,255);
        doc.rect(section2X, y-10, 85, 12, 'F');
        doc.setFillColor(0,0,0);
        
        doc.text(
            experienceInfo.second.fromDate+" - "+experienceInfo.second.toDate,
            section2X + 10,
            y,
            { maxWidth: sectionWidth - 20 }
        );
        doc.setTextColor(0);


        y+=20
        doc.setFontSize(10);
        educationHeading = experienceInfo.second.heading;
        educationHeading=educationHeading.toUpperCase()
        doc.text(educationHeading, section2X, y, { maxWidth: sectionWidth - 20 });

        y+=15
        educationHeading = experienceInfo.second.subHeading;
        doc.text(educationHeading, section2X, y, { maxWidth: sectionWidth - 20 });


        educationText = experienceInfo.second.addrerss;
        textLines = doc.splitTextToSize(educationText, sectionWidth - 20);
        textHeight = textLines.length * 10; 

        y=y+  15
        doc.text(
            educationText,
            section2X,
            y, 
            { maxWidth: sectionWidth - 20 }
        );









        function addLanguage(name,val){
            doc.setTextColor(usedColor);
            doc.text(name, section1X, yS1);
            doc.setFillColor(0, 0, 0);
            doc.rect(sectionWidth-120, yS1-3, totalLength, heightOfBar, 'F');
    
            //langaguge 1
            doc.setFillColor(usedColor);
            let langVal=val       //langayge value from form
            let calculatedLength=  Math.round((langVal/100)*totalLength)
            doc.rect(sectionWidth-120, yS1-3, calculatedLength, heightOfBar, 'F');
            doc.setFillColor(null);
        }

        doc.setTextColor(0);
        let yS1=y+70
        doc.setFontSize(18);
        doc.setFont('helvetica', 'normal');
        doc.text('LANGAUGE', section1X, yS1);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        
        yS1+=30
        let totalLength=130
        let heightOfBar=3        
        for (let i=0;i<processedLanguages.length;i++){
            addLanguage(processedLanguages[i].name, processedLanguages[i].val)
            yS1+=25
        }


        let num=0
        function addSkill(name){
            if(num%2==0){
                doc.text(name, section2X, yS2);
            }else{
                doc.text(name, section2X+100, yS2);
                yS2+=25
            }
            num++;
        }

        doc.setTextColor(0);
        let yS2=y+70
        doc.setFontSize(18);
        doc.setFont('helvetica', 'normal');
        doc.text('SKILLS', section2X, yS2);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(usedColor);
        yS2+=30

        skills.forEach(skill=>{
            addSkill(skill)
        })


        try {
            // Save the PDF as a blob
            const blob=doc.output('blob');
            doc.save(newRecruiterFormData.firstName+" "+newRecruiterFormData.lastName+'_CV.pdf');
            
            // Create FormData to send the PDF file
            const formData = new FormData();
            formData.append('pdfFile', blob, contactDetails1.email+'_CV.pdf');

            // Send the PDF file to the backend using fetch
            const url = `${process.env.REACT_APP_BACKEND_URL}/recruiter/CVs`;

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


    const handleGenerateCV = async () => {
        try { 
            generateCVTemp(contactDetails,education)
        } catch (error) {
            console.error('Error adding Recruiter', error.message);
        }
    };


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewRecruiterFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    return (
        <>
            {newRecruiterModelStep && (
                <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
                    <div className="fixed inset-0 bg-black opacity-50"></div>
                    <div className="relative w-auto mx-auto my-6">
                        <div className="relative flex flex-col w-full bg-white border-0 rounded-lg shadow-lg outline-none focus:outline-none">
                            <div className="flex items-center justify-between gap-20 p-5 px-10 border-b border-solid bg-[#FFF500] rounded-t ">
                                <h3 className="text-xl font-bold text-black">Questionare</h3>
                                <img src={Cross} className='w-10 h-10 transition-all duration-200 cursor-pointer hover:scale-110' onClick={() => {setNewRecruiterModelStep(false); setAddModal(true);}} />
                            </div>
                            <div>
                                {
                                    step == 1 ? <ContactDetails step={step} setStep={setStep} contactDetails={contactDetails} setContactDetails={setContactDetails} /> : 
                                    step == 2 ? <CareerGoals step={step} setStep={setStep} careerGoals={careerGoals} setCareerGoals={setCareerGoals} /> :
                                    step == 3 ? <Education step={step} setStep={setStep} education={education} setEducation={setEducation} /> :
                                    step == 4 ? <WorkExperience step={step} setStep={setStep} workExperiences={workExperiences} setWorkExperiences={setWorkExperiences} /> :
                                    step == 5 ? <Skills step={step} setStep={setStep} skills={skills} setSkills={setSkills} skillsInfo={skillsInfo} setSkillsInfo={setSkillsInfo} /> :
                                    step == 6 ? <CertificationsAndLanguages step={step} setStep={setStep} certificates={certificates} setCertificates={setCertificates} languages={languages} setLanguages={setLanguages} memberships={memberships} setMemberships={setMemberships} volunteerExperinces={volunteerExperinces} setVolunteerExperinces={setVolunteerExperinces} /> : 
                                    step == 7 ? <AchievementsAndReferences step={step} setStep={setStep} achievements={achievements} setAchievements={setAchievements} references={references} setReferences={setReferences} /> : 
                                    step == 8 ? <ProblemSolving step={step} setStep={setStep} problemSolving={problemSolving} setProblemSolving={setProblemSolving} /> : 
                                    step == 9 ? <TeamWork step={step} setStep={setStep} teamWork={teamWork} setTeamWork={setTeamWork} /> : 
                                    step == 10 ? <CustomerService step={step} setStep={setStep} customerService={customerService} setCustomerService={setCustomerService} /> : 
                                    step == 11 ? <Adaptibility step={step} setStep={setStep} adaptibility={adaptibility} setAdaptibility={setAdaptibility} /> : 
                                    step == 12 ? <CompanyMotivation step={step} setStep={setStep} companyMotivation={companyMotivation} setCompanyMotivation={setCompanyMotivation} /> : 
                                    step == 13 ? <AdditionalQuestions step={step} setStep={setStep} additionalQuestions={additionalQuestions} setAdditionalQuestions={setAdditionalQuestions} /> : <></>
                                }
                            </div>
                            <div className="flex items-center justify-between p-4 border-t border-solid rounded-b border-blueGray-200">
                                <button
                                    className={`px-20 py-4 mb-1 mr-1 text-sm font-bold text-black bg-[#FFF500] rounded uppercase transition-all duration-150 ease-linear outline-none background-transparent focus:outline-none ${step < 13 ? 'opacity-50' : 'opacity-100'}`}
                                    type="button"
                                    onClick={() => {
                                        if (step === 13) {
                                            handleGenerateCV();
                                            setAddModal(true);
                                            setNewRecruiterModelStep(false);
                                            setQuestionaire(true);
                                        }
                                    }}
                                    disabled={step < 13}
                                >
                                    Complete
                                </button>

                                <button
                                    className="px-20 py-4 mb-1 mr-1 text-sm font-bold text-gray-400 bg-[#F8FAFB] rounded uppercase transition-all duration-150 ease-linear outline-none background-transparent focus:outline-none"
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
}

const ContactDetails = ({step, setStep, contactDetails, setContactDetails}) => {

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setContactDetails((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const [error, setError] = useState('');

    return (
        <div className='flex flex-col gap-3 px-20 font-normal text-black w-fit bg-[#F8FAFB] py-10 pb-20 min-h-[70vh] max-h-[70vh] min-w-[60vw] max-w-[60vw] overflow-hidden'>
            <div className='flex flex-row justify-between gap-20'>
                <label className='text-lg font-semibold'>Contact Details</label>
                <div className='flex flex-row gap-2'>
                    <h className='mr-10 text-sm text-red-500'>{error}</h>
                    <div className='p-2 border-2 border-[#FDCF8B] rounded-full hover:bg-[#FDCF8B] transition-all duration-200 cursor-pointer hover:scale-110'>
                        <img src={Arrow} className='rotate-90' />
                    </div>
                    <div onClick={() => {
                            if(!contactDetails.completeAddress || !contactDetails.city || !contactDetails.postalCode || !contactDetails.province || !contactDetails.country || !contactDetails.email || !contactDetails.phoneNumber || !contactDetails.fixNumber) {
                                setError('Please fill all the fields!')
                            } else {
                                setError('');
                                setStep(step + 1)
                            }
                        }} className='p-2 border-2 border-[#FDCF8B] rounded-full hover:bg-[#FDCF8B] transition-all duration-200 cursor-pointer hover:scale-110'>
                        <img src={Arrow} className='-rotate-90' />
                    </div>
                </div>
            </div>
            <div className='flex flex-col items-center justify-center w-full h-full gap-5 mt-10 align-middle'>
                <div className='flex flex-col w-full gap-1'>
                    <label>Enter Your Complete Address</label>
                    <input onChange={(e) => handleInputChange(e)} type='text' name='completeAddress' value={contactDetails.completeAddress} className='w-full p-2 border-b-2 border-gray-300 rounded outline-none' />
                </div>
                <div className='flex flex-row justify-between w-full gap-10'>
                    <div className='flex flex-col w-full gap-1'>
                        <label>City</label>
                        <input onChange={(e) => handleInputChange(e)} type='text' name='city' value={contactDetails.city} className='p-2 border-b-2 border-gray-300 rounded outline-none' />
                    </div>
                    <div className='flex flex-col w-full gap-1'>
                        <label>Postal Code</label>
                        <input onChange={(e) => handleInputChange(e)} type='text' name='postalCode' value={contactDetails.postalCode} className='p-2 border-b-2 border-gray-300 rounded outline-none' />
                    </div>
                </div>
                <div className='flex flex-row justify-between w-full gap-10'>
                    <div className='flex flex-col w-full gap-1'>
                        <label>Province</label>
                        <input onChange={(e) => handleInputChange(e)} type='text' name='province' value={contactDetails.province} className='p-2 border-b-2 border-gray-300 rounded outline-none' />
                    </div>
                    <div className='flex flex-col w-full gap-1'>
                        <label>Country</label>
                        <input onChange={(e) => handleInputChange(e)} type='text' name='country' value={contactDetails.country} className='p-2 border-b-2 border-gray-300 rounded outline-none' />
                    </div>
                </div>
                <div className='flex flex-row justify-between w-full gap-10'>
                    <div className='flex flex-col w-full gap-1'>
                        <label>Email</label>
                        <input onChange={(e) => handleInputChange(e)} type='text' name='email' value={contactDetails.email} className='p-2 border-b-2 border-gray-300 rounded outline-none' />
                    </div>
                    <div className='flex flex-col w-full gap-1'>
                        <label>Phone Number</label>
                        <input onChange={(e) => handleInputChange(e)} type='text' name='phoneNumber' value={contactDetails.phoneNumber} className='p-2 border-b-2 border-gray-300 rounded outline-none' />
                    </div>
                </div>
                <div className='flex flex-row justify-between w-full gap-10'>
                    <div className='flex flex-col w-full gap-1'>
                        <label >Fix Number</label>
                        <input onChange={(e) => handleInputChange(e)} type='text' name='fixNumber' value={contactDetails.fixNumber} className='p-2 w-[47.5%] border-b-2 border-gray-300 rounded outline-none' />
                    </div>
                </div>
            </div>
        </div>
    )
}

const CareerGoals = ({step, setStep, careerGoals, setCareerGoals}) => {

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCareerGoals((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const [error, setError] = useState('');

    return (
        <div className='flex flex-col gap-3 px-20 font-normal text-black w-fit bg-[#F8FAFB] py-10 pb-20 min-h-[70vh] max-h-[70vh] min-w-[60vw] max-w-[60vw] overflow-hidden'>
            <div className='flex flex-row justify-between gap-20'>
                <label className='text-lg font-semibold'>Career Goals</label>
                <div className='flex flex-row gap-2'>
                    <h className='mr-10 text-sm text-red-500'>{error}</h>
                    <div onClick={() => setStep(step - 1)} className='p-2 border-2 border-[#FDCF8B] rounded-full hover:bg-[#FDCF8B] transition-all duration-200 cursor-pointer hover:scale-110'>
                        <img src={Arrow} className='rotate-90' />
                    </div>
                    <div onClick={() => {
                            if(!careerGoals.targetJob || !careerGoals.industry || !careerGoals.workEnvironment) {
                                setError('Please fill all the fields!')
                            } else {
                                setError('');
                                setStep(step + 1)
                            }
                        }} className='p-2 border-2 border-[#FDCF8B] rounded-full hover:bg-[#FDCF8B] transition-all duration-200 cursor-pointer hover:scale-110'>
                        <img src={Arrow} className='-rotate-90' />
                    </div>
                </div>
            </div>
            <div className='flex flex-col items-center justify-center w-full h-full gap-5 mt-10 align-middle'>
                <div className='flex flex-col w-full gap-1'>
                    <label>Target Job Title(s):</label>
                    <textarea onChange={(e) => handleInputChange(e)} name='targetJob' value={careerGoals.targetJob} className='block p-2 border-black border-b-' rows="4" placeholder='What specific roles are you interested in?'/>
                </div>
                <div className='flex flex-col w-full gap-1'>
                    <label>Industry</label>
                    <textarea onChange={(e) => handleInputChange(e)} name='industry' value={careerGoals.industry} className='block p-2 border-black border-b-' rows="4" placeholder='What industry are you targeting? (Optional)'/>
                </div>
                <div className='flex flex-col w-full gap-1'>
                    <label>Ideal Work Environment</label>
                    <textarea onChange={(e) => handleInputChange(e)} name='workEnvironment' value={careerGoals.workEnvironment} className='block p-2 border-black border-b-' rows="4" placeholder='What kind of company culture are you seeking? (e.g., fast-paced, collaborative)'/>
                </div>
            </div>
        </div>
    )
}

const Education = ({step, setStep, education, setEducation}) => {

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEducation((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const [error, setError] = useState('');

    return (
        <div className='flex flex-col gap-3 px-20 font-normal text-black w-fit bg-[#F8FAFB] py-10 pb-20 min-h-[70vh] max-h-[70vh] min-w-[60vw] max-w-[60vw] overflow-auto'>
            <div className='flex flex-row justify-between gap-20'>
                <label className='text-lg font-semibold'>Education</label>
                <div className='flex flex-row gap-2'>
                    <h className='mr-10 text-sm text-red-500'>{error}</h>
                    <div onClick={() => setStep(step - 1)} className='p-2 border-2 border-[#FDCF8B] rounded-full hover:bg-[#FDCF8B] transition-all duration-200 cursor-pointer hover:scale-110'>
                        <img src={Arrow} className='rotate-90' />
                    </div>
                    <div onClick={() => {
                            if(!education.degree || !education.field || !education.university || !education.place || !education.year || !education.experience || !education.projects || !education.information || !education.responsibilities || !education.toolAndSoftwares || !education.approach) {
                                setError('Please fill all the fields!')
                            } else {
                                setError('');
                                setStep(step + 1)
                            }
                        }} className='p-2 border-2 border-[#FDCF8B] rounded-full hover:bg-[#FDCF8B] transition-all duration-200 cursor-pointer hover:scale-110'>
                        <img src={Arrow} className='-rotate-90' />
                    </div>
                </div>
            </div>
            <div className='flex flex-col items-center justify-center w-full h-full gap-5 mt-10 align-middle'>
                <div className='flex flex-col w-full gap-1'>
                    <p className='leading-10'><input onChange={(e) => handleInputChange(e)} name='degree' value={education.degree} className='border-b border-gray-300 border-dotted' placeholder='Degree Earned'/> in <input onChange={(e) => handleInputChange(e)} name='field' value={education.field} className='border-b border-gray-300 border-dotted' placeholder='Field of Study' />   <input onChange={(e) => handleInputChange(e)} name='university' value={education.university} className='border-b border-gray-300 border-dotted' placeholder='University Name' />, <input onChange={(e) => handleInputChange(e)} name='place' value={education.place} className='border-b border-gray-300 border-dotted' placeholder='City, State' /> | Graduation Year: <input onChange={(e) => handleInputChange(e)} name='year' value={education.year} className='border-b border-gray-300 border-dotted' placeholder='Year' /></p>
                </div>
            </div>
            <div>
                <h className='text-xl font-semibold'>Experience and Skills</h>
                <div className='flex flex-col w-full gap-1 px-5 mt-3'>
                    <label>What specific experience do you have related to the [job position] you are applying for?</label>
                    <textarea onChange={(e) => handleInputChange(e)} name='experience' value={education.experience} className='block p-2 border-black border-b-' rows="3" placeholder='Write experience here...'/>
                </div>
                <div className='flex flex-col w-full gap-1 px-5 mt-3'>
                    <label>Can you provide examples of projects or tasks where you demonstrated [relevant skills]?</label>
                    <textarea onChange={(e) => handleInputChange(e)} name='projects' value={education.projects} className='block p-2 border-black border-b-' rows="3" placeholder='Write skills and projects here...'/>
                </div>
                <div className='flex flex-col w-full gap-1 px-5 mt-3'>
                    <label>How do you stay updated with industry trends and advancements?</label>
                    <textarea onChange={(e) => handleInputChange(e)} name='information' value={education.information} className='block p-2 border-black border-b-' rows="3" placeholder='Write your thoughts here...'/>
                </div>
            </div>
            <div>
                <h className='text-xl font-semibold'>Job Specific Knowledge</h>
                <div className='flex flex-col w-full gap-1 px-5 mt-3'>
                    <label>What do you understand about the responsibilities and requirements of this role?</label>
                    <textarea onChange={(e) => handleInputChange(e)} name='responsibilities' value={education.responsibilities} className='block p-2 border-black border-b-' rows="3" placeholder='Responsibilities and Requirements...'/>
                </div>
                <div className='flex flex-col w-full gap-1 px-5 mt-3'>
                    <label>How familiar are you with [specific tools/software] used in this industry?</label>
                    <textarea onChange={(e) => handleInputChange(e)} name='toolAndSoftwares' value={education.toolAndSoftwares} className='block p-2 border-black border-b-' rows="3" placeholder='...'/>
                </div>
                <div className='flex flex-col w-full gap-1 px-5 mt-3'>
                    <label>Can you explain your approach to [key aspect of the job]?</label>
                    <textarea onChange={(e) => handleInputChange(e)} name='approach' value={education.approach} className='block p-2 border-black border-b-' rows="3" placeholder='Write your approach here...'/>
                </div>
            </div>
        </div>
    )
}

const WorkExperience = ({step, setStep, workExperiences, setWorkExperiences}) => {

    const [workExperience, setWorkExperience] = useState({
        company: '',
        location: '',
        title: '',
        startDate: null,
        endDate: null,
        achievements: ''
    })

    const [error, setError] = useState('');

    const handleAddExp = () => {
        if (!workExperience.company || !workExperience.location || !workExperience.title || workExperience.startDate == null || workExperience.endDate == null || !workExperience.achievements) {
            setError('Please fill all the fields to add a work experience!')
        } else {
            setWorkExperiences(prevExperiences => [...prevExperiences, workExperience]);
            setError('');
            setWorkExperience({
                company: '',
                location: '',
                title: '',
                startDate: null,
                endDate: null,
                achievements: ''
            }); 
        }
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setWorkExperience((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const [endDate, setEndDate] = useState(false);

    return (
        <div className='flex flex-col gap-3 px-20 font-normal text-black w-fit bg-[#F8FAFB] py-10 pb-20 min-h-[70vh] max-h-[70vh] min-w-[60vw] max-w-[60vw] overflow-auto'>
            <div className='flex flex-row justify-between gap-20'>
                <label className='text-lg font-semibold'>Work Experience</label>
                <div className='flex flex-row gap-2'>
                    <h className='mr-10 text-sm text-red-500'>{error}</h>
                    <div onClick={() => setStep(step - 1)} className='p-2 border-2 border-[#FDCF8B] rounded-full hover:bg-[#FDCF8B] transition-all duration-200 cursor-pointer hover:scale-110'>
                        <img src={Arrow} className='rotate-90' />
                    </div>
                    <div onClick={() => {
                            if(workExperiences.length < 1) {
                                setError('Please add a Work Experience!')
                            } else {
                                setError('');
                                setStep(step + 1)
                            }
                        }} className='p-2 border-2 border-[#FDCF8B] rounded-full hover:bg-[#FDCF8B] transition-all duration-200 cursor-pointer hover:scale-110'>
                        <img src={Arrow} className='-rotate-90' />
                    </div>
                </div>
            </div>
            <div className='flex flex-col items-center justify-center w-full h-full gap-5 mt-10 align-middle'>
                <div className='flex flex-col w-full'>
                    {
                        workExperiences.map((workExp) => (
                            <div className='flex flex-col rounded border-[1px] border-gray-200 w-full p-2'>
                                <div className='flex flex-row justify-between gap-10 '> 
                                <span>{workExp.title}</span>
                                <span>{workExp.company}</span>
                                <span>{workExp.location}</span>
                                </div>
                            </div>
                        ))
                    }
                </div>
                <div className='flex flex-row justify-between w-full gap-10'>
                    <div className='flex flex-col w-full gap-1'>
                        <label>Company</label>
                        <input onChange={(e) => handleInputChange(e)} name='company' value={workExperience.company} type='text' className='p-2 border-b-2 border-gray-300 rounded outline-none' />
                    </div>
                    <div className='flex flex-col w-full gap-1'>
                        <label>Location</label>
                        <input onChange={(e) => handleInputChange(e)} name='location' value={workExperience.location} type='text' className='p-2 border-b-2 border-gray-300 rounded outline-none' />
                    </div>
                </div>
                <div className='flex flex-row justify-between w-full gap-5'>
                    <div className='flex flex-col w-full gap-1'>
                        <label>Job Title</label>
                        <input onChange={(e) => handleInputChange(e)} name='title' value={workExperience.title} type='text' className='p-2 border-b-2 border-gray-300 rounded outline-none' />
                    </div>
                    <div className='flex flex-col w-full gap-1'>
                        <label>Start Date</label>
                        <input onChange={(e) => handleInputChange(e)} name='startDate' value={workExperience.startDate} type='date' className='p-2 border-b-2 border-gray-300 rounded outline-none' />
                    </div>
                    <div className={`flex-col w-full gap-1 ${endDate ? 'hidden' : 'flex'}`}>
                        <label>Currently working there?</label>
                        <div className='flex flex-row gap-2'>
                            <button onClick={() => {
                                setWorkExperience((prevData) => ({
                                    ...prevData,
                                    endDate: Date.now(),
                                }));
                            }} className='p-2 bg-green-500 border-gray-300 rounded outline-none'>Yes</button>
                            <button onClick={() => {setEndDate(true)}} className='p-2 bg-red-500 border-gray-300 rounded outline-none'>No</button>
                        </div>
                    </div>
                    <div className={`flex-col w-full gap-1 ${endDate ? 'flex' : 'hidden'}`}>
                        <label>End Date</label>
                        <input onChange={(e) => handleInputChange(e)} name='endDate' value={workExperience.endDate} type='date' className='p-2 border-b-2 border-gray-300 rounded outline-none' />
                    </div>
                </div>
            </div>
            <div>
                <h className='text-xl font-semibold'>Achievements and Contributions</h>
                <div className='flex flex-col w-full gap-1'>
                    <textarea onChange={(e) => handleInputChange(e)} name='achievements' value={workExperience.achievements} className='block p-2 border-black border-b-' rows="5" placeholder='Write 3-5 points...'/>
                </div>
            </div>
            <button onClick={() => handleAddExp()} className='p-2 px-5 bg-blue-500 rounded '>Add</button>
        </div>
    )
}

const Skills = ({step, setStep, skills, setSkills, skillsInfo, setSkillsInfo}) => {
    
    const [skill, setSkill] = useState("");
    const [error, setError] = useState('');
    const handleAddSkill = () => {
        if(!skill) {
            setError('Please enter a skill to add!')
        } else {
            setSkills(prevSkills => [...prevSkills, skill]);
            setError('');
            setSkill("");
        }
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSkillsInfo((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    return (
        <div className='flex flex-col gap-3 px-20 font-normal text-black w-fit bg-[#F8FAFB] py-10 pb-20 min-h-[70vh] max-h-[70vh] min-w-[60vw] max-w-[60vw] overflow-auto'>
            <div className='flex flex-row justify-between gap-20'>
                <label className='text-xl font-semibold'>Skills</label>
                <div className='flex flex-row gap-2'>
                    <h className='mr-10 text-sm text-red-500'>{error}</h>
                    <div onClick={() => setStep(step - 1)} className='p-2 border-2 border-[#FDCF8B] rounded-full hover:bg-[#FDCF8B] transition-all duration-200 cursor-pointer hover:scale-110'>
                        <img src={Arrow} className='rotate-90' />
                    </div>
                    <div onClick={() => {
                            if(skills.length < 0) {
                                setError('Please add at least five skills!')
                            }
                            //  else if (!skillsInfo.technicalSkills || !skillsInfo.softSkills || !skillsInfo.specialSkills) {
                            //     setError('Please answer the questions as well!')
                            // }
                             else {
                                setError('');
                                setStep(step + 1)
                            }
                        }} className='p-2 border-2 border-[#FDCF8B] rounded-full hover:bg-[#FDCF8B] transition-all duration-200 cursor-pointer hover:scale-110'>
                        <img src={Arrow} className='-rotate-90' />
                    </div>
                </div>
            </div>
            <div className='flex flex-col w-full h-full gap-5 mt-10 align-middle'>
                <div className='flex flex-auto gap-3'>
                    {skills.map((skill, index) => (
                        <div key={index} className='p-2 border-2 border-gray-300 max-w-fit min-w-fit'><span className='max-w-fit min-w-fit'>{skill}</span></div>
                    ))}
                </div>
                <div className='flex flex-row gap-5'>
                    <input onChange={(e) => setSkill(e.target.value)} value={skill} type='text' className='p-2 border-b-2 border-gray-300 rounded outline-none' placeholder='Write Skill...'/>
                    <button onClick={() => handleAddSkill()} className='p-2 px-5 bg-blue-500 rounded '>Add</button>
                </div>
            </div>
            <div>
                <h className='text-xl font-semibold'>What technical skills do you possess</h>
                <div className='flex flex-col w-full gap-1'>
                    <textarea onChange={(e) => handleInputChange(e)} name='technicalSkills' value={skillsInfo.technicalSkills} className='block p-2 border-black' rows="5" placeholder='(e.g., programming languages, software proficiency)'/>
                </div>
            </div>
            <div>
                <h className='text-xl font-semibold'>What soft skills do you excel in ?</h>
                <div className='flex flex-col w-full gap-1'>
                    <textarea onChange={(e) => handleInputChange(e)} name='softSkills' value={skillsInfo.softSkills} className='block p-2 border-black' rows="5" placeholder='(e.g., communication, leadership, teamwork)'/>
                </div>
            </div>
            <div>
                <h className='text-xl font-semibold'>Are there any specialized skills relevant to the job you're applying for?</h>
                <div className='flex flex-col w-full gap-1'>
                    <textarea onChange={(e) => handleInputChange(e)} name='specialSkills' value={skillsInfo.specialSkills} className='block p-2 border-black' rows="5" placeholder='Write the Skills here...'/>
                </div>
            </div>
        </div>
    )
}

const CertificationsAndLanguages = ({step, setStep, certificates, setCertificates, languages, setLanguages, memberships, setMemberships, volunteerExperinces, setVolunteerExperinces}) => {
    
    const [certificate, setCertificate] = useState({
        name: '',
        organization: '',
        year: 2000
    });
    const [language, setLanguage] = useState({
        name: '',
        proficiency: 0
    });
    const [membership, setMembership] = useState({
        name: '',
        organization: ''
    });
    const [volunteerExperince, setVolunteerExperince] = useState({
        role: '',
        organization: '',
        startDate: null,
        endDate: null,
        description: ''
    });

    const handleAddCertificate = () => {
        console.log("adding skill", certificate);
        // Update the skills state immutably
        setCertificates(prevCertificates => [...prevCertificates, certificate]);
        setCertificate({
            name: '',
            organization: '',
            year: 200
        });
    }

    const handleAddLanguage = () => {
        console.log("adding skill", language);
        // Update the skills state immutably
        setLanguages(prevLanguages => [...prevLanguages, language]);
        setLanguage({
            name: '',
            proficiency: 0,
        });
    }

    const handleAddMembership = () => {
        console.log("adding skill", membership);
        // Update the skills state immutably
        setMemberships(prevMembership => [...prevMembership, membership]);
        setLanguage({
            name: '',
            organization: '',
        });
    }

    const handleAddVolunteerExperience = () => {
        console.log("adding skill", volunteerExperince);
        // Update the skills state immutably
        setVolunteerExperinces(prevExperiences => [...prevExperiences, volunteerExperince]);
        setVolunteerExperince({
            role: '',
            organization: '',
            startDate: null,
            endDate: null,
            description: ''
        });
    }

    const handleCertificateChange = (e) => {
        const { name, value } = e.target;
        setCertificate((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleLanguagesChange = (e) => {
        const { name, value } = e.target;
        setLanguage((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleMembershipChange = (e) => {
        const { name, value } = e.target;
        setMembership((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleVolunteerChange = (e) => {
        const { name, value } = e.target;
        setVolunteerExperince((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    return (
        <div className='flex flex-col gap-3 px-20 font-normal text-black w-fit bg-[#F8FAFB] py-10 pb-20 min-h-[70vh] max-h-[70vh] min-w-[60vw] max-w-[60vw] overflow-auto'>
            <div className='flex flex-row justify-between gap-20'>
                <label className='text-xl font-semibold'>Certifications and Languages</label>
                <div className='flex flex-row gap-2'>
                    <div onClick={() => setStep(step - 1)} className='p-2 border-2 border-[#FDCF8B] rounded-full hover:bg-[#FDCF8B] transition-all duration-200 cursor-pointer hover:scale-110'>
                        <img src={Arrow} className='rotate-90' />
                    </div>
                    <div onClick={() => setStep(step + 1)} className='p-2 border-2 border-[#FDCF8B] rounded-full hover:bg-[#FDCF8B] transition-all duration-200 cursor-pointer hover:scale-110'>
                        <img src={Arrow} className='-rotate-90' />
                    </div>
                </div>
            </div>
            <div className='flex flex-col w-full h-full gap-5 mt-10 align-middle'>
                <div className='flex flex-col gap-3'>
                    <h className='text-lg font-semibold'>Certifications</h>
                    {certificates.map((certificate, index) => (
                        <div key={index} className='flex flex-row justify-between w-full gap-5 p-2 border-2 border-gray-300 min-w-fit'>
                            <span className='max-w-fit min-w-fit'>{certificate.name}</span>
                            <span className='max-w-fit min-w-fit'>{certificate.organization}</span>
                            <span className='max-w-fit min-w-fit'>{certificate.year}</span>
                        </div>
                    ))}
                </div>
                <div className='flex flex-row gap-5'>
                    <input onChange={(e) => handleCertificateChange(e)} name='name' value={certificate.name} type='text' className='p-2 border-b-2 border-gray-300 rounded outline-none' placeholder='Certificate Name'/>
                    <input onChange={(e) => handleCertificateChange(e)} name='organization' value={certificate.organization} type='text' className='p-2 border-b-2 border-gray-300 rounded outline-none' placeholder='Organization'/>
                    <input onChange={(e) => handleCertificateChange(e)} name='year' value={certificate.year} type='number' className='p-2 border-b-2 border-gray-300 rounded outline-none' placeholder='Year'/>
                    <button onClick={() => handleAddCertificate()} className='p-2 px-5 bg-blue-500 rounded '>Add</button>
                </div>
            </div>
            <div className='flex flex-col w-full h-full gap-5 mt-10 align-middle'>
                <div className='flex flex-col gap-3'>
                    <h className='text-lg font-semibold'>Languages</h>
                    {languages.map((language, index) => (
                        <div key={index} className='flex flex-row justify-between w-full gap-5 p-2 border-2 border-gray-300 min-w-fit'>
                            <span className='max-w-fit min-w-fit'>{language.name}</span>
                            <span className='max-w-fit min-w-fit'>{language.proficiency}</span>
                        </div>
                    ))}
                </div>
                <div className='flex flex-row gap-5'>
                    <input onChange={(e) => handleLanguagesChange(e)} name='name' value={language.name} type='text' className='p-2 border-b-2 border-gray-300 rounded outline-none' placeholder='English'/>
                    <select onChange={(e) => handleLanguagesChange(e)} name='proficiency' className='p-2 border-b-2 border-gray-300 rounded outline-none' placeholder='Expert'> 
                        <option value={0}>Select Proficiency Level</option>
                        <option value={33}>NewBie</option>
                        <option value={67}>Intermediate</option>
                        <option value={100}>Expert</option>
                    </select>
                    <button onClick={() => handleAddLanguage()} className='p-2 px-5 bg-blue-500 rounded '>Add</button>
                </div>
            </div>
            <div className='flex flex-col w-full h-full gap-5 mt-10 align-middle'>
                <div className='flex flex-col gap-3'>
                    <h className='text-lg font-semibold'>Professional Memberships</h>
                    {memberships.map((membership, index) => (
                        <div key={index} className='flex flex-row justify-between w-full gap-5 p-2 border-2 border-gray-300 min-w-fit'>
                            <span className='max-w-fit min-w-fit'>{membership.name}</span>
                            <span className='max-w-fit min-w-fit'>{membership.organization}</span>
                        </div>
                    ))}
                </div>
                <div className='flex flex-row gap-5'>
                    <input onChange={(e) => handleMembershipChange(e)} name='name' value={membership.name} type='text' className='p-2 border-b-2 border-gray-300 rounded outline-none' placeholder='Membership Name'/>
                    <input onChange={(e) => handleMembershipChange(e)} name='organization' value={membership.organization} type='text' className='p-2 border-b-2 border-gray-300 rounded outline-none' placeholder='Organization'/>
                    <button onClick={() => handleAddMembership()} className='p-2 px-5 bg-blue-500 rounded '>Add</button>
                </div>
            </div>
            <div className='flex flex-col w-full h-full gap-5 mt-10 align-middle'>
                <div className='flex flex-col gap-3'>
                    <h className='text-lg font-semibold'>Volunteer Experience</h>
                    {volunteerExperinces.map((volunteerExperince, index) => (
                        <div key={index} className='flex flex-col justify-between w-full gap-3 p-2 border-2 border-gray-300 min-w-fit'>
                            <div className='flex flex-row justify-between w-full gap-5 p-2 min-w-fit'>
                                <span className='max-w-fit min-w-fit'>{volunteerExperince.role}</span>
                                <span className='max-w-fit min-w-fit'>{volunteerExperince.organization}</span>
                                <span className='max-w-fit min-w-fit'>{volunteerExperince.startDate}</span>
                                <span className='max-w-fit min-w-fit'>{volunteerExperince.endDate}</span>
                            </div>
                            <p>{volunteerExperince.description}</p>
                        </div>
                    ))}
                </div>
                <div className='flex flex-col gap-5'>
                    <div className='flex flex-row w-full gap-3'>
                        <input onChange={(e) => handleVolunteerChange(e)} name='role' value={volunteerExperince.name} type='text' className='p-2 border-b-2 border-gray-300 rounded outline-none' placeholder='Volunteer Role'/>
                        <input onChange={(e) => handleVolunteerChange(e)} name='organization' value={volunteerExperince.organization} type='text' className='p-2 border-b-2 border-gray-300 rounded outline-none' placeholder='Organization'/>
                        <input onChange={(e) => handleVolunteerChange(e)} name='startDate' value={volunteerExperince.startDate} type='date' className='p-2 border-b-2 border-gray-300 rounded outline-none' placeholder='Start Date'/>
                        <input onChange={(e) => handleVolunteerChange(e)} name='endDate' value={volunteerExperince.endDate} type='date' className='p-2 border-b-2 border-gray-300 rounded outline-none' placeholder='End Date'/>
                    </div>
                    <div className='flex flex-col w-full gap-1'>
                        <textarea onChange={(e) => handleVolunteerChange(e)} name='description' value={volunteerExperince.description} className='block p-2 border-black' rows="3" placeholder='Description of duties and contributions...'/>
                    </div>
                    <button onClick={() => handleAddVolunteerExperience()} className='p-2 px-5 bg-blue-500 rounded '>Add</button>
                </div>
            </div>
        </div>
    )
}

const AchievementsAndReferences = ({step, setStep, achievements, setAchievements, references, setReferences}) => {

    const [achievement, setAchievement] = useState ({
        name: '',
        description: '',
    })
    const [reference, setReference] = useState ({
        name: '',
        description: '',
    })

    const handleAddAchievement = () => {
        console.log("adding skill", achievement);
        // Update the skills state immutably
        setAchievements(prevAchievements => [...prevAchievements, achievement]);
        setAchievement({
            name: '',
            description: '',
        });
    }

    const handleAchievementChange = (e) => {
        const { name, value } = e.target;
        setAchievement((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleAddReference = () => {
        console.log("adding skill", reference);
        // Update the skills state immutably
        setReferences(prevReferences => [...prevReferences, reference]);
        setReference({
            name: '',
            description: '',
        });
    }

    const handleReferenceChange = (e) => {
        const { name, value } = e.target;
        setReference((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    return (
        <div className='flex flex-col gap-3 px-20 font-normal text-black w-fit bg-[#F8FAFB] py-10 pb-20 min-h-[70vh] max-h-[70vh] min-w-[60vw] max-w-[60vw] overflow-auto'>
            <div className='flex flex-row justify-between gap-20'>
                <label className='text-xl font-semibold'>Achievements and References</label>
                <div className='flex flex-row gap-2'>
                    <div onClick={() => setStep(step - 1)} className='p-2 border-2 border-[#FDCF8B] rounded-full hover:bg-[#FDCF8B] transition-all duration-200 cursor-pointer hover:scale-110'>
                        <img src={Arrow} className='rotate-90' />
                    </div>
                    <div onClick={() => setStep(step + 1)} className='p-2 border-2 border-[#FDCF8B] rounded-full hover:bg-[#FDCF8B] transition-all duration-200 cursor-pointer hover:scale-110'>
                        <img src={Arrow} className='-rotate-90' />
                    </div>
                </div>
            </div>
            <div className='flex flex-col w-full h-full gap-5 mt-10 align-middle'>
                <div className='flex flex-col gap-3'>
                    <h className='text-lg font-semibold'>Achievements</h>
                    {achievements.map((achievement, index) => (
                        <div key={index} className='flex flex-row justify-start w-full gap-5 p-2 border-2 border-gray-300 min-w-fit'>
                            <span className='w-[250px]'>{achievement.name}</span>
                            <span className='max-w-fit min-w-fit'>{achievement.description}</span>
                        </div>
                    ))}
                </div>
                <div className='flex flex-row gap-5'>
                    <input onChange={(e) => handleAchievementChange(e)} name='name' value={achievement.name} type='text' className='p-2 border-b-2 border-gray-300 rounded outline-none' placeholder='Achievement Name'/>
                    <textarea onChange={(e) => handleAchievementChange(e)} name='description' value={achievement.description} type='text' className='w-full p-2 border-gray-300 rounded outline-none' placeholder='Description...'/>
                    <button onClick={() => handleAddAchievement()} className='p-2 px-5 bg-blue-500 rounded '>Add</button>
                </div>
            </div>
            <div className='flex flex-col w-full h-full gap-5 mt-10 align-middle'>
                <div className='flex flex-col gap-3'>
                    <h className='text-lg font-semibold'>References</h>
                    {references.map((reference, index) => (
                        <div key={index} className='flex flex-row justify-start w-full gap-5 p-2 border-2 border-gray-300 min-w-fit'>
                            <span className='w-[250px]'>{reference.name}</span>
                            <span className='max-w-fit min-w-fit'>{reference.description}</span>
                        </div>
                    ))}
                </div>
                <div className='flex flex-row gap-5'>
                    <input onChange={(e) => handleReferenceChange(e)} name='name' value={reference.name} type='text' className='p-2 border-b-2 border-gray-300 rounded outline-none' placeholder='Reference'/>
                    <textarea onChange={(e) => handleReferenceChange(e)} name='description' value={reference.description} type='text' className='w-full p-2 border-gray-300 rounded outline-none' placeholder='Brief description and impact...'/>
                    <button onClick={() => handleAddReference()} className='p-2 px-5 bg-blue-500 rounded '>Add</button>
                </div>
            </div>
        </div>
    )
}

const ProblemSolving = ({step, setStep, problemSolving, setProblemSolving}) => {

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProblemSolving((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    return (
        <div className='flex flex-col gap-3 px-20 font-normal text-black w-fit bg-[#F8FAFB] py-10 pb-20 min-h-[70vh] max-h-[70vh] min-w-[60vw] max-w-[60vw] overflow-auto'>
            <div className='flex flex-row justify-between gap-20 mb-5'>
                <label className='text-xl font-semibold'>Problem Solving And Decision Making</label>
                <div className='flex flex-row gap-2'>
                    <div onClick={() => setStep(step - 1)} className='p-2 border-2 border-[#FDCF8B] rounded-full hover:bg-[#FDCF8B] transition-all duration-200 cursor-pointer hover:scale-110'>
                        <img src={Arrow} className='rotate-90' />
                    </div>
                    <div onClick={() => setStep(step + 1)} className='p-2 border-2 border-[#FDCF8B] rounded-full hover:bg-[#FDCF8B] transition-all duration-200 cursor-pointer hover:scale-110'>
                        <img src={Arrow} className='-rotate-90' />
                    </div>
                </div>
            </div>
            <div>
                <h className='font-semibold'>Describe a challenging situation you encountered at work and how you resolved it.</h>
                <div className='flex flex-col w-full gap-1'>
                    <textarea onChange={(e) => handleInputChange(e)} name='challengingSituation' value={problemSolving.challengingSituation} className='block p-2 border-black' rows="4" placeholder=''/>
                </div>
            </div>
            <div>
                <h className='font-semibold'>How do you prioritize tasks and manage deadlines effectively?</h>
                <div className='flex flex-col w-full gap-1'>
                    <textarea onChange={(e) => handleInputChange(e)} name='deadlines' value={problemSolving.deadlines} className='block p-2 border-black' rows="4" placeholder=''/>
                </div>
            </div>
            <div>
                <h className='font-semibold'>What steps do you take to ensure quality and accuracy in your work?</h>
                <div className='flex flex-col w-full gap-1'>
                    <textarea onChange={(e) => handleInputChange(e)} name='qualityWork' value={problemSolving.qualityWork} className='block p-2 border-black' rows="4" placeholder=''/>
                </div>
            </div>            
        </div>
    )
}

const TeamWork = ({step, setStep, teamWork, setTeamWork}) => {

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setTeamWork((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    return (
        <div className='flex flex-col gap-3 px-20 font-normal text-black w-fit bg-[#F8FAFB] py-10 pb-20 min-h-[70vh] max-h-[70vh] min-w-[60vw] max-w-[60vw] overflow-auto'>
            <div className='flex flex-row justify-between gap-20 mb-5'>
                <label className='text-xl font-semibold'>Teamwork and Communication</label>
                <div className='flex flex-row gap-2'>
                    <div onClick={() => setStep(step - 1)} className='p-2 border-2 border-[#FDCF8B] rounded-full hover:bg-[#FDCF8B] transition-all duration-200 cursor-pointer hover:scale-110'>
                        <img src={Arrow} className='rotate-90' />
                    </div>
                    <div onClick={() => setStep(step + 1)} className='p-2 border-2 border-[#FDCF8B] rounded-full hover:bg-[#FDCF8B] transition-all duration-200 cursor-pointer hover:scale-110'>
                        <img src={Arrow} className='-rotate-90' />
                    </div>
                </div>
            </div>
            <div>
                <h className='font-semibold'>Give an example of a successful team project you were part of. What was your role, and how did you contribute?</h>
                <div className='flex flex-col w-full gap-1'>
                    <textarea onChange={(e) => handleInputChange(e)} name='teamProject' value={teamWork.teamProject} className='block p-2 border-black' rows="4" placeholder=''/>
                </div>
            </div>
            <div>
                <h className='font-semibold'>How do you handle conflicts or disagreements within a team environment?</h>
                <div className='flex flex-col w-full gap-1'>
                    <textarea onChange={(e) => handleInputChange(e)} name='handleConflicts' value={teamWork.handleConflicts} className='block p-2 border-black' rows="4" placeholder=''/>
                </div>
            </div>
            <div>
                <h className='font-semibold'>Describe your communication style and how you adapt it based on different stakeholders.</h>
                <div className='flex flex-col w-full gap-1'>
                    <textarea onChange={(e) => handleInputChange(e)} name='communicationStyle' value={teamWork.communicationStyle} className='block p-2 border-black' rows="4" placeholder=''/>
                </div>
            </div>            
        </div>
    )
}

const CustomerService = ({step, setStep, customerService, setCustomerService}) => {

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCustomerService((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    return (
        <div className='flex flex-col gap-3 px-20 font-normal text-black w-fit bg-[#F8FAFB] py-10 pb-20 min-h-[70vh] max-h-[70vh] min-w-[60vw] max-w-[60vw] overflow-auto'>
            <div className='flex flex-row justify-between gap-20 mb-5'>
                <label className='text-xl font-semibold'>Customer Service and Client Interaction</label>
                <div className='flex flex-row gap-2'>
                    <div onClick={() => setStep(step - 1)} className='p-2 border-2 border-[#FDCF8B] rounded-full hover:bg-[#FDCF8B] transition-all duration-200 cursor-pointer hover:scale-110'>
                        <img src={Arrow} className='rotate-90' />
                    </div>
                    <div onClick={() => setStep(step + 1)} className='p-2 border-2 border-[#FDCF8B] rounded-full hover:bg-[#FDCF8B] transition-all duration-200 cursor-pointer hover:scale-110'>
                        <img src={Arrow} className='-rotate-90' />
                    </div>
                </div>
            </div>
            <div>
                <h className='font-semibold'>How do you approach customer/client satisfaction in your work?</h>
                <div className='flex flex-col w-full gap-1'>
                    <textarea onChange={(e) => handleInputChange(e)} name='customerSatisfaction' value={customerService.customerSatisfaction} className='block p-2 border-black' rows="4" placeholder=''/>
                </div>
            </div>
            <div>
                <h className='font-semibold'>Can you share an experience where you successfully addressed a customer's concern or request?</h>
                <div className='flex flex-col w-full gap-1'>
                    <textarea onChange={(e) => handleInputChange(e)} name='experience' value={customerService.experience} className='block p-2 border-black' rows="4" placeholder=''/>
                </div>
            </div>
            <div>
                <h className='font-semibold'>What strategies do you use to build and maintain positive relationships with clients?</h>
                <div className='flex flex-col w-full gap-1'>
                    <textarea onChange={(e) => handleInputChange(e)} name='strategies' value={customerService.strategies} className='block p-2 border-black' rows="4" placeholder=''/>
                </div>
            </div>            
        </div>
    )
}

const Adaptibility = ({step, setStep, adaptibility, setAdaptibility}) => {

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setAdaptibility((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    return (
        <div className='flex flex-col gap-3 px-20 font-normal text-black w-fit bg-[#F8FAFB] py-10 pb-20 min-h-[70vh] max-h-[70vh] min-w-[60vw] max-w-[60vw] overflow-auto'>
            <div className='flex flex-row justify-between gap-20 mb-5'>
                <label className='text-xl font-semibold'>Adaptibility and Learning</label>
                <div className='flex flex-row gap-2'>
                    <div onClick={() => setStep(step - 1)} className='p-2 border-2 border-[#FDCF8B] rounded-full hover:bg-[#FDCF8B] transition-all duration-200 cursor-pointer hover:scale-110'>
                        <img src={Arrow} className='rotate-90' />
                    </div>
                    <div onClick={() => setStep(step + 1)} className='p-2 border-2 border-[#FDCF8B] rounded-full hover:bg-[#FDCF8B] transition-all duration-200 cursor-pointer hover:scale-110'>
                        <img src={Arrow} className='-rotate-90' />
                    </div>
                </div>
            </div>
            <div>
                <h className='font-semibold'>How do you adapt to changes or unexpected challenges in your work environment?</h>
                <div className='flex flex-col w-full gap-1'>
                    <textarea onChange={(e) => handleInputChange(e)} name='adaptToChanges' value={adaptibility.adaptToChanges} className='block p-2 border-black' rows="4" placeholder=''/>
                </div>
            </div>
            <div>
                <h className='font-semibold'>Describe a situation where you had to learn a new skill or technology quickly. How did you approach it?</h>
                <div className='flex flex-col w-full gap-1'>
                    <textarea onChange={(e) => handleInputChange(e)} name='learningSituation' value={adaptibility.learningSituation} className='block p-2 border-black' rows="4" placeholder=''/>
                </div>
            </div>
            <div>
                <h className='font-semibold'>What are your career goals, and how do you plan to achieve them?</h>
                <div className='flex flex-col w-full gap-1'>
                    <textarea onChange={(e) => handleInputChange(e)} name='careerGoals' value={adaptibility.careerGoals} className='block p-2 border-black' rows="4" placeholder=''/>
                </div>
            </div>            
        </div>
    )
}

const CompanyMotivation = ({step, setStep, companyMotivation, setCompanyMotivation}) => {

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCompanyMotivation((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    return (
        <div className='flex flex-col gap-3 px-20 font-normal text-black w-fit bg-[#F8FAFB] py-10 pb-20 min-h-[70vh] max-h-[70vh] min-w-[60vw] max-w-[60vw] overflow-auto'>
            <div className='flex flex-row justify-between gap-20 mb-5'>
                <label className='text-xl font-semibold'>Company Fit and Motivation</label>
                <div className='flex flex-row gap-2'>
                    <div onClick={() => setStep(step - 1)} className='p-2 border-2 border-[#FDCF8B] rounded-full hover:bg-[#FDCF8B] transition-all duration-200 cursor-pointer hover:scale-110'>
                        <img src={Arrow} className='rotate-90' />
                    </div>
                    <div onClick={() => setStep(step + 1)} className='p-2 border-2 border-[#FDCF8B] rounded-full hover:bg-[#FDCF8B] transition-all duration-200 cursor-pointer hover:scale-110'>
                        <img src={Arrow} className='-rotate-90' />
                    </div>
                </div>
            </div>
            <div>
                <h className='font-semibold'>What interests you most about working for our company?</h>
                <div className='flex flex-col w-full gap-1'>
                    <textarea onChange={(e) => handleInputChange(e)} name='interests' value={companyMotivation.interests} className='block p-2 border-black' rows="4" placeholder=''/>
                </div>
            </div>
            <div>
                <h className='font-semibold'>How do you see yourself contributing to our team and achieving our company's goals?</h>
                <div className='flex flex-col w-full gap-1'>
                    <textarea onChange={(e) => handleInputChange(e)} name='contribution' value={companyMotivation.contribution} className='block p-2 border-black' rows="4" placeholder=''/>
                </div>
            </div>
            <div>
                <h className='font-semibold'>Why do you think you are the right fit for this position?</h>
                <div className='flex flex-col w-full gap-1'>
                    <textarea onChange={(e) => handleInputChange(e)} name='fitForPosition' value={companyMotivation.fitForPosition} className='block p-2 border-black' rows="4" placeholder=''/>
                </div>
            </div>            
        </div>
    )
}
const AdditionalQuestions = ({step, setStep, additionalQuestions, setAdditionalQuestions}) => {

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setAdditionalQuestions((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    return (
        <div className='flex flex-col gap-3 px-20 font-normal text-black w-fit bg-[#F8FAFB] py-10 pb-20 min-h-[70vh] max-h-[70vh] min-w-[60vw] max-w-[60vw] overflow-auto'>
            <div className='flex flex-row justify-between gap-20 mb-5'>
                <label className='text-xl font-semibold'>Additional Questions</label>
                <div className='flex flex-row gap-2'>
                    <div onClick={() => setStep(step - 1)} className='p-2 border-2 border-[#FDCF8B] rounded-full hover:bg-[#FDCF8B] transition-all duration-200 cursor-pointer hover:scale-110'>
                        <img src={Arrow} className='rotate-90' />
                    </div>
                    <div className='p-2 border-2 border-[#FDCF8B] rounded-full hover:bg-[#FDCF8B] transition-all duration-200 cursor-pointer hover:scale-110'>
                        <img src={Arrow} className='-rotate-90' />
                    </div>
                </div>
            </div>
            <div>
                <h className='font-semibold'>Software Proficiency: </h>
                <div className='flex flex-col w-full gap-1'>
                    <textarea onChange={(e) => handleInputChange(e)} name='softwareProficiency' value={additionalQuestions.softwareProficiency} className='block p-2 border-black' rows="4" placeholder='Have you received any awards, scholarships, or recognition for your work or achievements?'/>
                </div>
            </div>
            <div>
                <h className='font-semibold'>Problem Solving</h>
                <div className='flex flex-col w-full gap-1'>
                    <textarea onChange={(e) => handleInputChange(e)} name='problemSolving' value={additionalQuestions.problemSolving} className='block p-2 border-black' rows="4" placeholder='Describe a complex problem you faced at work and the steps you took to solve it.'/>
                </div>
            </div>            
            <div>
                <h className='font-semibold'>Adaptability & Initiative</h>
                <div className='flex flex-col w-full gap-1'>
                    <textarea onChange={(e) => handleInputChange(e)} name='adaptabilityAndInitiative' value={additionalQuestions.adaptabilityAndInitiative} className='block p-2 border-black' rows="4" placeholder='Provide an example of when you quickly learned a new skill or adapted to a changing work environment.'/>
                </div>
            </div>
            <div>
                <h className='font-semibold'>Continuous Learning</h>
                <div className='flex flex-col w-full gap-1'>
                    <textarea onChange={(e) => handleInputChange(e)} name='continuousLearning' value={additionalQuestions.continuousLearning} className='block p-2 border-black' rows="4" placeholder='Do you have a passion for continuous learning? List any recent courses, workshops, or certifications you`ve completed'/>
                </div>
            </div>
            <div>
                <h className='font-semibold'>Core Strengths</h>
                <div className='flex flex-col w-full gap-1'>
                    <textarea onChange={(e) => handleInputChange(e)} name='coreStrengths' value={additionalQuestions.coreStrengths} className='block p-2 border-black' rows="4" placeholder='What are your top 3-5 skills or qualities that make you a valuable asset?'/>
                </div>
            </div>
            <div>
                <h className='font-semibold'>Achievements Showcase</h>
                <div className='flex flex-col w-full gap-1'>
                    <textarea onChange={(e) => handleInputChange(e)} name='achievements' value={additionalQuestions.achievements} className='block p-2 border-black' rows="4" placeholder='Think of 2-3 past projects or accomplishments from different roles that demonstrate your skills and impact.'/>
                </div>
            </div>

        </div>
    )
}



export default Modal;
