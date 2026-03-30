// ═══════════════════════════════════════════════════════════════════════════════
// PAGE: TRIP DETAIL (placeholder template for upcoming Threshold Trips)
// ═══════════════════════════════════════════════════════════════════════════════

import { useParams, Link } from 'react-router-dom';
import { Nav, Footer, FadeIn } from '@components';
import { C } from '@data/brand';
import { trackEvent } from '@utils/analytics';

// ─── Trip Data ───────────────────────────────────────────────────────────────
const trips = {
  "zion-autumn-equinox-2026": {
    destination: "Zion Canyon",
    location: "Utah",
    threshold: "Autumn Equinox",
    window: "September 20–26, 2026",
    season: "Autumn Equinox",
    tagline: "The canyon exhales. Light softens, cottonwoods ignite, and the crowds dissolve.",
    description: "Seven days anchored to the autumn equinox — when daylight and darkness balance, Zion's canyon walls glow amber, and the cottonwood groves ignite. This is the threshold between summer's intensity and winter's stillness. Guided hikes, canyon yoga at dawn, evening breathwork under thousand-star skies.",
    gradient: "linear-gradient(165deg, #c4593c, #8b3a2a, #d4855a)",
    accent: C.sunSalmon,
    spots: 8,
    price: "From $895 per person",
    highlights: [
      "6 nights curated accommodation in Springdale",
      "Equinox ceremony at canyon sunrise",
      "Daily guided hikes — Angels Landing, The Narrows, Hidden Canyon",
      "Morning yoga and breathwork sessions",
      "Sunset viewpoint experiences timed to the shifting light",
      "All permits and logistics handled",
      "Small group — 8 travelers maximum",
    ],
  },
  "big-sur-harvest-moon-2026": {
    destination: "Big Sur",
    location: "California",
    threshold: "Harvest Moon",
    window: "October 5–11, 2026",
    season: "Harvest Moon",
    tagline: "The fog lifts, the kelp forests glow, and the Pacific turns to gold under a full moon.",
    description: "Six days centered on the harvest moon — when Big Sur's fog finally lifts and the coast enters its warmest, most luminous window. Moonrise over the Pacific, coastal trail hikes through golden grass, cliffside meditation, and evenings watching the sun dissolve into the ocean while the full moon rises behind you.",
    gradient: "linear-gradient(165deg, #4A9B9F, #2d6b6e, #7BB8D4)",
    accent: C.oceanTeal,
    spots: 8,
    price: "From $995 per person",
    highlights: [
      "6 nights along the Big Sur coast",
      "Harvest moon ceremony on the cliffs",
      "Guided coastal and redwood trail hikes",
      "Cliffside morning yoga and meditation",
      "Tide pool and marine ecology walks",
      "Farm-to-table dining experiences",
      "Small group — 8 travelers maximum",
    ],
  },
  "joshua-tree-spring-equinox-2027": {
    destination: "Joshua Tree",
    location: "California",
    threshold: "Spring Equinox",
    window: "March 18–23, 2027",
    season: "Spring Equinox",
    tagline: "Equal light, equal dark. The desert blooms at the exact moment the world rebalances.",
    description: "Five days anchored to the spring equinox — when the Mojave comes alive after winter rains, wildflowers carpet the desert floor, and the night sky is the darkest you've ever seen. The equinox marks the return of light, and the desert responds in kind. Dawn yoga among the boulders, desert ecology walks, stargazing sessions, and silence so deep it becomes its own kind of music.",
    gradient: "linear-gradient(165deg, #c17f43, #8b4513, #d4855a)",
    accent: C.goldenAmber,
    spots: 8,
    price: "From $795 per person",
    highlights: [
      "5 nights near Joshua Tree National Park",
      "Spring equinox sunrise ceremony in the boulders",
      "Daily guided desert hikes and boulder walks",
      "Dawn yoga and desert breathwork",
      "Night sky stargazing with astronomy guide",
      "Desert ecology and wildflower walks",
      "Small group — 8 travelers maximum",
    ],
  },
};

