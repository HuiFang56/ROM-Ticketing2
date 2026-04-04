# Home Screen Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the ROM home screen — a full-bleed photo hero with CTA and Plan Your Visit, followed by a full-width editorial exhibition list (featured card first, compact rows below).

**Architecture:** Exhibition data lives in `src/data/exhibitions.js` as a plain array with an `isExhibitionOpen()` helper. `HomePage` composes `HeroSection` and `ExhibitionList` as a `<main>` element; `App.jsx` renders it when `state.screen === 'home'`. All components consume `LanguageContext` (for `lang` and `t()`) and `BookingContext` (for `dispatch`) via their exported context objects.

**Tech Stack:** React 19, CSS Modules, Vitest 4 + @testing-library/react 16, `globals: true` in vitest (no need to import `describe`/`it`/`expect`).

---

## File Map

| Action | File | Responsibility |
|--------|------|----------------|
| Create | `src/data/exhibitions.js` | Exhibition array, `localTodayStr()`, `isExhibitionOpen()` |
| Create | `src/data/exhibitions.test.js` | Unit tests for `isExhibitionOpen()` and data shape |
| Modify | `src/context/BookingContext.jsx` | Export `BookingContext` constant (needed for test providers) |
| Modify | `src/context/LanguageContext.jsx` | Export `LanguageContext` constant (needed for test providers) |
| Create | `src/components/HomePage/HeroSection.jsx` | Full-bleed hero section |
| Create | `src/components/HomePage/HeroSection.module.css` | Hero styles |
| Create | `src/components/HomePage/HeroSection.test.jsx` | Hero render + dispatch tests |
| Create | `src/components/HomePage/ExhibitionList.jsx` | Featured + compact card list |
| Create | `src/components/HomePage/ExhibitionList.module.css` | Exhibition list styles |
| Create | `src/components/HomePage/ExhibitionList.test.jsx` | List render + dispatch tests |
| Create | `src/components/HomePage/HomePage.jsx` | Composes HeroSection + ExhibitionList |
| Create | `src/components/HomePage/HomePage.test.jsx` | Smoke test for composition |
| Modify | `src/App.jsx` | Wire up `<HomePage />` for `state.screen === 'home'` |

---

## Task 1: Exhibition Data

**Files:**
- Create: `src/data/exhibitions.test.js`
- Create: `src/data/exhibitions.js`

### Step 1 — Write the failing tests

Create `src/data/exhibitions.test.js`:

```js
import { vi } from 'vitest'
import { isExhibitionOpen, localTodayStr, exhibitions } from './exhibitions'

describe('isExhibitionOpen', () => {
  const openEx    = { startDate: '2025-01-01', endDate: '2027-12-31' }
  const pastEx    = { startDate: '2024-01-01', endDate: '2024-06-01' }
  const comingSoon = { startDate: '2026-06-01', endDate: null }
  const permanent  = { startDate: '2020-01-01', endDate: null }

  it('returns true when today is within date range', () => {
    expect(isExhibitionOpen(openEx, '2026-04-04')).toBe(true)
  })

  it('returns false when today is before startDate', () => {
    expect(isExhibitionOpen(comingSoon, '2026-04-04')).toBe(false)
  })

  it('returns false when today is after endDate', () => {
    expect(isExhibitionOpen(pastEx, '2026-04-04')).toBe(false)
  })

  it('returns true on startDate (inclusive)', () => {
    expect(isExhibitionOpen(openEx, '2025-01-01')).toBe(true)
  })

  it('returns true on endDate (inclusive)', () => {
    expect(isExhibitionOpen(openEx, '2027-12-31')).toBe(true)
  })

  it('returns true for permanent exhibition (endDate null)', () => {
    expect(isExhibitionOpen(permanent, '2026-04-04')).toBe(true)
  })
})

describe('localTodayStr', () => {
  it('returns a string in YYYY-MM-DD format', () => {
    expect(localTodayStr()).toMatch(/^\d{4}-\d{2}-\d{2}$/)
  })
})

describe('exhibitions array', () => {
  it('has 3 exhibitions', () => {
    expect(exhibitions).toHaveLength(3)
  })

  it('first exhibition id is forbidden-city', () => {
    expect(exhibitions[0].id).toBe('forbidden-city')
  })

  it('egypt-pharaohs is coming soon as of 2026-04-04', () => {
    expect(isExhibitionOpen(exhibitions[2], '2026-04-04')).toBe(false)
  })

  it('forbidden-city and trex-revealed are open as of 2026-04-04', () => {
    expect(isExhibitionOpen(exhibitions[0], '2026-04-04')).toBe(true)
    expect(isExhibitionOpen(exhibitions[1], '2026-04-04')).toBe(true)
  })

  it('each exhibition has required fields', () => {
    for (const ex of exhibitions) {
      expect(ex).toHaveProperty('id')
      expect(ex).toHaveProperty('nameEn')
      expect(ex).toHaveProperty('nameZh')
      expect(ex).toHaveProperty('dateRangeEn')
      expect(ex).toHaveProperty('dateRangeZh')
      expect(ex).toHaveProperty('imageUrl')
      expect(ex).toHaveProperty('addonPrice.adult')
      expect(ex).toHaveProperty('addonPrice.youth')
      expect(ex).toHaveProperty('addonPrice.senior')
      expect(ex).toHaveProperty('startDate')
      expect(ex).toHaveProperty('endDate')
    }
  })
})
```

### Step 2 — Run tests to verify they fail

```
npm test
```

Expected: FAIL — "Cannot find module './exhibitions'"

### Step 3 — Create `src/data/exhibitions.js`

```js
export function localTodayStr() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export function isExhibitionOpen(ex, todayStr) {
  if (todayStr < ex.startDate) return false
  if (ex.endDate && todayStr > ex.endDate) return false
  return true
}

export const exhibitions = [
  {
    id: 'forbidden-city',
    nameEn: 'Forbidden City',
    nameZh: '紫禁城',
    dateRangeEn: 'Oct 12, 2025 – Jun 30, 2027',
    dateRangeZh: '2025年10月12日 – 2027年6月30日',
    imageUrl: '',
    addonPrice: { adult: 8, youth: 8, senior: 8 },
    startDate: '2025-10-12',
    endDate: '2027-06-30',
  },
  {
    id: 'trex-revealed',
    nameEn: 'T.Rex Revealed',
    nameZh: '霸王龙大揭秘',
    dateRangeEn: 'Mar 5, 2025 – Mar 31, 2027',
    dateRangeZh: '2025年3月5日 – 2027年3月31日',
    imageUrl: '',
    addonPrice: { adult: 6, youth: 6, senior: 6 },
    startDate: '2025-03-05',
    endDate: '2027-03-31',
  },
  {
    id: 'egypt-pharaohs',
    nameEn: 'Egypt: The Time of Pharaohs',
    nameZh: '古埃及：法老时代',
    dateRangeEn: 'From Jun 1, 2026',
    dateRangeZh: '2026年6月1日起',
    imageUrl: '',
    addonPrice: { adult: 10, youth: 10, senior: 10 },
    startDate: '2026-06-01',
    endDate: null,
  },
]
```

### Step 4 — Run tests to verify they pass

```
npm test
```

Expected: All tests in `src/data/exhibitions.test.js` pass. Other existing tests still pass.

### Step 5 — Commit

```bash
git add src/data/exhibitions.js src/data/exhibitions.test.js
git commit -m "feat: add exhibition data and isExhibitionOpen helper"
```

---

## Task 2: HeroSection

