// ═══════════════════════════════════════════════════════════════════════════════
// ZION URL REGISTRY — Maps place names to external URLs
// ═══════════════════════════════════════════════════════════════════════════════
//
// Used by:
//   1. The AI prompt (injected into the guide so Claude can include URLs)
//   2. The ItineraryResults renderer (client-side fallback matching)
//
// Keep this in sync with ZionGuide.jsx — it's the canonical URL source.
//

export const ZION_URLS = {
  // ── Accommodation ──────────────────────────────────────────────────────────
  "Under Canvas Zion":        "https://www.undercanvas.com/camps/zion/",
  "AutoCamp Zion":            "https://autocamp.com/zion/",
  "Cliffrose Lodge":          "https://www.cliffroselodge.com/",
  "Amangiri":                 "https://www.aman.com/hotels/amangiri",
  "Open Sky Zion":            "https://www.openskyzion.com/",
  "Desert Pearl Inn":         "https://www.desertpearl.com/",
  "Flanigan's Inn":           "https://flanigans.com/",
  "Skyview Hotel":            "https://skyviewhotel.com/",
  "Inn at Entrada":           "https://www.innatentrada.com/",
  "Cable Mountain Lodge":     "https://www.cablemountainlodge.com/",
  "Driftwood Lodge":          "https://www.driftwoodlodge.net/",

  // ── Dining ─────────────────────────────────────────────────────────────────
  "Zion Canyon Brew Pub":     "https://zionbrewery.com/",
  "King's Landing Bistro":    "https://www.kingslanding-zion.com/",
  "Spotted Dog Café":         "https://flanigans.com/",
  "Oscar's Café":             "https://www.oscarscafe.com/",
  "Whiptail Grill":           "https://www.whiptailgrillzion.com/",
  "Bit & Spur":               "https://bitandspur.com/",

  // ── Trails & Hikes ────────────────────────────────────────────────────────
  "Angels Landing":           "https://www.nps.gov/zion/planyourvisit/angels-landing-permit.htm",
  "The Narrows":              "https://www.nps.gov/zion/planyourvisit/thenarrows.htm",
  "The Subway":               "https://www.nps.gov/zion/planyourvisit/thesubway.htm",
  "Observation Point":        "https://www.nps.gov/zion/planyourvisit/zion-canyon-trail-descriptions.htm",
  "Canyon Overlook":          "https://www.nps.gov/zion/planyourvisit/zion-canyon-trail-descriptions.htm",
  "Emerald Pools":            "https://www.nps.gov/zion/planyourvisit/zion-canyon-trail-descriptions.htm",
  "Riverside Walk":           "https://www.nps.gov/zion/planyourvisit/zion-canyon-trail-descriptions.htm",
  "Watchman Trail":           "https://www.nps.gov/zion/planyourvisit/zion-canyon-trail-descriptions.htm",
  "Pa'rus Trail":             "https://www.nps.gov/zion/planyourvisit/zion-canyon-trail-descriptions.htm",
  "Kolob Arch":               "https://www.nps.gov/zion/planyourvisit/kolob-canyons-wilderness-hiking-trails.htm",
  "Snow Canyon":              "https://stateparks.utah.gov/parks/snow-canyon/",

  // ── Move (Rides, Canyoneering) ─────────────────────────────────────────────
  "Zion Canyon E-Bike":       "https://www.zionguru.com/rentals/electric-bikes",
  "Zion Guru E-Bike":         "https://www.zionguru.com/rentals/electric-bikes",
  "Gooseberry Mesa":          "https://www.blm.gov/visit/gooseberry-mesa",
  "Keyhole Canyon":           "https://www.nps.gov/zion/planyourvisit/canyoneering.htm",

  // ── Wellness ───────────────────────────────────────────────────────────────
  "Zion Guru Skydeck Yoga":   "https://www.zionguru.com/classes/yoga",
  "Zion Guru Yoga":           "https://www.zionguru.com/classes/yoga",
  "Hillside Yoga at Flanigan's": "https://flanigans.com/spa/mind-body-spirit/",
  "Open Sky Wellness":        "https://openskyhotels.com/zion/wellness/",
  "Deep Canyon Spa":          "https://flanigans.com/spa/",
  "Zion Guru":                "https://www.zionguru.com/",
  "Zion Canyon Hot Springs":  "https://www.zioncanyonhotsprings.com/",
  "True North Float":         "https://www.truenorthfloat.com/",
  "Cable Mountain Spa":       "https://cablemountainspa.com/",
  "Homebody Healing":         "https://www.homebodyhealing.love/",
  "Cosmic Flow Yoga":         "https://www.yogainzion.com/",
  "Zion Yogis":               "https://www.zionyogis.com/",
  "Amangiri Spa":             "https://www.aman.com/resorts/amangiri/amangiri-spa",
  "Elite Float Spa":          "",

  // ── Parks & Resources ──────────────────────────────────────────────────────
  "Zion National Park":       "https://www.nps.gov/zion/",
  "Bryce Canyon":             "https://www.nps.gov/brca/",
  "Capitol Reef":             "https://www.nps.gov/care/",
  "Zion Shuttle":             "https://www.nps.gov/zion/planyourvisit/zion-canyon-shuttle-system.htm",

  // ── Stargazing ─────────────────────────────────────────────────────────────
  "Stargazing in Zion":       "https://www.nps.gov/thingstodo/stargazing-in-zion.htm",
  "Stargazing at Bryce":      "https://www.nps.gov/thingstodo/stargazing-at-bryce-canyon.htm",

  // ── Experience / Cultural ─────────────────────────────────────────────────
  "Paiute Cultural Heritage":       "https://www.utahpaiutes.org/",
  "Pipe Spring National Monument":  "https://www.nps.gov/pisp/index.htm",
  "Fruita Orchards at Capitol Reef": "https://www.nps.gov/care/planyourvisit/fruita.htm",
  "Parowan Gap Petroglyphs":        "https://www.blm.gov/visit/parowan-gap",
  "Conserve Southwest Utah":        "https://www.conservesouthwestutah.org/",
};

