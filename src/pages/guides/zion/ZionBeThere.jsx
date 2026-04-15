// ═══════════════════════════════════════════════════════════════════════════════
// SUB-GUIDE: Zion — Be There Well
// ═══════════════════════════════════════════════════════════════════════════════

import { Helmet } from 'react-helmet-async';
import SubGuideLayout from '@components/guide/SubGuideLayout';
import { G } from '@data/guides/guide-styles';
import { trackEvent } from '@utils/analytics';

// --- Data --------------------------------------------------------------------

const TREAD_LIGHTLY = [
  {
    category: 'Ecology',
    name: 'Cryptobiotic Soil',
    detail:
      'The dark, crusty ground between trails is a living community of cyanobacteria, fungi, and mosses that took 50–250 years to form. A single footprint can destroy decades of growth. Stay on established trails and rock surfaces — always.',
    tags: ['Leave No Trace', 'Desert Ecology'],
  },
  {
    category: 'Crowding',
    name: 'The Narrows',
    detail:
      'Up to 3,000 visitors enter the Narrows on a peak summer day. An early-morning start — ideally at dawn — means fewer people, better light, and a quieter experience for everyone sharing the river.',
    tags: ['Dawn Start', 'Peak Season'],
  },
  {
    category: 'Access',
    name: 'Angels Landing',
    detail:
      'The permit lottery exists because the chain section was dangerously overcrowded. Apply at recreation.gov in advance (seasonal + day-before lotteries). The system works — respect it.',
    tags: ['Permit Required', 'Lottery System'],
  },
  {
    category: 'Water Ethics',
    name: 'Virgin River',
    detail:
      'Everything that enters the Virgin River — sunscreen, soap, food residue — flows downstream through Springdale and into communities that depend on this water. Use reef-safe sunscreen, pack out all waste, and never use soap in or near the river.',
    tags: ['Pack It Out', 'Watershed'],
  },
];

const GIVE_BACK = [
  {
    name: 'Zion Forever Project',
    url: 'https://www.zionpark.org',
    detail:
      'The park\'s official nonprofit partner. Funds trail restoration, wildlife research, and education programs. Their volunteer stewardship days are a meaningful way to give back with your hands.',
  },
  {
    name: 'Paiute Indian Tribe of Utah',
    url: 'https://www.pitu.gov',
    detail:
      'The Southern Paiute people have called this landscape home for thousands of years. Learn their history, support their programs, and recognize that Mukuntuweap — the original name — carries a deeper story than "Zion."',
  },
  {
    name: 'Utah Diné Bikéyah',
    url: 'https://www.utahdinebikeyah.org',
    detail:
      'A Native-led organization working to protect Indigenous ancestral lands in southern Utah, including Bears Ears. Supporting their mission honors the broader landscape this region belongs to.',
  },
];

const LOGISTICS = [
  {
    label: 'Getting there',
    text: 'Las Vegas (LAS) is ~2.5 hours by car. St. George (SGU) is ~1 hour. Both have rental car options. No public transit to the park.',
  },
  {
    label: 'Shuttle system',
    text: 'Mandatory March–November inside Zion Canyon. Free. The Springdale shuttle connects the town to the park entrance — leave your car at the hotel.',
  },
  {
    label: 'Permits',
    text: 'Angels Landing requires a lottery permit via recreation.gov (seasonal advance + day-before). The Narrows top-down (Chamberlain\'s Ranch) requires a wilderness permit. Campground reservations open 6 months ahead.',
  },
  {
    label: 'Entrance fees',
    text: '$35 per vehicle, $20 per person (walk/bike). The America the Beautiful annual pass ($80) is accepted and covers all NPS sites.',
  },
  {
    label: 'Seasonal notes',
    text: 'Summer heat demands dawn starts — midday in the canyon exceeds 105°F. Monsoon season (Jul–Sep) brings flash flood risk in slot canyons. Winter means snow on upper trails (microspikes helpful). Spring snowmelt can close the Narrows into May.',
  },
];

// --- Component ---------------------------------------------------------------

