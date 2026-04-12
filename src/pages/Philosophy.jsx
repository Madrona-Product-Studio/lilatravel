import { Link } from 'react-router-dom';
import { Nav, Footer, FadeIn } from '@components';
import { C } from '@data/brand';
import { traditions } from '@data/rituals';
import { trackEvent } from '@utils/analytics';

const principles = [
  {
    word: "Oneness",
    icon: "\u25EF",
    color: "#6BA4B8",
    quote: "You are not a drop in the ocean. You are the entire ocean in a drop.",
    author: "Rumi",
    desc: "The boundaries between self and world soften. You stop observing the landscape and become part of it. The canyon doesn\u2019t stand apart from you \u2014 you\u2019re made of the same ancient material. The river isn\u2019t scenery; it\u2019s circulation. This is the oldest truth these traditions share: separation is the illusion.",
    inPractice: "On a Lila trip, oneness emerges naturally \u2014 through sunrise yoga on slickrock where the stone becomes your mat, through silent hikes where the trail thinks for you, through cold water immersion where the river erases the boundary between inner and outer.",
    traditions: [
      {
        symbol: "\u0950\uFE0E", concept: "Brahman-\u0100tman", source: "Hindu / Yoga",
        metaphor: "The drop is the ocean.",
        quote: "As the same fire assumes different shapes when it consumes objects differing in shape, so does the one Self take the shape of every creature in whom he is present.",
        quoteSource: "Katha Upanishad",
      },
      {
        symbol: "\u273F\uFE0E", concept: "Prat\u012Btyasamutp\u0101da", source: "Buddhism",
        metaphor: "Everything co-creates everything else.",
        quote: "In this handful of soil, I see the presence of the entire cosmos. A cloud floats in this sheet of paper.",
        quoteSource: "Thich Nhat Hanh",
      },
      {
        symbol: "\u262F\uFE0E", concept: "The Tao", source: "Taoism",
        metaphor: "Two sides of one breath.",
        quote: "The Tao that can be told is not the eternal Tao. The name that can be named is not the eternal name. The nameless is the beginning of heaven and earth.",
        quoteSource: "Lao Tzu, Tao Te Ching",
      },
      {
        symbol: "\u26E9\uFE0E", concept: "Musubi", source: "Shinto",
        metaphor: "The divine is woven through all of nature.",
        quote: "Every mountain, every river, every plant, every tree \u2014 all have their own kami. The world is not matter animated by spirit. It is spirit made visible.",
        quoteSource: "Shinto teaching",
      },
      {
        symbol: "\u25B3\uFE0E", concept: "Sympatheia & Logos", source: "Stoicism",
        metaphor: "Every thread is the whole tapestry.",
        quote: "Constantly regard the universe as one living being, having one substance and one soul; and observe how all things have reference to one perception.",
        quoteSource: "Marcus Aurelius, Meditations",
      },
    ],
  },
  {
    word: "Flow",
    icon: "\u2248\uFE0E",
    color: "#7DB8A0",
    quote: "Life is a series of natural and spontaneous changes. Don\u2019t resist them; that only creates sorrow.",
    author: "Lao Tzu",
    desc: "When effort dissolves and everything moves. The trail carries you. The river thinks for you. Time reshapes itself around the experience rather than the clock. Flow is what happens when you stop managing and start surrendering \u2014 to terrain, to rhythm, to whatever the day wants to become.",
    inPractice: "We design Lila itineraries to invite flow \u2014 mornings that unfold without alarms, trails chosen for their rhythm rather than their difficulty, evenings that gather momentum toward stillness rather than entertainment. The logistics disappear so the current can carry you.",
    traditions: [
      {
        symbol: "\u0950\uFE0E", concept: "Sahaja", source: "Hindu / Yoga",
        metaphor: "The effortless state.",
        quote: "When the restlessness of the mind, intellect and self is stilled through the practice of yoga, the yogi finds fulfillment \u2014 resting in the self, content within the self.",
        quoteSource: "Bhagavad Gita, 6.20",
      },
      {
        symbol: "\u273F\uFE0E", concept: "Anicca", source: "Buddhism",
        metaphor: "All things are in constant motion.",
        quote: "No one can step twice into the same river, for other waters are ever flowing on. Everything flows and nothing abides.",
        quoteSource: "Buddhist teaching, after Heraclitus",
      },
      {
        symbol: "\u262F\uFE0E", concept: "Wu Wei", source: "Taoism",
        metaphor: "Action without forcing.",
        quote: "The sage acts without effort, teaches without words. Things arise and she lets them come; things disappear and she lets them go.",
        quoteSource: "Lao Tzu, Tao Te Ching",
      },
      {
        symbol: "\u26E9\uFE0E", concept: "Kannagara", source: "Shinto",
        metaphor: "Living in the flow of kami.",
        quote: "To be in kannagara is to live in spontaneous accord with the movement of the divine \u2014 the seasons, the tides, the breath of the world.",
        quoteSource: "Shinto teaching",
      },
      {
        symbol: "\u25B3\uFE0E", concept: "Kata Phusin", source: "Stoicism",
        metaphor: "According to nature.",
        quote: "Living according to nature means living according to your own nature and the nature of the universe \u2014 never at war with the way things move.",
        quoteSource: "Chrysippus, paraphrased",
      },
    ],
  },
  {
    word: "Presence",
    icon: "\u25C9",
    color: "#D4A853",
    quote: "The present moment is filled with joy and happiness. If you are attentive, you will see it.",
    author: "Thich Nhat Hanh",
    desc: "The full weight of now. Not weighed down by what brought you here or pulled toward what comes next. Presence is the rarest commodity in modern life \u2014 and the one that every sacred landscape, ancient practice, and elemental encounter conspires to produce. It\u2019s not something you achieve. It\u2019s what\u2019s left when the noise stops.",
    inPractice: "Every element of a Lila trip is designed to anchor you here \u2014 guided meditation in settings that make stillness effortless, breathwork that returns you to your body, journaling prompts that capture what\u2019s alive in the moment. No itinerary anxiety. No decision fatigue. Just the day, happening.",
    traditions: [
      {
        symbol: "\u0950\uFE0E", concept: "Dh\u0101ran\u0101", source: "Hindu / Yoga",
        metaphor: "Steady, unwavering focus.",
        quote: "Yoga is the stilling of the changing states of the mind. When that is accomplished, the seer abides in its own true nature.",
        quoteSource: "Patanjali, Yoga Sutras, 1.2-3",
      },
      {
        symbol: "\u273F\uFE0E", concept: "Sati", source: "Buddhism",
        metaphor: "Bare attention to what is.",
        quote: "When walking, just walk. When sitting, just sit. Above all, don\u2019t wobble.",
        quoteSource: "Zen saying",
      },
      {
        symbol: "\u262F\uFE0E", concept: "Zuo Wang", source: "Taoism",
        metaphor: "Sitting and forgetting.",
        quote: "I let go of my body and give up my knowledge. By freeing myself from the body and mind, I become one with the infinite.",
        quoteSource: "Zhuangzi",
      },
      {
        symbol: "\u26E9\uFE0E", concept: "Ima", source: "Shinto",
        metaphor: "The living now.",
        quote: "The morning shrine visit is not a prayer for the future. It is gratitude for this breath, this light, this single unrepeatable morning.",
        quoteSource: "Shinto teaching",
      },
      {
        symbol: "\u25B3\uFE0E", concept: "Prosoche", source: "Stoicism",
        metaphor: "Continuous self-attention.",
        quote: "When you arise in the morning, think of what a precious privilege it is to be alive \u2014 to breathe, to think, to enjoy, to love.",
        quoteSource: "Marcus Aurelius, Meditations",
      },
    ],
  },
  {
    word: "Reverence",
    icon: "\u2727",
    color: "#E8956A",
    quote: "Dwell on the beauty of life. Watch the stars, and see yourself running with them.",
    author: "Marcus Aurelius",
    desc: "The instinct to bow before something ancient. A canyon. A night sky. The quiet recognition that you are small \u2014 and that your smallness is not a diminishment but a liberation. Reverence is what happens when awe meets humility. It\u2019s the feeling that precedes every transformation.",
    inPractice: "We time Lila trips to moments of natural crescendo \u2014 solstice light on canyon walls, the Milky Way at its most visible, wildflower blooms at their peak. These aren\u2019t coincidences. They\u2019re invitations to feel something larger than yourself. We put you in the room. The landscape does the rest.",
    traditions: [
      {
        symbol: "\u0950\uFE0E", concept: "Bhakti", source: "Hindu / Yoga",
        metaphor: "Devotion that dissolves the self.",
        quote: "Whatever you do, whatever you eat, whatever you offer in sacrifice, whatever you give away, whatever austerity you practice \u2014 do that as an offering to me.",
        quoteSource: "Bhagavad Gita, 9.27",
      },
      {
        symbol: "\u273F\uFE0E", concept: "Appam\u0101da", source: "Buddhism",
        metaphor: "Profound care for all things.",
        quote: "Just as a mother would protect her only child with her life, cultivate a boundless heart toward all beings.",
        quoteSource: "Metta Sutta",
      },
      {
        symbol: "\u262F\uFE0E", concept: "J\u00ECng", source: "Taoism",
        metaphor: "Stillness as reverence.",
        quote: "To the mind that is still, the whole universe surrenders.",
        quoteSource: "Lao Tzu",
      },
      {
        symbol: "\u26E9\uFE0E", concept: "Mono no Aware", source: "Shinto",
        metaphor: "The bittersweet beauty of passing.",
        quote: "The cherry blossoms are beautiful precisely because they fall. If they lasted forever, would we even stop to look?",
        quoteSource: "Japanese saying",
      },
      {
        symbol: "\u25B3\uFE0E", concept: "Thaumazein", source: "Stoicism",
        metaphor: "Wonder as the beginning of wisdom.",
        quote: "Loss is nothing else but change, and change is nature\u2019s delight. Look at the stars lighting up the firmament and wonder.",
        quoteSource: "Marcus Aurelius, Meditations",
      },
    ],
  },
  {
    word: "Compassion",
    icon: "\u2767",
    color: "#A85C4A",
    quote: "Let yourself be silently drawn by the strange pull of what you really love. It will not lead you astray.",
    author: "Rumi",
    desc: "The heart opened toward what is alive around you. Not sentiment \u2014 orientation. A continuous turning toward what is struggling, what is beautiful, what is other than yourself. Compassion is what happens when presence stops being self-referential and becomes relational. Every tradition arrived at the same truth: care is not the obstacle to awakening. It is the path.",
    inPractice: "Lila trips are designed to dissolve the membrane between self and landscape \u2014 and compassion is what flows through that opening. Tonglen practice on a burned hillside. Mett\u0101 extended to every creature sharing the trail. Seva that gives something back to the place holding you. The land receives your attention. You receive the land\u2019s.",
    traditions: [
      {
        symbol: "\u0950\uFE0E", concept: "Karu\u1E47\u0101 & Bhakti", source: "Hindu / Yoga",
        metaphor: "Love as the direct path.",
        quote: "Let yourself be silently drawn by the strange pull of what you really love. It will not lead you astray.",
        quoteSource: "Rumi",
      },
      {
        symbol: "\u273F\uFE0E", concept: "Mett\u0101 & Tonglen", source: "Buddhism",
        metaphor: "The circle of care has no edge.",
        quote: "Just as a mother would protect her only child with her own life, cultivate a boundless heart toward all beings.",
        quoteSource: "The Buddha, Metta Sutta",
      },
      {
        symbol: "\u262F\uFE0E", concept: "C\u00ED \u2014 Loving Kindness", source: "Taoism",
        metaphor: "Gentleness as strength.",
        quote: "I have three treasures which I hold and keep. The first is mercy. The second is economy. The third is daring not to be ahead of others.",
        quoteSource: "Laozi, Tao Te Ching 67",
      },
      {
        symbol: "\u26E9\uFE0E", concept: "Naohi \u2014 The Rectifying Spirit", source: "Shinto",
        metaphor: "The kami of harmony and restoration.",
        quote: "The rectifying spirit moves through all living things, restoring what has been broken, returning what has been lost.",
        quoteSource: "Shinto teaching",
      },
      {
        symbol: "\u25B3\uFE0E", concept: "Oikei\u00F4sis", source: "Stoicism",
        metaphor: "Belonging \u2014 the recognition of kinship with all.",
        quote: "What injures the hive, injures the bee. We are all one body.",
        quoteSource: "Marcus Aurelius, Meditations",
      },
    ],
  },
];


