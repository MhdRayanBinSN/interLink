import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import QRCode from 'qrcode';

// Define styles outside of the component
const styles = StyleSheet.create({
  page: {
    padding: 30,
    backgroundColor: '#ffffff'
  },
  header: {
    marginBottom: 20,
    borderBottom: 1, // Fixed border syntax
    borderBottomColor: '#000',
    paddingBottom: 10
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold'
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
          <Text style={styles.headerText}>Event Ticket</Text>
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

export default TicketPDF