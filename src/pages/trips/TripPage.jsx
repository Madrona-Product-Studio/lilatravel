// ═══════════════════════════════════════════════════════════════════════════════
// PAGE: TRIP DETAIL (placeholder template for upcoming Threshold Trips)
// ═══════════════════════════════════════════════════════════════════════════════

import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Nav, Footer, FadeIn, ExpressInterestModal } from '@components';
import { C } from '@data/brand';
import { trackEvent } from '@utils/analytics';

// ─── Trip Data ───────────────────────────────────────────────────────────────
const trips = {
  "zion-autumn-equinox": {
    destination: "Zion Canyon",
    location: "Utah",
    threshold: "Autumn Equinox",
    window: "September 19–23, 2026",
    season: "Autumn Equinox",
    tagline: "The canyon exhales. Light softens, cottonwoods ignite, and the crowds dissolve.",
    description: "Five days anchored to the autumn equinox — when daylight and darkness balance, Zion's canyon walls glow amber, and the cottonwood groves ignite. This is the threshold between summer's intensity and winter's stillness. Guided hikes, canyon yoga at dawn, evening breathwork under thousand-star skies.",
    gradient: "linear-gradient(165deg, #c4593c, #8b3a2a, #d4855a)",
    accent: C.sunSalmon,
    spots: 10,
    price: "From $1,295 per person",
    highlights: [
      "5 days curated accommodation in Springdale",
      "Equinox ceremony at canyon sunrise",
      "Daily guided hikes — Angels Landing, The Narrows, Hidden Canyon",
      "Morning yoga and breathwork sessions",
      "Sunset viewpoint experiences timed to the shifting light",
      "All permits and logistics handled",
      "Small group — 8 travelers maximum",
    ],
  },
  "joshua-tree-winter-solstice": {
    destination: "Joshua Tree",
    location: "California",
    threshold: "Winter Solstice",
    window: "December 18–22, 2026",
    season: "Winter Solstice",
    tagline: "Desert stillness, boulder scrambles, and sound baths under the darkest skies of the year.",
    description: "Five days centered on the winter solstice — when the Mojave desert falls silent and the night sky reaches its deepest dark. The solstice marks the return of light from the longest night. Dawn yoga among the boulders, desert ecology walks, sound healing sessions, and stargazing so vivid you'll forget cities exist.",
    gradient: "linear-gradient(165deg, #c17f43, #8b4513, #d4855a)",
    accent: C.goldenAmber,
    spots: 10,
    price: "From $1,195 per person",
    highlights: [
      "5 days near Joshua Tree National Park",
      "Winter solstice sunrise ceremony in the boulders",
      "Daily guided desert hikes and boulder scrambles",
      "Sound bath and breathwork sessions",
      "Night sky stargazing with astronomy guide",
      "All permits and logistics handled",
      "Small group — 8 travelers maximum",
    ],
  },
  "big-sur-spring-equinox": {
    destination: "Big Sur",
    location: "California",
    threshold: "Spring Equinox",
    window: "March 18–22, 2027",
    season: "Spring Equinox",
    tagline: "Coastal cliffs, redwood forests, and hot springs as the world reawakens into equal light.",
    description: "Five days anchored to the spring equinox — when Big Sur's coast shakes off winter fog and the redwoods drip with new green. The equinox marks the moment of balance before the surge of spring. Coastal trail hikes, cliffside meditation, hot springs sessions, and evenings watching the sun dissolve into the Pacific.",
    gradient: "linear-gradient(165deg, #4A9B9F, #2d6b6e, #7BB8D4)",
    accent: C.oceanTeal,
    spots: 10,
    price: "From $1,495 per person",
    highlights: [
      "5 days along the Big Sur coast",
      "Spring equinox ceremony on the cliffs",
      "Guided coastal and redwood trail hikes",
      "Cliffside morning yoga and meditation",
      "Hot springs and tide pool walks",
      "All permits and logistics handled",
      "Small group — 8 travelers maximum",
    ],
  },
  "kauai-new-moon": {
    destination: "Kauaʻi",
    location: "Hawaii",
    threshold: "New Moon Retreat",
    window: "April 9–14, 2027",
    season: "New Moon",
    tagline: "Nā Pali coast, volcanic ridgelines, and ocean breathwork under the darkest Pacific skies.",
    description: "Six days centered on the new moon — when Kauaʻi's skies go completely dark and the Garden Isle reveals its most primordial self. Nā Pali coast hikes, volcanic ridgeline walks, ocean breathwork at dawn, and evenings under a canopy of stars so bright the Milky Way casts shadows.",
    gradient: "linear-gradient(165deg, #c17f43, #8b4513, #d4a853)",
    accent: C.goldenAmber,
    spots: 10,
    price: "From $1,895 per person",
    highlights: [
      "6 days on Kauaʻi's north shore",
      "New moon ceremony under dark Pacific skies",
      "Nā Pali coast and Kalalau trail hikes",
      "Ocean breathwork and morning yoga",
      "Volcanic ridgeline and waterfall walks",
      "All permits and logistics handled",
      "Small group — 8 travelers maximum",
    ],
  },
  "vancouver-island-summer-solstice": {
    destination: "Vancouver Island",
    location: "British Columbia",
    threshold: "Summer Solstice",
    window: "June 19–23, 2027",
    season: "Summer Solstice",
    tagline: "Old-growth forests, wild coastline, and kayaking on the longest day of the year.",
    description: "Five days anchored to the summer solstice — when Vancouver Island's old-growth forests are bathed in nearly 16 hours of daylight and the wild Pacific coast hums with life. The longest day of the year, spent in one of the most ancient temperate rainforests on Earth. Forest bathing, sea kayaking, coastal trail hikes, and solstice ceremonies at sunset.",
    gradient: "linear-gradient(165deg, #5a8fb8, #3a6a8f, #7BB8D4)",
    accent: C.skyBlue,
    spots: 10,
    price: "From $1,350 per person",
    highlights: [
      "5 days on Vancouver Island's west coast",
      "Summer solstice sunset ceremony",
      "Old-growth forest bathing and rainforest hikes",
      "Sea kayaking along the wild Pacific coast",
      "Morning yoga and coastal meditation",
      "All permits and logistics handled",
      "Small group — 8 travelers maximum",
    ],
  },
  "olympic-harvest-moon": {
    destination: "Olympic Peninsula",
    location: "Washington",
    threshold: "Harvest Moon",
    window: "September 5–9, 2027",
    season: "Harvest Moon",
    tagline: "Rainforest trails, tide pools, and glacier-fed rivers bathed in the glow of the harvest moon.",
    description: "Five days centered on the harvest moon — when the Olympic Peninsula's rainforests glow golden, the tide pools teem with life, and the full moon rises enormous over the Pacific. Hoh Rainforest hikes, glacier-fed river walks, tide pool explorations, and moonrise ceremonies on the wild coast.",
    gradient: "linear-gradient(165deg, #4a7a6a, #2d5a4a, #7fb5a0)",
    accent: C.seaGlass,
    spots: 10,
    price: "From $1,395 per person",
    highlights: [
      "5 days on the Olympic Peninsula",
      "Harvest moon ceremony on the Pacific coast",
      "Hoh Rainforest and temperate rainforest hikes",
      "Glacier-fed river walks and tide pool exploration",
      "Morning yoga and forest meditation",
      "All permits and logistics handled",
      "Small group — 8 travelers maximum",
    ],
  },
};

