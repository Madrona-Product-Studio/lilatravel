// ═══════════════════════════════════════════════════════════════════════════════
// SUB-GUIDE: Zion — Be There Well
// ═══════════════════════════════════════════════════════════════════════════════

import { Helmet } from 'react-helmet-async';
import SubGuideLayout from '@components/guide/SubGuideLayout';
import { C } from '@data/brand';
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
          <h2 className="font-serif text-[clamp(22px,4vw,28px)] font-light text-dark-ink leading-[1.2] mt-0 mb-6">
            Tread Lightly
          </h2>

          {TREAD_LIGHTLY.map((item, i) => (
            <div
              key={i}
              className="py-4 border-b"
              style={{ borderColor: C.stone }}
            >
              <div
                className="font-body text-[10px] font-bold tracking-[0.18em] uppercase mb-1"
                style={{ color: '#7A857E' }}
              >
                {item.category}
              </div>
              <div className="font-body text-[15px] font-bold text-dark-ink mb-1">
                {item.name}
              </div>
              <p className="font-body text-[14px] font-normal leading-[1.65] mt-0 mb-0" style={{ color: '#4A5650' }}>
                {item.detail}
              </p>
              {item.tags && item.tags.length > 0 && (
                <div className="flex gap-[5px] mt-[7px] flex-wrap">
                  {item.tags.map((t, j) => (
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
          ))}
        </section>

        {/* ── Give Back ─────────────────────────────────────────────────── */}
        <section className="mb-12">
          <h2 className="font-serif text-[clamp(22px,4vw,28px)] font-light text-dark-ink leading-[1.2] mt-0 mb-6">
            Give Back
          </h2>

          {GIVE_BACK.map((item, i) => (
            <div
              key={i}
              className="py-4 border-b"
              style={{ borderColor: C.stone }}
            >
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-body text-[15px] font-bold text-dark-ink no-underline transition-colors duration-200"
                style={{ borderBottom: `1px solid ${C.stone}` }}
                onMouseEnter={e => { e.target.style.borderColor = C.oceanTeal; e.target.style.color = C.slate; }}
                onMouseLeave={e => { e.target.style.borderColor = C.stone; e.target.style.color = C.darkInk; }}
                onClick={() => trackEvent('give_back_click', { name: item.name })}
              >
                {item.name}
                <span className="text-[12px] ml-1 text-[#7A857E]">↗</span>
              </a>
              <p className="font-body text-[14px] font-normal leading-[1.65] mt-1.5 mb-0" style={{ color: '#4A5650' }}>
                {item.detail}
              </p>
            </div>
          ))}
        </section>

        {/* ── Logistics & Permits ───────────────────────────────────────── */}
        <section className="mb-4">
          <h2 className="font-serif text-[clamp(22px,4vw,28px)] font-light text-dark-ink leading-[1.2] mt-0 mb-6">
            Logistics &amp; Permits
          </h2>

          {LOGISTICS.map((item, i) => (
            <div
              key={i}
              className="py-4 border-b"
              style={{ borderColor: C.stone }}
            >
              <div
                className="font-body text-[11px] font-bold tracking-[0.16em] uppercase mb-1"
                style={{ color: C.oceanTeal }}
              >
                {item.label}
              </div>
              <p className="font-body text-[14px] font-normal leading-[1.65] mt-0 mb-0" style={{ color: '#4A5650' }}>
                {item.text}
              </p>
            </div>
          ))}
        </section>
      </SubGuideLayout>
    </>
  );
}
