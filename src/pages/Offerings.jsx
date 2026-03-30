// ═══════════════════════════════════════════════════════════════════════════════
// PAGE: OFFERINGS
// ═══════════════════════════════════════════════════════════════════════════════

import { Link } from 'react-router-dom';
import { Nav, Footer, FadeIn, PageHeader, TravelYourWay } from '@components';
import { C } from '@data/brand';
import { trackEvent } from '@utils/analytics';

// ─── The Braid: Three Threads ────────────────────────────────────────────────
const threads = [
  {
    eyebrow: "The Where",
    name: "Sacred Terrain",
    color: C.goldenAmber,
    description: "Iconic landscapes chosen for their capacity to dissolve the ordinary. Ancient canyons, high desert silence, wild Pacific coastlines. The land itself is the first teacher.",
    ingredients: ["Canyon trails at dawn", "High desert plateaus", "Old-growth forest", "Wild coastlines", "Alpine meadows", "River corridors"],
    // Replace with P.xxx when photos are ready
    photo: null,
    gradient: "linear-gradient(165deg, #a0522d 0%, #6b3520 40%, #c0714a 100%)",
  },
  {
    eyebrow: "The Within",
    name: "The Practice",
    color: C.seaGlass,
    description: "Ancient wellness traditions woven into every day. Not bolted on as amenities — built in as the reason you came. The inner journey that makes the outer one matter.",
    ingredients: ["Sunrise yoga", "Canyon meditation", "Breathwork sessions", "Cold plunges", "Stargazing ceremonies", "Mindful movement"],
    photo: null,
    gradient: "linear-gradient(165deg, #4a7a6a 0%, #2d5a4a 40%, #7fb5a0 100%)",
  },
  {
    eyebrow: "The Around",
    name: "The Ritual",
    color: C.sunSalmon,
    description: "Every detail is intentional. Farm dinners under open sky. Lodging that puts you inside the landscape. Conservation work that gives back. Community that goes deeper than small talk.",
    ingredients: ["Farm-to-table dinners", "Unique accommodations", "Guided naturalist hikes", "Conservation service", "Local artisan visits", "Community gatherings"],
    photo: null,
    gradient: "linear-gradient(165deg, #c4593c 0%, #8b3a2a 40%, #d4855a 100%)",
  },
];

// ─── Sample Itinerary (convergence moment) ───────────────────────────────────
const sampleItinerary = [
  { time: "6:00 AM",  title: "Sunrise yoga above the canyon floor",          thread: "practice", color: C.seaGlass },
  { time: "8:30 AM",  title: "Breakfast at a local farm café",               thread: "ritual",   color: C.sunSalmon },
  { time: "10:00 AM", title: "Guided hike through the Narrows",              thread: "terrain",  color: C.goldenAmber },
  { time: "1:00 PM",  title: "Lunch & rest at the canyon lodge",             thread: "ritual",   color: C.sunSalmon },
  { time: "3:30 PM",  title: "Breathwork session at the river's edge",       thread: "practice", color: C.seaGlass },
  { time: "5:00 PM",  title: "Conservation walk with a local steward",       thread: "ritual",   color: C.sunSalmon },
  { time: "7:00 PM",  title: "Farm dinner under open sky in Torrey",         thread: "ritual",   color: C.sunSalmon },
  { time: "9:00 PM",  title: "Stargazing from Under Canvas",                 thread: "practice", color: C.seaGlass },
];

