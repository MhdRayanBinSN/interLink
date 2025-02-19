import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Users } from 'lucide-react';
import { format } from 'date-fns';
import { Event } from '../types';
import { Link } from 'react-router-dom';

interface EventCardProps {
  event: Event;
}

export const EventCard: React.FC<EventCardProps> = ({ event }) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg transition-shadow hover:shadow-xl"
    >
      <Link to={`/events/${event.id}`}>
        <img
          src={event.imageUrl}
          alt={event.title}
          className="w-full h-48 object-cover"
        />
        <div className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="px-3 py-1 text-sm bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 rounded-full">
              {event.category}
            </span>
            <span className="text-gray-600 dark:text-gray-300">
              ${event.price}
            </span>
          </div>
          <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
            {event.title}
          </h3>
          <div className="space-y-2">
            <div className="flex items-center text-gray-600 dark:text-gray-300">
              <Calendar className="w-4 h-4 mr-2" />
              {format(new Date(event.date), 'PPP')}
            </div>
            <div className="flex items-center text-gray-600 dark:text-gray-300">
              <MapPin className="w-4 h-4 mr-2" />
              {event.location}
            </div>
            <div className="flex items-center text-gray-600 dark:text-gray-300">
              <Users className="w-4 h-4 mr-2" />
              {event.registeredCount}/{event.capacity} spots filled
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};