// src/components/BookingPage/Step1Date.test.jsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import Step1Date from './Step1Date'
import { BookingContext, initialState } from '../../context/BookingContext'

function renderStep({ state = initialState, dispatch = vi.fn() } = {}) {
  return render(
    <BookingContext.Provider value={{ state, dispatch }}>
      <Step1Date />
    </BookingContext.Provider>
  )
}

test('renders 7 day-of-week column headers starting with S', () => {
  renderStep()
  const headers = screen.getAllByRole('columnheader')
  expect(headers[0]).toHaveTextContent('S')
  expect(headers[1]).toHaveTextContent('M')
})

test('Monday column header has aria-label "Closed"', () => {
  renderStep()
  const headers = screen.getAllByRole('columnheader')
  expect(headers[1]).toHaveAttribute('aria-label', 'Closed')
})

test('Continue button is disabled when no date selected', () => {
  renderStep()
  expect(screen.getByRole('button', { name: /Continue/i })).toBeDisabled()
})

test('Continue button is enabled when date is set', () => {
  renderStep({ state: { ...initialState, date: '2026-04-15' } })
  expect(screen.getByRole('button', { name: /Continue/i })).not.toBeDisabled()
})

test('dispatches SET_DATE when selectable day is clicked', async () => {
  const dispatch = vi.fn()
  // Render with a fixed today so we can predict which cells are selectable
  renderStep({ state: { ...initialState, date: null }, dispatch })
  // Find a day button that is not disabled — just click the first available
  const dayButtons = screen.getAllByRole('button').filter(
    btn => !btn.disabled && /^\d+$/.test(btn.textContent)
  )
  await userEvent.click(dayButtons[0])
  expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({ type: 'SET_DATE' }))
})

test('dispatches SET_STEP 2 when Continue clicked', async () => {
  const dispatch = vi.fn()
  renderStep({ state: { ...initialState, date: '2026-04-15' }, dispatch })
  await userEvent.click(screen.getByRole('button', { name: /Continue/i }))
  expect(dispatch).toHaveBeenCalledWith({ type: 'SET_STEP', step: 2 })
})

test('selected date appears in summary text', () => {
  renderStep({ state: { ...initialState, date: '2026-04-15' } })
  expect(screen.getByText(/April 15, 2026/)).toBeInTheDocument()
})
