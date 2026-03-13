// ═══════════════════════════════════════════════════════════════════════════════
// OLYMPIC PENINSULA URL REGISTRY — Maps place names to external URLs
// ═══════════════════════════════════════════════════════════════════════════════
//
// Used by:
//   1. The AI prompt (injected into the guide so Claude can include URLs)
//   2. The ItineraryResults renderer (client-side fallback matching)
//

export const OLYMPIC_URLS = {
  // ── Accommodation ──────────────────────────────────────────────────────────
  "Lake Crescent Lodge":        "https://www.olympicnationalparks.com/lodging/lake-crescent-lodge/",
  "Kalaloch Lodge":             "https://www.olympicnationalparks.com/lodging/kalaloch-lodge/",
  "Sol Duc Hot Springs Resort": "https://www.olympicnationalparks.com/lodging/sol-duc-hot-springs-resort/",
  "Quileute Oceanside Resort":  "https://www.quileuteoceanside.com/",
  "Domaine Madeleine":          "https://www.domainemadeleine.com/",
  "Palace Hotel":               "https://www.palacehotelpt.com/",
  "Manresa Castle":             "https://www.manresacastle.com/",

  // ── Dining — Port Angeles ──────────────────────────────────────────────────
  "Kokopelli Grill":            "https://www.kokopelligrill.com/",
  "Barhop Brewing":             "https://www.barhopbrewing.com/",
  "Dupuis Restaurant":          "https://www.dupuisrestaurant.com/",

  // ── Dining — Sequim & Port Townsend ────────────────────────────────────────
  "Alder Wood Bistro":          "https://www.alderwoodbistro.com/",
  "Finistère":                  "https://www.finabordeaux.com/",
  "Bread & Roses Bakery":       "https://www.breadandrosespt.com/",

  // ── Dining — Forks & La Push ───────────────────────────────────────────────
  "Quileute Oceanside Resort Restaurant": "https://www.quileuteoceanside.com/",

  // ── Trails & Hikes ────────────────────────────────────────────────────────
  "Hurricane Hill Trail":       "https://www.nps.gov/olym/planyourvisit/hurricane-ridge.htm",
  "High Divide Trail":          "https://www.nps.gov/olym/planyourvisit/sol-duc-area.htm",
  "Seven Lakes Basin":          "https://www.nps.gov/olym/planyourvisit/sol-duc-area.htm",
  "Mount Storm King":           "https://www.nps.gov/olym/planyourvisit/lake-crescent-area.htm",
  "Marymere Falls Trail":       "https://www.nps.gov/olym/planyourvisit/lake-crescent-area.htm",
  "Hall of Mosses Trail":       "https://www.nps.gov/olym/planyourvisit/hoh-rain-forest.htm",
  "Hoh River Trail":            "https://www.nps.gov/olym/planyourvisit/hoh-rain-forest.htm",
  "Second Beach":               "https://www.nps.gov/olym/planyourvisit/la-push-area.htm",
  "Hole-in-the-Wall":           "https://www.nps.gov/olym/planyourvisit/rialto-beach.htm",
  "Rialto Beach":               "https://www.nps.gov/olym/planyourvisit/rialto-beach.htm",
  "Ozette Triangle":            "https://www.nps.gov/olym/planyourvisit/ozette-area.htm",
  "Cape Alava":                 "https://www.nps.gov/olym/planyourvisit/ozette-area.htm",
  "Sol Duc Falls":              "https://www.nps.gov/olym/planyourvisit/sol-duc-area.htm",

  // ── Soaking & Thermal ──────────────────────────────────────────────────────
  "Sol Duc Hot Springs":        "https://www.olympicnationalparks.com/lodging/sol-duc-hot-springs-resort/",
  "Olympic Hot Springs":        "https://www.nps.gov/olym/planyourvisit/elwha-area.htm",

  // ── Culture & Heritage ────────────────────────────────────────────────────
  "Makah Museum":               "https://www.makahmuseum.com/",
  "Makah Nation":               "https://www.makah.com/",
  "Cape Flattery":              "https://www.makah.com/",
  "Feiro Marine Life Center":   "https://www.feiromarinelifecenter.org/",
  "Wedding Rocks":              "https://www.nps.gov/olym/planyourvisit/ozette-area.htm",
  "Port Townsend":              "https://www.enjoypt.com/",
  "Centrum Foundation":         "https://centrum.org/",

  // ── Indigenous Heritage ────────────────────────────────────────────────────
  "Lower Elwha Klallam Tribe":  "https://www.elwha.org/",
  "Elwha River Restoration":    "https://www.elwha.org/",
  "Jamestown S'Klallam Tribe":  "https://www.jamestowntribe.org/",
  "Quileute Nation":            "https://www.quileutenation.org/",

  // ── Parks & Areas ──────────────────────────────────────────────────────────
  "Olympic National Park":      "https://www.nps.gov/olym/",
  "Hurricane Ridge":            "https://www.nps.gov/olym/planyourvisit/hurricane-ridge.htm",
  "Hoh Rain Forest":            "https://www.nps.gov/olym/planyourvisit/hoh-rain-forest.htm",
  "Hoh Rainforest":             "https://www.nps.gov/olym/planyourvisit/hoh-rain-forest.htm",
  "Lake Crescent":              "https://www.nps.gov/olym/planyourvisit/lake-crescent-area.htm",
  "Sol Duc":                    "https://www.nps.gov/olym/planyourvisit/sol-duc-area.htm",
  "Kalaloch":                   "https://www.nps.gov/olym/planyourvisit/kalaloch-area.htm",
  "La Push":                    "https://www.nps.gov/olym/planyourvisit/la-push-area.htm",

  // ── Conservation & Volunteering ────────────────────────────────────────────
  "Washington Trails Association": "https://www.wta.org/",
  "Friends of the Hoh":         "https://www.friendsofthehoh.org/",

  // ── Provisions & Outfitters ────────────────────────────────────────────────
  "Swain's General Store":      "https://www.swainsinc.com/",
};

// Alias map for fuzzy matching — handles common AI variations
export const OLYMPIC_ALIASES = {
  // Accommodation
  "Crescent Lodge":             "Lake Crescent Lodge",
  "Crescent Lake Lodge":        "Lake Crescent Lodge",
  "Sol Duc Resort":             "Sol Duc Hot Springs Resort",
  "Sol Duc Lodge":              "Sol Duc Hot Springs Resort",
  "Quileute Resort":            "Quileute Oceanside Resort",
  "La Push Resort":             "Quileute Oceanside Resort",
  "Domaine Madeleine B&B":     "Domaine Madeleine",

  // Trails
  "Hurricane Hill":             "Hurricane Hill Trail",
  "Hurricane Ridge Trail":      "Hurricane Hill Trail",
  "High Divide Loop":           "High Divide Trail",
  "Seven Lakes Basin Loop":     "Seven Lakes Basin",
  "High Divide Seven Lakes":    "High Divide Trail",
  "Storm King Trail":           "Mount Storm King",
  "Storm King":                 "Mount Storm King",
  "Marymere Falls":             "Marymere Falls Trail",
  "Hall of Mosses":             "Hall of Mosses Trail",
  "Hoh River":                  "Hoh River Trail",
  "Hoh Trail":                  "Hoh River Trail",
  "La Push Beach":              "Second Beach",
  "Second Beach La Push":       "Second Beach",
  "Rialto Beach Trail":         "Rialto Beach",
  "Hole in the Wall":           "Hole-in-the-Wall",
  "Ozette Loop":                "Ozette Triangle",
  "Cape Alava Trail":           "Cape Alava",
  "Sol Duc Falls Trail":        "Sol Duc Falls",

  // Soaking
  "Sol Duc Springs":            "Sol Duc Hot Springs",
  "Sol Duc Pools":              "Sol Duc Hot Springs",

  // Culture
  "Makah":                      "Makah Nation",
  "Makah Cultural Center":      "Makah Museum",
  "Elwha Tribe":                "Lower Elwha Klallam Tribe",
  "Elwha Klallam":              "Lower Elwha Klallam Tribe",
  "Elwha Dam Removal":          "Elwha River Restoration",
  "Jamestown S'Klallam":        "Jamestown S'Klallam Tribe",
  "Quileute":                   "Quileute Nation",

  // Parks
  "Olympic":                    "Olympic National Park",
  "Olympic NP":                 "Olympic National Park",
  "Hoh":                        "Hoh Rain Forest",
  "Hoh Valley":                 "Hoh Rain Forest",
  "Hurricane Ridge Road":       "Hurricane Ridge",
  "Kalaloch Beach":             "Kalaloch",

  // Conservation
  "WTA":                        "Washington Trails Association",
};

/**
 * Look up a URL by place name. Tries exact match first, then aliases.
 */
export function lookupUrl(name) {
  if (!name) return null;
  const trimmed = name.trim();
  // Exact match
  if (OLYMPIC_URLS[trimmed]) return OLYMPIC_URLS[trimmed];
  // Alias match
  const canonical = OLYMPIC_ALIASES[trimmed];
  if (canonical && OLYMPIC_URLS[canonical]) return OLYMPIC_URLS[canonical];
  // Partial match — check if name contains a known place
  for (const [key, url] of Object.entries(OLYMPIC_URLS)) {
    if (trimmed.toLowerCase().includes(key.toLowerCase()) || key.toLowerCase().includes(trimmed.toLowerCase())) {
      return url;
    }
  }
  return null;
}
