export interface Event {
    requirements: any;
    faqs: any;
    features: any;
    speakers: any;
    schedule: any;
    id: string;
    title: string;
    description: string;
    date: Date;
    location: string;
    category: 'bootcamp' | 'hackathon' | 'conference';
    language:string
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