// ═══════════════════════════════════════════════════════════════════════════════
// CELESTIAL CONFIG — destination-specific data for the Celestial Snapshot
// ═══════════════════════════════════════════════════════════════════════════════

export const CELESTIAL_CONFIG = {
  zion: {
    name: "Zion Canyon",
    lat: 37.2982,
    lon: -113.0263,
    timezone: "America/Denver",
    parkCode: "zion",
    bortleClass: 2,
    usgsSiteId: "09405500", // Virgin River near Virgin, UT
  },
  joshuaTree: {
    name: "Joshua Tree",
    lat: 33.8734,
    lon: -115.9010,
    timezone: "America/Los_Angeles",
    parkCode: "jotr",
    bortleClass: 2,
  },
  'olympic-peninsula': {
    name: "Olympic Peninsula",
    lat: 47.8021,
    lon: -123.6044,
    timezone: "America/Los_Angeles",
    parkCode: "olym",
    bortleClass: 3,
  },
  'big-sur': {
    name: "Big Sur",
    lat: 36.2704,
    lon: -121.8081,
    timezone: "America/Los_Angeles",
    bortleClass: 3,
  },
  vancouver: {
    name: "Vancouver Island",
    lat: 49.6538,
    lon: -125.4494,
    timezone: "America/Vancouver",
    bortleClass: 3,
  },
  kauai: {
    name: "Kauai",
    lat: 22.0964,
    lon: -159.5261,
    timezone: "Pacific/Honolulu",
    bortleClass: 2,
  },
};
