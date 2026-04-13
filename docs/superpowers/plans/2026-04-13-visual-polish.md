# Visual Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refine the app's visual quality (typography, dividers, hero height, broken token fixes) across all screens using the Refined B&W direction.

**Architecture:** All changes are CSS-only — no JSX, no context, no reducer changes. Three tasks grouped by dependency: (1) tokens + shared UI components, (2) HomePage components, (3) BookingPage + ConfirmationPage broken-token fixes. No new tests needed; run `npx vitest run` after each task to confirm no regression.

**Tech Stack:** CSS Modules, CSS custom properties (`--tokens`), Vitest for regression checks

---

### Task 1: Foundation tokens + shared UI components

**Files:**
- Modify: `src/index.css`
- Modify: `src/components/ui/Button.module.css`
- Modify: `src/components/ui/SectionLabel.module.css`
- Modify: `src/components/ui/Badge.module.css`
- Modify: `src/components/Header/Header.module.css`

- [ ] **Step 1: Add two new tokens to `src/index.css`**

In the `:root` block, after the existing `--grey-05` line, add:

```css
  --grey-10: #e8e8e8;
```

And after `--space-sm: 8px;`, add:

```css
  --space-mid: 12px;
```

The full `:root` colour + spacing section should now look like:

```css
:root {
  --black:   #000000;
  --white:   #ffffff;
  --grey-60: #666666;
  --grey-30: #b3b3b3;
  --grey-10: #e8e8e8;
  --grey-05: #f5f5f5;

  --font: 'ABCMonumentGrotesk', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;

  --space-xs:  4px;
  --space-sm:  8px;
  --space-mid: 12px;
  --space-md:  16px;
  --space-lg:  24px;
  --space-xl:  32px;
  --space-2xl: 48px;

  --radius: 0;
  --max-width: 480px;
  color-scheme: light;
}
```

- [ ] **Step 2: Update `src/components/ui/Button.module.css`**

Replace the entire file with:

```css
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 14px 20px;
  font-family: var(--font);
  font-size: 15px;
  font-weight: 700;
  letter-spacing: 0.3px;
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

- [ ] **Step 3: Update `src/components/ui/SectionLabel.module.css`**

Replace the entire file with:

```css
.label {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: var(--grey-60);
}
```

- [ ] **Step 4: Update `src/components/ui/Badge.module.css`**

Replace the entire file with:

```css
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
  background: var(--white);
  color: var(--grey-60);
  border: 1px solid var(--grey-30);
}
```

- [ ] **Step 5: Update `src/components/Header/Header.module.css`**

Change only the `border-bottom` line in `.header`:

```css
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-sm) var(--space-md);
  background: var(--white);
  border-bottom: 1px solid var(--grey-30);
}
```

The rest of the file is unchanged:

```css
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

- [ ] **Step 6: Run the full test suite**

```
npx vitest run
```

Expected: All tests pass. CSS changes do not affect test assertions.

- [ ] **Step 7: Commit**

```bash
git add src/index.css src/components/ui/Button.module.css src/components/ui/SectionLabel.module.css src/components/ui/Badge.module.css src/components/Header/Header.module.css
git commit -m "style: add grey-10/space-mid tokens; refine Button, SectionLabel, Badge, Header"
```

---

### Task 2: HomePage visual improvements

**Files:**
- Modify: `src/components/HomePage/HeroSection.module.css`
- Modify: `src/components/HomePage/ExhibitionList.module.css`

- [ ] **Step 1: Update `src/components/HomePage/HeroSection.module.css`**

Replace the entire file with:

```css
.hero {
  position: relative;
  height: 52vh;
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
  font-size: 11px;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: rgba(255,255,255,0.65);
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
  display: block;
  width: 100%;
  margin-top: var(--space-lg);
}

.planBtn {
  display: block;
  width: 100%;
  margin-top: var(--space-sm);
}
```

- [ ] **Step 2: Update `src/components/HomePage/ExhibitionList.module.css`**

Replace the entire file with:

```css
.label {
  padding: var(--space-md) var(--space-md) var(--space-sm);
}

/* Featured card */
.featured {
  width: 100%;
  display: block;
  text-align: left;
  padding: 0;
}

.featured:focus-visible {
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
  border-bottom: 1px solid var(--grey-30);
}

.date {
  font-size: 12px;
  color: var(--grey-60);
}

/* Compact rows */
.row {
  display: flex;
  width: 100%;
  text-align: left;
  padding: 0;
  align-items: stretch;
  border-bottom: 1px solid var(--grey-10);
}

.row:focus-visible {
  outline: 2px solid var(--black);
  outline-offset: 2px;
}

.rowImg {
  width: 80px;
  height: 64px;
  object-fit: cover;
  flex-shrink: 0;
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
  font-size: 14px;
  font-weight: 700;
  color: var(--black);
  line-height: 1.3;
  display: block;
}

.rowDate {
  font-size: 12px;
  color: var(--grey-60);
  display: block;
}

.rowRight {
  padding: var(--space-sm) var(--space-md) var(--space-sm) 0;
  display: flex;
  align-items: center;
}
```

- [ ] **Step 3: Run the full test suite**

```
npx vitest run
```

Expected: All tests pass.

- [ ] **Step 4: Commit**

```bash
git add src/components/HomePage/HeroSection.module.css src/components/HomePage/ExhibitionList.module.css
git commit -m "style: refine HeroSection height/tagline and ExhibitionList dividers"
```

---

### Task 3: Fix broken tokens in BookingPage + ConfirmationPage

**Context:** `Step1Date.module.css`, `Step5Payment.module.css`, and `ConfirmationPage.module.css` reference tokens (`--text-primary`, `--bg-card`, `--gold`, `--radius-lg`, etc.) that are not defined anywhere in the project. These screens currently render using browser defaults for those properties. This task rewrites each file to use the actual design system tokens.

**Files:**
- Modify: `src/components/BookingPage/Step1Date.module.css`
- Modify: `src/components/BookingPage/Step5Payment.module.css`
- Modify: `src/components/ConfirmationPage/ConfirmationPage.module.css`

- [ ] **Step 1: Replace `src/components/BookingPage/Step1Date.module.css`**

```css
/* src/components/BookingPage/Step1Date.module.css */
.wrapper { padding: var(--space-md); }

.title { font-size: 18px; font-weight: 700; color: var(--black); margin: 0 0 4px; }
.subtitle { font-size: 14px; color: var(--grey-60); margin: 0 0 var(--space-md); }

.calendar { background: var(--grey-05); border-radius: var(--radius); padding: var(--space-md); }

.monthNav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-sm);
}
.monthLabel { font-size: 15px; font-weight: 600; color: var(--black); }
.navBtn {
  width: 32px; height: 32px;
  border: none; border-radius: var(--radius);
  background: var(--grey-05);
  color: var(--black);
  font-size: 18px; cursor: pointer;
}
.navBtn:disabled { opacity: 0.3; cursor: default; }

.grid { width: 100%; }
.headerRow { display: grid; grid-template-columns: repeat(7, 1fr); text-align: center; margin-bottom: 4px; }
.dayHeader { font-size: 11px; font-weight: 600; color: var(--grey-60); padding: 4px 0; }
.dayHeaderClosed { color: var(--grey-60); }

.daysGrid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 2px; }

.day {
  aspect-ratio: 1;
  border: none;
  border-radius: var(--radius);
  background: transparent;
  font-size: 14px;
  color: var(--black);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}
.day:hover:not(:disabled) { background: var(--grey-05); }
.dayDisabled { color: var(--grey-60); cursor: default; }
.daySelected { background: var(--black) !important; color: var(--white); font-weight: 700; }

.selectedNote {
  margin: var(--space-sm) 0;
  padding: 10px 14px;
  background: var(--grey-05);
  border-radius: var(--radius);
  font-size: 14px;
  color: var(--black);
}

.actions { margin-top: var(--space-md); }
.continueBtn { width: 100%; }
```

- [ ] **Step 2: Replace `src/components/BookingPage/Step5Payment.module.css`**

