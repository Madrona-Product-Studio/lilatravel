import { Helmet } from 'react-helmet-async';
import SubGuideLayout from '@components/guide/SubGuideLayout';
import { SubLabel, Prose, EditorialList, ContentList } from '@components/guide';
import { G } from '@data/guides/guide-styles';
import permits from '../../../data/permits/olympic-peninsula.json';

const TREAD_LIGHTLY = [
  {
    context: 'Ecology',
    name: 'Hall of Mosses — Trail Widening',
    detail: 'The moss took decades to grow. It takes one footstep to damage it. The surge in visitors has widened and compacted trails — paths previously edged with lush moss are now bare, hard-packed dirt. Social trails to objects of interest make it worse. Stay on wooden boardwalks and established paths. Resist the urge to step off for a photo.',
  },
  {
    context: 'Crowding',
    name: 'Hoh Rainforest — Peak Season',
    detail: 'In August 2021, the Hoh Rainforest saw over 107,000 visitors — triple the count from a decade earlier. The single access road gridlocks by mid-morning. Arriving before 8am dramatically changes the experience. The Hoh River Trail beyond the first two miles sees a fraction of the crowd.',
  },
  {
    context: 'Recovery',
    name: 'Elwha River — Dam Removal',
    detail: 'The largest dam removal in US history is still healing. Two dams removed by 2014 — salmon are returning for the first time in over a century. The riparian corridor is fragile. Witness the recovery from the trail, not by wading through active restoration zones or disturbing newly colonizing vegetation.',
  },
  {
    context: 'Indigenous Territory',
    name: 'Hoh Tribe — Ancestral Home',
    detail: 'The Hoh River valley is the ancestral home of the Hoh people, who have maintained a continuous relationship with this watershed for centuries. The park\'s boundaries were drawn around — not with — the tribe. The Hoh Indian Reservation sits at the river\'s mouth. When visiting, that history is part of the landscape.',
  },
];

const GIVE_BACK = [
  {
    name: 'Lower Elwha Klallam Tribe',
    url: 'https://www.elwha.org',
    detail: 'The driving force behind the Elwha dam removal and river restoration. Staff and volunteers have planted nearly 800 acres with 425,000 native plants. The tribe accepts volunteers for restoration planting days — the most directly meaningful way to give back on the Peninsula.',
  },
  {
    name: 'North Olympic Land Trust',
    url: 'https://northolympiclandtrust.org',
    detail: 'Conserves land across Clallam County in the traditional homeland of the Hoh, Makah, Quileute, Jamestown S\'Klallam, and Lower Elwha Klallam tribes. Volunteer for site stewardship, salmon habitat monitoring, and restoration work parties.',
  },
  {
    name: 'Olympic Park Associates',
    url: 'https://www.olympicparkassociates.org',
    detail: 'The oldest friends group for Olympic National Park, funding research, conservation, and education programs inside the park boundary since 1948.',
  },
  {
    name: 'Washington Trails Association (WTA)',
    url: 'https://www.wta.org',
    detail: 'Organizes trail maintenance work parties across the Olympic Peninsula. Day and weekend events — brushing, drainage work, blowdown clearing. Family-friendly and well-organized.',
  },
  {
    name: 'Friends of the Hoh',
    url: 'https://friendsofthehoh.org',
    detail: 'Small nonprofit supporting the Hoh Rainforest corridor — education, restoration, and advocacy for one of the world\'s rarest temperate rainforest ecosystems.',
  },
];

const LOGISTICS = [
  { context: 'Getting There', name: 'Airport & Driving', detail: 'Seattle-Tacoma (SEA) is ~2.5 hours to Port Angeles. No public transit to the park. Personal vehicle required — Olympic is enormous and discontiguous.' },
  { context: 'In the Park', name: 'No Shuttle System', detail: 'Unlike Zion, there is no shuttle. Plan driving time between zones — Hoh to Hurricane Ridge is 2.5 hours. No single road connects the three ecosystems.' },
  { context: 'Planning Ahead', name: 'Permits', detail: 'Wilderness permits required for overnight backcountry and some coastal backpacking routes. Shi Shi Beach requires a Makah Recreation Pass. Campground reservations recommended in summer.' },
  { context: 'Cost', name: 'Entrance Fees', detail: '$30 per vehicle, $15 per person (walk/bike). The America the Beautiful annual pass ($80) is accepted.' },
  { context: 'Timing', name: 'Seasonal Notes', detail: 'Hurricane Ridge Road often closed late fall through spring. Rainforest trails accessible year-round but wettest Nov–Mar. Coastal trails require tide awareness — check tide tables before every hike.' },
];

const permitItems = permits.map(p => ({
  name: p.activity,
  badge: p.permitType,
  context: p.where,
  detail: p.description,
  lilaPick: false,
}));

export default function OlympicPeninsulaBeThere() {
  return (
    <>
      <Helmet>
        <title>Travel Lightly Guide | Olympic Peninsula | Lila</title>
        <meta name="description" content="How to move through the Olympic Peninsula in a way that's good for it — ethics, giving back, and practical logistics." />
      </Helmet>
      <SubGuideLayout
        title="Travel Lightly Guide"
        descriptor="How to move through this place in a way that's good for it."
        backPath="/destinations/olympic-peninsula"
        backLabel="Olympic Peninsula Guide"
      >
        <SubLabel warm>Tread Lightly</SubLabel>
        <Prose>
          One of the last temperate wildernesses in the lower 48. The moss, the rivers, the recovering salmon runs, and the experience of other visitors — all of it depends on how you move through the space.
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

        <SubLabel warm>Indigenous Nations</SubLabel>
        <Prose>
          Nine Indigenous Nations have called this peninsula home since time immemorial: the Makah, Quileute, Hoh, Quinault, Jamestown S'Klallam, Port Gamble S'Klallam, Lower Elwha Klallam, Skokomish, and Squaxin Island tribes. The land and water here carry thousands of years of their relationship. The Makah Museum in Neah Bay houses artifacts from the Ozette archaeological site — one of the most significant finds in North America. These are living traditions, not exhibits. Approach them with that understanding.
        </Prose>

        <SubLabel warm>Supporting People Here</SubLabel>
        <Prose>
          The peninsula's economy runs on tourism and timber. When you eat at locally owned restaurants, buy from tribal artisans, hire local guides, and stay at family-run lodges, that money stays in the community. The difference between a national park visit and a real experience of a place is usually the people you meet who actually live there.
        </Prose>

        <SubLabel warm>Logistics & Permits</SubLabel>
        <Prose>
          The practical details for planning a trip to the Olympic Peninsula.
        </Prose>
        <EditorialList items={LOGISTICS} />

        <SubLabel warm>Permit Details</SubLabel>
        <Prose>
          Several of Olympic's backcountry and coastal experiences require advance permits. Plan ahead — popular coastal campsites book quickly in summer.
        </Prose>
        <ContentList items={permitItems} />
      </SubGuideLayout>
    </>
  );
}
