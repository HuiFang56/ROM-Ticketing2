# Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the design system (tokens, typography, global styles) and app shell (contexts, screen router, header) that every subsequent ROM ticketing feature will mount onto.

**Architecture:** `src/index.css` owns all design tokens and @font-face declarations. Two React contexts (`LanguageContext`, `BookingContext`) provide shared state. `App.jsx` renders a persistent `Header` above a screen router driven by `BookingContext`. Placeholder screen content ships now; real screens are added in later plans.

**Tech Stack:** React 19, Vite 8, Vitest 3, @testing-library/react, CSS Modules, ABC Monument Grotesk (self-hosted OTF)

---

## File Map

| File | Action | Responsibility |
|------|--------|---------------|
| `src/index.css` | Rewrite | @font-face, CSS tokens, global reset |
| `src/App.css` | Clear | Empty — no app-level styles needed |
| `src/App.jsx` | Rewrite | Providers + screen router |
| `src/main.jsx` | Keep | Entry point — no changes |
| `src/test-setup.js` | Create | Vitest + jest-dom bootstrap |
| `vite.config.js` | Modify | Add vitest config |
| `src/context/LanguageContext.jsx` | Create | EN/ZH state + `t()` translations |
| `src/context/BookingContext.jsx` | Create | Screen state machine + reducer |
| `src/components/Header/Header.jsx` | Create | ROM wordmark + language toggle |
| `src/components/Header/Header.module.css` | Create | Header styles |
| `src/context/LanguageContext.test.jsx` | Create | LanguageContext unit tests |
| `src/context/BookingContext.test.js` | Create | BookingContext reducer unit tests |
| `src/components/Header/Header.test.jsx` | Create | Header render + interaction tests |

---

## Task 1: Project cleanup + test setup

**Files:**
- Modify: `vite.config.js`
- Create: `src/test-setup.js`
- Modify: `package.json` (scripts only — via npm)

- [ ] **Step 1: Install test dependencies**

```bash
cd /Users/huifang/side-project-rom/rom-ticketing
npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom
```

Expected: packages install with no errors, `node_modules` updated.

- [ ] **Step 2: Add vitest config to vite.config.js**

Replace the entire file:

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: './src/test-setup.js',
    globals: true,
  },
})
```

- [ ] **Step 3: Create test setup file**

Create `src/test-setup.js`:

```js
import '@testing-library/jest-dom'
```

- [ ] **Step 4: Add test scripts to package.json**

Run:
```bash
npm pkg set scripts.test="vitest run" scripts.test:watch="vitest"
```

- [ ] **Step 5: Write a trivial smoke test to verify setup works**

Create `src/smoke.test.js`:

```js
test('test setup works', () => {
  expect(1 + 1).toBe(2)
})
```

- [ ] **Step 6: Run the test and verify it passes**

```bash
npm test
```

Expected output contains:
```
✓ src/smoke.test.js (1)
  ✓ test setup works
Test Files  1 passed (1)
```

- [ ] **Step 7: Delete the smoke test**

```bash
rm src/smoke.test.js
```

- [ ] **Step 8: Update .gitignore to exclude brainstorm files**

Add to `.gitignore` (create it if it doesn't exist):

```
node_modules
dist
.superpowers/
```

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "chore: add vitest, testing-library, gitignore"
```

---

## Task 2: CSS foundation

**Files:**
- Rewrite: `src/index.css`
- Rewrite: `src/App.css`

- [ ] **Step 1: Rewrite src/index.css**

Replace the entire file with:

```css
/* ── Fonts ─────────────────────────────────────────────── */
@font-face {
  font-family: 'ABCMonumentGrotesk';
  src: url('./assets/fonts/ABCMonumentGrotesk-Regular-Trial.otf') format('opentype');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: 'ABCMonumentGrotesk';
  src: url('./assets/fonts/ABCMonumentGrotesk-Medium-Trial.otf') format('opentype');
  font-weight: 500;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: 'ABCMonumentGrotesk';
  src: url('./assets/fonts/ABCMonumentGrotesk-Bold-Trial.otf') format('opentype');
  font-weight: 700;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: 'ABCMonumentGrotesk';
  src: url('./assets/fonts/ABCMonumentGrotesk-Black-Trial.otf') format('opentype');
  font-weight: 900;
  font-style: normal;
  font-display: swap;
}

/* ── Tokens ─────────────────────────────────────────────── */
:root {
  --black:   #000000;
  --white:   #ffffff;
  --grey-60: #666666;
  --grey-30: #b3b3b3;
  --grey-05: #f5f5f5;

  --font: 'ABCMonumentGrotesk', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;

  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 16px;
  --space-lg: 24px;
  --space-xl: 32px;

  --radius: 0px;
  --max-width: 480px;
}

/* ── Reset ──────────────────────────────────────────────── */
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html, body, #root {
  height: 100%;
}

body {
  font-family: var(--font);
  background: var(--white);
  color: var(--black);
  -webkit-font-smoothing: antialiased;
}

button {
  cursor: pointer;
  border: none;
  background: none;
  font-family: inherit;
}

img {
  display: block;
  max-width: 100%;
}

/* ── App shell ──────────────────────────────────────────── */
.app-shell {
  max-width: var(--max-width);
  margin: 0 auto;
  min-height: 100%;
}
```

- [ ] **Step 2: Clear src/App.css**

Replace the entire file with an empty file (just a comment):

```css
/* App-level styles — intentionally empty. Use CSS Modules per component. */
```

- [ ] **Step 3: Open the browser and verify the font loads**

Start the dev server if it's not running:
```bash
npm run dev
```

Open `http://localhost:5173`. Open DevTools → Network tab, filter by "Font". You should see 4 OTF requests, all with status 200. The page will show the raw Vite scaffold, but styled with the new reset (no margins, white background).

- [ ] **Step 4: Commit**

```bash
git add src/index.css src/App.css
git commit -m "feat: CSS foundation — tokens, @font-face, global reset"
```

---

## Task 3: LanguageContext

**Files:**
- Create: `src/context/LanguageContext.jsx`
- Create: `src/context/LanguageContext.test.jsx`

- [ ] **Step 1: Write the failing tests**

Create `src/context/LanguageContext.test.jsx`:

```jsx
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
```

- [ ] **Step 2: Run tests — verify they fail**

```bash
npm test
```

Expected: 5 tests fail with `Cannot find module './LanguageContext'`.

- [ ] **Step 3: Implement LanguageContext**

Create `src/context/LanguageContext.jsx`:

```jsx
import { createContext, useContext, useState } from 'react'

const translations = {
  en: {
    'buy-tickets':        'Buy Tickets',
    'back':               'Back',
    'plan-visit':         'Plan Your Visit',
    'special-exhibitions':'Special Exhibitions',
    'add-on':             'Add-on',
    'coming-soon':        'Coming Soon',
    'includes-ga':        'Includes General Admission',
  },
  zh: {
    'buy-tickets':        '购票',
    'back':               '返回',
    'plan-visit':         '参观信息',
    'special-exhibitions':'特别展览',
    'add-on':             '加购',
    'coming-soon':        '即将开展',
    'includes-ga':        '含通用入场票',
  },
}

const LanguageContext = createContext(null)

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState('en')
  const t = (key) => translations[lang][key] ?? key
  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLang() {
  return useContext(LanguageContext)
}
```

- [ ] **Step 4: Run tests — verify they pass**

```bash
npm test
```

Expected:
```
✓ src/context/LanguageContext.test.jsx (5)
Test Files  1 passed (1)
```

- [ ] **Step 5: Commit**

```bash
git add src/context/LanguageContext.jsx src/context/LanguageContext.test.jsx
git commit -m "feat: LanguageContext — EN/ZH toggle and t() translations"
```

---

## Task 4: BookingContext

**Files:**
- Create: `src/context/BookingContext.jsx`
- Create: `src/context/BookingContext.test.js`

- [ ] **Step 1: Write the failing tests**

Create `src/context/BookingContext.test.js`:

```js
import { bookingReducer, initialState } from './BookingContext'

test('initial state has screen home', () => {
  expect(initialState.screen).toBe('home')
})

test('GO_TO_BOOKING sets screen to booking', () => {
  const next = bookingReducer(initialState, { type: 'GO_TO_BOOKING', exhibitionId: null })
  expect(next.screen).toBe('booking')
})

test('GO_TO_BOOKING with exhibitionId stores it', () => {
  const next = bookingReducer(initialState, { type: 'GO_TO_BOOKING', exhibitionId: 'forbidden-city' })
  expect(next.screen).toBe('booking')
  expect(next.entryExhibitionId).toBe('forbidden-city')
})

test('GO_HOME resets to initial state', () => {
  const inBooking = bookingReducer(initialState, { type: 'GO_TO_BOOKING', exhibitionId: null })
  const back = bookingReducer(inBooking, { type: 'GO_HOME' })
  expect(back.screen).toBe('home')
  expect(back.entryExhibitionId).toBeNull()
})

test('GO_TO_EXHIBITION sets screen and exhibitionId', () => {
  const next = bookingReducer(initialState, { type: 'GO_TO_EXHIBITION', exhibitionId: 'trex' })
  expect(next.screen).toBe('exhibition')
  expect(next.selectedExhibitionId).toBe('trex')
})

test('GO_TO_PLAN_VISIT sets screen to plan-visit', () => {
  const next = bookingReducer(initialState, { type: 'GO_TO_PLAN_VISIT' })
  expect(next.screen).toBe('plan-visit')
})

test('CONFIRM_ORDER sets screen to confirmation and generates orderId', () => {
  const next = bookingReducer(initialState, { type: 'CONFIRM_ORDER' })
  expect(next.screen).toBe('confirmation')
  expect(next.orderId).toMatch(/^ROM-[A-Z0-9]{6}$/)
})

test('unknown action returns state unchanged', () => {
  const next = bookingReducer(initialState, { type: 'UNKNOWN' })
  expect(next).toEqual(initialState)
})
```

- [ ] **Step 2: Run tests — verify they fail**

```bash
npm test
```

Expected: 8 tests fail with `Cannot find module './BookingContext'`.

- [ ] **Step 3: Implement BookingContext**

Create `src/context/BookingContext.jsx`:

```jsx
import { createContext, useContext, useReducer } from 'react'

export const initialState = {
  screen: 'home',
  selectedExhibitionId: null,
  entryExhibitionId: null,
  step: 1,
  date: null,
  timeSlot: null,
  tickets: { adult: 0, youth: 0, senior: 0, member: 0 },
  addons: {},
  contact: { name: '', email: '', phone: '' },
  paymentMethod: null,
  orderId: null,
}

export function bookingReducer(state, action) {
  switch (action.type) {
    case 'GO_TO_BOOKING':
      return {
        ...initialState,
        screen: 'booking',
        entryExhibitionId: action.exhibitionId ?? null,
      }
    case 'GO_HOME':
      return { ...initialState }
    case 'GO_TO_EXHIBITION':
      return { ...state, screen: 'exhibition', selectedExhibitionId: action.exhibitionId }
    case 'GO_TO_PLAN_VISIT':
      return { ...state, screen: 'plan-visit' }
    case 'CONFIRM_ORDER': {
      const orderId = 'ROM-' + Math.random().toString(36).slice(2, 8).toUpperCase()
      return { ...state, screen: 'confirmation', orderId }
    }
    case 'SET_STEP':
      return { ...state, step: action.step }
    case 'SET_DATE':
      return { ...state, date: action.date }
    case 'SET_TIME_SLOT':
      return { ...state, timeSlot: action.timeSlot }
    case 'SET_TICKET':
      return { ...state, tickets: { ...state.tickets, [action.ticketType]: Math.max(0, action.qty) } }
    case 'SET_ADDON':
      return {
        ...state,
        addons: {
          ...state.addons,
          [action.exhibitionId]: {
            ...(state.addons[action.exhibitionId] ?? { adult: 0, youth: 0, senior: 0, member: 0 }),
            [action.ticketType]: Math.min(Math.max(0, action.qty), state.tickets[action.ticketType]),
          },
        },
      }
    case 'SET_CONTACT':
      return { ...state, contact: { ...state.contact, ...action.fields } }
    case 'SET_PAYMENT_METHOD':
      return { ...state, paymentMethod: action.method }
    default:
      return state
  }
}

const BookingContext = createContext(null)

export function BookingProvider({ children }) {
  const [state, dispatch] = useReducer(bookingReducer, initialState)
  return (
    <BookingContext.Provider value={{ state, dispatch }}>
      {children}
    </BookingContext.Provider>
  )
}

export function useBooking() {
  return useContext(BookingContext)
}
```