**Files:**
- Modify: `src/context/BookingContext.jsx` (line 63 — export `BookingContext`)
- Modify: `src/context/LanguageContext.jsx` (line 24 — export `LanguageContext`)
- Create: `src/components/HomePage/HeroSection.test.jsx`
- Create: `src/components/HomePage/HeroSection.jsx`
- Create: `src/components/HomePage/HeroSection.module.css`

### Step 1 — Export context objects for testability

In `src/context/BookingContext.jsx`, change line 63:

```js
// Before:
const BookingContext = createContext(null)

// After:
export const BookingContext = createContext(null)
```

In `src/context/LanguageContext.jsx`, change line 24:

```js
// Before:
const LanguageContext = createContext(null)

// After:
export const LanguageContext = createContext(null)
```

### Step 2 — Write the failing tests

Create `src/components/HomePage/HeroSection.test.jsx`:

```jsx
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
```

### Step 3 — Run tests to verify they fail

```
npm test
```

Expected: FAIL — "Cannot find module './HeroSection'"

### Step 4 — Create `src/components/HomePage/HeroSection.jsx`

```jsx
import { useLang } from '../../context/LanguageContext'
import { useBooking } from '../../context/BookingContext'
import styles from './HeroSection.module.css'

const HERO_IMAGE = 'https://images.unsplash.com/photo-1554907984-15263bfd63bd?w=900&q=80'

export default function HeroSection() {
  const { lang, t } = useLang()
  const { dispatch } = useBooking()

  return (
    <section
      className={styles.hero}
      style={{ backgroundImage: `url(${HERO_IMAGE})` }}
    >
      <div className={styles.content}>
        <p className={styles.tagline} aria-hidden="true">
          {t('includes-ga')}
        </p>
        <h1 className={styles.title}>
          {lang === 'zh' ? (
            <>
              皇家安大略博物馆
              <br />
              <span>Royal Ontario Museum</span>
            </>
          ) : (
            <>
              Royal
              <br />
              Ontario
              <br />
              Museum
            </>
          )}
        </h1>
        <button
          className={styles.ctaBtn}
          onClick={() => dispatch({ type: 'GO_TO_BOOKING', exhibitionId: null })}
        >
          {t('buy-tickets')}
        </button>
        <button
          className={styles.planBtn}
          onClick={() => dispatch({ type: 'GO_TO_PLAN_VISIT' })}
        >
          {t('plan-visit')}<span aria-hidden="true"> →</span>
        </button>
      </div>
    </section>
  )
}
```

### Step 5 — Create `src/components/HomePage/HeroSection.module.css`

```css
.hero {
  position: relative;
  height: 62vh;
  min-height: 280px;
  background-size: cover;
  background-position: center;
  background-color: var(--black);
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  overflow: hidden;
}

.hero::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.92) 100%);
}

.content {
  position: relative;
  padding: var(--space-lg) var(--space-md);
}

.tagline {
  font-size: 9px;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: rgba(255,255,255,0.55);
  margin-bottom: var(--space-sm);
}

.title {
  font-size: 32px;
  font-weight: 900;
  color: var(--white);
  line-height: 1;
}

.title span {
  font-size: 16px;
  font-weight: 900;
  display: block;
  margin-top: var(--space-sm);
}

.ctaBtn {
  width: 100%;
  background: var(--black);
  color: var(--white);
  padding: var(--space-md);
  font-size: 15px;
  font-weight: 700;
  font-family: var(--font);
  border-radius: var(--radius);
  margin-top: var(--space-lg);
  display: block;
  text-align: center;
}

.ctaBtn:focus {
  outline: 2px solid var(--white);
  outline-offset: 2px;
}

.planBtn {
  width: 100%;
  background: none;
  color: rgba(255,255,255,0.7);
  font-size: 13px;
  font-weight: 500;
  font-family: var(--font);
  margin-top: var(--space-sm);
  display: block;
  text-align: center;
}

.planBtn:focus {
  outline: 2px solid var(--white);
  outline-offset: 2px;
}
```

### Step 6 — Run tests to verify they pass

```
npm test
```

