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
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="group relative bg-[#222839] rounded-xl overflow-hidden border border-gray-700/50 hover:border-[#7557e1]/50 shadow-lg hover:shadow-[#7557e1]/10"
    >
      <Link to={`/events/${event.id}`}>
        {/* Banner Image */}
        <div className="relative h-48">
          <img
            src={event.imageUrl}
            alt={event.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Content Section */}
        <div className="p-4 space-y-4">
          {/* Price and Categories */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 text-xs font-medium bg-[#7557e1]/10 text-[#7557e1] rounded-full border border-[#7557e1]/20">
                {event.category}
              </span>
              <span className="px-3 py-1 text-xs font-medium bg-[#d7ff42]/10 text-[#d7ff42] rounded-full border border-[#d7ff42]/20">
                {event.language}
              </span>
            </div>
            <div className="px-3 py-1 bg-[#1d2132] rounded-lg border border-[#7557e1]/20">
              <span className="text-[#d7ff42] font-semibold text-sm">
                {event.price === 0 ? 'Free' : `₹${event.price}`}
              </span>
            </div>
          </div>

          {/* Title */}
          <h3 className="text-lg font-semibold text-white group-hover:text-[#d7ff42] transition-colors line-clamp-2">
            {event.title}
          </h3>

          {/* Event Details */}
          <div className="space-y-2.5">
            <div className="flex items-center text-gray-400">
              <Calendar className="w-4 h-4 mr-2 text-[#7557e1]" />
              <span className="text-sm">{format(new Date(event.date), 'MMM dd, yyyy')}</span>
            </div>
            <div className="flex items-center text-gray-400">
              <MapPin className="w-4 h-4 mr-2 text-[#7557e1]" />
              <span className="text-sm">{event.location}</span>
            </div>
            
            {/* Spots and Progress Bar */}
            <div className="flex items-center justify-between pt-2 border-t border-gray-700/50">
              <div className="flex items-center">
                <Users className="w-4 h-4 mr-2 text-[#7557e1]" />
                <span className="text-sm text-gray-400">{remainingSpots} spots left</span>
              </div>
              <div className="w-20 h-1.5 bg-[#1d2132] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#7557e1]"
                  style={{ 
                    width: `${((event.capacity - remainingSpots) / event.capacity) * 100}%` 
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Hover Effect Border */}
        <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-[#7557e1] to-[#d7ff42] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
      </Link>
    </motion.div>
  );
};