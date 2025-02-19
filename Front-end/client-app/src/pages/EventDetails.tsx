import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Users, Clock, ArrowLeft, Share2, Heart, Globe, Ticket } from 'lucide-react';
import { format } from 'date-fns';
import { Event } from '../types';

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

export const EventDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const event = mockEvents.find(e => e.id === id);

  if (!event) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold">Event not found</h2>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto px-4 py-8"
    >
      <Link
        to="/"
        className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6 group"
      >
        <ArrowLeft className="w-4 h-4 mr-2 transform group-hover:-translate-x-1 transition-transform" />
        Back to Events
      </Link>

      <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-xl">
        <div className="relative h-96">
          <img
            src={event.imageUrl}
            alt={event.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
            <div className="flex items-center gap-2 mb-4">
              <span className="px-3 py-1 text-sm bg-blue-500 rounded-full">
                {event.category}
              </span>
            </div>
            <h1 className="text-4xl font-bold mb-2">{event.title}</h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                {format(new Date(event.date), 'PPP')}
              </div>
              <div className="flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                {format(new Date(event.date), 'p')}
              </div>
            </div>
          </div>
        </div>

        <div className="p-8">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-grow">
              <h2 className="text-2xl font-semibold mb-4 dark:text-white">About this event</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-8">{event.description}</p>

              <h3 className="text-xl font-semibold mb-4 dark:text-white">Organizer</h3>
              <div className="flex items-center gap-4 mb-8">
                <div className="bg-gray-100 dark:bg-gray-700 rounded-full w-12 h-12 flex items-center justify-center">
                  <span className="text-xl font-semibold">{event.organizer.name[0]}</span>
                </div>
                <div>
                  <p className="font-semibold dark:text-white">{event.organizer.name}</p>
                  <p className="text-gray-600 dark:text-gray-300">{event.organizer.email}</p>
                </div>
              </div>
            </div>
{/*Event side card start */}
            <div className="lg:w-96">
  <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-xl p-8 sticky top-6 shadow-lg backdrop-blur-sm">
    {/* Price and Actions */}
    <div className="flex justify-between items-center mb-8">
      <div className="space-y-1">
        <span className="text-sm text-gray-500 dark:text-gray-400">Starting from</span>
        <div className="flex items-baseline">
          <span className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            ₹{event.price}
          </span>
          <span className="ml-2 text-gray-500">/person</span>
        </div>
      </div>
      <div className="flex gap-3">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="p-2.5 rounded-full bg-white dark:bg-gray-600 shadow-md hover:shadow-lg transition-all"
        >
          <Share2 className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="p-2.5 rounded-full bg-white dark:bg-gray-600 shadow-md hover:shadow-lg transition-all"
        >
          <Heart className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        </motion.button>
      </div>
    </div>

    {/* Event Details */}
    <div className="space-y-6 mb-8">
  <div className="flex items-center gap-4">
    <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20">
      <MapPin className="w-5 h-5 text-blue-500" />
    </div>
    <div>
      <p className="text-sm text-gray-500 dark:text-gray-400">Location</p>
      <p className="font-medium dark:text-white">{event.location}</p>
    </div>
  </div>

  <div className="flex items-center gap-4">
    <div className="p-2 rounded-lg bg-green-50 dark:bg-green-900/20">
      <Globe className="w-5 h-5 text-green-500" />
    </div>
    <div>
      <p className="text-sm text-gray-500 dark:text-gray-400">Language</p>
      <p className="font-medium dark:text-white">{event.language}</p>
    </div>
  </div>

  <div className="flex items-center gap-4">
    <div className="p-2 rounded-lg bg-purple-50 dark:bg-purple-900/20">
      <Users className="w-5 h-5 text-purple-500" />
    </div>
    <div>
      <p className="text-sm text-gray-500 dark:text-gray-400">Capacity</p>
      <div className="flex items-center gap-2">
        <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-purple-500 to-blue-500"
            style={{ width: `${(event.registeredCount / event.capacity) * 100}%` }}
          />
        </div>
        <span className="text-sm font-medium dark:text-white">
          {event.registeredCount}/{event.capacity}
        </span>
      </div>
    </div>
  </div>
</div>

    {/* Book Button */}
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
    >
      <Ticket className="w-5 h-5" />
      Book Your Ticket
    </motion.button>

    {/* Additional Info */}
    <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
      ⚡ {event.capacity - event.registeredCount} spots remaining
    </p>
  </div>
</div>
{/*Event side card end */}
          </div>
        </div>
      </div>
    </motion.div>
  );
};