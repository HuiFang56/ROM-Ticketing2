import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import HeroSection from './HeroSection'
import { LanguageContext } from '../../context/LanguageContext'
import { BookingContext, initialState } from '../../context/BookingContext'

const enT = {
  'buy-tickets': 'Buy Tickets',
  'plan-visit': 'Plan Your Visit',
  'includes-ga': 'Includes General Admission',
  'back': 'Back',
  'special-exhibitions': 'Special Exhibitions',
  'add-on': 'Add-on',
  'coming-soon': 'Coming Soon',
}

const zhT = {
  'buy-tickets': '购票',
  'plan-visit': '参观信息',
  'includes-ga': '含通用入场票',
  'back': '返回',
  'special-exhibitions': '特别展览',
  'add-on': '加购',
  'coming-soon': '即将开展',
}

function renderHero({ lang = 'en', dispatch = vi.fn() } = {}) {
  const translations = lang === 'en' ? enT : zhT
  const t = (key) => translations[key] ?? key
  return render(
    <LanguageContext.Provider value={{ lang, setLang: vi.fn(), t }}>
      <BookingContext.Provider value={{ state: initialState, dispatch }}>
        <HeroSection />
      </BookingContext.Provider>
    </LanguageContext.Provider>
  )
}

describe('HeroSection', () => {
  it('renders the tagline with aria-hidden="true"', () => {
    renderHero()
    const tagline = screen.getByText('Includes General Admission')
    expect(tagline).toHaveAttribute('aria-hidden', 'true')
  })

  it('renders EN title with Royal Ontario Museum', () => {
    renderHero({ lang: 'en' })
    const heading = screen.getByRole('heading', { level: 1 })
    expect(heading.textContent).toMatch(/Royal.*Ontario.*Museum/)
  })

  it('renders ZH title with 皇家安大略博物馆 when lang is zh', () => {
    renderHero({ lang: 'zh' })
    const heading = screen.getByRole('heading', { level: 1 })
    expect(heading.textContent).toContain('皇家安大略博物馆')
    expect(heading.textContent).toContain('Royal Ontario Museum')
  })

  it('renders Buy Tickets button', () => {
    renderHero()
    expect(screen.getByRole('button', { name: 'Buy Tickets' })).toBeInTheDocument()
  })

  it('renders Plan Your Visit button', () => {
    renderHero()
    expect(screen.getByRole('button', { name: /Plan Your Visit/ })).toBeInTheDocument()
  })

  it('arrow span in Plan Your Visit has aria-hidden="true"', () => {
    renderHero()
    const arrowSpans = document.querySelectorAll('[aria-hidden="true"]')
    const arrowSpan = Array.from(arrowSpans).find(el => el.textContent.includes('→'))
    expect(arrowSpan).toBeTruthy()
  })

  it('dispatches GO_TO_BOOKING with exhibitionId null when Buy Tickets is clicked', async () => {
    const dispatch = vi.fn()
    renderHero({ dispatch })
    await userEvent.click(screen.getByRole('button', { name: 'Buy Tickets' }))
    expect(dispatch).toHaveBeenCalledWith({ type: 'GO_TO_BOOKING', exhibitionId: null })
  })

  it('dispatches GO_TO_PLAN_VISIT when Plan Your Visit is clicked', async () => {
    const dispatch = vi.fn()
    renderHero({ dispatch })
    await userEvent.click(screen.getByRole('button', { name: /Plan Your Visit/ }))
    expect(dispatch).toHaveBeenCalledWith({ type: 'GO_TO_PLAN_VISIT' })
  })
})
