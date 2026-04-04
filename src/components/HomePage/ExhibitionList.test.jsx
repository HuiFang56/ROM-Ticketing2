import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import ExhibitionList from './ExhibitionList'
import { LanguageContext } from '../../context/LanguageContext'
import { BookingContext, initialState } from '../../context/BookingContext'

// Two fixture exhibitions: one open (featured), one coming soon (compact row)
const mockExhibitions = [
  {
    id: 'test-open',
    nameEn: 'Open Exhibition',
    nameZh: '开放展览',
    dateRangeEn: 'Jan 1, 2026 – Dec 31, 2026',
    dateRangeZh: '2026年1月1日 – 2026年12月31日',
    imageUrl: 'open.jpg',
    addonPrice: { adult: 8, youth: 6, senior: 5 },
    startDate: '2026-01-01',
    endDate: '2026-12-31',
  },
  {
    id: 'test-soon',
    nameEn: 'Coming Soon Exhibition',
    nameZh: '即将展览',
    dateRangeEn: 'From Jun 2026',
    dateRangeZh: '2026年6月起',
    imageUrl: 'soon.jpg',
    addonPrice: { adult: 10, youth: 8, senior: 7 },
    startDate: '2026-06-01',
    endDate: null,
  },
]

const enT = {
  'special-exhibitions': 'Special Exhibitions',
  'coming-soon': 'Coming Soon',
  'buy-tickets': 'Buy Tickets',
  'plan-visit': 'Plan Your Visit',
  'includes-ga': 'Includes General Admission',
  'add-on': 'Add-on',
  'back': 'Back',
}

const zhT = {
  'special-exhibitions': '特别展览',
  'coming-soon': '即将开展',
  'buy-tickets': '购票',
  'plan-visit': '参观信息',
  'includes-ga': '含通用入场票',
  'add-on': '加购',
  'back': '返回',
}

function renderList({
  lang = 'en',
  dispatch = vi.fn(),
  exhibitions = mockExhibitions,
  todayStr = '2026-04-04',
} = {}) {
  const t = (key) => (lang === 'en' ? enT : zhT)[key] ?? key
  return render(
    <LanguageContext.Provider value={{ lang, setLang: vi.fn(), t }}>
      <BookingContext.Provider value={{ state: initialState, dispatch }}>
        <ExhibitionList exhibitions={exhibitions} todayStr={todayStr} />
      </BookingContext.Provider>
    </LanguageContext.Provider>
  )
}

describe('ExhibitionList', () => {
  it('renders "Special Exhibitions" section label', () => {
    renderList()
    expect(screen.getByText('Special Exhibitions')).toBeInTheDocument()
  })

  it('renders the featured card with the first exhibition name', () => {
    renderList()
    // Name appears overlaid on the image and as img alt — use getAllByText
    expect(screen.getAllByText('Open Exhibition').length).toBeGreaterThan(0)
  })

  it('renders compact row for the second exhibition', () => {
    renderList()
    expect(screen.getByText('Coming Soon Exhibition')).toBeInTheDocument()
  })

  it('shows open badge with adult price for open exhibition', () => {
    renderList()
    expect(screen.getByText(/\+\$8/)).toBeInTheDocument()
  })

  it('shows coming-soon badge for not-yet-open exhibition', () => {
    renderList()
    expect(screen.getByText('Coming Soon')).toBeInTheDocument()
  })

  it('uses nameEn for featured img alt when lang is en', () => {
    renderList({ lang: 'en' })
    expect(screen.getByRole('img', { name: 'Open Exhibition' })).toBeInTheDocument()
  })

  it('uses nameZh for featured img alt when lang is zh', () => {
    renderList({ lang: 'zh' })
    expect(screen.getByRole('img', { name: '开放展览' })).toBeInTheDocument()
  })

  it('renders compact row img with correct alt text', () => {
    renderList({ lang: 'en' })
    expect(screen.getByRole('img', { name: 'Coming Soon Exhibition' })).toBeInTheDocument()
  })

  it('dispatches GO_TO_EXHIBITION with featured exhibition id when featured is clicked', async () => {
    const dispatch = vi.fn()
    renderList({ dispatch })
    const buttons = screen.getAllByRole('button')
    await userEvent.click(buttons[0])
    expect(dispatch).toHaveBeenCalledWith({
      type: 'GO_TO_EXHIBITION',
      exhibitionId: 'test-open',
    })
  })

  it('dispatches GO_TO_EXHIBITION with compact row exhibition id when row is clicked', async () => {
    const dispatch = vi.fn()
    renderList({ dispatch })
    const buttons = screen.getAllByRole('button')
    await userEvent.click(buttons[1])
    expect(dispatch).toHaveBeenCalledWith({
      type: 'GO_TO_EXHIBITION',
      exhibitionId: 'test-soon',
    })
  })
})
