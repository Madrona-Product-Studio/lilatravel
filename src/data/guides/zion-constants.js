import { C } from '@data/brand';

// ─── Corridor Parks & Wildlife Data ──────────────────────────────────────────

export const PARKS = [
  {
    id: "zion", name: "Zion", designation: "us-national-park", established: 1919,
    acreage: "147,242 ac", elevation: "3,666–8,726 ft", attribute: "Virgin River narrows",
    soul: "The canyon that stops you mid-sentence. Carved by the Virgin River through 2,000 ft of Navajo sandstone — walls that glow copper at sunrise, amber at midday, impossible pink at dusk.",
    facts: [
      "Carved by the Virgin River over 250 million years",
      "Home to the slot canyon known as The Narrows",
      "Named Mukuntuweap by the Southern Paiute",
    ],
    infoUrl: "https://www.nps.gov/zion/",
    driveFrom: null, accent: C.sunSalmon, isAnchor: true,
  },
  {
    id: "bryce", name: "Bryce Canyon", designation: "us-national-park", established: 1928,
    acreage: "35,835 ac", elevation: "8,000–9,115 ft", attribute: "Darkest night skies",
    soul: "A forest of stone spires that blushed and never recovered. Not a canyon at all — a series of natural amphitheaters eroded into the Paunsaugunt Plateau.",
    facts: [
      "Not a canyon — a series of natural amphitheaters",
      "One of the darkest night skies in the continental US",
      "Named for settler Ebenezer Bryce, who called it 'a hell of a place to lose a cow'",
    ],
    infoUrl: "https://www.nps.gov/brca/",
    driveFrom: "~1.5 hrs from Zion", accent: C.goldenAmber, isAnchor: false,
  },
  {
    id: "capitol-reef", name: "Capitol Reef", designation: "us-national-park", established: 1971,
    acreage: "241,904 ac", elevation: "3,900–8,960 ft", attribute: "Waterpocket Fold",
    soul: "The hidden wrinkle in the earth that most people drive past. The Waterpocket Fold — a 100-mile warp in the crust — runs through orchards still harvested by visitors.",
    facts: [
      "The Waterpocket Fold — a 100-mile warp in the earth's crust",
      "Fruita Historic District: an orchard still harvested by visitors",
      "Far fewer crowds than Zion or Bryce despite comparable grandeur",
    ],
    infoUrl: "https://www.nps.gov/care/",
    driveFrom: "~3 hrs from Zion", accent: C.oceanTeal, isAnchor: false,
  },
];

export const TOWNS = [
  {
    name: "Springdale",
    context: "Zion's Front Door",
    description: "A single-street town pressed against the canyon mouth. Walk to the park entrance. Restaurants, gear shops, and galleries line the half-mile stretch — all of it sandstone red and cottonwood green.",
    url: "https://www.zionpark.com/",
    accent: C.sunSalmon,
  },
  {
    name: "Kanab",
    context: "Film-Set Desert Town",
    description: "An hour south of Zion on the Utah–Arizona line. Old Western film sets, a growing food scene, and the staging point for permits to The Wave, White Pocket, and Buckskin Gulch.",
    url: "https://visitsouthernutah.com/kanab/",
    accent: C.goldenAmber,
  },
  {
    name: "Escalante",
    context: "Trailhead Town",
    description: "A one-stoplight town on Scenic Byway 12 that punches above its weight. Slot canyons, petrified forests, and the kind of solitude that the main parks can't offer. Stock up here — services are sparse beyond.",
    url: "https://www.escalante.cc/",
    accent: C.oceanTeal,
  },
  {
    name: "Torrey",
    context: "Capitol Reef Gateway",
    description: "A handful of buildings at the edge of the Waterpocket Fold. The nearest services to Capitol Reef. Rim Rock Inn and the Torrey Schoolhouse serve as base camp for the park. The orchards start just down the road.",
    url: "https://www.capitolreefcountry.com/",
    accent: C.seaGlass,
  },
];