// ─── Upcoming Threshold Trips ────────────────────────────────────────────────
const upcomingTrips = [
  {
    slug: "zion-autumn-equinox-2026",
    destination: "Zion Canyon",
    location: "Utah",
    threshold: "Autumn Equinox",
    window: "September 20–26, 2026",
    tagline: "The canyon exhales. Light softens, cottonwoods ignite, and the crowds dissolve.",
    gradient: "linear-gradient(165deg, #c4593c, #8b3a2a, #d4855a)",
    accent: C.sunSalmon,
    spots: 8,
  },
  {
    slug: "big-sur-harvest-moon-2026",
    destination: "Big Sur",
    location: "California",
    threshold: "Harvest Moon",
    window: "October 5–11, 2026",
    tagline: "The fog lifts, the kelp forests glow, and the Pacific turns to gold under a full moon.",
    gradient: "linear-gradient(165deg, #4A9B9F, #2d6b6e, #7BB8D4)",
    accent: C.oceanTeal,
    spots: 8,
  },
  {
    slug: "joshua-tree-spring-equinox-2027",
    destination: "Joshua Tree",
    location: "California",
    threshold: "Spring Equinox",
    window: "March 18–23, 2027",
    tagline: "Equal light, equal dark. The desert blooms at the exact moment the world rebalances.",
    gradient: "linear-gradient(165deg, #c17f43, #8b4513, #d4855a)",
    accent: C.goldenAmber,
    spots: 8,
  },
];

