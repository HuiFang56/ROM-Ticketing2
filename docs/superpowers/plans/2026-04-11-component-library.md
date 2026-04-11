# Component Library Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Extract 6 shared UI components into `src/components/ui/` and migrate all existing callers to use them.

**Architecture:** Flat folder — one `.jsx` + one `.module.css` per component, all re-exported from a barrel `index.js`. Components use only the existing design tokens (`--black`, `--white`, `--grey-60`, `--grey-30`, `--grey-05`, `--radius`, `--font`). Callers import from `../ui`.

**Tech Stack:** React 19, Vite, CSS Modules, Vitest, @testing-library/react, @testing-library/user-event

**Working directory:** All file paths are relative to `.worktrees/feature/booking-flow/`. Run all commands from inside that directory: `cd .worktrees/feature/booking-flow`

---

## File Map

**Created:**
- `src/components/ui/QuantityControl.jsx` + `.module.css` + `.test.jsx`
- `src/components/ui/FormField.jsx` + `.module.css` + `.test.jsx`
- `src/components/ui/Button.jsx` + `.module.css` + `.test.jsx`
- `src/components/ui/Badge.jsx` + `.module.css`
- `src/components/ui/SectionLabel.jsx` + `.module.css`
- `src/components/ui/StepIndicator.jsx` + `.module.css`
- `src/components/ui/index.js`

**Modified:**
- `src/components/BookingPage/Step1Date.jsx` — use Button
- `src/components/BookingPage/Step1Date.module.css` — remove color/bg from continueBtn
- `src/components/BookingPage/Step2Tickets.jsx` — use QuantityControl + Button
- `src/components/BookingPage/Step2Tickets.module.css` — remove inline stepper classes + btn color/bg
- `src/components/BookingPage/Step3Addons.jsx` — use QuantityControl + Button
- `src/components/BookingPage/Step3Addons.module.css` — remove inline stepper classes + btn color/bg
- `src/components/BookingPage/Step4Contact.jsx` — use FormField + Button
- `src/components/BookingPage/Step4Contact.module.css` — remove field/label/input/error classes + btn color/bg
- `src/components/BookingPage/Step5Payment.jsx` — use SectionLabel + Button
- `src/components/BookingPage/Step5Payment.module.css` — remove methodLabel class + btn color/bg
- `src/components/BookingPage/BookingPage.jsx` — update StepIndicator import path
- `src/components/BookingPage/StepIndicator.jsx` — DELETE (moved to ui/)
- `src/components/BookingPage/StepIndicator.module.css` — DELETE (moved to ui/)
- `src/components/ConfirmationPage/ConfirmationPage.jsx` — use Button
- `src/components/ConfirmationPage/ConfirmationPage.module.css` — remove homeBtn color/bg
- `src/components/HomePage/ExhibitionList.jsx` — use Badge + SectionLabel
- `src/components/HomePage/ExhibitionList.module.css` — remove label/badge classes
- `src/components/HomePage/HeroSection.jsx` — use Button
- `src/components/HomePage/HeroSection.module.css` — remove ctaBtn/planBtn color/bg

---

### Task 1: QuantityControl

**Files:**
- Create: `src/components/ui/QuantityControl.jsx`
- Create: `src/components/ui/QuantityControl.module.css`
- Create: `src/components/ui/QuantityControl.test.jsx`
- Create: `src/components/ui/index.js`

- [ ] **Step 1: Write the failing test**

```jsx
// src/components/ui/QuantityControl.test.jsx
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
```

- [ ] **Step 2: Run test — verify it fails**

```bash
npm test -- QuantityControl
```

Expected: FAIL — `QuantityControl` cannot be resolved.

- [ ] **Step 3: Create the component**

```jsx
// src/components/ui/QuantityControl.jsx
import styles from './QuantityControl.module.css'

export default function QuantityControl({ value, onChange, min = 0, max, ariaLabel }) {
  return (
    <div className={styles.controls}>
      <button
        className={styles.btn}
        aria-label={`Decrease ${ariaLabel}`}
        disabled={value <= min}
        onClick={() => onChange(Math.max(min, value - 1))}
      >−</button>
      <span className={styles.value}>{value}</span>
      <button
        className={styles.btn}
        aria-label={`Increase ${ariaLabel}`}
        disabled={max !== undefined && value >= max}
        onClick={() => onChange(max !== undefined ? Math.min(max, value + 1) : value + 1)}
      >+</button>
    </div>
  )
}
```

```css
/* src/components/ui/QuantityControl.module.css */
.controls {
  display: flex;
  align-items: center;
  gap: 10px;
}

.btn {
  width: 28px;
  height: 28px;
  border: 1px solid var(--grey-30);
  background: var(--white);
  color: var(--black);
  font-size: 18px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font);
}

.btn:disabled {
  opacity: 0.3;
  cursor: default;
}

.value {
  font-size: 16px;
  font-weight: 600;
  min-width: 20px;
  text-align: center;
}
```

- [ ] **Step 4: Create the barrel**

```js
// src/components/ui/index.js
export { default as QuantityControl } from './QuantityControl'
```

- [ ] **Step 5: Run test — verify it passes**

```bash
npm test -- QuantityControl
```

Expected: 7 tests passing.

- [ ] **Step 6: Commit**

```bash
git add src/components/ui/QuantityControl.jsx src/components/ui/QuantityControl.module.css src/components/ui/QuantityControl.test.jsx src/components/ui/index.js
git commit -m "feat: add QuantityControl shared component"
```

---

### Task 2: FormField

**Files:**
- Create: `src/components/ui/FormField.jsx`
- Create: `src/components/ui/FormField.module.css`
- Create: `src/components/ui/FormField.test.jsx`
- Modify: `src/components/ui/index.js`

- [ ] **Step 1: Write the failing test**

```jsx
// src/components/ui/FormField.test.jsx
import { render, screen } from '@testing-library/react'
import FormField from './FormField'

test('renders label text', () => {
  render(<FormField label="Email"><input /></FormField>)
  expect(screen.getByText('Email')).toBeInTheDocument()
})

test('renders children', () => {
  render(<FormField label="Email"><input data-testid="the-input" /></FormField>)
  expect(screen.getByTestId('the-input')).toBeInTheDocument()
})

test('renders error message when provided', () => {
  render(<FormField label="Email" error="Invalid email"><input /></FormField>)
  expect(screen.getByText('Invalid email')).toBeInTheDocument()
})

test('renders hint text when provided', () => {
  render(<FormField label="Email" hint="We will send tickets here"><input /></FormField>)
  expect(screen.getByText('We will send tickets here')).toBeInTheDocument()
})

test('does not render hint when error is present', () => {
  render(
    <FormField label="Email" error="Bad email" hint="We will send tickets here">
      <input />
    </FormField>
  )
  expect(screen.queryByText('We will send tickets here')).not.toBeInTheDocument()
  expect(screen.getByText('Bad email')).toBeInTheDocument()
})
```

