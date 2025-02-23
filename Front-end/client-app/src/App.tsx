import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Home from './pages/user/Home';
import EventDiscovery from './pages/user/EventDiscovery';
import Login from './pages/user/Login';
import Register from './pages/user/Register';
import { EventDetails } from './pages/user/EventDetails';
import UserDashboard from './pages/user/dashboard/UserDashboard';
import MainLayout from './layouts/UserLayout';
import OrganizerHome from './pages/Organizer/OrganizerHome';
import OrganizerRegister from './pages/Organizer/OrganizerRegister';
import OrganizerLogin from './pages/Organizer/OrganizerLogin';
import OrganizerDashboard from './pages/Organizer/OrganizerDashboard';
import EventDashboard from './pages/Organizer/components/EventDashboard';

const App: React.FC = () => {
  return (
    <Router>
      <AnimatePresence mode="wait">
        <Routes>
          {/* Home route without navbar */}
          <Route path="/" element={<Home />} />
          <Route path='/organizer' element={<OrganizerHome />}/>
          <Route path='/organizer/register' element={<OrganizerRegister />}/>
          <Route path='/organizer/login' element={<OrganizerLogin />}/>
          <Route path='/organizer/dashboard/*' element={<OrganizerDashboard />}/>
          <Route path='/organizer/dashboard/event/:eventId/*' element={<EventDashboard />}/>
          {/* Routes with navbar */}
          <Route element={<MainLayout />}>
            <Route path="/events" element={<EventDiscovery />} />
            <Route path="/events/:id" element={<EventDetails />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard/*" element={<UserDashboard />} />
          </Route>
          
        </Routes>
      </AnimatePresence>
    </Router>
  );
};

export default App;
