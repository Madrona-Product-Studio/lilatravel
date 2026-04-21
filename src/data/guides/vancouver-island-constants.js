import { C } from '@data/brand';

// ─── Parks & Wildlife Data ──────────────────────────────────────────────────

export const PARKS = [
  {
    id: "pacific-rim", name: "Pacific Rim National Park Reserve", designation: "canadian-national-park", established: 1970,
    acreage: "511 km\u00B2", elevation: "sea level\u2013900 m", attribute: "Three distinct units",
    soul: "Three landscapes in one reserve \u2014 Long Beach\u2019s endless sand, the Broken Group Islands\u2019 sheltered archipelago, and the West Coast Trail\u2019s 75 km of wilderness coastline. Parks Canada protects it in partnership with the Nuu-chah-nulth Nations.",
    facts: [
      "Long Beach unit stretches 16 km \u2014 the longest beach on Vancouver Island",
      "Broken Group Islands: 100+ islands accessible only by boat or kayak",
      "West Coast Trail: 75 km coastal trek, open May\u2013September, permit required",
    ],
    infoUrl: "https://parks.canada.ca/pn-np/bc/pacificrim",
    driveFrom: null, accent: C.oceanTeal, isAnchor: true,
  },
  {
    id: "strathcona", name: "Strathcona Provincial Park", designation: "provincial-park", established: 1911,
    acreage: "2,458 km\u00B2", elevation: null, attribute: "Oldest BC provincial park",
    soul: "British Columbia\u2019s oldest provincial park and Vancouver Island\u2019s wild interior \u2014 alpine meadows, glacier-fed lakes, and the island\u2019s highest peak. What the coast promises, Strathcona delivers in altitude.",
    facts: [
      "Contains Golden Hinde (2,195 m) \u2014 Vancouver Island\u2019s highest peak",
      "Della Falls: 440 m, one of Canada\u2019s tallest waterfalls",
      "Established 1911 \u2014 the first provincial park in British Columbia",
    ],
    infoUrl: "https://bcparks.ca/strathcona-park/",
    driveFrom: "~2.5 hrs from Tofino", accent: "#6B8F71", isAnchor: false,
  },
];

export const TOWNS = [
  {
    name: "Tofino",
    context: "Surf & Storm Capital",
    description: "Fewer than 2,000 residents at the end of the road. World-class surf at Cox Bay, old-growth forest on Meares Island, and storm watching from November through March. The Wickaninnish Inn set the standard.",
    url: "https://tourismtofino.com/",
    accent: C.oceanTeal,
  },
  {
    name: "Ucluelet",
    context: "Wild Pacific Trail",
    description: "Forty minutes south of Tofino, quieter and more weathered. The Wild Pacific Trail along the lighthouse peninsula is the best coastal walk on the island. Better value, equal beauty.",
    url: "https://visitucluelet.ca/",
    accent: C.seaGlass,
  },
  {
    name: "Victoria",
    context: "Island Capital",
    description: "The counterpoint to the west coast. Inner Harbour, the Royal BC Museum, afternoon tea at the Empress. Architectural, ceremonial, and the ferry gateway from Vancouver. A different kind of island experience.",
    url: "https://www.tourismvictoria.com/",
    accent: C.sunSalmon,
  },
  {
    name: "Nanaimo",
    context: "Ferry Hub & Harbour City",
    description: "The second-largest city on the island and a major ferry terminal from the mainland. Old Quarter walkable, harbour seaplane access, and the gateway north to the wilder parts of the island.",
    url: "https://www.tourismnanaimo.com/",
    accent: C.goldenAmber,
  },
];

export const TIMING_WINDOWS = [
  { name: 'Summer Season', context: 'Jun\u2013Sep', detail: 'Peak surf season, warmest temperatures (15\u201322\u00B0C). Long Beach busiest. Book accommodation 6+ months ahead. Best for kayaking, bear watching, and hiking without rain gear.' },
  { name: 'Fall Transition', context: 'Sep\u2013Oct', detail: 'Storm season begins, crowds thin, gray whales migrating south offshore, old-growth in its most atmospheric state. Excellent for photography.' },
  { name: 'Winter Storm Watching', context: 'Nov\u2013Feb', detail: 'The Pacific storms that roll in from November onward generate swells that can top 10 metres. Many lodges host dedicated storm watching packages. Cold (5\u201310\u00B0C) and wet \u2014 but the experience is singular.' },
  { name: 'Spring Whale Migration', context: 'Mar\u2013May', detail: 'Gray whale northward migration peaks in March\u2013April. You can watch from shore. Rain eases toward May. Wildflowers in Strathcona. West Coast Trail opens in May.' },
];

