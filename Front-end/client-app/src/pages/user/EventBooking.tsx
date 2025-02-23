import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaTicketAlt, FaUsers, FaCreditCard, FaTag, FaMinus, FaPlus } from 'react-icons/fa';

interface IEventBookingProps {}

type BookingFormData = {
  name: string;
  email: string;
  phone: string;
  attendeeType: 'student' | 'professional' | 'other';
  numTickets: number;
  participants: {
    name: string;
    email: string;
  }[];
  couponCode?: string;
};

const mockEvents = [
  {
    id: '1',
    title: "React Summit 2024",
    price: 599,
    maxParticipants: 100,
    isPaid: true,
    date: new Date(),
  },
  // Add more mock events here
];

export const EventBooking: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // Find the event details using the ID
  const event = mockEvents.find(e => e.id === id);

  if (!event) {
    return (
      <div className="min-h-screen bg-[#1d2132] py-12">
        <div className="max-w-3xl mx-auto px-4">
          <h1 className="text-2xl font-bold text-white">Event not found</h1>
        </div>
      </div>
    );
  }

  // Update the form's initial values with event details
  const defaultValues = {
    numTickets: 1,
    participants: [],
  };

  const { register, handleSubmit, watch, setValue } = useForm<BookingFormData>({ defaultValues });
  const [showCouponInput, setShowCouponInput] = useState(false);
  const [couponApplied, setCouponApplied] = useState(false);
  const numTickets = watch('numTickets') || 1;

  const handleCouponApply = () => {
    const couponCode = watch('couponCode');
    // Add coupon validation logic here
    setCouponApplied(true);
  };

  const onSubmit = async (data: BookingFormData) => {
    try {
      if (event.isPaid) {
        // Implement payment gateway integration
        console.log('Processing payment...');
      }
      
      // Submit booking data
      console.log('Booking data:', data);
      
      // Navigate to success page
      navigate('/booking-success');
    } catch (error) {
      console.error('Booking failed:', error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-[#1d2132] py-12"
    >
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form - Takes 2 columns */}
          <div className="lg:col-span-2 space-y-4">
            {/* Event Info Card */}
            <div className="bg-[#222839] rounded-[10px] p-6 border border-gray-700">
              <div className="flex items-start space-x-4">
                <div className="w-24 h-24 bg-[#1d2132] rounded-lg flex items-center justify-center">
                  <FaTicketAlt className="w-8 h-8 text-[#d7ff42]" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">{event.title}</h1>
                  <p className="text-gray-400">{event.date.toDateString()}</p>
                  <div className="mt-2 inline-flex items-center px-3 py-1 rounded-full bg-[#d7ff42]/10 text-[#d7ff42] text-sm">
                    {event.maxParticipants - numTickets} spots remaining
                  </div>
                </div>
              </div>
            </div>

            {/* Steps Section */}
            <div className="space-y-4">
              {/* Step 1: Tickets */}
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
                    <p className="text-gray-400">₹{event.price} per ticket</p>
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

              {/* Step 2: Primary Contact */}
              <div className="bg-[#222839] rounded-[10px] p-6 border border-gray-700">
                <div className="flex items-center mb-4">
                  <span className="w-8 h-8 rounded-full bg-[#d7ff42] text-[#1d2132] flex items-center justify-center font-bold mr-3">
                    2
                  </span>
                  <h2 className="text-lg font-semibold text-white">Primary Contact</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    {...register('name', { required: true })}
                    placeholder="Full Name"
                    className="w-full px-4 py-3 bg-[#1d2132] border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-[#d7ff42] focus:border-transparent"
                  />
                  <input
                    {...register('email', { required: true })}
                    type="email"
                    placeholder="Email Address"
                    className="w-full px-4 py-3 bg-[#1d2132] border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-[#d7ff42] focus:border-transparent"
                  />
                  <input
                    {...register('phone', { required: true })}
                    type="tel"
                    placeholder="Phone Number"
                    className="w-full px-4 py-3 bg-[#1d2132] border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-[#d7ff42] focus:border-transparent"
                  />
                  <select
                    {...register('attendeeType', { required: true })}
                    className="w-full px-4 py-3 bg-[#1d2132] border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-[#d7ff42] focus:border-transparent"
                  >
                    <option value="">Select Type</option>
                    <option value="student">Student</option>
                    <option value="professional">Professional</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              {/* Step 3: Additional Participants */}
              {numTickets > 1 && (
                <div className="bg-[#222839] rounded-[10px] p-6 border border-gray-700">
                  <div className="flex items-center mb-4">
                    <span className="w-8 h-8 rounded-full bg-[#d7ff42] text-[#1d2132] flex items-center justify-center font-bold mr-3">
                      3
                    </span>
                    <h2 className="text-lg font-semibold text-white">Additional Participants</h2>
                  </div>
                  
                  {[...Array(numTickets - 1)].map((_, index) => (
                    <div key={index} className="mb-4 p-4 bg-[#1d2132] rounded-lg space-y-4">
                      <p className="text-gray-400">Participant {index + 2}</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                          {...register(`participants.${index}.name`)}
                          placeholder="Full Name"
                          className="w-full px-4 py-3 bg-[#222839] border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-[#d7ff42] focus:border-transparent"
                        />
                        <input
                          {...register(`participants.${index}.email`)}
                          type="email"
                          placeholder="Email Address"
                          className="w-full px-4 py-3 bg-[#222839] border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-[#d7ff42] focus:border-transparent"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Order Summary - Takes 1 column */}
          <div className="lg:col-span-1">
            <div className="bg-[#222839] rounded-[10px] p-6 border border-gray-700 sticky top-6">
              <h2 className="text-lg font-semibold text-white mb-4">Order Summary</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between text-gray-300">
                  <span>Tickets ({numTickets})</span>
                  <span>₹{event.price * numTickets}</span>
                </div>

                {event.isPaid && (
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

                {couponApplied && (
                  <div className="flex justify-between text-[#d7ff42]">
                    <span>Discount</span>
                    <span>-₹{event.price * 0.1 * numTickets}</span>
                  </div>
                )}

                <div className="border-t border-gray-700 pt-4 mt-4">
                  <div className="flex justify-between text-white font-semibold">
                    <span>Total</span>
                    <span>₹{couponApplied 
                      ? event.price * numTickets * 0.9 
                      : event.price * numTickets}
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full px-6 py-4 bg-[#d7ff42] text-[#1d2132] rounded-lg font-semibold hover:bg-opacity-90 flex items-center justify-center gap-2 mt-6"
                >
                  {event.isPaid ? <FaCreditCard className="w-5 h-5" /> : <FaTicketAlt className="w-5 h-5" />}
                  {event.isPaid ? 'Proceed to Payment' : 'Complete Booking'}
                </button>

                <p className="text-center text-xs text-gray-400 mt-4">
                  By proceeding, you agree to our Terms & Conditions
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default EventBooking;
