import { Helmet } from 'react-helmet-async';
import SubGuideLayout from '@components/guide/SubGuideLayout';
import { SubLabel, Prose, EditorialList, ContentList } from '@components/guide';
import { G } from '@data/guides/guide-styles';

const TREAD_LIGHTLY = [
  {
    context: 'Highway 1',
    name: 'Erosion & Access',
    detail: 'The dramatic cliffs of Big Sur aren\'t a stable place to build a highly trafficked highway — collapses, mudslides, and fires are a recurring reality. The pullouts are engineered for momentary stops, not extended gatherings. Parking on the shoulder damages drainage infrastructure that keeps the road viable. When a section closes, it closes for everyone — including the 1,500 people who live here.',
  },
  {
    context: 'Overtourism',
    name: 'Bixby Bridge & Photo Spots',
    detail: 'Bixby Creek Bridge has become a tourist magnet — traffic jams, illegal parking, visitors clambering down unstable cliffs for the shot. Several of the most-photographed spots along this coast are on private land or actively eroding. Closed means closed. We route toward the interior trails and quieter coves instead.',
  },
  {
    context: 'Fire Risk',
    name: 'Camping & Fire Safety',
    detail: 'The Soberanes Fire of 2016 started from an illegal campfire. Big Sur\'s coastal scrub and redwood understory ignite fast in dry conditions. Dispersed camping outside designated sites is not just illegal here — it\'s genuinely dangerous for the ecosystem and for the permanent community that depends on Highway 1 remaining open. Book a site or a stay.',
  },
  {
    context: 'Community',
    name: 'Resident Awareness',
    detail: 'Big Sur\'s permanent population is just 1,500 people. Four to five million visitors come annually. Many of the most beautiful spots are on private land or actively managed for conservation. The locals who remain here have chosen a difficult life in exchange for the landscape. Respect that bargain — and when you find somewhere that feels undiscovered, consider not sharing the exact location.',
  },
];

const GIVE_BACK = [
  {
    name: 'Big Sur Land Trust',
    url: 'https://bigsurlandtrust.org',
    detail: 'Since 1978, BSLT has conserved over 45,000 acres of Monterey County coastline and interior lands. They partner with the Esselen Tribe to manage Basin Ranch using traditional ecological stewardship — one of the most direct models of Indigenous land partnership on the California coast.',
  },
  {
    name: 'Esselen Tribe of Monterey County',
    url: 'https://www.esselen.com',
    detail: 'In 2020 the Esselen Tribe regained its first ancestral homelands since displacement by the Spanish four centuries ago. Big Sur Land Trust is their partner in land stewardship. Supporting BSLT directly supports this ongoing restoration of Indigenous land relationship.',
  },
  {
    name: 'Los Padres ForestWatch',
    url: 'https://lpfw.org',
    detail: 'Watchdog organization protecting Los Padres National Forest — the interior backbone of Big Sur — from illegal off-road vehicle damage, overdevelopment, and fire mismanagement.',
  },
];

const LOGISTICS = [
  { context: 'Getting There', name: 'Airport & Driving', detail: 'Monterey Regional Airport (MRY) is the closest, about 30 minutes north of Carmel. SFO is ~3 hours. Rental car required — Highway 1 is the only road through Big Sur and there is no public transit on the coast.' },
  { context: 'Planning Ahead', name: 'Road Conditions', detail: 'Highway 1 closes periodically due to landslides, rockfalls, and storm damage. Check Caltrans conditions before you leave. Cell service is extremely limited south of Carmel — download offline maps.' },
  { context: 'Recommended', name: 'Duration', detail: '3–5 days to do the coast right. Split between Carmel/Monterey (1–2 nights) and the Big Sur corridor (2–3 nights). Rushing Highway 1 defeats the purpose.' },
  { context: 'Cost', name: 'State Park Fees', detail: '$10 per vehicle at state parks. No passes cover all of Big Sur\'s parks — each has separate parking and day-use fees.' },
  { context: 'Timing', name: 'Seasonal Notes', detail: 'Summer fog is heavy — mornings often socked in until early afternoon. Spring and fall are the best windows. Winter storms can close the road for weeks.' },
];

export default function BigSurBeThere() {
  return (
    <>
      <Helmet>
        <title>Travel Lightly Guide | Big Sur | Lila</title>
        <meta name="description" content="How to move through Big Sur in a way that's good for it — ethics, giving back, and practical logistics." />
      </Helmet>
      <SubGuideLayout
        title="Travel Lightly Guide"
        descriptor="How to move through this place in a way that's good for it."
        backPath="/destinations/big-sur"
        backLabel="Big Sur Guide"
      >
        <SubLabel warm>Tread Lightly</SubLabel>
        <Prose>
          What Big Sur asks of you is presence. The road is too narrow and winding for distraction. The vistas demand pause. How you move through this place matters — for the place itself, and for the 1,500 people who actually live here.
        </Prose>
        <EditorialList items={TREAD_LIGHTLY} />

        <SubLabel warm>Give Back</SubLabel>
        <Prose>
          These organizations do the work that keeps this landscape protected. All accept donations; some offer volunteer opportunities.
        </Prose>
        {GIVE_BACK.map((item, i) => (
          <div key={i} style={{ padding: '13px 0', borderBottom: i < GIVE_BACK.length - 1 ? `0.5px solid ${G.borderSoft}` : 'none' }}>
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 14, fontWeight: 700, color: G.darkInk, textDecoration: 'none', borderBottom: `0.5px solid ${G.ink25}` }}
            >
              {item.name} <span style={{ fontSize: 12, color: G.ink40 }}>↗︎</span>
            </a>
            <p style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 13, fontWeight: 400, lineHeight: 1.6, color: G.inkDetail, margin: '6px 0 0' }}>
              {item.detail}
            </p>
          </div>
        ))}

        <SubLabel warm>Indigenous Stewardship</SubLabel>
        <Prose>
          The Esselen people have maintained a relationship with this landscape for thousands of years. In 2020, the Esselen Tribe of Monterey County regained its first ancestral homelands since displacement by the Spanish four centuries ago — through a partnership with the Big Sur Land Trust. This is a living story of land return and cultural restoration. Approach it with respect and curiosity, not consumption.
        </Prose>

        <SubLabel warm>Logistics & Access</SubLabel>
        <Prose>
          The practical details for planning a trip to Big Sur and the Central Coast.
        </Prose>
        <EditorialList items={LOGISTICS} />
      </SubGuideLayout>
    </>
  );
}