export const WILDLIFE = [
  { name: 'Gray Whale', detail: 'Northward migration peaks March\u2013April offshore from Long Beach and the headlands. One of the most reliable cetacean viewing windows on the Pacific coast. Ahousaht-guided tours recommended.' },
  { name: 'Black Bear', detail: 'Foraging along the rocky intertidal shores of Clayoquot Sound. Best viewed by zodiac with an experienced guide. Spring through fall is the active season.' },
  { name: 'Sea Otter', detail: 'Reintroduced to the west coast of Vancouver Island in the 1970s after being hunted to local extinction. Now thriving in kelp beds around Tofino and Ucluelet.' },
  { name: 'Orca', detail: 'Resident and transient pods move through the Strait of Juan de Fuca and Clayoquot Sound. Sightings are seasonal and unpredictable \u2014 but unforgettable when they happen.' },
];

export const HIGHLIGHTS = [
  { name: "Long Beach", category: "Beach \u00B7 Surf", blurb: "Sixteen kilometres of unbroken sand between Tofino and Ucluelet. The widest, longest beach on Vancouver Island. Storm waves in winter, gentle rollers in summer." },
  { name: "Meares Island Big Trees Trail", category: "Forest \u00B7 Old Growth", blurb: "A boardwalk through 1,500-year-old red cedars on Tla-o-qui-aht First Nation territory. A 15-minute water taxi from Tofino. The trees are cathedral-scale." },
  { name: "Hot Springs Cove", category: "Hot Springs \u00B7 Boat Access", blurb: "Natural hot springs on a rocky shore, accessible only by boat or floatplane from Tofino. The 2-km boardwalk through forest ends at pools carved into coastal rock." },
  { name: "Wild Pacific Trail", category: "Trail \u00B7 Lighthouse", blurb: "A 9-km network of cliff-edge trails around the Ucluelet lighthouse peninsula. Whale watching from shore in March and April. The Amphitrite Point section is the highlight." },
  { name: "Cathedral Grove", category: "Forest \u00B7 Ancient", blurb: "800-year-old Douglas firs in MacMillan Provincial Park, on the road between Nanaimo and Tofino. A cathedral of trees \u2014 some 9 feet in diameter. Pull over and walk in silence." },
  { name: "Broken Group Islands", category: "Kayak \u00B7 Archipelago", blurb: "Over 100 islands in Barkley Sound, accessible only by boat. Multi-day kayak camping through sheltered channels, sea caves, and First Nations middens. Permit required." },
];

// ─── Move / Breathe Tier Styles ─────────────────────────────────────────────

export const MOVE_TIERS = {
  hike:  { color: '#8a8078', label: 'Hike',  bg: '#8a807815' },
  water: { color: '#7BB8D4', label: 'Water', bg: '#7BB8D415' },
  ride:  { color: '#D4A853', label: 'Ride',  bg: '#D4A85315' },
};

export const MOVE_TIER_META = {
  hike:  { label: 'Hike',  desc: 'On foot',          color: '#8a8078' },
  water: { label: 'Water', desc: 'Surf & paddle',    color: '#7BB8D4' },
  ride:  { label: 'Ride',  desc: 'Cycle & roll',     color: '#D4A853' },
};

export const BREATHE_TIERS = {
  practice: { color: '#4A9B9F', label: 'Practice', bg: '#4A9B9F15' },
  soak:     { color: '#7BB8D4', label: 'Soak',     bg: '#7BB8D415' },
  restore:  { color: '#7BB8A0', label: 'Restore',  bg: '#7BB8A015' },
};

export const BREATHE_LEGEND = [
  { label: 'Practice', desc: 'In the tradition', color: '#4A9B9F' },
  { label: 'Soak',     desc: 'Water & heat',     color: '#7BB8D4' },
  { label: 'Restore',  desc: 'Integration',      color: '#7BB8A0' },
];

export const sleepFilterTiers = [
  { key: 'elemental', label: 'Elemental', desc: 'In the landscape', color: '#7BB8A0' },
  { key: 'rooted',    label: 'Rooted',    desc: 'Boutique, local',  color: '#4A9B9F' },
  { key: 'premium',   label: 'Premium',   desc: 'World-class',      color: '#D4A853' },
];