```css
/* src/components/BookingPage/Step5Payment.module.css */
.wrapper { padding: var(--space-md); }
.title { font-size: 18px; font-weight: 700; color: var(--black); margin: 0 0 var(--space-md); }

.summary {
  background: var(--grey-05); border-radius: var(--radius); padding: 14px;
  margin-bottom: var(--space-md);
}
.summaryLabel {
  font-size: 12px; font-weight: 600; color: var(--grey-60);
  letter-spacing: 1px; text-transform: uppercase; margin-bottom: 8px;
}
.summaryRow {
  display: flex; justify-content: space-between;
  font-size: 13px; color: var(--grey-60); margin-bottom: 3px;
}
.summaryDivider { height: 1px; background: var(--grey-30); margin: 6px 0; }
.summaryTotal {
  display: flex; justify-content: space-between;
  font-size: 16px; font-weight: 700; color: var(--black);
}

.methodLabel {
  padding: var(--space-md) 0 var(--space-sm);
}
.methods { display: flex; gap: 10px; margin-bottom: var(--space-md); }
.method {
  flex: 1; padding: 14px 10px;
  background: var(--grey-05);
  border: 1.5px solid var(--grey-30);
  border-radius: var(--radius); cursor: pointer;
  display: flex; flex-direction: column; align-items: center; gap: 4px;
}
.methodSelected { border-color: var(--black); }
.methodEmoji { font-size: 22px; }
.methodName { font-size: 12px; font-weight: 600; color: var(--black); }

.qrBox {
  background: var(--grey-05); border-radius: var(--radius); padding: var(--space-md);
  text-align: center; margin-bottom: var(--space-md);
}
.qrPlaceholder {
  width: 120px; height: 120px; background: var(--grey-10);
  border-radius: var(--radius); margin: 0 auto 8px;
}
.qrHint { font-size: 12px; color: var(--grey-60); margin: 0; }

.deepLink {
  display: block; width: 100%; padding: 15px; text-align: center;
  background: #07c160; color: #fff;
  border-radius: var(--radius); font-size: 16px; font-weight: 700;
  text-decoration: none; margin-bottom: var(--space-md);
}

.actions { display: flex; gap: 10px; }
.backBtn { flex: 1; }
.confirmBtn { flex: 2; }
```

- [ ] **Step 3: Replace `src/components/ConfirmationPage/ConfirmationPage.module.css`**

```css
/* src/components/ConfirmationPage/ConfirmationPage.module.css */
.page {
  padding: var(--space-md);
  text-align: center;
  max-width: var(--max-width);
  margin: 0 auto;
}

.icon {
  width: 64px; height: 64px; border-radius: 50%;
  background: var(--black); color: var(--white);
  font-size: 28px; font-weight: 700;
  display: flex; align-items: center; justify-content: center;
  margin: var(--space-md) auto var(--space-sm);
}

.heading { font-size: 22px; font-weight: 800; color: var(--black); margin: 0 0 6px; }
.emailSent { font-size: 15px; color: var(--grey-60); margin: 0; }
.email { font-size: 15px; font-weight: 600; color: var(--black); margin: 2px 0 var(--space-md); }

.card {
  background: var(--grey-05);
  border-radius: var(--radius);
  border: 1px solid var(--grey-30);
  padding: var(--space-md);
  text-align: left;
  margin-bottom: var(--space-md);
}

.orderId {
  font-size: 12px; font-weight: 600; color: var(--grey-60);
  letter-spacing: 1px; text-transform: uppercase; margin-bottom: 10px;
}

.row {
  display: flex; justify-content: space-between;
  font-size: 14px; color: var(--grey-60); margin-bottom: 4px;
}
.row span:last-child { color: var(--black); font-weight: 500; }

.divider { height: 1px; background: var(--grey-30); margin: 8px 0; }

.total {
  font-size: 16px; font-weight: 700; color: var(--black);
}
.total span:last-child { color: var(--black); }

.note {
  font-size: 13px; color: var(--grey-60);
  margin: 0 0 var(--space-md);
  line-height: 1.5;
}

.homeBtn {
  display: block;
  width: 100%;
  margin-top: var(--space-lg);
}
```

- [ ] **Step 4: Run the full test suite**

```
npx vitest run
```

Expected: All tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/components/BookingPage/Step1Date.module.css src/components/BookingPage/Step5Payment.module.css src/components/ConfirmationPage/ConfirmationPage.module.css
git commit -m "fix: replace undefined CSS tokens in Step1Date, Step5Payment, ConfirmationPage"
```
