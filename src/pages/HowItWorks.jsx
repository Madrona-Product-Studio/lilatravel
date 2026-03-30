// ═══════════════════════════════════════════════════════════════════════════════
// PAGE: HOW IT WORKS
// ═══════════════════════════════════════════════════════════════════════════════
//
// Structure:
//   1. Hero intro — "Travel your way"
//   2. A Day With Lila — sample itinerary convergence moment
//   3. Four Ways In — DIY / Trip Planner / Threshold Trips / Custom
//   4. Upcoming Threshold Trips
//   5. Bottom CTA
//
// ═══════════════════════════════════════════════════════════════════════════════

import { Link } from 'react-router-dom';
import { Nav, Footer, FadeIn, PageHeader, TravelYourWay } from '@components';
import TripCard from '@components/TripCard';
import { C } from '@data/brand';
import { allTrips } from '@data/trips';
import { trackEvent } from '@utils/analytics';

// ─── Sample Itinerary ───────────────────────────────────────────────────────
const sampleItinerary = [
  { time: "8:00 AM",  title: "Morning yoga overlooking the canyon",            thread: "practice", color: "#D4A853" },
  { time: "9:30 AM",  title: "Breakfast at a local farm café",                 thread: "terrain",  color: "#7DB8A0" },
  { time: "11:00 AM", title: "Guided hike through the Narrows",               thread: "terrain",  color: "#7DB8A0" },
  { time: "2:00 PM",  title: "Lunch & rest at the canyon lodge",              thread: "terrain",  color: "#7DB8A0" },
  { time: "4:00 PM",  title: "Breathwork session at the river's edge",        thread: "practice", color: "#D4A853" },
  { time: "5:30 PM",  title: "Golden hour walk with a local steward",         thread: "terrain",  color: "#7DB8A0" },
  { time: "7:30 PM",  title: "Farm dinner under open sky in Torrey",          thread: "terrain",  color: "#7DB8A0" },
  { time: "9:30 PM",  title: "Stargazing from Under Canvas",                  thread: "element",  color: "#6BA4B8" },
];

// (Trip data now imported from @data/trips)


