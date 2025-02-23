export interface Event {
  id: string;
  title: string;
  description: string;
  date: Date;
  location: string;
  category: string;
  language: string;
  imageUrl: string;
  organizer: {
    name: string;
    email: string;
  };
  price: number;
  capacity: number;
  registeredCount: number;
  startTime?: string;
  endTime?: string;
  venue?: {
    name: string;
    address: string;
    googleMapsUrl: string;
  };
  schedule?: {
    time: string;
    title: string;
    description: string;
  }[];
  speakers?: {
    name: string;
    designation: string;
    company: string;
    bio: string;
    image: string;
  }[];
  features?: string[];
  requirements?: string[];
  faqs?: {
    question: string;
    answer: string;
  }[];
  ticketTypes?: {
    name: string;
    price: number;
    quantity: number;
    description: string;
  }[];
}