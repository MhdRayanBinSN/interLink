import * as React from 'react';
import { Link, useLocation, Navigate } from "react-router-dom"
import { motion } from "framer-motion"
import { Ticket, User } from 'lucide-react'

const UserNavbar: React.FunctionComponent = () => {
    const location = useLocation();
    // Add authentication check - replace this with your actual auth check
    const isAuthenticated = localStorage.getItem('token') !== null;

    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    const isActiveRoute = (path: string) => {
        return location.pathname === path;
    };

    return (

        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-center space-x-8 h-14">
                    <Link to="/dashboard/profile">
                        <motion.div
                            whileHover={{ y: -2 }}
                            className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                                isActiveRoute('/dashboard/profile')
                                    ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600'
                                    : 'text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400'
                            }`}
                        >
                            <User className="w-5 h-5 mr-2" />
                            Profile
                        </motion.div>
                    </Link>

                    <Link to="/dashboard/tickets">
                        <motion.div
                        >
                            <Ticket className="w-5 h-5 mr-2" />
                            My Tickets
                        </motion.div>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default UserNavbar;