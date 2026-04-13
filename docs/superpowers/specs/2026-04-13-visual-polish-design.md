# Visual Polish Design

## Goal

Refine the app's visual quality across all screens using the **Refined B&W** direction: no color changes, but fix broken token references, tighten typography, improve divider/border consistency, and strengthen visual hierarchy.

## Problem Areas Found

1. **Broken tokens** — `Step1Date`, `Step5Payment`, `ConfirmationPage` reference tokens that don't exist (`--text-primary`, `--bg-card`, `--gold`, `--radius-lg`, etc.), falling back to browser defaults. These components currently render incorrectly.
2. **Invisible dividers** — `ExhibitionList` row borders use `var(--grey-05)` on a white background — completely invisible.
3. **Over-heavy borders** — `Header` and `ExhibitionList` featured card use `1px solid var(--black)` as a separator — too visually dominant.
4. **Unreadable tagline** — `HeroSection` tagline is 9px — too small to read on mobile.
5. **Hero takes too much space** — 62vh leaves little room for content below the fold.
6. **Invisible badge** — Coming-soon Badge uses `--grey-05` background with `--grey-60` text, nearly invisible on white.
7. **Font weight inconsistency** — Button and SectionLabel use weight 600, but ABCMonumentGrotesk has a 700 (Bold) variant that should be used for interactive elements.

## Scope

All 5 visual layers: shared tokens → shared UI components → HomePage → ExhibitionPage → PlanVisitPage + BookingPage + ConfirmationPage.

---

## Changes

### 1. `src/index.css` — Add spacing token and grey token

Add to `:root`:
```css
--space-mid: 12px;
--grey-10: #e8e8e8;
```

`--space-mid` sits between `--space-sm: 8px` and `--space-md: 16px`. Several components currently hardcode `10px` or `12px` gap values; this token replaces those.

`--grey-10` fills the gap between `--grey-05: #f5f5f5` (near-invisible on white) and `--grey-30: #b3b3b3` (too prominent for row dividers). Used for list row separators.

### 2. `src/components/ui/Button.module.css`

- `font-weight: 600` → `font-weight: 700`
- Add `letter-spacing: 0.3px` to `.btn` for slightly more refined feel

### 3. `src/components/ui/SectionLabel.module.css`

- `font-weight: 600` → `font-weight: 700`
- `letter-spacing: 1.5px` → `letter-spacing: 2px`

### 4. `src/components/ui/Badge.module.css`

`.comingSoon` variant — currently flat grey-05 background, visually disappears on white. Change to outlined style:
```css
.comingSoon {
  background: var(--white);
  color: var(--grey-60);
  border: 1px solid var(--grey-30);
}
```

### 5. `src/components/Header/Header.module.css`

- `.header` border-bottom: `1px solid var(--black)` → `1px solid var(--grey-30)`

### 6. `src/components/HomePage/HeroSection.module.css`

- `.hero` height: `62vh` → `52vh` — shows more content below fold
- `.tagline` font-size: `9px` → `11px`; letter-spacing: `2px` → `3px`; color: `rgba(255,255,255,0.55)` → `rgba(255,255,255,0.65)`

### 7. `src/components/HomePage/ExhibitionList.module.css`

- `.featuredMeta` border-bottom: `1px solid var(--black)` → `1px solid var(--grey-30)` — less visually heavy
- `.row` border-bottom: `1px solid var(--grey-05)` → `1px solid var(--grey-10)` — currently invisible on white background
- `.rowName` font-size: `13px` → `14px`
- `.rowDate` font-size: `11px` → `12px`

### 8. `src/components/BookingPage/Step1Date.module.css`

Replace all undefined tokens with existing design system tokens:

| Old token | New value |
|-----------|-----------|
| `var(--text-primary)` | `var(--black)` |
| `var(--text-secondary)` | `var(--grey-60)` |
| `var(--text-muted)` | `var(--grey-60)` |
| `var(--bg-card)` | `var(--grey-05)` |
| `var(--bg-secondary)` | `var(--grey-05)` |
| `var(--radius-lg)` | `var(--radius)` |
| `var(--gold)` (selected day bg) | `var(--black)` |
| `var(--bg-primary)` (selected day text) | `var(--white)` |

### 9. `src/components/BookingPage/Step5Payment.module.css`

Same token substitution as Step1Date, plus:

| Old value | New value |
|-----------|-----------|
| `var(--text-primary)` | `var(--black)` |
| `var(--text-secondary)` | `var(--grey-60)` |
| `var(--text-muted)` | `var(--grey-60)` |
| `var(--bg-card)` | `var(--grey-05)` |
| `var(--bg-secondary)` | `var(--grey-05)` |
| `var(--radius-lg)` | `var(--radius)` |
| `.methodSelected` border-color: `rgba(181,136,26,0.5)` | `var(--black)` |
| `rgba(26,26,46,0.07)` (method border) | `var(--grey-30)` |
| `rgba(26,26,46,0.1)` (divider) | `var(--grey-30)` |

Note: `#07c160` (WeChat green on deepLink button) — keep as-is, this is a brand color for the payment method.

### 10. `src/components/ConfirmationPage/ConfirmationPage.module.css`

Same token substitution:

| Old token | New value |
|-----------|-----------|
| `var(--text-primary)` | `var(--black)` |
| `var(--text-secondary)` | `var(--grey-60)` |
| `var(--text-muted)` | `var(--grey-60)` |
| `var(--bg-card)` | `var(--grey-05)` |
| `var(--bg-primary)` | `var(--white)` |
| `var(--radius-lg)` | `var(--radius)` |
| `var(--gold)` (icon bg) | `var(--black)` |
| `var(--gold-dim)` (icon bg, card border) | `var(--grey-30)` |
| `rgba(26,26,46,0.08)` (divider) | `var(--grey-30)` |

`.icon` color becomes white-on-black (was gold-on-gold-dim):
```css
.icon {
  background: var(--black);
  color: var(--white);
}
```

---

## Files Changed Summary

| File | Type of change |
|------|---------------|
| `src/index.css` | Add `--space-mid` and `--grey-10` tokens |
| `src/components/ui/Button.module.css` | weight 600→700, add letter-spacing |
| `src/components/ui/SectionLabel.module.css` | weight 600→700, spacing 1.5px→2px |
| `src/components/ui/Badge.module.css` | comingSoon: outlined instead of flat |
| `src/components/Header/Header.module.css` | border --black → --grey-30 |
| `src/components/HomePage/HeroSection.module.css` | height 62vh→52vh, tagline 9px→11px |
| `src/components/HomePage/ExhibitionList.module.css` | divider colors, row font sizes |
| `src/components/BookingPage/Step1Date.module.css` | fix broken tokens |
| `src/components/BookingPage/Step5Payment.module.css` | fix broken tokens |
| `src/components/ConfirmationPage/ConfirmationPage.module.css` | fix broken tokens |

Files **not changed**: `ExhibitionPage.module.css`, `PlanVisitPage.module.css`, `Step2Tickets.module.css`, `Step3Addons.module.css`, `Step4Contact.module.css`, `BookingPage.module.css` — these already use the correct token set and look fine.

---

## Testing

All changes are CSS-only — no behavior changes, no new props, no reducer changes.

Run full test suite after each task to verify nothing regressed:
```
npx vitest run
```

Expected: all tests continue to pass (CSS changes don't affect test assertions).

Visual verification: open the app in a browser and check each screen in EN and ZH.
