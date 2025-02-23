import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaCalendarPlus, FaChartLine, FaUsers, FaMoneyBillWave } from 'react-icons/fa';

interface IOrganizerHomeProps {}

const IOrganizerHome: React.FunctionComponent<IOrganizerHomeProps> = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 to-blue-900">
      {/* Hero Section */}
      <section className="pt-20 pb-32 text-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-8">
              Create Memorable Tech Events
            </h1>
            <p className="text-xl mb-12 text-gray-300">
              List your bootcamps, workshops, hackathons, and conferences on our platform.
              Reach thousands of tech enthusiasts and professionals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/organizer/login"
                className="px-8 py-4 bg-white text-purple-900 rounded-full font-semibold hover:bg-gray-100 transition-colors"
              >
                Sign In as Organizer
              </Link>
              <Link
                to="/organizer/register"
                className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-full font-semibold hover:bg-white/10 transition-colors"
              >
                Create Account
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Our Platform?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-6 bg-gray-50 rounded-xl hover:shadow-lg transition-all"
              >
                <feature.icon className="text-4xl text-purple-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-8">Ready to Host Your Event?</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join our growing community of event organizers and start creating impactful tech events today.
          </p>
          <Link
            to="/organizer/create-event"
            className="inline-flex items-center px-8 py-4 bg-purple-600 text-white rounded-full font-semibold hover:bg-purple-700 transition-colors"
          >
            Create Your First Event
          </Link>
        </div>
      </section>
    </div>
  );
};

const features = [
  {
    icon: FaCalendarPlus,
    title: "Easy Event Creation",
    description: "Intuitive tools to create and manage your tech events efficiently."
  },
  {
    icon: FaUsers,
    title: "Wide Reach",
    description: "Connect with thousands of potential attendees in the tech community."
  },
  {
    icon: FaMoneyBillWave,
    title: "Secure Payments",
    description: "Hassle-free payment processing for paid events and workshops."
  },
  {
    icon: FaChartLine,
    title: "Analytics & Insights",
    description: "Track registrations, attendance, and engagement metrics."
  }
];

export default IOrganizerHome;
