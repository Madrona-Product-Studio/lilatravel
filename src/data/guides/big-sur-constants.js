import { C } from '@data/brand';

// ─── Parks Data ─────────────────────────────────────────────────────────────

export const PARKS = [
  {
    id: "los-padres", name: "Los Padres National Forest", designation: "national-forest", established: 1906,
    acreage: "1.75M ac", elevation: "sea level–5,862 ft", attribute: "Multi-jurisdiction corridor",
    soul: "The wild backbone of Big Sur — nearly two million acres of chaparral, oak woodland, and coastal mountains stretching from Carmel to Ventura. Most of Big Sur's backcountry trails, hot springs, and wilderness areas fall within Los Padres.",
    facts: [
      "Contains the Ventana Wilderness and Silver Peak Wilderness",
      "Sykes Hot Springs and Tassajara Hot Springs lie within its boundaries",
      "Managed by the USDA Forest Service, distinct from state park lands",
    ],
    infoUrl: "https://www.fs.usda.gov/lpnf",
    url: "https://www.fs.usda.gov/lpnf",
    driveFrom: null, accent: C.seaGlass, isAnchor: false,
  },
  {
    id: "julia-pfeiffer", name: "Julia Pfeiffer Burns State Park", designation: "state-park", established: 1962,
    acreage: "3,762 ac", elevation: null, attribute: "McWay Falls",
    soul: "Home to McWay Falls — an 80-foot waterfall that drops directly onto a pristine cove beach. One of the most photographed spots on the California coast, and one of only two tidefall waterfalls in the state.",
    facts: [
      "McWay Falls drops 80 ft directly onto the beach",
      "Named for Julia Pfeiffer Burns, a Big Sur pioneer",
      "Underwater area designated as a marine protected area",
    ],
    infoUrl: "https://www.parks.ca.gov/?page_id=578",
    url: "https://www.parks.ca.gov/?page_id=578",
    driveFrom: "~20 min from Big Sur Station", accent: "#B07D4B", isAnchor: false,
  },
  {
    id: "pfeiffer-big-sur", name: "Pfeiffer Big Sur State Park", designation: "state-park", established: 1933,
    acreage: "1,006 ac", elevation: null, attribute: "Redwood groves",
    soul: "The heart of Big Sur's valley — old-growth redwoods along the Big Sur River, with some of the most accessible trails in the region. The park that makes Big Sur feel habitable.",
    facts: [
      "Contains old-growth coast redwood groves along the Big Sur River",
      "Pfeiffer Falls trail is the most accessible waterfall hike in Big Sur",
      "Big Sur Lodge sits within the park boundaries",
    ],
    infoUrl: "https://www.parks.ca.gov/?page_id=570",
    url: "https://www.parks.ca.gov/?page_id=570",
    driveFrom: "~5 min from Big Sur Station", accent: "#6B8F71", isAnchor: false,
  },
  {
    id: "andrew-molera", name: "Andrew Molera State Park", designation: "state-park", established: 1972,
    acreage: "4,766 ac", elevation: null, attribute: "Largest Big Sur state park",
    soul: "The largest state park in Big Sur — where the Big Sur River meets the ocean. Open meadows, beach access, and the best birding on the coast. Less crowded than Pfeiffer, more expansive.",
    facts: [
      "Largest state park on the Big Sur coast",
      "Where the Big Sur River meets the Pacific",
      "Home to the Ventana Wildlife Society's condor observation point",
    ],
    infoUrl: "https://www.parks.ca.gov/?page_id=582",
    url: "https://www.parks.ca.gov/?page_id=582",
    driveFrom: "~15 min north of Big Sur Station", accent: "#5A7E8C", isAnchor: false,
  },
];

// ─── Towns Data ─────────────────────────────────────────────────────────────

export const TOWNS = [
  {
    name: "Big Sur",
    context: "Highway 1 Corridor",
    description: "Not a town so much as a state of mind. Sixty miles of coast between Carmel and San Simeon with no traffic lights. Nepenthe, Deetjen's, and the Henry Miller Library are the landmarks.",
    url: "https://www.bigsurcalifornia.org/",
    accent: C.sunSalmon,
    lat: 36.2704, lng: -121.8081,
  },
  {
    name: "Carmel-by-the-Sea",
    context: "Artistic Village",
    description: "A one-square-mile village with no street addresses, no chain restaurants, and more than 80 art galleries. The beach at the bottom of Ocean Avenue is one of the most beautiful in California.",
    url: "https://www.carmelcalifornia.com/",
    accent: C.seaGlass,
    lat: 36.5554, lng: -121.9233,
  },
  {
    name: "Monterey",
    context: "Cannery Row & Aquarium",
    description: "Steinbeck's old fishing town, now anchored by the Monterey Bay Aquarium. The wharf, the coastal trail, and Pacific Grove's Victorian neighborhoods are all walkable from downtown.",
    url: "https://www.seemonterey.com/",
    accent: C.oceanTeal,
    lat: 36.6002, lng: -121.8947,
  },
  {
    name: "Cambria & San Simeon",
    context: "Southern Anchor",
    description: "The quiet end of the coast. Elephant seal rookery at Piedras Blancas, Hearst Castle above the fog line, and Cambria's East Village art scene.",
    url: "https://www.visitcambria.com/",
    accent: C.goldenAmber,
    lat: 35.5641, lng: -121.0893,
  },
];

