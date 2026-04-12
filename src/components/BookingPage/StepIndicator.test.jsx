// src/components/BookingPage/StepIndicator.test.jsx
import { render, screen } from '@testing-library/react'
import { StepIndicator } from '../ui'

test('renders 5 step labels', () => {
  render(<StepIndicator currentStep={1} />)
  expect(screen.getByText('DATE')).toBeInTheDocument()
  expect(screen.getByText('TICKETS')).toBeInTheDocument()
  expect(screen.getByText('ADD-ONS')).toBeInTheDocument()
  expect(screen.getByText('CONTACT')).toBeInTheDocument()
  expect(screen.getByText('PAYMENT')).toBeInTheDocument()
})

test('active step has aria-current="step"', () => {
  render(<StepIndicator currentStep={2} />)
  const dots = screen.getAllByRole('listitem')
  expect(dots[1]).toHaveAttribute('aria-current', 'step')
})

test('completed steps show checkmark', () => {
  render(<StepIndicator currentStep={3} />)
  const dots = screen.getAllByRole('listitem')
  expect(dots[0].textContent).toContain('✓')
  expect(dots[1].textContent).toContain('✓')
})

test('pending steps show number', () => {
  render(<StepIndicator currentStep={2} />)
  const dots = screen.getAllByRole('listitem')
  expect(dots[2].textContent).toContain('3')
})

test('has accessible label', () => {
  render(<StepIndicator currentStep={3} />)
  expect(screen.getByRole('list')).toHaveAccessibleName('Step 3 of 5')
})
