import * as React from 'react';
import { useState } from "react"
import { motion } from "framer-motion"
import { useStore } from "../store"
import { Link } from "react-router-dom"

interface IEventDiscoveryProps {
}

const EventDiscovery: React.FunctionComponent<IEventDiscoveryProps> = (props) => {
    const { events } = useStore()
    const [filter, setFilter] = useState("")
    const [sort, setSort] = useState("date")
  
    const filteredEvents = events
      .filter(
        (event) =>
          event.title.toLowerCase().includes(filter.toLowerCase()) ||
          event.category.toLowerCase().includes(filter.toLowerCase()),
      )
      .sort((a, b) => {
        if (sort === "date") {
          return new Date(a.date).getTime() - new Date(b.date).getTime()
        } else if (sort === "price") {
          return a.price - b.price
        }
        return 0
      })
  
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
      >
        <h1 className="text-3xl font-extrabold text-gray-900 mb-6">Explore</h1>
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            placeholder="Search events..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="flex-grow px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          />
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="date">Sort by Date</option>
            <option value="price">Sort by Price</option>
          </select>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <motion.div
              key={event.id}
              whileHover={{ scale: 1.03 }}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-2">{event.title}</h2>
                <p className="text-gray-600 mb-4">{event.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-indigo-600 font-medium">${event.price}</span>
                  <Link
                    to={`/events/${event.id}`}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                  >
                    Book Now
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    )
};

export default EventDiscovery;