// ─── Highlights ─────────────────────────────────────────────────────────────

export const HIGHLIGHTS = [
  { name: "McWay Falls", category: "Waterfall · Cove", blurb: "An 80-foot waterfall that drops directly onto a turquoise cove beach. The definitive image of this coast. Viewable from the overlook trail — no beach access." },
  { name: "Bixby Creek Bridge", category: "Landmark · Drive", blurb: "The most photographed bridge in California. 714 feet long, 280 feet above the canyon floor. Best seen from the pullout on the north side at golden hour." },
  { name: "Pfeiffer Beach", category: "Beach · Keyhole Rock", blurb: "Purple sand and a natural rock arch that frames the sunset in winter. The unmarked turnoff on Sycamore Canyon Road is easy to miss. That's part of the charm." },
  { name: "Ewoldsen Trail", category: "Trail · Redwoods", blurb: "A 4.3-mile loop through old-growth redwoods that opens onto coastal ridge views. The transition from forest floor to exposed ridge happens in a single switchback." },
  { name: "Point Lobos", category: "Reserve · Tide Pools", blurb: "The crown jewel of California's state reserves. Sea otters in the kelp, harbor seals on the rocks, and some of the richest tide pools on the coast." },
  { name: "Limekiln State Park", category: "Beach · History", blurb: "Four 19th-century lime kilns standing in a redwood canyon, a waterfall at the end of the trail, and a rocky beach with sea stacks. Most visitors never make it this far south." },
];

// ─── Wildlife ───────────────────────────────────────────────────────────────

export const WILDLIFE = [
  { name: "California Condor", season: "Year-round", detail: "Reintroduced to the Big Sur coast. Wingspan up to 9.5 ft — visible as a dark silhouette riding thermals above the coastal ridges. Andrew Molera State Park hosts the Ventana Wildlife Society's condor observation point." },
  { name: "Southern Sea Otter", season: "Year-round", detail: "Visible from Point Lobos and throughout the kelp beds along the Monterey Bay coast. Watch for them floating on their backs, cracking shellfish on their stomachs." },
  { name: "Gray Whale", season: "Dec – Apr", detail: "Southbound December through February, northbound March through April. Point Lobos and the McWay Falls overlook are premier shore-watching spots." },
  { name: "Monarch Butterfly", season: "Oct – Feb", detail: "Tens of thousands of monarchs overwinter in the Pacific Grove eucalyptus grove near Monterey. The trees draped in living orange. A short walk through the grove is genuinely moving." },
  { name: "Elephant Seal", season: "Year-round, peak Dec – Mar", detail: "Piedras Blancas rookery near San Simeon hosts thousands of northern elephant seals. Pupping season peaks in January — the beach is otherworldly." },
];

// ─── Timing Windows ─────────────────────────────────────────────────────────

export const TIMING_WINDOWS = [
  { name: 'Spring Wildflowers & Waterfalls', context: 'Mar – May', detail: 'The coast at its most lush and green. Wildflowers through April. Waterfalls at maximum flow after winter rains. McWay Falls and Pfeiffer Falls at their most dramatic. Fog common in the mornings but burns off by noon. Best overall window.' },
  { name: 'Gray Whale Migration', context: 'Dec – Apr', detail: 'Gray whales migrate south December through February, north March through April. Peak shore-watching January through March. Point Lobos and the McWay Falls overlook are premier viewing spots.' },
  { name: 'Fall Shoulder Season', context: 'Sep – Nov', detail: 'Fog clears earlier, crowds thin, excellent light. Whale migration begins in late October. The most reliable clear nights for stargazing. The best balance of access and solitude.' },
  { name: 'Monarch Butterfly Migration', context: 'Oct – Feb', detail: 'Tens of thousands of monarchs overwinter in the Pacific Grove eucalyptus grove near Monterey. Late October through February. The trees draped in living orange.' },
  { name: 'Summer — Marine Layer Season', context: 'Jun – Aug', detail: 'Peak tourist season. Highway 1 can back up. Morning fog is thick and persistent — often doesn\'t burn off until early afternoon. Redwood canyon hikes are comfortable when the coast is socked in.' },
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
