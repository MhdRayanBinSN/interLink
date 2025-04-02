import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Users, Globe, Laptop } from 'lucide-react';
import { format } from 'date-fns';
import { Event } from '../../types';
import { Link } from 'react-router-dom';

interface EventCardProps {
  event: Event;
}

export const EventCard: React.FC<EventCardProps> = ({ event }) => {
  // Calculate remaining spots
  const remainingSpots = event.capacity - (event.registeredCount || 0);
  
  // Format date properly
  const formattedDate = format(new Date(event.date), 'MMM dd, yyyy');
  
  // Get mode tag info
  const getModeTagInfo = (mode: string) => {
    switch (mode) {
      case 'online':
        return { text: 'Online', bgClass: 'bg-blue-500', icon: <Laptop className="w-3 h-3 mr-1" />, hoverClass: 'group-hover:bg-blue-600' };
      case 'offline':
        return { text: 'In-Person', bgClass: 'bg-green-500', icon: <MapPin className="w-3 h-3 mr-1" />, hoverClass: 'group-hover:bg-green-600' };
      case 'hybrid':
        return { text: 'Hybrid', bgClass: 'bg-purple-500', icon: <Laptop className="w-3 h-3 mr-1" />, hoverClass: 'group-hover:bg-purple-600' };
      default:
        return { text: 'Event', bgClass: 'bg-gray-500', icon: null, hoverClass: 'group-hover:bg-gray-600' };
    }
  };
  
  const modeInfo = getModeTagInfo(event.mode);

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="group relative bg-gradient-to-t from-[#171c35] to-[#0d0e16] hover:from-[#1d2132] hover:to-[#141414] rounded-xl overflow-hidden border border-gray-800/40 hover:border-[#7557e1]/50 shadow-lg hover:shadow-[#7557e1]/10 before:absolute before:inset-0 before:bg-[url('https://assets.website-files.com/6419eb2139ce19741e02bea2/6419eb2139ce19b30202bfa7_noise.gif')] before:opacity-[0.03] before:pointer-events-none"
    >
      <Link to={`/events/${event.id}`} className="block relative z-10">
        {/* Event Image with hover effect */}
        <div className="relative h-44 overflow-hidden">
          <img 
            src={event.imageUrl || "https://images.unsplash.com/photo-1540575467063-178a50c2df87"} 
            alt={event.title}
            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500 ease-in-out"
          />
          
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent pt-12 pb-2 px-3">
            {/* Category Tag */}
            <div className={`inline-flex ${modeInfo.bgClass} ${modeInfo.hoverClass} text-white text-xs font-medium px-2.5 py-1 rounded-full transition-colors duration-300 items-center`}>
              {modeInfo.icon}
              {modeInfo.text}
            </div>
          </div>
        </div>
        
        {/* Event Info - All below the banner */}
        <div className="p-4">
          {/* Title with hover effect */}
          <h3 className="text-white font-semibold text-lg leading-tight mb-2 group-hover:text-[#d7ff42] transition-all duration-300 ease-in-out">
            {event.title}
          </h3>
          
          <div className="mb-4 text-sm text-gray-400 line-clamp-2">
            {event.description?.substring(0, 80) || "Join us for this amazing event"}...
          </div>  
          
          {/* Event Info Grid */}
          <div className="grid grid-cols-1 gap-2 text-sm mb-4">
            {/* Date */}
            <div className="flex items-center text-gray-400 group-hover:text-gray-300 transition-colors">
              <Calendar className="w-4 h-4 mr-2 text-[#7557e1] group-hover:text-[#8a6cff] transition-colors" />
              <span>{formattedDate}</span>
            </div>
            
            {/* Location - with placeholder to maintain consistent height */}
            {(event.mode === 'offline' || event.mode === 'hybrid') && event.location ? (
              <div className="flex items-center text-gray-400 group-hover:text-gray-300 transition-colors">
                <MapPin className="w-4 h-4 mr-2 text-[#7557e1] group-hover:text-[#8a6cff] transition-colors" />
                <span className="line-clamp-1">{event.location}</span>
              </div>
            ) : (
              // Empty div with same height to maintain spacing
              <div className="h-[24px]"></div>
            )}
            
            {/* Language */}
            <div className="flex items-center text-gray-400 group-hover:text-gray-300 transition-colors">
              <Globe className="w-4 h-4 mr-2 text-[#7557e1] group-hover:text-[#8a6cff] transition-colors" />
              <span>{event.language}</span>
            </div>
          </div>
          
          {/* Bottom section with spots and price */}
          <div className="flex justify-between items-center border-t border-gray-800/50 pt-3 mt-2">
            {/* Spots */}
            <div className="flex items-center text-gray-400 text-sm">
              <Users className="w-4 h-4 mr-1 text-[#7557e1]" />
              <span>{remainingSpots} spots left</span>
            </div>
            
            {/* Price */}
            {event.price > 0 ? (
              <div className="bg-[#1d2132] rounded px-3 py-1 text-[#d7ff42] font-bold text-sm">
                ₹{event.price}
              </div>
            ) : (
              <div className="bg-[#1d2132] rounded px-3 py-1 text-[#d7ff42] font-bold text-sm">
                FREE
              </div>
            )}
          </div>
        </div>
        
        {/* Highlight bar on hover */}
        <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-[#7557e1] via-[#9f6bff] to-[#d7ff42] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
      </Link>
    </motion.div>
  );
};