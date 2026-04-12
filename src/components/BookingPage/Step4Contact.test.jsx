// src/components/BookingPage/Step4Contact.test.jsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import Step4Contact from './Step4Contact'
import { BookingContext, initialState } from '../../context/BookingContext'

function renderStep({ state = initialState, dispatch = vi.fn() } = {}) {
  return render(
    <BookingContext.Provider value={{ state, dispatch }}>
      <Step4Contact />
    </BookingContext.Provider>
  )
}

test('renders name, email and phone fields', () => {
  renderStep()
  expect(screen.getByLabelText(/full name/i)).toBeInTheDocument()
  expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
  expect(screen.getByLabelText(/phone/i)).toBeInTheDocument()
})

test('Continue is disabled when name and email are empty', () => {
  renderStep()
  expect(screen.getByRole('button', { name: /Continue/i })).toBeDisabled()
})

test('Continue is disabled when only name is filled', () => {
  renderStep({ state: { ...initialState, contact: { name: 'Jane', email: '', phone: '' } } })
  expect(screen.getByRole('button', { name: /Continue/i })).toBeDisabled()
})

test('Continue is enabled when name and valid email are filled', () => {
  renderStep({ state: { ...initialState, contact: { name: 'Jane', email: 'j@j.com', phone: '' } } })
  expect(screen.getByRole('button', { name: /Continue/i })).not.toBeDisabled()
})

test('typing in name field dispatches SET_CONTACT', async () => {
  const dispatch = vi.fn()
  renderStep({ dispatch })
  await userEvent.type(screen.getByLabelText(/full name/i), 'Jane')
  expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({
    type: 'SET_CONTACT', fields: expect.objectContaining({ name: expect.any(String) }),
  }))
})

test('shows error on invalid email when Continue clicked', async () => {
  const dispatch = vi.fn()
  renderStep({ state: { ...initialState, contact: { name: 'Jane', email: 'notanemail', phone: '' } }, dispatch })
  await userEvent.click(screen.getByRole('button', { name: /Continue/i }))
  expect(screen.getByText(/valid email/i)).toBeInTheDocument()
  expect(dispatch).not.toHaveBeenCalledWith({ type: 'SET_STEP', step: 5 })
})

test('valid form dispatches SET_STEP 5', async () => {
  const dispatch = vi.fn()
  renderStep({ state: { ...initialState, contact: { name: 'Jane', email: 'j@j.com', phone: '' } }, dispatch })
  await userEvent.click(screen.getByRole('button', { name: /Continue/i }))
  expect(dispatch).toHaveBeenCalledWith({ type: 'SET_STEP', step: 5 })
})

test('Back dispatches SET_STEP 3', async () => {
  const dispatch = vi.fn()
  renderStep({ dispatch })
  await userEvent.click(screen.getByRole('button', { name: /Back/i }))
  expect(dispatch).toHaveBeenCalledWith({ type: 'SET_STEP', step: 3 })
})
