// ═══════════════════════════════════════════════════════════════════════════════
// JOSHUA TREE URL REGISTRY — Maps place names to external URLs
// ═══════════════════════════════════════════════════════════════════════════════
//
// Used by:
//   1. The AI prompt (injected into the guide so Claude can include URLs)
//   2. The ItineraryResults renderer (client-side fallback matching)
//
// Keep this in sync with JoshuaTreeGuide.jsx — it's the canonical URL source.
//

export const JOSHUA_TREE_URLS = {
  // ── Accommodation ──────────────────────────────────────────────────────────
  "RESET Hotel":               "https://www.stayreset.com/",
  "AutoCamp Joshua Tree":      "https://autocamp.com/location/joshua-tree/",
  "Skylight Joshua Tree":      "https://www.skylightjt.com/",
  "Hicksville Trailer Palace":  "https://www.hicksville.com/",
  "29 Palms Inn":              "https://29palmsinn.com/",
  "Sacred Sands":              "https://www.sacredsands.com/",
  "Pioneertown Motel":         "https://www.pioneertownmotel.com/",
  "Spin & Margie's Desert Hideaway": "https://www.spinandmargies.com/",
  "Two Bunch Palms":           "https://www.twobunchpalms.com/",
  "L'Horizon Resort":          "https://www.lhorizonpalmsprings.com/",
  "Parker Palm Springs":       "https://www.parkerpalmsprings.com/",
  "Arrive Palm Springs":       "https://www.arrivehotels.com/palm-springs",

  // ── Dining ─────────────────────────────────────────────────────────────────
  "La Copine":                 "https://www.lacopinekitchen.com/",
  "Pappy & Harriet's":         "https://www.pappyandharriets.com/",
  "29 Palms Inn Restaurant":   "https://29palmsinn.com/",
  "Workshop Kitchen + Bar":    "https://www.workshoppalmsprings.com/",
  "Pioneertown Motel Bar":     "https://www.pioneertownmotel.com/",
  "Crossroads Cafe":           "https://www.crossroadscafejt.com/",
  "Natural Sisters Cafe":      "https://www.naturalsisterscafe.com/",
  "Joshua Tree Coffee Company": "https://www.joshuatreecoffeecompany.com/",
  "Pie for the People":        "https://www.pieforthepeople.net/",
  "Cheeky's":                  "https://www.cheekysps.com/",
  "Koffi":                     "https://www.koffi.com/",

  // ── Trails & Hikes (NPS sourced) ──────────────────────────────────────────
  "Barker Dam":                "https://www.nps.gov/jotr/planyourvisit/barkerdam.htm",
  "Hidden Valley Trail":       "https://www.nps.gov/jotr/planyourvisit/hiddenvalley.htm",
  "Ryan Mountain":             "https://www.nps.gov/jotr/planyourvisit/ryanmountain.htm",
  "Skull Rock":                "https://www.nps.gov/jotr/planyourvisit/skull-rock.htm",
  "Cholla Cactus Garden":      "https://www.nps.gov/jotr/planyourvisit/chollacactusgarden.htm",
  "Lost Palms Oasis":          "https://www.nps.gov/jotr/planyourvisit/lostpalms.htm",
  "Keys View":                 "https://www.nps.gov/jotr/planyourvisit/keys-view.htm",
  "Fortynine Palms Oasis":     "https://www.nps.gov/jotr/planyourvisit/fortyninepalms.htm",
  "Mastodon Peak":             "https://www.nps.gov/jotr/planyourvisit/mastodonpeak.htm",
  "Cap Rock Nature Trail":     "https://www.nps.gov/thingstodo/hike-cap-rock.htm",
  "Arch Rock Trail":           "https://www.nps.gov/thingstodo/hikearchrock.htm",
  "Split Rock Loop":           "https://www.nps.gov/jotr/planyourvisit/hiking.htm",
  "Lost Horse Mine":           "https://www.nps.gov/jotr/planyourvisit/hiking.htm",
  "Black Rock Canyon":         "https://www.nps.gov/jotr/planyourvisit/black-rock-area-hiking.htm",
  "Warren Peak":               "https://www.nps.gov/jotr/planyourvisit/black-rock-area-hiking.htm",
  "Wall Street Mill":          "https://www.nps.gov/jotr/planyourvisit/hiking.htm",

  // ── Wellness ───────────────────────────────────────────────────────────────
  "Joshua Tree Retreat Center": "https://www.jtrcc.org/",
  "Integratron":               "https://www.integratron.com/",
  "Miracle Springs Resort":    "https://www.miraclesprings.com/",
  "Bhakti Yoga Shala":         "https://www.bhaktiyogashala.com/",

  // ── Culture & Art ─────────────────────────────────────────────────────────
  "Pioneertown":               "https://www.pioneertown.com/",
  "High Desert Test Sites":    "https://www.highdesert.org/",
  "Pappy & Harriet's Pioneertown Palace": "https://www.pappyandharriets.com/",
  "Palm Springs Art Museum":   "https://www.psmuseum.org/",
  "Modernism Week":            "https://www.modernismweek.com/",
  "Desert Institute":          "https://www.joshuatree.org/",

  // ── Parks & Resources ──────────────────────────────────────────────────────
  "Joshua Tree National Park": "https://www.nps.gov/jotr/",
  "Stargazing in Joshua Tree": "https://www.nps.gov/jotr/planyourvisit/stargazing.htm",
  "Coachella":                 "https://www.coachella.com/",

  // ── Conservation ───────────────────────────────────────────────────────────
  "Joshua Tree National Park Association": "https://www.joshuatree.org/",
};

