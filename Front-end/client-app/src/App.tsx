import * as React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { AnimatePresence } from "framer-motion"
import Navbar from './components/Navbar';
import Home from './pages/Home';
import EventDiscovery from './pages/EventDiscovery';
import EventBooking from './pages/EventBooking';
import UserDashboard from './pages/UserDashboard';
import Login from './pages/Login';
import OrganizerDashboard from './pages/OrganizerDashboard';

//import Home from "./pages/Home"
interface IAppProps {
}

const App: React.FunctionComponent<IAppProps> = () => {
  return (
   
   <Router>
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 text-gray-900">
        <Navbar />
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/events" element={<EventDiscovery />} />
            <Route path="/events/:id" element={<EventBooking />} />
            <Route path="/dashboard/user" element={<UserDashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard/organizer" element={<OrganizerDashboard />} />
          </Routes>
        </AnimatePresence>
      </div>
   </Router>
  );
};

export default App;
