import React, { useRef, useEffect, useCallback, useState } from 'react';
import { useLocation, useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaTicketAlt, FaCalendarAlt, FaMapMarkerAlt, FaUserFriends, FaPrint } from 'react-icons/fa';
import QRCode from 'qrcode.react';
import { format } from 'date-fns';
import axios from 'axios';
import { serverUrl } from '../../helpers/Constant';
import { toast } from 'react-toastify';

const BookingConfirmation: React.FC = () => {
  const location = useLocation();
  const { bookingId } = useParams<{ bookingId: string }>();
  const bookingData = location.state?.bookingData;
  const event = location.state?.event;
  const participants = location.state?.participants;
  const totalAmount = location.state?.totalAmount;
  const isFree = location.state?.isFree;
  const navigate = useNavigate();
  
  const printRef = useRef<HTMLDivElement>(null);
  
  // Add this inside your component, near the top
  const [loading, setLoading] = useState<boolean>(bookingData ? false : true);

  // At the beginning of your component
  const isTemporaryBooking = bookingId?.startsWith('temp-') || 
                            bookingData?._id?.startsWith('temp-') ||
                            !bookingData?._id;

  // Add at the beginning of your component
  useEffect(() => {
    console.log('BookingConfirmation received state:', {
      bookingId,
      bookingDataFromState: location.state?.bookingData,
      eventFromState: location.state?.event,
      participantsFromState: location.state?.participants,
      totalAmountFromState: location.state?.totalAmount,
      isFreeFromState: location.state?.isFree
    });
  }, []);

  // Add this after your state declarations
  useEffect(() => {
    // If we have booking ID but no booking data, try to fetch it
    if (bookingId && !bookingData) {
      const fetchBookingData = async () => {
        try {
          const token = localStorage.getItem('token');
          if (!token) {
            toast.error('Authentication required');
            navigate('/login');
            return;
          }
          
          const response = await axios.get(
            `${serverUrl}/bookings/${bookingId}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          
          if (response.data.success) {
            // Update local state with fetched data
            const fetchedData = response.data.data;
            // Now you need to handle this data...
            
            // You'll need to implement handling the fetched data
            setLoading(false);
          }
        } catch (error) {
          console.error('Error fetching booking details:', error);
          setLoading(false);
        }
      };
      
      fetchBookingData();
    }
  }, [bookingId, bookingData, navigate]);

  // Replace these lines:
  const handlePrint = () => {
    window.print();
  };

  // Safety check for data
  const hasRequiredData = bookingData && event;
  
  if (!hasRequiredData) {
    return (
      <div className="min-h-screen bg-[#1d2132] py-12">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <div className="bg-[#222839] rounded-[10px] p-8 border border-gray-700">
            <h1 className="text-2xl font-bold text-white mb-4">Booking Information Not Found</h1>
            <p className="text-gray-400 mb-6">
              We couldn't find the details for this booking. Please check your tickets in your dashboard.
            </p>
            <Link 
              to="/dashboard/tickets"
              className="inline-block px-6 py-3 bg-[#d7ff42] text-[#1d2132] rounded-lg font-medium"
            >
              Go to My Tickets
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  // Safe date formatting function
  const formatDate = (dateString: string | undefined, formatString: string) => {
    if (!dateString) return 'TBD';
    try {
      return format(new Date(dateString), formatString);
    } catch (error) {
      console.error('Date formatting error:', error);
      return 'Invalid Date';
    }
  };
  
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-[#1d2132] py-12"
    >
      <div className="max-w-4xl mx-auto px-4">
        {/* Success Message */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500 bg-opacity-20 mb-4">
            <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">Booking Confirmed!</h1>
          <p className="text-gray-400 mt-2">
            Your tickets have been booked successfully. You will receive a confirmation email shortly.
          </p>
        </div>
        
        {/* Temporary Booking Message */}
        {isTemporaryBooking && (
          <div className="bg-yellow-500 bg-opacity-20 border border-yellow-500 rounded-lg p-4 mb-6 text-yellow-200">
            <p className="font-medium">This is a temporary booking confirmation.</p>
            <p className="text-sm">Once our booking system is back online, your confirmed booking details will be sent to your email.</p>
          </div>
        )}
        
        {/* Ticket Details Card - This will be printed */}
        <div 
          ref={printRef}
          className="bg-[#222839] rounded-[10px] p-6 border border-gray-700 mb-6"
        >
          {/* Header - Show in printed version */}
          <div className="print:block hidden mb-6 text-center">
            <h1 className="text-2xl font-bold">Event Ticket</h1>
            <p>{event.title}</p>
          </div>
          
          {/* Ticket Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 pb-6 border-b border-gray-700">
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-full bg-[#d7ff42] text-[#1d2132] flex items-center justify-center mr-4">
                <FaTicketAlt className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">{event.title}</h2>
                <p className="text-gray-400">Booking #{bookingData.bookingId || bookingId}</p>
              </div>
            </div>
            <div className="mt-4 md:mt-0">
              <div className="text-right">
                <div className="bg-[#1d2132] rounded-lg p-3 inline-block">
                  <QRCode 
                    value={`${bookingData.bookingId || bookingId}`} 
                    size={80} 
                    bgColor="#1d2132" 
                    fgColor="#ffffff" 
                  />
                </div>
              </div>
            </div>
          </div>
          
          {/* Event Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-sm uppercase text-gray-400 mb-2">Event Details</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <FaCalendarAlt className="w-4 h-4 text-[#d7ff42] mr-3" />
                  <div>
                    <p className="text-white font-medium">
                      {formatDate(event.startDateTime || event.date, 'EEEE, MMMM d, yyyy')}
                    </p>
                    <p className="text-gray-400 text-sm">
                      {event.startDateTime || event.date ? formatDate(event.startDateTime || event.date, 'h:mm a') : ''}
                      {event.endDateTime ? ` - ${formatDate(event.endDateTime, 'h:mm a')}` : ' TBD'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <FaMapMarkerAlt className="w-4 h-4 text-[#d7ff42] mr-3" />
                  <p className="text-white">
                    {event.location || event.venue || 'Online Event'}
                  </p>
                </div>
                <div className="flex items-center">
                  <FaUserFriends className="w-4 h-4 text-[#d7ff42] mr-3" />
                  <p className="text-white">
                    {participants && Array.isArray(participants) ? participants.length : 0} 
                    {(!participants || !Array.isArray(participants) || participants.length === 1) ? ' Participant' : ' Participants'}
                  </p>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-sm uppercase text-gray-400 mb-2">Order Summary</h3>
              <div className="bg-[#1d2132] rounded-lg p-4">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-400">Tickets</span>
                  <span className="text-white">
                    {participants && Array.isArray(participants) ? participants.length : 0}x
                  </span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-400">Price per ticket</span>
                  <span className="text-white">{isFree ? 'Free' : `₹${event.ticketPrice || 0}`}</span>
                </div>
                <div className="border-t border-gray-700 my-2 pt-2">
                  <div className="flex justify-between font-medium">
                    <span className="text-gray-400">Total</span>
                    <span className="text-[#d7ff42]">{isFree ? 'Free' : `₹${totalAmount || 0}`}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Attendee Information */}
          <div className="mb-6">
            <h3 className="text-sm uppercase text-gray-400 mb-4">Attendee Information</h3>
            <div className="space-y-4">
              {participants && Array.isArray(participants) && participants.length > 0 ? 
                participants.map((participant, index) => (
                  <div 
                    key={index}
                    className="bg-[#1d2132] rounded-lg p-4"
                  >
                    <div className="flex items-center mb-3">
                      <div className="w-6 h-6 rounded-full bg-[#d7ff42] text-[#1d2132] flex items-center justify-center mr-2 text-xs font-bold">
                        {index + 1}
                      </div>
                      <h4 className="text-white font-medium">
                        {index === 0 ? 'Primary Contact' : `Attendee ${index}`}
                      </h4>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="text-gray-400">Name</p>
                        <p className="text-white font-medium">{participant.name || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Email</p>
                        <p className="text-white font-medium">{participant.email || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Phone</p>
                        <p className="text-white font-medium">{participant.phone || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Type</p>
                        <p className="text-white font-medium capitalize">{participant.attendeeType || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                )) : (
                  <div className="bg-[#1d2132] rounded-lg p-4">
                    <p className="text-white">Participant information not available</p>
                  </div>
                )
              }
            </div>
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <Link 
            to="/dashboard/tickets"
            className="px-6 py-3 bg-[#2a2f44] text-white rounded-lg font-medium text-center hover:bg-opacity-80 flex-1"
          >
            View All Tickets
          </Link>
          <button
            onClick={handlePrint}
            className="px-6 py-3 bg-[#d7ff42] text-[#1d2132] rounded-lg font-medium hover:bg-opacity-90 flex items-center justify-center gap-2 flex-1"
          >
            <FaPrint className="w-4 h-4" />
            Print Ticket
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default BookingConfirmation;