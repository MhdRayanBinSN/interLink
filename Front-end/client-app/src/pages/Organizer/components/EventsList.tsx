import React from 'react';
import { useNavigate } from 'react-router-dom';

const EventsList: React.FC = () => {
  const navigate = useNavigate();

  const mockEvents = [
    {
      id: '1',
      title: 'React Summit 2024',
      date: '2024-06-15',
      registeredCount: 750,
      revenue: 450000,
      status: 'upcoming'
    },
    {
      id: '2',
      title: 'AI Workshop 2024',
      date: '2024-07-20',
      registeredCount: 200,
      revenue: 100000,
      status: 'ongoing'
    },
    // ... more events
  ];

  return (
    <div className="space-y-6">
      {/* Events Table */}
      <div className="bg-[#222839] rounded-[10px] border border-gray-700 overflow-hidden">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Your Events</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-gray-400 border-b border-gray-700">
                  <th className="px-6 py-3 text-left">Event Name</th>
                  <th className="px-6 py-3 text-left">Date</th>
                  <th className="px-6 py-3 text-left">Participants</th>
                  <th className="px-6 py-3 text-left">Revenue</th>
                  <th className="px-6 py-3 text-left">Status</th>
                  <th className="px-6 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {mockEvents.map((event) => (
                  <tr 
                    key={event.id} 
                    className="border-b border-gray-700 hover:bg-[#1d2132] cursor-pointer"
                    onClick={() => navigate(`/organizer/dashboard/event/${event.id}/statistics`)} // Fixed path
                  >
                    <td className="px-6 py-4 text-white">{event.title}</td>
                    <td className="px-6 py-4 text-gray-300">{event.date}</td>
                    <td className="px-6 py-4 text-gray-300">{event.registeredCount}</td>
                    <td className="px-6 py-4 text-[#d7ff42]">₹{event.revenue}</td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 text-xs rounded-full bg-green-500/20 text-green-500">
                        {event.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button className="text-[#7557e1] hover:text-[#d7ff42]">
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventsList;
