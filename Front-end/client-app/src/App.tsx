import * as React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { AnimatePresence } from "framer-motion"
import Navbar from './components/Navbar';
import Home from './pages/Home';
import EventDiscovery from './pages/EventDiscovery';

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
          </Routes>
        </AnimatePresence>
      </div>
   </Router>
  );
};

export default App;
