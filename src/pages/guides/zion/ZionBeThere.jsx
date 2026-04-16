import { Helmet } from 'react-helmet-async';
import SubGuideLayout from '@components/guide/SubGuideLayout';
import { SubLabel, Prose, EditorialList, ContentList } from '@components/guide';
import { G } from '@data/guides/guide-styles';
import permits from '../../../data/permits/zion.json';

const TREAD_LIGHTLY = [
  {
    context: 'Ecology',
    name: 'Cryptobiotic Soil',
    detail: 'The dark, crusty ground between trails is a living community of cyanobacteria, fungi, and mosses that took 50–250 years to form. A single footprint can destroy decades of growth. Stay on established trails and rock surfaces — always.',
  },
  {
    context: 'Crowding',
    name: 'The Narrows',
    detail: 'Up to 3,000 visitors enter the Narrows on a peak summer day. An early-morning start — ideally at dawn — means fewer people, better light, and a quieter experience for everyone sharing the river.',
  },
  {
    context: 'Access',
    name: 'Angels Landing',
    detail: 'The permit lottery exists because the chain section was dangerously overcrowded. Apply at recreation.gov in advance (seasonal + day-before lotteries). The system works — respect it.',
  },
  {
    context: 'Water Ethics',
    name: 'Virgin River',
    detail: 'Everything that enters the Virgin River — sunscreen, soap, food residue — flows downstream through Springdale and into communities that depend on this water. Use reef-safe sunscreen, pack out all waste, and never use soap in or near the river.',
  },
];

const GIVE_BACK = [
  {
    name: 'Zion Forever Project',
    url: 'https://www.zionpark.org',
    detail: 'The park\'s official nonprofit partner. Funds trail restoration, wildlife research, and education programs. Their volunteer stewardship days are a meaningful way to give back with your hands.',
  },
  {
    name: 'Paiute Indian Tribe of Utah',
    url: 'https://www.pitu.gov',
    detail: 'The Southern Paiute people have called this landscape home for thousands of years. Learn their history, support their programs, and recognize that Mukuntuweap — the original name — carries a deeper story than "Zion."',
  },
  {
    name: 'Utah Diné Bikéyah',
    url: 'https://www.utahdinebikeyah.org',
    detail: 'A Native-led organization working to protect Indigenous ancestral lands in southern Utah, including Bears Ears. Supporting their mission honors the broader landscape this region belongs to.',
  },
];

const LOGISTICS = [
  { context: 'Getting There', name: 'Airport & Driving', detail: 'Las Vegas (LAS) is ~2.5 hours by car. St. George (SGU) is ~1 hour. Both have rental car options. No public transit to the park.' },
  { context: 'In the Park', name: 'Shuttle System', detail: 'Mandatory March–November inside Zion Canyon. Free. The Springdale shuttle connects the town to the park entrance — leave your car at the hotel.' },
  { context: 'Planning Ahead', name: 'Permits', detail: 'Angels Landing requires a lottery permit via recreation.gov (seasonal advance + day-before). The Narrows top-down (Chamberlain\'s Ranch) requires a wilderness permit. Campground reservations open 6 months ahead.' },
  { context: 'Cost', name: 'Entrance Fees', detail: '$35 per vehicle, $20 per person (walk/bike). The America the Beautiful annual pass ($80) is accepted and covers all NPS sites.' },
  { context: 'Timing', name: 'Seasonal Notes', detail: 'Summer heat demands dawn starts — midday in the canyon exceeds 105°F. Monsoon season (Jul–Sep) brings flash flood risk in slot canyons. Winter means snow on upper trails (microspikes helpful). Spring snowmelt can close the Narrows into May.' },
];

const permitItems = permits.map(p => ({
  name: p.activity,
  badge: p.permitType,
  context: p.where,
  detail: p.description,
  lilaPick: false,
}));

export default function ZionBeThere() {
  return (
    <>
      <Helmet>
        <title>Travel Lightly Guide | Zion | Lila</title>
        <meta name="description" content="How to move through Zion in a way that's good for it — ethics, giving back, and practical logistics." />
      </Helmet>
      <SubGuideLayout
        title="Travel Lightly Guide"
        descriptor="How to move through this place in a way that's good for it."
      >
        <SubLabel warm>Tread Lightly</SubLabel>
        <Prose>
          The canyon is more fragile than it looks. Soil, water, wildlife, and the experience of other visitors — all of it depends on how you move through the space.
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
              {item.name} <span style={{ fontSize: 12, color: G.ink40 }}>↗</span>
            </a>
            <p style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 13, fontWeight: 400, lineHeight: 1.6, color: G.inkDetail, margin: '6px 0 0' }}>
              {item.detail}
            </p>
          </div>
        ))}

        <SubLabel warm>Native Culture</SubLabel>
        <Prose>
          The Southern Paiute people are the original stewards of this landscape. The canyon's Paiute name is Mukuntuweap — "straight canyon." The Paiute Indian Tribe of Utah maintains cultural programs and hosts the annual Restoration Powwow in Cedar City each June. Pipe Spring National Monument, jointly managed by NPS and the Kaibab Band of Paiute Indians, is one of the most historically layered sites in the corridor.
        </Prose>

        <SubLabel warm>Supporting People Here</SubLabel>
        <Prose>
          Springdale is a one-street town. When you eat at a locally owned restaurant, buy gear from a local outfitter, or stay at a family-run lodge, that money stays in the community. The corridor economy depends almost entirely on visitors who choose local over chain. Zion Guru, Deep Creek Coffee, Bit & Spur — these are the businesses that make Springdale Springdale.
        </Prose>

        <SubLabel warm>Logistics & Permits</SubLabel>
        <Prose>
          The practical details for planning a trip to Zion and its orbit.
        </Prose>
        <EditorialList items={LOGISTICS} />

        <SubLabel warm>Permit Details</SubLabel>
        <Prose>
          Several of Zion's most iconic experiences require advance permits through recreation.gov. Plan ahead — the lottery system rewards early applicants.
        </Prose>
        <ContentList items={permitItems} />
      </SubGuideLayout>
    </>
  );
}
