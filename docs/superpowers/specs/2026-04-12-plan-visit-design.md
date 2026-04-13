# Plan Your Visit Page Design

## Goal

Build `PlanVisitPage` — the practical visitor information screen shown when a user taps "Plan Your Visit →" on the home screen. Shows hours, location, transit directions, and accessibility info, with a "Book Tickets" CTA at the bottom.

## Data

No new data file. All content is static and hardcoded in the component — ROM's hours, address, transit, and accessibility text do not vary per user.

**EN content:**

**Hours:**
- Mon – Fri: 10:00 am – 5:30 pm
- Sat – Sun: 10:00 am – 5:30 pm
- Closed: Christmas Day (Dec 25)

**Location:**
- 100 Queen's Park, Toronto, ON M5S 2C6
- Google Maps link: `https://maps.google.com/?q=Royal+Ontario+Museum+Toronto`

**Getting Here:**
- Subway: Museum station (Line 1 Yonge-University)
- Bus: Routes 5, 6, 94

**Accessibility:**
- Wheelchair accessible entrance on Bloor St W. Elevators available on all floors. Accessible washrooms on every level.

**ZH content:**

**Hours (开放时间):**
- 周一至周五：上午10:00 – 下午5:30
- 周六至周日：上午10:00 – 下午5:30
- 休馆：12月25日（圣诞节）

**Location (地址):**
- 100 Queen's Park, Toronto, ON M5S 2C6
- Same Google Maps link

**Getting Here (交通指南):**
- 地铁：Museum站（1号线）
- 公交：5、6、94路

**Accessibility (无障碍设施):**
- 无障碍入口位于Bloor St W。各楼层均设有电梯及无障碍洗手间。

## Architecture

**New files:**
- `src/components/PlanVisitPage/PlanVisitPage.jsx`
- `src/components/PlanVisitPage/PlanVisitPage.module.css`
- `src/components/PlanVisitPage/PlanVisitPage.test.jsx`

**Modified files:**
- `src/context/LanguageContext.jsx` — add section heading translation keys
- `src/App.jsx` — replace placeholder with `<PlanVisitPage />`

No reducer changes needed. `GO_TO_PLAN_VISIT` already sets `state.screen: 'plan-visit'`. Back button dispatches `GO_HOME` (existing).

## Translation Keys to Add

Add to `src/context/LanguageContext.jsx`:

```js
en: {
  // existing keys...
  'hours':         'Hours',
  'location':      'Location',
  'getting-here':  'Getting Here',
  'accessibility': 'Accessibility',
  'open-in-maps':  'Open in Maps',
}

zh: {
  // existing keys...
  'hours':         '开放时间',
  'location':      '地址',
  'getting-here':  '交通指南',
  'accessibility': '无障碍设施',
  'open-in-maps':  '查看地图',
}
```

## Component Design

### PlanVisitPage

Reads `lang` from `useLang()` for language switching. Dispatches to `useBooking()`.

**Layout (top to bottom):**

1. **Back button** — text: "← Back", dispatches `{ type: 'GO_HOME' }`. Aligned left, above title.

2. **Page title** — `<h1>`: `t('plan-visit')` ("Plan Your Visit" / "参观信息"). font-weight 900.

3. **Hours section**
   - `<SectionLabel>`: `t('hours')`
   - EN rows: Mon–Fri / Sat–Sun / Closed (Dec 25)
   - ZH rows: 周一至周五 / 周六至周日 / 休馆 (12月25日)
   - Each row: left label, right value, space-between

4. **Location section**
   - `<SectionLabel>`: `t('location')`
   - Address line: `100 Queen's Park, Toronto, ON M5S 2C6`
   - "Open in Maps →" / "查看地图 →" — `<a>` tag, opens Google Maps in new tab

5. **Getting Here section**
   - `<SectionLabel>`: `t('getting-here')`
   - EN: "Subway: Museum station (Line 1 Yonge-University)" and "Bus: Routes 5, 6, 94"
   - ZH: "地铁：Museum站（1号线）" and "公交：5、6、94路"

6. **Accessibility section**
   - `<SectionLabel>`: `t('accessibility')`
   - EN: "Wheelchair accessible entrance on Bloor St W. Elevators available on all floors. Accessible washrooms on every level."
   - ZH: "无障碍入口位于Bloor St W。各楼层均设有电梯及无障碍洗手间。"

7. **CTA** — `<Button variant="primary">` full-width.
   - Label: `t('book-tickets')` ("Book Tickets" / "立即订票")
   - onClick dispatches `{ type: 'GO_TO_BOOKING', exhibitionId: null }`

### Shared components used
- `Button` from `../ui`
- `SectionLabel` from `../ui`

## Navigation

| Action | Trigger | Result |
|--------|---------|--------|
| View plan visit | Click "Plan Your Visit →" on HomePage | `GO_TO_PLAN_VISIT` → `screen: 'plan-visit'` |
| Go back | "← Back" button | `GO_HOME` → `screen: 'home'` |
| Start booking | "Book Tickets" | `GO_TO_BOOKING` with `exhibitionId: null` |

## Testing

**6 tests in `PlanVisitPage.test.jsx`:**

1. Renders the page title ("Plan Your Visit")
2. Renders the hours section label
3. Renders the address text
4. "← Back" button dispatches `GO_HOME`
5. "Book Tickets" button dispatches `GO_TO_BOOKING` with `exhibitionId: null`
6. Shows Chinese page title ("参观信息") when lang is zh

Same render helper pattern as `ExhibitionPage.test.jsx` — wraps with mock `LanguageContext` and `BookingContext` providers directly (no reducers).
