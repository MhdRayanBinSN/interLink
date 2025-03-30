import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Users, DollarSign, Tag, MapPin, Clock } from 'lucide-react';
import axios from 'axios';
import { serverUrl } from '../../../helpers/Constant';
import { toast } from 'react-toastify';

interface Event {
  _id: string;
  title: string;
  startDateTime: string;
  endDateTime: string;
  registeredParticipants: {
    _id: string;
    name: string;
    email: string;
  }[];
  bookings: {
    _id: string;
    bookingStatus: 'pending' | 'confirmed' | 'cancelled';
    ticketCount: number;
    totalAmount: number;
  }[];
  ticketPrice: number;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  mode: 'online' | 'offline' | 'hybrid';
  venue?: string;
  organizerId: string;
}

const EventsList: React.FC = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const token = localStorage.getItem('organizer_token');
        const organizerId = localStorage.getItem('organizerId');

        if (!token || !organizerId) {
          navigate('/organizer/login');
          return;
        }

        const response = await axios.get(
          `${serverUrl}/events/organizer/${organizerId}`, 
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        if (response.data.success) {
          setEvents(response.data.data);
        }
      } catch (err: any) {
        if (err.response?.status === 401) {
          toast.error('Session expired. Please login again.');
          localStorage.removeItem('organizer_token');
          navigate('/organizer/login');
        } else {
          setError(err.response?.data?.message || 'Failed to fetch events');
          toast.error('Failed to fetch events');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [navigate]);

  const determineEventStatus = (startDate: string, endDate: string): Event['status'] => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (now < start) return 'upcoming';
    if (now > end) return 'completed';
    return 'ongoing';
  };

  const getStatusColor = (status: Event['status']) => {
    switch (status) {
      case 'upcoming':
        return 'bg-blue-500/20 text-blue-500';
      case 'ongoing':
        return 'bg-green-500/20 text-green-500';
      case 'completed':
        return 'bg-gray-500/20 text-gray-400';
      case 'cancelled':
        return 'bg-red-500/20 text-red-500';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#d7ff42]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/10 text-red-400 p-4 rounded-lg">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {events.length === 0 ? (
        <div className="bg-[#222839] rounded-[10px] border border-gray-700 p-8 text-center">
          <h3 className="text-xl font-medium text-gray-300 mb-2">No Events Found</h3>
          <p className="text-gray-400 mb-4">You haven't created any events yet.</p>
          <button
            onClick={() => navigate('/organizer/dashboard/create-event')}
            className="inline-flex items-center px-4 py-2 bg-[#d7ff42] text-[#1d2132] rounded-lg hover:bg-opacity-90 transition-colors"
          >
            Create Your First Event
          </button>
        </div>
      ) : (
        <div className="bg-[#222839] rounded-[10px] border border-gray-700 overflow-hidden">
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-white">Your Events</h2>
              <button
                onClick={() => navigate('/organizer/dashboard/create-event')}
                className="px-4 py-2 bg-[#d7ff42] text-[#1d2132] rounded-lg hover:bg-opacity-90 transition-colors text-sm"
              >
                Create New Event
              </button>
            </div>
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
                  {events.map((event) => (
                    <motion.tr 
                      key={event._id} 
                      className="border-b border-gray-700 hover:bg-[#1d2132] cursor-pointer"
                      whileHover={{ backgroundColor: 'rgba(29, 33, 50, 0.8)' }}
                    >
                      <td className="px-6 py-4 text-white">{event.title}</td>
                      <td className="px-6 py-4 text-gray-300">{event.date}</td>
                      <td className="px-6 py-4 text-gray-300">{event.registeredParticipants}</td>
                      <td className="px-6 py-4 text-[#d7ff42]">₹{event.totalRevenue}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 text-xs rounded-full ${getStatusColor(event.status)}`}>
                          {event.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/organizer/dashboard/event/${event._id}/statistics`);
                          }}
                          className="text-[#7557e1] hover:text-[#d7ff42] transition-colors"
                        >
                          View Details
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventsList;