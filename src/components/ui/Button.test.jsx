import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import Button from './Button'

test('renders children', () => {
  render(<Button>Click me</Button>)
  expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument()
})

test('calls onClick when clicked', async () => {
  const onClick = vi.fn()
  render(<Button onClick={onClick}>Click me</Button>)
  await userEvent.click(screen.getByRole('button'))
  expect(onClick).toHaveBeenCalledTimes(1)
})

test('does not call onClick when disabled', async () => {
  const onClick = vi.fn()
  render(<Button disabled onClick={onClick}>Click me</Button>)
  await userEvent.click(screen.getByRole('button'))
  expect(onClick).not.toHaveBeenCalled()
})

test('is disabled when disabled prop is true', () => {
  render(<Button disabled>Click me</Button>)
  expect(screen.getByRole('button')).toBeDisabled()
})

test('defaults to type=button', () => {
  render(<Button>Click me</Button>)
  expect(screen.getByRole('button')).toHaveAttribute('type', 'button')
})
