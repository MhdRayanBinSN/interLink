import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Users, Globe } from 'lucide-react';
import { format } from 'date-fns';
import { Event } from '../../types';
import { Link } from 'react-router-dom';

interface EventCardProps {
  event: Event;
}

export const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const remainingSpots = event.capacity - event.registeredCount;

  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="group relative bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300"
    >
      <Link to={`/events/${event.id}`}>
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
          <img
            src={event.imageUrl}
            alt={event.title}
            className="w-full h-64 object-cover transform group-hover:scale-105 transition-transform duration-500"
          />
        </div>

        {/* Info strip below image */}
        <div className="flex items-center justify-between px-6 py-3 bg-gray-50/90 dark:bg-gray-800/90 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 text-sm font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full">
              {event.category}
            </span>
            <span className="px-3 py-1 text-sm font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full">
              {event.language}
            </span>
          </div>
          <span className="px-4 py-1.5 text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full">
            ₹{event.price}
          </span>
        </div>

        <div className="p-6 space-y-4">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {event.title}
          </h3>

          <div className="flex flex-col gap-3">
            <div className="flex items-center text-gray-600 dark:text-gray-300">
              <Calendar className="w-4 h-4 mr-2 text-blue-500" />
              <span className="text-sm">{format(new Date(event.date), 'MMM dd, yyyy')}</span>
            </div>
            <div className="flex items-center text-gray-600 dark:text-gray-300">
              <MapPin className="w-4 h-4 mr-2 text-green-500" />
              <span className="text-sm">{event.location}</span>
            </div>
            <div className="flex items-center text-gray-600 dark:text-gray-300">
              <Users className="w-4 h-4 mr-2 text-purple-500" />
              <span className="text-sm font-medium">
                {remainingSpots} spots remaining
              </span>
            </div>
          </div>
        </div>

        {/* Bottom gradient border */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
      </Link>
    </motion.div>
  );
};