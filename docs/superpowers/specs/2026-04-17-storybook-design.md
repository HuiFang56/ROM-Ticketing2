# Storybook Design

## Goal

Set up Storybook 8 for the ROM ticketing app with stories for all 6 shared UI components and all 5 page-level components. Purpose: visual development + component documentation.

## Architecture

**Storybook 8 + `@storybook/react-vite`** — native Vite support, no webpack config needed.

**Addons:**
- `@storybook/addon-essentials` — Controls (interactive props), Viewport (480px default), Docs (auto-generated)
- `@storybook/addon-a11y` — WCAG audit panel per story
- `@storybook/addon-pseudo-states` — force `:hover`, `:active`, `:focus-visible` states via toolbar

**Stories format:** CSF3 (Component Story Format 3), collocated alongside each component.

**Context for page stories:** Shared decorator in `src/stories/decorators.jsx`, reused across all 5 page story files.

---

## New Files

| File | Purpose |
|------|---------|
| `.storybook/main.js` | Framework, addon registration, story glob |
| `.storybook/preview.js` | Global CSS import, default viewport, global decorator |
| `src/stories/decorators.jsx` | `withMockContexts(lang, state)` helper |
| `src/components/ui/Button.stories.jsx` | 3 stories: primary, secondary, text |
| `src/components/ui/Badge.stories.jsx` | 2 stories: open, comingSoon |
| `src/components/ui/SectionLabel.stories.jsx` | 1 story: default |
| `src/components/ui/StepIndicator.stories.jsx` | 3 stories: first, middle, last |
| `src/components/ui/FormField.stories.jsx` | 2 stories: default, withError |
| `src/components/ui/QuantityControl.stories.jsx` | 2 stories: atZero, nonZero |
| `src/components/HomePage/HomePage.stories.jsx` | 2 stories: en, zh |
| `src/components/ExhibitionPage/ExhibitionPage.stories.jsx` | 2 stories: open, comingSoon |
| `src/components/PlanVisitPage/PlanVisitPage.stories.jsx` | 2 stories: en, zh |
| `src/components/BookingPage/BookingPage.stories.jsx` | 5 stories: step1–step5 |
| `src/components/ConfirmationPage/ConfirmationPage.stories.jsx` | 1 story: default |

## Modified Files

| File | Change |
|------|--------|
| `src/components/ui/Button.module.css` | Add `:hover` and `:active` styles |
| `package.json` | Add storybook devDependencies + `storybook` / `build-storybook` scripts |

---

## Config Files

### `.storybook/main.js`

```js
/** @type { import('@storybook/react-vite').StorybookConfig } */
const config = {
  stories: ['../src/**/*.stories.jsx'],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-a11y',
    '@storybook/addon-pseudo-states',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
}
export default config
```

### `.storybook/preview.js`

```js
import '../src/index.css'

/** @type { import('@storybook/react').Preview } */
const preview = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile',
      viewports: {
        mobile: {
          name: 'Mobile (480px)',
          styles: { width: '480px', height: '900px' },
        },
        desktop: {
          name: 'Desktop',
          styles: { width: '1280px', height: '800px' },
        },
      },
    },
    controls: { matchers: { color: /(color)$/i } },
  },
}
export default preview
```

Note: No global context decorator here — page stories each apply `withMockContexts` explicitly so it's clear what context each page needs. UI component stories need no context.

---

## Button Hover/Active CSS

Add to `src/components/ui/Button.module.css`:

```css
.btn:hover:not(:disabled) {
  opacity: 0.85;
}

.btn:active:not(:disabled) {
  opacity: 0.7;
}
```

These rules apply to all three variants (primary, secondary, text) uniformly. The existing `transition: opacity 0.15s` already covers the animation.

---

## Shared Decorator

### `src/stories/decorators.jsx`

```jsx
import { LanguageContext } from '../context/LanguageContext'
import { BookingContext } from '../context/BookingContext'
import { fn } from '@storybook/test'
import { translations } from '../context/LanguageContext'

function mockLang(lang) {
  return {
    lang,
    setLang: fn(),
    t: (key) => translations[lang]?.[key] ?? key,
  }
}

export function withMockContexts(lang = 'en', state) {
  return (Story) => (
    <LanguageContext.Provider value={mockLang(lang)}>
      <BookingContext.Provider value={{ state, dispatch: fn() }}>
        <div style={{ maxWidth: '480px', margin: '0 auto', minHeight: '100vh' }}>
          <Story />
        </div>
      </BookingContext.Provider>
    </LanguageContext.Provider>
  )
}
```