export const HIGHLIGHTS = [
  {
    name: "The Narrows",
    category: "Canyon · Water",
    blurb: "Wade the Virgin River through slot canyon walls 2,000 ft tall. Some sections are shoulder-width. The light is unlike anywhere else on earth.",
  },
  {
    name: "Angels Landing",
    category: "Summit · Exposure",
    blurb: "The final half-mile is chains bolted to rock with 1,000 ft of air on both sides. Permit required. Unforgettable in the way that changes your baseline.",
  },
  {
    name: "The Subway",
    category: "Slot Canyon · Permit",
    blurb: "Left Fork of North Creek forms a perfect cylindrical tunnel. Swimming holes, log jams, emerald pools. One of the park's true hidden chambers.",
  },
  {
    name: "Kolob Arch",
    category: "Backcountry · Arch",
    blurb: "One of the world's largest free-standing arches at 287 ft. Most visitors never see it. 14-mile round trip into Kolob Canyons — a completely different Zion.",
  },
  {
    name: "Canyon Overlook",
    category: "Viewpoint · Easy Access",
    blurb: "A one-mile round trip that delivers an outsized reward — Pine Creek Canyon spread below, the Great Arch to your left. Best at sunrise before the shuttle crowds arrive.",
  },
  {
    name: "Zion–Mt. Carmel Highway",
    category: "Drive · Checkerboard Mesa",
    blurb: "The switchbacks alone are worth it. The tunnel emerges onto slickrock benches of the Colorado Plateau — a completely different landscape. Easy to rush through. Don't.",
  },
];

export const WILDLIFE_GROUPS = [
  {
    label: "Mammals",
    accent: C.sunSalmon,
    entries: [
      { name: "Desert Bighorn Sheep", parks: ["Zion", "Capitol Reef"], season: "Year-round", detail: "Often spotted on sheer canyon walls where no foothold seems possible. They descend to water sources at dawn. In Zion, Angels Landing and the Kayenta Trail are reliable sighting zones." },
      { name: "Mule Deer", parks: ["Zion", "Bryce Canyon", "Capitol Reef"], season: "Year-round", detail: "The canyon's most visible mammal. They gather along river corridors at dusk, moving unhurried through cottonwood groves. Early morning light finds them best near Zion Lodge meadows." },
      { name: "Pronghorn", parks: ["Bryce Canyon", "Capitol Reef"], season: "Spring – Fall", detail: "The fastest land animal in the Western Hemisphere, capable of 55 mph. Spotted most often on open plateaus above Bryce and in Capitol Reef's Fruita Valley." },
    ],
  },
  {
    label: "Birds",
    accent: C.skyBlue,
    entries: [
      { name: "California Condor", parks: ["Zion"], season: "Year-round", detail: "One of the rarest birds on earth. With a wingspan over nine feet, condors ride thermal columns above the canyon walls — often spotted near Angels Landing. There are roughly 95 flying free in Arizona and Utah." },
      { name: "Peregrine Falcon", parks: ["Zion", "Capitol Reef"], season: "Mar – Sep", detail: "Nesting on sheer sandstone faces, they dive at speeds exceeding 240 mph. The canyon walls amplify their call — a sharp, insistent cry that bounces between the walls before you locate the source." },
      { name: "Steller's Jay", parks: ["Bryce Canyon"], season: "Year-round", detail: "Electric blue against the red hoodoos. Bryce's high-elevation ponderosa forest is prime territory. Bold and social — they'll find your lunch before you do." },
    ],
  },
  {
    label: "Plants",
    accent: C.seaGlass,
    entries: [
      { name: "Desert Wildflowers", parks: ["Zion", "Capitol Reef"], season: "Mar – Apr", detail: "After a wet winter, the canyon floor erupts — sacred datura, cliffrose, scarlet gilia, and prickly pear in bloom. Capitol Reef's orchards blossom simultaneously, for one of the most extraordinary weeks in Utah." },
      { name: "Fremont Cottonwood", parks: ["Zion", "Capitol Reef"], season: "Late Sep – Oct", detail: "The cottonwoods lining the Virgin River and Capitol Reef's Fremont River turn gold in late September. A transformation that lasts only a few weeks — the quiet crescendo most visitors don't know to look for." },
      { name: "Bristlecone Pine", parks: ["Bryce Canyon"], season: "Year-round", detail: "Among the oldest living organisms on Earth — some individuals exceed 1,600 years. Found at Bryce's highest elevations, twisted by wind, stripped to silver by weather. They look like they've seen everything. They have." },
    ],
  },
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
