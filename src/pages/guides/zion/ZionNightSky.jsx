// ═══════════════════════════════════════════════════════════════════════════════
// SUB-GUIDE: Zion — Night Sky
// ═══════════════════════════════════════════════════════════════════════════════

import { Helmet } from 'react-helmet-async';
import SubGuideLayout from '@components/guide/SubGuideLayout';
import { G } from '@data/guides/guide-styles';
import { trackEvent } from '@utils/analytics';

// --- Data --------------------------------------------------------------------

const PARKS = [
  {
    name: 'Zion National Park',
    designation: 'IDA Dark Sky Park (2021)',
    bortle: 'Bortle Class 3–4 in canyon',
    items: [
      {
        name: 'Best viewing',
        detail:
          'Kolob Terrace Road and Lava Point offer the widest, darkest horizons — far from Springdale light pollution and high enough for unobstructed sky.',
      },
      {
        name: 'NPS Ranger stargazing programs',
        detail:
          'Seasonal, free. Rangers set up telescopes at the Zion Lodge lawn and South Campground amphitheater. Check the park calendar for dates.',
      },
    ],
  },
  {
    name: 'Bryce Canyon',
    designation: 'Bortle Class 2 — one of the darkest skies in the lower 48',
    bortle: null,
    items: [
      {
        name: 'Annual Astronomy Festival',
        detail:
          'Held every June. Four nights of telescope viewing, guest speakers, and guided constellation walks. Arrive early — it draws astronomers from across the country.',
      },
      {
        name: 'NPS telescope programs',
        detail:
          'Year-round (weather permitting). Rangers host full-moon hikes, planet viewing, and deep-sky sessions. The altitude and dry air make conditions exceptional.',
      },
      {
        name: 'Clear Sky Resorts',
        detail:
          'Stargazing-focused accommodations near the park — domed glass ceilings designed for watching the sky from bed. A rare intersection of comfort and darkness.',
      },
    ],
  },
  {
    name: 'Capitol Reef',
    designation: 'Gold Tier IDA Dark Sky Park',
    bortle: null,
    items: [
      {
        name: 'Torrey Dark Sky community',
        detail:
          'The town of Torrey earned its own dark sky designation. Street lights are shielded, businesses dim after hours — the whole community protects the night.',
      },
      {
        name: 'Fruita area for Milky Way photography',
        detail:
          'The historic orchards and Fremont River make a stunning foreground for astrophotography. The Milky Way arcs directly overhead in summer months.',
      },
      {
        name: 'Best Sept–Oct when air is clearest',
        detail:
          'Monsoon moisture clears, wildfire smoke dissipates, and the atmosphere sharpens. The fall window offers the most transparent skies of the year.',
      },
    ],
  },
];

// --- Component ---------------------------------------------------------------

export default function ZionNightSky() {
  return (
    <>
      <Helmet>
        <title>Night Sky — Zion Guide | Lila Trips</title>
        <meta name="description" content="Three parks, three dark sky designations, one extraordinary sky — Zion, Bryce Canyon, and Capitol Reef." />
      </Helmet>

      <SubGuideLayout
        title="Night Sky"
        description="Three parks, three dark sky designations, one extraordinary sky."
      >
        {PARKS.map((park, pi) => (
          <section key={pi} className={pi < PARKS.length - 1 ? 'mb-12' : 'mb-4'}>
            {/* Park header */}
            <h2
              className="font-serif font-light leading-[1.2] mt-0 mb-1"
              style={{ fontSize: 'clamp(22px, 4vw, 28px)', color: G.ink }}
            >
              {park.name}
            </h2>
            <div
              className="font-body text-[10px] font-semibold tracking-[0.14em] uppercase mb-6"
              style={{ color: G.accent }}
            >
              {park.designation}
              {park.bortle && <span className="ml-2 font-normal" style={{ color: G.ink40 }}>· {park.bortle}</span>}
            </div>

            {/* Items */}
            {park.items.map((item, ii) => (
              <div
                key={ii}
                className="py-4"
                style={{ borderBottom: '1px solid ' + G.borderSoft }}
              >
                <div className="font-body text-[14px] font-semibold mb-1" style={{ color: G.ink }}>
                  {item.name}
                </div>
                <p className="font-body text-[13px] font-normal leading-[1.6] mt-0 mb-0" style={{ color: G.ink50 }}>
                  {item.detail}
                </p>
              </div>
            ))}
          </section>
        ))}
      </SubGuideLayout>
    </>
  );
}
