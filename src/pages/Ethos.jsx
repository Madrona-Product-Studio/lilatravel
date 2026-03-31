import { Link } from 'react-router-dom';
import { Nav, Footer, FadeIn } from '@components';
import { C, FONTS } from '@data/brand';
import { ritualsPillars, traditions, ritualsIntro } from '@data/rituals';
import { trackEvent } from '@utils/analytics';
import { Helmet } from 'react-helmet-async';

const approachBraids = [
  {
    id: "sacred-terrain",
    icon: "\u25B3\uFE0E",
    label: "Sacred Terrain",
    color: "#7DB8A0",
    headline: "The landscape is the teacher.",
    body: "We don't choose destinations for their Instagram potential. We choose them for their capacity to dissolve the ordinary \u2014 places where canyon walls hold millions of years of silence, where ancient forests hum with something older than language, where the horizon line rearranges something inside you. To be changed by a place is to owe it something. We take that seriously.",
    tags: ["Seasonal Rhythms", "Tread Lightly", "Give Back", "Canyon & Desert", "Old-Growth Forest", "Wild Coastline", "Mountain Summits"],
    tagLabel: "Way we travel",
    cta: { text: "Explore Destinations", link: "/destinations" },
  },
  {
    id: "ancient-practices",
    icon: "\u25CE\uFE0E",
    label: "Ancient Practices",
    color: "#D4A853",
    headline: "Steeped in living tradition.",
    body: "Across centuries and continents, wisdom traditions have arrived at remarkably similar truths about how to live well. We draw from principles shared across Buddhist, Hindu, Taoist, and Stoic philosophy \u2014 oneness, flow, presence, reverence \u2014 and weave them into every journey.",
    tags: ["Yoga", "Meditation", "Breathwork", "Mindful Movement", "Forest Bathing", "Contemplation"],
    tagLabel: "What we practice",
    cta: null,
  },
  {
    id: "elemental-encounters",
    icon: "\u2726\uFE0E",
    label: "Elemental Encounters",
    color: "#6BA4B8",
    headline: "Where the senses take over.",
    body: "Before there were words for it, there was this \u2014 sunlight, cold water, stone, sky. These elemental forces are the oldest teachers on earth. We design journeys that put you directly in conversation with them.",
    tags: [
      { text: "Sunlight", color: "#D4A853" },
      { text: "Cold Water", color: "#6BA4B8" },
      { text: "Hot Saunas", color: "#E8956A" },
      { text: "Starry Skies", color: "#7DB8A0" },
      { text: "Ancient Stone", color: "#A89080" },
      { text: "Firelight", color: "#D4A853" },
    ],
    tagLabel: "What you'll feel",
    cta: null,
  },
];

const approachPrinciples = [
  {
    word: "Oneness", icon: "\u25EF", color: "#6BA4B8",
    desc: "The boundaries between self and world soften. You stop observing the landscape and become part of it.",
  },
  {
    word: "Flow", icon: "\u2248\uFE0E", color: "#7DB8A0",
    desc: "When effort dissolves and everything moves. The trail carries you. The river thinks for you. Time reshapes itself.",
  },
  {
    word: "Presence", icon: "\u25C9", color: "#D4A853",
    desc: "The full weight of now. Not weighed down by what brought you here or pulled toward what comes next.",
  },
  {
    word: "Reverence", icon: "\u2727", color: "#E8956A",
    desc: "The instinct to bow before something ancient. A canyon. A night sky. The quiet recognition that you are small.",
  },
];


