import { C } from '@data/brand';

// ─── Parks Data ─────────────────────────────────────────────────────────────

export const PARKS = [
  {
    id: "napali", name: "Na Pali Coast State Wilderness Park", designation: "state-wilderness", established: 1983,
    acreage: "6,175 ac", elevation: null, attribute: "Kalalau Trail",
    soul: "Eleven miles of fluted sea cliffs rising 4,000 feet from the Pacific — accessible only by trail, boat, or helicopter. The Kalalau Trail traverses all of it, ending at a beach that feels like the edge of the world.",
    facts: [
      "Kalalau Trail: 11 miles one-way, permit required for overnight",
      "Sea cliffs reach 4,000 ft — among the tallest in the world",
      "Accessible only by trail, boat, or helicopter — no road access",
    ],
    infoUrl: "https://dlnr.hawaii.gov/dsp/parks/kauai/napali-coast-state-wilderness-park/",
    url: "https://dlnr.hawaii.gov/dsp/parks/kauai/napali-coast-state-wilderness-park/",
    driveFrom: null, accent: C.oceanTeal, isAnchor: false,
  },
  {
    id: "waimea", name: "Waimea Canyon State Park", designation: "state-park", established: 1952,
    acreage: "1,866 ac", elevation: null, attribute: "3,600 ft deep",
    soul: "The Grand Canyon of the Pacific — 14 miles long, a mile wide, and 3,600 feet deep. Red rock, green forest, silver river. Mark Twain's name for it understates nothing.",
    facts: [
      "14 miles long, 1 mile wide, 3,600 feet deep",
      "Formed by the collapse of the island's volcanic caldera and millions of years of erosion",
      "Waimea means 'reddish water' — the river runs red with iron-rich soil",
    ],
    infoUrl: "https://dlnr.hawaii.gov/dsp/parks/kauai/waimea-canyon-state-park/",
    url: "https://dlnr.hawaii.gov/dsp/parks/kauai/waimea-canyon-state-park/",
    driveFrom: "~40 min from Poipu", accent: C.sunSalmon, isAnchor: false,
  },
  {
    id: "kokee", name: "Koke'e State Park", designation: "state-park", established: 1952,
    acreage: "4,345 ac", elevation: null, attribute: "Kalalau Lookout access",
    soul: "The high-altitude counterpart to the coast — 4,000 feet above sea level, cool and forested, with the Kalalau Lookout offering the most accessible view of the Na Pali Coast. Where the island reveals its interior.",
    facts: [
      "Kalalau Lookout: the most photographed view on Kauai",
      "45 miles of hiking trails through native forest",
      "Home to rare native birds including the 'apapane and 'amakihi",
    ],
    infoUrl: "https://dlnr.hawaii.gov/dsp/parks/kauai/kokee-state-park/",
    url: "https://dlnr.hawaii.gov/dsp/parks/kauai/kokee-state-park/",
    driveFrom: "~50 min from Poipu", accent: C.seaGlass, isAnchor: false,
  },
];

// ─── Towns ──────────────────────────────────────────────────────────────────

export const TOWNS = [
  {
    name: "Lihue",
    context: "Airport & Services",
    description: "The population center and airport town. The coastal path from Kapaʻa north is the island's best bike ride. Lihue has the best poke and plate lunch options. Practical but not without charm.",
    url: "https://www.gohawaii.com/islands/kauai/regions/lihue",
    accent: C.seaGlass,
  },
  {
    name: "Poipu",
    context: "Sun & Snorkeling",
    description: "The dry side of the island. Poipu Beach is consistently rated among Hawaii's best. Spouting Horn blowhole, the McBryde and Allerton botanical gardens, and the best snorkeling conditions on Kauai.",
    url: "https://www.poipubeach.org/",
    accent: C.sunSalmon,
  },
  {
    name: "Hanalei",
    context: "North Shore Gateway",
    description: "Hanalei Bay is the postcard. But the North Shore is also the gateway to the Na Pali Coast — the Kalalau trailhead starts at Ke'e Beach. Princeville sits above it all on a bluff with views that never get old.",
    url: "https://www.gohawaii.com/islands/kauai/regions/north-shore",
    accent: C.oceanTeal,
  },
  {
    name: "Kapaa",
    context: "East Side Community",
    description: "A walkable strip of local restaurants, shops, and the island's best coastal bike path. The population center that feels most like a real town — less resort, more community.",
    url: "https://www.gohawaii.com/islands/kauai/regions/east-side",
    accent: C.goldenAmber,
  },
  {
    name: "Princeville",
    context: "Bluff-Top Resort Community",
    description: "Perched on a bluff overlooking Hanalei Bay and the Na Pali Coast. Golf, luxury rentals, and some of the best sunset views on the island. Quieter and more manicured than Hanalei below.",
    url: "https://www.princeville.com/",
    accent: C.skyBlue,
  },
];

// ─── Timing Windows ─────────────────────────────────────────────────────────

