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
    dates: "Sep 19 – 23, 2026",
    duration: "5 days",
    price: "$1,295",
    spots: "10 spots available",
    color: C.seaGlass,
    season: "Fall",
    tag: "Coming Soon",
    description: "Canyon hiking, riverside yoga, and night sky ceremonies as light and dark find balance.",
  },
  {
    slug: "big-sur-winter-solstice",
    title: "Winter Solstice",
    location: "Big Sur",
    region: "California",
    dates: "Dec 18 – 22, 2026",
    duration: "5 days",
    price: "$1,495",
    spots: "10 spots available",
    color: C.goldenAmber,
    season: "Winter",
    tag: "Coming Soon",
    description: "Coastal cliffs, redwood forests, and hot springs as the longest night gives way to returning light.",
  },
  {
    slug: "joshua-tree-spring-equinox",
    title: "Spring Equinox",
    location: "Joshua Tree",
    region: "California",
    dates: "Mar 18 – 22, 2027",
    duration: "5 days",
    price: "$1,195",
    spots: "10 spots available",
    color: C.sunSalmon,
    season: "Spring",
    tag: "Coming Soon",
    description: "Desert wildflowers, boulder scrambles, and sound baths under a canopy of stars.",
  },
  {
    slug: "olympic-summer-solstice",
    title: "Summer Solstice",
    location: "Olympic Peninsula",
    region: "Washington",
    dates: "Jun 19 – 23, 2027",
    duration: "5 days",
    price: "$1,395",
    spots: "10 spots available",
    color: C.skyBlue,
    season: "Summer",
    tag: "Coming Soon",
    description: "Rainforest trails, tide pools, and glacier-fed rivers on the longest day of the year.",
  },
  {
    slug: "kauai-new-moon",
    title: "New Moon Retreat",
    location: "Kauai",
    region: "Hawaii",
    dates: "Oct 9 – 14, 2027",
    duration: "6 days",
    price: "$1,895",
    spots: "10 spots available",
    color: C.goldenAmber,
    season: "Fall",
    tag: "Coming Soon",
    description: "Nā Pali coast, volcanic ridgelines, and ocean breathwork under the darkest Pacific skies.",
  },
  {
    slug: "vancouver-island-supermoon",
    title: "Supermoon Journey",
    location: "Vancouver Island",
    region: "British Columbia",
    dates: "Aug 8 – 12, 2027",
    duration: "5 days",
    price: "$1,350",
    spots: "10 spots available",
    color: C.seaGlass,
    season: "Summer",
    tag: "Coming Soon",
    description: "Old-growth forests, wild coastline, and kayaking under the brightest full moon of the year.",
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
