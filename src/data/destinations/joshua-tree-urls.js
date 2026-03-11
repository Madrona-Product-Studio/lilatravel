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
  "Skylight Joshua Tree":      "https://www.skylightjt.com/",
  "Hicksville Trailer Palace":  "https://www.hicksville.com/",
  "29 Palms Inn":              "https://29palmsinn.com/",
  "Sacred Sands":              "https://www.sacredsands.com/",
  "Pioneertown Motel":         "https://www.pioneertownmotel.com/",
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

  // ── Trails & Hikes ────────────────────────────────────────────────────────
  "Barker Dam":                "https://www.nps.gov/jotr/planyourvisit/barkerdam.htm",
  "Hidden Valley Trail":       "https://www.nps.gov/jotr/planyourvisit/hiddenvalley.htm",
  "Ryan Mountain":             "https://www.nps.gov/jotr/planyourvisit/ryanmountain.htm",
  "Skull Rock":                "https://www.nps.gov/jotr/planyourvisit/skull-rock.htm",
  "Cholla Cactus Garden":      "https://www.nps.gov/jotr/planyourvisit/chollacactusgarden.htm",
  "Lost Palms Oasis":          "https://www.nps.gov/jotr/planyourvisit/lostpalms.htm",
  "Keys View":                 "https://www.nps.gov/jotr/planyourvisit/keys-view.htm",
  "Fortynine Palms Oasis":     "https://www.nps.gov/jotr/planyourvisit/fortyninepalms.htm",
  "Mastodon Peak":             "https://www.nps.gov/jotr/planyourvisit/mastodonpeak.htm",

  // ── Wellness ───────────────────────────────────────────────────────────────
  "Joshua Tree Retreat Center": "https://www.jtrcc.org/",
  "Integratron":               "https://www.integratron.com/",
  "Miracle Springs Resort":    "https://www.miraclesprings.com/",
  "Bhakti Yoga Shala":         "https://www.bhaktiyogashala.com/",

  // ── Culture & Art ─────────────────────────────────────────────────────────
  "High Desert Test Sites":    "https://www.highdeserttestsites.com/",
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
  "Skylight":                  "Skylight Joshua Tree",
  "Skylight JT":               "Skylight Joshua Tree",
  "Hicksville":                "Hicksville Trailer Palace",
  "29 Palms":                  "29 Palms Inn",
  "Twenty Nine Palms Inn":     "29 Palms Inn",
  "Twentynine Palms Inn":      "29 Palms Inn",
  "Two Bunch":                 "Two Bunch Palms",
  "L'Horizon":                 "L'Horizon Resort",
  "Parker":                    "Parker Palm Springs",
  "Arrive":                    "Arrive Palm Springs",
  "La Copine Kitchen":         "La Copine",
  "Pappy's":                   "Pappy & Harriet's",
  "Pappy and Harriet's":       "Pappy & Harriet's",
  "Pappys":                    "Pappy & Harriet's",
  "Pappy & Harriets":          "Pappy & Harriet's",
  "Workshop Kitchen":          "Workshop Kitchen + Bar",
  "Workshop":                  "Workshop Kitchen + Bar",
  "Barker Dam Loop":           "Barker Dam",
  "Barker Dam Trail":          "Barker Dam",
  "Hidden Valley":             "Hidden Valley Trail",
  "Skull Rock Trail":          "Skull Rock",
  "Skull Rock Nature Trail":   "Skull Rock",
  "Cholla Cactus":             "Cholla Cactus Garden",
  "Cholla Garden":             "Cholla Cactus Garden",
  "Lost Palms":                "Lost Palms Oasis",
  "49 Palms Oasis":            "Fortynine Palms Oasis",
  "49 Palms":                  "Fortynine Palms Oasis",
  "Mastodon Peak Loop":        "Mastodon Peak",
  "Retreat Center":            "Joshua Tree Retreat Center",
  "JTRCC":                     "Joshua Tree Retreat Center",
  "The Integratron":           "Integratron",
  "Miracle Springs":           "Miracle Springs Resort",
  "Bhakti Yoga":               "Bhakti Yoga Shala",
  "HDTS":                      "High Desert Test Sites",
  "PS Art Museum":             "Palm Springs Art Museum",
  "Joshua Tree NP":            "Joshua Tree National Park",
  "JOTR":                      "Joshua Tree National Park",
  "JTNP":                      "Joshua Tree National Park",
  "Desert Stars":              "Desert Stars Festival",
  "JTNPA":                     "Joshua Tree National Park Association",
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
