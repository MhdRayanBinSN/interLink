import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { FaChartLine, FaUsers, FaCalendarPlus, FaBars, FaTimes, FaChevronRight, FaSignOutAlt, FaUserCircle } from 'react-icons/fa';

// Import your components
import EventsList from './components/EventsList';
import CreateEvent from './components/CreateEvent';
import ManageParticipants from './components/ManageParticipants';
import EventStatistics from './components/EventStatistics';
import OrganizerProfile from './components/OrganizerProfile';


const OrganizerDashboard: React.FC = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    // Add any logout logic here (clear tokens, state, etc.)
    navigate('/organizer/login');
  };

  return (
    <div className="min-h-screen bg-[#1d2132]">
      {/* Top Navbar */}
      <div className="bg-[#222839] border-b border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <h1 className="text-xl font-semibold text-white">Manage Events</h1>
            
            {/* Navigation Links */}
            
          </div>

          <div className="flex items-center space-x-4">
            {/* Create Event Button */}
            {location.pathname !== '/organizer/dashboard/create-event' && (
              <Link
                to="/organizer/dashboard/create-event"
                className="flex items-center px-4 py-2 bg-[#d7ff42] text-[#1d2132] rounded-[10px] font-semibold hover:bg-opacity-90 transform hover:scale-[1.02] transition-all duration-200"
              >
                <FaCalendarPlus className="mr-2" />
                Create Event
              </Link>
            )}
            
            {/* Profile Button */}
            <Link
              to="/organizer/dashboard/profile"
              className={`flex items-center px-4 py-2 rounded-[10px] transition-all ${
                location.pathname === '/organizer/dashboard/profile'
                  ? 'bg-[#2a2f44] text-white'
                  : 'text-gray-300 hover:bg-[#2a2f44]'
              }`}
            >
              <FaUserCircle className="mr-2" />
              Profile
            </Link>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="flex items-center px-4 py-2 text-gray-300 hover:bg-red-500/10 hover:text-red-500 rounded-[10px] transition-all"
            >
              <FaSignOutAlt className="mr-2" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-6">
        <Routes>
          <Route path="/" element={<EventsList />} />
          <Route path="/create-event" element={<CreateEvent />} />
          <Route path="/profile" element={<OrganizerProfile />} />
        </Routes>
      </div>
    </div>
  );
};

export default OrganizerDashboard;