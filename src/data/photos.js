// ═══════════════════════════════════════════════════════════════════════════════
// PHOTOS — centralized image references
// ═══════════════════════════════════════════════════════════════════════════════

export const P = {
  joshuaTree: "/images/joshuaTree.jpg",
  zion: "/images/zion.jpg",
  olympic: "/images/olympic.jpg",
  bigSur: "/images/bigSur.jpg",
  vancouver: "/images/vancouver.jpg",
  kauai: "/images/kauai.jpg",
  lilaPainting: "/images/lilaPainting.jpg",
  ancientCedar: "/images/ancientCedar.jpg",
  zionWatchman: "/images/zionWatchman.jpg",
  zionNarrows: "/images/zionNarrows.jpg",
  bryceCanyon: "/images/bryceCanyon.jpg",
  capitolReef: "/images/capitolReef.jpg",
  joshuaTreeCholla: "/images/joshuaTreeCholla.jpg",
  joshuaTreeNightSky: "/images/joshuaTreeNightSky.jpg",
  joshuaTreeBoulders: "/images/joshuaTreeBoulders.jpg",
  joshuaTreeDawn: "/images/joshuaTreeDawn.jpg",
  vancouverInlet: "/images/destinations/vancouver-island/vi-inlet-seal-cormorant.jpg",
  vancouverRainforest: "/images/destinations/vancouver-island/vi-rainforest-boardwalk.jpg",
  vancouverBeach: "/images/destinations/vancouver-island/vi-beach-lowtide-dusk.jpg",
  vancouverCedar: "/images/destinations/vancouver-island/vi-hanging-garden-cedar.jpg",
};

// ═══════════════════════════════════════════════════════════════════════════════
// DESTINATION PHOTOS — rich metadata for guide pages
// ═══════════════════════════════════════════════════════════════════════════════

export const destinationPhotos = {
  vancouverIsland: [
    {
      id: 'vi-inlet-seal-cormorant',
      src: '/images/destinations/vancouver-island/vi-inlet-seal-cormorant.jpg',
      alt: 'A seal surfaces near a mossy rock where a cormorant perches, with a dense evergreen coastline in the background',
      caption: 'Inlet wildlife near Tofino — seal and cormorant sharing a moment',
      location: 'Clayoquot Sound, Vancouver Island',
      braid: 'elemental-encounters',
      tags: ['wildlife', 'coastal', 'inlet', 'seal', 'cormorant', 'tofino'],
      hero: false,
      section: null,
    },
    {
      id: 'vi-rainforest-boardwalk',
      src: '/images/destinations/vancouver-island/vi-rainforest-boardwalk.jpg',
      alt: 'Hikers descend a wooden boardwalk staircase through ancient old-growth rainforest, towering moss-covered cedars on all sides',
      caption: 'Cathedral forest — old-growth cedars on the Rainforest Trail',
      location: 'Pacific Rim National Park Reserve, Vancouver Island',
      braid: 'sacred-terrain',
      tags: ['rainforest', 'old-growth', 'boardwalk', 'cedar', 'pacific-rim', 'hiking'],
      hero: true,
      section: 'rainforest',
    },
    {
      id: 'vi-beach-lowtide-dusk',
      src: '/images/destinations/vancouver-island/vi-beach-lowtide-dusk.jpg',
      alt: 'A vast low-tide beach at dusk, wet sand reflecting a moody sky, island silhouettes on the horizon',
      caption: 'Low tide at dusk — the world goes quiet on Long Beach',
      location: 'Long Beach, Pacific Rim National Park Reserve',
      braid: 'elemental-encounters',
      tags: ['beach', 'low-tide', 'dusk', 'coastal', 'long-beach', 'pacific-rim'],
      hero: true,
      section: 'coastal',
    },
    {
      id: 'vi-hanging-garden-cedar',
      src: '/images/destinations/vancouver-island/vi-hanging-garden-cedar.jpg',
      alt: 'An enormous ancient western red cedar with a hollow base and a "Hanging Garden" sign, ferns and plants growing from its trunk',
      caption: 'The Hanging Garden Tree — a thousand-year-old cedar that hosts its own ecosystem',
      location: 'Rainforest Trail, Pacific Rim National Park Reserve',
      braid: 'sacred-terrain',
      tags: ['cedar', 'ancient-tree', 'hanging-garden', 'rainforest', 'pacific-rim', 'old-growth'],
      hero: false,
      section: 'rainforest',
    },
  ],
};
