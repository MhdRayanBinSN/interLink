import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Users, Clock, ArrowLeft, Share2, Heart, Globe, Ticket } from 'lucide-react';
import { format } from 'date-fns';
import { Event } from '../../types';

const mockEvents: Event[] = [
    {
      id: '1',
      title: 'React Summit 2024',
      description: 'The biggest React conference in Asia',
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
      startTime: '10:00',
      endTime: '17:00',
      venue: {
        name: 'Tech Hub Conference Center',
        address: 'Cyber City, Kottayam',
        googleMapsUrl: 'https://goo.gl/maps/...'
      },
      ticketTypes: [
        {
          name: 'Early Bird',
          price: 499,
          quantity: 100,
          description: 'Limited early bird tickets with special pricing'
        },
        {
          name: 'Regular',
          price: 599,
          quantity: 800,
          description: 'Standard admission ticket'
        }
      ],
      schedule: [
        {
          time: '10:00 - 10:30',
          title: 'Registration & Welcome Kit',
          description: 'Pick up your conference materials and welcome kit'
        },
        {
          time: '10:30 - 11:30',
          title: 'Keynote Session',
          description: 'Opening keynote by industry experts'
        }
      ],
      speakers: [
        {
          name: 'Dr. Ojus Thomus Lee',
          designation: 'Senior Developer',
          company: 'Meta',
          bio: '10+ years experience in React development',
          image: 'https://example.com/speaker1.jpg'
        }
      ],
      features: [
        'Hands-on workshops',
        'Networking opportunities',
        'Certificate of participation',
        'Conference swag'
      ],
      requirements: [
        'Laptop with Node.js installed',
        'Basic JavaScript knowledge',
        'GitHub account'
      ],
      faqs: [
        {
          question: 'Will recordings be available?',
          answer: 'Yes, all sessions will be recorded and shared with attendees'
        }
      ]
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
      schedule: undefined,
      speakers: undefined,
      features: undefined,
      faqs: undefined,
      requirements: undefined
    },
  ];

export const EventDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
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
              src={event.imageUrl}
              alt={event.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1d2132]/90 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
              <div className="flex items-center gap-2 mb-4">
                <span className="px-3 py-1 text-sm bg-[#7557e1] rounded-full">
                  {event.category}
                </span>
              </div>
              <h1 className="text-4xl font-bold mb-2">{event.title}</h1>
              <div className="flex items-center gap-4 text-gray-300">
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-[#d7ff42]" />
                  {format(new Date(event.date), 'PPP')}
                </div>
                <div className="flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-[#d7ff42]" />
                  {format(new Date(event.date), 'p')}
                </div>
              </div>
            </div>
          </div>

          <div className="p-8">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Main Content */}
              <div className="flex-grow">
                <h2 className="text-2xl font-semibold mb-4 text-white">About this event</h2>
                <p className="text-gray-300 mb-8">{event.description}</p>

                <h3 className="text-xl font-semibold mb-4 text-white">Organizer</h3>
                <div className="flex items-center gap-4 mb-8">
                  <div className="bg-[#7557e1] rounded-full w-12 h-12 flex items-center justify-center">
                    <span className="text-xl font-semibold text-white">{event.organizer.name[0]}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-white">{event.organizer.name}</p>
                    <p className="text-gray-300">{event.organizer.email}</p>
                  </div>
                </div>

                {/* Schedule Section */}
                <div className="mb-12">
                  <h3 className="text-xl font-semibold mb-6 text-white">Event Schedule</h3>
                  <div className="space-y-4">
                    {event.schedule.map((item: { time: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; title: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; description: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; }, index: React.Key | null | undefined) => (
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

                {/* Speakers Section */}
                <div className="mb-12">
                  <h3 className="text-xl font-semibold mb-6 text-white">Featured Speakers</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {event.speakers.map((speaker: { image: string | undefined; name: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined; designation: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; company: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; bio: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; }, index: React.Key | null | undefined) => (
                      <div key={index} className="flex gap-4 p-4 bg-[#1d2132]/50 rounded-lg border border-gray-700/50">
                        <img 
                          src={speaker.image} 
                          alt={speaker.name} 
                          className="w-16 h-16 rounded-full object-cover"
                        />
                        <div>
                          <h4 className="font-medium text-white">{speaker.name}</h4>
                          <p className="text-sm text-[#d7ff42]">{speaker.designation}</p>
                          <p className="text-sm text-gray-400">{speaker.company}</p>
                          <p className="text-sm text-gray-400 mt-2">{speaker.bio}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Features & Requirements */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                  <div>
                    <h3 className="text-xl font-semibold mb-4 text-white">What You'll Get</h3>
                    <ul className="space-y-3">
                      {event.features.map((feature: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined, index: React.Key | null | undefined) => (
                        <li key={index} className="flex items-center gap-3 text-gray-300">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#d7ff42]" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold mb-4 text-white">Requirements</h3>
                    <ul className="space-y-3">
                      {event.requirements.map((req: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined, index: React.Key | null | undefined) => (
                        <li key={index} className="flex items-center gap-3 text-gray-300">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#7557e1]" />
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* FAQs Section */}
                <div className="mb-12">
                  <h3 className="text-xl font-semibold mb-6 text-white">Frequently Asked Questions</h3>
                  <div className="space-y-4">
                    {event.faqs.map((faq: { question: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; answer: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; }, index: React.Key | null | undefined) => (
                      <div key={index} className="p-4 bg-[#1d2132]/50 rounded-lg border border-gray-700/50">
                        <h4 className="font-medium text-white mb-2">{faq.question}</h4>
                        <p className="text-sm text-gray-400">{faq.answer}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Event Side Card */}
              <div className="lg:w-96">
                <div className="bg-[#1d2132]/50 backdrop-blur-sm rounded-xl p-8 sticky top-6 border border-gray-700/50">
                  {/* Price and Actions */}
                  <div className="flex justify-between items-center mb-8">
                    <div className="space-y-1">
                      <span className="text-sm text-gray-400">Starting from</span>
                      <div className="flex items-baseline">
                        <span className="text-4xl font-bold text-[#d7ff42]">
                          ₹{event.price}
                        </span>
                        <span className="ml-2 text-gray-400">/person</span>
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
                    <div className="flex items-center gap-4">
                      <MapPin className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-400">Location</p>
                        <p className="font-medium text-white">{event.location}</p>
                      </div>
                    </div>

                    {/* Language */}
                    <div className="flex items-center gap-4">
                      <Globe className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-400">Language</p>
                        <p className="font-medium text-white">{event.language}</p>
                      </div>
                    </div>

                    {/* Capacity */}
                    <div className="flex items-center gap-4">
                      <Users className="w-5 h-5 text-gray-400" />
                      <div className="flex-1">
                        <p className="text-sm text-gray-400">Capacity</p>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2 bg-[#1d2132] rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-[#7557e1] to-[#d7ff42]"
                              style={{ width: `${(event.registeredCount / event.capacity) * 100}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium text-white">
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
                    onClick={() => navigate(`/event/${id}/booking`)}
                    className="w-full bg-[#d7ff42] text-[#1d2132] py-4 px-6 rounded-xl font-semibold hover:opacity-90 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                  >
                    <Ticket className="w-5 h-5" />
                    Book Your Ticket
                  </motion.button>

                  {/* Remaining Spots */}
                  <p className="text-center text-sm text-[#d7ff42] mt-4">
                    ⚡ {event.capacity - event.registeredCount} spots remaining
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