import { createContext, useContext, useReducer } from 'react'

export const initialState = {
  screen: 'home',
  selectedExhibitionId: null,
  entryExhibitionId: null,
  step: 1,
  date: null,
  timeSlot: null,
  tickets: { adult: 0, youth: 0, senior: 0, member: 0 },
  addons: {},
  contact: { name: '', email: '', phone: '' },
  paymentMethod: null,
  orderId: null,
}

export function bookingReducer(state, action) {
  switch (action.type) {
    case 'GO_TO_BOOKING':
      return {
        ...initialState,
        screen: 'booking',
        entryExhibitionId: action.exhibitionId ?? null,
      }
    case 'GO_HOME':
      return { ...initialState }
    case 'GO_TO_EXHIBITION':
      return { ...state, screen: 'exhibition', selectedExhibitionId: action.exhibitionId }
    case 'GO_TO_PLAN_VISIT':
      return { ...state, screen: 'plan-visit' }
    case 'CONFIRM_ORDER': {
      const orderId = 'ROM-' + Math.random().toString(36).slice(2, 8).toUpperCase()
      return { ...state, screen: 'confirmation', orderId }
    }
    case 'SET_STEP':
      return { ...state, step: action.step }
    case 'SET_DATE':
      return { ...state, date: action.date }
    case 'SET_TIME_SLOT':
      return { ...state, timeSlot: action.timeSlot }
    case 'SET_TICKET':
      return { ...state, tickets: { ...state.tickets, [action.ticketType]: Math.max(0, action.qty) } }
    case 'SET_ADDON':
      return {
        ...state,
        addons: {
          ...state.addons,
          [action.exhibitionId]: {
            ...(state.addons[action.exhibitionId] ?? { adult: 0, youth: 0, senior: 0, member: 0 }),
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

const BookingContext = createContext(null)

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
