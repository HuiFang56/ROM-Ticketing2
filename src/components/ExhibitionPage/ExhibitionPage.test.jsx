import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import ExhibitionPage from './ExhibitionPage'
import { LanguageContext } from '../../context/LanguageContext'
import { BookingContext, initialState } from '../../context/BookingContext'

const enT = {
  'back': 'Back',
  'coming-soon': 'Coming Soon',
  'includes-ga': 'Includes General Admission',
  'open': 'Open',
  'book-tickets': 'Book Tickets',
}

function renderPage({
  lang = 'en',
  dispatch = vi.fn(),
  selectedExhibitionId = 'forbidden-city',
  todayStr = '2026-04-10',
} = {}) {
  const t = (key) => enT[key] ?? key
  const state = { ...initialState, screen: 'exhibition', selectedExhibitionId }
  return render(
    <LanguageContext.Provider value={{ lang, setLang: vi.fn(), t }}>
      <BookingContext.Provider value={{ state, dispatch }}>
        <ExhibitionPage todayStr={todayStr} />
      </BookingContext.Provider>
    </LanguageContext.Provider>
  )
}

describe('ExhibitionPage', () => {
  it('renders the exhibition name for the selected ID', () => {
    renderPage({ selectedExhibitionId: 'forbidden-city' })
    expect(screen.getByText('Forbidden City')).toBeInTheDocument()
  })

  it('shows "Open" badge for an open exhibition', () => {
    renderPage({ selectedExhibitionId: 'forbidden-city', todayStr: '2026-04-10' })
    expect(screen.getByText('Open')).toBeInTheDocument()
  })

  it('shows "Coming Soon" badge for a future exhibition', () => {
    renderPage({ selectedExhibitionId: 'egypt-pharaohs', todayStr: '2026-04-10' })
    expect(screen.getByText('Coming Soon')).toBeInTheDocument()
  })

  it('"Book Tickets" button dispatches GO_TO_BOOKING with the correct exhibitionId', async () => {
    const dispatch = vi.fn()
    renderPage({ selectedExhibitionId: 'forbidden-city', dispatch })
    await userEvent.click(screen.getByRole('button', { name: 'Book Tickets' }))
    expect(dispatch).toHaveBeenCalledWith({
      type: 'GO_TO_BOOKING',
      exhibitionId: 'forbidden-city',
    })
  })

  it('"Book Tickets" button is disabled for coming-soon exhibitions', () => {
    renderPage({ selectedExhibitionId: 'egypt-pharaohs', todayStr: '2026-04-10' })
    expect(screen.getByRole('button', { name: 'Coming Soon' })).toBeDisabled()
  })

  it('"← Back" button dispatches GO_HOME', async () => {
    const dispatch = vi.fn()
    renderPage({ dispatch })
    await userEvent.click(screen.getByRole('button', { name: '← Back' }))
    expect(dispatch).toHaveBeenCalledWith({ type: 'GO_HOME' })
  })
})
