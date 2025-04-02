import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import QRCode from 'qrcode.react';
import { Link, useNavigate } from 'react-router-dom';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { Calendar, Clock, MapPin, Download, X, ExternalLink, Loader } from 'lucide-react';
import axios from 'axios';
import { serverUrl } from '../../../helpers/Constant';
import { TicketPDF } from './TicketPDF';


interface Participant {
  name: string;
  email: string;
  phone?: string;
  attendeeType: string;
  attendanceStatus?: 'present' | 'absent' | 'not_marked';
}

interface TicketData {
  id: string;
  eventName: string;
  eventDate: string | Date; // Accept either string or Date
  eventTime: string;
  eventLocation: string;
  ticketType: string;
  ticketNumber: string;
  price: number;
  purchaseDate: string | Date;
  eventId: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  bookingId: string;
  participants: Participant[];
}

const TicketCard: React.FC<{ ticket: TicketData; onClick: () => void }> = ({ ticket, onClick }) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    className="bg-[#222839] rounded-xl border border-gray-700/50 overflow-hidden shadow-lg"
  >
    <div className="p-6">
      <div className="flex justify-between items-start mb-4">
        <div className={`px-3 py-1 text-xs rounded-full ${
          ticket.status === 'upcoming' ? 'bg-[#d7ff42]/10 text-[#d7ff42] border border-[#d7ff42]/20' :
          ticket.status === 'completed' ? 'bg-gray-500/10 text-gray-400 border border-gray-500/20' : 
          'bg-red-500/10 text-red-400 border border-red-500/20'
        }`}>
          {ticket.status.toUpperCase()}
        </div>
        <span className="text-[#d7ff42] font-medium">₹{ticket.price}</span>
      </div>
      
      <h3 className="text-xl font-semibold mb-4 text-white">{ticket.eventName}</h3>
      
      <div className="space-y-2 mb-6 text-gray-400">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-[#7557e1]" />
          <span>
            {typeof ticket.eventDate === 'string' ? ticket.eventDate : 'Date not available'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-[#7557e1]" />
          <span>{ticket.eventTime || 'Time not available'}</span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-[#7557e1]" />
          <span>{ticket.eventLocation}</span>
        </div>
      </div>

      <button
        onClick={onClick}
        className="w-full bg-[#7557e1] text-white py-2.5 rounded-lg hover:opacity-90 transition-all"
      >
        View Ticket
      </button>
    </div>
  </motion.div>
);

const TicketModal: React.FC<{ ticket: TicketData; onClose: () => void }> = ({ ticket, onClose }) => {
  const [activeTab, setActiveTab] = useState<'ticket' | 'participants'>('ticket');
  
  // Make sure participants is always a valid array
  const participants = Array.isArray(ticket.participants) ? ticket.participants : [];
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-[#222839] rounded-xl p-6 max-w-2xl w-full border border-gray-700/50 shadow-xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Header with title and close button */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-2xl font-bold text-white">{ticket.eventName}</h2>
            <div className={`mt-2 inline-block px-3 py-1 text-xs rounded-full ${
              ticket.status === 'upcoming' ? 'bg-[#d7ff42]/10 text-[#d7ff42] border border-[#d7ff42]/20' :
              ticket.status === 'completed' ? 'bg-gray-500/10 text-gray-400 border border-gray-500/20' : 
              'bg-red-500/10 text-red-400 border border-red-500/20'
            }`}>
              {ticket.status.toUpperCase()}
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-[#1d2132] rounded-lg transition-colors">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-700 mb-6">
          <button
            onClick={() => setActiveTab('ticket')}
            className={`py-2 px-4 font-medium transition-colors ${
              activeTab === 'ticket' 
                ? 'text-[#d7ff42] border-b-2 border-[#d7ff42]' 
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            Ticket Details
          </button>
          <button
            onClick={() => setActiveTab('participants')}
            className={`py-2 px-4 font-medium transition-colors ${
              activeTab === 'participants' 
                ? 'text-[#d7ff42] border-b-2 border-[#d7ff42]' 
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            Participants ({participants.length})
          </button>
        </div>

        {/* Ticket Tab Content */}
        {activeTab === 'ticket' ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-[#d7ff42]">Event Details</h3>
                  <div className="space-y-3 text-gray-300">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-[#7557e1]" />
                      <span>
                        {typeof ticket.eventDate === 'string' ? ticket.eventDate : 'Date not available'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-[#7557e1]" />
                      <span>{ticket.eventTime || 'Time not available'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-[#7557e1]" />
                      <span>{ticket.eventLocation}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3 text-[#d7ff42]">Ticket Information</h3>
                  <div className="space-y-2 text-gray-300">
                    <p>Ticket Type: {ticket.ticketType}</p>
                    <p>Ticket #: {ticket.ticketNumber}</p>
                    <p>Purchase Date: {ticket.purchaseDate 
                      ? new Date(ticket.purchaseDate).toLocaleDateString('en-US', {
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric'
                        })
                      : 'Date not available'}
                    </p>
                    <p>Total Participants: {ticket.participants.length}</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-center justify-center p-4 bg-white rounded-lg">
                <QRCode 
                  value={ticket.ticketNumber}
                  size={200}
                  level="H"
                  includeMargin={true}
                />
                <p className="text-sm text-gray-500 mt-2">Scan for verification</p>
              </div>
            </div>

            <div className="flex justify-between mt-6">
              <Link
                to={`/ /${ticket.eventId}`}
                className="px-4 py-2.5 bg-[#1d2132] text-gray-300 rounded-lg hover:text-white transition-colors flex items-center gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                View Event
              </Link>
              <PDFDownloadLink
                document={<TicketPDF ticket={{ ...ticket, qrData: ticket.ticketNumber }} />}
                fileName={`ticket-${ticket.ticketNumber}.pdf`}
                className="px-4 py-2.5 bg-[#7557e1] text-white rounded-lg hover:opacity-90 transition-colors flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download PDF
              </PDFDownloadLink>
            </div>
          </>
        ) : (
          // Simple participants table with minimal styling
          <div className="overflow-hidden rounded-lg">
            {participants.length === 0 ? (
              <div className="p-6 text-center text-gray-400 bg-[#1d2132]">
                <p>No participant information available</p>
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-[#1d2132]">
                  <tr className="border-b border-gray-700">
                    <th className="px-4 py-3 text-left text-gray-300">Name</th>
                    <th className="px-4 py-3 text-left text-gray-300">Email</th>
                    <th className="px-4 py-3 text-left text-gray-300">Type</th>
                  </tr>
                </thead>
                <tbody className="bg-[#1d2132]">
                  {participants && participants.length > 0 ? (
                    participants.map((participant, index) => (
                      <tr key={index} className="border-b border-gray-700/50 last:border-0">
                        <td className="px-4 py-3 text-white">{participant?.name || 'N/A'}</td>
                        <td className="px-4 py-3 text-gray-400">{participant?.email || 'N/A'}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            participant?.attendeeType === 'student' 
                              ? 'bg-blue-500/20 text-blue-400' 
                              : participant?.attendeeType === 'professional' 
                              ? 'bg-purple-500/20 text-purple-400' 
                              : 'bg-gray-500/20 text-gray-400'
                          }`}>
                            {participant?.attendeeType || 'general'}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="text-center py-4 text-gray-400">No participants found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

const Ticket: React.FC = () => {
  const [selectedTicket, setSelectedTicket] = useState<TicketData | null>(null);
  const [tickets, setTickets] = useState<TicketData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        setLoading(true);
        
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }
        
        // First, fetch the bookings
        const bookingResponse = await axios.get(`${serverUrl}/bookings/my-tickets`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        if (!bookingResponse.data.success) {
          setError('Failed to fetch tickets');
          setLoading(false);
          return;
        }
        
        // Get the booking data
        const bookings = bookingResponse.data.data;
        
        // For each booking, fetch the complete event details
        const ticketsWithEventDetails = await Promise.all(
          bookings.map(async (booking: any) => {
            try {
              // Fetch detailed event data using eventId
              const eventResponse = await axios.get(`${serverUrl}/events/getEventById/${booking.eventId}`);
              
              if (eventResponse.data.success) {
                const eventData = eventResponse.data.data;
                
                // Format event date using the same approach as in EventDetails.tsx
                const eventDate = new Date(eventData.startDateTime);
                const formattedDate = eventDate.toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long', 
                  day: 'numeric'
                });
                const formattedTime = eventDate.toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit'
                });
                
                // Create main participant
                const mainParticipant = {
                  name: booking.name,
                  email: booking.email,
                  phone: booking.phone || '',
                  attendeeType: booking.attendeeType,
                  attendanceStatus: booking.attendanceStatus || 'not_marked'
                };
                
                // Process additional participants
                const additionalParticipants = Array.isArray(booking.additionalParticipants) 
                  ? booking.additionalParticipants.map((p: any) => ({
                      name: p.name,
                      email: p.email,
                      phone: '',
                      attendeeType: booking.attendeeType,
                      attendanceStatus: 'not_marked'
                    }))
                  : [];
                
                // Return combined data
                return {
                  id: booking.id,
                  eventName: eventData.title || booking.eventName,
                  eventDate: formattedDate,  // Use the formatted date from event data!
                  eventTime: formattedTime,  // Use the formatted time from event data!
                  eventLocation: eventData.venue || booking.eventLocation || 'Location not available',
                  ticketType: booking.ticketType,
                  ticketNumber: booking.ticketNumber,
                  price: booking.price || 0,
                  purchaseDate: booking.purchaseDate 
                    ? new Date(booking.purchaseDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })
                    : 'Date not available',
                  eventId: booking.eventId,
                  status: booking.status,
                  bookingId: booking.bookingId,
                  participants: [mainParticipant, ...additionalParticipants]
                };
              } else {
                // Fallback to booking data if event fetch fails
                return {
                  id: booking.id,
                  eventName: booking.eventName,
                  eventDate: booking.eventDate,
                  eventTime: booking.eventTime,
                  eventLocation: booking.eventLocation || 'Location not available',
                  ticketType: booking.ticketType,
                  ticketNumber: booking.ticketNumber,
                  price: booking.price || 0,
                  purchaseDate: booking.purchaseDate,
                  eventId: booking.eventId,
                  status: booking.status,
                  bookingId: booking.bookingId,
                  participants: []
                };
              }
            } catch (error) {
              console.error(`Failed to fetch event details for booking ${booking.id}:`, error);
              // Return basic booking info if event fetch fails
              return {
                id: booking.id,
                eventName: booking.eventName,
                eventDate: booking.eventDate,
                eventTime: booking.eventTime,
                eventLocation: booking.eventLocation || 'Location not available',
                ticketType: booking.ticketType,
                ticketNumber: booking.ticketNumber,
                price: booking.price || 0,
                purchaseDate: booking.purchaseDate,
                eventId: booking.eventId,
                status: booking.status,
                bookingId: booking.bookingId,
                participants: []
              };
            }
          })
        );
        
        console.log('Tickets with event details:', ticketsWithEventDetails);
        setTickets(ticketsWithEventDetails);
        
      } catch (error: any) {
        console.error('Error fetching tickets:', error);
        setError(error.response?.data?.error || 'Failed to load tickets');
      } finally {
        setLoading(false);
      }
    };
    
    fetchTickets();
  }, [navigate]);

  if (loading) {
    return (
      <div className="p-6 flex justify-center">
        <div className="flex flex-col items-center">
          <Loader className="w-10 h-10 text-[#7557e1] animate-spin" />
          <p className="mt-4 text-gray-300">Loading your tickets...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-lg">
          <p className="text-red-400">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-2 text-[#7557e1] hover:underline"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-white">My Tickets</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tickets.map((ticket) => (
          <TicketCard
            key={ticket.id}
            ticket={ticket}
            onClick={() => setSelectedTicket(ticket)}
          />
        ))}
      </div>

      <AnimatePresence>
        {selectedTicket && (
          <TicketModal
            ticket={selectedTicket}
            onClose={() => setSelectedTicket(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Ticket;
