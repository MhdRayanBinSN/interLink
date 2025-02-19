import * as React from 'react';

import { motion } from "framer-motion"
import { useStore } from "../store"
import QRCode from "react-qr-code"

interface IUserDashboardProps {
}

const UserDashboard: React.FunctionComponent<IUserDashboardProps> = (props) => {
    const { user, getBookingsByUser, events } = useStore()

    if (!user) {
      return <div>Please log in to view your dashboard.</div>
    }
  
    const userBookings = getBookingsByUser(user.id)
  
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
      >
        <h1 className="text-3xl font-extrabold text-gray-900 mb-6">Your Dashboard</h1>
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h2 className="text-lg leading-6 font-medium text-gray-900">Your Bookings</h2>
          </div>
          <div className="border-t border-gray-200">
            {userBookings.length === 0 ? (
              <p className="px-4 py-5 sm:px-6 text-gray-500">You haven't booked any events yet.</p>
            ) : (
              <ul className="divide-y divide-gray-200">
                {userBookings.map((booking) => {
                  const event = events.find((e) => e.id === booking.eventId)
                  return (
                    <li key={booking.id} className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">{event?.title}</h3>
                          <p className="mt-1 text-sm text-gray-500">{event?.date}</p>
                        </div>
                        <div className="ml-4">
                          <QRCode
                            value={`event:${event?.id}:user:${user.id}`}
                            size={64}
                            level="L"
                            className="rounded-md"
                          />
                        </div>
                      </div>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>
        </div>
      </motion.div>
    )
};

export default UserDashboard;
