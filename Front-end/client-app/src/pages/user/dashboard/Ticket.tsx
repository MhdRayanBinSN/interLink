import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import QRCode from 'qrcode.react';
import { Link } from 'react-router-dom';
import { PDFDownloadLink } from '@react-pdf/renderer';
import {TicketPDF} from './TicketPDF';

interface TicketData {
  id: string;
  eventName: string;
  eventDate: string;
  eventTime: string;
  eventLocation: string;
  ticketType: string;
  ticketNumber: string;
  price: number;
  purchaseDate: string;
  eventId: string;
  status: 'upcoming' | 'completed' | 'cancelled';
}

const Ticket: React.FC = () => {
  const [selectedTicket, setSelectedTicket] = useState<TicketData | null>(null);

  // Dummy ticket data
  const tickets: TicketData[] = [
    {
      id: "T1001",
      eventName: "React Advanced Conference 2024",
      eventDate: "2024-03-15",
      eventTime: "09:00 AM",
      eventLocation: "Tech Convention Center",
      ticketType: "VIP Access",
      ticketNumber: "REACT-2024-001",
      price: 199.99,
      purchaseDate: "2024-02-20",
      eventId: "E1001",
      status: 'upcoming'
    },
    // Add more dummy tickets as needed
  ];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">My Tickets</h1>
      
      {/* Ticket List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tickets.map((ticket) => (
          <motion.div
            key={ticket.id}
            className="bg-white rounded-lg shadow-md overflow-hidden"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <div className="p-4">
              <div className={`text-sm font-semibold mb-2 ${
                ticket.status === 'upcoming' ? 'text-green-600' :
                ticket.status === 'completed' ? 'text-gray-600' : 'text-red-600'
              }`}>
                {ticket.status.toUpperCase()}
              </div>
              <h3 className="text-xl font-semibold mb-2">{ticket.eventName}</h3>
              <div className="text-gray-600 mb-4">
                <p>{new Date(ticket.eventDate).toLocaleDateString()}</p>
                <p>{ticket.eventTime}</p>
                <p>{ticket.eventLocation}</p>
              </div>
              <button
                onClick={() => setSelectedTicket(ticket)}
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Show Ticket
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Ticket Detail Modal */}
      <AnimatePresence>
        {selectedTicket && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setSelectedTicket(null)}
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold">{selectedTicket.eventName}</h2>
                <button
                  onClick={() => setSelectedTicket(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold mb-2">Event Details</h3>
                    <p className="text-gray-600">Date: {new Date(selectedTicket.eventDate).toLocaleDateString()}</p>
                    <p className="text-gray-600">Time: {selectedTicket.eventTime}</p>
                    <p className="text-gray-600">Location: {selectedTicket.eventLocation}</p>
                  </div>

                  <div className="mb-4">
                    <h3 className="text-lg font-semibold mb-2">Ticket Information</h3>
                    <p className="text-gray-600">Ticket Type: {selectedTicket.ticketType}</p>
                    <p className="text-gray-600">Ticket #: {selectedTicket.ticketNumber}</p>
                    <p className="text-gray-600">Purchase Date: {new Date(selectedTicket.purchaseDate).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="flex flex-col items-center justify-center">
                  <QRCode 
                    value={selectedTicket.ticketNumber}
                    size={200}
                    level="H"
                    includeMargin={true}
                  />
                  <p className="text-sm text-gray-500 mt-2">Scan for verification</p>
                </div>
              </div>

              <div className="flex justify-between mt-6">
                <Link
                  to={`/events/${selectedTicket.eventId}`}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  View Event Details
                </Link>
                <PDFDownloadLink
                  document={
                    <TicketPDF
                      ticket={{
                        ...selectedTicket,
                        qrData: selectedTicket.ticketNumber // Add qrData property
                      }}
                    />
                  }
                  fileName={`ticket-${selectedTicket.ticketNumber}.pdf`}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                Download
                </PDFDownloadLink>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Ticket;
