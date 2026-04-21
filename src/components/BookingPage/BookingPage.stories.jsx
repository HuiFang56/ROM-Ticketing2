import { initialState } from '../../context/BookingContext'
import { withMockContexts } from '../../stories/decorators'
import BookingPage from './BookingPage'

const base = {
  ...initialState,
  screen: 'booking',
  entryExhibitionId: 'forbidden-city',
}

export default { component: BookingPage }

export const Step1 = {
  decorators: [withMockContexts('en', { ...base, step: 1 })],
}

export const Step2 = {
  decorators: [withMockContexts('en', {
    ...base,
    step: 2,
    date: '2026-05-10',
  })],
}

export const Step3 = {
  decorators: [withMockContexts('en', {
    ...base,
    step: 3,
    date: '2026-05-10',
    tickets: { adult: 2, child: 1, youth: 0, student: 0, senior: 0 },
  })],
}

export const Step4 = {
  decorators: [withMockContexts('en', {
    ...base,
    step: 4,
    date: '2026-05-10',
    tickets: { adult: 2, child: 1, youth: 0, student: 0, senior: 0 },
    addons: {
      'trex-revealed': { adult: 1, child: 0, youth: 0, student: 0, senior: 0 },
    },
  })],
}

export const Step5 = {
  decorators: [withMockContexts('en', {
    ...base,
    step: 5,
    date: '2026-05-10',
    tickets: { adult: 2, child: 1, youth: 0, student: 0, senior: 0 },
    addons: {},
    contact: { name: 'Alice Chen', email: 'alice@example.com', phone: '416-555-0100' },
  })],
}
