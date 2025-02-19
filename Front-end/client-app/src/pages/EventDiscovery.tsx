import * as React from 'react';
import { useState } from "react"
import { motion } from "framer-motion"
import { useStore } from "../store"
import { Link } from "react-router-dom"
import { Event } from '../types';
import { Search, Filter, Calendar, DollarSign, MapPin, Globe } from 'lucide-react';
import { EventCard } from '../components/EventCard';


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
    language:'Malayalam',
    imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87',
    organizer: {
      name: 'Tech Events Inc',
      email: 'info@techevents.com',
    },
    price: 599,
    capacity: 1000,
    registeredCount: 750,
  },
  {
    id: '2',
    title: 'Web3 Hackathon',
    description: 'Build the future of decentralized applications',
    date: new Date('2024-07-20'),
    location: 'Ernakulam',
    category: 'hackathon',
    language:'English',
    imageUrl: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c',
    organizer: {
      name: 'BlockChain Society',
      email: 'hello@bcsociety.org',
    },
    price: 0,
    capacity: 200,
    registeredCount: 156,
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
    <div className="container mx-auto px-4 py-8">
      <div className="flex gap-6">
        {/* Left Sidebar Filters */}
        <div className="w-64 flex-shrink-0 space-y-6">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <h3 className="font-semibold mb-4">Filters</h3>
            
            {/* Date Range Filter */}
            <div className="space-y-2 mb-4">
              <label className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4" />
                Date Range
              </label>
              <input
                type="date"
                className="w-full p-2 border rounded"
                value={dateRange.start}
                onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
              />
              <input
                type="date"
                className="w-full p-2 border rounded"
                value={dateRange.end}
                onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
              />
            </div>

            {/* Price Range Filter */}
            <div className="space-y-2 mb-4">
              <label className="flex items-center gap-2 text-sm">
                <DollarSign className="w-4 h-4" />
                Price Range
              </label>
              <div className="flex gap-2 items-center">
                <input
                  type="range"
                  min="0"
                  max="1000"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange(prev => ({ ...prev, max: Number(e.target.value) }))}
                  className="w-full"
                />
                <span className="text-sm">₹{priceRange.max}</span>
              </div>
            </div>

            {/* Location Filter */}
            <div className="space-y-2 mb-4">
              <label className="flex items-center gap-2 text-sm">
                <MapPin className="w-4 h-4" />
                Location
              </label>
              <select
                className="w-full p-2 border rounded"
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
            <div className="space-y-2 mb-4">
              <label className="flex items-center gap-2 text-sm">
                <Globe className="w-4 h-4" />
                Language
              </label>
              <select
                className="w-full p-2 border rounded"
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
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search events..."
                className="w-full pl-10 pr-4 py-2 border-none rounded-xl"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Events Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDiscovery;
