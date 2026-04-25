import { Helmet } from 'react-helmet-async';
import SubGuideLayout from '@components/guide/SubGuideLayout';
import { SubLabel, Prose, EditorialList } from '@components/guide';
import { G } from '@data/guides/guide-styles';

const TREAD_LIGHTLY = [
  {
    context: 'Unceded Territory',
    name: 'This is unceded territory',
    detail: 'Much of Vancouver Island remains the unceded traditional territories of the Kwakwaka\u2019wakw, Nuu-chah-nulth, and Coast Salish peoples \u2014 meaning it was never ceded through treaty. Protected areas on this island move at the speed of the local First Nations whose territories they occupy. The land you\u2019re walking has Indigenous governance, law, and relationship that precede and supersede park boundaries.',
  },
  {
    context: 'Old-Growth Crisis',
    name: 'Vancouver Island is down to 20% of its original ancient forest',
    detail: 'By the early 1990s, just 30% of the Island\u2019s original forest remained unlogged. Today it\u2019s down to 20%, with only around 3% of the most productive valley-bottom old growth still standing. The Fairy Creek blockades \u2014 the largest act of civil disobedience in Canadian history, with over 1,100 arrests \u2014 were an attempt to save some of the last intact valleys. When you walk among these trees, you\u2019re in contested, living terrain.',
  },
  {
    context: 'Coastal Access',
    name: 'Tofino\u2019s permanent population is 2,500. Summer brings 20 times that',
    detail: 'The Tofino corridor absorbs extreme visitor density against a tiny permanent community and a sensitive marine environment. Grey whale migration, sea otters, and nesting shorebirds share the coastline with surfers and day-trippers. Stay on boardwalks in the dune systems, give wide berth to any wildlife, and book well ahead so you\u2019re not improvising accommodation in sensitive areas.',
  },
  {
    context: 'Indigenous-Led Tourism',
    name: 'Seek out Indigenous-led experiences',
    detail: 'Several First Nations on Vancouver Island operate exceptional cultural tourism \u2014 Tla-o-qui-aht Tribal Parks near Tofino, Namgis First Nation in Alert Bay, and others. These aren\u2019t add-ons to a trip \u2014 they\u2019re the most grounded way to understand where you are. Booking directly with Indigenous-operated guides and lodges ensures revenue flows to the community and that the experience is sanctioned rather than extracted.',
  },
];

const GIVE_BACK = [
  {
    name: 'Tla-o-qui-aht Tribal Parks',
    url: 'https://www.tribalparks.com',
    detail: 'Tla-o-qui-aht and neighbouring First Nations have protected 76,000 hectares of critical habitat \u2014 the largest intact coastal temperate rainforest on Vancouver Island \u2014 through Indigenous governance. Donate directly or look for the Tribal Parks Allies logo on Tofino businesses whose 1% revenue contribution funds Guardian programs on the ground.',
  },
  {
    name: 'Ancient Forest Alliance',
    url: 'https://ancientforestalliance.org',
    detail: 'The leading charitable organization working to protect BC\u2019s endangered old-growth forests and ensure a transition to sustainable second-growth forestry. Direct donations support advocacy, documentation, and political pressure on the BC government.',
  },
  {
    name: 'U\u2019mista Cultural Centre',
    url: 'https://www.umista.ca',
    detail: 'Located in Alert Bay on Cormorant Island, U\u2019mista houses historic potlatch artifacts and works to ensure the survival of Kwakwa\u0332ka\u0332\u02BCwakw cultural heritage through exhibits, tours, and dance performances. Visit and donate directly.',
  },
];

const LOGISTICS = [
  { context: 'Getting There', name: 'Ferries & Flights', detail: 'BC Ferries from Tsawwassen (Vancouver) to Swartz Bay (Victoria) or Duke Point (Nanaimo). ~1.5\u20132 hours. Harbour Air seaplanes from Vancouver to Tofino or Victoria. Victoria International Airport (YYJ) has direct flights from across Canada.' },
  { context: 'Getting Around', name: 'Driving the Island', detail: 'Highway 4 from Nanaimo to Tofino is ~3 hours through Cathedral Grove. Highway 1 runs the east coast. No public transit to the west coast \u2014 a car is essential for Tofino and Ucluelet.' },
  { context: 'Planning Ahead', name: 'Permits & Reservations', detail: 'West Coast Trail requires a permit via reservation (Parks Canada). Pacific Rim day-use fees apply. Accommodation in Tofino books out 6+ months ahead in summer.' },
  { context: 'Cost', name: 'Park Fees', detail: 'Pacific Rim National Park Reserve: $10.50 CAD/adult daily. Parks Canada Discovery Pass ($72.25 CAD) covers all national parks for the year.' },
];

export default function VancouverIslandBeThere() {
  return (
    <>
      <Helmet>
        <title>Travel Lightly Guide | Vancouver Island | Lila</title>
        <meta name="description" content="How to move through Vancouver Island in a way that honours the land \u2014 ethics, giving back, and practical logistics." />
      </Helmet>
      <SubGuideLayout
        title="Travel Lightly Guide"
        descriptor="How to move through this place in a way that honours it."
        backPath="/destinations/vancouver-island"
        backLabel="Vancouver Island Guide"
      >
        <SubLabel warm>Tread Lightly</SubLabel>
        <Prose>
          This land has a legal and spiritual context that precedes any trail map. The forests, waters, and shorelines here are still in relationship with the people who have always called them home.
        </Prose>
        <EditorialList items={TREAD_LIGHTLY} />

        <SubLabel warm>Give Back</SubLabel>
        <Prose>
          These organizations do the work that keeps this landscape protected and its cultures alive. All accept donations; some offer volunteer opportunities.
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

        <SubLabel warm>Logistics & Permits</SubLabel>
        <Prose>
          The practical details for planning a trip to Vancouver Island.
        </Prose>
        <EditorialList items={LOGISTICS} />
      </SubGuideLayout>
    </>
  );
}