Note: `translations` must be exported from `LanguageContext.jsx` (currently it is a `const` — add `export` keyword).

---

## UI Component Stories

### `Button.stories.jsx`

```jsx
import Button from './Button'

export default { component: Button }

export const Primary = { args: { children: 'Buy Tickets', variant: 'primary' } }
export const Secondary = { args: { children: 'Go Back', variant: 'secondary' } }
export const Text = { args: { children: 'Skip', variant: 'text' } }
```

All three stories: use the pseudo-states toolbar to see `:hover`, `:active`, `:focus-visible`, and `disabled` states.

### `Badge.stories.jsx`

```jsx
import Badge from './Badge'

export default { component: Badge }

export const Open = { args: { variant: 'open', children: 'Open' } }
export const ComingSoon = { args: { variant: 'coming-soon', children: 'Coming Soon' } }
```

### `SectionLabel.stories.jsx`

```jsx
import SectionLabel from './SectionLabel'

export default { component: SectionLabel }

export const Default = { args: { children: 'Exhibitions' } }
```

### `StepIndicator.stories.jsx`

`StepIndicator` always has 5 steps. The only prop is `currentStep`.

```jsx
import StepIndicator from './StepIndicator'

export default { component: StepIndicator }

export const First  = { args: { currentStep: 1 } }
export const Middle = { args: { currentStep: 3 } }
export const Last   = { args: { currentStep: 5 } }
```

### `FormField.stories.jsx`

`FormField` is a label wrapper — it accepts `children` (the actual `<input>`). Use `render` functions:

```jsx
import { useState } from 'react'
import FormField from './FormField'

export default { component: FormField }

export const Default = {
  render: () => {
    const [val, setVal] = useState('')
    return (
      <FormField label="Email" htmlFor="email-default">
        <input id="email-default" type="email" value={val} onChange={e => setVal(e.target.value)} />
      </FormField>
    )
  },
}

export const WithError = {
  render: () => {
    const [val, setVal] = useState('notanemail')
    return (
      <FormField label="Email" htmlFor="email-error" error="Enter a valid email address">
        <input id="email-error" type="email" value={val} onChange={e => setVal(e.target.value)} />
      </FormField>
    )
  },
}
```

### `QuantityControl.stories.jsx`

`QuantityControl` is stateful and requires `ariaLabel`. Use `render` functions:

```jsx
import { useState } from 'react'
import QuantityControl from './QuantityControl'

export default { component: QuantityControl }

export const AtZero = {
  render: () => {
    const [qty, setQty] = useState(0)
    return <QuantityControl value={qty} onChange={setQty} min={0} max={10} ariaLabel="Adult tickets" />
  },
}

export const NonZero = {
  render: () => {
    const [qty, setQty] = useState(3)
    return <QuantityControl value={qty} onChange={setQty} min={0} max={10} ariaLabel="Adult tickets" />
  },
}
```

---

## Page Stories

All page stories wrap with `withMockContexts`. The `dispatch` is always `fn()` — logs to the Actions panel but does nothing.

### Mock state values

**Exhibitions used in stories:**
- Open: `'forbidden-city'` (startDate 2025-10-12, currently open)
- Coming soon: `'egypt-pharaohs'` (startDate 2026-06-01, not open yet)

### `HomePage.stories.jsx`

```jsx
import { fn } from '@storybook/test'
import { initialState } from '../../context/BookingContext'
import { withMockContexts } from '../../stories/decorators'
import HomePage from './HomePage'

const homeState = { ...initialState, screen: 'home' }

export default {
  component: HomePage,
  decorators: [withMockContexts('en', homeState)],
}

export const En = {}
export const Zh = { decorators: [withMockContexts('zh', homeState)] }
```

### `ExhibitionPage.stories.jsx`

