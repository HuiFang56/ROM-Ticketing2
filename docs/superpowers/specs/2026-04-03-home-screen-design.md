# Home Screen Design Spec
# ROM Ticketing — Hero Section + Exhibition List

## Goal

Build the home screen: a full-bleed photo hero with CTA and Plan Your Visit link, followed by a full-width editorial exhibition list (featured first card, compact rows below).

---

## Components

| File | Responsibility |
|------|---------------|
| `src/data/exhibitions.js` | Exhibition data array + `isExhibitionOpen()` helper |
| `src/components/HomePage/HomePage.jsx` | Composes HeroSection + ExhibitionList |
| `src/components/HomePage/HeroSection.jsx` | Full-bleed photo hero |
| `src/components/HomePage/HeroSection.module.css` | Hero styles |
| `src/components/HomePage/ExhibitionList.jsx` | Editorial exhibition card list |
| `src/components/HomePage/ExhibitionList.module.css` | Exhibition list styles |
| `src/data/exhibitions.test.js` | Tests for `isExhibitionOpen()` |
| `src/components/HomePage/HeroSection.test.jsx` | Hero render tests |
| `src/components/HomePage/ExhibitionList.test.jsx` | Exhibition list render + interaction tests |

---

## Exhibition Data (`src/data/exhibitions.js`)

Each exhibition object:

```js
{
  id: string,           // kebab-case, e.g. 'forbidden-city'
  nameEn: string,
  nameZh: string,
  dateRangeEn: string,  // display string, e.g. 'Oct 12, 2025 – Mar 2, 2026'
  dateRangeZh: string,
  imageUrl: string,     // verified Unsplash URL, ?w=900&q=80
  addonPrice: {
    adult: number,
    youth: number,
    senior: number,
  },
  startDate: string,    // 'YYYY-MM-DD' — used by isExhibitionOpen()
  endDate: string,      // 'YYYY-MM-DD' — null if no end date (permanent)
}
```

Three exhibitions (in display order):

| id | nameEn | open? | adult add-on |
|----|--------|-------|-------------|
| `forbidden-city` | Forbidden City | Yes | $8 |
| `trex-revealed` | T.Rex Revealed | Yes | $6 |
| `egypt-pharaohs` | Egypt: The Time of Pharaohs | No (coming soon, Jun 2026) | $10 |

**Helper function:**

```js
export function localTodayStr() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
}

export function isExhibitionOpen(ex, todayStr) {
  if (todayStr < ex.startDate) return false
  if (ex.endDate && todayStr > ex.endDate) return false
  return true
}
```

**Image URLs:** Must be verified working Unsplash URLs before committing. Test each URL in a browser before adding to the data file. Use `?w=900&q=80` query params. Do not invent photo IDs.

**During development:** Set `imageUrl: ''` for exhibitions and render a solid `background-color` placeholder (e.g. `background: var(--grey-05)`) when `imageUrl` is empty. Real URLs are sourced before launch, not during this sprint.

---

## Hero Section

### Layout

- Height: `62vh`, minimum `280px`
- Background: CSS `background-image` (decorative — no `<img>` element, no alt text needed)
- Gradient overlay: `linear-gradient(to bottom, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.92) 100%)`
- Content anchored to bottom of hero via `align-items: flex-end`
- Content padding: `var(--space-lg) var(--space-md)` — no raw pixel values

### Content (top to bottom)

