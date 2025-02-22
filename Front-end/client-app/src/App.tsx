import * as React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Navbar from './components/Navbar/Navbar';
import Home from './pages/user/Home';
import EventDiscovery from './pages/user/EventDiscovery';
import Login from './pages/user/Login';
import Register from './pages/user/Register';
import { EventDetails } from './pages/user/EventDetails';
import UserDashboard from './pages/user/dashboard/UserDashboard';

const App: React.FunctionComponent = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 text-gray-900">
        <Navbar />
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/events" element={<EventDiscovery />} />
            <Route path="/events/:id" element={<EventDetails />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard/*" element={<UserDashboard />} />
          </Routes>
        </AnimatePresence>
      </div>
    </Router>
  );
};

export default App;
