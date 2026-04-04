import { LanguageProvider } from './context/LanguageContext'
import { BookingProvider, useBooking } from './context/BookingContext'
import Header from './components/Header/Header'
import './App.css'

function AppContent() {
  const { state } = useBooking()
  return (
    <div className="app-shell">
      <Header />
      {state.screen === 'home'         && <main style={{ padding: 'var(--space-md)' }}><p>Home — coming soon</p></main>}
      {state.screen === 'exhibition'   && <main style={{ padding: 'var(--space-md)' }}><p>Exhibition — coming soon</p></main>}
      {state.screen === 'plan-visit'   && <main style={{ padding: 'var(--space-md)' }}><p>Plan Your Visit — coming soon</p></main>}
      {state.screen === 'booking'      && <main style={{ padding: 'var(--space-md)' }}><p>Booking — coming soon</p></main>}
      {state.screen === 'confirmation' && <main style={{ padding: 'var(--space-md)' }}><p>Confirmation — coming soon</p></main>}
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
