import { initialState } from '../../context/BookingContext'
import { withMockContexts } from '../../stories/decorators'
import ExhibitionPage from './ExhibitionPage'

export default { component: ExhibitionPage }

export const Open = {
  decorators: [withMockContexts('en', {
    ...initialState,
    screen: 'exhibition',
    selectedExhibitionId: 'forbidden-city',
  })],
}

export const ComingSoon = {
  decorators: [withMockContexts('en', {
    ...initialState,
    screen: 'exhibition',
    selectedExhibitionId: 'egypt-pharaohs',
  })],
}