export default function PhilosophyPage() {
  return (
    <>
      <Nav />

      <section className="pt-[140px] pb-16 px-7 md:px-[52px] bg-warm-white">
        <div className="max-w-[960px] mx-auto">
          <FadeIn>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-6 h-px bg-golden-amber" />
              <span className="font-body text-[11px] font-bold tracking-[0.22em] uppercase text-golden-amber">
                Philosophy
              </span>
            </div>

            <h1
              className="font-body font-light text-dark-ink leading-[1.15] mb-5 mt-0"
              style={{ fontSize: "clamp(32px, 5vw, 52px)" }}
            >
              Five traditions.<br />Five principles.
            </h1>

            <p
              className="font-body font-normal text-[#5a6a78] leading-[1.9] max-w-[600px] mb-0"
              style={{ fontSize: "clamp(14px, 1.6vw, 16px)" }}
            >
              Across centuries and continents, five wisdom traditions arrived independently at remarkably similar truths about how to live well. We've distilled their shared insights into five principles that guide every Lila journey.
            </p>
          </FadeIn>

          <FadeIn delay={0.05}>
            <div className="flex gap-7 flex-wrap mt-10 pt-9 border-t border-stone">
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
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="flex flex-col md:flex-row gap-3 mt-8 pt-8 border-t border-stone flex-wrap">
              {principles.map((p) => (
                <a
                  key={p.word}
                  href={`#${p.word.toLowerCase()}`}
                  className="flex items-center gap-2.5 no-underline py-3 px-5 border border-stone transition-all duration-300 hover:bg-black/[0.02]"
                >
                  <span className="text-base opacity-70" style={{ color: p.color }}>{p.icon}</span>
                  <span className="font-body text-xs font-bold tracking-[0.14em] uppercase text-dark-ink">
                    {p.word}
                  </span>
                </a>
              ))}
            </div>
          </FadeIn>

          {/* Lila Meditations CTA */}
          <FadeIn delay={0.15}>
            <Link
              to="/ethos/meditations"
              className="no-underline block mt-10"
              onClick={() => trackEvent('philosophy_cta_clicked', { action: 'open_meditations' })}
            >
              <div
                className="relative overflow-hidden py-7 px-8"
                style={{
                  background: 'linear-gradient(135deg, #5a7898 0%, #8a7880 35%, #d09070 70%, #e8a060 100%)',
                }}
              >
                {/* Mountain silhouette */}
                <svg
                  className="absolute bottom-0 left-0 w-full"
                  style={{ height: '35%' }}
                  viewBox="0 0 390 80" preserveAspectRatio="none"
                >
                  <path d="M0,80 L0,50 L43,28 L88,42 L132,18 L176,35 L221,8 L265,27 L309,14 L354,30 L390,21 L390,80 Z" fill="rgba(12,22,36,0.7)" />
                </svg>

                {/* Content */}
                <div className="relative z-10 flex items-center gap-5">
                  <div className="flex gap-2.5 shrink-0">
                    {principles.slice(0, 5).map((p) => (
                      <span key={p.word} className="text-sm opacity-70" style={{ color: 'white' }}>{p.icon}</span>
                    ))}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-body text-[9px] font-bold tracking-[0.22em] uppercase text-white/50 mb-1">
                      Lila Meditations
                    </div>
                    <div className="font-body text-[15px] font-semibold text-white leading-[1.3]">
                      30 practices &middot; ancient wisdom for wild places
                    </div>
                  </div>
                  <span className="font-body text-white/50 text-lg shrink-0">&rarr;</span>
                </div>
              </div>
            </Link>
          </FadeIn>
        </div>
      </section>


      {principles.map((p, pi) => {
        const isDark = pi % 2 === 0;
        return (
          <section
            key={p.word}
            id={p.word.toLowerCase()}
            className="py-[60px] px-7 md:px-[52px]"
            style={{
              background: isDark
                ? `linear-gradient(165deg, ${C.darkInk}, #1a3040)`
                : C.cream,
            }}
          >
            <div className="max-w-[960px] mx-auto">

              <FadeIn>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-start mb-10">
                  <div>
                    <div className="flex items-center gap-2.5 mb-6">
                      <span className="text-[28px] opacity-60" style={{ color: p.color }}>{p.icon}</span>
                      <span className="font-body text-xs font-bold tracking-[0.2em] uppercase" style={{ color: p.color }}>
                        {p.word}
                      </span>
                    </div>

                    <p
                      className="font-serif font-light leading-[1.5] mb-2.5 mt-0"
                      style={{
                        fontSize: "clamp(22px, 3vw, 32px)",
                        color: p.color,
                      }}
                    >
                      &ldquo;{p.quote}&rdquo;
                    </p>
                    <span
                      className="font-body text-[11px] font-semibold tracking-[0.08em]"
                      style={{ color: isDark ? "rgba(255,255,255,0.35)" : "#9aabba" }}
                    >
                      &mdash; {p.author}
                    </span>
                  </div>

                  <div className="pt-2">
                    <p
                      className="font-body font-normal leading-[2.0] tracking-[0.02em] mt-0 mb-7"
                      style={{
                        fontSize: "clamp(14px, 1.4vw, 15px)",
                        color: isDark ? "rgba(255,255,255,0.55)" : "#5a6a78",
                      }}
                    >
                      {p.desc}
                    </p>

                    <div
                      className="pt-6"
                      style={{ borderTop: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : C.stone}` }}
                    >
                      <span
                        className="font-body text-[11px] font-bold tracking-[0.2em] uppercase block mb-3"
                        style={{ color: isDark ? "rgba(255,255,255,0.25)" : "#9aabba" }}
                      >
                        On a Lila trip
                      </span>
                      <p
                        className="font-body text-sm font-normal leading-[1.85] m-0"
                        style={{ color: isDark ? "rgba(255,255,255,0.45)" : "#6a7a8a" }}
                      >
                        {p.inPractice}
                      </p>
                    </div>
                  </div>
                </div>
              </FadeIn>

              <FadeIn delay={0.1}>
                <span
                  className="font-body text-[11px] font-bold tracking-[0.22em] uppercase block mb-4"
                  style={{ color: isDark ? "rgba(255,255,255,0.25)" : "#9aabba" }}
                >
                  {p.word} across five traditions
                </span>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-px gap-y-0">
                  {p.traditions.map((t, ti) => (
                    <div
                      key={ti}
                      className="py-6"
                      style={{
                        borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.07)" : C.stone}`,
                        ...(ti === p.traditions.length - 1 && p.traditions.length % 2 !== 0
                          ? { gridColumn: "1 / -1" }
                          : {}),
                      }}
                    >
                      <div className="flex items-center gap-3 mb-1.5">
                        <span className="text-base opacity-50 font-serif leading-none" style={{ color: p.color }}>
                          {t.symbol}
                        </span>
                        <span
                          className="font-body text-[11px] font-bold tracking-[0.1em] uppercase"
                          style={{ color: isDark ? "rgba(255,255,255,0.3)" : "#9aabba" }}
                        >
                          {t.source}
                        </span>
                        <span
                          className="font-body text-xs font-bold tracking-[0.08em] uppercase"
                          style={{ color: isDark ? "rgba(255,255,255,0.8)" : C.darkInk }}
                        >
                          {t.concept}
                        </span>
                      </div>

                      <p
                        className="font-serif text-[17px] font-normal not-italic mb-1.5 mt-0 pl-7"
                        style={{ color: isDark ? `${p.color}e6` : p.color }}
                      >
                        {t.metaphor}
                      </p>

                      <p
                        className="font-body text-sm font-normal leading-[1.7] m-0 pl-7"
                        style={{ color: isDark ? "rgba(255,255,255,0.55)" : "#5a6a78" }}
                      >
                        &ldquo;{t.quote}&rdquo;
                      </p>
                    </div>
                  ))}
                </div>
              </FadeIn>

              {pi < principles.length - 1 && (
                <div className="mt-12 text-center">
                  <a
                    href={`#${principles[pi + 1].word.toLowerCase()}`}
                    className="inline-flex items-center gap-2.5 font-body text-xs font-bold tracking-[0.16em] uppercase no-underline transition-all duration-300 hover:gap-3.5"
                    style={{ color: isDark ? "rgba(255,255,255,0.4)" : "#9aabba" }}
                    onMouseEnter={e => {
                      e.currentTarget.style.color = principles[pi + 1].color;
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.color = isDark ? "rgba(255,255,255,0.4)" : "#9aabba";
                    }}
                  >
                    Next: {principles[pi + 1].word}
                    <span className="text-sm">&darr;</span>
                  </a>
                </div>
              )}
            </div>
          </section>
        );
      })}


      <section className="py-[60px] px-7 md:px-[52px] bg-cream">
        <div className="max-w-[700px] mx-auto text-center">
          <FadeIn>
            <div className="flex justify-center gap-4 mb-7">
              {principles.map((p) => (
                <span key={p.word} className="text-xl opacity-40" style={{ color: p.color }}>
                  {p.icon}
                </span>
              ))}
            </div>

            <p
              className="font-body font-normal text-[#4a6070] leading-[1.9] mb-5"
              style={{ fontSize: "clamp(16px, 2vw, 20px)" }}
            >
              These aren't rules. They're currents. On a Lila trip, you don't study them — you feel them. The landscape, the practice, the elements conspire to carry you there. All you have to do is show up.
            </p>

            <p className="font-body text-sm font-normal text-[#7a8a9a] leading-[1.9] mb-10">
              Plan less. Experience more.
            </p>

            <div className="flex gap-6 justify-center flex-wrap">
              <Link to="/ethos" className="underline-link" onClick={() => trackEvent('philosophy_cta_clicked', { action: 'back_to_ethos' })}>Back to Our Ethos</Link>
              <Link to="/destinations" className="underline-link" onClick={() => trackEvent('philosophy_cta_clicked', { action: 'explore_destinations' })}>Explore Destinations</Link>
            </div>

            <Link
              to="/ethos/meditations"
              className="no-underline block mt-12 max-w-[480px] mx-auto relative overflow-hidden"
              onClick={() => trackEvent('philosophy_cta_clicked', { action: 'open_meditations_bottom' })}
            >
              <div
                className="py-8 px-7"
                style={{
                  background: 'linear-gradient(135deg, #5a7898 0%, #8a7880 35%, #d09070 70%, #e8a060 100%)',
                }}
              >
                <svg
                  className="absolute bottom-0 left-0 w-full"
                  style={{ height: '40%' }}
                  viewBox="0 0 390 80" preserveAspectRatio="none"
                >
                  <path d="M0,80 L0,50 L43,28 L88,42 L132,18 L176,35 L221,8 L265,27 L309,14 L354,30 L390,21 L390,80 Z" fill="rgba(12,22,36,0.7)" />
                </svg>
                <div className="relative z-10 text-center">
                  <div className="flex justify-center gap-3 mb-4">
                    {principles.map((p) => (
                      <span key={p.word} className="text-base opacity-60" style={{ color: 'white' }}>{p.icon}</span>
                    ))}
                  </div>
                  <div className="font-body text-[18px] font-bold text-white mb-1.5">
                    lila meditations
                  </div>
                  <div className="font-body text-[12px] font-normal text-white/65 tracking-[0.04em]">
                    30 practices &middot; ancient wisdom for wild places
                  </div>
                  <div className="font-body text-[11px] font-bold tracking-[0.18em] uppercase text-white/50 mt-5">
                    Explore the deck &rarr;
                  </div>
                </div>
              </div>
            </Link>
          </FadeIn>
        </div>
      </section>

      <Footer />
    </>
  );
}
