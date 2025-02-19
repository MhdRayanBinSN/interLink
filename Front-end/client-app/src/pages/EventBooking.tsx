import * as React from 'react';
import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { useStore } from "../store"
import QRCode from "react-qr-code"

interface IEventBookingProps {
}

const EventBooking: React.FunctionComponent<IEventBookingProps> = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const { events, user, bookEvent } = useStore()
    const [isBooking, setIsBooking] = useState(false)
  
    const event = events.find((e) => e.id === id)
  
    if (!event) {
      return <div>Event not found</div>
    }
  
    const handleBooking = () => {
      if (!user) {
        navigate("/login")
        return
      }
  
      setIsBooking(true)
      setTimeout(() => {
        bookEvent(event.id, user.id)
        setIsBooking(false)
      }, 1500)
    }
  
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
      >
        <h1 className="text-3xl font-extrabold text-gray-900 mb-6">{event.title}</h1>
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Event Details</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">{event.description}</p>
          </div>
          <div className="border-t border-gray-200">
            <dl>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Date</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{event.date}</dd>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Price</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">${event.price}</dd>
              </div>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Category</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{event.category}</dd>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Available Slots</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{event.availableSlots}</dd>
              </div>
            </dl>
          </div>
        </div>
        <div className="mt-8 flex justify-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleBooking}
            disabled={isBooking || event.availableSlots === 0}
            className={`px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
              (isBooking || event.availableSlots === 0) && "opacity-50 cursor-not-allowed"
            }`}
          >
            {isBooking ? "Booking..." : event.availableSlots === 0 ? "Sold Out" : "Book Now"}
          </motion.button>
        </div>
        {user && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Your Ticket</h2>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <QRCode value={`event:${event.id}:user:${user.id}`} />
              <p className="mt-4 text-sm text-gray-600">Show this QR code at the event entrance for quick check-in.</p>
            </div>
          </div>
        )}
      </motion.div>
    )
};

export default EventBooking;