export default function OfferingsPage() {
  return (
    <>
      <Nav />
      <PageHeader
        eyebrow="Our Approach"
        title="More Than a Trip"
        subtitle="Three braids woven into every Lila journey — sacred places, ancient wisdom, and raw elemental experience."
        accentColor={C.goldenAmber}
      />

      {/* ══════════════════════════════════════════════════════════════════════
          CONVERGENCE — A Day With Lila
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="px-6 py-16 md:px-[52px] md:py-20 bg-cream">
        <div className="max-w-[1100px] mx-auto">
          <FadeIn>
            <div className="text-center mb-12">
              {/* Visual convergence — three colored lines */}
              <div className="flex justify-center items-center gap-4 mb-7">
                <div className="w-12 h-px bg-golden-amber" />
                <div className="w-12 h-px bg-sea-glass" />
                <div className="w-12 h-px bg-sun-salmon" />
              </div>
              <span className="font-body text-[11px] font-bold tracking-[0.22em] uppercase text-ocean-teal block mb-3">
                Woven Together
              </span>
              <h2 className="font-serif text-[clamp(28px,4vw,42px)] font-light text-dark-ink mb-4">
                A day with Lila
              </h2>
              <p className="font-serif text-lg text-[#5a6a78] max-w-[480px] mx-auto">
                Here's what it looks like when the threads come together. Every day is a composition — not a schedule.
              </p>
            </div>
          </FadeIn>

          {/* Sample itinerary card */}
          <FadeIn delay={0.15}>
            <div className="max-w-[680px] mx-auto bg-white border border-stone overflow-hidden">
              {/* Itinerary header */}
              <div className="py-7 px-6 md:px-10 border-b border-stone flex items-baseline gap-3">
                <span className="font-serif text-sm font-normal text-[#9aa8b2]">
                  Sample day
                </span>
                <span className="text-xs text-[#c0c8cd]">·</span>
                <span className="font-serif text-sm font-normal text-[#9aa8b2]">
                  Zion Canyon, Utah
                </span>
              </div>

              {/* Timeline */}
              <div className="py-8 px-6 md:px-10">
                {sampleItinerary.map((item, i) => (
                  <div
                    key={i}
                    className="grid grid-cols-[68px_6px_1fr] gap-[18px] items-start"
                    style={{ paddingBottom: i < sampleItinerary.length - 1 ? 24 : 0 }}
                  >
                    {/* Time */}
                    <span className="font-body text-xs font-semibold text-[#9aa8b2] tracking-[0.06em] pt-0.5 text-right">
                      {item.time}
                    </span>

                    {/* Dot + connector */}
                    <div className="flex flex-col items-center pt-[5px]">
                      <div
                        className="w-1.5 h-1.5 rounded-full shrink-0"
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

                    {/* Description */}
                    <span className="font-body text-sm font-normal text-dark-ink leading-[1.6]">
                      {item.title}
                    </span>
                  </div>
                ))}
              </div>

              {/* Thread legend */}
              <div className="py-5 px-6 md:px-10 border-t border-stone flex gap-6 flex-wrap">
                {[
                  { name: "Sacred Terrain", color: C.goldenAmber },
                  { name: "The Practice", color: C.seaGlass },
                  { name: "The Ritual", color: C.sunSalmon },
                ].map(t => (
                  <div key={t.name} className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full" style={{ background: t.color }} />
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

      {/* ══════════════════════════════════════════════════════════════════════
          ACT 2 — TRAVEL YOUR WAY
      ══════════════════════════════════════════════════════════════════════ */}
      <TravelYourWay />

      {/* ══════════════════════════════════════════════════════════════════════
          UPCOMING THRESHOLD TRIPS
      ══════════════════════════════════════════════════════════════════════ */}
      <section id="upcoming" className="px-6 py-16 md:px-[52px] md:py-20 bg-cream">
        <div className="max-w-[1000px] mx-auto">
          <FadeIn>
            <div className="text-center mb-14">
              <span className="font-body text-[11px] font-bold tracking-[0.22em] uppercase text-sun-salmon block mb-3">
                Upcoming Experiences
              </span>
              <h2 className="font-serif text-[clamp(28px,4vw,42px)] font-light text-dark-ink mb-4">
                Threshold Trips
              </h2>
              <p className="font-body text-[15px] text-[#5a6a78] leading-[1.8] max-w-[580px] mx-auto">
                Journeys timed to equinoxes, solstices, and seasonal turning points —
                when a place crosses into its most powerful window.
              </p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-7">
            {upcomingTrips.map((trip, i) => (
              <FadeIn key={trip.slug} delay={i * 0.1}>
                <Link
                  to={`/trips/${trip.slug}`}
                  className="no-underline block"
                >
                  <div className="bg-white overflow-hidden transition-all duration-400 cursor-pointer relative hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)]">
                    {/* Photo placeholder with gradient */}
                    <div
                      className="h-[200px] flex items-end p-5 relative"
                      style={{ background: trip.gradient }}
                    >
                      <div className="absolute top-4 right-4 bg-white/[0.92] backdrop-blur-[8px] py-1.5 px-3.5 text-[10px] font-body font-bold tracking-[0.18em] uppercase text-dark-ink">
                        Coming Soon
                      </div>
                      <div>
                        <p className="font-body text-xs font-semibold tracking-[0.15em] uppercase text-white/70 mb-1">
                          {trip.location}
                        </p>
                        <h3 className="font-serif text-[28px] font-light text-white leading-[1.2]">
                          {trip.destination}
                        </h3>
                      </div>
                    </div>

                    <div className="p-[24px_24px_28px]">
                      <span
                        className="font-body text-[10px] font-bold tracking-[0.2em] uppercase inline-block py-1 px-2.5 mb-3"
                        style={{
                          color: trip.accent,
                          border: `1px solid ${trip.accent}`,
                        }}
                      >
                        {trip.threshold}
                      </span>

                      <p className="font-body text-[13px] font-semibold text-[#5a6a78] tracking-[0.04em] mb-2.5">
                        {trip.window}
                      </p>
                      <p className="font-serif text-base text-[#5a6a78] leading-[1.7] mb-4">
                        {trip.tagline}
                      </p>
                      <div className="flex justify-between items-center">
                        <span className="font-body text-xs text-[#8a96a3] tracking-[0.04em]">
                          {trip.spots} spots
                        </span>
                        <span
                          className="font-body text-[11px] font-bold tracking-[0.18em] uppercase"
                          style={{ color: trip.accent }}
                        >
                          Learn More →
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── BOTTOM CTA ── */}
      <section className="px-6 pb-16 md:px-[52px] md:pb-20 bg-cream">
        <div className="max-w-[900px] mx-auto">
          <FadeIn delay={0.2}>
            <div className="p-[48px_24px] md:p-[48px_40px] bg-dark-ink text-center">
              <span className="eyebrow text-sky-blue">Not sure where to start?</span>
              <h3 className="font-body text-[clamp(22px,3vw,32px)] font-light text-white mb-5">
                Pick a destination. The guide is free.
              </h3>
              <Link
                to="/destinations"
                className="underline-link underline-link-light"
                onClick={() => trackEvent('offering_cta_clicked', { offering: 'explore_destinations' })}
              >
                Explore Destinations
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      <Footer />
    </>
  );
}
