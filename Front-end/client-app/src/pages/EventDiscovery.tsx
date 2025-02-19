import * as React from 'react';
import { useState } from "react"
import { motion } from "framer-motion"
import { useStore } from "../store"
import { Link } from "react-router-dom"
import { Event } from '../types';
import { Search, Filter } from 'lucide-react';
import { EventCard } from '../components/EventCard';


interface IEventDiscoveryProps {
}


const mockEvents: Event[] = [
  {
    id: '1',
    title: 'React Summit 2024',
    description: 'The biggest React conference in Europe',
    date: new Date('2024-06-15'),
    location: 'Amsterdam, Netherlands',
    category: 'conference',
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
    location: 'San Francisco, USA',
    category: 'hackathon',
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

  const filteredEvents = mockEvents.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || event.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });
  
    return (
      <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search events..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white rounded-xl"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="text-gray-400" />
          <select
            className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="all">All Categories</option>
            <option value="conference">Conferences</option>
            <option value="hackathon">Hackathons</option>
            <option value="bootcamp">Bootcamps</option>
          </select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.map(event => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
};

export default EventDiscovery;