export default function TripPage() {
  const { slug } = useParams();
  const trip = trips[slug];

  if (!trip) {
    return (
      <>
        <Nav />
        <div className="pt-[160px] px-[52px] pb-[120px] bg-cream text-center min-h-[60vh]">
          <h1 className="font-serif text-[36px] font-light text-dark-ink mb-5">
            Trip not found
          </h1>
          <Link to="/offerings" className="underline-link">Back to Offerings</Link>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Nav />

      {/* ── Hero ── */}
      <section
        className="h-[60vh] min-h-[420px] flex items-end px-[52px] pb-[60px] relative"
        style={{ background: trip.gradient }}
      >
        <div className="absolute inset-0 bg-black/15" />
        <div className="relative z-1 max-w-[700px]">
          {/* Threshold badge */}
          <div className="inline-block bg-white/92 backdrop-blur-[8px] px-[18px] py-2 mb-5">
            <span className="font-body text-[11px] font-bold tracking-[0.2em] uppercase text-dark-ink">
              Coming Soon · {trip.threshold}
            </span>
          </div>
          <p className="font-body text-[12px] font-semibold tracking-[0.18em] uppercase text-white/60 mb-2">
            {trip.location}
          </p>
          <h1 className="font-serif text-[clamp(36px,6vw,64px)] font-light text-white leading-[1.1] mb-4">
            {trip.destination}
          </h1>
          <p className="font-serif text-[20px] text-white/80 leading-[1.5]">
            {trip.tagline}
          </p>
        </div>
      </section>

      {/* ── Details ── */}
      <section className="py-[80px] px-[52px] bg-cream">
        <div className="max-w-[800px] mx-auto">

          {/* Threshold + Date + Price bar */}
          <FadeIn>
            <div
              className="flex justify-between items-center pt-6 pb-10 mb-12 flex-wrap gap-4"
              style={{ borderBottom: `1px solid ${C.stone}` }}
            >
              <div>
                <span
                  className="font-body text-[11px] font-bold tracking-[0.2em] uppercase block mb-1.5"
                  style={{ color: trip.accent }}
                >Threshold · {trip.threshold}</span>
                <span className="font-body text-[18px] font-normal text-dark-ink">
                  {trip.window}
                </span>
              </div>
              <div className="text-right">
                <span
                  className="font-body text-[11px] font-bold tracking-[0.2em] uppercase block mb-1.5"
                  style={{ color: trip.accent }}
                >Price</span>
                <span className="font-body text-[18px] font-normal text-dark-ink">
                  {trip.price}
                </span>
              </div>
            </div>
          </FadeIn>

          {/* Description */}
          <FadeIn delay={0.1}>
            <p className="font-body text-[16px] text-[#5a6a78] leading-[2] mb-14">
              {trip.description}
            </p>
          </FadeIn>

          {/* Highlights */}
          <FadeIn delay={0.15}>
            <div className="mb-14">
              <span
                className="font-body text-[11px] font-bold tracking-[0.22em] uppercase block mb-5"
                style={{ color: trip.accent }}
              >What's Included</span>
              <div className="grid gap-4">
                {trip.highlights.map((h, i) => (
                  <div
                    key={i}
                    className="flex items-baseline gap-3.5 py-3"
                    style={{
                      borderBottom: i < trip.highlights.length - 1
                        ? `1px solid ${C.stone}`
                        : "none",
                    }}
                  >
                    <span
                      className="font-serif text-[18px] font-light shrink-0"
                      style={{ color: trip.accent }}
                    >·</span>
                    <span className="font-body text-[15px] text-[#5a6a78] leading-[1.7]">
                      {h}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>

          {/* Waitlist CTA */}
          <FadeIn delay={0.2}>
            <div className="py-12 px-10 bg-dark-ink text-center">
              <span
                className="font-body text-[11px] font-bold tracking-[0.22em] uppercase block mb-3"
                style={{ color: trip.accent }}
              >Coming Soon · {trip.threshold}</span>
              <h3 className="font-body text-[clamp(20px,3vw,28px)] font-light text-white mb-2">
                {trip.spots} spots · {trip.window}
              </h3>
              <p className="font-body text-[14px] text-white/50 mb-6">
                Booking opens soon. Check back or explore our guides in the meantime.
              </p>
              <Link to="/destinations" className="underline-link underline-link-light" onClick={() => trackEvent('trip_cta_clicked', { action: 'explore_destinations', trip_slug: slug })}>Explore Destinations</Link>
            </div>
          </FadeIn>

          {/* Back link */}
          <div className="text-center mt-12">
            <Link to="/offerings" className="underline-link" onClick={() => trackEvent('trip_cta_clicked', { action: 'back_to_offerings', trip_slug: slug })}>← Back to Offerings</Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
