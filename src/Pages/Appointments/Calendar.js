import React, { useEffect, useState } from 'react';
import axios from 'axios';

import Modal from './addAppointment';
import ViewModal from './viewAppointment';

import Edit from '../../Resources/Icons/edit.png'
import Delete from '../../Resources/Icons/delete.png'
import Profile from '../../Resources/Icons/profile.png'
import Eye from '../../Resources/Icons/eye.png'
import Person from '../../Resources/Icons/person.png'
import Organization from '../../Resources/Icons/icons8-organization-90.png'

const Calendar = ({history, type, setType}) => {

  const [appointments, setAppointments] = useState([]);
  const [appointmentsToDisplay, setAppointmentsToDisplay] = useState([]);

  const [update, setUpdate] = useState(false);

  const getAllAppointments = async () => {
    try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/appointment/getallappointments`);
        console.log(response.data);
        setAppointments(response.data);
    } catch (error) {
        console.error('Error fetching employee details:', error.message);
    }
  };

  useEffect(() => {
    getAllAppointments();
  }, [update])

  useEffect(() => {
    const filteredAppointments = appointments.filter((appointment) => { return appointment.type === type})
    setAppointmentsToDisplay(filteredAppointments);
  }, [type, appointments])


  console.log('this is the calendar',type);

  const [currentDate, setCurrentDate] = useState(new Date());
  const [appointment, setAppointment] = useState(null);

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month, 1).getDay();
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const handleDragStart = (e) => {
    setAppointment('Appointment');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (appointment) {
      console.log('Appointment dropped on:', e.target.innerText);
      setAppointment(null);
    }
  };


  const [showModal, setShowModal] = useState(false);

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDayOfMonth = getFirstDayOfMonth(currentDate);
    const blanks = Array(firstDayOfMonth).fill(null);
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  
    return (
      <div className="w-full max-w-md min-w-full overflow-hidden border-gray-300 rounded shadow-md min-h-fit">
        <div className='flex flex-row items-end justify-end gap-5 mb-4'>
          <div className="flex items-center justify-between rounded w-[300px] border-[2px] border-gray-200">
            <button onClick={prevMonth} className="p-2">&lt;</button>
            <h2 className="text-lg font-semibold">{currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</h2>
            <button onClick={nextMonth} className="p-2">&gt;</button>
          </div>
          <div>
            <button onClick={() => setShowModal(true)} className='px-10 py-2 font-semibold text-white bg-black border-2 border-gray-200 rounded '>Add New</button>
          </div>
        </div>
  
        <Modal showModal={showModal} setShowModal={setShowModal} type={type} update={update} setUpdate={setUpdate}/>
        
        <div className={`${ history ? 'block' : 'hidden'}`}>
          <div className="grid grid-cols-7 gap-1 py-4 text-center border-[1px] border-gray-300 bg-white">
            <div className="text-xs font-semibold">Sun</div>
            <div className="text-xs font-semibold">Mon</div>
            <div className="text-xs font-semibold">Tue</div>
            <div className="text-xs font-semibold">Wed</div>
            <div className="text-xs font-semibold">Thu</div>
            <div className="text-xs font-semibold">Fri</div>
            <div className="text-xs font-semibold">Sat</div>
          </div>
          <div className="grid grid-cols-7 text-center">
            {[...blanks, ...days].map((day, index) => (
              <div
                key={index}
                className={`p-2 h-24 overflow-auto border-[1px] border-gray-300 ${day ? 'bg-white' : 'bg-gray-200'}`}
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
              >
                {day}
                <div className='flex flex-col gap-1'>
                  {
                    appointments.map((appointment, appIndex) => {
                      const appointmentDate = new Date(appointment.date);
                      const appointmentDay = appointmentDate.getDate();
                      const appointmentMonth = appointmentDate.getMonth() + 1;
                      const currentMonth = currentDate.getMonth() + 1;
                      if (appointmentDay === day && appointmentMonth === currentMonth) {
                        return (
                          <div key={appIndex} draggable onDragStart={handleDragStart} className={`p-2 relative text-xs font-semibold flex flex-col gap-1 rounded-md ${appointment.type == 'person' ? 'bg-[#FDECE7] text-[#B54800]' : 'bg-[#EAE8FD] text-[#2F17E8]'}`}>
                            <h>{appointment.title}</h>
                            <span>{appointment.time}</span>
                            <img src={appointment.type == 'person' ? Person : Organization} className='absolute top-0 right-0 w-5 h-5' alt={type} />
                          </div>
                        );
                      } else {
                        return null;
                      }
                    })
                  }
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className={`${ history ? 'hidden' : 'block'}`}>
          <HistoryPage appointments={appointmentsToDisplay} type={type} update={update} setUpdate={setUpdate} />
        </div>
      </div>
    );
  };
  
  
  return renderCalendar();
};

const HistoryPage = ({appointments, type, update, setUpdate}) => {

  const [viewModal, setViewModal] = useState(false);
  const [selectedAppointment, setSelectedAppointemt] = useState();
  

  return (
    <div className='flex flex-col w-full gap-5 overflow-auto min-h-fit'>
      <ViewModal showModal={viewModal} setShowModal={setViewModal} type={type} appointment={selectedAppointment} update={update} setUpdate={setUpdate}/>
        {
            appointments.map((appointment) => (
                <div onClick={() => {setSelectedAppointemt(appointment); setViewModal(!viewModal)}} className={`relative grid items-center grid-cols-3 gap-5 py-5 text-center shadow-inner cursor-pointer rounded-2xl md:grid-cols-4 lg:grid-cols-5 ${appointment.status == 'pending' ? 'bg-green-400' : 'bg-red-400'}`}>
                    <div className='flex flex-row items-center justify-center gap-5 px-5'>
                        <img src={Eye} className='w-5 h-5 transition-all duration-200 cursor-pointer hover:scale-125' />
                        <img src={Edit} className='w-5 h-5 transition-all duration-200 cursor-pointer hover:scale-125' />
                        <img src={Delete} className='w-5 h-5 transition-all duration-200 cursor-pointer hover:scale-125' />
                    </div>
                    <span className='hidden md:block'>{appointment.time}</span>
                    <span className='hidden lg:block'>{appointment.title}</span>
                    <span>{appointment.date}</span>
                    <div className='flex flex-row items-center justify-end gap-3 pr-5'>
                        <span>{appointment.name} {appointment.surname}</span>
                        <img src={appointment.profileImage ? appointment.profileImage : Profile} className='w-10 h-10 rounded-full' />
                    </div>
                </div>
            ))
        }
    </div>
  )
}

export default Calendar;
