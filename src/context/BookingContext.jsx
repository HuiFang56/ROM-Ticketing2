// src/context/BookingContext.jsx
import { createContext, useContext, useReducer } from 'react'

export const initialState = {
  screen: 'home',
  selectedExhibitionId: null,
  entryExhibitionId: null,
  step: 1,
  date: null,
  tickets: { adult: 0, child: 0, youth: 0, student: 0, senior: 0 },
  addons: {},
  contact: { name: '', email: '', phone: '' },
  paymentMethod: null,
  orderId: null,
}

export function bookingReducer(state, action) {
  switch (action.type) {
    case 'GO_TO_BOOKING':
      return { ...initialState, screen: 'booking', entryExhibitionId: action.exhibitionId ?? null }
    case 'GO_HOME':
      return { ...initialState }
    case 'GO_TO_EXHIBITION':
      return { ...initialState, screen: 'exhibition', selectedExhibitionId: action.exhibitionId }
    case 'GO_TO_PLAN_VISIT':
      return { ...state, screen: 'plan-visit' }
    case 'CONFIRM_ORDER': {
      const orderId = 'ROM-' + crypto.randomUUID().replace(/-/g, '').slice(0, 6).toUpperCase()
      return { ...state, screen: 'confirmation', orderId }
    }
    case 'SET_STEP':
      return { ...state, step: action.step }
    case 'SET_DATE':
      return { ...state, date: action.date }
    case 'SET_TICKET':
      return { ...state, tickets: { ...state.tickets, [action.ticketType]: Math.max(0, action.qty) } }
    case 'SET_ADDON':
      return {
        ...state,
        addons: {
          ...state.addons,
          [action.exhibitionId]: {
            ...(state.addons[action.exhibitionId] ?? { adult: 0, child: 0, youth: 0, student: 0, senior: 0 }),
            [action.ticketType]: Math.min(Math.max(0, action.qty), state.tickets[action.ticketType]),
          },
        },
      }
    case 'SET_CONTACT':
      return { ...state, contact: { ...state.contact, ...action.fields } }
    case 'SET_PAYMENT_METHOD':
      return { ...state, paymentMethod: action.method }
    default:
      return state
  }
}

export const BookingContext = createContext(null)

export function BookingProvider({ children }) {
  const [state, dispatch] = useReducer(bookingReducer, initialState)
  return (
    <BookingContext.Provider value={{ state, dispatch }}>
      {children}
    </BookingContext.Provider>
  )
}

export function useBooking() {
  const ctx = useContext(BookingContext)
  if (!ctx) throw new Error('useBooking must be used within BookingProvider')
  return ctx
}