export default function HowItWorksPage() {
  return (
    <>
      <Nav />

      <PageHeader
        eyebrow="Ways to Travel"
        title={<>From inspiration <span style={{ fontStyle: "normal", color: "#5a6a78" }}>to experience.</span></>}
        subtitle="However you like to move through the world, there's a way in. We handle the complexity so you can focus on being there."
        accentColor={C.oceanTeal}
        align="center"
      />

      {/* ══ FOUR WAYS IN ═════════════════════════════════════════════════════ */}
      <TravelYourWay showHeading={false} />

      {/* ══ A DAY WITH LILA ══════════════════════════════════════════════════ */}
      <section className="pt-[48px] px-[52px] pb-[80px] bg-cream">
        <div className="max-w-[1100px] mx-auto">
          <FadeIn>
            <div className="text-center mb-[48px]">
              <span className="font-body text-[11px] font-bold tracking-[0.22em] uppercase text-ocean-teal block mb-3">
                Woven Together
              </span>
              <h2 className="font-serif text-[clamp(28px,4vw,42px)] font-light text-dark-ink mb-4">
                A day with Lila
              </h2>
              <p className="font-serif text-[18px] not-italic text-[#5a6a78] max-w-[480px] mx-auto">
                Here's what it looks like when the threads come together. Every day is a composition — not a schedule.
              </p>
            </div>
          </FadeIn>

          {/* Sample itinerary card */}
          <FadeIn delay={0.15}>
            <div className="max-w-[680px] mx-auto bg-white border border-stone overflow-hidden">
              {/* Itinerary header */}
              <div className="py-[28px] px-[40px] border-b border-stone flex items-baseline gap-3">
                <span className="font-serif text-[14px] font-normal text-[#9aa8b2] not-italic">
                  Sample day
                </span>
                <span className="text-[12px] text-[#c0c8cd]">·</span>
                <span className="font-serif text-[14px] font-normal text-[#9aa8b2] not-italic">
                  Zion Canyon, Utah
                </span>
              </div>

              {/* Timeline */}
              <div className="py-[32px] px-[40px]">
                {sampleItinerary.map((item, i) => (
                  <div
                    key={i}
                    className="grid grid-cols-[68px_6px_1fr] gap-[18px] items-start"
                    style={{ paddingBottom: i < sampleItinerary.length - 1 ? 24 : 0 }}
                  >
                    <span className="font-body text-[12px] font-semibold text-[#9aa8b2] tracking-[0.06em] pt-[2px] text-right">
                      {item.time}
                    </span>

                    <div className="flex flex-col items-center pt-[5px]">
                      <div
                        className="w-[6px] h-[6px] rounded-full shrink-0"
                        style={{ background: item.color }}
                      />
                      {i < sampleItinerary.length - 1 && (
                        <div
                          className="w-px flex-1 min-h-[20px]"
                          style={{
                            background: `linear-gradient(to bottom, ${item.color}40, ${sampleItinerary[i+1].color}40)`,
                          }}
                        />
                      )}
                    </div>

                    <span className="font-body text-[14px] font-normal text-dark-ink leading-[1.6]">
                      {item.title}
                    </span>
                  </div>
                ))}
              </div>

              {/* Thread legend */}
              <div className="py-[20px] px-[40px] border-t border-stone flex gap-6 flex-wrap">
                {[
                  { name: "Sacred Terrain", color: "#7DB8A0" },
                  { name: "Ancient Practices", color: "#D4A853" },
                  { name: "Elemental Encounters", color: "#6BA4B8" },
                ].map(t => (
                  <div key={t.name} className="flex items-center gap-2">
                    <div
                      className="w-[6px] h-[6px] rounded-full"
                      style={{ background: t.color }}
                    />
                    <span className="font-body text-[11px] font-semibold tracking-[0.12em] uppercase text-[#9aa8b2]">
                      {t.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ══ UPCOMING GROUP TRIPS ═════════════════════════════════════════ */}
      <section id="upcoming" className="py-[80px] px-[52px] bg-cream">
        <div className="max-w-[1100px] mx-auto">
          <FadeIn>
            <div className="mb-[40px]">
              <span className="font-body text-[11px] font-bold tracking-[0.22em] uppercase text-sun-salmon block mb-3">
                Upcoming Experiences
              </span>
              <h2 className="font-serif text-[clamp(28px,4vw,42px)] font-light text-dark-ink mb-4">
                Tuned to Earth Rhythms
              </h2>
              <p className="font-body text-[15px] text-[#5a6a78] leading-[1.8] max-w-[580px]">
                Journeys timed to equinoxes, solstices, and seasonal turning points —
                when a place crosses into its most powerful window.
              </p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[28px]">
            {allTrips.slice(0, 3).map((trip, i) => (
              <FadeIn key={trip.slug} delay={i * 0.1}>
                <TripCard trip={trip} />
              </FadeIn>
            ))}
          </div>

          <FadeIn delay={0.3}>
            <div className="mt-[36px]">
              <Link to="/group-trips" className="underline-link" onClick={() => trackEvent('offering_cta_clicked', { offering: 'view_all_trips' })}>View All Trips</Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ══ BOTTOM CTA ═══════════════════════════════════════════════════════ */}
      <section className="pt-0 px-[52px] pb-[80px] bg-cream">
        <div className="max-w-[900px] mx-auto">
          <FadeIn delay={0.2}>
            <div className="py-[48px] px-[40px] bg-dark-ink text-center">
              <span className="eyebrow text-sky-blue">Not sure where to start?</span>
              <h3 className="font-body text-[clamp(22px,3vw,32px)] font-light text-white mb-5">
                Pick a destination. The guide is free.
              </h3>
              <Link to="/destinations" className="underline-link underline-link-light" onClick={() => trackEvent('offering_cta_clicked', { offering: 'explore_destinations' })}>Explore Destinations</Link>
            </div>
          </FadeIn>
        </div>
      </section>

      <Footer />
    </>
  );
}
