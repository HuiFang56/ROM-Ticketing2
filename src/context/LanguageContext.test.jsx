import { render, screen, fireEvent } from '@testing-library/react'
import { LanguageProvider, useLang } from './LanguageContext'

function LangDisplay() {
  const { lang, setLang, t } = useLang()
  return (
    <div>
      <span data-testid="lang">{lang}</span>
      <span data-testid="label">{t('buy-tickets')}</span>
      <button onClick={() => setLang('zh')}>switch-zh</button>
      <button onClick={() => setLang('en')}>switch-en</button>
    </div>
  )
}

function Wrapper({ children }) {
  return <LanguageProvider>{children}</LanguageProvider>
}

test('default language is en', () => {
  render(<LangDisplay />, { wrapper: Wrapper })
  expect(screen.getByTestId('lang').textContent).toBe('en')
})

test('t() returns English string by default', () => {
  render(<LangDisplay />, { wrapper: Wrapper })
  expect(screen.getByTestId('label').textContent).toBe('Buy Tickets')
})

test('setLang switches to zh', () => {
  render(<LangDisplay />, { wrapper: Wrapper })
  fireEvent.click(screen.getByText('switch-zh'))
  expect(screen.getByTestId('lang').textContent).toBe('zh')
})

test('t() returns Chinese string after switching to zh', () => {
  render(<LangDisplay />, { wrapper: Wrapper })
  fireEvent.click(screen.getByText('switch-zh'))
  expect(screen.getByTestId('label').textContent).toBe('购票')
})

test('setLang switches back to en', () => {
  render(<LangDisplay />, { wrapper: Wrapper })
  fireEvent.click(screen.getByText('switch-zh'))
  fireEvent.click(screen.getByText('switch-en'))
  expect(screen.getByTestId('lang').textContent).toBe('en')
})
