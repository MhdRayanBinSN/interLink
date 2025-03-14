import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Users, Clock, ArrowLeft, Share2, Heart, Globe, Ticket, Loader, Laptop } from 'lucide-react';
import { format } from 'date-fns';
import axios from 'axios';
import { serverUrl } from '../../helpers/Constant';


// Define a type for the backend event data structure
interface BackendEvent {
  _id: string;
  title: string;
  eventType: string;
  category: string;
  bannerImageUrl?: string;
  startDateTime: string;
  endDateTime: string;
  organizerName: string;
  organizerEmail: string;
  maxParticipants: number;
  venue?: string;
  mode: 'online' | 'offline' | 'hybrid';
  languages: string[];
  schedules: {
    time: string;
    title: string;
    description: string;
  }[];
  targetAudience: string[];
  eligibilityCriteria?: string;
  entryType: 'free' | 'paid';
  ticketPrice?: number;
  speakers: {
    name: string;
    bio?: string;
    topic?: string;
    designation?: string;
    organization?: string;
    imageUrl?: string;
  }[];
  aboutEvent?: string;
  resourceUrls?: string[];
  status: string;
  createdAt: string;
  updatedAt: string;
}

export const EventDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [event, setEvent] = useState<BackendEvent | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEventDetails = async () => {
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
  }, [id]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-[#1d2132] flex justify-center items-center">
        <div className="flex flex-col items-center">
          <Loader className="w-12 h-12 text-[#7557e1] animate-spin" />
          <p className="mt-4 text-xl text-gray-300">Loading event details...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !event) {
    return (
      <div className="min-h-screen bg-[#1d2132] py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="bg-[#222839] rounded-xl overflow-hidden border border-gray-700/50 shadow-xl p-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              {error || "Event not found"}
            </h2>
            <p className="text-gray-400 mb-8">We couldn't find the event you're looking for</p>
            <Link
              to="/events"
              className="inline-flex items-center bg-[#7557e1] hover:bg-[#6346d1] text-white px-6 py-3 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Events
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Process date information
  const eventDate = new Date(event.startDateTime);
  const formattedDate = format(eventDate, 'PPP');
  const formattedTime = format(eventDate, 'p');
  
  // Calculate remaining spots (for online/hybrid events)
  const remainingSpots = event.maxParticipants - 0; // Replace 0 with actual registered count when available

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-[#1d2132] py-8"
    >
      <div className="max-w-7xl mx-auto px-4">
        <Link
          to="/events"
          className="inline-flex items-center text-[#7557e1] hover:text-[#d7ff42] mb-6 group"
        >
          <ArrowLeft className="w-4 h-4 mr-2 transform group-hover:-translate-x-1 transition-transform" />
          Back to Events
        </Link>

        <div className="bg-[#222839] rounded-xl overflow-hidden border border-gray-700/50 shadow-xl">
          {/* Banner Section */}
          <div className="relative h-96">
            <img
              src={event.bannerImageUrl || "https://images.unsplash.com/photo-1540575467063-178a50c2df87"}
              alt={event.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1d2132]/90 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
              <div className="flex items-center gap-2 mb-4">
                <span className="px-3 py-1 text-sm bg-[#7557e1] rounded-full">
                  {event.eventType}
                </span>
                <span className="px-3 py-1 text-sm bg-[#333]/80 backdrop-blur-sm rounded-full">
                  {event.category}
                </span>
              </div>
              <h1 className="text-4xl font-bold mb-2">{event.title}</h1>
              <div className="flex items-center gap-4 text-gray-300">
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-[#d7ff42]" />
                  {formattedDate}
                </div>
                <div className="flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-[#d7ff42]" />
                  {formattedTime}
                </div>
              </div>
            </div>
          </div>

          <div className="p-8">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Main Content */}
              <div className="flex-grow">
                <h2 className="text-2xl font-semibold mb-4 text-white">About this event</h2>
                
                {event.aboutEvent ? (
                  <div className="text-gray-300 mb-8" dangerouslySetInnerHTML={{ __html: event.aboutEvent }} />
                ) : (
                  <p className="text-gray-300 mb-8">No description available</p>
                )}

                <h3 className="text-xl font-semibold mb-4 text-white">Organizer</h3>
                <div className="flex items-center gap-4 mb-8">
                  <div className="bg-[#7557e1] rounded-full w-12 h-12 flex items-center justify-center">
                    <span className="text-xl font-semibold text-white">{event.organizerName[0]}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-white">{event.organizerName}</p>
                    <p className="text-gray-300">{event.organizerEmail}</p>
                  </div>
                </div>

                {/* Schedule Section */}
                {event.schedules && event.schedules.length > 0 && (
                  <div className="mb-12">
                    <h3 className="text-xl font-semibold mb-6 text-white">Event Schedule</h3>
                    <div className="space-y-4">
                      {event.schedules.map((item, index) => (
                        <div key={index} className="flex gap-6 p-4 bg-[#1d2132]/50 rounded-lg border border-gray-700/50">
                          <div className="text-[#d7ff42] font-medium whitespace-nowrap">{item.time}</div>
                          <div>
                            <h4 className="font-medium text-white mb-1">{item.title}</h4>
                            <p className="text-sm text-gray-400">{item.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Speakers Section */}
                {event.speakers && event.speakers.length > 0 && (
                  <div className="mb-12">
                    <h3 className="text-xl font-semibold mb-6 text-white">Featured Speakers</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {event.speakers.map((speaker, index) => (
                        <div key={index} className="flex gap-4 p-4 bg-[#1d2132]/50 rounded-lg border border-gray-700/50">
                          {speaker.imageUrl ? (
                            <img 
                              src={speaker.imageUrl} 
                              alt={speaker.name} 
                              className="w-16 h-16 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-16 h-16 bg-[#7557e1]/50 rounded-full flex items-center justify-center">
                              <span className="text-xl font-bold text-white">{speaker.name[0]}</span>
                            </div>
                          )}
                          <div>
                            <h4 className="font-medium text-white">{speaker.name}</h4>
                            {speaker.designation && <p className="text-sm text-[#d7ff42]">{speaker.designation}</p>}
                            {speaker.organization && <p className="text-sm text-gray-400">{speaker.organization}</p>}
                            {speaker.bio && <p className="text-sm text-gray-400 mt-2">{speaker.bio}</p>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Eligibility Criteria */}
                {event.eligibilityCriteria && (
                  <div className="mb-12">
                    <h3 className="text-xl font-semibold mb-4 text-white">Requirements</h3>
                    <div className="p-4 bg-[#1d2132]/50 rounded-lg border border-gray-700/50">
                      <p className="text-gray-300">{event.eligibilityCriteria}</p>
                    </div>
                  </div>
                )}

                {/* Target Audience */}
                {event.targetAudience && event.targetAudience.length > 0 && (
                  <div className="mb-12">
                    <h3 className="text-xl font-semibold mb-4 text-white">Who Should Attend</h3>
                    <ul className="space-y-3">
                      {event.targetAudience.map((audience, index) => (
                        <li key={index} className="flex items-center gap-3 text-gray-300">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#d7ff42]" />
                          {audience}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Resources */}
                {event.resourceUrls && event.resourceUrls.length > 0 && (
                  <div className="mb-12">
                    <h3 className="text-xl font-semibold mb-4 text-white">Additional Resources</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {event.resourceUrls.map((url, index) => (
                        <a 
                          key={index}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer" 
                          className="block p-3 bg-[#1d2132]/50 rounded-lg border border-gray-700/50 hover:border-[#7557e1]/50 transition-colors"
                        >
                          <div className="text-[#7557e1] truncate">Resource {index + 1}</div>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Event Side Card */}
              <div className="lg:w-96">
                <div className="bg-[#1d2132]/50 backdrop-blur-sm rounded-xl p-8 sticky top-6 border border-gray-700/50">
                  {/* Price and Actions */}
                  <div className="flex justify-between items-center mb-8">
                    <div className="space-y-1">
                      <span className="text-sm text-gray-400">{event.entryType === 'free' ? 'Entry' : 'Starting from'}</span>
                      <div className="flex items-baseline">
                        <span className="text-4xl font-bold text-[#d7ff42]">
                          {event.entryType === 'free' ? 'FREE' : `₹${event.ticketPrice || 0}`}
                        </span>
                        {event.entryType !== 'free' && (
                          <span className="ml-2 text-gray-400">/person</span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2.5 rounded-full bg-[#222839] border border-gray-700/50 hover:border-[#7557e1] transition-all"
                      >
                        <Share2 className="w-5 h-5 text-[#7557e1]" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2.5 rounded-full bg-[#222839] border border-gray-700/50 hover:border-[#7557e1] transition-all"
                      >
                        <Heart className="w-5 h-5 text-[#7557e1]" />
                      </motion.button>
                    </div>
                  </div>

                  {/* Event Details */}
                  <div className="space-y-6 mb-8">
                    {/* Location */}
                    {(event.mode === 'offline' || event.mode === 'hybrid') && event.venue && (
                      <div className="flex items-center gap-4">
                        <MapPin className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-400">Location</p>
                          <p className="font-medium text-white">{event.venue}</p>
                        </div>
                      </div>
                    )}

                    {/* Mode */}
                    <div className="flex items-center gap-4">
                      {event.mode === 'online' ? (
                        <Laptop className="w-5 h-5 text-gray-400" />
                      ) : (
                        <MapPin className="w-5 h-5 text-gray-400" />
                      )}
                      <div>
                        <p className="text-sm text-gray-400">Event Type</p>
                        <p className="font-medium text-white capitalize">{event.mode}</p>
                      </div>
                    </div>

                    {/* Language */}
                    <div className="flex items-center gap-4">
                      <Globe className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-400">Language</p>
                        <p className="font-medium text-white">
                          {event.languages && event.languages.length > 0 
                            ? event.languages.join(', ') 
                            : 'Not specified'}
                        </p>
                      </div>
                    </div>

                    {/* Capacity */}
                    <div className="flex items-center gap-4">
                      <Users className="w-5 h-5 text-gray-400" />
                      <div className="flex-1">
                        <p className="text-sm text-gray-400">Capacity</p>
                        <p className="font-medium text-white">{event.maxParticipants} participants</p>
                      </div>
                    </div>
                  </div>

                  {/* Book Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate(`/events/${id}/booking`)}
                    className="w-full bg-[#d7ff42] text-[#1d2132] py-4 px-6 rounded-xl font-semibold hover:opacity-90 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                  >
                    <Ticket className="w-5 h-5" />
                    Book Your Ticket
                  </motion.button>

                  {/* Remaining Spots */}
                  <p className="text-center text-sm text-[#d7ff42] mt-4">
                    ⚡ {remainingSpots} spots remaining
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};