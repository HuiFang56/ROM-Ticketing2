# Exhibition Page Design

## Goal

Build `ExhibitionPage` — the detail screen shown when a user taps an exhibition card on the home screen. Shows name, status, dates, price, description, and a "Book Tickets" CTA that starts the booking flow with the exhibition pre-selected.

## Data Changes

Add `descriptionEn` and `descriptionZh` to each exhibition object in `src/data/exhibitions.js`.

**Forbidden City:**
- `descriptionEn`: "Step inside the walls of China's imperial palace and discover five centuries of dynastic history. Over 200 rare artefacts travel outside China for the first time."
- `descriptionZh`: "走进中国皇宫的城墙，探索五个世纪的王朝历史。超过200件珍贵文物首次走出中国。"

**T.Rex Revealed:**
- `descriptionEn`: "Come face to face with the most complete T.rex skeleton ever found. Cutting-edge science and life-size reconstructions reveal how this apex predator lived and hunted."
- `descriptionZh`: "与有史以来最完整的霸王龙骨架面对面。前沿科学与真实比例的复原展示了这种顶级掠食者的生存与狩猎方式。"

**Egypt: The Time of Pharaohs:**
- `descriptionEn`: "Journey to the world of ancient Egypt through monumental sculpture, gilded treasures, and the stories of the pharaohs who shaped one of history's greatest civilisations."
- `descriptionZh`: "通过宏伟的雕塑、镀金的珍宝，以及塑造了人类最伟大文明之一的法老们的故事，踏上古埃及之旅。"

`imageUrl` remains as an empty string for all exhibitions. The hero handles the empty case gracefully.

## Architecture

**New files:**
- `src/components/ExhibitionPage/ExhibitionPage.jsx`
- `src/components/ExhibitionPage/ExhibitionPage.module.css`
- `src/components/ExhibitionPage/ExhibitionPage.test.jsx`

**Modified files:**
- `src/data/exhibitions.js` — add description fields
- `src/App.jsx` — replace placeholder with `<ExhibitionPage />`

No reducer changes needed. `GO_TO_EXHIBITION` already sets `state.selectedExhibitionId`.

## Component Design

### ExhibitionPage

Reads `state.selectedExhibitionId` from `useBooking()` to find the exhibition object. Reads `lang` from `useLang()` for language switching. Calls `isExhibitionOpen(ex, localTodayStr())` to determine open/coming-soon state.

**Layout (top to bottom):**

1. **Back button** — text: "← Back", dispatches `{ type: 'GO_HOME' }`. Sits above the hero, aligned left.

2. **Hero** — full-width, 200px tall.
   - If `ex.imageUrl` is set: `<img>` as cover, with a `linear-gradient(to bottom, transparent 30%, rgba(0,0,0,0.8))` overlay.
   - If `ex.imageUrl` is empty: black background (`--black`) with the same gradient overlay.
   - Exhibition name (`nameEn` or `nameZh`) rendered in white, bottom-left, font-weight 900.

3. **Meta row** — single row, space-between:
   - Left: `<Badge>` + date range text side by side, grey-60, small
   - Right: price (`+$N / person`), bold black

4. **Description** — `descriptionEn` or `descriptionZh` rendered as a `<p>`, normal body text.

5. **CTA** — `<Button variant="primary">` full-width.
   - Open exhibition: label "Book Tickets", onClick dispatches `{ type: 'GO_TO_BOOKING', exhibitionId: ex.id }`
   - Coming-soon exhibition: label "Coming Soon", `disabled`

6. **Sub-note** — small grey text below CTA: "Includes General Admission"

### Shared components used
- `Button` from `../ui`
- `Badge` from `../ui`

## Navigation

| Action | Trigger | Result |
|--------|---------|--------|
| View exhibition detail | Click card on HomePage | `GO_TO_EXHIBITION` → `screen: 'exhibition'`, `selectedExhibitionId: id` |
| Go back | "← Back" button | `GO_HOME` → `screen: 'home'` |
| Start booking | "Book Tickets" | `GO_TO_BOOKING` with `exhibitionId` → Step 3 pre-fills this exhibition |

## Testing

**6 tests in `ExhibitionPage.test.jsx`:**

1. Renders the exhibition name for the selected ID
2. Shows "Open" badge for an open exhibition
3. Shows "Coming soon" badge for a future exhibition
4. "Book Tickets" button dispatches `GO_TO_BOOKING` with the correct `exhibitionId`
5. "Book Tickets" button is disabled for coming-soon exhibitions
6. "← Back" dispatches `GO_HOME`

Language switching (EN→ZH) is covered by verifying `descriptionEn` renders in English — the same pattern used in existing ExhibitionList tests.