Expected: All `HeroSection.test.jsx` tests pass. All prior tests still pass.

### Step 7 — Commit

```bash
git add src/context/BookingContext.jsx src/context/LanguageContext.jsx \
        src/components/HomePage/HeroSection.jsx \
        src/components/HomePage/HeroSection.module.css \
        src/components/HomePage/HeroSection.test.jsx
git commit -m "feat: add HeroSection with hero image, CTA, and Plan Your Visit"
```

---

## Task 3: ExhibitionList

**Files:**
- Create: `src/components/HomePage/ExhibitionList.test.jsx`
- Create: `src/components/HomePage/ExhibitionList.jsx`
- Create: `src/components/HomePage/ExhibitionList.module.css`

### Step 1 — Write the failing tests

Create `src/components/HomePage/ExhibitionList.test.jsx`:

```jsx
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
    imageUrl: '',
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
    imageUrl: '',
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
```

### Step 2 — Run tests to verify they fail

```
npm test
```

Expected: FAIL — "Cannot find module './ExhibitionList'"

### Step 3 — Create `src/components/HomePage/ExhibitionList.jsx`

```jsx
import { useLang } from '../../context/LanguageContext'
import { useBooking } from '../../context/BookingContext'
import { isExhibitionOpen, localTodayStr } from '../../data/exhibitions'
import styles from './ExhibitionList.module.css'

export default function ExhibitionList({ exhibitions, todayStr }) {
  const { lang, t } = useLang()
  const { dispatch } = useBooking()
  const today = todayStr ?? localTodayStr()

  const featured = exhibitions[0]
  const rest = exhibitions.slice(1)

  function handleClick(id) {
    dispatch({ type: 'GO_TO_EXHIBITION', exhibitionId: id })
  }

  return (
    <section>
      <p className={styles.label}>{t('special-exhibitions')}</p>

      {/* Featured card */}
      <button className={styles.featured} onClick={() => handleClick(featured.id)}>
        <div className={styles.featuredImgWrapper}>
          <img
            src={featured.imageUrl || undefined}
            alt={lang === 'zh' ? featured.nameZh : featured.nameEn}
            loading="lazy"
            className={styles.featuredImg}
          />
          <div className={styles.featuredGradient} aria-hidden="true" />
          <span className={styles.featuredName}>
            {lang === 'zh' ? featured.nameZh : featured.nameEn}
          </span>
        </div>
        <div className={styles.featuredMeta}>
          <span className={styles.date}>
            {lang === 'zh' ? featured.dateRangeZh : featured.dateRangeEn}
          </span>
          {isExhibitionOpen(featured, today) ? (
            <span className={styles.badgeOpen}>
              Adult +${featured.addonPrice.adult}
            </span>
          ) : (
            <span className={styles.badgeSoon}>{t('coming-soon')}</span>
          )}
        </div>
      </button>

      {/* Compact rows */}
      {rest.map((ex) => (
        <button key={ex.id} className={styles.row} onClick={() => handleClick(ex.id)}>
          <img
            src={ex.imageUrl || undefined}
            alt={lang === 'zh' ? ex.nameZh : ex.nameEn}
            loading="lazy"
            className={styles.rowImg}
          />
          <div className={styles.rowBody}>
            <span className={styles.rowName}>
              {lang === 'zh' ? ex.nameZh : ex.nameEn}
            </span>
            <span className={styles.rowDate}>
              {lang === 'zh' ? ex.dateRangeZh : ex.dateRangeEn}
            </span>
          </div>
          <div className={styles.rowRight}>
            {isExhibitionOpen(ex, today) ? (
              <span className={styles.badgeOpen}>+${ex.addonPrice.adult}</span>
            ) : (
              <span className={styles.badgeSoon}>{t('coming-soon')}</span>
            )}
          </div>
        </button>
      ))}
    </section>
  )
}
```

### Step 4 — Create `src/components/HomePage/ExhibitionList.module.css`

