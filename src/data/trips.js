// ═══════════════════════════════════════════════════════════════════════════════
// DATA: Trips — shared trip data for group/threshold trip cards
// ═══════════════════════════════════════════════════════════════════════════════
//
// Import: import { allTrips, getTripsByDestination } from '@data/trips';
//
// ═══════════════════════════════════════════════════════════════════════════════

import { C } from '@data/brand';

export const allTrips = [
  {
    slug: "zion-autumn-equinox",
    title: "Autumn Equinox",
    location: "Zion Canyon",
    region: "Utah",
    celestialAnchor: "Autumn Equinox",
    dates: "Sep 19 – 23, 2026",
    duration: "5 days",
    price: "$1,295",
    spots: "10 spots available",
    color: C.seaGlass,
    season: "Fall",
    tag: "In Dev",
    status: "in_dev",
    description: "Canyon hiking, riverside yoga, and night sky ceremonies as light and dark find balance.",
  },
  {
    slug: "joshua-tree-winter-solstice",
    title: "Winter Solstice",
    location: "Joshua Tree",
    region: "California",
    celestialAnchor: "Winter Solstice",
    dates: "Dec 18 – 22, 2026",
    duration: "5 days",
    price: "$1,195",
    spots: "10 spots available",
    color: C.goldenAmber,
    season: "Winter",
    tag: "In Dev",
    status: "in_dev",
    description: "Desert stillness, boulder scrambles, and sound baths under the darkest skies of the year.",
  },
  {
    slug: "big-sur-spring-equinox",
    title: "Spring Equinox",
    location: "Big Sur",
    region: "California",
    celestialAnchor: "Spring Equinox",
    dates: "Mar 18 – 22, 2027",
    duration: "5 days",
    price: "$1,495",
    spots: "10 spots available",
    color: C.sunSalmon,
    season: "Spring",
    tag: "In Dev",
    status: "in_dev",
    description: "Coastal cliffs, redwood forests, and hot springs as the world reawakens into equal light.",
  },
  {
    slug: "kauai-new-moon",
    title: "New Moon Retreat",
    location: "Kauaʻi",
    region: "Hawaii",
    celestialAnchor: "New Moon",
    dates: "Apr 9 – 14, 2027",
    duration: "6 days",
    price: "$1,895",
    spots: "10 spots available",
    color: C.goldenAmber,
    season: "Spring",
    tag: "In Dev",
    status: "in_dev",
    description: "Nā Pali coast, volcanic ridgelines, and ocean breathwork under the darkest Pacific skies.",
  },
  {
    slug: "vancouver-island-summer-solstice",
    title: "Summer Solstice",
    location: "Vancouver Island",
    region: "British Columbia",
    celestialAnchor: "Summer Solstice",
    dates: "Jun 19 – 23, 2027",
    duration: "5 days",
    price: "$1,350",
    spots: "10 spots available",
    color: C.skyBlue,
    season: "Early Summer",
    tag: "In Dev",
    status: "in_dev",
    description: "Old-growth forests, wild coastline, and kayaking on the longest day of the year.",
  },
  {
    slug: "olympic-harvest-moon",
    title: "Harvest Moon",
    location: "Olympic Peninsula",
    region: "Washington",
    celestialAnchor: "Full Moon (Harvest)",
    dates: "Sep 5 – 9, 2027",
    duration: "5 days",
    price: "$1,395",
    spots: "10 spots available",
    color: C.seaGlass,
    season: "Late Summer",
    tag: "In Dev",
    status: "in_dev",
    description: "Rainforest trails, tide pools, and glacier-fed rivers bathed in the glow of the harvest moon.",
  },
];

// Helper: filter trips by destination name
export function getTripsByDestination(locationName) {
  return allTrips.filter(t =>
    t.location.toLowerCase().includes(locationName.toLowerCase())
  );
}

// Helper: get the next upcoming trip (first in array, since they're sorted by date)
export function getNextTrip() {
  return allTrips[0];
}
