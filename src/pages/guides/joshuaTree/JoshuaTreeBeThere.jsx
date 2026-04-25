import { Helmet } from 'react-helmet-async';
import SubGuideLayout from '@components/guide/SubGuideLayout';
import { SubLabel, Prose, EditorialList, ContentList } from '@components/guide';
import { G } from '@data/guides/guide-styles';
import permits from '../../../data/permits/joshua-tree.json';

const TREAD_LIGHTLY = [
  {
    context: 'Joshua Trees',
    name: 'Age & Fragility',
    detail: 'Joshua trees grow roughly an inch a year — the ones lining the trail may be a century old or more. Off-trail movement compacts soil that took millennia to develop and damages root systems that aren\'t visible from the surface. Stay on trail without exception. The desert floor looks empty. It isn\'t.',
  },
  {
    context: 'Dark Sky',
    name: 'IDA Certification',
    detail: 'Joshua Tree sits sandwiched between the Inland Empire\'s 4 million residents to the west and the last pool of natural darkness in Southern California to the east. The park earned International Dark Sky Park designation in 2017. That status depends on visitors using red-filtered lights at night, staying in designated stargazing areas, and not pulling off-road into undisturbed terrain.',
  },
  {
    context: 'Wildlife',
    name: 'Peregrine Falcons · Seasonal Closures',
    detail: 'In spring, certain trails and rock-climbing routes close to protect nesting peregrine falcons. These closures are temporary and specific. Respecting them is the difference between a falcon pair successfully nesting and abandoning the site entirely. Check the NPS alerts page before you arrive — route closures shift year to year.',
  },
  {
    context: 'Camping',
    name: 'Fire & Waste',
    detail: 'During the 2019 government shutdown, visitors camped illegally in sensitive areas and drove off-road vehicles over fragile landscapes, creating new roads in previously undisturbed terrain. Camp only in designated sites. Pack out all waste. Never build fires outside established rings — desert scrub ignites fast and the park has limited suppression capacity.',
  },
];

const GIVE_BACK = [
  {
    name: 'Mojave Desert Land Trust',
    url: 'https://www.mdlt.org',
    detail: 'Based in Joshua Tree, MDLT protects the California desert through land acquisition, habitat restoration, and a native plant seed bank — including growing thousands of Joshua trees for replanting in the park. Volunteer on land monitoring hikes or donate to their seed bank program.',
  },
  {
    name: 'Native American Land Conservancy',
    url: 'https://www.nativeamericanlandconservancy.org',
    detail: 'A partner in MDLT\'s Joshua tree conservation coalition, bringing Indigenous cultural knowledge to desert stewardship. To Indigenous communities in this region, the Joshua tree — Humwichawa — is a family member, not a landmark.',
  },
  {
    name: 'Joshua Tree National Park Volunteer Program',
    url: 'https://www.nps.gov/jotr/getinvolved/volunteer.htm',
    detail: 'The most direct option for visitors who want to give time rather than money. Trail maintenance, restoration, and education programs run directly through the park.',
  },
];

const LOGISTICS = [
  { context: 'Getting There', name: 'Airport & Driving', detail: 'Palm Springs International (PSP) is the closest airport, about 45 minutes from the park. LAX is ~2.5 hours. Rental car required — there is no public transit to the park.' },
  { context: 'In the Park', name: 'Entrances', detail: 'Three entrances: North (Joshua Tree town), West (via Hwy 62), and South (off I-10). The north entrance is most convenient for the Mojave section. The south entrance accesses the Colorado Desert.' },
  { context: 'Planning Ahead', name: 'Reservations', detail: 'Campground reservations at recreation.gov open up to 6 months in advance. Popular sites (Jumbo Rocks, Hidden Valley) fill fast for peak season weekends.' },
  { context: 'Cost', name: 'Entrance Fees', detail: '$30 per vehicle, $15 per person (walk/bike). The America the Beautiful annual pass ($80) is accepted and covers all NPS sites.' },
  { context: 'Timing', name: 'Seasonal Notes', detail: 'Summer heat can exceed 110°F — avoid midday exposure. The park\'s peak season is October through April. Spring wildflowers are weather-dependent and unpredictable. Winter nights drop below freezing.' },
];

const permitItems = permits.map(p => ({
  name: p.activity,
  badge: p.permitType,
  context: p.where,
  detail: p.description,
  lilaPick: false,
}));

export default function JoshuaTreeBeThere() {
  return (
    <>
      <Helmet>
        <title>Travel Lightly Guide | Joshua Tree | Lila</title>
        <meta name="description" content="How to move through Joshua Tree in a way that's good for it — ethics, giving back, and practical logistics." />
      </Helmet>
      <SubGuideLayout
        title="Travel Lightly Guide"
        descriptor="How to move through this place in a way that's good for it."
        backPath="/destinations/joshua-tree"
        backLabel="Joshua Tree Guide"
      >
        <SubLabel warm>Tread Lightly</SubLabel>
        <Prose>
          The desert is more fragile than it looks. Soil, trees, wildlife, and the experience of other visitors — all of it depends on how you move through the space.
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
          The Serrano and Cahuilla peoples have maintained a relationship with this landscape for thousands of years. To Indigenous communities in this region, the Joshua tree — Humwichawa — is a family member, not a landmark. The Native American Land Conservancy works to bring Indigenous cultural knowledge to contemporary desert stewardship. Approach these traditions with respect and curiosity, not consumption.
        </Prose>

        <SubLabel warm>Logistics & Access</SubLabel>
        <Prose>
          The practical details for planning a trip to Joshua Tree and its orbit.
        </Prose>
        <EditorialList items={LOGISTICS} />

        <SubLabel warm>Permit Details</SubLabel>
        <Prose>
          Some of Joshua Tree's experiences require advance reservations or permits. Plan ahead — popular campsites and backcountry permits go fast in peak season.
        </Prose>
        <ContentList items={permitItems} />
      </SubGuideLayout>
    </>
  );
}