```css
.label {
  font-size: 11px;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: var(--grey-60);
  padding: var(--space-md) var(--space-md) var(--space-sm);
}

/* Featured card */
.featured {
  width: 100%;
  display: block;
  text-align: left;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  font-family: var(--font);
}

.featured:focus {
  outline: 2px solid var(--black);
  outline-offset: 2px;
}

.featuredImgWrapper {
  position: relative;
  width: 100%;
  height: 140px;
  background: var(--grey-05);
  display: block;
  overflow: hidden;
}

.featuredImg {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.featuredGradient {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.85) 100%);
}

.featuredName {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: var(--space-sm) var(--space-md);
  font-weight: 900;
  color: var(--white);
  font-size: 17px;
  line-height: 1.2;
}

.featuredMeta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-sm) var(--space-md);
  border-bottom: 1px solid var(--black);
}

.date {
  font-size: 12px;
  color: var(--grey-60);
}

.badgeOpen {
  background: var(--black);
  color: var(--white);
  font-size: 11px;
  font-weight: 700;
  padding: 2px var(--space-sm);
}

.badgeSoon {
  background: var(--grey-05);
  color: var(--grey-60);
  font-size: 11px;
  font-weight: 700;
  padding: 2px var(--space-sm);
}

/* Compact rows */
.row {
  display: flex;
  width: 100%;
  text-align: left;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  font-family: var(--font);
  align-items: stretch;
  border-bottom: 1px solid var(--grey-05);
}

.row:focus {
  outline: 2px solid var(--black);
  outline-offset: 2px;
}

.rowImg {
  width: 80px;
  height: 64px;
  object-fit: cover;
  flex-shrink: 0;
  display: block;
  background: var(--grey-05);
}

.rowBody {
  flex: 1;
  padding: var(--space-sm) var(--space-md);
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.rowName {
  font-size: 13px;
  font-weight: 700;
  color: var(--black);
  line-height: 1.3;
  display: block;
}

.rowDate {
  font-size: 11px;
  color: var(--grey-60);
  display: block;
}

.rowRight {
  padding: var(--space-sm) var(--space-md) var(--space-sm) 0;
  display: flex;
  align-items: center;
}
```

### Step 5 — Run tests to verify they pass

```
npm test
```

Expected: All `ExhibitionList.test.jsx` tests pass. All prior tests still pass.

### Step 6 — Commit

```bash
git add src/components/HomePage/ExhibitionList.jsx \
        src/components/HomePage/ExhibitionList.module.css \
        src/components/HomePage/ExhibitionList.test.jsx
git commit -m "feat: add ExhibitionList with featured card and compact rows"
```

---

## Task 4: HomePage + Wire Up

**Files:**
- Create: `src/components/HomePage/HomePage.test.jsx`
- Create: `src/components/HomePage/HomePage.jsx`
- Modify: `src/App.jsx` (replace placeholder `state.screen === 'home'` branch)

### Step 1 — Write the failing tests

Create `src/components/HomePage/HomePage.test.jsx`:

```jsx
import { render, screen } from '@testing-library/react'
import { LanguageProvider } from '../../context/LanguageContext'
import { BookingProvider } from '../../context/BookingContext'
import HomePage from './HomePage'

function renderHomePage() {
  return render(
    <LanguageProvider>
      <BookingProvider>
        <HomePage />
      </BookingProvider>
    </LanguageProvider>
  )
}

describe('HomePage', () => {
  it('renders without crashing', () => {
    renderHomePage()
  })

  it('renders the Buy Tickets button from HeroSection', () => {
    renderHomePage()
    expect(screen.getByRole('button', { name: 'Buy Tickets' })).toBeInTheDocument()
  })

  it('renders the Special Exhibitions label from ExhibitionList', () => {
    renderHomePage()
    expect(screen.getByText('Special Exhibitions')).toBeInTheDocument()
  })

  it('renders all 3 exhibitions', () => {
    renderHomePage()
    expect(screen.getByText('Forbidden City')).toBeInTheDocument()
    expect(screen.getByText('T.Rex Revealed')).toBeInTheDocument()
    expect(screen.getByText('Egypt: The Time of Pharaohs')).toBeInTheDocument()
  })

  it('renders as a <main> element', () => {
    renderHomePage()
    expect(screen.getByRole('main')).toBeInTheDocument()
  })
})
```

