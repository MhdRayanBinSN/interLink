import * as React from 'react';
import { Link } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { useStore } from "../../store"
import { Sun, Moon, Calendar, Home, User, Ticket, ChevronDown } from 'lucide-react';

const Navbar: React.FunctionComponent = () => {
    const { user, logout } = useStore()
    const [darkMode, setDarkMode] = React.useState(false);
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);
    
    React.useEffect(() => {
      if (darkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }, [darkMode]);

    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            if (isMenuOpen && !target.closest('.user-menu')) {
                setIsMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isMenuOpen]);

    const UserMenu = () => (
        <div className="relative user-menu">
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white hover:text-[#d7ff42] relative z-10"
            >
                <div className="w-8 h-8 rounded-full bg-slate-600 flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                </div>
                <span>{user?.name}</span>
                <motion.div
                    animate={{ rotate: isMenuOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                >
                    <ChevronDown className="w-4 h-4" />
                </motion.div>
            </motion.button>

            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-2 w-56 py-3 bg-gradient-to-b from-[#222839] to-[#1d2132] rounded-xl shadow-xl border border-gray-700/50 backdrop-blur-sm z-50"
                        style={{ 
                            transformOrigin: 'top right',
                        }}
                    >
                        {/* User Info Section */}
                        <div className="px-4 py-2 mb-2">
                            <p className="text-white font-medium">{user?.name}</p>
                            <p className="text-gray-400 text-sm truncate">{user?.email}</p>
                        </div>

                        <div className="h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent my-2"/>

                        {/* Menu Items */}
                        <div className="px-2">
                            <NavLink to="/dashboard/profile">
                                <motion.div
                                    whileHover={{ x: 4 }}
                                    className="flex items-center px-3 py-2 text-sm text-white rounded-lg hover:bg-white/5 hover:text-[#d7ff42] transition-colors group"
                                >
                                    <User className="w-4 h-4 mr-3 group-hover:text-[#d7ff42]" />
                                    Profile
                                </motion.div>
                            </NavLink>
                            <NavLink to="/tickets">
                                <motion.div
                                    whileHover={{ x: 4 }}
                                    className="flex items-center px-3 py-2 text-sm text-white rounded-lg hover:bg-white/5 hover:text-[#d7ff42] transition-colors group"
                                >
                                    <Ticket className="w-4 h-4 mr-3 group-hover:text-[#d7ff42]" />
                                    My Tickets
                                </motion.div>
                            </NavLink>
                        </div>

                        <div className="h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent my-2"/>

                        {/* Logout Button */}
                        <div className="px-2">
                            <motion.button
                                whileHover={{ x: 4 }}
                                onClick={logout}
                                className="w-full flex items-center px-3 py-2 text-sm text-red-400 rounded-lg hover:bg-red-400/10 transition-colors group"
                            >
                                <svg 
                                    className="w-4 h-4 mr-3 group-hover:text-red-400"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                                    <polyline points="16 17 21 12 16 7" />
                                    <line x1="21" y1="12" x2="9" y2="12" />
                                </svg>
                                Logout
                            </motion.button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );

    return (
        <nav className="bg-[#1d2132] border-b border-gray-700 relative z-40">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <Link to="/" className="flex-shrink-0 flex items-center">
                            <span className="text-2xl font-bold text-[#d7ff42]">
                                interLink
                            </span>
                        </Link>
                        
                        <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                            <NavLink to="/">
                                <div className="flex items-center gap-2 text-gray-400 hover:text-[#d7ff42]">
                                    <Home className="w-5 h-5" />
                                    <span>Home</span>
                                </div>
                            </NavLink>

                            <NavLink to="/events">
                                <div className="flex items-center gap-2 text-gray-400 hover:text-[#d7ff42]">
                                    <Calendar className="w-5 h-5" />
                                    <span>Events</span>
                                </div>
                            </NavLink>
                        </div>
                    </div>

                    {/* Right side buttons */}
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setDarkMode(!darkMode)}
                            className="p-2 rounded-lg hover:bg-[#222839] transition-colors text-[#d7ff42]"
                        >
                            <AnimatePresence mode="wait" initial={false}>
                                <motion.div
                                    key={darkMode ? 'dark' : 'light'}
                                    initial={{ y: -20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    exit={{ y: 20, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    {darkMode ? (
                                        <Sun className="w-6 h-6" />
                                    ) : (
                                        <Moon className="w-6 h-6" />
                                    )}
                                </motion.div>
                            </AnimatePresence>
                        </button>

                        {user ? (
                            <UserMenu />
                        ) : (
                            <>
                                <Link to="/login">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="px-4 py-2 text-sm font-medium text-[#d7ff42] hover:text-[#7557e1]"
                                    >
                                        Sign in
                                    </motion.button>
                                </Link>
                                
                                <Link to="/register">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="px-4 py-2 text-sm font-medium text-[#1d2132] bg-[#d7ff42] hover:bg-[#7557e1] hover:text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                                    >
                                        Get Started
                                    </motion.button>
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

interface NavLinkProps {
    to: string;
    children: React.ReactNode;
}

const NavLink: React.FC<NavLinkProps> = ({ to, children }) => (
    <Link
        to={to}
        className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium transition-colors duration-200 hover:border-[#d7ff42]"
    >
        {children}
    </Link>
)

export default Navbar;
