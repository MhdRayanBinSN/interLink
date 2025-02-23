import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaTicketAlt, FaUsers, FaCreditCard, FaTag } from 'react-icons/fa';

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

const EventBooking: React.FunctionComponent<IEventBookingProps> = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { register, handleSubmit, watch, setValue } = useForm<BookingFormData>();
  const [showCouponInput, setShowCouponInput] = useState(false);
  const [couponApplied, setCouponApplied] = useState(false);
  const numTickets = watch('numTickets') || 1;

  // Mock event data - replace with API call
  const eventDetails = {
    title: "TechHack 2024",
    price: 999,
    maxParticipants: 3,
    isPaid: true,
  };

  const handleCouponApply = () => {
    const couponCode = watch('couponCode');
    // Add coupon validation logic here
    setCouponApplied(true);
  };

  const onSubmit = async (data: BookingFormData) => {
    try {
      if (eventDetails.isPaid) {
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
      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-[#222839] rounded-[10px] p-8 border border-gray-700">
          <h1 className="text-2xl font-bold text-white mb-6">Book Event: {eventDetails.title}</h1>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Primary Participant Details */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-white">Primary Participant</h2>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Full Name
                </label>
                <input
                  {...register('name', { required: true })}
                  className="w-full px-4 py-2 bg-[#1d2132] border border-gray-700 rounded-[10px] text-white focus:ring-2 focus:ring-[#d7ff42] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  {...register('email', { required: true })}
                  className="w-full px-4 py-2 bg-[#1d2132] border border-gray-700 rounded-[10px] text-white focus:ring-2 focus:ring-[#d7ff42] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  {...register('phone', { required: true })}
                  className="w-full px-4 py-2 bg-[#1d2132] border border-gray-700 rounded-[10px] text-white focus:ring-2 focus:ring-[#d7ff42] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Attendee Type
                </label>
                <select
                  {...register('attendeeType', { required: true })}
                  className="w-full px-4 py-2 bg-[#1d2132] border border-gray-700 rounded-[10px] text-white focus:ring-2 focus:ring-[#d7ff42] focus:border-transparent"
                >
                  <option value="student">Student</option>
                  <option value="professional">Professional</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            {/* Number of Tickets */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Number of Tickets
              </label>
              <select
                {...register('numTickets')}
                className="w-full px-4 py-2 bg-[#1d2132] border border-gray-700 rounded-[10px] text-white focus:ring-2 focus:ring-[#d7ff42] focus:border-transparent"
              >
                {[...Array(eventDetails.maxParticipants)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </select>
            </div>

            {/* Additional Participants */}
            {numTickets > 1 && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-white">Additional Participants</h2>
                {[...Array(numTickets - 1)].map((_, index) => (
                  <div key={index} className="p-4 bg-[#1d2132] rounded-[10px] space-y-4">
                    <h3 className="text-white">Participant {index + 2}</h3>
                    <input
                      {...register(`participants.${index}.name`)}
                      placeholder="Full Name"
                      className="w-full px-4 py-2 bg-[#222839] border border-gray-700 rounded-[10px] text-white focus:ring-2 focus:ring-[#d7ff42] focus:border-transparent"
                    />
                    <input
                      type="email"
                      {...register(`participants.${index}.email`)}
                      placeholder="Email"
                      className="w-full px-4 py-2 bg-[#222839] border border-gray-700 rounded-[10px] text-white focus:ring-2 focus:ring-[#d7ff42] focus:border-transparent"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Coupon Section */}
            {eventDetails.isPaid && (
              <div className="space-y-4">
                <button
                  type="button"
                  onClick={() => setShowCouponInput(!showCouponInput)}
                  className="flex items-center text-[#d7ff42] hover:text-opacity-80"
                >
                  <FaTag className="mr-2" />
                  {showCouponInput ? 'Hide Coupon' : 'Add Coupon'}
                </button>
                
                {showCouponInput && (
                  <div className="flex space-x-2">
                    <input
                      {...register('couponCode')}
                      placeholder="Enter coupon code"
                      className="flex-1 px-4 py-2 bg-[#1d2132] border border-gray-700 rounded-[10px] text-white focus:ring-2 focus:ring-[#d7ff42] focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={handleCouponApply}
                      className="px-4 py-2 bg-[#7557e1] text-white rounded-[10px] hover:bg-opacity-90"
                    >
                      Apply
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Price Summary */}
            {eventDetails.isPaid && (
              <div className="p-4 bg-[#1d2132] rounded-[10px] space-y-2">
                <div className="flex justify-between text-gray-300">
                  <span>Ticket Price</span>
                  <span>₹{eventDetails.price} × {numTickets}</span>
                </div>
                {couponApplied && (
                  <div className="flex justify-between text-[#d7ff42]">
                    <span>Coupon Discount</span>
                    <span>-₹{eventDetails.price * 0.1 * numTickets}</span>
                  </div>
                )}
                <div className="flex justify-between text-white font-semibold pt-2 border-t border-gray-700">
                  <span>Total Amount</span>
                  <span>₹{couponApplied 
                    ? eventDetails.price * numTickets * 0.9 
                    : eventDetails.price * numTickets}
                  </span>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full px-6 py-3 bg-[#d7ff42] text-[#1d2132] rounded-[10px] font-semibold hover:bg-opacity-90 flex items-center justify-center gap-2"
            >
              {eventDetails.isPaid ? <FaCreditCard /> : <FaTicketAlt />}
              {eventDetails.isPaid ? 'Proceed to Payment' : 'Complete Booking'}
            </button>
          </form>
        </div>
      </div>
    </motion.div>
  );
};

export default EventBooking;
