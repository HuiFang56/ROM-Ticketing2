import { LanguageProvider } from './context/LanguageContext'
import { BookingProvider, useBooking } from './context/BookingContext'
import Header from './components/Header/Header'
import HomePage from './components/HomePage/HomePage'
import BookingPage from './components/BookingPage/BookingPage'
import ConfirmationPage from './components/ConfirmationPage/ConfirmationPage'
import './App.css'

function AppContent() {
  const { state } = useBooking()
  return (
    <div className="app-shell">
      <Header />
      {state.screen === 'home'         && <HomePage />}
      {state.screen === 'exhibition'   && <main style={{ padding: 'var(--space-md)' }}><p>Exhibition — coming soon</p></main>}
      {state.screen === 'plan-visit'   && <main style={{ padding: 'var(--space-md)' }}><p>Plan Your Visit — coming soon</p></main>}
      {state.screen === 'booking'      && <BookingPage />}
      {state.screen === 'confirmation' && <ConfirmationPage />}
    </div>
  )
}

export default function App() {
  return (
    <LanguageProvider>
      <BookingProvider>
        <AppContent />
      </BookingProvider>
    </LanguageProvider>
  )
}
