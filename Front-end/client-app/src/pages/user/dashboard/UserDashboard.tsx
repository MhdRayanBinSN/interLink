import React from 'react';
import { Routes, Route, NavLink, useLocation } from 'react-router-dom';
import Profile from './Profile';
import Ticket from './Ticket';

const UserDashboard: React.FC = () => {
  const location = useLocation();

  return (
    <div className="container mx-auto p-4">
      {/* Navigation */}
      <nav className="mb-6">
        <div className="flex gap-4">
          <NavLink
            to="/dashboard/profile"
            className={({ isActive }) =>
              `px-4 py-2 rounded-lg ${
                isActive 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`
            }
          >
            Profile
          </NavLink>
          <NavLink
            to="/dashboard/tickets"
            className={({ isActive }) =>
              `px-4 py-2 rounded-lg ${
                isActive 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`
            }
          >
            Tickets
          </NavLink>
        </div>
      </nav>

      <div className="bg-white rounded-lg shadow p-6">
        <Routes>
          <Route path="profile" element={<Profile />} />
          <Route path="tickets" element={<Ticket />} />
        </Routes>
      </div>
    </div>
  );
};

export default UserDashboard;