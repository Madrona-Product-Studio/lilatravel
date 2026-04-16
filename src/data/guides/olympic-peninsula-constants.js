import { C } from '@data/brand';

// ─── Corridor Parks & Wildlife Data ──────────────────────────────────────────

export const PARKS = [
  {
    id: "olympic-np", name: "Olympic National Park", designation: "us-national-park", established: 1938,
    acreage: "922,650 ac", elevation: "sea level–7,980 ft", attribute: "Three ecosystems",
    soul: "Three parks in one — glacier-draped mountains, the wettest rainforests in the contiguous US, and 73 miles of wilderness coastline. No single road connects them. You choose your immersion.",
    facts: [
      "UNESCO World Heritage Site and International Biosphere Reserve",
      "The Hoh Rainforest receives 140–170 inches of rain annually",
      "Home to the largest unmanaged herd of Roosevelt elk in the Pacific Northwest",
    ],
    infoUrl: "https://www.nps.gov/olym/",
    driveFrom: null, accent: C.skyBlue, isAnchor: true,
  },
  {
    id: "olympic-nf", name: "Olympic National Forest", designation: "national-forest",
    acreage: "628,000 ac", elevation: null, attribute: "Dispersed camping",
    soul: "The buffer zone surrounding the national park — 628,000 acres of working forest, wild rivers, and dispersed campsites. Where the park draws boundaries, the forest offers freedom.",
    facts: [
      "Surrounds Olympic National Park on three sides",
      "Five designated wilderness areas within the forest",
      "Dispersed camping permitted throughout — no reservation needed",
    ],
    infoUrl: "https://www.fs.usda.gov/olympic",
    driveFrom: null, accent: "#6B8F71", isAnchor: false,
  },
];

export const TOWNS = [
  {
    name: "Port Angeles",
    context: "Park Headquarters",
    description: "The main gateway to Olympic. Hurricane Ridge is a 45-minute drive from downtown. Solid food scene for a town this size — Kokopelli Grill and Next Door Gastropub are reliable.",
    url: "https://www.portangeles.org/",
    accent: C.skyBlue,
  },
  {
    name: "Sequim",
    context: "Rain Shadow Town",
    description: "In the rain shadow of the Olympics — gets 16 inches of rain while the Hoh gets 170. Lavender farms, the Olympic Discovery Trail, and the driest skies on the peninsula.",
    url: "https://www.visitsunnysequim.com/",
    accent: C.goldenAmber,
  },
  {
    name: "Forks",
    context: "Rainforest Gateway",
    description: "Timber town turned trailhead. The closest services to the Hoh Rainforest and Rialto Beach. Small, practical, and surrounded by some of the most productive temperate rainforest on Earth.",
    url: "https://forkswa.com/",
    accent: C.seaGlass,
  },
  {
    name: "Port Townsend",
    context: "Victorian Seaport",
    description: "A 19th-century seaport town with more Victorian buildings per capita than anywhere in the US. Fort Worden, the marine science center, and a strong arts community. The civilized end of the peninsula.",
    url: "https://www.enjoypt.com/",
    accent: C.oceanTeal,
  },
];

export const TIMING_WINDOWS = [
  { name: 'Summer — Alpine Access', context: 'Jul–Aug', detail: 'Peak window for Hurricane Ridge. High trails are snow-free. Busiest crowds. Rainforest trails accessible year-round; the coast is foggier. July and August are the driest months on the peninsula.' },
  { name: 'Fall — Elk Rut & Golden Light', context: 'Sep–Oct', detail: 'Best overall. Crowds thin, light is extraordinary, elk rut in the Hoh Valley, weather still cooperative in the mountains. September and October offer the finest balance of access and solitude.' },
  { name: 'Winter — Storm Season', context: 'Dec–Feb', detail: 'Rainforest at its most atmospheric — mosses saturated, rivers running high. Coast is dramatic in storm season. Hurricane Ridge becomes a snowshoe destination. Alpine trails buried.' },
  { name: 'Spring — Whales & Wildflowers', context: 'Mar–May', detail: 'Wildflowers on the ridge, migrating gray whales offshore, rivers running fast. Hurricane Ridge Road often closed until late spring — check ahead.' },
];

export const WILDLIFE = [
  { name: 'Roosevelt Elk', detail: 'The largest unmanaged herd in the Pacific Northwest roams the Hoh and Quinault valleys. Best seen at dawn and dusk during fall rut — their bugling echoes through the rainforest.' },
  { name: 'Gray Whale', detail: 'Gray whales migrate offshore March through May, visible from coastal bluffs at La Push and Kalaloch. One of the most reliable cetacean viewing windows on the Pacific coast.' },
  { name: 'Olympic Marmot', detail: 'Endemic to the Olympic Peninsula — found nowhere else on earth. Lives in subalpine meadows around Hurricane Ridge. Whistles to alert colony members of approaching hikers.' },
];

export const HIGHLIGHTS = [
  { name: "Hoh Rain Forest", category: "Rainforest · Silence", blurb: "The quietest place in the contiguous US — measured. Bigleaf maples draped in moss, nurse logs sprouting new trees. The Hall of Mosses trail is less than a mile and changes your sense of time." },
  { name: "Hurricane Ridge", category: "Alpine · Panorama", blurb: "A 45-minute drive from sea level to 5,200 feet. The Olympic Mountains spread in every direction, glaciers visible on clear days. Wildflower meadows in July and August." },
  { name: "Rialto Beach", category: "Coast · Sea Stacks", blurb: "Walk north past the Hole-in-the-Wall arch at low tide. Sea stacks, tide pools, and driftwood the size of telephone poles. The Pacific at its most dramatic." },
  { name: "Sol Duc Falls", category: "Waterfall · Forest", blurb: "A short hike through old-growth forest to a three-pronged waterfall dropping into a narrow gorge. The hot springs resort nearby makes for a complete loop." },
  { name: "Lake Crescent", category: "Lake · Glacial", blurb: "A glacier-carved lake so clear the bottom is visible at 60 feet. Marymere Falls is a one-mile walk from the lodge. The drive along the south shore is one of the peninsula's best." },
  { name: "Shi Shi Beach", category: "Coast · Remote", blurb: "A 2-mile trail through forest opens onto a beach with the largest collection of sea stacks on the Olympic coast. Permit required. Point of the Arches at sunset is worth the hike alone." },
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