export default function EthosPage() {
  return (
    <>
      <Helmet>
        <title>Our Ethos — Sacred Terrain, Ancient Practices & Reciprocity | Lila Trips</title>
        <meta name="description" content="The philosophy behind Lila Trips. How we think about land, travel, wellness, and what it means to move through a place with care." />
        <link rel="canonical" href="https://lilatrips.com/ethos" />
        <meta property="og:title" content="Our Ethos — Sacred Terrain, Ancient Practices & Reciprocity | Lila Trips" />
        <meta property="og:description" content="The philosophy behind Lila Trips. How we think about land, travel, wellness, and what it means to move through a place with care." />
        <meta property="og:url" content="https://lilatrips.com/ethos" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://lilatrips.com/og-image.png" />
        <meta property="og:image:alt" content="Our Ethos — Lila Trips" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Our Ethos — Sacred Terrain, Ancient Practices & Reciprocity | Lila Trips" />
        <meta name="twitter:description" content="The philosophy behind Lila Trips. How we think about land, travel, wellness, and what it means to move through a place with care." />
        <meta name="twitter:image" content="https://lilatrips.com/og-image.png" />
      </Helmet>
      <Nav />

      <section style={{ background: C.warmWhite, padding: '80px 28px 60px', position: 'relative' }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          {/* Eyebrow */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <div style={{ width: 40, height: 1, background: C.goldenAmber }} />
            <span style={{
              fontFamily: FONTS.body,
              fontSize: 10,
              letterSpacing: '2.5px',
              color: C.goldenAmber,
              fontWeight: 500,
              textTransform: 'uppercase',
            }}>
              OUR ETHOS
            </span>
          </div>

          {/* Headline */}
          <h1 style={{
            fontFamily: FONTS.serif,
            fontSize: 'clamp(32px, 6vw, 52px)',
            fontWeight: 300,
            color: C.darkInk,
            lineHeight: 1.1,
            marginBottom: 12,
            marginTop: 0,
          }}>
            What makes a Lila trip.
          </h1>

          {/* Intro */}
          <p style={{
            fontFamily: FONTS.serif,
            fontSize: 16,
            color: C.slate,
            lineHeight: 1.7,
            marginBottom: 36,
            maxWidth: 560,
            marginTop: 0,
          }}>
            Every Lila journey is woven from three braids — iconic landscapes that dissolve
            the ordinary, ancient practices that quiet the noise, and raw elemental encounters
            that wake you up.
          </p>

          {/* Wave SVG */}
          <svg
            style={{ display: 'block', width: '100%', marginBottom: 40 }}
            viewBox="0 0 600 64"
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M 0 22 C 100 22, 150 42, 300 32 C 450 22, 500 10, 600 14"
              fill="none"
              stroke={C.oceanTeal}
              strokeWidth="2.5"
              opacity="0.8"
            />
            <path
              d="M 0 32 C 100 32, 150 12, 300 22 C 450 32, 500 50, 600 46"
              fill="none"
              stroke={C.goldenAmber}
              strokeWidth="2.5"
              opacity="0.8"
            />
            <path
              d="M 0 42 C 100 42, 150 58, 300 50 C 450 42, 500 26, 600 30"
              fill="none"
              stroke={C.slate}
              strokeWidth="2.5"
              opacity="0.8"
            />
          </svg>

          {/* Pillar grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: 28,
          }}>
            {[
              {
                id: 'terrain',
                name: 'SACRED TERRAIN',
                color: C.oceanTeal,
                desc: 'Landscapes that dissolve the ordinary',
                examples: 'Zion · Big Sur\nKauaʻi · Olympic Peninsula\nVancouver Island · Joshua Tree',
              },
              {
                id: 'practices',
                name: 'ANCIENT PRACTICES',
                color: C.goldenAmber,
                desc: 'Rituals that quiet the noise',
                examples: 'Yoga · Meditation\nBreathwork · Qi Gong\nStoic reflection · Forest bathing',
              },
              {
                id: 'elemental',
                name: 'ELEMENTAL ENCOUNTERS',
                color: C.slate,
                desc: 'Raw forces that wake you up',
                examples: 'Storm · Tides · Stars\nCold water · Wind · Fire\nSolstice · Equinox · New moon',
              },
            ].map(pillar => (
              <div key={pillar.id}>
                <div style={{ height: 3, background: pillar.color, marginBottom: 14 }} />
                <div style={{
                  fontFamily: FONTS.body,
                  fontSize: 9,
                  letterSpacing: '2px',
                  fontWeight: 500,
                  color: pillar.color,
                  marginBottom: 8,
                }}>
                  {pillar.name}
                </div>
                <div style={{
                  fontFamily: FONTS.serif,
                  fontSize: 16,
                  fontStyle: 'italic',
                  color: C.darkInk,
                  lineHeight: 1.4,
                  marginBottom: 10,
                }}>
                  {pillar.desc}
                </div>
                <div style={{
                  fontFamily: FONTS.serif,
                  fontSize: 13,
                  color: C.stone,
                  lineHeight: 1.7,
                  whiteSpace: 'pre-line',
                }}>
                  {pillar.examples}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {approachBraids.map((b, bi) => {
        const isDark = bi % 2 === 0;
        return (
          <section
            key={b.id}
            id={b.id}
            className="px-7 py-20 md:px-[52px]"
            style={{
              background: isDark
                ? `linear-gradient(165deg, ${C.darkInk}, #1a3040)`
                : C.cream,
            }}
          >
            <div className="max-w-[960px] mx-auto">
              <FadeIn>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-[72px] items-start">
                  <div>
                    <div className="flex items-center gap-2.5 mb-5">
                      <span className="text-2xl opacity-70 leading-none" style={{ color: b.color }}>{b.icon}</span>
                      <span className="font-body text-[11px] font-bold tracking-[0.2em] uppercase" style={{ color: b.color }}>
                        {b.label}
                      </span>
                    </div>

                    <h2
                      className="font-body font-light leading-[1.25] mb-6 mt-0"
                      style={{
                        fontSize: "clamp(24px, 3.5vw, 36px)",
                        color: isDark ? "white" : C.darkInk,
                      }}
                    >
                      {b.headline}
                    </h2>

                    <p
                      className="font-body font-normal leading-[2.0] tracking-[0.02em]"
                      style={{
                        fontSize: "clamp(14px, 1.4vw, 15px)",
                        color: isDark ? "rgba(255,255,255,0.55)" : "#5a6a78",
                        marginBottom: b.cta ? 32 : 0,
                      }}
                    >
                      {b.body}
                    </p>

                    {b.cta && (
                      <Link
                        to={b.cta.link}
                        className="inline-flex items-center gap-2.5 font-body text-xs font-bold tracking-[0.18em] uppercase no-underline pb-1 transition-all duration-300 hover:gap-3.5 hover:opacity-70"
                        style={{
                          color: b.color,
                          borderBottom: `1px solid ${b.color}`,
                        }}
                        onClick={() => trackEvent('ethos_cta_clicked', { action: 'explore_destinations' })}
                      >
                        {b.cta.text} <span>&rarr;</span>
                      </Link>
                    )}
                  </div>

                  <div className="pt-0 md:pt-12">
                    <span
                      className="font-body text-[11px] font-bold tracking-[0.2em] uppercase block mb-5"
                      style={{ color: isDark ? "rgba(255,255,255,0.25)" : "#9aabba" }}
                    >
                      {b.tagLabel}
                    </span>

                    <div className="flex flex-wrap gap-2.5">
                      {b.tags.map((tag, j) => {
                        const isObj = typeof tag === "object";
                        const text = isObj ? tag.text : tag;
                        const tagColor = isObj ? tag.color : b.color;
                        return (
                          <span
                            key={j}
                            className="font-body text-[13px] font-semibold tracking-[0.06em] px-5 py-2.5 transition-all duration-[250ms] ease-in-out"
                            style={{
                              color: isDark ? `${tagColor}cc` : tagColor,
                              border: `1px solid ${isDark ? `${tagColor}25` : `${tagColor}30`}`,
                              background: `${tagColor}08`,
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = isDark ? `${tagColor}18` : `${tagColor}15`;
                              e.currentTarget.style.borderColor = isDark ? `${tagColor}40` : `${tagColor}50`;
                              e.currentTarget.style.color = tagColor;
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = `${tagColor}08`;
                              e.currentTarget.style.borderColor = isDark ? `${tagColor}25` : `${tagColor}30`;
                              e.currentTarget.style.color = isDark ? `${tagColor}cc` : tagColor;
                            }}
                          >
                            {text}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </FadeIn>

              {bi === 1 && (
                <FadeIn delay={0.15}>
                  <div className="mt-12 pt-10 border-t border-stone">
                    <span className="font-body text-[11px] font-bold tracking-[0.22em] uppercase text-[#9aabba] block mb-2">
                      Five Traditions, Four Principles
                    </span>
                    <p className="font-body text-sm font-normal text-[#5a6a78] leading-[1.8] mb-5 mt-0">
                      From five ancient frameworks, we've distilled the principles that guide every Lila journey.
                    </p>

                    <div className="flex gap-4 md:gap-7 flex-wrap mb-10">
                      {traditions.map((t) => (
                        <div key={t.name} className="flex items-center gap-2">
                          <span className="text-lg opacity-50 leading-none font-serif" style={{ color: t.color }}>
                            {t.symbol}
                          </span>
                          <span className="font-body text-[11px] font-bold tracking-[0.1em] uppercase text-[#5a6a78]">
                            {t.name}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-0">
                      {approachPrinciples.map((p, pi) => (
                        <div
                          key={p.word}
                          className="md:px-6"
                          style={{ borderLeft: pi > 0 ? `1px solid ${C.stone}` : "none" }}
                        >
                          <div className="flex items-center gap-2 mb-3">
                            <span className="text-base opacity-70" style={{ color: p.color }}>{p.icon}</span>
                            <span className="font-body text-xs font-bold tracking-[0.12em] uppercase" style={{ color: p.color }}>
                              {p.word}
                            </span>
                          </div>
                          <p className="font-body text-sm font-normal text-[#6a7a8a] leading-[1.8] m-0">
                            {p.desc}
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className="mt-8">
                      <Link
                        to="/ethos/philosophy"
                        className="inline-flex items-center gap-2.5 font-body text-xs font-bold tracking-[0.18em] uppercase text-golden-amber no-underline pb-1 border-b border-golden-amber transition-all duration-300 hover:gap-3.5 hover:opacity-70"
                        onClick={() => trackEvent('ethos_cta_clicked', { action: 'explore_philosophy' })}
                      >
                        Explore the philosophy <span>&rarr;</span>
                      </Link>
                    </div>
                  </div>
                </FadeIn>
              )}
            </div>
          </section>
        );
      })}


      <section className="py-20 px-7 md:px-[52px] bg-cream">
        <div className="max-w-[700px] mx-auto text-center">
          <FadeIn>
            <div className="flex justify-center items-center gap-4 mb-7">
              <div className="w-12 h-px" style={{ background: "#7DB8A0" }} />
              <div className="w-12 h-px" style={{ background: "#D4A853" }} />
              <div className="w-12 h-px" style={{ background: "#6BA4B8" }} />
            </div>

            <span className="eyebrow text-sky-blue mb-6 block">
              The Convergence
            </span>
            <p
              className="font-body font-normal text-[#4a6070] leading-[1.9] mb-5"
              style={{ fontSize: "clamp(16px, 2vw, 20px)" }}
            >
              When landscape, practice, and element converge — something shifts. You stop performing the trip and start living it. The planning dissolves. The experience takes over. That's the threshold we're always reaching for.
            </p>
            <p className="font-body text-sm font-normal text-[#7a8a9a] leading-[1.9] mb-10">
              We handle the logistics so you can cross it.
            </p>
            <div className="flex gap-6 justify-center flex-wrap">
              <Link to="/how-it-works" className="underline-link" onClick={() => trackEvent('ethos_cta_clicked', { action: 'see_how_it_works' })}>See How It Works</Link>
              <Link to="/destinations" className="underline-link" onClick={() => trackEvent('ethos_cta_clicked', { action: 'explore_destinations' })}>Explore Destinations</Link>
            </div>
          </FadeIn>
        </div>
      </section>

      <Footer />
    </>
  );
}
