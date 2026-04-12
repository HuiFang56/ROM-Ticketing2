// src/components/ConfirmationPage/ConfirmationPage.test.jsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import ConfirmationPage from './ConfirmationPage'
import { BookingContext, initialState } from '../../context/BookingContext'

const confirmedState = {
  ...initialState,
  screen: 'confirmation',
  orderId: 'ROM-A3F9C2',
  date: '2026-04-10',
  tickets: { ...initialState.tickets, adult: 2 },
  contact: { name: 'Jane', email: 'jane@example.com', phone: '' },
}

function renderPage({ state = confirmedState, dispatch = vi.fn() } = {}) {
  return render(
    <BookingContext.Provider value={{ state, dispatch }}>
      <ConfirmationPage />
    </BookingContext.Provider>
  )
}

test('shows order id', () => {
  renderPage()
  expect(screen.getByText(/ROM-A3F9C2/)).toBeInTheDocument()
})

test('shows confirmation email', () => {
  renderPage()
  expect(screen.getByText(/jane@example.com/)).toBeInTheDocument()
})

test('shows HST and total', () => {
  renderPage()
  expect(screen.getByText('HST (7%)')).toBeInTheDocument()
  // 2 adults × $27 = $54, HST = $3.78, total = $57.78
  expect(screen.getByText('$3.78')).toBeInTheDocument()
  expect(screen.getByText('$57.78')).toBeInTheDocument()
})

test('Back to Home dispatches GO_HOME', async () => {
  const dispatch = vi.fn()
  renderPage({ dispatch })
  await userEvent.click(screen.getByRole('button', { name: /back to home/i }))
  expect(dispatch).toHaveBeenCalledWith({ type: 'GO_HOME' })
})
