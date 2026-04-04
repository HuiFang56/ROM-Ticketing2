import { bookingReducer, initialState } from './BookingContext'

test('initial state has screen home', () => {
  expect(initialState.screen).toBe('home')
})

test('GO_TO_BOOKING sets screen to booking', () => {
  const next = bookingReducer(initialState, { type: 'GO_TO_BOOKING', exhibitionId: null })
  expect(next.screen).toBe('booking')
})

test('GO_TO_BOOKING with exhibitionId stores it', () => {
  const next = bookingReducer(initialState, { type: 'GO_TO_BOOKING', exhibitionId: 'forbidden-city' })
  expect(next.screen).toBe('booking')
  expect(next.entryExhibitionId).toBe('forbidden-city')
})

test('GO_HOME resets to initial state', () => {
  const inBooking = bookingReducer(initialState, { type: 'GO_TO_BOOKING', exhibitionId: null })
  const back = bookingReducer(inBooking, { type: 'GO_HOME' })
  expect(back.screen).toBe('home')
  expect(back.entryExhibitionId).toBeNull()
})

test('GO_TO_EXHIBITION sets screen and exhibitionId', () => {
  const next = bookingReducer(initialState, { type: 'GO_TO_EXHIBITION', exhibitionId: 'trex' })
  expect(next.screen).toBe('exhibition')
  expect(next.selectedExhibitionId).toBe('trex')
})

test('GO_TO_PLAN_VISIT sets screen to plan-visit', () => {
  const next = bookingReducer(initialState, { type: 'GO_TO_PLAN_VISIT' })
  expect(next.screen).toBe('plan-visit')
})

test('CONFIRM_ORDER sets screen to confirmation and generates orderId', () => {
  const next = bookingReducer(initialState, { type: 'CONFIRM_ORDER' })
  expect(next.screen).toBe('confirmation')
  expect(next.orderId).toMatch(/^ROM-[A-Z0-9]{6}$/)
})

test('unknown action returns state unchanged', () => {
  const next = bookingReducer(initialState, { type: 'UNKNOWN' })
  expect(next).toEqual(initialState)
})