### Step 2 — Run tests to verify they fail

```
npm test
```

Expected: FAIL — "Cannot find module './HomePage'"

### Step 3 — Create `src/components/HomePage/HomePage.jsx`

```jsx
import HeroSection from './HeroSection'
import ExhibitionList from './ExhibitionList'
import { exhibitions } from '../../data/exhibitions'

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <ExhibitionList exhibitions={exhibitions} />
    </main>
  )
}
```

### Step 4 — Run tests to verify they pass

```
npm test
```

Expected: All `HomePage.test.jsx` tests pass. All prior tests still pass.

### Step 5 — Wire up in App.jsx

In `src/App.jsx`, add the import after the existing imports:

```jsx
import HomePage from './components/HomePage/HomePage'
```

Replace the placeholder home screen branch:

```jsx
// Before:
{state.screen === 'home' && <main style={{ padding: 'var(--space-md)' }}><p>Home — coming soon</p></main>}

// After:
{state.screen === 'home' && <HomePage />}
```

The full updated `src/App.jsx`:

```jsx
import { LanguageProvider } from './context/LanguageContext'
import { BookingProvider, useBooking } from './context/BookingContext'
import Header from './components/Header/Header'
import HomePage from './components/HomePage/HomePage'
import './App.css'

function AppContent() {
  const { state } = useBooking()
  return (
    <div className="app-shell">
      <Header />
      {state.screen === 'home'         && <HomePage />}
      {state.screen === 'exhibition'   && <main style={{ padding: 'var(--space-md)' }}><p>Exhibition — coming soon</p></main>}
      {state.screen === 'plan-visit'   && <main style={{ padding: 'var(--space-md)' }}><p>Plan Your Visit — coming soon</p></main>}
      {state.screen === 'booking'      && <main style={{ padding: 'var(--space-md)' }}><p>Booking — coming soon</p></main>}
      {state.screen === 'confirmation' && <main style={{ padding: 'var(--space-md)' }}><p>Confirmation — coming soon</p></main>}
    </div>
  )
}

export default function App() {
  return (
    <LanguageProvider>
      <BookingProvider>
        <AppContent />
      </BookingProvider>
    </LanguageProvider>
  )
}
```

### Step 6 — Run all tests

```
npm test
```

Expected: All tests pass. Count should be 18 (existing) + 13 (exhibitions) + 8 (HeroSection) + 10 (ExhibitionList) + 5 (HomePage) = 54 tests passing.

### Step 7 — Verify the app renders in the browser

```
npm run dev
```

Open `http://localhost:5173`. You should see:
- ROM header with EN · 中 toggle
- Full-bleed dark hero (ROM exterior photo behind gradient)
- Tagline "Includes General Admission" in small uppercase
- "Royal / Ontario / Museum" in black weight white text
- Full-width "Buy Tickets" button (black bg, white text)
- "Plan Your Visit →" ghost button below
- "SPECIAL EXHIBITIONS" section label
- Forbidden City as featured card (full-width, name overlay, "Adult +$8" badge)
- T.Rex Revealed as compact row (+$6 badge)
- Egypt: The Time of Pharaohs as compact row (Coming Soon badge)

### Step 8 — Commit

```bash
git add src/components/HomePage/HomePage.jsx \
        src/components/HomePage/HomePage.test.jsx \
        src/App.jsx
git commit -m "feat: wire up HomePage — hero + exhibition list on home screen"
```