// Alias map for fuzzy matching — handles common AI variations
export const ZION_ALIASES = {
  "Cliffrose":                "Cliffrose Lodge",
  "Cliffrose Springdale":     "Cliffrose Lodge",
  "Oscar's":                  "Oscar's Café",
  "Oscar's Cafe":             "Oscar's Café",
  "Oscars Cafe":              "Oscar's Café",
  "Spotted Dog":              "Spotted Dog Café",
  "Spotted Dog Cafe":         "Spotted Dog Café",
  "King's Landing":           "King's Landing Bistro",
  "Kings Landing":            "King's Landing Bistro",
  "Kings Landing Bistro":     "King's Landing Bistro",
  "Brew Pub":                 "Zion Canyon Brew Pub",
  "Flanigan's":               "Flanigan's Inn",
  "Flanigans":                "Flanigan's Inn",
  "Desert Pearl":             "Desert Pearl Inn",
  "Cable Mountain":           "Cable Mountain Lodge",
  "Under Canvas":             "Under Canvas Zion",
  "Open Sky":                 "Open Sky Zion",
  "Zion Guru yoga":           "Zion Guru",
  "Deep Canyon":              "Deep Canyon Spa",
  "Narrows":                  "The Narrows",
  "Subway":                   "The Subway",
  "Snow Canyon State Park":   "Snow Canyon",
  "Bit and Spur":             "Bit & Spur",
  "Whiptail":                 "Whiptail Grill",
  "Inn at Entrada":           "Inn at Entrada",
  "Skyview":                  "Skyview Hotel",
  "Zion Hot Springs":         "Zion Canyon Hot Springs",
  "Hot Springs Zion":         "Zion Canyon Hot Springs",
  "True North":               "True North Float",
  "Homebody":                 "Homebody Healing",
  "Cosmic Flow":              "Cosmic Flow Yoga",
  "Yoga in Zion":             "Cosmic Flow Yoga",
  "Zion Yogis yoga":          "Zion Yogis",
  "Amangiri Spa":             "Amangiri Spa",
  "Elite Float":              "Elite Float Spa",
};

/**
 * Look up a URL by place name. Tries exact match first, then aliases.
 */
export function lookupUrl(name) {
  if (!name) return null;
  const trimmed = name.trim();
  // Exact match
  if (ZION_URLS[trimmed]) return ZION_URLS[trimmed];
  // Alias match
  const canonical = ZION_ALIASES[trimmed];
  if (canonical && ZION_URLS[canonical]) return ZION_URLS[canonical];
  // Partial match — check if name contains a known place
  for (const [key, url] of Object.entries(ZION_URLS)) {
    if (trimmed.toLowerCase().includes(key.toLowerCase()) || key.toLowerCase().includes(trimmed.toLowerCase())) {
      return url;
    }
  }
  return null;
}
