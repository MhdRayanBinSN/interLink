import React from 'react';

const EventStatistics: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Stats Cards */}
        <div className="bg-[#222839] p-6 rounded-[10px] border border-gray-700">
          <h3 className="text-gray-400 mb-2">Total Registrations</h3>
          <p className="text-3xl font-bold text-white">156</p>
        </div>
        <div className="bg-[#222839] p-6 rounded-[10px] border border-gray-700">
          <h3 className="text-gray-400 mb-2">Revenue Generated</h3>
          <p className="text-3xl font-bold text-[#d7ff42]">₹78,000</p>
        </div>
        <div className="bg-[#222839] p-6 rounded-[10px] border border-gray-700">
          <h3 className="text-gray-400 mb-2">Days Until Event</h3>
          <p className="text-3xl font-bold text-white">15</p>
        </div>
      </div>

      {/* Additional statistics components can be added here */}
    </div>
  );
};

export default EventStatistics;
