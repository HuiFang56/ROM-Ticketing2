import { initialState } from '../../context/BookingContext'
import { withMockContexts } from '../../stories/decorators'
import HomePage from './HomePage'

const homeState = { ...initialState, screen: 'home' }

export default { component: HomePage }

export const En = {
  decorators: [withMockContexts('en', homeState)],
}

export const Zh = {
  decorators: [withMockContexts('zh', homeState)],
}
