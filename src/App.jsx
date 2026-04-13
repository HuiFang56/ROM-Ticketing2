import { LanguageProvider } from './context/LanguageContext'
import { BookingProvider, useBooking } from './context/BookingContext'
import Header from './components/Header/Header'
import HomePage from './components/HomePage/HomePage'
import ExhibitionPage from './components/ExhibitionPage/ExhibitionPage'
import PlanVisitPage from './components/PlanVisitPage/PlanVisitPage'
import BookingPage from './components/BookingPage/BookingPage'
import ConfirmationPage from './components/ConfirmationPage/ConfirmationPage'
import './App.css'

function AppContent() {
  const { state } = useBooking()
  return (
    <div className="app-shell">
      <Header />
      {state.screen === 'home'         && <HomePage />}
      {state.screen === 'exhibition'   && <ExhibitionPage />}
      {state.screen === 'plan-visit'   && <PlanVisitPage />}
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
