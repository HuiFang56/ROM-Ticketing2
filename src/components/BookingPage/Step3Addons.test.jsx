// src/components/BookingPage/Step3Addons.test.jsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import Step3Addons from './Step3Addons'
import { BookingContext, initialState } from '../../context/BookingContext'
import { LanguageContext } from '../../context/LanguageContext'

const t = (k) => k

const stateWithDate = {
  ...initialState,
  date: '2026-04-10',
  tickets: { ...initialState.tickets, adult: 2 },
}

function renderStep({ state = stateWithDate, dispatch = vi.fn() } = {}) {
  return render(
    <LanguageContext.Provider value={{ lang: 'en', setLang: vi.fn(), t }}>
      <BookingContext.Provider value={{ state, dispatch }}>
        <Step3Addons />
      </BookingContext.Provider>
    </LanguageContext.Provider>
  )
}

test('shows only exhibitions open on selected date', () => {
  // Apr 10 2026 — Forbidden City and T.Rex open, Egypt not yet
  renderStep()
  expect(screen.getByText('Forbidden City')).toBeInTheDocument()
  expect(screen.getByText('T.Rex Revealed')).toBeInTheDocument()
  expect(screen.queryByText(/Egypt/)).not.toBeInTheDocument()
})

test('shows ticket-type rows only for types user purchased', () => {
  renderStep()
  // adult × 2 purchased, so adult row should appear; child not purchased
  expect(screen.getAllByText(/Adult × 2/).length).toBeGreaterThan(0)
})

test('pre-fills entry exhibition addon qtys on mount', () => {
  const state = {
    ...stateWithDate,
    entryExhibitionId: 'forbidden-city',
    addons: {},
  }
  const dispatch = vi.fn()
  renderStep({ state, dispatch })
  expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({
    type: 'SET_ADDON',
    exhibitionId: 'forbidden-city',
    ticketType: 'adult',
    qty: 2,
  }))
})

test('+ button dispatches SET_ADDON', async () => {
  const dispatch = vi.fn()
  renderStep({ dispatch })
  const plusBtns = screen.getAllByRole('button', { name: /increase/i })
  await userEvent.click(plusBtns[0])
  expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({ type: 'SET_ADDON' }))
})

test('Back dispatches SET_STEP 2', async () => {
  const dispatch = vi.fn()
  renderStep({ dispatch })
  await userEvent.click(screen.getByRole('button', { name: /Back/i }))
  expect(dispatch).toHaveBeenCalledWith({ type: 'SET_STEP', step: 2 })
})

test('Continue dispatches SET_STEP 4', async () => {
  const dispatch = vi.fn()
  renderStep({ dispatch })
  await userEvent.click(screen.getByRole('button', { name: /Continue/i }))
  expect(dispatch).toHaveBeenCalledWith({ type: 'SET_STEP', step: 4 })
})
