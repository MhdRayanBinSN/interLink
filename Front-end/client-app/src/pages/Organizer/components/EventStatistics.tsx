import React from 'react';
import { 
  BarChart, Bar, 
  PieChart, Pie, Cell,
  LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer 
} from 'recharts';
import { FaUsers, FaUserCheck, FaUserTimes, FaChartLine, FaMoneyBillWave } from 'react-icons/fa';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color = 'text-white' }) => (
  <div className="bg-[#222839] p-6 rounded-[10px] border border-gray-700">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-gray-400">{title}</h3>
      <span className={`text-2xl ${color}`}>{icon}</span>
    </div>
    <p className={`text-3xl font-bold ${color}`}>{value}</p>
  </div>
);

const EventStatistics: React.FC = () => {
  // Mock data - replace with actual API data
  const registrationData = [
    { date: '2024-01', registrations: 20 },
    { date: '2024-02', registrations: 45 },
    { date: '2024-03', registrations: 65 },
    { date: '2024-04', registrations: 26 },
  ];

  const attendanceData = [
    { name: 'Checked-in', value: 120 },
    { name: 'No-shows', value: 36 },
  ];

  const COLORS = ['#d7ff42', '#ff4444'];

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Total Registrations"
          value="156"
          icon={<FaUsers />}
        />
        <StatCard
          title="Checked-in Participants"
          value="120"
          icon={<FaUserCheck />}
          color="text-[#d7ff42]"
        />
        <StatCard
          title="No-shows"
          value="36"
          icon={<FaUserTimes />}
          color="text-red-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Event Engagement Rate"
          value="76.9%"
          icon={<FaChartLine />}
          color="text-blue-500"
        />
        <StatCard
          title="Total Revenue"
          value="₹78,000"
          icon={<FaMoneyBillWave />}
          color="text-[#d7ff42]"
        />
        <StatCard
          title="Days Until Event"
          value="15"
          icon={<FaChartLine />}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Registration Trend */}
        <div className="bg-[#222839] p-6 rounded-[10px] border border-gray-700">
          <h3 className="text-white mb-4">Registration Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={registrationData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="date" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{ backgroundColor: '#1F2937', border: 'none' }}
                labelStyle={{ color: '#9CA3AF' }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="registrations"
                stroke="#d7ff42"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Attendance Distribution */}
        <div className="bg-[#222839] p-6 rounded-[10px] border border-gray-700">
          <h3 className="text-white mb-4">Attendance Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={attendanceData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {attendanceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: '#1F2937', border: 'none' }}
                labelStyle={{ color: '#9CA3AF' }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default EventStatistics;
