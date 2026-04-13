import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import PlanVisitPage from './PlanVisitPage'
import { LanguageContext } from '../../context/LanguageContext'
import { BookingContext, initialState } from '../../context/BookingContext'

const enT = {
  'back':          'Back',
  'plan-visit':    'Plan Your Visit',
  'book-tickets':  'Book Tickets',
  'hours':         'Hours',
  'location':      'Location',
  'getting-here':  'Getting Here',
  'accessibility': 'Accessibility',
  'open-in-maps':  'Open in Maps',
}

const zhT = {
  'back':          '返回',
  'plan-visit':    '参观信息',
  'book-tickets':  '立即订票',
  'hours':         '开放时间',
  'location':      '地址',
  'getting-here':  '交通指南',
  'accessibility': '无障碍设施',
  'open-in-maps':  '查看地图',
}

function renderPage({
  lang = 'en',
  dispatch = vi.fn(),
} = {}) {
  const t = (key) => (lang === 'en' ? enT : zhT)[key] ?? key
  const state = { ...initialState, screen: 'plan-visit' }
  return render(
    <LanguageContext.Provider value={{ lang, setLang: vi.fn(), t }}>
      <BookingContext.Provider value={{ state, dispatch }}>
        <PlanVisitPage />
      </BookingContext.Provider>
    </LanguageContext.Provider>
  )
}

describe('PlanVisitPage', () => {
  it('renders the page title', () => {
    renderPage()
    expect(screen.getByText('Plan Your Visit')).toBeInTheDocument()
  })

  it('renders the hours section label', () => {
    renderPage()
    expect(screen.getByText('Hours')).toBeInTheDocument()
  })

  it('renders the address text', () => {
    renderPage()
    expect(screen.getByText(/100 Queen's Park/)).toBeInTheDocument()
  })

  it('"← Back" button dispatches GO_HOME', async () => {
    const dispatch = vi.fn()
    renderPage({ dispatch })
    await userEvent.click(screen.getByRole('button', { name: '← Back' }))
    expect(dispatch).toHaveBeenCalledWith({ type: 'GO_HOME' })
  })

  it('"Book Tickets" button dispatches GO_TO_BOOKING with exhibitionId null', async () => {
    const dispatch = vi.fn()
    renderPage({ dispatch })
    await userEvent.click(screen.getByRole('button', { name: 'Book Tickets' }))
    expect(dispatch).toHaveBeenCalledWith({ type: 'GO_TO_BOOKING', exhibitionId: null })
  })

  it('shows Chinese page title when lang is zh', () => {
    renderPage({ lang: 'zh' })
    expect(screen.getByText('参观信息')).toBeInTheDocument()
  })
})
