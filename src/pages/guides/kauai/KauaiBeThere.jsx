import { Helmet } from 'react-helmet-async';
import SubGuideLayout from '@components/guide/SubGuideLayout';
import { SubLabel, Prose, EditorialList, ContentList } from '@components/guide';
import { G } from '@data/guides/guide-styles';
import permits from '../../../data/permits/kauai.json';

const TREAD_LIGHTLY = [
  {
    context: 'Visitor Density',
    name: 'Hawaii receives more visitors per resident than almost anywhere on earth.',
    detail: 'Hawaii hit a record 10.4 million visitors in 2019 — for a resident population of 1.4 million, on a chain of islands with finite resources. Kauai is the least developed of the major islands and absorbs this pressure on a smaller infrastructure. The tension between residents and visitors is real and documented. Traveling with awareness of that dynamic is part of what it means to visit respectfully.',
  },
  {
    context: 'Sacred Sites',
    name: 'Some places are not on the map. They shouldn\'t be.',
    detail: 'Heiau — ancient Hawaiian temples, fishing shrines, and ceremonial platforms — have been desecrated in their use as tourist attractions, and hundreds have been destroyed for resort development. Several heiau on Kauai are known to locals and deliberately kept off visitor maps. We do not put these places on itineraries. If you encounter a site that looks ceremonial or marked, leave it undisturbed and do not photograph it.',
  },
  {
    context: 'Trail Safety',
    name: 'Rescues on the Kalalau Trail are common. Go prepared or don\'t go.',
    detail: 'The Kalalau Trail is one of the most spectacular and most dangerous trails in the United States. Flash flooding, steep unprotected sections, and difficult river crossings have killed experienced hikers. Permits are required and limited. Day hiking to Hanakapiai Beach (2 miles) requires no permit — the full 11-mile Kalalau Trail requires a camping permit.',
  },
  {
    context: 'Community Access',
    name: 'Ha\'ena State Park developed a new model. Follow it.',
    detail: 'Ha\'ena State Park was the first in Hawaii to set a daily visitor cap, managed by nonprofits led by Native Hawaiian lineal descendants. Nonresidents must reserve and pay for entry. This is what responsible access looks like in practice — a community-led system built because the alternative was losing the place entirely. Book your reservation, pay the fee, and recognize the system as the point.',
  },
];

const GIVE_BACK = [
  {
    name: 'Malama Hawaii',
    url: 'https://www.gohawaii.com/malama',
    detail: 'A statewide program connecting visitors to volunteer opportunities — beach cleanups, native tree planting, cultural preservation projects. Several participating hotels offer a complimentary night in exchange for a volunteer day. One of the cleanest models in regenerative tourism anywhere.',
  },
  {
    name: 'Hawaii Conservation Alliance',
    url: 'https://www.hawaiiconservation.org',
    detail: 'Provides unified scientific and community leadership to conserve and restore native ecosystems across the islands, guided by Hawaiian values and practice. Donations support watershed protection and native species restoration.',
  },
  {
    name: 'Malama Kauai',
    url: 'https://malamakauai.org',
    detail: 'Kauai-based community organization running local food, land stewardship, and cultural programs rooted in Native Hawaiian relationships to the land. Beach cleanup events, native planting, and community food programs are open to visitors.',
  },
  {
    name: 'Hawaii Natural Area Reserves System',
    url: 'https://dlnr.hawaii.gov/ecosystems/nars/donate',
    detail: 'Direct donations fund protection of critical watersheds and native habitats — including culturally significant areas not open to visitors that depend entirely on funding to survive. One of the most direct conservation giving options in the state.',
  },
];