- [ ] **Step 2: Run test — verify it fails**

```bash
npm test -- FormField
```

Expected: FAIL — `FormField` cannot be resolved.

- [ ] **Step 3: Create the component**

```jsx
// src/components/ui/FormField.jsx
import styles from './FormField.module.css'

export default function FormField({ label, error, hint, children }) {
  return (
    <div className={styles.field}>
      <label className={styles.label}>{label}</label>
      {children}
      {error
        ? <p className={styles.error}>{error}</p>
        : hint
          ? <p className={styles.hint}>{hint}</p>
          : null}
    </div>
  )
}
```

```css
/* src/components/ui/FormField.module.css */
.field {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.label {
  font-size: 13px;
  font-weight: 600;
  color: var(--black);
}

.hint {
  font-size: 12px;
  color: var(--grey-60);
  margin: 0;
}

.error {
  font-size: 12px;
  color: #c00000;
  margin: 0;
}
```

- [ ] **Step 4: Add to barrel**

```js
// src/components/ui/index.js
export { default as QuantityControl } from './QuantityControl'
export { default as FormField } from './FormField'
```

- [ ] **Step 5: Run test — verify it passes**

```bash
npm test -- FormField
```

Expected: 5 tests passing.

- [ ] **Step 6: Commit**

```bash
git add src/components/ui/FormField.jsx src/components/ui/FormField.module.css src/components/ui/FormField.test.jsx src/components/ui/index.js
git commit -m "feat: add FormField shared component"
```

---

### Task 3: Button

**Files:**
- Create: `src/components/ui/Button.jsx`
- Create: `src/components/ui/Button.module.css`
- Create: `src/components/ui/Button.test.jsx`
- Modify: `src/components/ui/index.js`

- [ ] **Step 1: Write the failing test**

```jsx
// src/components/ui/Button.test.jsx
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
```

- [ ] **Step 2: Run test — verify it fails**

```bash
npm test -- Button
```

Expected: FAIL — `Button` cannot be resolved.

- [ ] **Step 3: Create the component**

```jsx
// src/components/ui/Button.jsx
import styles from './Button.module.css'

export default function Button({
  variant = 'primary',
  onClick,
  disabled,
  type = 'button',
  className,
  children,
}) {
  return (
    <button
      type={type}
      className={[styles.btn, styles[variant], className].filter(Boolean).join(' ')}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  )
}
```

```css
/* src/components/ui/Button.module.css */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 14px 20px;
  font-family: var(--font);
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  border: none;
  border-radius: var(--radius);
  transition: opacity 0.15s;
}

.btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.primary {
  background: var(--black);
  color: var(--white);
}

.secondary {
  background: var(--grey-05);
  color: var(--black);
}

.text {
  background: transparent;
  color: var(--black);
  padding: 14px 0;
}
```

- [ ] **Step 4: Add to barrel**

```js
// src/components/ui/index.js
export { default as QuantityControl } from './QuantityControl'
export { default as FormField } from './FormField'
export { default as Button } from './Button'
```

- [ ] **Step 5: Run test — verify it passes**

```bash
npm test -- Button
```

Expected: 5 tests passing.

- [ ] **Step 6: Commit**

```bash
git add src/components/ui/Button.jsx src/components/ui/Button.module.css src/components/ui/Button.test.jsx src/components/ui/index.js
git commit -m "feat: add Button shared component"
```

---

### Task 4: Badge, SectionLabel, StepIndicator

**Files:**
- Create: `src/components/ui/Badge.jsx` + `.module.css`
- Create: `src/components/ui/SectionLabel.jsx` + `.module.css`
- Create: `src/components/ui/StepIndicator.jsx` + `.module.css`
- Modify: `src/components/ui/index.js`

These three are pure display components with no callbacks — no tests needed.

- [ ] **Step 1: Create Badge**

```jsx
// src/components/ui/Badge.jsx
import styles from './Badge.module.css'

export default function Badge({ variant, children }) {
  return (
    <span className={`${styles.badge} ${styles[variant === 'coming-soon' ? 'comingSoon' : variant]}`}>
      {children}
    </span>
  )
}
```

```css
/* src/components/ui/Badge.module.css */
.badge {
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.3px;
}

.open {
  background: var(--black);
  color: var(--white);
}

.comingSoon {
  background: var(--grey-05);
  color: var(--grey-60);
}
```

- [ ] **Step 2: Create SectionLabel**

```jsx
// src/components/ui/SectionLabel.jsx
import styles from './SectionLabel.module.css'

export default function SectionLabel({ as: Tag = 'p', className, children }) {
  return (
    <Tag className={[styles.label, className].filter(Boolean).join(' ')}>
      {children}
    </Tag>
  )
}
```

```css
/* src/components/ui/SectionLabel.module.css */
.label {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  color: var(--grey-60);
}
```

- [ ] **Step 3: Create StepIndicator**

This component moves from `src/components/BookingPage/StepIndicator.jsx`. The original CSS used undefined tokens (`--gold`, `--bg-secondary`, etc.) — replace with real tokens.

```jsx
// src/components/ui/StepIndicator.jsx
import styles from './StepIndicator.module.css'

const STEPS = ['DATE', 'TICKETS', 'ADD-ONS', 'CONTACT', 'PAYMENT']

export default function StepIndicator({ currentStep }) {
  return (
    <ol className={styles.indicator} aria-label={`Step ${currentStep} of 5`}>
      {STEPS.map((label, i) => {
        const num = i + 1
        const isDone = num < currentStep
        const isActive = num === currentStep
        return (
          <li
            key={label}
            className={`${styles.item} ${isDone ? styles.done : ''} ${isActive ? styles.active : ''}`}
            aria-current={isActive ? 'step' : undefined}
          >
            <div className={styles.dot}>{isDone ? '✓' : num}</div>
            <span className={styles.label}>{label}</span>
          </li>
        )
      })}
    </ol>
  )
}
```

```css
/* src/components/ui/StepIndicator.module.css */
.indicator {
  list-style: none;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  gap: 0;
  padding: var(--space-md) var(--space-md) var(--space-sm);
  margin: 0;
}

.item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  position: relative;
}

.item:not(:last-child)::after {
  content: '';
  position: absolute;
  top: 14px;
  left: calc(50% + 14px);
  width: calc(100% - 28px + var(--space-sm));
  height: 1px;
  background: var(--grey-30);
}

.item.done:not(:last-child)::after {
  background: var(--black);
}

.dot {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
  background: var(--grey-05);
  color: var(--grey-60);
  flex-shrink: 0;
}

.done .dot {
  background: var(--black);
  color: var(--white);
}

.active .dot {
  background: var(--black);
  color: var(--white);
}

.label {
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.5px;
  color: var(--grey-60);
  white-space: nowrap;
}

.done .label,
.active .label {
  color: var(--black);
}
```

