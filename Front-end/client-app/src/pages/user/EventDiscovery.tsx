import * as React from 'react';
import { useState } from "react"
import { motion } from "framer-motion"
import { useStore } from "../../store"
import { Link } from "react-router-dom"
import { Event } from '../../types';
import { Search, Filter, Calendar, DollarSign, MapPin, Globe, ChevronDown } from 'lucide-react';
import { EventCard } from './EventCard';


interface IEventDiscoveryProps {
}


const mockEvents: Event[] = [
  {
    id: '1',
    title: 'React Summit 2024',
    description: 'The biggest React conference in Europe',
    date: new Date('2024-06-15'),
    location: 'Kottayam',
    category: 'conference',
    language: 'Malayalam',
    imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87',
    organizer: {
      name: 'Tech Events Inc',
      email: 'info@techevents.com',
    },
    price: 599,
    capacity: 1000,
    registeredCount: 750,
    speakers: undefined,
    schedule: undefined,
    requirements: undefined,
    faqs: undefined,
    features: undefined
  },
  {
    id: '2',
    title: 'Web3 Hackathon',
    description: 'Build the future of decentralized applications',
    date: new Date('2024-07-20'),
    location: 'Ernakulam',
    category: 'hackathon',
    language: 'English',
    imageUrl: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c',
    organizer: {
      name: 'BlockChain Society',
      email: 'hello@bcsociety.org',
    },
    price: 0,
    capacity: 200,
    registeredCount: 156,
    speakers: undefined,
    schedule: undefined,
    requirements: undefined,
    faqs: undefined,
    features: undefined
  },
];
const EventDiscovery: React.FunctionComponent<IEventDiscoveryProps> = (props) => {
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

  const filteredEvents = mockEvents.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || event.category === selectedCategory;
    const matchesLocation = selectedLocation === 'all' || event.location === selectedLocation;
    const matchesLanguage = selectedLanguage === 'all' || event.language === selectedLanguage;
    
    const eventDate = new Date(event.date);
    const matchesDate = !dateRange.start || !dateRange.end || 
      (eventDate >= new Date(dateRange.start) && eventDate <= new Date(dateRange.end));
    
    const matchesPrice = event.price >= priceRange.min && event.price <= priceRange.max;

    return matchesSearch && matchesCategory && matchesLocation && 
           matchesLanguage && matchesDate && matchesPrice;
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

              {/* Location Filter */}
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
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#7557e1]" />
                <input
                  type="text"
                  placeholder="Search events..."
                  className="w-full pl-9 pr-3 py-2.5 bg-[#222839]/80 backdrop-blur-sm border border-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:border-[#7557e1] focus:ring-1 focus:ring-[#7557e1] transition-colors"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Events Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredEvents.map(event => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default EventDiscovery;
