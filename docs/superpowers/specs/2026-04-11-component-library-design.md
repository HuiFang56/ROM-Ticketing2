# Component Library Design

## Goal

Extract 6 reusable UI components from the existing codebase into a shared `src/components/ui/` library. Components use the existing black/white design tokens. The booking flow is not restyled — callers are updated to import from the shared library instead of duplicating inline code.

## File Structure

```
src/components/ui/
  Button.jsx          Button.module.css
  Badge.jsx           Badge.module.css
  QuantityControl.jsx QuantityControl.module.css
  FormField.jsx       FormField.module.css
  StepIndicator.jsx   StepIndicator.module.css
  SectionLabel.jsx    SectionLabel.module.css
  index.js
```

`index.js` re-exports all components:
```js
export { default as Button } from './Button'
export { default as Badge } from './Badge'
export { default as QuantityControl } from './QuantityControl'
export { default as FormField } from './FormField'
export { default as StepIndicator } from './StepIndicator'
export { default as SectionLabel } from './SectionLabel'
```

Callers import from the barrel:
```js
import { Button, Badge } from '../ui'
```

## Component APIs

### Button

```jsx
<Button
  variant="primary"    // 'primary' | 'secondary' | 'text'
  onClick={fn}
  disabled={false}
  type="button"        // 'button' | 'submit' | 'reset'
>
  Label
</Button>
```

- `primary`: black fill, white text
- `secondary`: white fill, black border, black text
- `text`: no fill, no border, black text
- `disabled` renders at reduced opacity and blocks pointer events

### Badge

```jsx
<Badge variant="open" />          // renders "Open"
<Badge variant="coming-soon" />   // renders "Coming soon"
```

- `open`: black background, white text
- `coming-soon`: grey background (`--grey-30`), dark text

### QuantityControl

```jsx
<QuantityControl
  value={qty}
  onChange={(n) => dispatch(...)}
  min={0}             // default 0
  max={3}             // optional, no cap if omitted
  ariaLabel="Adult"   // used for aria-label on − and + buttons
/>
```

- Renders `−` button / value display / `+` button
- Clamps `value` to `[min, max]`
- `−` button disabled when `value === min`
- `+` button disabled when `value === max`

### FormField

```jsx
<FormField
  label="Email"
  error="Invalid email address"   // optional, shown in red below input
  hint="We'll send your tickets here"  // optional, shown in grey below input
>
  <input type="email" ... />
</FormField>
```

- Renders: label above, children (the input), hint below, error below hint
- Error takes visual priority over hint when both are present
- Does not render the `<input>` itself — wraps whatever the caller passes as children

### StepIndicator

```jsx
<StepIndicator currentStep={2} />
```

- 5 steps total (fixed for this app)
- Steps before `currentStep`: shown as checkmark (done)
- `currentStep`: shown as number, `aria-current="step"`
- Steps after: shown as number, muted style

Moved from `src/components/BookingPage/StepIndicator.jsx` — same props, same behaviour.

### SectionLabel

```jsx
<SectionLabel>Special Exhibitions</SectionLabel>
<SectionLabel as="h2">Pay With</SectionLabel>
```

- Small uppercase tracking label
- Renders as `<p>` by default; `as` prop accepts any HTML tag string
- Styling: uppercase, letter-spacing, `--grey-60` colour, small font size

## Migration

The following callers are updated to import from `src/components/ui/` and use the extracted components. Visual output does not change.

| Caller | What changes |
|--------|-------------|
| `Step2Tickets.jsx` | Inline `−/qty/+` stepper → `<QuantityControl>` |
| `Step3Addons.jsx` | Inline `−/qty/+` stepper → `<QuantityControl>` |
| `Step4Contact.jsx` | Inline label+input+error markup → `<FormField>` |
| `ExhibitionList.jsx` | Inline status pill → `<Badge>` |
| `HeroSection.jsx`, `Step1–5.jsx` | Inline button markup → `<Button>` |
| `BookingPage.jsx` | Update `StepIndicator` import path |
| Anywhere with uppercase section labels | Inline `<p>` → `<SectionLabel>` |

## Testing

Test files live alongside components:

```
src/components/ui/
  Button.test.jsx
  Badge.test.jsx
  QuantityControl.test.jsx
  FormField.test.jsx
```

No tests for `StepIndicator` (purely presentational, renders step numbers and checkmarks — no callbacks or logic to test), `SectionLabel` (pure display), or `Badge` (pure display).

**Button tests:**
- Renders children
- Calls `onClick` when clicked
- Does not call `onClick` when `disabled`
- Renders correct class for each variant

**QuantityControl tests:**
- Displays the current value
- Calls `onChange` with value + 1 on `+` click
- Calls `onChange` with value − 1 on `−` click
- `−` button is disabled when value equals min
- `+` button is disabled when value equals max
- Value is clamped: cannot go below min or above max

**FormField tests:**
- Renders label text
- Renders children (the input)
- Renders error message when provided
- Renders hint text when provided
- Error takes priority over hint visually (both rendered, error styled differently)

## Design Tokens

All components use only the existing tokens from `src/index.css`:

| Token | Value |
|-------|-------|
| `--black` | #000 |
| `--white` | #fff |
| `--grey-60` | mid grey |
| `--grey-30` | light grey border |
| `--grey-05` | near-white background |
| `--radius` | 0 (sharp corners) |

No new tokens are introduced.
