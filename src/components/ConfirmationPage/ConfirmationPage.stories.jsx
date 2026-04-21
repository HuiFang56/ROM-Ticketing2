import { initialState } from '../../context/BookingContext'
import { withMockContexts } from '../../stories/decorators'
import ConfirmationPage from './ConfirmationPage'

export default { component: ConfirmationPage }

export const Default = {
  decorators: [withMockContexts('en', {
    ...initialState,
    screen: 'confirmation',
    orderId: 'ROM-AB12CD',
    entryExhibitionId: 'forbidden-city',
    date: '2026-05-10',
    tickets: { adult: 2, child: 1, youth: 0, student: 0, senior: 0 },
    contact: { name: 'Alice Chen', email: 'alice@example.com', phone: '' },
  })],
}