export const TIMING_WINDOWS = [
  { name: 'Humpback Whale Season', context: 'Dec \u2013 Apr', detail: 'Humpbacks arrive in December and peak January through March. Best viewed from the cliffs above Poipu or Kilauea Lighthouse headland. Whale spouts visible by moonlight from the south shore overlooks.' },
  { name: 'Kalalau Trail in Spring', context: 'Apr \u2013 May', detail: 'Optimal conditions before summer crowds and heat. Na Pali sea conditions improving for boat tours. Waimea Canyon wildflowers.' },
  { name: 'Summer \u2014 North Shore Calm', context: 'Jun \u2013 Sep', detail: 'Hanalei Bay calms down for swimming, kayaking, and SUP. The bay is one of the finest flat-water environments in the Pacific. Milky Way visible from dark beaches.' },
  { name: 'Makahiki Season', context: 'Nov \u2013 Jan', detail: 'The traditional Hawaiian winter \u2014 a time of rest, ceremony, and renewal in the Hawaiian calendar. A meaningful cultural context for a visit.' },
  { name: 'Fall Shoulder Season', context: 'Oct \u2013 Nov', detail: 'Least crowded season. Weather unpredictable but some of the best trade wind conditions. Prices lower.' },
];

// ─── Wildlife ───────────────────────────────────────────────────────────────

export const WILDLIFE = [
  { name: 'Hawaiian Monk Seal', detail: 'One of the most endangered marine mammals on earth. Regularly hauls out on Kauai beaches to rest. If you see one, stay 50 feet back and do not disturb. Report sightings to NOAA.' },
  { name: 'Nene (Hawaiian Goose)', detail: 'The state bird and the world\u2019s rarest goose. Found in Kilauea National Wildlife Refuge and at higher elevations. Evolved from Canada Geese that landed on the islands 500,000 years ago.' },
  { name: 'Green Sea Turtle (Honu)', detail: 'Common at Poipu Beach and Tunnels Beach. Protected by federal law \u2014 maintain at least 10 feet of distance. They\u2019ve been navigating these waters for 150 million years.' },
];

// ─── Island Areas (editorial) ───────────────────────────────────────────────

export const ISLAND_AREAS = [
  { name: "North Shore (Hanalei)", context: "Beaches & Mountains", description: "Hanalei Bay is the postcard. But the North Shore is also the gateway to the Na Pali Coast \u2014 the Kalalau trailhead starts at Ke\u2019e Beach. Princeville sits above it all on a bluff with views that never get old." },
  { name: "South Shore (Poipu)", context: "Sun & Snorkeling", description: "The dry side of the island. Poipu Beach is consistently rated among Hawaii\u2019s best. Spouting Horn blowhole, the McBryde and Allerton botanical gardens, and the best snorkeling conditions on Kauai." },
  { name: "West Side (Waimea)", context: "Canyon Country", description: "The gateway to Waimea Canyon and Koke\u2019e State Park. The town of Waimea is where Captain Cook first landed in Hawaii in 1778. Quieter, drier, and closer to the island\u2019s geological drama." },
  { name: "East Side (Kapaa / Lihue)", context: "Services & Culture", description: "The population center and airport town. The coastal path from Kapaa north is the island\u2019s best bike ride. Lihue has the best poke and plate lunch options. Practical but not without charm." },
];

// ─── Places That Stop You ───────────────────────────────────────────────────

export const HIGHLIGHTS = [
  { name: "Na Pali Coast", category: "Coastline \u00b7 Cliffs", blurb: "Eleven miles of fluted sea cliffs rising 4,000 feet from the ocean. No road reaches them. Boat, helicopter, or the Kalalau Trail \u2014 there is no casual way to see this coast." },
  { name: "Kalalau Trail", category: "Trail \u00b7 Permit", blurb: "Eleven miles one-way along the Na Pali Coast to Kalalau Beach. Permit required for anything past Hanakapiai. One of the most dramatic coastal treks in the world." },
  { name: "Waimea Canyon Lookout", category: "Viewpoint \u00b7 Canyon", blurb: "The Grand Canyon of the Pacific from the rim. Fourteen miles long, a mile wide, 3,600 feet deep. The colors shift all day \u2014 red at noon, purple at dusk." },
  { name: "Kalalau Lookout", category: "Viewpoint \u00b7 Na Pali", blurb: "The most photographed view on Kauai \u2014 the Kalalau Valley from 4,000 feet above. Get there before 10 AM or the clouds roll in and you see nothing." },
  { name: "Tunnels Beach (Makua)", category: "Beach \u00b7 Reef", blurb: "A crescent of sand backed by mountains with the best reef snorkeling on the North Shore. Sea turtles are common. Named for the lava tube tunnels in the reef." },
  { name: "Wailua Falls", category: "Waterfall \u00b7 Easy Access", blurb: "A twin 173-foot waterfall visible from a roadside overlook. No hike required. The opening shot of Fantasy Island, if that means anything to you." },
];

// ─── Move / Breathe Tier Styles ─────────────────────────────────────────────

export const MOVE_TIERS = {
  hike:  { color: '#8a8078', label: 'Hike',  bg: '#8a807815' },
  water: { color: '#7BB8D4', label: 'Water', bg: '#7BB8D415' },
  ride:  { color: '#D4A853', label: 'Ride',  bg: '#D4A85315' },
  climb: { color: '#E8A090', label: 'Climb', bg: '#E8A09015' },
};

export const MOVE_TIER_META = {
  hike:  { label: 'Hike',  desc: 'On foot',          color: '#8a8078' },
  water: { label: 'Water', desc: 'Surf & paddle',    color: '#7BB8D4' },
  ride:  { label: 'Ride',  desc: 'Cycle & roll',     color: '#D4A853' },
  climb: { label: 'Climb', desc: 'Vertical terrain',  color: '#E8A090' },
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
