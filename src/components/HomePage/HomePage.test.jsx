import { render, screen } from '@testing-library/react'
import { LanguageProvider } from '../../context/LanguageContext'
import { BookingProvider } from '../../context/BookingContext'
import HomePage from './HomePage'

function renderHomePage() {
  return render(
    <LanguageProvider>
      <BookingProvider>
        <HomePage />
      </BookingProvider>
    </LanguageProvider>
  )
}

describe('HomePage', () => {
  it('renders without crashing', () => {
    renderHomePage()
  })

  it('renders the Buy Tickets button from HeroSection', () => {
    renderHomePage()
    expect(screen.getByRole('button', { name: 'Buy Tickets' })).toBeInTheDocument()
  })

  it('renders the Special Exhibitions label from ExhibitionList', () => {
    renderHomePage()
    expect(screen.getByText('Special Exhibitions')).toBeInTheDocument()
  })

  it('renders all 3 exhibitions', () => {
    renderHomePage()
    expect(screen.getByText('Forbidden City')).toBeInTheDocument()
    expect(screen.getByText('T.Rex Revealed')).toBeInTheDocument()
    expect(screen.getByText('Egypt: The Time of Pharaohs')).toBeInTheDocument()
  })

  it('renders as a <main> element', () => {
    renderHomePage()
    expect(screen.getByRole('main')).toBeInTheDocument()
  })
})
