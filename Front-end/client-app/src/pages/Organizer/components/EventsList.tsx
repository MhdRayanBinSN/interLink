import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
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

interface EventsListProps {
  refreshKey?: number;
}

// Helper functions
const formatEventDate = (startDateTime: string, endDateTime: string): string => {
  const start = new Date(startDateTime);
  const end = new Date(endDateTime);
  
  const startDate = start.toLocaleDateString('en-US', { 
    month: 'short', day: 'numeric', year: 'numeric'
  });
  
  if (start.toDateString() === end.toDateString()) {
    return startDate;
  }
  
  const endDate = end.toLocaleDateString('en-US', { 
    month: 'short', day: 'numeric', year: 'numeric'
  });
  
  return `${startDate} - ${endDate}`;
};

const calculateParticipants = (event: Event): number => {
  return event.registeredParticipants?.length || 0;
};

const calculateRevenue = (event: Event): number => {
  if (!event.bookings || event.bookings.length === 0) return 0;
  
  return event.bookings.reduce((total, booking) => {
    return booking.bookingStatus === 'confirmed' ? total + (booking.totalAmount || 0) : total;
  }, 0);
};

const EventsList: React.FC<EventsListProps> = ({ refreshKey = 0 }) => {
  const navigate = useNavigate();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchEvents();
  }, [navigate, refreshKey]);
  
  const fetchEvents = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('organizer_token');
      const organizerId = localStorage.getItem('organizerId');

      console.log('Attempting to fetch events with token and organizerId:', { 
        organizerId, 
        tokenExists: !!token 
      });

      if (!token || !organizerId) {
        toast.error('Authentication required. Please login again.');
        navigate('/organizer/login');
        return;
      }

      // Try direct API call with better error handling
      try {
        console.log(`Calling API: ${serverUrl}/events/organizer/${organizerId}`);
        
        const response = await axios.get(
          `${serverUrl}/events/organizer/${organizerId}`, 
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        console.log('API Response:', response.data);

        if (response.data.success) {
          console.log('Events found:', response.data.data.length);
          setEvents(response.data.data);
          return;
        }
      } catch (error) {
        console.error('Error fetching events by organizer ID:', error);
        
        // If unauthorized, redirect to login
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          toast.error('Your session has expired. Please login again.');
          localStorage.removeItem('organizer_token');
          localStorage.removeItem('organizerId');
          navigate('/organizer/login');
          return;
        }
      }
      
      // Set empty events if nothing found
      console.log('No events found');
      setEvents([]);
    } catch (err: any) {
      console.error('Event fetch error:', err);
      setError(err.message || 'Failed to fetch events');
    } finally {
      setLoading(false);
    }
  };

  // Determine event status (upcoming, ongoing, completed)
  const determineEventStatus = (startDate: string, endDate: string): Event['status'] => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (now < start) return 'upcoming';
    if (now > end) return 'completed';
    return 'ongoing';
  };

  // Get status display color
  const getStatusColor = (status: Event['status']) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-500/20 text-blue-500';
      case 'ongoing': return 'bg-green-500/20 text-green-500';
      case 'completed': return 'bg-gray-500/20 text-gray-400';
      case 'cancelled': return 'bg-red-500/20 text-red-500';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#d7ff42]"></div>
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
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-white">Your Events</h2>
              <p className="text-gray-400 text-sm mt-1">
                Manage and monitor all your events from this dashboard
              </p>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-gray-400 border-b border-gray-700">
                    <th className="px-6 py-3 text-left font-medium">Event Name</th>
                    <th className="px-6 py-3 text-left font-medium">Date</th>
                    <th className="px-6 py-3 text-left font-medium">Participants</th>
                    <th className="px-6 py-3 text-left font-medium">Revenue</th>
                    <th className="px-6 py-3 text-left font-medium">Status</th>
                    <th className="px-6 py-3 text-left font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {events.map((event) => (
                    <motion.tr 
                      key={event._id} 
                      className="border-b border-gray-700 hover:bg-[#1d2132] cursor-pointer transition-colors"
                      whileHover={{ backgroundColor: 'rgba(29, 33, 50, 0.8)' }}
                      onClick={() => navigate(`/organizer/dashboard/event/${event._id}/details`)}
                    >
                      <td className="px-6 py-4 text-white font-medium">{event.title}</td>
                      <td className="px-6 py-4 text-gray-300">
                        {formatEventDate(event.startDateTime, event.endDateTime)}
                      </td>
                      <td className="px-6 py-4 text-gray-300">
                        {calculateParticipants(event)}
                      </td>
                      <td className="px-6 py-4 text-[#d7ff42] font-medium">
                        ₹{calculateRevenue(event)}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 text-xs rounded-full ${getStatusColor(
                          determineEventStatus(event.startDateTime, event.endDateTime)
                        )}`}>
                          {determineEventStatus(event.startDateTime, event.endDateTime)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/organizer/dashboard/event/${event._id}/statistics`);
                            }}
                            className="text-[#7557e1] hover:text-[#d7ff42] transition-colors text-sm font-medium"
                          >
                            Statistics
                          </button>
                          <span className="text-gray-600">|</span>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/organizer/dashboard/event/${event._id}/details`);
                            }}
                            className="text-[#7557e1] hover:text-[#d7ff42] transition-colors text-sm font-medium"
                          >
                            Details
                          </button>
                        </div>
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