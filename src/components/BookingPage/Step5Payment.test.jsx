// src/components/BookingPage/Step5Payment.test.jsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import Step5Payment from './Step5Payment'
import { BookingContext, initialState } from '../../context/BookingContext'

const stateReady = {
  ...initialState,
  date: '2026-04-10',
  tickets: { ...initialState.tickets, adult: 2 },
  contact: { name: 'Jane', email: 'j@j.com', phone: '' },
}

function renderStep({ state = stateReady, dispatch = vi.fn() } = {}) {
  return render(
    <BookingContext.Provider value={{ state, dispatch }}>
      <Step5Payment />
    </BookingContext.Provider>
  )
}

test('shows WeChat Pay and Alipay buttons', () => {
  renderStep()
  expect(screen.getByRole('button', { name: /WeChat Pay/i })).toBeInTheDocument()
  expect(screen.getByRole('button', { name: /Alipay/i })).toBeInTheDocument()
})

test('shows subtotal, HST, and total', () => {
  renderStep()
  expect(screen.getByText('$54.00')).toBeInTheDocument()   // subtotal
  expect(screen.getByText('HST (7%)')).toBeInTheDocument()
  expect(screen.getByText('$3.78')).toBeInTheDocument()    // 54 * 0.07 = 3.78
  expect(screen.getByText('$57.78')).toBeInTheDocument()   // total
})

test('selecting WeChat Pay dispatches SET_PAYMENT_METHOD', async () => {
  const dispatch = vi.fn()
  renderStep({ dispatch })
  await userEvent.click(screen.getByRole('button', { name: /WeChat Pay/i }))
  expect(dispatch).toHaveBeenCalledWith({ type: 'SET_PAYMENT_METHOD', method: 'wechat' })
})

test('selecting Alipay dispatches SET_PAYMENT_METHOD', async () => {
  const dispatch = vi.fn()
  renderStep({ dispatch })
  await userEvent.click(screen.getByRole('button', { name: /Alipay/i }))
  expect(dispatch).toHaveBeenCalledWith({ type: 'SET_PAYMENT_METHOD', method: 'alipay' })
})

test('confirm button is disabled when no payment method selected', () => {
  renderStep()
  expect(screen.getByRole('button', { name: /Confirm/i })).toBeDisabled()
})

test('confirm button enabled after payment method selected', () => {
  renderStep({ state: { ...stateReady, paymentMethod: 'wechat' } })
  expect(screen.getByRole('button', { name: /Confirm/i })).not.toBeDisabled()
})

test('Confirm dispatches CONFIRM_ORDER', async () => {
  const dispatch = vi.fn()
  renderStep({ state: { ...stateReady, paymentMethod: 'wechat' }, dispatch })
  await userEvent.click(screen.getByRole('button', { name: /Confirm/i }))
  expect(dispatch).toHaveBeenCalledWith({ type: 'CONFIRM_ORDER' })
})

test('Back dispatches SET_STEP 4', async () => {
  const dispatch = vi.fn()
  renderStep({ dispatch })
  await userEvent.click(screen.getByRole('button', { name: /Back/i }))
  expect(dispatch).toHaveBeenCalledWith({ type: 'SET_STEP', step: 4 })
})
