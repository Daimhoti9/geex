import './App.css';
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";

import SideBar from "./Components/sidebar"
import { RecruiterProvider } from './Components/RecruterContext';
import Agents  from "./Pages/Agents/index"
import Recruters from "./Pages/Recruters/index"
import Invoices from "./Pages/Invoices/index"
import Jobs from "./Pages/Jobs/index"
import AgentJobs from './Pages/JobForAgents/index'
import Dashboard from './Pages/Home/index';
import Signin from "./Pages/signIn";
import {Signup} from "./Pages/signUp";
import Notifications from './Pages/Notifications/index'
import Appointments from './Pages/Appointments/index'

function App() {
    return (
    <Router>
        <RecruiterProvider>
        <SideBar />
            <Routes>
                <Route path='/' element={<Signin />} />
                <Route path='/agents' element={<Agents />} />
                <Route path='/recruters' element={<Recruters />} />
                <Route path='/invoices' element={<Invoices />} />
                <Route path='/jobs' element={<Jobs />} />
                <Route path='/jobsforagents' element={<AgentJobs />} />
                <Route path='/home' element={<Dashboard />} />
                <Route path='/login' element={<Signin />} />
                {/* <Route path='/signup' element={<Signup />} /> */}
                <Route path='/notifications' element={<Notifications />} />
                <Route path='/appointments' element={<Appointments />} />
            </Routes>
        </RecruiterProvider>
    </Router>
    );
}

export default App;
