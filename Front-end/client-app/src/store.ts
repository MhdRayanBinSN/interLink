import { create } from "zustand"
import { persist } from "zustand/middleware"

interface User {
  id: string
  name: string
  email: string
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
  imageUrl: string
  location: string
  language: string
}

interface Booking {
  id: string
  eventId: string
  userId: string
  status: "confirmed" | "pending" | "cancelled"
  bookingDate: string
}

interface Store {
  user: User | null
  events: Event[]
  bookings: Booking[]
  login: (user: User) => void
  logout: () => void
  addEvent: (event: Omit<Event, "id">) => void
  bookEvent: (eventId: string) => boolean
  cancelBooking: (bookingId: string) => void
  getBookedEvents: (userId: string) => Event[]
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
      
      addEvent: (eventData) => {
        const event: Event = {
          ...eventData,
          id: Math.random().toString(36).substring(2, 9),
        }
        set((state) => ({ events: [...state.events, event] }))
      },

      bookEvent: (eventId) => {
        const { user, events } = get()
        if (!user) return false

        const event = events.find(e => e.id === eventId)
        if (!event || event.availableSlots <= 0) return false

        const booking: Booking = {
          id: Math.random().toString(36).substring(2, 9),
          eventId,
          userId: user.id,
          status: "confirmed",
          bookingDate: new Date().toISOString()
        }

        set((state) => ({
          bookings: [...state.bookings, booking],
          events: state.events.map((e) =>
            e.id === eventId
              ? { ...e, availableSlots: e.availableSlots - 1 }
              : e
          ),
        }))

        return true
      },

      cancelBooking: (bookingId) => {
        const booking = get().bookings.find(b => b.id === bookingId)
        if (booking && booking.status === "confirmed") {
          set((state) => ({
            bookings: state.bookings.map(b =>
              b.id === bookingId ? { ...b, status: "cancelled" } : b
            ),
            events: state.events.map(e =>
              e.id === booking.eventId
                ? { ...e, availableSlots: e.availableSlots + 1 }
                : e
            ),
          }))
        }
      },

      getBookedEvents: (userId) => {
        const { events, bookings } = get()
        const userBookings = bookings.filter(b => 
          b.userId === userId && b.status === "confirmed"
        )
        return events.filter(event => 
          userBookings.some(booking => booking.eventId === event.id)
        )
      },

      getBookingsByEvent: (eventId) => {
        return get().bookings.filter(booking => booking.eventId === eventId)
      },
    }),
    {
      name: "event-management-store",
      version: 1,
    }
  )
)

