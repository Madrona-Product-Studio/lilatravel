# Lila Trips — Product Backlog

_Last updated: March 30, 2026. Living document — update as items are completed or added._

---

## 🔴 In Progress

- [ ] **`/trip/:shareToken` route** — viewer for shared itineraries. Required for save/share loop to work end-to-end. Currently falls back to session URL which breaks after session ends.

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
- [x] Threshold moments section — day spine with tags + ◈ moment, generated per day, sits after Sky & Season

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