const LOGISTICS = [
  { context: 'Getting There', name: 'Airport & Driving', detail: 'Lihue Airport (LIH) is the only commercial airport on Kauai. Direct flights from the West Coast and interisland from Honolulu. Rental car is essential — there is no meaningful public transit.' },
  { context: 'Access', name: 'Ha\'ena Reservations', detail: 'Ha\'ena State Park (Ke\'e Beach / Kalalau Trailhead) requires advance reservations for nonresidents. Book at gohaena.com. Slots fill quickly in peak season.' },
  { context: 'Planning Ahead', name: 'Kalalau Trail Permit', detail: 'Camping permit required for anything past Hanakapiai (mile 2). Apply through Hawaii DLNR. Limited to 60 campers per night. Book months in advance.' },
  { context: 'Cost', name: 'State Park Fees', detail: 'Hawaii state parks charge per-person entry fees for nonresidents. Ha\'ena is $5/person + $10/car. Waimea Canyon and Koke\'e charge $5/person for nonresidents.' },
  { context: 'Timing', name: 'Seasonal Notes', detail: 'North Shore surf peaks November through February — swimming is dangerous. South Shore is swimmable year-round. Rainy season (Nov-Mar) brings heavier precipitation to the north and west. Trade winds moderate temperatures year-round.' },
];

const permitItems = permits.map(p => ({
  name: p.activity,
  badge: p.permitType,
  context: p.where,
  detail: p.description,
  lilaPick: false,
}));

export default function KauaiBeThere() {
  return (
    <>
      <Helmet>
        <title>Travel Lightly Guide | Kauai | Lila</title>
        <meta name="description" content="How to move through Kauai in a way that's good for it — ethics, giving back, and practical logistics." />
      </Helmet>
      <SubGuideLayout
        title="Travel Lightly Guide"
        descriptor="How to move through this place in a way that's good for it."
        backPath="/destinations/kauai"
        backLabel="Kauai Guide"
      >
        <SubLabel warm>Tread Lightly</SubLabel>
        <Prose>
          Hawaii receives more visitors per resident than almost anywhere on earth. Kauai is the least developed of the major islands. The tension between residents and visitors is real. Traveling with awareness of that dynamic is part of what it means to visit.
        </Prose>
        <EditorialList items={TREAD_LIGHTLY} />

        <SubLabel warm>Give Back</SubLabel>
        <Prose>
          These organizations do the work that keeps this landscape protected. All accept donations; some offer volunteer opportunities that are genuinely meaningful.
        </Prose>
        {GIVE_BACK.map((item, i) => (
          <div key={i} style={{ padding: '13px 0', borderBottom: i < GIVE_BACK.length - 1 ? `0.5px solid ${G.borderSoft}` : 'none' }}>
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 14, fontWeight: 700, color: G.darkInk, textDecoration: 'none', borderBottom: `0.5px solid ${G.ink25}` }}
            >
              {item.name} <span style={{ fontSize: 12, color: G.ink40 }}>↗</span>
            </a>
            <p style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 13, fontWeight: 400, lineHeight: 1.6, color: G.inkDetail, margin: '6px 0 0' }}>
              {item.detail}
            </p>
          </div>
        ))}

        <SubLabel warm>Native Culture</SubLabel>
        <Prose>
          The Hawaiian people have called Kauai home for over 1,500 years. Place names carry living history: Hanalei means "crescent bay"; Waimea means "reddish water." The island avoided many of the worst impacts of tourism development through a building-height ordinance and through active Native Hawaiian advocacy. That restraint shapes what Kauai still is. Approach Hawaiian cultural sites, practices, and knowledge with the understanding that these are living traditions, not museum exhibits.
        </Prose>

        <SubLabel warm>Logistics & Permits</SubLabel>
        <Prose>
          The practical details for planning a trip to Kauai.
        </Prose>
        <EditorialList items={LOGISTICS} />

        <SubLabel warm>Permit Details</SubLabel>
        <Prose>
          Several of Kauai's most iconic experiences require advance permits or reservations. Plan ahead — availability is limited.
        </Prose>
        <ContentList items={permitItems} />
      </SubGuideLayout>
    </>
  );
}