1. **Tagline** — `t('includes-ga')` — 9px, `letter-spacing: 2px`, `text-transform: uppercase`, `color: rgba(255,255,255,0.55)`, `aria-hidden="true"` (decorative — screen readers don't need this)

2. **Title** — bilingual:
   - EN: "Royal Ontario Museum" with line break after "Ontario"
   - ZH: "皇家安大略博物馆" with `<br />` then `<span>` "Royal Ontario Museum" subtitle
   - Font-weight: 900, color: `var(--white)`, font-size: 32px, line-height: 1

3. **Buy Tickets button** — `t('buy-tickets')`
   - Full width, `background: var(--black)`, `color: var(--white)`
   - Padding: `var(--space-md)`, font-size: 15px, font-weight: 700
   - `border-radius: var(--radius)` (0px)
   - `margin-top: var(--space-lg)`
   - Dispatches `{ type: 'GO_TO_BOOKING', exhibitionId: null }`
   - Focus ring: `outline: 2px solid var(--white); outline-offset: 2px`

4. **Plan Your Visit button** — `t('plan-visit')`
   - Full width, background: none, `color: rgba(255,255,255,0.7)`
   - Font-size: 13px, font-weight: 500
   - `margin-top: var(--space-sm)`
   - Trailing arrow: `<span aria-hidden="true"> →</span>`
   - Dispatches `{ type: 'GO_TO_PLAN_VISIT' }`
   - Focus ring: `outline: 2px solid var(--white); outline-offset: 2px`

### Verified hero image

Use: `https://images.unsplash.com/photo-1554907984-15263bfd63bd?w=900&q=80`
(ROM exterior — verified working from previous project build)

---

## Exhibition List

### Section label

- Text: `t('special-exhibitions')`
- Font-size: 11px, `letter-spacing: 1.5px`, `text-transform: uppercase`, `color: var(--grey-60)`
- Padding: `var(--space-md) var(--space-md) var(--space-sm)`

### Featured card (first exhibition in array)

- `<button>` element, full width (`width: 100%`, `display: block`, no horizontal margin)
- `text-align: left`, `background: none`, `border: none`, `padding: 0`, `cursor: pointer`
- Focus ring: `outline: 2px solid var(--black); outline-offset: 2px`

**Image area:**
- `<img>` with `alt={lang === 'zh' ? ex.nameZh : ex.nameEn}`, `loading="lazy"`
- Width: 100%, height: 140px, `object-fit: cover`, `display: block`
- Gradient overlay (CSS, via a sibling `<div>` with `position: absolute`): `linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.85) 100%)`
- Exhibition name overlaid at bottom: font-weight 900, color white, font-size 17px, padding `var(--space-sm) var(--space-md)`

**Meta row below image:**
- Padding: `var(--space-sm) var(--space-md)`
- `border-bottom: 1px solid var(--black)`
- Date: left-aligned, font-size 12px, `color: var(--grey-60)`
- Badge: right-aligned
  - Open: `background: var(--black)`, `color: var(--white)`, font-size 11px, font-weight 700, padding `2px var(--space-sm)`
  - Coming soon: `background: var(--grey-05)`, `color: var(--grey-60)`, same padding, text: `t('coming-soon')`

### Compact rows (remaining exhibitions)

- `<button>` element, full width, same button reset as featured card
- Focus ring: `outline: 2px solid var(--black); outline-offset: 2px`
- Layout: flex row, no gap (image flush left)

**Image:** 80px wide, 64px tall, `object-fit: cover`, no border-radius

**Text block:** flex: 1, padding `var(--space-sm) var(--space-md)`
- Name: font-size 13px, font-weight 700, `color: var(--black)`, line-height 1.3
- Date: font-size 11px, `color: var(--grey-60)`

**Badge:** right-aligned, padding `var(--space-sm) var(--space-md) var(--space-sm) 0`
- Same open/coming-soon styles as featured

**Row separator:** `border-bottom: 1px solid var(--grey-05)` (light, not bold)

### Clicking a card

Dispatches `{ type: 'GO_TO_EXHIBITION', exhibitionId: ex.id }`

---

## Accessibility

| Element | Requirement |
|---------|------------|
| Hero background | CSS `background-image` — no alt text needed |
| Tagline | `aria-hidden="true"` — decorative |
| "→" arrow in Plan Your Visit | `<span aria-hidden="true">` |
| Exhibition cards | Native `<button>` elements |
| Exhibition images | `alt={lang === 'zh' ? ex.nameZh : ex.nameEn}` |
| Focus rings (hero) | `outline: 2px solid var(--white); outline-offset: 2px` |
| Focus rings (list) | `outline: 2px solid var(--black); outline-offset: 2px` |
| Contrast: plan-visit link | `rgba(255,255,255,0.7)` on near-black ≈ 8:1 ✓ |
| Contrast: dates `--grey-60` | `#666` on `#fff` = 5.7:1 ✓ |
| Contrast: CTA | black on white = 21:1 ✓ |

---

## What This Spec Does NOT Cover

- Exhibition detail page (separate spec)
- Plan Your Visit page (separate spec)
- Booking wizard (separate spec)
