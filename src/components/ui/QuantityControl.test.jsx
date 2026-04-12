import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import QuantityControl from './QuantityControl'

test('displays the current value', () => {
  render(<QuantityControl value={3} onChange={() => {}} ariaLabel="Adult" />)
  expect(screen.getByText('3')).toBeInTheDocument()
})

test('calls onChange with value + 1 when + clicked', async () => {
  const onChange = vi.fn()
  render(<QuantityControl value={2} onChange={onChange} ariaLabel="Adult" />)
  await userEvent.click(screen.getByRole('button', { name: 'Increase Adult' }))
  expect(onChange).toHaveBeenCalledWith(3)
})

test('calls onChange with value − 1 when − clicked', async () => {
  const onChange = vi.fn()
  render(<QuantityControl value={2} onChange={onChange} ariaLabel="Adult" />)
  await userEvent.click(screen.getByRole('button', { name: 'Decrease Adult' }))
  expect(onChange).toHaveBeenCalledWith(1)
})

test('− button is disabled when value equals min', () => {
  render(<QuantityControl value={0} onChange={() => {}} ariaLabel="Adult" min={0} />)
  expect(screen.getByRole('button', { name: 'Decrease Adult' })).toBeDisabled()
})

test('+ button is disabled when value equals max', () => {
  render(<QuantityControl value={3} onChange={() => {}} ariaLabel="Adult" max={3} />)
  expect(screen.getByRole('button', { name: 'Increase Adult' })).toBeDisabled()
})

test('− button is enabled when value is above min', () => {
  render(<QuantityControl value={1} onChange={() => {}} ariaLabel="Adult" min={0} />)
  expect(screen.getByRole('button', { name: 'Decrease Adult' })).not.toBeDisabled()
})

test('+ button is enabled when value is below max', () => {
  render(<QuantityControl value={2} onChange={() => {}} ariaLabel="Adult" max={3} />)
  expect(screen.getByRole('button', { name: 'Increase Adult' })).not.toBeDisabled()
})
