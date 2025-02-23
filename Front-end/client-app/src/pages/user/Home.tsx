import * as React from 'react';
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FaArrowRight, FaSearch, FaLaptopCode, FaUsers, FaTrophy, FaRocket } from 'react-icons/fa';
import Footer from '../../components/Footer';

// Featured events data
const featuredEvents = [
  {
    id: 1,
    title: "TechHack 2024",
    category: "Hackathon",
    date: "June 15-16, 2024",
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80",
    participants: 500,
  },
  {
    id: 2,
    title: "AI Summit",
    category: "Conference",
    date: "July 20-21, 2024",
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80",
    participants: 750,
  },
  {
    id: 3,
    title: "Web3 Hackathon",
    category: "Hackathon",
    date: "August 5-7, 2024",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80",
    participants: 300,
  }
];

// Platform statistics
const stats = [
  { label: "Events Hosted", value: "500+" },
  { label: "Active Users", value: "10K+" },
  { label: "Success Rate", value: "95%" },
];

const Home: React.FunctionComponent = () => {
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="min-h-screen bg-gradient-to-b from-[#0f172a] to-[#1e293b]"
      >
        {/* Hero Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <motion.div
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              {/* Add InterLink title */}
              <h1 className="text-7xl md:text-8xl font-extrabold text-[#d7ff42] mb-4">
                interLink
              </h1>
              <h2 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#d7ff42] to-[#7557e1]">
                Where Tech Events Come Alive
              </h2>
              <p className="mt-6 text-xl text-gray-300 max-w-3xl mx-auto">
                Discover groundbreaking hackathons, insightful bootcamps, and innovative tech conferences. 
                Your next breakthrough starts here.
              </p>
            </motion.div>

            {/* Search Section */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mt-8 max-w-2xl mx-auto"
            >
              <div className="flex items-center bg-white/10 backdrop-blur-lg rounded-full p-2">
                <FaSearch className="text-gray-400 ml-4" />
                <input
                  type="text"
                  placeholder="Search for events..."
                  className="w-full bg-transparent border-none text-white px-4 py-2 focus:outline-none"
                />
                <button className="px-6 py-2 bg-[#d7ff42] text-[#1e293b] rounded-full font-semibold hover:bg-opacity-90 transition-all">
                  Search
                </button>
              </div>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-10 flex flex-wrap justify-center gap-4"
            >
              <a
                href="/events"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 bg-[#7557e1] text-white rounded-full font-semibold hover:bg-opacity-90 transition-all flex items-center gap-2"
              >
                Explore Events
                <FaArrowRight />
              </a>
              <Link
                to="/organizer"
                className="px-8 py-4 border-2 border-[#d7ff42] text-[#d7ff42] rounded-full font-semibold hover:bg-[#d7ff42] hover:text-[#1e293b] transition-all flex items-center gap-2"
              >
                Become an Organizer
                <FaRocket />
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Featured Events */}
        <section className="py-16 bg-white/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-white mb-12">Featured Events</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredEvents.map((event) => (
                <motion.div
                  key={event.id}
                  whileHover={{ y: -10 }}
                  className="bg-white/10 backdrop-blur-lg rounded-2xl overflow-hidden"
                >
                  <img src={event.image} alt={event.title} className="w-full h-48 object-cover" />
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-white">{event.title}</h3>
                    <p className="text-gray-400 mt-2">{event.category}</p>
                    <div className="mt-4 flex justify-between items-center">
                      <span className="text-[#d7ff42]">{event.date}</span>
                      <span className="text-gray-400">{event.participants} participants</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Statistics Section */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <h3 className="text-4xl font-bold text-[#d7ff42]">{stat.value}</h3>
                  <p className="mt-2 text-gray-400">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </motion.div>
      <Footer />
    </>
  );
};

export default Home;
