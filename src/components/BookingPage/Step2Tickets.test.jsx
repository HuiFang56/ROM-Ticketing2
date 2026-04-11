// src/components/BookingPage/Step2Tickets.test.jsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import Step2Tickets from './Step2Tickets'
import { BookingContext, initialState } from '../../context/BookingContext'
import { LanguageContext } from '../../context/LanguageContext'

const t = (k) => k

function renderStep({ state = initialState, dispatch = vi.fn() } = {}) {
  return render(
    <LanguageContext.Provider value={{ lang: 'en', setLang: vi.fn(), t }}>
      <BookingContext.Provider value={{ state, dispatch }}>
        <Step2Tickets />
      </BookingContext.Provider>
    </LanguageContext.Provider>
  )
}

test('renders 5 ticket type rows', () => {
  renderStep()
  expect(screen.getByText('Adult')).toBeInTheDocument()
  expect(screen.getByText('Child')).toBeInTheDocument()
  expect(screen.getByText('Youth')).toBeInTheDocument()
  expect(screen.getByText('Student')).toBeInTheDocument()
  expect(screen.getByText('Senior')).toBeInTheDocument()
})

test('shows price for each ticket type', () => {
  renderStep()
  expect(screen.getByText('$27.00')).toBeInTheDocument()
  expect(screen.getByText('$16.50')).toBeInTheDocument()
})

test('Continue is disabled when all tickets are 0', () => {
  renderStep()
  expect(screen.getByRole('button', { name: /Continue/i })).toBeDisabled()
})

test('Continue is enabled when at least one ticket > 0', () => {
  renderStep({ state: { ...initialState, tickets: { ...initialState.tickets, adult: 1 } } })
  expect(screen.getByRole('button', { name: /Continue/i })).not.toBeDisabled()
})

test('+ button dispatches SET_TICKET with qty + 1', async () => {
  const dispatch = vi.fn()
  renderStep({ dispatch })
  const plusBtns = screen.getAllByRole('button', { name: /increase/i })
  await userEvent.click(plusBtns[0])
  expect(dispatch).toHaveBeenCalledWith({ type: 'SET_TICKET', ticketType: 'adult', qty: 1 })
})

test('− button dispatches SET_TICKET with qty - 1', async () => {
  const dispatch = vi.fn()
  renderStep({
    state: { ...initialState, tickets: { ...initialState.tickets, adult: 2 } },
    dispatch,
  })
  const minusBtns = screen.getAllByRole('button', { name: /decrease/i })
  await userEvent.click(minusBtns[0])
  expect(dispatch).toHaveBeenCalledWith({ type: 'SET_TICKET', ticketType: 'adult', qty: 1 })
})

test('shows subtotal and tax note', () => {
  renderStep({ state: { ...initialState, tickets: { ...initialState.tickets, adult: 2 } } })
  expect(screen.getByText('$54.00')).toBeInTheDocument()
  expect(screen.getByText(/taxes will be added/i)).toBeInTheDocument()
})

test('Back button dispatches SET_STEP 1', async () => {
  const dispatch = vi.fn()
  renderStep({ dispatch })
  await userEvent.click(screen.getByRole('button', { name: /Back/i }))
  expect(dispatch).toHaveBeenCalledWith({ type: 'SET_STEP', step: 1 })
})

test('Continue dispatches SET_STEP 3', async () => {
  const dispatch = vi.fn()
  renderStep({ state: { ...initialState, tickets: { ...initialState.tickets, adult: 1 } }, dispatch })
  await userEvent.click(screen.getByRole('button', { name: /Continue/i }))
  expect(dispatch).toHaveBeenCalledWith({ type: 'SET_STEP', step: 3 })
})
