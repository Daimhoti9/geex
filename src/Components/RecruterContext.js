import React, { createContext, useState } from 'react';

const RecruiterContext = createContext();

export const RecruiterProvider = ({ children }) => {
  const [recruitersStatus, setRecruitersStatus] = useState('Active');
  const [sideBarStatus, setSideBarStatus] = useState(false); // New state variable
  const [current, setCurrent] = useState("Dashboard");

  return (
    <RecruiterContext.Provider value={{ recruitersStatus, setRecruitersStatus, sideBarStatus, setSideBarStatus,current,setCurrent }}>
      {children}
    </RecruiterContext.Provider>
  );
};

export default RecruiterContext;
