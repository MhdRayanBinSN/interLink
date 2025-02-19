export interface Event {
    id: string;
    title: string;
    description: string;
    date: Date;
    location: string;
    category: 'bootcamp' | 'hackathon' | 'conference';
    imageUrl: string;
    organizer: {
      name: string;
      email: string;
    };
    price: number;
    capacity: number;
    registeredCount: number;
  }
  
  export interface User {
    id: string;
    name: string;
    email: string;
    role: 'attendee' | 'organizer';
    registeredEvents: string[];
  }