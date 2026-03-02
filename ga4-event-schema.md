# Lila Trips — GA4 Event Schema

Complete event taxonomy covering the full user journey. Hand this file to Claude Code along with the implementation prompt below.

---

## Funnel Overview

```
Landing / Browse → Start Planning → Questionnaire → Generate → View Itinerary → Engage → Feedback → Refine → Premium
```

---

## 1. Discovery & Entry

These fire on the marketing/content pages that lead people into the planning flow.

| Event | Parameters | Where it fires |
|-------|-----------|----------------|
| `destination_selected` | `{ destination }` | User picks a destination on the destinations page |
| `plan_trip_clicked` | `{ source, destination }` | Any "Plan Your Trip" CTA (homepage hero, destination page, nav, etc.) — `source` tracks which one |
| `offerings_viewed` | `{ section }` | User scrolls through offerings/pricing sections |

---

## 2. Questionnaire Flow

These track progression through the trip planning questionnaire. Critical for identifying where people drop off.

| Event | Parameters | Where it fires |
|-------|-----------|----------------|
| `questionnaire_started` | `{ destination }` | User lands on the questionnaire / plan page |
| `questionnaire_step_completed` | `{ step_number, step_name, destination }` | Each step/section of the questionnaire is completed |
| `questionnaire_step_back` | `{ from_step, to_step }` | User navigates backward in the questionnaire |
| `questionnaire_abandoned` | `{ last_step, steps_completed, destination }` | User navigates away before completing (fire on beforeunload or route change) |
| `questionnaire_completed` | `{ destination, trip_duration, party_size, interests }` | User submits the final step — the moment before generation begins |

---

## 3. Itinerary Generation

These track the generation process itself — loading state, success, failure.

| Event | Parameters | Where it fires |
|-------|-----------|----------------|
| `itinerary_generation_started` | `{ destination }` | API call begins (loading screen appears) |
| `itinerary_generation_completed` | `{ destination, duration_ms, day_count }` | Itinerary successfully rendered on results page |
| `itinerary_generation_failed` | `{ destination, error_type }` | API call fails or JSON parsing fails |

---

## 4. Itinerary Engagement

These track how people interact with the itinerary content. High-signal for understanding what resonates.

| Event | Parameters | Where it fires |
|-------|-----------|----------------|
| `day_card_toggled` | `{ day_index, action: 'expanded' \| 'collapsed' }` | User opens/closes a day card |
| `timeline_detail_expanded` | `{ day_index, activity_title }` | User taps to expand activity details |
| `lila_pick_alternatives_viewed` | `{ day_index, category, pick_name }` | User opens the "other options" on a pick card |
| `external_link_clicked` | `{ name, url, link_type: 'activity' \| 'pick' \| 'alternative' }` | Any outbound link tap (critical for future affiliate tracking) |
| `trip_overview_day_clicked` | `{ day_index }` | User taps a day in the trip overview to scroll |
| `scroll_depth` | `{ depth: 25 \| 50 \| 75 \| 100 }` | Standard scroll milestones on the results page |
| `before_you_go_reached` | `{}` | User scrolled to the Before You Go section |
| `time_on_itinerary` | `{ duration_seconds }` | Fires on page unload — total time spent on results page |

---

## 5. Feedback & Refinement

These track the feedback loop and refinement conversion.

| Event | Parameters | Where it fires |
|-------|-----------|----------------|
| `day_feedback_given` | `{ day_index, status, has_note, note_length }` | User marks a day as "on track" or "I'd adjust" |
| `day_feedback_changed` | `{ day_index, from_status, to_status }` | User changes their feedback on a day |
| `trip_pulse_selected` | `{ pulse }` | User selects overall trip sentiment |
| `overall_note_entered` | `{ pulse, note_length }` | User types in the overall feedback textarea |
| `refinement_requested` | `{ iteration, days_approved, days_adjusted, pulse }` | User clicks "Refine this trip" |
| `refinement_completed` | `{ iteration, duration_ms }` | Refined itinerary successfully renders |
| `refinement_failed` | `{ iteration, error_type }` | Refinement API call fails |
| `trip_locked_in` | `{ iteration }` | User selects "Love it" on the trip pulse |

---

## 6. Premium Conversion

These track the paywall funnel.

| Event | Parameters | Where it fires |
|-------|-----------|----------------|
| `premium_gate_shown` | `{ iteration }` | User has used all free refinements and sees the upgrade card |
| `premium_features_viewed` | `{ scroll_to_features: true }` | User scrolls through the feature list on the gate card |
| `premium_upgrade_clicked` | `{ iteration }` | User clicks "Upgrade to Lila Pro" |
| `premium_upgrade_completed` | `{ plan_type, price }` | Payment successful (add when Stripe is connected) |
| `premium_upgrade_dismissed` | `{ iteration }` | User scrolls past or navigates away from the gate |

---

## 7. Session-Level

These fire once per session for segmentation and context.

| Event | Parameters | Where it fires |
|-------|-----------|----------------|
| `new_trip_clicked` | `{ source: 'header' \| 'bottom' \| 'start_over' }` | User clicks any "new trip" or "start over" link |

---

## Implementation Notes

- Use `window.gtag('event', event_name, params)` — GA4 is already initialized
- For `scroll_depth`, use an IntersectionObserver or scroll listener with throttling — only fire each threshold once per page load
- For `time_on_itinerary`, use `performance.now()` on mount and fire on `beforeunload`
- For `questionnaire_abandoned`, fire on route change (via useEffect cleanup) or beforeunload, but only if questionnaire_completed hasn't already fired
- Keep parameter values lowercase and snake_case for consistency in GA4 reports
- Don't send PII — no names, emails, or free-text feedback content in event params. `note_length` is fine, the actual note text is not.

---

## Claude Code Prompt

Paste this into Claude Code after dropping this file in your project root:

```
Read ga4-event-schema.md in the project root. This is the complete event
taxonomy for Lila Trips. I need you to implement all of these events
across the relevant files:

- Sections 1-3 (discovery, questionnaire, generation) go in the
  relevant pages and components — find the questionnaire flow and
  the generation/loading logic and instrument them
- Sections 4-6 (engagement, feedback, premium) go in ItineraryResults.jsx
- Section 7 (session-level) goes wherever the relevant buttons live

Use window.gtag('event', event_name, params) for all events.
GA4 is already initialized in the project.

For scroll_depth, add an IntersectionObserver approach on the results
page. For time_on_itinerary, track from mount to beforeunload.
For questionnaire_abandoned, fire on route change cleanup only if
questionnaire_completed hasn't fired yet.

Don't send any free-text user input in params — only lengths and
counts. Start with ItineraryResults.jsx since that's where most
events live, then move to the questionnaire flow.
```
