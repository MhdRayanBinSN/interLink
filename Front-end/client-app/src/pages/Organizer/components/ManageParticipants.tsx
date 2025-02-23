import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaSearch, FaQrcode, FaCheck, FaTimes, FaDownload } from 'react-icons/fa';
import { useParams } from 'react-router-dom';
import { Html5Qrcode } from 'html5-qrcode';

interface IManageParticipantsProps {}

type Participant = {
  id: string;
  name: string;
  email: string;
  phone: string;
  registrationDate: Date;
  attendanceStatus: 'present' | 'absent' | 'not_marked';
  ticketId: string;
  attendeeType: 'student' | 'professional' | 'other';  // Added attendee type
};

const ManageParticipants: React.FunctionComponent<IManageParticipantsProps> = () => {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showScanner, setShowScanner] = useState(false);
  const [eventStatus, setEventStatus] = useState<'upcoming' | 'ongoing' | 'completed'>('upcoming');
  const { eventId } = useParams();

  // Mock data - replace with API call
  useEffect(() => {
    const mockParticipants: Participant[] = [
      {
        id: '1',
        name: 'Muhammed Rayan',
        email: 'rayan6203@gmail.com',
        phone: '+91 8590109268',
        registrationDate: new Date('2024-02-20'),
        attendanceStatus: 'not_marked',
        ticketId: 'TICKET001',
        attendeeType: 'student'
      },
      {
        id: '2',
        name: 'Subash M',
        email: 'subu@gmail.com',
        phone: '+91 987482210',
        registrationDate: new Date('2024-02-20'),
        attendanceStatus: 'not_marked',
        ticketId: 'TICKET001',
        attendeeType: 'student'
      },{
        id: '3',
        name: 'Tobin Tom',
        email: 'pala@yahoo.com',
        phone: '+91 9876543210',
        registrationDate: new Date('2024-02-20'),
        attendanceStatus: 'not_marked',
        ticketId: 'TICKET001',
        attendeeType: 'student'
      },{
        id: '4',
        name: 'Seban Sebastian',
        email: 'vattakunnelseban@gmail.com',
        phone: '+91 9876543210',
        registrationDate: new Date('2024-02-20'),
        attendanceStatus: 'not_marked',
        ticketId: 'TICKET001',
        attendeeType: 'student'
      },
      // ... more participants
    ];
    setParticipants(mockParticipants);
  }, []);

  // Add this cleanup effect
  useEffect(() => {
    return () => {
      if (showScanner) {
        const html5QrCode = new Html5Qrcode("qr-reader");
        html5QrCode.stop().catch(err => console.error(err));
      }
    };
  }, [showScanner]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleScanQR = (data: string | null) => {
    if (data) {
      const participant = participants.find(p => p.ticketId === data);
      if (participant) {
        markAttendance(participant.id, 'present');
        setShowScanner(false);
      }
    }
  };

  const markAttendance = (participantId: string, status: 'present' | 'absent') => {
    setParticipants(prev =>
      prev.map(p =>
        p.id === participantId ? { ...p, attendanceStatus: status } : p
      )
    );
  };

  const exportToCSV = () => {
    // Implementation for CSV export
    console.log('Exporting participant data...');
  };

  const startScanner = async () => {
    try {
      const html5QrCode = new Html5Qrcode("qr-reader");
      setShowScanner(true);

      await html5QrCode.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        (decodedText) => {
          const participant = participants.find(p => p.ticketId === decodedText);
          if (participant) {
            markAttendance(participant.id, 'present');
            html5QrCode.stop().then(() => {
              setShowScanner(false);
            });
          }
        },
        (errorMessage) => {
          console.log(errorMessage);
        }
      );
    } catch (err) {
      console.error("Error starting scanner:", err);
      setShowScanner(false);
    }
  };

  const filteredParticipants = participants.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.ticketId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderScanner = () => {
    if (!showScanner) return null;

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      >
        <div className="bg-[#222839] p-6 rounded-[10px] max-w-md w-full">
          <div id="qr-reader" className="w-full"></div>
          <button
            onClick={() => {
              const html5QrCode = new Html5Qrcode("qr-reader");
              html5QrCode.stop().then(() => {
                setShowScanner(false);
              });
            }}
            className="mt-4 w-full px-4 py-2 bg-red-500 text-white rounded-[10px] hover:bg-opacity-90"
          >
            Close Scanner
          </button>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Manage Participants</h2>
        <button
          onClick={exportToCSV}
          className="flex items-center px-4 py-2 bg-[#7557e1] text-white rounded-[10px] hover:bg-opacity-90"
        >
          <FaDownload className="mr-2" />
          Export List
        </button>
      </div>

      {/* Search and QR Scanner */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1 relative">
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search participants..."
            value={searchQuery}
            onChange={handleSearch}
            className="w-full pl-10 pr-4 py-2 bg-[#222839] border border-gray-700 rounded-[10px] text-white focus:ring-2 focus:ring-[#d7ff42] focus:border-transparent"
          />
        </div>
        {eventStatus === 'ongoing' && (
          <button
            onClick={startScanner}
            className="flex items-center px-4 py-2 bg-[#d7ff42] text-[#1d2132] rounded-[10px] font-semibold hover:bg-opacity-90"
          >
            <FaQrcode className="mr-2" />
            Scan QR
          </button>
        )}
      </div>

      {/* QR Scanner Modal */}
      {renderScanner()}

      {/* Participants Table */}
      <div className="bg-[#222839] rounded-[10px] border border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-gray-400 border-b border-gray-700">
                <th className="px-6 py-3 text-left">Name</th>
                <th className="px-6 py-3 text-left">Email</th>
                <th className="px-6 py-3 text-left">Phone</th>
                <th className="px-6 py-3 text-left">Registration Date</th>
                <th className="px-6 py-3 text-left">Attendee Type</th>
                <th className="px-6 py-3 text-left">Attendance</th>
                <th className="px-6 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredParticipants.map((participant) => (
                <tr 
                  key={participant.id} 
                  className="border-b border-gray-700 hover:bg-[#1d2132] cursor-pointer"
                  onClick={() => eventStatus === 'ongoing' && markAttendance(participant.id, 
                    participant.attendanceStatus === 'present' ? 'absent' : 'present'
                  )}
                >
                  <td className="px-6 py-4 text-white">{participant.name}</td>
                  <td className="px-6 py-4 text-gray-300">{participant.email}</td>
                  <td className="px-6 py-4 text-gray-300">{participant.phone}</td>
                  <td className="px-6 py-4 text-gray-300">
                    {new Date(participant.registrationDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 text-xs rounded-full ${
                      participant.attendeeType === 'student'
                        ? 'bg-blue-500/20 text-blue-500'
                        : participant.attendeeType === 'professional'
                        ? 'bg-purple-500/20 text-purple-500'
                        : 'bg-gray-500/20 text-gray-500'
                    }`}>
                      {participant.attendeeType}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 text-xs rounded-full ${
                      participant.attendanceStatus === 'present'
                        ? 'bg-green-500/20 text-green-500'
                        : participant.attendanceStatus === 'absent'
                        ? 'bg-red-500/20 text-red-500'
                        : 'bg-gray-500/20 text-gray-500'
                    }`}>
                      {participant.attendanceStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    
                      <div className="flex space-x-2">
                        <button
                          onClick={() => markAttendance(participant.id, 'present')}
                          className="text-green-500 hover:text-green-400"
                        >
                          <FaCheck />
                        </button>
                        <button
                          onClick={() => markAttendance(participant.id, 'absent')}
                          className="text-red-500 hover:text-red-400"
                        >
                          <FaTimes />
                        </button>
                      </div>
                   
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageParticipants;
