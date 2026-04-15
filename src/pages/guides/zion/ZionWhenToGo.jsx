// ═══════════════════════════════════════════════════════════════════════════════
// SUB-GUIDE: Zion — When to Go
// ═══════════════════════════════════════════════════════════════════════════════

import { Helmet } from 'react-helmet-async';
import SubGuideLayout from '@components/guide/SubGuideLayout';
import { C } from '@data/brand';
import { trackEvent } from '@utils/analytics';

// --- Data --------------------------------------------------------------------

const MAGIC_WINDOWS = [
  {
    dates: 'Late Sept – Oct',
    name: 'The Golden Corridor',
    description:
      'Cottonwoods along the Virgin River turn gold, crowds thin to manageable levels, and the low-angle autumn light paints the canyon walls in deeper reds. This is the window most locals would choose.',
    tags: ['★ Threshold Trip Timing'],
  },
  {
    dates: 'Late Mar – Early Apr',
    name: 'Spring Equinox',
    description:
      'Snowmelt feeds waterfalls that only exist for a few weeks. Wildflowers begin in the lower elevations. The park transitions from winter quiet to spring energy — still uncrowded, already warm enough for long days.',
  },
  {
    dates: 'Apr – Early May',
    name: 'Desert Bloom',
    description:
      'Peak wildflower season at lower elevations. Temperatures hover in the 70s — ideal for full-day canyon exploration. The Narrows may still be closed from snowmelt, but everything else is wide open.',
  },
  {
    dates: 'Jun – Sep nights',
    name: 'Dark Sky Season',
    description:
      'The longest, warmest nights of the year. Warm enough to sit outside at midnight. The Milky Way arcs directly overhead. Pair with Bryce Canyon\'s Bortle 2 skies for the full experience.',
  },
  {
    dates: 'Dec 19–22',
    name: 'Winter Solstice',
    description:
      'Snow caps the upper rim while the canyon floor stays accessible. No shuttle, no crowds — drive the scenic road yourself. The shortest day of the year brings the most dramatic light into the narrow canyon.',
  },
];

const SEASONS = [
  {
    name: 'Spring',
    months: 'Mar – May',
    text: 'The canyon comes alive. Waterfalls run, wildflowers bloom in waves, and temperatures climb from cool mornings to warm afternoons. Spring snowmelt can close the Narrows into May — check conditions. Pack layers: mornings are 40s, afternoons reach 70–80°F.',
  },
  {
    name: 'Summer',
    months: 'Jun – Aug',
    text: 'Hot. Canyon floor regularly exceeds 105°F by midday. Start every activity at dawn and be done by noon. Monsoon storms roll in July–September, bringing flash flood risk to slot canyons — never enter The Narrows when rain is forecast. Pack sun protection, electrolytes, and more water than you think.',
  },
  {
    name: 'Fall',
    months: 'Sep – Nov',
    text: 'The best season. Temperatures moderate, cottonwoods turn gold, and summer crowds disappear. Late September through October is the sweet spot. Pack a light jacket for mornings and evening chill. The shuttle runs through late November.',
  },
  {
    name: 'Winter',
    months: 'Dec – Feb',
    text: 'Quiet and dramatic. Snow on the upper trails transforms the landscape. The shuttle stops running — drive the scenic road yourself. Upper trails may require microspikes or be closed entirely. Pack warm layers and waterproof boots. Fewer visitors means solitude is easy to find.',
  },
];

// --- Component ---------------------------------------------------------------

export default function ZionWhenToGo() {
  return (
    <>
      <Helmet>
        <title>When to Go — Zion Guide | Lila Trips</title>
        <meta name="description" content="The full seasonal picture for Zion — magic windows, month by month." />
      </Helmet>

      <SubGuideLayout
        title="When to Go"
        description="The full seasonal picture — magic windows, month by month."
      >
        {/* ── Magic Windows ─────────────────────────────────────────────── */}
        <section className="mb-12">
          <h2 className="font-serif text-[clamp(22px,4vw,28px)] font-light text-dark-ink leading-[1.2] mt-0 mb-6">
            Magic Windows
          </h2>

          {MAGIC_WINDOWS.map((w, i) => (
            <div key={i}>
              <div className="py-5">
                <div
                  className="font-body text-[10px] font-bold tracking-[0.18em] uppercase mb-2"
                  style={{ color: C.oceanTeal }}
                >
                  {w.dates}
                </div>
                <div className="font-serif text-[18px] font-light text-dark-ink leading-[1.25] mb-2">
                  {w.name}
                </div>
                <p className="font-body text-[14px] font-normal leading-[1.65] mt-0 mb-0" style={{ color: '#4A5650' }}>
                  {w.description}
                </p>
                {w.tags && w.tags.length > 0 && (
                  <div className="flex gap-[5px] mt-[7px] flex-wrap">
                    {w.tags.map((t, j) => (
                      <span
                        key={j}
                        className="font-body text-[11px] font-semibold px-2 py-0.5"
                        style={{ color: '#7A857E', background: C.stone + '60' }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              {i < MAGIC_WINDOWS.length - 1 && (
                <div style={{ height: 1, background: C.stone }} />
              )}
            </div>
          ))}
        </section>

        {/* ── Seasonal Overview ─────────────────────────────────────────── */}
        <section className="mb-4">
          <h2 className="font-serif text-[clamp(22px,4vw,28px)] font-light text-dark-ink leading-[1.2] mt-0 mb-6">
            Seasonal Overview
          </h2>

          {SEASONS.map((s, i) => (
            <div
              key={i}
              className="py-4 border-b"
              style={{ borderColor: C.stone }}
            >
              <div className="flex items-baseline gap-2 mb-1.5">
                <div className="font-body text-[15px] font-bold text-dark-ink">
                  {s.name}
                </div>
                <div
                  className="font-body text-[11px] font-bold tracking-[0.14em] uppercase"
                  style={{ color: '#7A857E' }}
                >
                  {s.months}
                </div>
              </div>
              <p className="font-body text-[14px] font-normal leading-[1.65] mt-0 mb-0" style={{ color: '#4A5650' }}>
                {s.text}
              </p>
            </div>
          ))}
        </section>
      </SubGuideLayout>
    </>
  );
}
