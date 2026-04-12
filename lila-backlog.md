# Lila Trips — Product Backlog

_Last updated: March 30, 2026. Living document — update as items are completed or added._

---

## 🔴 In Progress

- [ ] **`/trip/:shareToken` route** — viewer for shared itineraries. Required for save/share loop to work end-to-end. Currently falls back to session URL which breaks after session ends.

- [x] **Card Deck system** (Apr 2026) — 30-card practice deck replaces the AI-generated mindfulness pick. Five-principle taxonomy (Presence / Oneness / Flow / Compassion / Reverence). Implemented per `claude-code-brief-card-deck.md`:
  - [x] Part 1 — Fixed latent `PRINCIPLES` color/glyph bug in `practicesService.js` (PracticesExplorer was reading `undefined` for both fields)
  - [x] Part 2 — Added Compassion as a fifth principle across `practicesService.js` (constant + retag of `b-p-metta`, `h-t-bhakti`, `h-p-kirtan`), `companionAssigner.js` `DAY_ARCHETYPES`, `Philosophy.jsx`, `rituals.js`, `PracticesExplorer.jsx` `PRINCIPLE_ORDER`, `Ethos.jsx`, and `App.jsx`. Fixed `intentionToPrinciple` key mismatch (was using stale `peace/transformation/connection/reset`; now matches the form's `reconnect/tune_in/slow_down/light_up`).
  - [x] Part 3 — Created `src/data/cardDeck.js` with `CARD_PRINCIPLES`, `ENERGY_TYPES`, `BEST_FOR_VOCAB`, and all 30 cards verbatim from `lila-card-deck-30.md`.
  - [x] Part 4 — Retired the AI-generated mindfulness pick from the system prompt and replaced it with `cardPrompt` + `cardConnection` per-day fields. Added `assignCardsToDays` / `assignCardToDay` to `companionAssigner.js` (archetype + principle + setting + energy + bestFor scoring, no-repeat across the trip).
  - [x] Part 5 — New components `src/components/guide/PracticeCardTeaser.jsx`, `PracticeCardModal.jsx`, and `PrincipleMarks.jsx` (five SVG marks). Wired into `ItineraryResults.jsx` — teaser replaces the old mindfulness callout in DayCard, modal opens with `liftForward` keyframe and flips between front/back faces.
  - [x] Cleanup (Apr 2026) — removed the unused `image` field from all 30 cards in `cardDeck.js` (approved card design uses principle color backgrounds with white SVG line art marks, no images).
  - [x] Cleanup (Apr 2026) — removed the orphaned `type === 'mindfulness'` branch from `DetailPanelContent` in `ItineraryResults.jsx`, plus the now-dead `IconLotus` icon, the `isMindfulness` panel-bg switch, and the `mindfulness` entry in `PICK_STYLES`. No `MindfulnessReactions` component existed in the codebase. The `quoteOriginal` block on the modal back face is correctly guarded against missing/empty values.
  - [x] Cleanup (Apr 2026) — verified that `assignCompanions` and `assignCardsToDays` were both being chained on every day in the `baseDays` memo. After Task 2, no UI code reads `companion.teaching` or `companion.practice` anywhere — only `day.companion?.card`. Removed the legacy `assignCompanions` call (and the dead `getPracticesForItinerary` + `ENTRIES` imports) from `ItineraryResults.jsx`. The legacy `assignCompanions` / `getCompanionsForTrip` exports remain in `companionAssigner.js` as unused service functions; safe to delete in a future cleanup if nothing else picks them up.
  - [x] Card modal sizing pass (Apr 2026) — expanded to 400×720px (immersive mobile feel), bumped principle zone type (mark 44px, name 11px, arc 16px, intention 10px), flip arrows to 20×20px, back face practice + connection text to 15px with increased padding.
  - [x] Wallet-style teaser redesign (Apr 2026) — replaced flat horizontal strip with stacked card widget (main face + two faded strips). Principle mark 28px, expand icon replaces flip arrow, "Today's Lila Meditation" label, 8px rounded corners (approved exception for card deck metaphor). Positioned between day header and timeline.
  - [x] Lila Meditations page (Apr 2026) — `/ethos/meditations`. Full-screen swipeable 37-screen deck explorer: cover, orientation, 5 chapter screens, 30 practice card screens with front/back flip. Wired to `cardDeck.js` + `PrincipleMarks.jsx`. Keyboard arrows, touch swipe, animated transitions. Standalone page (no Nav/Footer — immersive experience). Nav/entry point linking deferred.
  - [x] Meditations polish (Apr 2026) — card viewport matched to itinerary modal (400px wide, calc(100vh-80px) tall, 14px radius). Arrows desktop-only (hidden <768px, swipe on mobile), overlapping card edges with frosted glass background. Linen #E8E0D5 background, desk-feel shadow. Multiple legibility passes on orientation, chapter, and practice card screens.
  - [x] API injection — cardPrompt + cardConnection (Apr 2026). Two-pass approach: Pass 1 generates the itinerary as before. Pass 2 (`/api/generate-card-connections`) fires in the background after cards are assigned client-side, sends each day's title/terrain/activities + assigned card to Claude Sonnet, merges the returned `cardPrompt` + `cardConnection` into `enrichedDays` via state update. Non-blocking, fail-silent. "On Your Trip" section on card back populates after ~2-3s.
  - [x] Static card connections (Apr 2026) — one `connection` field per card in `cardDeck.js`, destination-paired for best terrain fit (Zion for canyon/river, Olympic for forest, Big Sur/Kaua\u02BBi for coast, Joshua Tree for desert). 30 connections written. Meditations back face renders "On Your Trip" section when populated. Script at `scripts/generate-card-connections.js` reusable for future cards (requires `ANTHROPIC_API_KEY`).

---

## 🟡 Up Next

- [ ] **`/my-trips` page** — simple page listing a user's saved itineraries as cards (destination, title, date, "View" button). Completes the save loop.
- [ ] **Verify `feedback_events` writes** — confirm the feedback_events Supabase table is receiving rows on refinement (got sidetracked, never fully confirmed).
- [ ] **RLS / Supabase security** — write policies that allow anon inserts but block unauthenticated reads. Prerequisite for auth work.
- [ ] **Apply guide collapsed-sections UX to remaining guides** — Zion is the reference implementation. As guide UX evolves post-launch, track changes here and apply to: Big Sur, Joshua Tree, Kauaʻi, Olympic Peninsula, Vancouver Island. Apply as a batch once Zion pattern is stable.

---

## 🟢 Destinations

- [ ] **Banff guide** — optimal window late June–early October (or Jan–March for winter framing).
- [ ] **Sedona, Maui/Haleakalā, Glacier, Taos, Acadia** — potential additions, not yet committed.

---

## 🔵 Recommendation Engine

- [ ] **Pattern analysis query** — build a simple Supabase query or dashboard view to surface what's getting thumbed down/up by traveler profile. Needed before prompt injection is meaningful.
- [ ] **Recommendation bias layer** — inject aggregated feedback signal into itinerary generation prompt as a `recommendationBias` object.
- [ ] **Connect itinerary feedback to recommendations** — wire activity_feedback, day_feedback, and pulse data back into the Claude API generation prompt.

---

## 🔵 Auth

- [ ] **Supabase magic link auth** — email-based login, no password. Needed for true saved itineraries.
- [ ] **Session claiming** — on login, backfill `user_id` on all anonymous sessions, itineraries, and feedback_events rows matching the user.
- [ ] **Protected `/my-trips` page** — show only the logged-in user's itineraries.

---

## 🔵 Services & Data

- [ ] **Night sky service** — Milky Way visibility, meteor shower calendar, Bortle scale ratings. Optional Astronomy API integration.
- [ ] **Tides service** — for coastal destinations.
- [ ] **Air quality service** — useful for fire season destinations.
- [ ] **Events/festivals service** — surface local events during travel window.
- [ ] **Permits service** — structured permit data (Angels Landing, etc.) rather than narrative text.
- [ ] **Bhakti Yoga Sutras** — add to practices database as source for new entries.
- [ ] **Desert Institute integration** — Joshua Tree. Contact desertinstitute@joshuatree.org for Humanitix API key, or build static curated list.

---

## 🔵 Features

- [ ] **PDF/print** — `window.print()` + `@media print` approach. Deferred.
- [ ] **Destination map** — Mapbox Studio explored, deferred.
- [ ] **Threshold Trips** — small group journeys timed to natural crescendos (solstices, equinoxes, lunar cycles). Product tier, not yet designed.
- [ ] **Offline/PWA itinerary view** — Utah itinerary (`/itineraries/utah`) kept as inspiration for a mobile-centric on-trip view.

---

## 🔵 Tech

- [ ] **Next.js App Router migration** — in backlog, not yet started.
- [ ] **View Transitions API** — in backlog, not yet started.

---

## ✅ Completed

### Infrastructure & Foundation
- [x] Supabase project setup + schema (sessions, itineraries, feedback_events)
- [x] Phase 1 feedback capture — anonymous sessions writing to Supabase
- [x] JSON5 parse hardening — strips code fences + trailing commas before parse
- [x] Google Analytics (G-H3TCF22GPL)
- [x] SEO meta tags, robots.txt, sitemap.xml (react-helmet-async)
- [x] NPS API key moved server-side via proxy
- [x] Fetch timeouts, safe JSON parsing, sessionStorage error handling
- [x] API input hardening — email validation, destination whitelist, share token format
- [x] Bump serverless maxDuration to 300s + frontend fetch timeouts to 310s
- [x] NDJSON keepalive streaming — prevents mobile carrier timeouts
- [x] **Tailwind CSS migration** (Mar 29) — 46 files, -4,832 net lines, brand tokens wired, responsive breakpoints replace JS resize listeners

### Core Product
- [x] PlanMyTrip onboarding flow + persona matching
- [x] ItineraryResults — day cards, feedback, refinement, premium gate
- [x] Practices Explorer — 43+ entries, browse + matrix views
- [x] Generating/loading screen
- [x] Surprise Me destination feature in trip planner
- [x] Editable trip title (pencil icon)
- [x] Collapsible Sky & Season panel

### Itinerary Generation & Refinement
- [x] Reaction-based day feedback (love/swap) replaces 3-button system
- [x] Location-anchored day scaffold in refinement prompt
- [x] Refinement summary modal
- [x] Structural logistics constraints sent to Claude
- [x] Fix: refinement overlay stuck on "Finalizing"
- [x] Fix: 400 error on reaction-based feedback
- [x] Activity alternatives + SwapModal for activity swaps
- [x] "Lock this in" / "Show alternatives" on all curatable activities
- [x] Mindfulness picks rendered inline in DayCard
- [x] "Sleep in" as required alternative for early morning activities
- [x] Accommodation alternatives in detail panel
- [x] Threshold moments section — all days shown in spine, travel pills for arrival/departure, white card treatment matching Sky & Season
- [x] Logistics card collapse — collapsed by default, chevron toggle, matches Sky & Season pattern
- [x] Built For You pill collapse — show 3 pills + "+ N more" toggle on itinerary results page
- [x] Sky & Season — collapsed by default, chevron moved to bottom bar, avg temp fix, daylight duration fix
- [x] Day by Day accordion — collapsible days matching guide page pattern, Day 1 auto-expanded, snapshot summaries
- [x] Welcome modal redesign — white bg, four-row icon layout, smooth fade-in entry transition
- [x] Logistics — open by default on first load, alternative accommodations surfaced via existing alternatives panel
- [x] Mindfulness practice card — full border on all four sides
- [x] Logistics — surface destination-specific airport and drive time info in flights and rental car rows
- [x] Iterations pill — replace Save pill with trip iteration history, ID fallback on share route, logistics baseline fix
- [x] Sense of Place redesign (Zion) — inline park cards, NPS links, Places That Stop You highlights, flat wildlife grid

### Trip Management & Saving
- [x] Save This Trip moved to header button
- [x] Nav backpack icon for multi-trip management
- [x] Suitcase dropdown replaces backpack icon (localStorage-based)
- [x] Eager share token generation

### Destinations
- [x] Zion guide live (+ Utah corridor: Bryce Canyon, Capitol Reef)
- [x] Joshua Tree guide live (+ corridor: Death Valley, Mojave, Indian Canyons, Salton Sea) — Mar 10–14
- [x] Big Sur guide live
- [x] Olympic Peninsula guide live
- [x] Vancouver Island guide live
- [x] Kauaʻi guide live
- [x] All 6 destinations enabled for trip planning + marked available on homepage

### Guide Page Features
- [x] Structured JSON data for accommodations & restaurants across all 6 destinations
- [x] Detail modals with price, amenities, booking links, season info
- [x] Lila Pick curation — one per tier (elemental/rooted/premium) plus select extras
- [x] Give Back & Tread Lightly sections across all 6 guides
- [x] Standardized section naming ("Sleep", "Sense of Place")
- [x] ParkPassport → accordion ParkCard across all guides
- [x] CSS sticky nav + mobile TOC across all 6 guides
- [x] WhisperBar CTA deep-linking to trip planner
- [x] Ambient breath animation on guide pages (CSS backgroundImage approach, mobile Safari fixed)
- [x] **Accommodation audit** (Mar 30) — all six destination guides updated with revised picks, tier assignments (elemental/rooted/premium), new properties (Reset Hotel, Hotel Wren, JT Retreat Center Bungalows, Hanalei Bay Resort, The Palmwood, Tin Wis Resort, Ocean Village Resort, Crystal Cove, Sol Duc Hot Springs Resort, Lake Quinault Lodge, Colette's B&B, Hoh Valley Cabins), and verified links
- [x] **Food/Culture split** (Mar 30) — all six destinations migrated to separate Eat and Experience JSON files (`*-eat.json` + `*-experience.json`), culled restaurants, updated lilaPick values, created 36 new experience entries with full URL registry updates
- [x] **Breathe section** (Mar 30) — all six destinations migrated to `*-breathe.json` with Practice/Soak/Restore tier framework, designated picks, and new yoga studios added (Earth Yoga & Spa JT, Olympic Iyengar Yoga OP, Black Coral Yoga KA, Yoga Shala by the Sea BS)
- [x] **Move section** (Mar 30) — all six destinations restructured into per-destination Hike/Water/Ride/Climb sections with new `*-move.json` files. New entries: Zion e-bike + canyoneering, JT rock climbing + cycling, Big Sur kayaking + Highway 1 cycling, Kauai surfing + coastal path, VI surfing + bike path, OP tide pools + Hurricane Ridge cycling
- [x] **UI wiring** (Mar 30) — Experience, Breathe, and Move sections now rendering in all six destination guides with tier tag system (TierItem/TierLegend shared components). Food & Culture split into Eat + Experience. Old hardcoded ListItems replaced with JSON-driven content. Section order standardized. Orphaned restaurant JSONs removed.
- [x] **TierFilter component** (Mar 30) — guide section filter with filled-checkbox design, desktop horizontal / mobile stacked, replaces TierLegend in Move and Breathe sections across all six guides
- [x] **Content density pass** (Mar 30) — list views trimmed to highlights[0] for Move, Breathe, Experience. Full highlights array rendered as bullet points in detail sheet. Tier info grid (difficulty, distance, duration, tradition, operator, booking) added to detail sheet for Move and Breathe items.

### Practices & Wisdom
- [x] Updated quotes for Kirtan, Threshold Ceremony, Talking Circle
- [x] Practice detail card quote styling
- [x] Radar chart spacing on profile screen
- [x] Info icon replaces "Not you?" link on persona card

### UX Polish
- [x] Font size bump across entire app for readability
- [x] CelestialDrawer typography refresh
- [x] Uniform destination card sizing
- [x] TravelYourWay responsive + shared component redesign
- [x] Contact page: mailto → Resend-powered form
