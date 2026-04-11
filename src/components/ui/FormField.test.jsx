import { render, screen } from '@testing-library/react'
import FormField from './FormField'

test('renders label text', () => {
  render(<FormField label="Email"><input /></FormField>)
  expect(screen.getByText('Email')).toBeInTheDocument()
})

test('renders children', () => {
  render(<FormField label="Email"><input data-testid="the-input" /></FormField>)
  expect(screen.getByTestId('the-input')).toBeInTheDocument()
})

test('renders error message when provided', () => {
  render(<FormField label="Email" error="Invalid email"><input /></FormField>)
  expect(screen.getByText('Invalid email')).toBeInTheDocument()
})

test('renders hint text when provided', () => {
  render(<FormField label="Email" hint="We will send tickets here"><input /></FormField>)
  expect(screen.getByText('We will send tickets here')).toBeInTheDocument()
})

test('does not render hint when error is present', () => {
  render(
    <FormField label="Email" error="Bad email" hint="We will send tickets here">
      <input />
    </FormField>
  )
  expect(screen.queryByText('We will send tickets here')).not.toBeInTheDocument()
  expect(screen.getByText('Bad email')).toBeInTheDocument()
})
