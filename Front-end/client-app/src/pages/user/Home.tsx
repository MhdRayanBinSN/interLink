import * as React from 'react';
import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import { FaArrowRight } from 'react-icons/fa';

interface IHomeProps {
}

const Home: React.FunctionComponent<IHomeProps> = (props) => {
  return(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-custBlack"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <motion.h1
            initial={{ y: -50 }}
            animate={{ y: 0 }}
            className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl"
          >
            <span className="block">Welcome to</span>
            <span className="block text-indigo-600">interLink</span>
          </motion.h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Discover, book, and manage events with ease. Whether you're an attendee or an organizer, we've got you
            covered.
          </p>
          <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/events"
                className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10"
              >
                Explore Events
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="mt-3 sm:mt-0 sm:ml-3">
              <Link
                to="/login"
                className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10"
              >
                Sign In
              </Link>
            </motion.div>
          </div>
          <div className="flex flex-col md:flex-row gap-6 justify-center mt-8">
          
            
            <Link 
              to="/organizer" 
              className="group rounded-full px-8 py-4 text-xl font-semibold text-white border-2 border-white/30 hover:border-white/70 transition-all flex items-center gap-2"
            >
              List Your Event
              <FaArrowRight className="group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  ) ;
};

export default Home;