- [ ] **Step 4: Add all three to barrel**

```js
// src/components/ui/index.js
export { default as QuantityControl } from './QuantityControl'
export { default as FormField } from './FormField'
export { default as Button } from './Button'
export { default as Badge } from './Badge'
export { default as SectionLabel } from './SectionLabel'
export { default as StepIndicator } from './StepIndicator'
```

- [ ] **Step 5: Run all tests to confirm nothing broke**

```bash
npm test
```

Expected: All existing tests pass. No new failures.

- [ ] **Step 6: Commit**

```bash
git add src/components/ui/Badge.jsx src/components/ui/Badge.module.css src/components/ui/SectionLabel.jsx src/components/ui/SectionLabel.module.css src/components/ui/StepIndicator.jsx src/components/ui/StepIndicator.module.css src/components/ui/index.js
git commit -m "feat: add Badge, SectionLabel, StepIndicator shared components"
```

---

### Task 5: Migrate Step2Tickets — use QuantityControl + Button

**Files:**
- Modify: `src/components/BookingPage/Step2Tickets.jsx`
- Modify: `src/components/BookingPage/Step2Tickets.module.css`

The inline `−/qty/+` stepper becomes `<QuantityControl>`. The back and continue buttons become `<Button>`.

**Strategy:** Button provides color/bg. The `.backBtn` / `.continueBtn` CSS classes keep only `flex` for layout. Remove color, background, font-size, font-weight from those classes.

- [ ] **Step 1: Update Step2Tickets.jsx**

```jsx
// src/components/BookingPage/Step2Tickets.jsx
import { useBooking } from '../../context/BookingContext'
import { ticketTypes, calcSubtotal } from '../../data/tickets'
import { formatDateLong } from '../../data/exhibitions'
import { QuantityControl, Button } from '../ui'
import styles from './Step2Tickets.module.css'

export default function Step2Tickets() {
  const { state, dispatch } = useBooking()
  const subtotal = calcSubtotal(state.tickets)
  const totalQty = Object.values(state.tickets).reduce((a, b) => a + b, 0)

  function setTicket(id, qty) {
    dispatch({ type: 'SET_TICKET', ticketType: id, qty })
  }

  return (
    <section className={styles.wrapper}>
      <h2 className={styles.title}>Select tickets</h2>
      {state.date && <p className={styles.subtitle}>{formatDateLong(state.date)}</p>}

      <div className={styles.rows}>
        {ticketTypes.map(({ id, labelEn, price }) => {
          const qty = state.tickets[id] ?? 0
          const parenIdx = labelEn.indexOf(' (')
          const baseName = parenIdx > -1 ? labelEn.slice(0, parenIdx) : labelEn
          const ageNote = parenIdx > -1 ? labelEn.slice(parenIdx + 1) : null
          return (
            <div key={id} className={styles.row}>
              <div className={styles.rowInfo}>
                <span className={styles.rowLabel}>{baseName}</span>
                {ageNote !== null && <span className={styles.rowAge}>{ageNote}</span>}
                <span className={styles.rowPrice}>${price.toFixed(2)}</span>
              </div>
              <QuantityControl
                value={qty}
                onChange={(n) => setTicket(id, n)}
                min={0}
                ariaLabel={baseName}
              />
            </div>
          )
        })}
      </div>

      <div className={styles.totalBar}>
        <span className={styles.totalCount}>{totalQty} ticket{totalQty !== 1 ? 's' : ''}</span>
        <span className={styles.totalAmount}>${subtotal.toFixed(2)}</span>
      </div>
      <p className={styles.taxNote}>Applicable taxes will be added at checkout</p>

      <div className={styles.actions}>
        <Button
          variant="secondary"
          className={styles.backBtn}
          onClick={() => dispatch({ type: 'SET_STEP', step: 1 })}
        >← Back</Button>
        <Button
          variant="primary"
          className={styles.continueBtn}
          disabled={totalQty === 0}
          onClick={() => dispatch({ type: 'SET_STEP', step: 3 })}
        >Continue →</Button>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Update Step2Tickets.module.css**

Remove `.controls`, `.minus`, `.plus`, `.qty` (replaced by QuantityControl). Remove color/bg/font from `.backBtn` and `.continueBtn` — keep only `flex`.

```css
/* src/components/BookingPage/Step2Tickets.module.css */
.wrapper { padding: var(--space-md); }
.title { font-size: 18px; font-weight: 700; color: var(--black); margin: 0 0 4px; }
.subtitle { font-size: 14px; color: var(--grey-60); margin: 0 0 var(--space-md); }

.rows { display: flex; flex-direction: column; gap: 10px; margin-bottom: var(--space-sm); }

