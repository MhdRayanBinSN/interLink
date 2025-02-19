import * as React from 'react';
import { Link } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { useStore } from "../store"
import { Sun, Moon, Calendar, User } from 'lucide-react';
import { format } from 'date-fns';

interface INavbarProps {
}

const Navbar: React.FunctionComponent<INavbarProps> = () => {
    const { user, logout } = useStore()
    const [darkMode, setDarkMode] = React.useState(false);
    React.useEffect(() => {
      if (darkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }, [darkMode]);
  
    return (
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <Link to="/" className="flex-shrink-0 flex items-center">
                
                <span className="ml-2 text-xl font-bold text-indigo-600">interLink</span>
              </Link>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">


               
                <NavLink to="/events" >
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                <Calendar className="w-5 h-5" />
                <span>Events</span>
                </div>
                </NavLink>

                

                {user && (
                  <NavLink to={user.role === "organizer" ? "/dashboard/organizer" : "/dashboard/user"}>
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                    <User className="w-5 h-5" />
                    <span>Dashboard</span>
                    </div>
                    
                  </NavLink>
                )}
                  <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
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
                      <Sun className="w-6 h-6 text-yellow-500" />
                    ) : (
                      <Moon className="w-6 h-6 text-gray-700" />
                    )}
                  </motion.div>
                </AnimatePresence>
              </button>
              </div>




            </div>

            <div className="hidden sm:ml-6 sm:flex sm:items-center">
              {user ? (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  onClick={logout}
                >
                  Logout
                </motion.button>
              ) : (
                <Link to="/login">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Login
                  </motion.button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>
    )
};
interface NavLinkProps {
  to: string;
  children: React.ReactNode;
}

const NavLink: React.FC<NavLinkProps> = ({ to, children }) => (
    <Link
      to={to}
      className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
    >
      {children}
    </Link>
  )
export default Navbar;
