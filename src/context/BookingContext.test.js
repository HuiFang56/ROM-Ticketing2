import { bookingReducer, initialState } from './BookingContext'

test('initial state has screen home', () => {
  expect(initialState.screen).toBe('home')
})

test('initial tickets has 5 types without member or timeSlot', () => {
  expect(Object.keys(initialState.tickets)).toEqual(['adult', 'child', 'youth', 'student', 'senior'])
  expect(initialState).not.toHaveProperty('timeSlot')
})

test('GO_TO_BOOKING sets screen to booking', () => {
  const next = bookingReducer(initialState, { type: 'GO_TO_BOOKING', exhibitionId: null })
  expect(next.screen).toBe('booking')
  expect(next.step).toBe(1)
})

test('GO_TO_BOOKING with exhibitionId stores it', () => {
  const next = bookingReducer(initialState, { type: 'GO_TO_BOOKING', exhibitionId: 'forbidden-city' })
  expect(next.entryExhibitionId).toBe('forbidden-city')
})

test('GO_HOME resets to initial state', () => {
  const inBooking = bookingReducer(initialState, { type: 'GO_TO_BOOKING', exhibitionId: null })
  const back = bookingReducer(inBooking, { type: 'GO_HOME' })
  expect(back.screen).toBe('home')
})

test('GO_TO_EXHIBITION sets screen and exhibitionId', () => {
  const next = bookingReducer(initialState, { type: 'GO_TO_EXHIBITION', exhibitionId: 'trex' })
  expect(next.screen).toBe('exhibition')
  expect(next.selectedExhibitionId).toBe('trex')
})

test('CONFIRM_ORDER sets screen to confirmation and generates orderId', () => {
  const next = bookingReducer(initialState, { type: 'CONFIRM_ORDER' })
  expect(next.screen).toBe('confirmation')
  expect(next.orderId).toMatch(/^ROM-[A-Z0-9]{6}$/)
})

test('SET_STEP advances step', () => {
  const next = bookingReducer(initialState, { type: 'SET_STEP', step: 3 })
  expect(next.step).toBe(3)
})

test('SET_DATE stores date string', () => {
  const next = bookingReducer(initialState, { type: 'SET_DATE', date: '2026-04-15' })
  expect(next.date).toBe('2026-04-15')
})

test('SET_TICKET updates qty and clamps to 0 minimum', () => {
  const withTwo = bookingReducer(initialState, { type: 'SET_TICKET', ticketType: 'adult', qty: 2 })
  expect(withTwo.tickets.adult).toBe(2)
  const clamped = bookingReducer(withTwo, { type: 'SET_TICKET', ticketType: 'adult', qty: -5 })
  expect(clamped.tickets.adult).toBe(0)
})

test('SET_TICKET works for child and student', () => {
  const next = bookingReducer(initialState, { type: 'SET_TICKET', ticketType: 'child', qty: 3 })
  expect(next.tickets.child).toBe(3)
})

test('SET_ADDON caps qty at ticket qty for that type', () => {
  const withTickets = bookingReducer(initialState, { type: 'SET_TICKET', ticketType: 'adult', qty: 2 })
  const withAddon = bookingReducer(withTickets, {
    type: 'SET_ADDON', exhibitionId: 'forbidden-city', ticketType: 'adult', qty: 5,
  })
  expect(withAddon.addons['forbidden-city'].adult).toBe(2)
})

test('SET_CONTACT merges contact fields', () => {
  const next = bookingReducer(initialState, { type: 'SET_CONTACT', fields: { name: 'Jane', email: 'j@j.com' } })
  expect(next.contact.name).toBe('Jane')
  expect(next.contact.email).toBe('j@j.com')
  expect(next.contact.phone).toBe('')
})

test('SET_PAYMENT_METHOD stores method', () => {
  const next = bookingReducer(initialState, { type: 'SET_PAYMENT_METHOD', method: 'wechat' })
  expect(next.paymentMethod).toBe('wechat')
})

test('unknown action returns state unchanged', () => {
  const next = bookingReducer(initialState, { type: 'UNKNOWN' })
  expect(next).toEqual(initialState)
})

test('CONFIRM_ORDER preserves booking data', () => {
  const withData = {
    ...initialState,
    date: '2026-04-10',
    tickets: { ...initialState.tickets, adult: 2 },
    contact: { name: 'Jane', email: 'jane@example.com', phone: '' },
    addons: { 'forbidden-city': { adult: 1, child: 0, youth: 0, student: 0, senior: 0 } },
  }
  const next = bookingReducer(withData, { type: 'CONFIRM_ORDER' })
  expect(next.screen).toBe('confirmation')
  expect(next.orderId).toMatch(/^ROM-[A-Z0-9]{6}$/)
  expect(next.date).toBe('2026-04-10')
  expect(next.tickets.adult).toBe(2)
  expect(next.contact.email).toBe('jane@example.com')
})