.row {
  background: var(--grey-05);
  border-radius: var(--radius);
  padding: 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.rowInfo { display: flex; flex-direction: column; gap: 2px; }
.rowLabel { font-size: 16px; font-weight: 600; color: var(--black); }
.rowAge { font-size: 12px; color: var(--grey-60); }
.rowPrice { font-size: 13px; font-weight: 500; color: var(--grey-60); }

.totalBar {
  background: var(--grey-05);
  border-radius: var(--radius);
  padding: 14px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}
.totalCount { font-size: 14px; color: var(--grey-60); }
.totalAmount { font-size: 16px; font-weight: 700; color: var(--black); }

.taxNote { font-size: 12px; color: var(--grey-60); text-align: center; margin: 0 0 var(--space-md); }

.actions { display: flex; gap: 10px; }
.backBtn { flex: 1; }
.continueBtn { flex: 2; }
```

- [ ] **Step 3: Run all tests**

```bash
npm test
```

Expected: All tests pass.

- [ ] **Step 4: Commit**

```bash
git add src/components/BookingPage/Step2Tickets.jsx src/components/BookingPage/Step2Tickets.module.css
git commit -m "refactor: migrate Step2Tickets to use shared QuantityControl and Button"
```

---

### Task 6: Migrate Step3Addons — use QuantityControl + Button

**Files:**
- Modify: `src/components/BookingPage/Step3Addons.jsx`
- Modify: `src/components/BookingPage/Step3Addons.module.css`

Same pattern as Task 5 — the per-exhibition type rows use `<QuantityControl>`, action buttons use `<Button>`.

- [ ] **Step 1: Update Step3Addons.jsx**

```jsx
// src/components/BookingPage/Step3Addons.jsx
import { useEffect } from 'react'
import { useBooking } from '../../context/BookingContext'
import { useLang } from '../../context/LanguageContext'
import { exhibitions, isExhibitionOpen } from '../../data/exhibitions'
import { ticketTypes, calcAddonSubtotal } from '../../data/tickets'
import { QuantityControl, Button } from '../ui'
import styles from './Step3Addons.module.css'

export default function Step3Addons() {
  const { state, dispatch } = useBooking()
  const { lang } = useLang()

  const openExhibitions = state.date
    ? exhibitions.filter(ex => isExhibitionOpen(ex, state.date))
    : []

  const purchasedTypes = ticketTypes.filter(({ id }) => (state.tickets[id] ?? 0) > 0)

  useEffect(() => {
    const { entryExhibitionId, addons, tickets } = state
    if (entryExhibitionId && !addons[entryExhibitionId]) {
      purchasedTypes.forEach(({ id }) => {
        dispatch({ type: 'SET_ADDON', exhibitionId: entryExhibitionId, ticketType: id, qty: tickets[id] })
      })
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const addonSubtotal = calcAddonSubtotal(state.addons, openExhibitions)

  function setAddon(exhibitionId, ticketType, qty) {
    dispatch({ type: 'SET_ADDON', exhibitionId, ticketType, qty })
  }

  return (
    <section className={styles.wrapper}>
      <h2 className={styles.title}>Add special exhibitions</h2>
      <p className={styles.subtitle}>Optional — upgrade your visit</p>

      {openExhibitions.length === 0 && (
        <p className={styles.empty}>No special exhibitions available for this date.</p>
      )}

      <div className={styles.cards}>
        {openExhibitions.map(ex => {
          const exAddons = state.addons[ex.id] ?? {}
          const hasAny = purchasedTypes.some(({ id }) => (exAddons[id] ?? 0) > 0)
          const name = lang === 'zh' ? ex.nameZh : ex.nameEn
          const dateRange = lang === 'zh' ? ex.dateRangeZh : ex.dateRangeEn
          const pricePerPerson = ex.addonPrice.adult

          return (
            <div key={ex.id} className={`${styles.card} ${hasAny ? styles.cardActive : ''}`}>
              <div className={styles.cardHeader}>
                <div>
                  <div className={styles.exName}>{name}</div>
                  <div className={styles.exDate}>{dateRange}</div>
                </div>
                <div className={styles.exPrice}>+${pricePerPerson.toFixed(2)} / person</div>
              </div>

              {purchasedTypes.map(({ id, labelEn }) => {
                const parenIdx = labelEn.indexOf(' (')
                const baseName = parenIdx > -1 ? labelEn.slice(0, parenIdx) : labelEn
                const qty = exAddons[id] ?? 0
                const maxQty = state.tickets[id]
                return (
                  <div key={id} className={styles.typeRow}>
                    <span className={styles.typeLabel}>{baseName} × {maxQty}</span>
                    <QuantityControl
                      value={qty}
                      onChange={(n) => setAddon(ex.id, id, n)}
                      min={0}
                      max={maxQty}
                      ariaLabel={`${baseName} for ${name}`}
                    />
                  </div>
                )
              })}

              {hasAny && (
                <div className={styles.cardSubtotal}>
                  Subtotal: ${purchasedTypes.reduce(
                    (s, { id }) => s + (exAddons[id] ?? 0) * (ex.addonPrice[id] ?? 0), 0
                  ).toFixed(2)}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {addonSubtotal > 0 && (
        <div className={styles.totalBar}>
          <span>Add-ons</span>
          <span>+${addonSubtotal.toFixed(2)}</span>
        </div>
      )}

      <div className={styles.actions}>
        <Button
          variant="secondary"
          className={styles.backBtn}
          onClick={() => dispatch({ type: 'SET_STEP', step: 2 })}
        >← Back</Button>
        <Button
          variant="primary"
          className={styles.continueBtn}
          onClick={() => dispatch({ type: 'SET_STEP', step: 4 })}
        >Continue →</Button>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Update Step3Addons.module.css**

Remove `.controls`, `.minus`, `.plus`, `.qty`. Remove color/bg/font from `.backBtn` and `.continueBtn`.

```css
/* src/components/BookingPage/Step3Addons.module.css */
.wrapper { padding: var(--space-md); }
.title { font-size: 18px; font-weight: 700; color: var(--black); margin: 0 0 4px; }
.subtitle { font-size: 14px; color: var(--grey-60); margin: 0 0 var(--space-md); }
.empty { font-size: 14px; color: var(--grey-60); text-align: center; padding: var(--space-xl) 0; }

.cards { display: flex; flex-direction: column; gap: var(--space-sm); margin-bottom: var(--space-md); }

.card {
  border: 1px solid var(--grey-30);
  padding: var(--space-md);
}

.cardActive {
  border-color: var(--black);
}

.cardHeader {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--space-sm);
}

.exName { font-size: 14px; font-weight: 700; color: var(--black); }
.exDate { font-size: 12px; color: var(--grey-60); }
.exPrice { font-size: 13px; font-weight: 600; color: var(--black); white-space: nowrap; }

.typeRow {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 0;
  border-top: 1px solid var(--grey-05);
}

.typeLabel { font-size: 13px; color: var(--grey-60); }

.cardSubtotal {
  font-size: 13px;
  font-weight: 600;
  color: var(--black);
  text-align: right;
  padding-top: var(--space-sm);
  border-top: 1px solid var(--grey-30);
  margin-top: var(--space-sm);
}

.totalBar {
  display: flex;
  justify-content: space-between;
  padding: 14px;
  background: var(--grey-05);
  margin-bottom: var(--space-md);
  font-size: 14px;
  font-weight: 600;
  color: var(--black);
}

.actions { display: flex; gap: 10px; }
.backBtn { flex: 1; }
.continueBtn { flex: 2; }
```

- [ ] **Step 3: Run all tests**

```bash
npm test
```

Expected: All tests pass.

- [ ] **Step 4: Commit**

```bash
git add src/components/BookingPage/Step3Addons.jsx src/components/BookingPage/Step3Addons.module.css
git commit -m "refactor: migrate Step3Addons to use shared QuantityControl and Button"
```

---

### Task 7: Migrate Step4Contact — use FormField + Button

**Files:**
- Modify: `src/components/BookingPage/Step4Contact.jsx`
- Modify: `src/components/BookingPage/Step4Contact.module.css`

The three label+input+error/hint groups become `<FormField>`. Back and continue buttons become `<Button>`.

- [ ] **Step 1: Update Step4Contact.jsx**

```jsx
// src/components/BookingPage/Step4Contact.jsx
import { useState } from 'react'
import { useBooking } from '../../context/BookingContext'
import { formatDateLong } from '../../data/exhibitions'
import { ticketTypes, calcSubtotal, calcAddonSubtotal } from '../../data/tickets'
import { exhibitions } from '../../data/exhibitions'
import { FormField, Button } from '../ui'
import styles from './Step4Contact.module.css'

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export default function Step4Contact() {
  const { state, dispatch } = useBooking()
  const [emailError, setEmailError] = useState('')

  const { name, email, phone } = state.contact
  const canContinue = name.trim().length > 0 && email.trim().length > 0

  function handleField(field, value) {
    dispatch({ type: 'SET_CONTACT', fields: { [field]: value } })
    if (field === 'email') setEmailError('')
  }

  function handleContinue() {
    if (!isValidEmail(email)) {
      setEmailError('Please enter a valid email address')
      return
    }
    dispatch({ type: 'SET_STEP', step: 5 })
  }

  const subtotal = calcSubtotal(state.tickets)
  const openExhibitions = exhibitions.filter(ex =>
    state.addons[ex.id] && Object.values(state.addons[ex.id]).some(q => q > 0)
  )
  const addonSubtotal = calcAddonSubtotal(state.addons, openExhibitions)
  const totalQty = Object.values(state.tickets).reduce((a, b) => a + b, 0)

  return (
    <section className={styles.wrapper}>
      <h2 className={styles.title}>Your details</h2>
      <p className={styles.subtitle}>Confirmation will be sent to your email</p>

      <div className={styles.fields}>
        <FormField label="Full Name">
          <input
            id="contact-name"
            type="text"
            className={styles.input}
            value={name}
            onChange={e => handleField('name', e.target.value)}
            autoComplete="name"
          />
        </FormField>

        <FormField label="Email" error={emailError} hint={emailError ? undefined : 'Tickets will be sent here'}>
          <input
            id="contact-email"
            type="email"
            className={`${styles.input} ${emailError ? styles.inputError : ''}`}
            value={email}
            onChange={e => handleField('email', e.target.value)}
            autoComplete="email"
          />
        </FormField>

        <FormField label="Phone (optional)">
          <input
            id="contact-phone"
            type="tel"
            className={styles.input}
            value={phone}
            onChange={e => handleField('phone', e.target.value)}
            autoComplete="tel"
          />
        </FormField>
      </div>

      <div className={styles.summary}>
        <div className={styles.summaryLabel}>Order Summary</div>
        {state.date && (
          <div className={styles.summaryRow}>
            <span>{formatDateLong(state.date)} · {totalQty} ticket{totalQty !== 1 ? 's' : ''}</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
        )}
        {openExhibitions.map(ex => {
          const addonTotal = ticketTypes.reduce(
            (s, { id }) => s + (state.addons[ex.id]?.[id] ?? 0) * (ex.addonPrice[id] ?? 0), 0
          )
          return addonTotal > 0 ? (
            <div key={ex.id} className={styles.summaryRow}>
              <span>{ex.nameEn}</span>
              <span>+${addonTotal.toFixed(2)}</span>
            </div>
          ) : null
        })}
        <div className={styles.summaryDivider} />
        <div className={styles.summaryTotal}>
          <span>Total (excl. tax)</span>
          <span>${(subtotal + addonSubtotal).toFixed(2)}</span>
        </div>
      </div>

      <div className={styles.actions}>
        <Button
          variant="secondary"
          className={styles.backBtn}
          onClick={() => dispatch({ type: 'SET_STEP', step: 3 })}
        >← Back</Button>
        <Button
          variant="primary"
          className={styles.continueBtn}
          disabled={!canContinue}
          onClick={handleContinue}
        >Continue →</Button>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Update Step4Contact.module.css**

Remove `.field`, `.label` (replaced by FormField). Remove color/bg/font from `.backBtn` and `.continueBtn`. Keep `.input`, `.inputError`, `.summary*` classes.

```css
/* src/components/BookingPage/Step4Contact.module.css */
.wrapper { padding: var(--space-md); }
.title { font-size: 18px; font-weight: 700; color: var(--black); margin: 0 0 4px; }
.subtitle { font-size: 14px; color: var(--grey-60); margin: 0 0 var(--space-md); }

.fields { display: flex; flex-direction: column; gap: var(--space-md); margin-bottom: var(--space-lg); }

.input {
  width: 100%;
  padding: 12px var(--space-md);
  font-family: var(--font);
  font-size: 16px;
  border: 1px solid var(--grey-30);
  background: var(--white);
  color: var(--black);
  outline: none;
}

.input:focus {
  border-color: var(--black);
}

.inputError {
  border-color: #c00000;
}

.summary {
  background: var(--grey-05);
  padding: var(--space-md);
  margin-bottom: var(--space-md);
}

.summaryLabel {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: var(--grey-60);
  margin-bottom: var(--space-sm);
}

.summaryRow {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  color: var(--black);
  padding: 4px 0;
}

.summaryDivider {
  height: 1px;
  background: var(--grey-30);
  margin: var(--space-sm) 0;
}

.summaryTotal {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  font-weight: 700;
  color: var(--black);
}

.actions { display: flex; gap: 10px; }
.backBtn { flex: 1; }
.continueBtn { flex: 2; }
```

- [ ] **Step 3: Run all tests**

```bash
npm test
```

Expected: All tests pass.

- [ ] **Step 4: Commit**

```bash
git add src/components/BookingPage/Step4Contact.jsx src/components/BookingPage/Step4Contact.module.css
git commit -m "refactor: migrate Step4Contact to use shared FormField and Button"
```

---

### Task 8: Migrate Step1Date + Step5Payment — use Button + SectionLabel

**Files:**
- Modify: `src/components/BookingPage/Step1Date.jsx`
- Modify: `src/components/BookingPage/Step1Date.module.css`
- Modify: `src/components/BookingPage/Step5Payment.jsx`
- Modify: `src/components/BookingPage/Step5Payment.module.css`

Step1Date has one action button (continue). Step5Payment has a section label ("Pay with") and back + confirm buttons.

- [ ] **Step 1: Update Step1Date.jsx — replace continueBtn with Button**

Change only the import and the single button at the bottom of the return:

```jsx
// src/components/BookingPage/Step1Date.jsx
import { useState } from 'react'
import { useBooking } from '../../context/BookingContext'
import { localTodayStr, formatDateLong } from '../../data/exhibitions'
import { Button } from '../ui'
import styles from './Step1Date.module.css'

const DAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S']
const MONTH_NAMES = ['January','February','March','April','May','June',
                     'July','August','September','October','November','December']

function toDateStr(year, month, day) {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

function daysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate()
}

function firstDayOfMonth(year, month) {
  return new Date(year, month, 1).getDay()
}

function isDisabled(year, month, day, todayStr) {
  const dateStr = toDateStr(year, month, day)
  if (dateStr < todayStr) return true
  if (new Date(year, month, day).getDay() === 1) return true
  return false
}

export default function Step1Date() {
  const { state, dispatch } = useBooking()
  const todayStr = localTodayStr()
  const todayDate = new Date(todayStr + 'T00:00:00')

  const [displayYear, setDisplayYear] = useState(todayDate.getFullYear())
  const [displayMonth, setDisplayMonth] = useState(todayDate.getMonth())

  const isCurrentMonth = displayYear === todayDate.getFullYear() && displayMonth === todayDate.getMonth()
  const offset = firstDayOfMonth(displayYear, displayMonth)
  const totalDays = daysInMonth(displayYear, displayMonth)

  function prevMonth() {
    const d = new Date(displayYear, displayMonth - 1, 1)
    setDisplayYear(d.getFullYear())
    setDisplayMonth(d.getMonth())
  }

  function nextMonth() {
    const d = new Date(displayYear, displayMonth + 1, 1)
    setDisplayYear(d.getFullYear())
    setDisplayMonth(d.getMonth())
  }

  function selectDay(day) {
    const dateStr = toDateStr(displayYear, displayMonth, day)
    dispatch({ type: 'SET_DATE', date: dateStr })
  }

  const cells = [
    ...Array(offset).fill(null),
    ...Array.from({ length: totalDays }, (_, i) => i + 1),
  ]

  return (
    <section className={styles.wrapper}>
      <h2 className={styles.title}>Choose your visit date</h2>
      <p className={styles.subtitle}>Open Tue – Sun · Closed Mondays</p>

      <div className={styles.calendar}>
        <div className={styles.monthNav}>
          <button
            className={styles.navBtn}
            onClick={prevMonth}
            disabled={isCurrentMonth}
            aria-label="Previous month"
          >‹</button>
          <span className={styles.monthLabel}>{MONTH_NAMES[displayMonth]} {displayYear}</span>
          <button className={styles.navBtn} onClick={nextMonth} aria-label="Next month">›</button>
        </div>

        <div className={styles.grid} role="grid">
          <div className={styles.headerRow} role="row">
            {DAY_LABELS.map((d, i) => (
              <div
                key={i}
                role="columnheader"
                aria-label={i === 1 ? 'Closed' : undefined}
                className={`${styles.dayHeader} ${i === 1 ? styles.dayHeaderClosed : ''}`}
              >
                {d}
              </div>
            ))}
          </div>

          <div className={styles.daysGrid} role="rowgroup">
            {cells.map((day, i) => {
              if (day === null) return <span key={`e-${i}`} aria-hidden="true" />
              const dateStr = toDateStr(displayYear, displayMonth, day)
              const disabled = isDisabled(displayYear, displayMonth, day, todayStr)
              const selected = state.date === dateStr
              return (
                <button
                  key={day}
                  className={`${styles.day} ${disabled ? styles.dayDisabled : ''} ${selected ? styles.daySelected : ''}`}
                  disabled={disabled}
                  aria-label={dateStr}
                  aria-pressed={selected}
                  onClick={() => selectDay(day)}
                >
                  {day}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {state.date && (
        <p className={styles.selectedNote}>
          <strong>{formatDateLong(state.date)}</strong>
        </p>
      )}

      <div className={styles.actions}>
        <Button
          variant="primary"
          className={styles.continueBtn}
          disabled={!state.date}
          onClick={() => dispatch({ type: 'SET_STEP', step: 2 })}
        >
          Continue →
        </Button>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Update Step1Date.module.css — strip color/bg from continueBtn**

Read the existing `src/components/BookingPage/Step1Date.module.css`, then replace only the `.continueBtn` rule (and `.actions` if needed). Keep all other rules as-is. The updated bottom section:

```css
.actions { margin-top: var(--space-md); }
.continueBtn { width: 100%; }
```

- [ ] **Step 3: Update Step5Payment.jsx — use SectionLabel + Button**

```jsx
// src/components/BookingPage/Step5Payment.jsx
import { useBooking } from '../../context/BookingContext'
import { exhibitions } from '../../data/exhibitions'
import { ticketTypes, calcSubtotal, calcAddonSubtotal, HST_RATE } from '../../data/tickets'
import { SectionLabel, Button } from '../ui'
import styles from './Step5Payment.module.css'

const METHODS = [
  { id: 'wechat', label: 'WeChat Pay', emoji: '💬', deepLink: 'weixin://pay', appName: 'WeChat' },
  { id: 'alipay', label: 'Alipay',     emoji: '🔵', deepLink: 'alipays://pay', appName: 'Alipay' },
]

export default function Step5Payment() {
  const { state, dispatch } = useBooking()

  const openExhibitions = exhibitions.filter(ex =>
    state.addons[ex.id] && Object.values(state.addons[ex.id]).some(q => q > 0)
  )
  const subtotal = calcSubtotal(state.tickets)
  const addonSubtotal = calcAddonSubtotal(state.addons, openExhibitions)
  const taxBase = subtotal + addonSubtotal
  const hst = Math.round(taxBase * HST_RATE * 100) / 100
  const total = taxBase + hst
  const totalQty = Object.values(state.tickets).reduce((a, b) => a + b, 0)

  const isDesktop = typeof window !== 'undefined' && window.innerWidth > 768
  const selected = state.paymentMethod
  const selectedMethod = METHODS.find(m => m.id === selected)

  return (
    <section className={styles.wrapper}>
      <h2 className={styles.title}>Payment</h2>

      <div className={styles.summary}>
        <div className={styles.summaryLabel}>Order Summary</div>
        <div className={styles.summaryRow}>
          <span>{totalQty} ticket{totalQty !== 1 ? 's' : ''}</span>
          <span>{totalQty > 0 ? `×` : ''}</span>
        </div>
        {openExhibitions.map(ex => {
          const addonTotal = ticketTypes.reduce(
            (s, { id }) => s + (state.addons[ex.id]?.[id] ?? 0) * (ex.addonPrice[id] ?? 0), 0
          )
          return addonTotal > 0 ? (
            <div key={ex.id} className={styles.summaryRow}>
              <span>{ex.nameEn}</span>
              <span>+${addonTotal.toFixed(2)}</span>
            </div>
          ) : null
        })}
        <div className={styles.summaryDivider} />
        <div className={styles.summaryRow}>
          <span>Subtotal</span><span>${taxBase.toFixed(2)}</span>
        </div>
        <div className={styles.summaryRow}>
          <span>HST (7%)</span><span>${hst.toFixed(2)}</span>
        </div>
        <div className={styles.summaryDivider} />
        <div className={styles.summaryTotal}>
          <span>Total</span><span>${total.toFixed(2)}</span>
        </div>
      </div>

      <SectionLabel className={styles.methodLabel}>Pay with</SectionLabel>
      <div className={styles.methods}>
        {METHODS.map(m => (
          <button
            key={m.id}
            aria-label={m.label}
            className={`${styles.method} ${selected === m.id ? styles.methodSelected : ''}`}
            onClick={() => dispatch({ type: 'SET_PAYMENT_METHOD', method: m.id })}
          >
            <span className={styles.methodEmoji}>{m.emoji}</span>
            <span className={styles.methodName}>{m.label}</span>
          </button>
        ))}
      </div>

      {selected && (
        isDesktop ? (
          <div className={styles.qrBox}>
            <div className={styles.qrPlaceholder} aria-label="QR code for payment" />
            <p className={styles.qrHint}>Scan with {selectedMethod.appName}</p>
          </div>
        ) : (
          <a href={selectedMethod.deepLink} className={styles.deepLink}>
            Open {selectedMethod.appName} →
          </a>
        )
      )}

      <div className={styles.actions}>
        <Button
          variant="secondary"
          className={styles.backBtn}
          onClick={() => dispatch({ type: 'SET_STEP', step: 4 })}
        >← Back</Button>
        <Button
          variant="primary"
          className={styles.confirmBtn}
          disabled={!selected}
          onClick={() => dispatch({ type: 'CONFIRM_ORDER' })}
        >Confirm &amp; Pay</Button>
      </div>
    </section>
  )
}
```

- [ ] **Step 4: Update Step5Payment.module.css — remove methodLabel, strip btn color/bg**

Read `src/components/BookingPage/Step5Payment.module.css`. Remove the `.methodLabel` rule. Strip color/background from `.backBtn` and `.confirmBtn`, keep only `flex`. Add `margin-bottom` to `.methodLabel` spacing via the `className` on SectionLabel if needed — or add padding to `.methods` instead.

The `.methodLabel` in the original is a `<div>`. The SectionLabel receives `className={styles.methodLabel}`. Update `.methodLabel` to be layout-only (padding/margin), removing color/text-transform/font-size (now handled by SectionLabel):

```css
/* Replace the .methodLabel rule with: */
.methodLabel {
  padding: var(--space-md) 0 var(--space-sm);
}

/* Replace .backBtn and .confirmBtn with: */
.backBtn { flex: 1; }
.confirmBtn { flex: 2; }
```

- [ ] **Step 5: Run all tests**

```bash
npm test
```

Expected: All tests pass.

- [ ] **Step 6: Commit**

```bash
git add src/components/BookingPage/Step1Date.jsx src/components/BookingPage/Step1Date.module.css src/components/BookingPage/Step5Payment.jsx src/components/BookingPage/Step5Payment.module.css
git commit -m "refactor: migrate Step1Date and Step5Payment to use shared Button and SectionLabel"
```

---

### Task 9: Migrate HeroSection + ExhibitionList — use Button, Badge, SectionLabel

**Files:**
- Modify: `src/components/HomePage/HeroSection.jsx`
- Modify: `src/components/HomePage/HeroSection.module.css`
- Modify: `src/components/HomePage/ExhibitionList.jsx`
- Modify: `src/components/HomePage/ExhibitionList.module.css`

- [ ] **Step 1: Update HeroSection.jsx**

```jsx
// src/components/HomePage/HeroSection.jsx
import { useLang } from '../../context/LanguageContext'
import { useBooking } from '../../context/BookingContext'
import { Button } from '../ui'
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
        <Button
          variant="primary"
          className={styles.ctaBtn}
          onClick={() => dispatch({ type: 'GO_TO_BOOKING', exhibitionId: null })}
        >
          {t('buy-tickets')}
        </Button>
        <Button
          variant="text"
          className={styles.planBtn}
          onClick={() => dispatch({ type: 'GO_TO_PLAN_VISIT' })}
        >
          {t('plan-visit')}<span aria-hidden="true"> →</span>
        </Button>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Update HeroSection.module.css**

Read the existing `src/components/HomePage/HeroSection.module.css`. Remove background, color, font rules from `.ctaBtn` and `.planBtn` — keep only layout (margin, width, etc.). The exact change to make:

Find `.ctaBtn` and `.planBtn` rules and replace them with layout-only versions:

```css
/* Replace .ctaBtn with: */
.ctaBtn {
  display: block;
  width: 100%;
  margin-top: var(--space-lg);
}

/* Replace .planBtn with: */
.planBtn {
  display: block;
  width: 100%;
  margin-top: var(--space-sm);
}
```

- [ ] **Step 3: Update ExhibitionList.jsx**

```jsx
// src/components/HomePage/ExhibitionList.jsx
import { useLang } from '../../context/LanguageContext'
import { useBooking } from '../../context/BookingContext'
import { isExhibitionOpen, localTodayStr } from '../../data/exhibitions'
import { Badge, SectionLabel } from '../ui'
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
      <SectionLabel as="h2" className={styles.label}>{t('special-exhibitions')}</SectionLabel>

      {/* Featured card */}
      <button className={styles.featured} onClick={() => handleClick(featured.id)}>
        <div className={styles.featuredImgWrapper}>
          {featured.imageUrl && (
            <img
              src={featured.imageUrl}
              alt={lang === 'zh' ? featured.nameZh : featured.nameEn}
              loading="lazy"
              className={styles.featuredImg}
            />
          )}
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
            <Badge variant="open">+${featured.addonPrice.adult}</Badge>
          ) : (
            <Badge variant="coming-soon">{t('coming-soon')}</Badge>
          )}
        </div>
      </button>

      {/* Compact rows */}
      {rest.map((ex) => (
        <button key={ex.id} className={styles.row} onClick={() => handleClick(ex.id)}>
          {ex.imageUrl ? (
            <img
              src={ex.imageUrl}
              alt={lang === 'zh' ? ex.nameZh : ex.nameEn}
              loading="lazy"
              className={styles.rowImg}
            />
          ) : (
            <div className={styles.rowImg} aria-hidden="true" />
          )}
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
              <Badge variant="open">+${ex.addonPrice.adult}</Badge>
            ) : (
              <Badge variant="coming-soon">{t('coming-soon')}</Badge>
            )}
          </div>
        </button>
      ))}
    </section>
  )
}
```

- [ ] **Step 4: Update ExhibitionList.module.css**

Remove `.label`, `.badgeOpen`, `.badgeSoon` rules — these are now handled by the shared components. Keep all other rules.

The updated file removes these three blocks:

```css
/* DELETE these rules (replaced by SectionLabel and Badge): */
/* .label { ... } */
/* .badgeOpen { ... } */
/* .badgeSoon { ... } */
```

Keep `.label` only as a layout-override class (for the padding that SectionLabel doesn't provide):

```css
/* Keep .label for padding only: */
.label {
  padding: var(--space-md) var(--space-md) var(--space-sm);
}
```

- [ ] **Step 5: Run all tests**

```bash
npm test
```

Expected: All tests pass.

- [ ] **Step 6: Commit**

```bash
git add src/components/HomePage/HeroSection.jsx src/components/HomePage/HeroSection.module.css src/components/HomePage/ExhibitionList.jsx src/components/HomePage/ExhibitionList.module.css
git commit -m "refactor: migrate HeroSection and ExhibitionList to use shared Button, Badge, SectionLabel"
```

---

### Task 10: Migrate BookingPage + ConfirmationPage — update StepIndicator import + use Button

**Files:**
- Modify: `src/components/BookingPage/BookingPage.jsx`
- Delete: `src/components/BookingPage/StepIndicator.jsx`
- Delete: `src/components/BookingPage/StepIndicator.module.css`
- Modify: `src/components/ConfirmationPage/ConfirmationPage.jsx`
- Modify: `src/components/ConfirmationPage/ConfirmationPage.module.css`

- [ ] **Step 1: Update BookingPage.jsx — fix StepIndicator import**

Read `src/components/BookingPage/BookingPage.jsx`. It currently imports StepIndicator from `'./StepIndicator'`. Change that import to use the shared component:

```jsx
// In BookingPage.jsx, change this line:
import StepIndicator from './StepIndicator'
// To:
import { StepIndicator } from '../ui'
```

Everything else in BookingPage.jsx stays identical.

- [ ] **Step 2: Delete the old StepIndicator files**

```bash
rm src/components/BookingPage/StepIndicator.jsx
rm src/components/BookingPage/StepIndicator.module.css
```

- [ ] **Step 3: Update ConfirmationPage.jsx — use Button**

```jsx
// src/components/ConfirmationPage/ConfirmationPage.jsx
import { useBooking } from '../../context/BookingContext'
import { formatDateLong, exhibitions } from '../../data/exhibitions'
import { ticketTypes, calcSubtotal, calcAddonSubtotal, HST_RATE } from '../../data/tickets'
import { Button } from '../ui'
import styles from './ConfirmationPage.module.css'

export default function ConfirmationPage() {
  const { state, dispatch } = useBooking()

  const openExhibitions = exhibitions.filter(ex =>
    state.addons[ex.id] && Object.values(state.addons[ex.id]).some(q => q > 0)
  )
  const subtotal = calcSubtotal(state.tickets)
  const addonSubtotal = calcAddonSubtotal(state.addons, openExhibitions)
  const taxBase = subtotal + addonSubtotal
  const hst = Math.round(taxBase * HST_RATE * 100) / 100
  const total = taxBase + hst

  return (
    <main className={styles.page}>
      <div className={styles.icon} aria-hidden="true">✓</div>
      <h1 className={styles.heading}>You're all set!</h1>
      <p className={styles.emailSent}>Confirmation sent to</p>
      <p className={styles.email}>{state.contact.email}</p>

      <div className={styles.card}>
        <div className={styles.orderId}>Order #{state.orderId}</div>

        {state.date && (
          <div className={styles.row}>
            <span>Date</span>
            <span>{formatDateLong(state.date)}</span>
          </div>
        )}
        <div className={styles.row}>
          <span>Tickets</span>
          <span>
            {ticketTypes
              .filter(({ id }) => (state.tickets[id] ?? 0) > 0)
              .map(({ id, labelEn }) => {
                const parenIdx = labelEn.indexOf(' (')
                const baseName = parenIdx > -1 ? labelEn.slice(0, parenIdx) : labelEn
                return `${state.tickets[id]} ${baseName}`
              })
              .join(', ')}
          </span>
        </div>
        {openExhibitions.map(ex => (
          <div key={ex.id} className={styles.row}>
            <span>{ex.nameEn}</span>
            <span>
              {ticketTypes
                .filter(({ id }) => (state.addons[ex.id]?.[id] ?? 0) > 0)
                .map(({ id }) => state.addons[ex.id][id])
                .reduce((a, b) => a + b, 0)} tickets
            </span>
          </div>
        ))}

        <div className={styles.divider} />

        <div className={styles.row}>
          <span>Subtotal</span><span>${taxBase.toFixed(2)}</span>
        </div>
        <div className={styles.row}>
          <span>HST (7%)</span><span>${hst.toFixed(2)}</span>
        </div>
        <div className={styles.divider} />
        <div className={`${styles.row} ${styles.total}`}>
          <span>Total paid</span><span>${total.toFixed(2)}</span>
        </div>
      </div>

      <p className={styles.note}>
        Please present your email confirmation at the ROM entrance.
        Check your spam folder if you don't see it within a few minutes.
      </p>

      <Button
        variant="primary"
        className={styles.homeBtn}
        onClick={() => dispatch({ type: 'GO_HOME' })}
      >
        Back to Home
      </Button>
    </main>
  )
}
```

- [ ] **Step 4: Update ConfirmationPage.module.css — strip homeBtn color/bg**

Read `src/components/ConfirmationPage/ConfirmationPage.module.css`. Find the `.homeBtn` rule and replace it with a layout-only version:

```css
/* Replace .homeBtn with: */
.homeBtn {
  display: block;
  width: 100%;
  margin-top: var(--space-lg);
}
```

- [ ] **Step 5: Run all tests**

```bash
npm test
```

Expected: All tests pass.

- [ ] **Step 6: Commit**

```bash
git add src/components/BookingPage/BookingPage.jsx src/components/ConfirmationPage/ConfirmationPage.jsx src/components/ConfirmationPage/ConfirmationPage.module.css
git rm src/components/BookingPage/StepIndicator.jsx src/components/BookingPage/StepIndicator.module.css
git commit -m "refactor: migrate BookingPage and ConfirmationPage to shared components, move StepIndicator to ui/"
```

---

### Task 11: Final verification

**Files:** none (read-only verification pass)

- [ ] **Step 1: Run the full test suite one final time**

```bash
npm test
```

Expected: All tests pass. Zero failures.

- [ ] **Step 2: Check for any remaining references to the deleted StepIndicator path**

```bash
grep -r "BookingPage/StepIndicator" src/
```

Expected: No output. If any files still import from `BookingPage/StepIndicator`, fix those imports to use `../ui`.

- [ ] **Step 3: Check that all ui components are exported from the barrel**

```bash
cat src/components/ui/index.js
```

Expected output:
```js
export { default as QuantityControl } from './QuantityControl'
export { default as FormField } from './FormField'
export { default as Button } from './Button'
export { default as Badge } from './Badge'
export { default as SectionLabel } from './SectionLabel'
export { default as StepIndicator } from './StepIndicator'
```

- [ ] **Step 4: Commit if any cleanup was needed**

If Step 2 or 3 required fixes, commit them:

```bash
git add -A
git commit -m "fix: clean up remaining import references after component library migration"
```

If nothing needed fixing, no commit needed.