- [ ] **Step 4: Run tests — verify they pass**

```bash
npm test
```

Expected:
```
✓ src/context/BookingContext.test.js (8)
✓ src/context/LanguageContext.test.jsx (5)
Test Files  2 passed (2)
```

- [ ] **Step 5: Commit**

```bash
git add src/context/BookingContext.jsx src/context/BookingContext.test.js
git commit -m "feat: BookingContext — screen state machine with reducer"
```

---

## Task 5: App shell + Header

**Files:**
- Create: `src/components/Header/Header.jsx`
- Create: `src/components/Header/Header.module.css`
- Create: `src/components/Header/Header.test.jsx`
- Rewrite: `src/App.jsx`

- [ ] **Step 1: Write the failing Header tests**

Create `src/components/Header/Header.test.jsx`:

```jsx
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
```

- [ ] **Step 2: Run tests — verify they fail**

```bash
npm test
```

Expected: 5 Header tests fail with `Cannot find module './Header'`.

- [ ] **Step 3: Create Header.module.css**

Create `src/components/Header/Header.module.css`:

```css
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px var(--space-md);
  background: var(--white);
  border-bottom: 1px solid var(--black);
}

.logo {
  font-size: 16px;
  font-weight: 900;
  color: var(--black);
  letter-spacing: -0.5px;
}

.langToggle {
  display: flex;
  align-items: center;
  gap: 6px;
}

.langBtn {
  font-size: 13px;
  font-weight: 500;
  color: var(--grey-30);
  font-family: var(--font);
  padding: 0;
}

.langBtn.active {
  color: var(--black);
}

.divider {
  font-size: 13px;
  color: var(--grey-30);
}
```

- [ ] **Step 4: Create Header.jsx**

Create `src/components/Header/Header.jsx`:

```jsx
import { useLang } from '../../context/LanguageContext'
import styles from './Header.module.css'

export default function Header() {
  const { lang, setLang } = useLang()
  return (
    <header className={styles.header}>
      <span className={styles.logo}>ROM</span>
      <div className={styles.langToggle}>
        <button
          className={`${styles.langBtn} ${lang === 'en' ? styles.active : ''}`}
          onClick={() => setLang('en')}
          aria-pressed={lang === 'en'}
        >
          EN
        </button>
        <span className={styles.divider} aria-hidden="true">·</span>
        <button
          className={`${styles.langBtn} ${lang === 'zh' ? styles.active : ''}`}
          onClick={() => setLang('zh')}
          aria-pressed={lang === 'zh'}
        >
          中
        </button>
      </div>
    </header>
  )
}
```

- [ ] **Step 5: Run Header tests — verify they pass**

```bash
npm test
```

Expected:
```
✓ src/components/Header/Header.test.jsx (5)
✓ src/context/BookingContext.test.js (8)
✓ src/context/LanguageContext.test.jsx (5)
Test Files  3 passed (3)
Tests       18 passed (18)
```

- [ ] **Step 6: Rewrite App.jsx**

Replace the entire file:

```jsx
import { LanguageProvider } from './context/LanguageContext'
import { BookingProvider, useBooking } from './context/BookingContext'
import Header from './components/Header/Header'
import './App.css'

function AppContent() {
  const { state } = useBooking()
  return (
    <div className="app-shell">
      <Header />
      {state.screen === 'home'         && <main style={{ padding: 'var(--space-md)' }}><p>Home — coming soon</p></main>}
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

- [ ] **Step 7: Verify in browser**

Open `http://localhost:5173`. You should see:
- Slim header: **ROM** on the left, **EN · 中** on the right, black bottom border
- "Home — coming soon" placeholder below
- Clicking **中** makes it bold/black, EN becomes grey
- Font should be ABC Monument Grotesk (check in DevTools → Computed → font-family)

- [ ] **Step 8: Run all tests one final time**

```bash
npm test
```

Expected:
```
Test Files  3 passed (3)
Tests       18 passed (18)
```

- [ ] **Step 9: Commit**

```bash
git add src/App.jsx src/components/Header/Header.jsx src/components/Header/Header.module.css src/components/Header/Header.test.jsx
git commit -m "feat: app shell and Header — screen router, ROM wordmark, language toggle"
```
