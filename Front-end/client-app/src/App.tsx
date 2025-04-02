import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useStore } from './store.tsx';
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
import EventBooking from './pages/user/EventBooking';
import Profile from './pages/user/dashboard/Profile';
import EditProfile from './pages/user/dashboard/EditProfile';
import ChangePassword from './pages/user/dashboard/ChangePassword';
import { UserStatusIndicator } from './components/DevTools/UserStatusIndicator';
import BookingConfirmation from './pages/user/BookingConfirmation';
import OrganizerAuthGuard from './utils/organizerAuthGuard';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App: React.FC = () => {
  const { checkAuth } = useStore();
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);
  return (
    <>
      <Router>
        <AnimatePresence mode="wait">
          <Routes>
            {/* Home route without navbar */}
            <Route path="/" element={<Home />} />
            <Route path='/organizer' element={<OrganizerHome />}/>
            <Route path='/organizer/register' element={<OrganizerRegister />}/>
            <Route path='/organizer/login' element={<OrganizerLogin />}/>
            <Route 
              path="/organizer/dashboard/*" 
              element={
                <OrganizerAuthGuard>
                  <OrganizerDashboard />
                </OrganizerAuthGuard>
              } 
            />
            <Route path='/organizer/dashboard/event/:eventId/*' element={<EventDashboard />}/>
            {/* Routes with navbar */}
            <Route element={<MainLayout />}>  
              <Route path="/events" element={<EventDiscovery />} />
              <Route path="/events/:id" element={<EventDetails />} />
              <Route path="/event/:id" element={<EventDetails />} />
              <Route path="/event/:id/booking" element={<EventBooking />} />
              <Route path="/events/:id/booking" element={<EventBooking />} />
              <Route path="/booking-confirmation/:bookingId" element={<BookingConfirmation />} />

              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard/*" element={<UserDashboard />} />
              <Route path="/dashboard/profile" element={<Profile />} />
              <Route path="/dashboard/edit-profile" element={<EditProfile />} />
              <Route path="/dashboard/change-password" element={<ChangePassword />} />
            </Route>
            
          </Routes>
          <UserStatusIndicator />
        </AnimatePresence>
      </Router>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </>
  );
};

export default App;
