import * as React from 'react';
import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Event } from '../../types';
import { Search, Filter, Calendar, DollarSign, MapPin, Globe, Laptop, ChevronDown, Loader } from 'lucide-react';
import { EventCard } from './EventCard';
import { serverUrl } from '../../helpers/Constant';

interface IEventDiscoveryProps {
}

const EventDiscovery: React.FunctionComponent<IEventDiscoveryProps> = (props) => {
  // Add state for real events
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Add event mode filter
  const [selectedMode, setSelectedMode] = useState<string>('all');
  
  // Fetch events when component loads
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${serverUrl}/events/getAllEvents`);
        
        if (response.data.success) {
          // Transform backend data to match frontend Event type
          const transformedEvents: Event[] = response.data.data.map((event: any) => ({
            id: event._id,
            title: event.title,
            description: event.description || '',
            date: new Date(event.startDateTime),
            location: event.venue || 'Online',
            category: event.eventType,
            language: event.languages?.length > 0 ? event.languages[0] : 'English',
            imageUrl: event.bannerImageUrl || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87',
            organizer: {
              name: event.organizerName,
              email: event.organizerEmail,
            },
            mode: event.mode, // Add mode property
            price: event.entryType === 'paid' ? (event.ticketPrice || 0) : 0,
            capacity: event.maxParticipants,
            registeredCount: 0, // Assuming no registrations yet
            speakers: event.speakers,
            schedule: event.schedules,
            requirements: event.eligibilityCriteria
          }));
          
          setEvents(transformedEvents);
        } else {
          setError('Failed to fetch events');
        }
      } catch (error) {
        console.error("Error fetching events:", error);
        setError('Error loading events');
      } finally {
        setLoading(false);
      }
    };
    
    fetchEvents();
  }, []);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all');

  const keralaCities = [
    'Thiruvananthapuram', 'Kochi', 'Kozhikode', 'Thrissur', 
    'Kannur', 'Kollam', 'Kottayam', 'Ernakulam'
  ];

  const languages = ['Malayalam', 'English', 'Hindi'];
  
  // Event modes for filter
  const eventModes = ['online', 'offline', 'hybrid'];

  // Updated filter to include event mode
  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || event.category === selectedCategory;
    
    // Location filter only applies for offline and hybrid events
    const matchesLocation = selectedLocation === 'all' || 
      (event.mode === 'online' ? true : event.location === selectedLocation);
    
    const matchesLanguage = selectedLanguage === 'all' || event.language === selectedLanguage;
    const matchesMode = selectedMode === 'all' || event.mode === selectedMode;
    
    const eventDate = new Date(event.date);
    const matchesDate = !dateRange.start || !dateRange.end || 
      (eventDate >= new Date(dateRange.start) && eventDate <= new Date(dateRange.end));
    
    const matchesPrice = event.price >= priceRange.min && event.price <= priceRange.max;

    return matchesSearch && matchesCategory && matchesLocation && 
           matchesLanguage && matchesDate && matchesPrice && matchesMode;
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-b from-[#1d2132] to-[#222839] py-4"
    >
      <div className="max-w-8xl mx-auto px-3">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Left Sidebar Filters */} 
          <div className="w-full md:w-56 flex-shrink-0">
            <div className="bg-[#222839]/80 backdrop-blur-sm p-4 rounded-lg border border-gray-700/50 sticky top-4">
              <h3 className="text-[#d7ff42] font-semibold mb-4 flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Filters
              </h3>
              
              {/* Event Mode Filter - New! */}
              <div className="space-y-2 mb-4">
                <label className="flex items-center gap-2 text-sm text-gray-300">
                  <Laptop className="w-4 h-4 text-[#7557e1]" />
                  Event Mode
                </label>
                <select
                  className="w-full p-2.5 bg-[#1d2132] border border-gray-700/50 rounded-lg text-white text-sm focus:border-[#7557e1] focus:ring-1 focus:ring-[#7557e1] transition-colors appearance-none"
                  value={selectedMode}
                  onChange={(e) => setSelectedMode(e.target.value)}
                >
                  <option value="all">All Modes</option>
                  <option value="online">Online</option>
                  <option value="offline">In-Person</option>
                  <option value="hybrid">Hybrid</option>
                </select>
              </div>
              
              {/* Date Range Filter */}
              <div className="space-y-2 mb-4">
                <label className="flex items-center gap-2 text-sm text-gray-300">
                  <Calendar className="w-4 h-4 text-[#7557e1]" />
                  Date Range
                </label>
                <input
                  type="date"
                  className="w-full p-2.5 bg-[#1d2132] border border-gray-700/50 rounded-lg text-white text-sm focus:border-[#7557e1] focus:ring-1 focus:ring-[#7557e1] transition-colors"
                  value={dateRange.start}
                  onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                />
                <input
                  type="date"
                  className="w-full p-2.5 bg-[#1d2132] border border-gray-700/50 rounded-lg text-white text-sm focus:border-[#7557e1] focus:ring-1 focus:ring-[#7557e1] transition-colors"
                  value={dateRange.end}
                  onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                />
              </div>

              {/* Price Range Filter */}
              <div className="space-y-2 mb-4">
                <label className="flex items-center gap-2 text-sm text-gray-300">
                  <DollarSign className="w-4 h-4 text-[#7557e1]" />
                  Price Range
                </label>
                <div className="space-y-2">
                  <input
                    type="range"
                    min="0"
                    max="1000"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange(prev => ({ ...prev, max: Number(e.target.value) }))}
                    className="w-full accent-[#d7ff42]"
                  />
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">₹0</span>
                    <span className="text-[#d7ff42]">₹{priceRange.max}</span>
                  </div>
                </div>
              </div>

              {/* Location Filter - Only show when mode is not 'online' */}
              {selectedMode !== 'online' && (
                <div className="space-y-2 mb-4">
                  <label className="flex items-center gap-2 text-sm text-gray-300">
                    <MapPin className="w-4 h-4 text-[#7557e1]" />
                    Location
                  </label>
                  <select
                    className="w-full p-2.5 bg-[#1d2132] border border-gray-700/50 rounded-lg text-white text-sm focus:border-[#7557e1] focus:ring-1 focus:ring-[#7557e1] transition-colors appearance-none"
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                  >
                    <option value="all">All Locations</option>
                    {keralaCities.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Language Filter */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm text-gray-300">
                  <Globe className="w-4 h-4 text-[#7557e1]" />
                  Language
                </label>
                <select
                  className="w-full p-2.5 bg-[#1d2132] border border-gray-700/50 rounded-lg text-white text-sm focus:border-[#7557e1] focus:ring-1 focus:ring-[#7557e1] transition-colors appearance-none"
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                >
                  <option value="all">All Languages</option>
                  {languages.map(lang => (
                    <option key={lang} value={lang}>{lang}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Search Bar */}
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white" />
                <input
                  type="text"
                  placeholder="Search events..."
                  className="w-full pl-9 pr-3 py-2.5 bg-[#222839]/80 backdrop-blur-sm border border-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:border-[#7557e1] focus:ring-1 focus:ring-[#7557e1] transition-colors
                  rounded-xl"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Events Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {loading ? (
                // Loading state
                <div className="col-span-full flex justify-center items-center py-20">
                  <div className="flex flex-col items-center gap-2">
                    <Loader className="w-8 h-8 text-[#7557e1] animate-spin" />
                    <p className="text-gray-400">Loading events...</p>
                  </div>
                </div>
              ) : error ? (
                // Error state
                <div className="col-span-full text-center py-20">
                  <p className="text-red-400 mb-2">{error}</p>
                  <button
                    onClick={() => window.location.reload()}
                    className="px-4 py-2 bg-[#7557e1] rounded-lg text-white hover:bg-opacity-80"
                  >
                    Try Again
                  </button>
                </div>
              ) : filteredEvents.length === 0 ? (
                // No events found state
                <div className="col-span-full text-center py-20">
                  <p className="text-gray-300 text-lg mb-2">No events found</p>
                  <p className="text-gray-400">Try adjusting your filters</p>
                </div>
              ) : (
                // Display events
                filteredEvents.map(event => (
                  <EventCard key={event.id} event={event} />
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default EventDiscovery;