// Alias map for fuzzy matching — handles common AI variations
export const JOSHUA_TREE_ALIASES = {
  // Accommodation
  "Reset Hotel":               "RESET Hotel",
  "Reset Joshua Tree":         "RESET Hotel",
  "RESET":                     "RESET Hotel",
  "stayreset":                 "RESET Hotel",
  "AutoCamp":                  "AutoCamp Joshua Tree",
  "Auto Camp":                 "AutoCamp Joshua Tree",
  "Auto Camp JT":              "AutoCamp Joshua Tree",
  "Skylight":                  "Skylight Joshua Tree",
  "Skylight JT":               "Skylight Joshua Tree",
  "Hicksville":                "Hicksville Trailer Palace",
  "29 Palms":                  "29 Palms Inn",
  "Twenty Nine Palms Inn":     "29 Palms Inn",
  "Twentynine Palms Inn":      "29 Palms Inn",
  "Spin and Margies":          "Spin & Margie's Desert Hideaway",
  "Spin & Margies":            "Spin & Margie's Desert Hideaway",
  "Spin Margie":               "Spin & Margie's Desert Hideaway",
  "Two Bunch":                 "Two Bunch Palms",
  "L'Horizon":                 "L'Horizon Resort",
  "Parker":                    "Parker Palm Springs",
  "Arrive":                    "Arrive Palm Springs",

  // Dining
  "La Copine Kitchen":         "La Copine",
  "Pappy's":                   "Pappy & Harriet's",
  "Pappy and Harriet's":       "Pappy & Harriet's",
  "Pappys":                    "Pappy & Harriet's",
  "Pappy & Harriets":          "Pappy & Harriet's",
  "Workshop Kitchen":          "Workshop Kitchen + Bar",
  "Workshop":                  "Workshop Kitchen + Bar",

  // Trails
  "Barker Dam Loop":           "Barker Dam",
  "Barker Dam Trail":          "Barker Dam",
  "Hidden Valley":             "Hidden Valley Trail",
  "Hidden Valley Nature Trail": "Hidden Valley Trail",
  "Skull Rock Trail":          "Skull Rock",
  "Skull Rock Nature Trail":   "Skull Rock",
  "Cholla Cactus":             "Cholla Cactus Garden",
  "Cholla Garden":             "Cholla Cactus Garden",
  "Lost Palms":                "Lost Palms Oasis",
  "Lost Palms Oasis Trail":    "Lost Palms Oasis",
  "49 Palms Oasis":            "Fortynine Palms Oasis",
  "49 Palms":                  "Fortynine Palms Oasis",
  "Fortynine Palms":           "Fortynine Palms Oasis",
  "Mastodon Peak Loop":        "Mastodon Peak",
  "Cap Rock":                  "Cap Rock Nature Trail",
  "Arch Rock":                 "Arch Rock Trail",
  "Arch Rock Nature Trail":    "Arch Rock Trail",
  "Split Rock":                "Split Rock Loop",
  "Split Rock Trail":          "Split Rock Loop",
  "Lost Horse Mine Loop":      "Lost Horse Mine",
  "Lost Horse Mine Trail":     "Lost Horse Mine",
  "Black Rock Canyon Trail":   "Black Rock Canyon",
  "Warren Peak Trail":         "Warren Peak",
  "Black Rock Warren Peak":    "Black Rock Canyon",
  "Wall Street Mill Trail":    "Wall Street Mill",

  // Wellness / Culture
  "Retreat Center":            "Joshua Tree Retreat Center",
  "JTRCC":                     "Joshua Tree Retreat Center",
  "The Integratron":           "Integratron",
  "Miracle Springs":           "Miracle Springs Resort",
  "Bhakti Yoga":               "Bhakti Yoga Shala",
  "HDTS":                      "High Desert Test Sites",
  "PS Art Museum":             "Palm Springs Art Museum",

  // Parks
  "Joshua Tree NP":            "Joshua Tree National Park",
  "JOTR":                      "Joshua Tree National Park",
  "JTNP":                      "Joshua Tree National Park",
  "Desert Stars":              "Desert Stars Festival",
  "JTNPA":                     "Joshua Tree National Park Association",
  "Desert Institute":          "Desert Institute",
};

/**
 * Look up a URL by place name. Tries exact match first, then aliases.
 */
export function lookupUrl(name) {
  if (!name) return null;
  const trimmed = name.trim();
  // Exact match
  if (JOSHUA_TREE_URLS[trimmed]) return JOSHUA_TREE_URLS[trimmed];
  // Alias match
  const canonical = JOSHUA_TREE_ALIASES[trimmed];
  if (canonical && JOSHUA_TREE_URLS[canonical]) return JOSHUA_TREE_URLS[canonical];
  // Partial match — check if name contains a known place
  for (const [key, url] of Object.entries(JOSHUA_TREE_URLS)) {
    if (trimmed.toLowerCase().includes(key.toLowerCase()) || key.toLowerCase().includes(trimmed.toLowerCase())) {
      return url;
    }
  }
  return null;
}
