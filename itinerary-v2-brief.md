# ItineraryResultsV2 — Claude Code Brief

## Overview

Build `src/pages/ItineraryResultsV2.jsx` — a clean-start redesign of the itinerary results page.

- **Do not modify** `ItineraryResults.jsx` or any shared components
- Replace `src/pages/ItineraryResults.jsx` entirely with this new file — same route (`/results`), new design
- All business logic, data wiring, API calls, and state management are **identical** to the existing page — copy them directly
- This is a **layout and visual redesign only**

A reference HTML mockup lives at the repo root: `itinerary-v2.html`. Use it as the pixel-level visual reference for everything below.

---

## Design System

Pull all tokens from `@data/brand` as usual. Key values matching the mockup:

```js
const F   = "'Quicksand', sans-serif"
const FS  = "'Cormorant Garamond', serif"

const C = {
  warm:   '#F5F0E8',        // page background
  white:  '#FFFFFF',        // card backgrounds
  ink:    '#1C1C1A',        // titles, strong text
  body:   '#3D3D38',        // body text
  muted:  '#8C8C80',        // labels, secondary text
  sage:   '#6B7A72',        // neutral UI
  teal:   BrandC.oceanTeal,
  amber:  BrandC.goldenAmber,
  salmon: BrandC.sunSalmon,
  sea:    BrandC.seaGlass,
  sky:    BrandC.skyBlue,
  border: 'rgba(28,28,26,0.10)',
}

const DAY_COLORS = [C.amber, C.teal, C.sky, C.salmon, C.sea, '#8B7EC8', C.amber, C.teal]
```

Standard card treatment used throughout:
```js
{
  background: C.white,
  borderRadius: 8,
  border: `1px solid ${C.border}`,
  boxShadow: `0 2px 12px rgba(28,28,26,0.05)`,
}
```

---

## Page Layout

```
<sticky nav>                           ← existing pattern, cream bg + blur
<page — maxWidth 900px, centered, padding 0 20px 80px>
  <hero + intro>                       ← title, subtitle, intro paragraph
  <built-for-you tags>                 ← pill row, border-bottom below
  <CelestialSnapshot — reskinned>      ← light card, same data props
  <"Day by Day" section label>
  <two-col grid: 1fr 240px, gap 20px>
    <left: day cards>                  ← all days, scrollable
    <right: logistics panel>           ← sticky top 56px
  </two-col>
  <below-fold — maxWidth 580px, centered>
    ← TripPulse, RefineCTA, BeforeYouGo, ClosingNote
</page>
```

---

## Section Specs

### Hero + Intro

```jsx
// Teal eyebrow above title
fontSize: 10, fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: C.teal

// Title — itinerary.title
fontFamily: FS, fontSize: 'clamp(26px, 4.5vw, 36px)', fontWeight: 300, color: C.ink, lineHeight: 1.15

// Subtitle — itinerary.subtitle
fontFamily: FS, fontSize: 13, fontStyle: 'italic', color: C.muted

// Intro — itinerary.intro
fontFamily: F, fontSize: 13, color: C.body, lineHeight: 1.75, maxWidth: 600
```

### Built-for-You Tags

Pill row below intro, thin border-bottom separates from celestial section.

```jsx
// Source from formData: month, nights, travel style, intentions, pacing
// Pill style:
fontSize: 11, fontWeight: 500, color: C.body
background: C.white, border: `1px solid ${C.border}`, borderRadius: 20, padding: '4px 12px'
```

---

### CelestialSnapshot — RESKIN ONLY

**Keep all existing props and data exactly as-is.** Same `snapshot`, `celestial`, `weather`, `month` props. Visual treatment only changes.

New style — white card, light, matches page:

**Card:** standard card treatment

**Header** (padding 16px 20px 14px, border-bottom):
- Eyebrow `"CELESTIAL SNAPSHOT"` — 9px, 700, letterSpacing 0.2em, uppercase, `C.muted`
- Sky name: Cormorant Garamond, 22px, fontWeight 300, `C.ink`
- Description: 12px, `C.body`, lineHeight 1.6

**Events grid** (3 cols, border-bottom, cells border-right except last, padding 14px 18px):
- Emoji: 18px
- Name: 13px, fontWeight 600, `C.ink`
- Date: 10px, fontWeight 700, letterSpacing 0.06em, `C.amber`
- Note: 11px, `C.body`, lineHeight 1.5

**Weather row** (4 cols, border-bottom, cells border-right except last, padding 12px 18px):
- Label: 9px, 700, letterSpacing 0.14em, uppercase, `C.muted`
- Value: 16px, fontWeight 600, `C.ink`

**Pack note** (padding 12px 20px, flex row, gap 10px):
- Label `"PACK"`: 9px, 700, uppercase, `C.muted`
- Text: 12px, `C.body`, lineHeight 1.6

---

### Day Cards

All days render as cards. First two fully visible, remaining at `opacity: 0.5`.

