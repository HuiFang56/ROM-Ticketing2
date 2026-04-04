import { render, screen, fireEvent } from '@testing-library/react'
import { LanguageProvider } from '../../context/LanguageContext'
import Header from './Header'

function Wrapper({ children }) {
  return <LanguageProvider>{children}</LanguageProvider>
}

test('renders ROM wordmark', () => {
  render(<Header />, { wrapper: Wrapper })
  expect(screen.getByText('ROM')).toBeInTheDocument()
})

test('EN button is active by default', () => {
  render(<Header />, { wrapper: Wrapper })
  expect(screen.getByRole('button', { name: 'EN' })).toHaveAttribute('aria-pressed', 'true')
})

test('中 button is not active by default', () => {
  render(<Header />, { wrapper: Wrapper })
  expect(screen.getByRole('button', { name: '中' })).toHaveAttribute('aria-pressed', 'false')
})

test('clicking 中 makes it active', () => {
  render(<Header />, { wrapper: Wrapper })
  fireEvent.click(screen.getByRole('button', { name: '中' }))
  expect(screen.getByRole('button', { name: '中' })).toHaveAttribute('aria-pressed', 'true')
  expect(screen.getByRole('button', { name: 'EN' })).toHaveAttribute('aria-pressed', 'false')
})

test('clicking EN after 中 switches back', () => {
  render(<Header />, { wrapper: Wrapper })
  fireEvent.click(screen.getByRole('button', { name: '中' }))
  fireEvent.click(screen.getByRole('button', { name: 'EN' }))
  expect(screen.getByRole('button', { name: 'EN' })).toHaveAttribute('aria-pressed', 'true')
})
