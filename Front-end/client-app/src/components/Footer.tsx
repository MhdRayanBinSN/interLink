import React from 'react';
import { Link } from 'react-router-dom';
import { FaGithub, FaTwitter, FaLinkedin, FaDiscord, FaEnvelope } from 'react-icons/fa';

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#0f172a] text-gray-300 py-12 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Platform Info */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white">InterLink</h3>
            <p className="text-sm text-gray-400">
              Connecting tech enthusiasts through innovative events and meaningful collaborations.
            </p>
            <div className="flex space-x-4">
              <a href="https://github.com" className="hover:text-[#d7ff42] transition-colors">
                <FaGithub size={20} />
              </a>
              <a href="https://twitter.com" className="hover:text-[#d7ff42] transition-colors">
                <FaTwitter size={20} />
              </a>
              <a href="https://linkedin.com" className="hover:text-[#d7ff42] transition-colors">
                <FaLinkedin size={20} />
              </a>
              <a href="https://discord.com" className="hover:text-[#d7ff42] transition-colors">
                <FaDiscord size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/events" className="hover:text-[#d7ff42] transition-colors">
                  Discover Events
                </Link>
              </li>
              <li>
                <Link to="/organizer/dashboard" className="hover:text-[#d7ff42] transition-colors">
                  Organize Event
                </Link>
              </li>
              <li>
                <Link to="/user/dashboard" className="hover:text-[#d7ff42] transition-colors">
                  My Events
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-[#d7ff42] transition-colors">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Support</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/help" className="hover:text-[#d7ff42] transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="/faqs" className="hover:text-[#d7ff42] transition-colors">
                  FAQs
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-[#d7ff42] transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/report" className="hover:text-[#d7ff42] transition-colors">
                  Report an Issue
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Stay Updated</h4>
            <form className="space-y-4">
              <div className="flex items-center bg-white/10 rounded-lg p-1">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="bg-transparent border-none w-full px-3 py-2 text-sm focus:outline-none"
                />
                <button
                  type="submit"
                  className="p-2 bg-[#7557e1] rounded-lg hover:bg-opacity-90 transition-all"
                >
                  <FaEnvelope />
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-gray-400">
              © {new Date().getFullYear()} InterLink. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm">
              <Link to="/privacy" className="hover:text-[#d7ff42] transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="hover:text-[#d7ff42] transition-colors">
                Terms & Conditions
              </Link>
              <Link to="/cookies" className="hover:text-[#d7ff42] transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;