**Card header** (padding 14px 18px 10px):
```jsx
// Eyebrow "DAY {n} · {date}"
fontSize: 10, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: DAY_COLORS[i]

// Title
fontFamily: FS, fontSize: 22, fontWeight: 300, color: C.ink, lineHeight: 1.15
```

**Activity rows** (padding 9px 18px, border-top between rows):
```jsx
time:    fontSize: 10, fontWeight: 400, color: C.muted, width: 44, paddingTop: 3
dot:     6px circle, background: DAY_COLORS[i], opacity: 0.45
name:    fontSize: 14, fontWeight: 500, color: C.ink
summary: fontSize: 12, color: C.body, lineHeight: 1.5, marginTop: 2
```

Each row clickable → opens `DetailPanel` (reused as-is, no changes).

**Row tint on reaction:**
- 🔥 → `background: rgba(200,148,26,0.04)`
- 👍 → `background: rgba(127,181,160,0.04)`
- Default → none; hover → `rgba(28,28,26,0.02)`

---

### Inline Reactions (Item 2)

Always visible below each activity name. Three pills: 🔥 Fire · 👍 · 👎

```jsx
// Default
fontSize: 10, fontWeight: 600, borderRadius: 20, padding: '3px 9px'
border: `1px solid ${C.border}`, background: 'none', color: C.muted

// 🔥 active
borderColor: C.amber, color: C.amber, background: 'rgba(200,148,26,0.06)'

// 👍 active
borderColor: C.sea, color: C.sea, background: 'rgba(127,181,160,0.06)'

// 👎 active
borderColor: C.muted, color: C.muted, background: 'rgba(140,140,128,0.06)'
```

State: `activityFeedback` map keyed by activity ID, lifted to page-level. Session-only (no localStorage). Same state map shared with `DetailPanel`.

**In DetailPanel:** reactions appear near the top, below activity type + time metadata, before the description body.

---

### Logistics Panel

White card, `position: sticky`, `top: 56px`.

**Header** (padding 12px 16px, border-bottom):
`"TRIP LOGISTICS"` — 10px, 700, letterSpacing 0.18em, uppercase, `C.ink`

**Three modules** (padding 13px 16px, border-bottom between):

Icon row per module: use existing `PlaneIcon`, `CarIcon`, `CategoryIcon (stay)` + module name (9px, 700, uppercase, `C.muted`)

**Flights:** airport + drive time copy · CTA: `"+ Add your flight →"` (placeholder)

**Rental Car:** car required copy · CTA: `"Browse rentals →"` (placeholder)

**Accommodations:**
- Lila Pick chip: `background: rgba(61,139,139,0.06)`, borderRadius 5, padding 6px 9px
  - Label `"LILA PICK"`: 8px, 700, `C.teal`
  - Name: 12px, fontWeight 500, `C.body`
- CTAs: `"See other options →"` (teal) + `"+ Add your reservation"` (muted)

**Hardcode logistics data for Zion, wire through a helper:**
```js
const DESTINATION_LOGISTICS = {
  zion: {
    flights: 'Fly into Las Vegas (LAS) — 2.5 hrs to Springdale.',
    car: 'A car is essential. Pick up at LAS airport.',
    accommodation: 'Cable Mountain Lodge, Springdale',
  }
}
function getLogistics(destination) {
  return DESTINATION_LOGISTICS[destination] || DESTINATION_LOGISTICS.zion
}
```

---

### Refinement Loading Screen (Item 3)

Update `RefiningOverlay`:

- Progress bar animating over ~90–120s, same style as the upfront loading screen (teal, cream bg, centered)
- Subtle count line below bar: `"Refinement {iteration} of 2"` or `"1 refinement remaining after this"`
  - fontSize: 12, color: `C.muted`, textAlign: center — orienting, not a warning

---

### Loading → Modal Transition (Item 1)

Update `FirstDraftModal`:

- Background: `C.warm`
- Backdrop: `rgba(0,0,0,0.15)`
- Border: `1px solid ${C.sage}15` — no heavy shadow
- Entrance: **fade-in only**, no translateY
- Typography: Cormorant Garamond headline, Quicksand body

---

### Mobile (< 640px)

- Two-col → single column
- Logistics moves below last day card, loses sticky
- Hero title + tags wrap naturally

---

## Reused As-Is — Do Not Modify

- `DetailPanel` — wire reactions to shared `activityFeedback` state
- `TripPulse`, `RefineCTA`, `BeforeYouGo`, `ClosingNote`
- All `trackEvent` analytics calls
- JSON5 parsing, markdown fallback, `enrichedDays` derivation
- `saveItinerary`, `saveFeedback`, `clearSession`
- `RefiningOverlay` (update only as described above)
- `FirstDraftModal` (update only as described above)

---

## Notes

- `itinerary-v2.html` at repo root is the visual source of truth
- Build this as `ItineraryResults.jsx`, replacing the existing file entirely — same route, new design
- Leave all other files untouched
- Confirm activity IDs are stable between inline cards and `DetailPanel` before wiring reaction sync
