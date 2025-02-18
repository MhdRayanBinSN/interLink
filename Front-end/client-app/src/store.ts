import { create } from "zustand"
import { persist } from "zustand/middleware"

interface User {
  id: string
  name: string
  role: "user" | "organizer"
}

interface Event {
  id: string
  title: string
  description: string
  date: string
  price: number
  category: string
  organizerId: string
  availableSlots: number
}

interface Booking {
  id: string
  eventId: string
  userId: string
  status: "confirmed" | "pending"
}

interface Store {
  user: User | null
  events: Event[]
  bookings: Booking[]
  login: (user: User) => void
  logout: () => void
  addEvent: (event: Event) => void
  bookEvent: (eventId: string, userId: string) => void
  getEventsByOrganizer: (organizerId: string) => Event[]
  getBookingsByUser: (userId: string) => Booking[]
  getBookingsByEvent: (eventId: string) => Booking[]
}

export const useStore = create<Store>()(
  persist(
    (set, get) => ({
      user: null,
      events: [],
      bookings: [],
      login: (user) => set({ user }),
      logout: () => set({ user: null }),
      addEvent: (event) => set((state) => ({ events: [...state.events, event] })),
      bookEvent: (eventId, userId) => {
        const booking: Booking = {
          id: Math.random().toString(36).substr(2, 9),
          eventId,
          userId,
          status: "confirmed",
        }
        set((state) => ({
          bookings: [...state.bookings, booking],
          events: state.events.map((event) =>
            event.id === eventId ? { ...event, availableSlots: event.availableSlots - 1 } : event,
          ),
        }))
      },
      getEventsByOrganizer: (organizerId) => {
        return get().events.filter((event) => event.organizerId === organizerId)
      },
      getBookingsByUser: (userId) => {
        return get().bookings.filter((booking) => booking.userId === userId)
      },
      getBookingsByEvent: (eventId) => {
        return get().bookings.filter((booking) => booking.eventId === eventId)
      },
    }),
    {
      name: "event-management-store",
    },
  ),
)