```jsx
import { initialState } from '../../context/BookingContext'
import { withMockContexts } from '../../stories/decorators'
import ExhibitionPage from './ExhibitionPage'

export default { component: ExhibitionPage }

export const Open = {
  decorators: [withMockContexts('en', {
    ...initialState,
    screen: 'exhibition',
    selectedExhibitionId: 'forbidden-city',
  })],
}

export const ComingSoon = {
  decorators: [withMockContexts('en', {
    ...initialState,
    screen: 'exhibition',
    selectedExhibitionId: 'egypt-pharaohs',
  })],
}
```

### `PlanVisitPage.stories.jsx`

```jsx
import { initialState } from '../../context/BookingContext'
import { withMockContexts } from '../../stories/decorators'
import PlanVisitPage from './PlanVisitPage'

const planState = { ...initialState, screen: 'plan-visit' }

export default { component: PlanVisitPage }

export const En = { decorators: [withMockContexts('en', planState)] }
export const Zh = { decorators: [withMockContexts('zh', planState)] }
```

### `BookingPage.stories.jsx`

```jsx
import { initialState } from '../../context/BookingContext'
import { withMockContexts } from '../../stories/decorators'
import BookingPage from './BookingPage'

const base = {
  ...initialState,
  screen: 'booking',
  entryExhibitionId: 'forbidden-city',
}

export default { component: BookingPage }

export const Step1 = {
  decorators: [withMockContexts('en', { ...base, step: 1 })],
}

export const Step2 = {
  decorators: [withMockContexts('en', { ...base, step: 2, date: '2026-05-10' })],
}

export const Step3 = {
  decorators: [withMockContexts('en', {
    ...base,
    step: 3,
    date: '2026-05-10',
    tickets: { adult: 2, child: 1, youth: 0, student: 0, senior: 0 },
  })],
}

export const Step4 = {
  decorators: [withMockContexts('en', {
    ...base,
    step: 4,
    date: '2026-05-10',
    tickets: { adult: 2, child: 1, youth: 0, student: 0, senior: 0 },
    addons: { 'trex-revealed': { adult: 1, child: 0, youth: 0, student: 0, senior: 0 } },
  })],
}

export const Step5 = {
  decorators: [withMockContexts('en', {
    ...base,
    step: 5,
    date: '2026-05-10',
    tickets: { adult: 2, child: 1, youth: 0, student: 0, senior: 0 },
    addons: {},
    contact: { name: 'Alice Chen', email: 'alice@example.com', phone: '416-555-0100' },
  })],
}
```

### `ConfirmationPage.stories.jsx`

```jsx
import { initialState } from '../../context/BookingContext'
import { withMockContexts } from '../../stories/decorators'
import ConfirmationPage from './ConfirmationPage'

export default { component: ConfirmationPage }

export const Default = {
  decorators: [withMockContexts('en', {
    ...initialState,
    screen: 'confirmation',
    orderId: 'ROM-AB12CD',
    date: '2026-05-10',
    tickets: { adult: 2, child: 1, youth: 0, student: 0, senior: 0 },
    contact: { name: 'Alice Chen', email: 'alice@example.com', phone: '' },
    entryExhibitionId: 'forbidden-city',
  })],
}
```

---

## Package Changes

### `package.json` — add to `devDependencies`:

```json
"storybook": "^8.6.0",
"@storybook/react-vite": "^8.6.0",
"@storybook/addon-essentials": "^8.6.0",
"@storybook/addon-a11y": "^8.6.0",
"@storybook/addon-pseudo-states": "^4.0.0"
```

### `package.json` — add to `scripts`:

```json
"storybook": "storybook dev -p 6006",
"build-storybook": "storybook build"
```

---

## `LanguageContext.jsx` — export `translations`

The `withMockContexts` decorator needs access to the `translations` object to build the `t()` function. Currently `translations` is `const` (not exported). Add `export`:

```js
export const translations = {
  en: { ... },
  zh: { ... },
}
```

---

## Testing

No new Vitest tests needed — stories are not unit tests. The existing 151 tests continue to cover component behaviour.

Visual verification: run `npm run storybook` and manually check each story at 480px viewport width.

A11y verification: open each story and check the Accessibility panel for violations. Expect a potential flag on `--grey-30` borders (contrast 2.0:1 against white, below WCAG 3:1 for UI components) — this is a known design system gap to address in a future pass.
