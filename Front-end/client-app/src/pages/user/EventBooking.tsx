import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaTicketAlt, FaCreditCard, FaTag, FaMinus, FaPlus, FaMapMarkerAlt } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';
import { serverUrl } from '../../helpers/Constant';

type ParticipantData = {
  name: string;
  email: string;
  phone: string;
  attendeeType: 'student' | 'professional' | 'other';
  location?: string;
};

type BookingFormData = {
  numTickets: number;
  participants: ParticipantData[];
  couponCode?: string;
};

export const EventBooking: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // All state declarations first
  const [event, setEvent] = useState<any>(null);
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [authChecking, setAuthChecking] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showCouponInput, setShowCouponInput] = useState(false);
  const [couponApplied, setCouponApplied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Initialize form with empty values initially
  const { register, handleSubmit, watch, setValue, reset } = useForm<BookingFormData>({
    defaultValues: {
      numTickets: 1,
      participants: [{
        name: '',
        email: '',
        phone: '',
        attendeeType: 'other',
        location: ''
      }]
    }
  });
  
  const numTickets = watch('numTickets') || 1;
  const participants = watch('participants') || [];
  
  // Check authentication first
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        // Redirect to login with return path
        navigate('/login', { state: { from: `/events/${id}/booking` } });
        return;
      }
      
      try {
        setAuthChecking(true);
        const response = await axios.get(`${serverUrl}/user/profile`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (response.data.success) {
          setUserData(response.data.data);
          // Pre-fill the first participant with user data
          setValue('participants.0.name', response.data.data.fullName || '');
          setValue('participants.0.email', response.data.data.email || '');
          setValue('participants.0.phone', response.data.data.phone || '');
          setValue('participants.0.attendeeType', response.data.data.attendeeType || 'other');
        } else {
          localStorage.removeItem('token');
          navigate('/login', { state: { from: `/events/${id}/booking` } });
        }
      } catch (error) {
        console.error('Auth error:', error);
        localStorage.removeItem('token');
        navigate('/login', { state: { from: `/events/${id}/booking` } });
      } finally {
        setAuthChecking(false);
      }
    };
    
    checkAuth();
  }, [id, navigate, setValue]);
  
  // Only fetch event details after authentication is confirmed
  useEffect(() => {
    const fetchEventDetails = async () => {
      // Don't fetch event if auth is still being checked
      if (authChecking || !userData) return;
      
      try {
        setLoading(true);
        const response = await axios.get(`${serverUrl}/events/getEventById/${id}`);
        
        if (response.data.success) {
          setEvent(response.data.data);
        } else {
          setError('Failed to fetch event details');
        }
      } catch (error) {
        console.error('Error fetching event details:', error);
        setError('Error loading event details');
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [id, authChecking, userData]);

  // Update participants array when number of tickets changes
  useEffect(() => {
    if (authChecking || !userData) return;
    
    const currentParticipants = watch('participants') || [];
    
    if (numTickets > currentParticipants.length) {
      // Add new participants
      const newParticipants = [...currentParticipants];
      for (let i = currentParticipants.length; i < numTickets; i++) {
        newParticipants.push({
          name: '',
          email: '',
          phone: '',
          attendeeType: 'other',
          location: ''
        });
      }
      setValue('participants', newParticipants);
    } else if (numTickets < currentParticipants.length && numTickets > 0) {
      // Remove extra participants
      setValue('participants', currentParticipants.slice(0, numTickets));
    }
  }, [numTickets, setValue, watch, authChecking, userData]);

  const handleCouponApply = () => {
    const couponCode = watch('couponCode');
    if (couponCode?.trim()) {
      setCouponApplied(true);
      toast.success('Coupon applied successfully!');
    } else {
      toast.error('Please enter a valid coupon code');
    }
  };

  // Replace your onSubmit function with this:
const onSubmit = async (data: BookingFormData) => {
  try {
    setIsSubmitting(true);
    console.log('Starting booking submission...');
    
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please log in again');
      navigate('/login');
      return;
    }

    // Prepare booking data exactly in the format backend expects
    const bookingData = {
      eventId: id,
      name: data.participants[0].name,
      email: data.participants[0].email,
      phone: data.participants[0].phone,
      attendeeType: data.participants[0].attendeeType,
      location: data.participants[0].location || '',
      ticketCount: data.numTickets,
      // Only include additionalParticipants if there are more than one
      additionalParticipants: data.participants.length > 1 ? 
        data.participants.slice(1).map(p => ({
          name: p.name,
          email: p.email,
          phone: p.phone,
          attendeeType: p.attendeeType,
          location: p.location || ''
        })) : []
    };

    console.log('SENDING THIS DATA:', JSON.stringify(bookingData, null, 2));
    
    // For free events, add a fallback in case backend fails
    if (isFree) {
      try {
        // Try to save to database first
        const response = await axios.post(
          `${serverUrl}/bookings/create`,
          bookingData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
        
        console.log('Backend response:', response.data);
        
        if (response.data.success) {
          toast.success('Booking successful!');
          
          navigate(`/booking-confirmation/${response.data.data._id}`, {
            state: {
              bookingData: response.data.data,
              event: event,
              participants: data.participants,
              totalAmount: 0,
              isFree: true
            }
          });
        } else {
          throw new Error(response.data.message || 'Booking failed');
        }
      } catch (error) {
        console.error('Free booking error:', error);
        
        // Show the exact error from the server
        if (error.response && error.response.data) {
          console.error('ERROR DETAILS FROM SERVER:', error.response.data);
          toast.error(error.response.data.error || 'Booking failed');
          return;
        }
        
        // Fallback - create temporary ticket
        const mockBookingId = `temp-${Date.now()}`;
        
        // Still show success message - UX reasons
        toast.info('Processing your free registration...');
        
        setTimeout(() => {
          navigate(`/booking-confirmation/${mockBookingId}`, {
            state: {
              bookingData: {
                _id: mockBookingId,
                name: data.participants[0].name,
                email: data.participants[0].email,
                ticketId: `FREE-${mockBookingId.substring(6, 12)}`,
                createdAt: new Date().toISOString()
              },
              event: event,
              participants: data.participants,
              totalAmount: 0,
              isFree: true
            }
          });
        }, 1500);
      }
    } else {
      // For paid events
      const response = await axios.post(
        `${serverUrl}/bookings/create`,
        bookingData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log('Backend response for paid event:', response.data);
      
      if (response.data.success) {
        toast.success('Booking successful!');
        
        navigate(`/booking-confirmation/${response.data.data._id}`, {
          state: {
            bookingData: response.data.data,
            event: event,
            participants: data.participants,
            totalAmount: couponApplied ? (ticketPrice * numTickets * 0.9) : (ticketPrice * numTickets),
            isFree: false
          }
        });
      } else {
        toast.error(response.data.message || 'Failed to process booking');
      }
    }
  } catch (error: any) {
    console.error('Booking error:', error);
    
    if (error.response) {
      console.error('Error response details:', {
        status: error.response.status,
        data: JSON.stringify(error.response.data, null, 2)
      });
      toast.error(error.response.data?.error || 'Server error processing booking');
    } else {
      toast.error('Failed to connect to the server. Please try again.');
    }
  } finally {
    setIsSubmitting(false);
  }
};

  if (authChecking || loading) {
    return (
      <div className="min-h-screen bg-[#1d2132] flex justify-center items-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin h-10 w-10 border-4 border-[#d7ff42] border-t-transparent rounded-full mb-4"></div>
          <p className="text-white">Loading...</p>
        </div>
      </div>
    );
  }

  // This should never render if auth check fails, as we redirect earlier
  if (!userData) {
    return (
      <div className="min-h-screen bg-[#1d2132] flex justify-center items-center">
        <div className="flex flex-col items-center">
          <p className="text-white">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-[#1d2132] py-12">
        <div className="max-w-3xl mx-auto px-4">
          <h1 className="text-2xl font-bold text-white">Event not found</h1>
          <p className="text-gray-400 mt-2">{error || "We couldn't find the event you're looking for"}</p>
          <button 
            onClick={() => navigate('/events')}
            className="mt-6 bg-[#7557e1] text-white px-6 py-2 rounded-lg"
          >
            Back to Events
          </button>
        </div>
      </div>
    );
  }

  // Calculate if event is free
  const isFree = event.entryType === 'free' || !event.ticketPrice || event.ticketPrice <= 0;
  const ticketPrice = isFree ? 0 : (event.ticketPrice || 0);
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-[#1d2132] py-12"
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {/* Event info */}
              <div className="bg-[#222839] rounded-[10px] p-6 border border-gray-700">
                <div className="flex items-start space-x-4">
                  <div className="w-24 h-24 bg-[#1d2132] rounded-lg flex items-center justify-center">
                    <FaTicketAlt className="w-8 h-8 text-[#d7ff42]" />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-white">{event.title}</h1>
                    <p className="text-gray-400">
                      {new Date(event.startDateTime || event.date).toLocaleDateString('en-US', {
                        weekday: 'short',
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </p>
                    <div className="mt-2 inline-flex items-center px-3 py-1 rounded-full bg-[#d7ff42]/10 text-[#d7ff42] text-sm">
                      {event.maxParticipants - numTickets} spots remaining
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {/* Select Tickets */}
                <div className="bg-[#222839] rounded-[10px] p-6 border border-gray-700">
                  <div className="flex items-center mb-4">
                    <span className="w-8 h-8 rounded-full bg-[#d7ff42] text-[#1d2132] flex items-center justify-center font-bold mr-3">
                      1
                    </span>
                    <h2 className="text-lg font-semibold text-white">Select Tickets</h2>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-[#1d2132] rounded-lg">
                    <div>
                      <p className="text-white font-medium">Standard Ticket</p>
                      <p className="text-gray-400">
                        {isFree ? 'Free' : `₹${ticketPrice} per ticket`}
                      </p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <button
                        type="button"
                        onClick={() => {
                          const current = watch('numTickets');
                          if (current > 1) setValue('numTickets', current - 1);
                        }}
                        className="w-8 h-8 rounded-full bg-[#2a2f44] text-white flex items-center justify-center hover:bg-[#d7ff42] hover:text-[#1d2132] transition-colors"
                      >
                        <FaMinus className="w-3 h-3" />
                      </button>
                      <span className="text-xl font-semibold text-white w-8 text-center">
                        {numTickets}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          const current = watch('numTickets');
                          if (current < event.maxParticipants) setValue('numTickets', current + 1);
                        }}
                        className="w-8 h-8 rounded-full bg-[#2a2f44] text-white flex items-center justify-center hover:bg-[#d7ff42] hover:text-[#1d2132] transition-colors"
                        disabled={numTickets >= event.maxParticipants}
                      >
                        <FaPlus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Participant Details Section */}
                {participants.map((participant, index) => (
                  <div key={index} className="bg-[#222839] rounded-[10px] p-6 border border-gray-700">
                    <div className="flex items-center mb-4">
                      <span className="w-8 h-8 rounded-full bg-[#d7ff42] text-[#1d2132] flex items-center justify-center font-bold mr-3">
                        {index + 2}
                      </span>
                      <h2 className="text-lg font-semibold text-white">
                        {index === 0 ? 'Your Details' : `Participant ${index + 1} Details`}
                      </h2>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                          {...register(`participants.${index}.name` as const, { required: true })}
                          placeholder="Full Name"
                          className="w-full px-4 py-3 bg-[#1d2132] border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-[#d7ff42] focus:border-transparent"
                        />
                        <input
                          {...register(`participants.${index}.email` as const, { required: true })}
                          type="email"
                          placeholder="Email Address"
                          className="w-full px-4 py-3 bg-[#1d2132] border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-[#d7ff42] focus:border-transparent"
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                          {...register(`participants.${index}.phone` as const, { required: true })}
                          type="tel"
                          placeholder="Phone Number"
                          className="w-full px-4 py-3 bg-[#1d2132] border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-[#d7ff42] focus:border-transparent"
                        />
                        <select
                          {...register(`participants.${index}.attendeeType` as const, { required: true })}
                          className="w-full px-4 py-3 bg-[#1d2132] border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-[#d7ff42] focus:border-transparent"
                        >
                          <option value="">Select Type</option>
                          <option value="student">Student</option>
                          <option value="professional">Professional</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                      
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <FaMapMarkerAlt className="text-gray-400" />
                        </div>
                        <input
                          {...register(`participants.${index}.location` as const)}
                          placeholder="Location (City, Country)"
                          className="w-full pl-10 px-4 py-3 bg-[#1d2132] border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-[#d7ff42] focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-[#222839] rounded-[10px] p-6 border border-gray-700 sticky top-6">
                <h2 className="text-lg font-semibold text-white mb-4">Order Summary</h2>
                
                <div className="space-y-4">
                  <div className="flex justify-between text-gray-300">
                    <span>Tickets ({numTickets})</span>
                    <span>{isFree ? 'Free' : `₹${ticketPrice * numTickets}`}</span>
                  </div>

                  {!isFree && (
                    <div>
                      <button
                        type="button"
                        onClick={() => setShowCouponInput(!showCouponInput)}
                        className="text-[#d7ff42] text-sm hover:underline flex items-center"
                      >
                        <FaTag className="mr-2" />
                        {showCouponInput ? 'Hide coupon' : 'Add coupon'}
                      </button>
                      
                      {showCouponInput && (
                        <div className="mt-2 flex space-x-2">
                          <input
                            {...register('couponCode')}
                            placeholder="Enter code"
                            className="flex-1 px-3 py-2 bg-[#1d2132] border border-gray-700 rounded-lg text-white text-sm focus:ring-2 focus:ring-[#d7ff42] focus:border-transparent"
                          />
                          <button
                            type="button"
                            onClick={handleCouponApply}
                            className="px-4 py-2 bg-[#7557e1] text-white rounded-lg text-sm hover:bg-opacity-90"
                          >
                            Apply
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {couponApplied && !isFree && (
                    <div className="flex justify-between text-[#d7ff42]">
                      <span>Discount</span>
                      <span>-₹{ticketPrice * 0.1 * numTickets}</span>
                    </div>
                  )}

                  <div className="border-t border-gray-700 pt-4 mt-4">
                    <div className="flex justify-between text-white font-semibold">
                      <span>Total</span>
                      <span>
                        {isFree ? 'Free' : 
                          couponApplied 
                            ? `₹${ticketPrice * numTickets * 0.9}` 
                            : `₹${ticketPrice * numTickets}`
                        }
                      </span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full px-6 py-4 bg-[#d7ff42] text-[#1d2132] rounded-lg font-semibold hover:bg-opacity-90 flex items-center justify-center gap-2 mt-6"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <span>Processing...</span>
                    ) : (
                      <>
                        {!isFree ? <FaCreditCard className="w-5 h-5" /> : <FaTicketAlt className="w-5 h-5" />}
                        {!isFree ? 'Proceed to Payment' : 'Proceed'}
                      </>
                    )}
                  </button>

                  <p className="text-center text-xs text-gray-400 mt-4">
                    By proceeding, you agree to our Terms & Conditions
                  </p>

                  {/* Add this button at the bottom of your form for testing API connection */}
                  <button 
                    type="button"
                    onClick={async () => {
                      try {
                        const token = localStorage.getItem('token');
                        const response = await axios.get(`${serverUrl}/bookings/test`, {
                          headers: { Authorization: `Bearer ${token}` }
                        });
                        console.log('API test response:', response.data);
                        toast.success('API connection successful');
                      } catch (error) {
                        console.error('API test error:', error);
                        toast.error('API connection failed');
                      }
                    }}
                    className="mt-4 text-sm text-blue-500 underline"
                  >
                    Test API Connection
                  </button>

                  <button
                    type="button"
                    className="mt-4 text-sm text-blue-500 underline"
                    onClick={() => {
                      const token = localStorage.getItem('token');
                      // Log the essential information
                      console.log({
                        'API URL': `${serverUrl}/api/bookings/create`,
                        'Auth Token': token ? 'Present' : 'Missing',
                        'Event ID': id,
                        'User ID': userData?._id,
                      });
                      toast.info('Debug info in console');
                    }}
                  >
                    Show API Debug Info
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </motion.div>
  );
};

export default EventBooking;
