import { C } from '@data/brand';

// ─── Corridor Parks & Wildlife Data ──────────────────────────────────────────

export const PARKS = [
  {
    id: "joshua-tree", name: "Joshua Tree", designation: "us-national-park", established: 1994,
    acreage: "795,156 ac", elevation: "536–5,814 ft", attribute: "IDA Dark Sky Certified",
    soul: "One of the last truly dark skies in Southern California — IDA certified, Bortle 3–4. The park straddles two deserts: Mojave (high, cooler, Joshua trees) and Colorado (low, hotter, cholla and ocotillo).",
    facts: [
      "Sits at the convergence of the Mojave and Colorado Deserts",
      "Certified International Dark Sky Park — Bortle Class 2–3",
      "Over 8,000 climbing routes on 400+ formations",
      "Home to the Serrano and Cahuilla peoples for thousands of years",
    ],
    infoUrl: "https://www.nps.gov/jotr/",
    driveFrom: null, accent: C.goldenAmber, isAnchor: true,
  },
];

export const TOWNS = [
  {
    name: "Joshua Tree",
    context: "Park's North Entrance",
    description: "A small desert town with a disproportionate creative scene. Art galleries, natural food co-ops, and a Saturday farmers market. The north entrance to the park is a five-minute drive.",
    url: "https://www.joshuatree.org/",
    accent: C.goldenAmber,
  },
  {
    name: "Twentynine Palms",
    context: "Park Headquarters",
    description: "The park's main visitor center and administrative hub. Quieter than Joshua Tree town, with easy access to the Oasis of Mara and the park's less-visited eastern half.",
    url: "https://visit29.org/",
    accent: C.sunSalmon,
  },
  {
    name: "Pioneertown",
    context: "1940s Film Set, Still Standing",
    description: "Built in 1946 as a living Old West movie set. Pappy & Harriet's is the reason most people come — live music in a desert honky-tonk. The Mane Street walk is worth the detour.",
    accent: C.oceanTeal,
  },
  {
    name: "Palm Springs",
    context: "Desert Modernism, 45 Min South",
    description: "Mid-century architecture, hot springs, and the aerial tramway to the top of San Jacinto. A different kind of desert experience — polished where Joshua Tree is raw.",
    url: "https://visitpalmsprings.com/",
    accent: C.seaGlass,
  },
];

export const HIGHLIGHTS = [
  {
    name: "Keys View",
    category: "Viewpoint · Sunset",
    blurb: "The Coachella Valley, San Andreas Fault, and the Salton Sea spread below. On clear days, Signal Mountain in Mexico. The single best sunset in the park.",
  },
  {
    name: "Skull Rock Loop",
    category: "Trail · Easy",
    blurb: "A 1.7-mile loop through a boulder garden with the park's most photographed formation. Easy, flat, and surprisingly uncrowded at dawn.",
  },
  {
    name: "Cholla Cactus Garden",
    category: "Walk · Colorado Desert",
    blurb: "A quarter-mile boardwalk through a dense field of teddy bear cholla. Backlit at sunset, the spines glow like fiber optics. Stay on the path — they jump.",
  },
  {
    name: "Ryan Mountain",
    category: "Summit · 360° Views",
    blurb: "Three miles round trip, 1,000 ft of gain. The summit panorama covers both deserts and the entire western park. Best done at sunrise before the heat.",
  },
  {
    name: "Arch Rock Trail",
    category: "Trail · Geology",
    blurb: "A short scramble to one of the park's signature natural arches. The surrounding boulder formations are the real draw — a playground of monzogranite.",
  },
  {
    name: "Milky Way from Cap Rock",
    category: "Dark Sky · Night",
    blurb: "Bortle 2 skies on a moonless night. The Milky Way arcs overhead in a way that most Americans have never seen. Bring a red headlamp and patience.",
  },
];

export const WILDLIFE = [
  { name: "Desert Bighorn Sheep", season: "Year-round", detail: "Most visible at dawn and dusk near water sources. Barker Dam and Lost Palms Oasis are reliable sighting zones." },
  { name: "Desert Tortoise", season: "Spring – Fall", detail: "Threatened species — do not approach or handle. Most active in spring after rain. Found in the Colorado Desert section." },
  { name: "Coyote", season: "Year-round", detail: "Listen for them at dusk. Their calls across the open desert are part of the sound of this place." },
  { name: "Roadrunner", season: "Year-round", detail: "Fast, curious, and frequently spotted along park roads and at campground edges." },
  { name: "Sidewinder Rattlesnake", season: "Warm months", detail: "Watch where you step and reach, especially in rocky areas. They're shy but present." },
  { name: "Joshua Tree", season: "Year-round", detail: "The park's namesake. Not actually a tree — a member of the agave family. Thrives only in the Mojave section above 3,000 ft." },
];

export const TIMING_WINDOWS = [
  { name: 'Spring Wildflower Bloom', context: 'Late Feb – Apr', detail: 'After wet winters, the desert erupts in color — poppies, lupine, desert lilies. Intensity varies year to year. When it happens, it\'s unforgettable.' },
  { name: 'Autumn Light', context: 'Oct – Nov', detail: 'Second-best window. Crowds thinner than spring. The color is subtle but the light is extraordinary — amber and pink at golden hour.' },
  { name: 'Dark Sky Season', context: 'Nov – Feb', detail: 'Winter\'s long nights and dry, stable air create the park\'s best stargazing conditions. The winter solstice provides the longest dark window of the year.' },
  { name: 'Perseid Meteor Shower', context: 'Aug 12–13 peak', detail: 'Mid-August. Up to 100 meteors per hour at peak. Best viewed from the backcountry or Pinto Basin Road pullouts after midnight.' },
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