export default function TripPage() {
  const { slug } = useParams();
  const trip = trips[slug];
  const [showInterest, setShowInterest] = useState(false);

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
            <span className="font-body text-[11px] font-bold tracking-[0.2em] uppercase text-[#aab0b8]">
              In Dev · {trip.threshold}
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

          {/* Express Interest CTA */}
          <FadeIn delay={0.2}>
            <div className="py-12 px-10 bg-dark-ink text-center">
              <span
                className="font-body text-[11px] font-bold tracking-[0.22em] uppercase block mb-3"
                style={{ color: trip.accent }}
              >In Dev · {trip.threshold}</span>
              <h3 className="font-body text-[clamp(20px,3vw,28px)] font-light text-white mb-2">
                {trip.spots} spots · {trip.window}
              </h3>
              <p className="font-body text-[14px] text-white/50 mb-6">
                Booking opens soon. Leave your email and we'll let you know.
              </p>
              <button
                onClick={() => {
                  trackEvent('express_interest_clicked', { trip_slug: slug });
                  setShowInterest(true);
                }}
                className="font-body text-[11px] font-bold tracking-[0.2em] uppercase text-white py-3 px-7 border border-white/35 bg-transparent cursor-pointer transition-all duration-300 hover:bg-white/10 hover:border-white/60"
              >
                Express Interest
              </button>
            </div>
          </FadeIn>

          {/* Back link */}
          <div className="text-center mt-12">
            <Link to="/offerings" className="underline-link" onClick={() => trackEvent('trip_cta_clicked', { action: 'back_to_offerings', trip_slug: slug })}>← Back to Offerings</Link>
          </div>
        </div>
      </section>

      <ExpressInterestModal
        open={showInterest}
        onClose={() => setShowInterest(false)}
        tripTitle={trip.threshold}
        tripLocation={trip.destination}
      />

      <Footer />
    </>
  );
}
