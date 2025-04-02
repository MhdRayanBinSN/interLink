import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image, Font } from '@react-pdf/renderer';
import QRCode from 'qrcode';

// Register fonts if needed
Font.register({
  family: 'Roboto',
  fonts: [
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf', fontWeight: 300 },
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf', fontWeight: 400 },
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-medium-webfont.ttf', fontWeight: 500 },
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf', fontWeight: 700 },
  ]
});

// Define styles outside of the component
const styles = StyleSheet.create({
  page: {
    padding: 30,
    backgroundColor: '#ffffff',
    fontFamily: 'Roboto'
  },
  header: {
    marginBottom: 20,
    borderBottom: 1, // Fixed border syntax
    borderBottomColor: '#000',
    paddingBottom: 10,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333'
  },
  title: {
    fontSize: 18,
    marginBottom: 5
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1
  },
  row: {
    flexDirection: 'row',
    marginBottom: 10
  },
  label: {
    width: 100,
    fontSize: 12,
    color: '#666666'
  },
  value: {
    fontSize: 12
  },
  qrCode: {
    alignSelf: 'center',
    marginTop: 20,
    width: 150,
    height: 150
  },
  text: {
    fontSize: 12,
    marginBottom: 5
  },
  subheader: {
    fontSize: 16,
    marginBottom: 10,
    color: '#7557e1',
    fontWeight: 500
  },
  eventInfo: {
    marginBottom: 20,
    fontSize: 12,
    color: '#555'
  },
  eventDetail: {
    marginBottom: 5
  },
  table: {
    display: 'flex',
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#bfbfbf',
    marginBottom: 10
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#bfbfbf',
    minHeight: 25,
    alignItems: 'center'
  },
  tableRowHeader: {
    backgroundColor: '#f0f0f0',
    fontWeight: 700
  },
  tableCol: {
    padding: 5
  },
  nameCol: {
    width: '35%',
    borderRightWidth: 1,
    borderRightColor: '#bfbfbf'
  },
  emailCol: {
    width: '40%',
    borderRightWidth: 1,
    borderRightColor: '#bfbfbf'
  },
  typeCol: {
    width: '25%'
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    fontSize: 10,
    color: '#666',
    textAlign: 'center'
  }
});

// Define interfaces
interface Ticket {
  qrData: string;
  eventName: string;
  eventDate: string;
  eventTime: string;
  eventLocation: string;
  ticketType: string;
  ticketNumber: string;
}

interface TicketPDFProps {
  ticket: Ticket;
}

export const TicketPDF: React.FC<TicketPDFProps> = ({ ticket }) => {
  const [qrCodeUrl, setQrCodeUrl] = React.useState<string>('');

  React.useEffect(() => {
    // Use async/await for QR code generation
    const generateQRCode = async () => {
      try {
        const url = await QRCode.toDataURL(ticket.qrData, {
          errorCorrectionLevel: 'H',
          margin: 1,
          width: 150
        });
        setQrCodeUrl(url);
      } catch (err) {
        console.error('Error generating QR code:', err);
      }
    };

    generateQRCode();
  }, [ticket.qrData]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.header}>Event Ticket</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.title}>{ticket.eventName}</Text>
          
          <View style={styles.row}>
            <Text style={styles.label}>Date:</Text>
            <Text style={styles.value}>{formatDate(ticket.eventDate)}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Time:</Text>
            <Text style={styles.value}>{ticket.eventTime}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Location:</Text>
            <Text style={styles.value}>{ticket.eventLocation}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Ticket Type:</Text>
            <Text style={styles.value}>{ticket.ticketType}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Ticket #:</Text>
            <Text style={styles.value}>{ticket.ticketNumber}</Text>
          </View>
        </View>

        {qrCodeUrl && (
          <View style={styles.section}>
            <Image style={styles.qrCode} src={qrCodeUrl} />
          </View>
        )}
      </Page>
    </Document>
  );
};

interface ParticipantsPDFProps {
  ticket: {
    eventName: string;
    eventDate: string;
    eventTime: string;
    ticketNumber: string;
    participants: {
      name: string;
      email: string;
      attendeeType: string;
      attendanceStatus?: string;
    }[];
    status: string;
  };
  activeTab: string;
}

export const ParticipantsPDF: React.FC<ParticipantsPDFProps> = ({ ticket, activeTab }) => (
  <>
    {activeTab === 'participants' && (
      <>
        <div className="bg-[#1d2132] rounded-lg overflow-hidden">
          {ticket.participants.length === 0 ? (
            <div className="p-6 text-center text-gray-400">
              <p>No participant information available for this ticket</p>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="px-4 py-3 text-left text-gray-300">#</th>
                  <th className="px-4 py-3 text-left text-gray-300">Name</th>
                  <th className="px-4 py-3 text-left text-gray-300">Email</th>
                  <th className="px-4 py-3 text-left text-gray-300">Type</th>
                  {ticket.status !== 'upcoming' && (
                    <th className="px-4 py-3 text-left text-gray-300">Attendance</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {ticket.participants.map((participant, index) => (
                  <tr key={index} className="border-b border-gray-700/50 last:border-0">
                    <td className="px-4 py-3 text-gray-400">{index + 1}</td>
                    <td className="px-4 py-3 text-white">{participant.name}</td>
                    <td className="px-4 py-3 text-gray-400">{participant.email}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        participant.attendeeType === 'student' 
                          ? 'bg-blue-500/20 text-blue-400' 
                          : participant.attendeeType === 'professional' 
                          ? 'bg-purple-500/20 text-purple-400' 
                          : 'bg-gray-500/20 text-gray-400'
                      }`}>
                        {participant.attendeeType}
                      </span>
                    </td>
                    {ticket.status !== 'upcoming' && (
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          participant.attendanceStatus === 'present' 
                            ? 'bg-green-500/20 text-green-400' 
                            : participant.attendanceStatus === 'absent' 
                            ? 'bg-red-500/20 text-red-400' 
                            : 'bg-gray-500/20 text-gray-400'
                        }`}>
                          {participant.attendanceStatus || 'not marked'}
                        </span>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        
        {/* Add a note about verification */}
        <div className="mt-4 text-sm text-gray-400 bg-[#1d2132] p-3 rounded-lg border border-gray-700/50">
          <p>These are the registered participants for this booking. Present this information during event check-in for verification.</p>
        </div>
      </>
    )}
  </>
);

export default TicketPDF;