export default function ZionBeThere() {
  return (
    <>
      <Helmet>
        <title>Be There Well — Zion Guide | Lila Trips</title>
        <meta name="description" content="How to move through Zion in a way that's good for it — ethics, giving back, and practical logistics." />
      </Helmet>

      <SubGuideLayout
        title="Be There Well"
        description="How to move through this place in a way that's good for it."
      >
        {/* ── Tread Lightly ─────────────────────────────────────────────── */}
        <section className="mb-12">
          <div className="flex items-center gap-2.5 mt-9 mb-2.5">
            <span style={{ width: 28, height: 1.5, background: G.accent, display: 'block', flexShrink: 0 }} />
            <span className="font-body text-[16px] font-bold tracking-[0.01em]" style={{ color: G.ink }}>Tread Lightly</span>
          </div>

          {TREAD_LIGHTLY.map((item, i) => (
            <div
              key={i}
              className="py-4"
              style={{ borderBottom: '1px solid ' + G.borderSoft }}
            >
              <div
                className="font-body text-[9px] font-semibold tracking-[0.14em] uppercase mb-1"
                style={{ color: G.ink40 }}
              >
                {item.category}
              </div>
              <div className="font-body text-[14px] font-semibold mb-1" style={{ color: G.ink }}>
                {item.name}
              </div>
              <p className="font-body text-[13px] font-normal leading-[1.6] mt-0 mb-0" style={{ color: G.inkDetail }}>
                {item.detail}
              </p>
              {item.tags && item.tags.length > 0 && (
                <div className="flex gap-[5px] mt-[7px] flex-wrap">
                  {item.tags.map((t, j) => (
                    <span
                      key={j}
                      className="font-body text-[11px] font-medium px-[7px] py-[2px]"
                      style={{ color: G.ink40, background: G.accentPale }}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </section>

        {/* ── Give Back ─────────────────────────────────────────────────── */}
        <section className="mb-12">
          <div className="flex items-center gap-2.5 mt-9 mb-2.5">
            <span style={{ width: 28, height: 1.5, background: G.accent, display: 'block', flexShrink: 0 }} />
            <span className="font-body text-[16px] font-bold tracking-[0.01em]" style={{ color: G.ink }}>Give Back</span>
          </div>

          {GIVE_BACK.map((item, i) => (
            <div
              key={i}
              className="py-4"
              style={{ borderBottom: '1px solid ' + G.borderSoft }}
            >
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-body text-[14px] font-semibold no-underline transition-colors duration-200"
                style={{ color: G.ink, borderBottom: '1px solid ' + G.border }}
                onMouseEnter={e => { e.target.style.borderColor = G.accent; e.target.style.color = G.accent; }}
                onMouseLeave={e => { e.target.style.borderColor = G.border; e.target.style.color = G.ink; }}
                onClick={() => trackEvent('give_back_click', { name: item.name })}
              >
                {item.name}
                <span className="text-[12px] ml-1" style={{ color: G.ink40 }}>&#8599;</span>
              </a>
              <p className="font-body text-[13px] font-normal leading-[1.6] mt-1.5 mb-0" style={{ color: G.inkDetail }}>
                {item.detail}
              </p>
            </div>
          ))}
        </section>

        {/* ── Logistics & Permits ───────────────────────────────────────── */}
        <section className="mb-4">
          <h2
            className="font-serif font-light leading-[1.2] mt-0 mb-6"
            style={{ fontSize: 'clamp(22px, 4vw, 28px)', color: G.ink }}
          >
            Logistics &amp; Permits
          </h2>

          {LOGISTICS.map((item, i) => (
            <div
              key={i}
              className="py-4"
              style={{ borderBottom: '1px solid ' + G.borderSoft }}
            >
              <div
                className="font-body text-[10px] font-semibold tracking-[0.14em] uppercase mb-1"
                style={{ color: G.accent }}
              >
                {item.label}
              </div>
              <p className="font-body text-[13px] font-normal leading-[1.6] mt-0 mb-0" style={{ color: G.inkDetail }}>
                {item.text}
              </p>
            </div>
          ))}
        </section>
      </SubGuideLayout>
    </>
  );
}
