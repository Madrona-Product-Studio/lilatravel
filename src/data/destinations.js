// ═══════════════════════════════════════════════════════════════════════════════
// DESTINATIONS DATA
// ═══════════════════════════════════════════════════════════════════════════════
//
// Add new destinations here. Each one automatically gets:
//   - A card on the homepage carousel
//   - A card on the /destinations landing page
//   - A route at /destinations/:slug
//
// Set guideAvailable: true when a full guide page exists for that destination.
//

import { C } from './brand';
import { P } from './photos';

export const destinations = [
  {
    slug: "zion-canyon",
    name: "Zion Canyon",
    location: "Utah",
    threshold: "Golden Windows",
    windows: [
      { season: "Spring", months: "Apr–May", note: "Wildflowers & waterfalls" },
      { season: "Fall", months: "Sep–Oct", note: "Cottonwoods & solitude" },
    ],
    description: "Cottonwoods catch fire against ancient sandstone. The crowds thin. The canyon breathes.",
    photo: P.zion,
    gradient: "linear-gradient(165deg, #a0522d, #6b3520, #c0714a)",
    accent: C.sunSalmon,
    guideAvailable: true,
  },
  {
    slug: "joshua-tree",
    name: "Joshua Tree",
    location: "California",
    threshold: "Golden Windows",
    windows: [
      { season: "Spring", months: "Mar–Apr", note: "Desert bloom & wildflowers" },
      { season: "Fall", months: "Oct–Nov", note: "Perfect temps & dark skies" },
    ],
    description: "After winter rains, the desert blooms. Ocotillo in scarlet. Clarity so sharp it rearranges something inside you.",
    photo: P.joshuaTree,
    gradient: "linear-gradient(165deg, #c17f43, #8b4513, #d4855a)",
    accent: C.goldenAmber,
    guideAvailable: true,
  },
  {
    slug: "olympic-peninsula",
    name: "Olympic Peninsula",
    location: "Washington",
    threshold: "Golden Windows",
    windows: [
      { season: "Summer", months: "Jul–Aug", note: "Dry trails & alpine meadows" },
      { season: "Fall", months: "Sep–Oct", note: "Salmon runs & golden light" },
    ],
    description: "Three ecosystems in one. Temperate rainforest dissolves into glacial peaks into wild Pacific coast.",
    photo: P.olympic,
    gradient: "linear-gradient(165deg, #2b5070, #3d7090, #1a3d55)",
    accent: C.skyBlue,
    guideAvailable: true,
  },
  {
    slug: "big-sur",
    name: "Big Sur",
    location: "California",
    threshold: "Golden Windows",
    windows: [
      { season: "Spring", months: "Mar–May", note: "Waterfalls & wildflowers" },
      { season: "Fall", months: "Oct–Nov", note: "Warm days & fewer crowds" },
    ],
    description: "Wildflowers cascade down cliffsides, waterfalls run full force, and the coast glows impossibly green. The most beautiful 26.2 miles on earth await.",
    photo: P.bigSur,
    gradient: "linear-gradient(165deg, #2a5f4f, #4a8a6f, #1c4a3a)",
    accent: C.seaGlass,
    guideAvailable: true,
  },
  {
    slug: "vancouver-island",
    name: "Vancouver Island",
    location: "British Columbia",
    threshold: "Golden Windows",
    windows: [
      { season: "Summer", months: "Jul–Aug", note: "Orca season & long days" },
      { season: "Fall", months: "Sep–Oct", note: "Salmon runs & hot springs" },
    ],
    description: "Old-growth forests. Orca waters. Hot springs deep in the wilderness. The edge of the known world.",
    photo: P.vancouver,
    gradient: "linear-gradient(165deg, #3d5a6b, #2a4a5a, #1a3040)",
    accent: C.oceanTeal,
    guideAvailable: false,
  },
  {
    slug: "kauai",
    name: "Kauai",
    location: "Hawaii",
    threshold: "Golden Windows",
    windows: [
      { season: "Winter", months: "Jan–Mar", note: "Whale season & lush green" },
      { season: "Spring", months: "Apr–May", note: "Dry trails & fewer crowds" },
    ],
    description: "Warm sweet air carries the scent of plumeria down the Nā Pali Coast. Emerald spires meet turquoise sea. Pure aloha — the kind you feel in your bones.",
    photo: P.kauai,
    gradient: "linear-gradient(165deg, #2a6b5a, #3d8a7a, #5ab8d0)",
    accent: C.oceanTeal,
    guideAvailable: false,
  },
];
