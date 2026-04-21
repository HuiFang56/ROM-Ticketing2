import { initialState } from '../../context/BookingContext'
import { withMockContexts } from '../../stories/decorators'
import PlanVisitPage from './PlanVisitPage'

const planState = { ...initialState, screen: 'plan-visit' }

export default { component: PlanVisitPage }

export const En = {
  decorators: [withMockContexts('en', planState)],
}

export const Zh = {
  decorators: [withMockContexts('zh', planState)],
}
