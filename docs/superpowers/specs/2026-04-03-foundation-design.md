# Foundation Design Spec
# ROM Ticketing — Design System + App Shell

## Goal

Establish the design system (tokens, typography, global styles) and app shell (screen router, contexts, header) that every subsequent feature will build on. Nothing visual ships until this foundation exists.

---

## Design Tokens

All tokens defined as CSS custom properties in `src/index.css`.

### Colors

```css
--black:    #000000;   /* primary text, buttons, borders */
--white:    #ffffff;   /* page background, inverse text */
--grey-60:  #666666;   /* secondary text, dates, captions */
--grey-30:  #b3b3b3;   /* disabled states, muted text */
--grey-05:  #f5f5f5;   /* card backgrounds, light surfaces */
```

No other colors. No blue, no gold. Pure black and white with three grey steps.

### Typography

Font: **ABC Monument Grotesk** (self-hosted OTF files in `src/assets/fonts/`).
Fallback stack: `-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`.

Four weights in use:

| Weight | File | Used for |
|--------|------|----------|
| 400 Regular | `ABCMonumentGrotesk-Regular-Trial.otf` | Body text, labels, descriptions |
| 500 Medium | `ABCMonumentGrotesk-Medium-Trial.otf` | Nav items, subheadings |
| 700 Bold | `ABCMonumentGrotesk-Bold-Trial.otf` | Buttons, prices, badges |
| 900 Black | `ABCMonumentGrotesk-Black-Trial.otf` | Hero titles, exhibition names |

```css
--font: 'ABCMonumentGrotesk', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
```

### Spacing

```css
--space-xs:  4px;
--space-sm:  8px;
--space-md:  16px;
--space-lg:  24px;
--space-xl:  32px;
```

### Shape

```css
--radius: 0px;   /* all corners sharp — editorial B&W aesthetic */
```

No rounded corners anywhere. Cards, buttons, badges, inputs — all sharp.

### Layout

```css
--max-width: 480px;   /* mobile-first, centred on desktop */
```

---

## Global Styles (`src/index.css`)

- `@font-face` declarations for the four weights above
- Box-sizing reset (`*, *::before, *::after { box-sizing: border-box }`)
- `margin: 0; padding: 0` on all elements
- `html, body, #root { height: 100% }`
- `body`: `font-family: var(--font); background: var(--white); color: var(--black)`
- `button`: `cursor: pointer; border: none; background: none; font-family: inherit`
- `img`: `display: block; max-width: 100%`
- `.app-shell`: `max-width: var(--max-width); margin: 0 auto; min-height: 100vh`

---

## App Shell

### Screen State Machine (`src/context/BookingContext.jsx`)

Screens: `home` | `booking` | `confirmation` | `exhibition` | `plan-visit`

Initial state: `{ screen: 'home', ... }`

Actions that change screen:
- `GO_TO_BOOKING` → `booking`
- `GO_HOME` → `home`
- `GO_TO_EXHIBITION` → `exhibition` (carries `exhibitionId`)
- `GO_TO_PLAN_VISIT` → `plan-visit`
- `CONFIRM_ORDER` → `confirmation`

### Language Context (`src/context/LanguageContext.jsx`)

State: `lang` — either `'en'` or `'zh'`. Default: `'en'`.
Exposes: `lang`, `setLang`, `t(key)` (looks up translation string by key).
Translations object lives in the same file for now.

### Screen Router (`src/App.jsx`)

```jsx
{state.screen === 'home'        && <HomePage />}
{state.screen === 'exhibition'  && <ExhibitionPage />}
{state.screen === 'plan-visit'  && <PlanVisitPage />}
{state.screen === 'booking'     && <BookingWizard />}
{state.screen === 'confirmation' && <ConfirmationPage />}
```

Header is rendered above all screens (always visible).

### Header (`src/components/Header/Header.jsx`)

- Slim bar, full width, `border-bottom: 1px solid var(--black)`
- Left: **ROM** wordmark — font-weight 900, font-size 16px
- Right: language toggle — `EN` · `中`, font-weight 500, font-size 13px
- Active language: `color: var(--black)`. Inactive: `color: var(--grey-30)`
- Clicking inactive language calls `setLang`
- Padding: `10px var(--space-md)`
- Background: `var(--white)`

---

## What This Spec Does NOT Cover

The following are separate specs, each built after this foundation ships:

- Home page (Hero section + Exhibition list)
- Exhibition detail page
- Plan Your Visit page
- Booking wizard (multi-step form)
- Confirmation page

---

## Definition of Done

- [ ] `index.css` loads all four font weights correctly (verified in browser)
- [ ] All CSS tokens resolve (no undefined variables)
- [ ] App renders with Header visible on all placeholder screens
- [ ] Language toggle switches `lang` between `en` and `zh`
- [ ] `GO_TO_BOOKING`, `GO_HOME`, `GO_TO_EXHIBITION`, `GO_TO_PLAN_VISIT` all change screen correctly
- [ ] `git init` + initial commit done
