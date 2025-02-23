import React from 'react';
import { Routes, Route, NavLink } from 'react-router-dom';
import { User, Ticket as TicketIcon } from 'lucide-react';
import Profile from './Profile';
import Ticket from './Ticket';

interface NavItemProps {
  to: string;
  icon: React.ElementType;
  label: string;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon: Icon, label }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `px-4 py-2.5 rounded-lg flex items-center gap-2 transition-colors ${
        isActive 
          ? 'bg-[#7557e1] text-white' 
          : 'bg-[#1d2132] text-gray-400 hover:text-white hover:bg-[#1d2132]/80'
      }`
    }
  >
    <Icon className="w-4 h-4" />
    <span>{label}</span>
  </NavLink>
);

const UserDashboard: React.FC = () => {
  const navItems = [
    { to: '/dashboard/profile', icon: User, label: 'Profile' },
    { to: '/dashboard/tickets', icon: TicketIcon, label: 'Tickets' }
  ];

  return (
    <div className="min-h-screen bg-[#1d2132]">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Navigation */}
        <nav className="mb-6">
          <div className="flex gap-4">
            {navItems.map((item) => (
              <NavItem 
                key={item.to}
                to={item.to}
                icon={item.icon}
                label={item.label}
              />
            ))}
          </div>
        </nav>

        {/* Content Area */}
        <div className="bg-[#222839] rounded-xl border border-gray-700/50 shadow-xl">
          <Routes>
            <Route path="profile" element={<Profile />} />
            <Route path="tickets" element={<Ticket />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;