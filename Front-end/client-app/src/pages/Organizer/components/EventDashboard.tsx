import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBars, FaTimes, FaEdit, FaUsers, FaChartLine } from 'react-icons/fa';
import { Routes, Route, Link, useParams, useLocation, useNavigate } from 'react-router-dom';
import EventStatistics from './EventStatistics';


interface IEventDashboardProps {}

const EventDashboard: React.FunctionComponent<IEventDashboardProps> = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const { eventId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    {
      title: 'Event Statistics',
      icon: <FaChartLine />,
      path: `/organizer/dashboard/event/${eventId}/statistics`
    },
    {
      title: 'Edit Event',
      icon: <FaEdit />,
      path: `/organizer/dashboard/event/${eventId}/edit`
    },
    {
      title: 'Manage Participants',
      icon: <FaUsers />,
      path: `/organizer/dashboard/event/${eventId}/participants`
    }
  ];

  return (
    <div className="min-h-screen bg-[#1d2132] flex">
      {/* Sidebar */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            className="fixed left-0 top-0 h-full w-64 bg-[#222839] border-r border-gray-700 z-50"
          >
            <div className="p-4 flex justify-between items-center border-b border-gray-700">
              <h2 className="text-xl font-bold text-white">Event Dashboard</h2>
              <button
                onClick={() => setSidebarOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <FaTimes />
              </button>
            </div>
            <nav className="mt-6 px-4">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center px-4 py-3 mb-2 rounded-[10px] transition-all ${
                    location.pathname === item.path
                      ? 'bg-[#7557e1] text-white'
                      : 'text-gray-300 hover:bg-[#7557e1]/10'
                  }`}
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.title}
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className={`flex-1 ${isSidebarOpen ? 'ml-64' : 'ml-0'} transition-all duration-300`}>
        {/* Top Bar */}
        <div className="bg-[#222839] border-b border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {!isSidebarOpen && (
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="text-gray-400 hover:text-white mr-4"
                >
                  <FaBars />
                </button>
              )}
              <h1 className="text-xl font-semibold text-white">React Summit 2024</h1>
            </div>

            {/* Back to Dashboard Button */}
            <button
              onClick={() => navigate('/organizer/dashboard')}
              className="flex items-center px-4 py-2 text-gray-300 hover:bg-[#7557e1]/10 rounded-[10px] transition-all"
            >
              <FaChartLine className="mr-2" />
              Back to Dashboard
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-6">
          <Routes>
            <Route path="statistics" element={<EventStatistics />} />
            {/* 
            <Route path="edit" element={<EditEvent />} />
            <Route path="participants" element={<ManageEventParticipants />} />*/}
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default EventDashboard;