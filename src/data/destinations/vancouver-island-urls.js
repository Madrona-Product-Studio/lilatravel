// ═══════════════════════════════════════════════════════════════════════════════
// VANCOUVER ISLAND URL REGISTRY — Maps place names to external URLs
// ═══════════════════════════════════════════════════════════════════════════════
//
// Used by:
//   1. The AI prompt (injected into the guide so Claude can include URLs)
//   2. The ItineraryResults renderer (client-side fallback matching)
//

export const VANCOUVER_URLS = {
  // ── Trails & Hikes ────────────────────────────────────────────────────────
  "Long Beach":                 "https://parks.canada.ca/pn-np/bc/pacificrim/activ/activ6",
  "Rainforest Trail":           "https://parks.canada.ca/pn-np/bc/pacificrim/activ/activ6",
  "Wild Pacific Trail":         "https://www.wildpacifictrail.com/",
  "Meares Island Big Tree Trail": "https://www.tourismtofino.com/activity/meares-island",
  "Schooner Cove Trail":        "https://parks.canada.ca/pn-np/bc/pacificrim/activ/activ6",
  "Paradise Meadows":           "https://bcparks.ca/strathcona-park/",
  "Battleship Lake":            "https://bcparks.ca/strathcona-park/",
  "Elk River Trail":            "https://bcparks.ca/strathcona-park/",
  "West Coast Trail":           "https://parks.canada.ca/pn-np/bc/pacificrim/activ/activ1",
  "Juan de Fuca Marine Trail":  "https://bcparks.ca/juan-de-fuca-park/",
  "Mystic Beach":               "https://bcparks.ca/juan-de-fuca-park/",
  "Botanical Beach":            "https://bcparks.ca/botanical-beach-park/",

  // ── Parks & Areas ────────────────────────────────────────────────────────
  "Pacific Rim National Park Reserve": "https://parks.canada.ca/pn-np/bc/pacificrim",
  "Pacific Rim National Park":  "https://parks.canada.ca/pn-np/bc/pacificrim",
  "Strathcona Provincial Park": "https://bcparks.ca/strathcona-park/",
  "Clayoquot Sound":            "https://www.clayoquotbiosphere.org/",
  "Meares Island":              "https://www.tourismtofino.com/activity/meares-island",
  "Cathedral Grove":            "https://bcparks.ca/macmillan-park/",

  // ── Beaches ──────────────────────────────────────────────────────────────
  "Chesterman Beach":           "https://www.tourismtofino.com/activities/beaches",
  "Cox Bay":                    "https://www.tourismtofino.com/activities/beaches",

  // ── Soaking & Thermal ────────────────────────────────────────────────────
  "Hot Springs Cove":           "https://bcparks.ca/maquinna-park/",
  "Ancient Cedars Spa":         "https://www.wickinn.com/ancient-cedars-spa/",

  // ── Dining — Tofino ──────────────────────────────────────────────────────
  "Wolf in the Fog":            "https://www.wolfinthefog.com/",
  "Shelter Restaurant":         "https://www.shelterrestaurant.com/",
  "1909 Kitchen":               "https://www.tofinoresortandmarina.com/dine/",
  "Common Loaf Bake Shop":      "https://www.commonloaf.com/",
  "SoBo":                       "https://www.sobo.ca/",

  // ── Dining — Ucluelet ────────────────────────────────────────────────────
  "Pluvio Restaurant + Rooms":  "https://www.pluviorestaurant.com/",
  "Pluvio":                     "https://www.pluviorestaurant.com/",
  "Heartwood Kitchen":          "https://www.heartwoodkitchen.ca/",

  // ── Indigenous Culture & Heritage ────────────────────────────────────────
  "House of Himwitsa":          "https://www.houseofhimwitsa.com/",
  "Roy Henry Vickers Gallery":  "https://www.royhenryvickers.com/",
  "Tla-o-qui-aht Tribal Parks": "https://www.tourismtofino.com/activity/indigenous-experiences",
  "U'mista Cultural Centre":    "https://www.umista.ca/",
  "Ahous Adventures":           "https://www.ahousadventures.com/",

  // ── Tours & Activities ───────────────────────────────────────────────────
  "Pacific Surf School":        "https://www.pacificsurfschool.com/",
  "Remote Passages":            "https://www.remotepassages.com/",
  "Tofino Sea Kayaking Company": "https://www.tofino-kayaking.com/",

  // ── Conservation & Stewardship ───────────────────────────────────────────
  "Clayoquot Biosphere Trust":  "https://www.clayoquotbiosphere.org/",
  "Friends of Strathcona Park": "https://www.friendsofstrathcona.org/",
  "Raincoast Education Society": "https://www.raincoast.org/",

  // ── Arts & Nature ────────────────────────────────────────────────────────
  "Tofino Botanical Gardens":   "https://www.tofinobotanicalgardens.com/",

  // ── Accommodation ────────────────────────────────────────────────────────
  "Wickaninnish Inn":           "https://www.wickinn.com/",
  "Clayoquot Wilderness Resort": "https://www.clayoquot.com/",
  "Green Point Campground":     "https://parks.canada.ca/pn-np/bc/pacificrim/activ/camping",
  "Wya Point Resort":           "https://www.wyapoint.com/",
  "Pacific Sands Beach Resort": "https://www.pacificsands.com/",
  "Long Beach Lodge Resort":    "https://www.longbeachlodgeresort.com/",

  // ── Victoria Corridor ────────────────────────────────────────────────────
  "Butchart Gardens":           "https://www.butchartgardens.com/",
  "The Butchart Gardens":       "https://www.butchartgardens.com/",
  "Fairmont Empress":           "https://www.fairmont.com/empress-victoria/",
  "Victoria":                   "https://www.tourismvictoria.com/",
  "Beacon Hill Park":           "https://www.victoria.ca/parks-recreation/beacon-hill-park",
  "Inner Harbour":              "https://www.tourismvictoria.com/",

  // ── Transport ────────────────────────────────────────────────────────────
  "BC Ferries":                 "https://www.bcferries.com/",
  "Harbour Air":                "https://www.harbourair.com/",
};

// Alias map for fuzzy matching — handles common AI variations
export const VANCOUVER_ALIASES = {
  // Trails
  "Rainforest Loop":            "Rainforest Trail",
  "Wild Pacific":               "Wild Pacific Trail",
  "Ucluelet Trail":             "Wild Pacific Trail",
  "Big Tree Trail":             "Meares Island Big Tree Trail",
  "Meares Island Trail":        "Meares Island Big Tree Trail",
  "Schooner Cove":              "Schooner Cove Trail",
  "Paradise Meadows Loop":      "Paradise Meadows",
  "Elk River":                  "Elk River Trail",
  "WCT":                        "West Coast Trail",
  "Juan de Fuca Trail":         "Juan de Fuca Marine Trail",
  "JDF Trail":                  "Juan de Fuca Marine Trail",

  // Parks
  "Pacific Rim":                "Pacific Rim National Park Reserve",
  "Strathcona":                 "Strathcona Provincial Park",
  "Strathcona Park":            "Strathcona Provincial Park",
  "Clayoquot":                  "Clayoquot Sound",

  // Soaking
  "Hot Springs":                "Hot Springs Cove",
  "Maquinna Hot Springs":       "Hot Springs Cove",
  "Maquinna":                   "Hot Springs Cove",
  "Wickaninnish Spa":           "Ancient Cedars Spa",

  // Dining
  "Wolf in Fog":                "Wolf in the Fog",
  "Shelter":                    "Shelter Restaurant",
  "Common Loaf":                "Common Loaf Bake Shop",
  "Pluvio Restaurant":          "Pluvio Restaurant + Rooms",

  // Culture
  "Himwitsa":                   "House of Himwitsa",
  "Himwitsa Gallery":           "House of Himwitsa",
  "Roy Henry Vickers":          "Roy Henry Vickers Gallery",
  "Vickers Gallery":            "Roy Henry Vickers Gallery",
  "Tribal Parks":               "Tla-o-qui-aht Tribal Parks",
  "Umista":                     "U'mista Cultural Centre",
  "U'mista":                    "U'mista Cultural Centre",
  "Ahous":                      "Ahous Adventures",
  "Ahousaht Adventures":        "Ahous Adventures",

  // Accommodation
  "Wick Inn":                   "Wickaninnish Inn",
  "Wickaninnish":               "Wickaninnish Inn",
  "Wya Point":                  "Wya Point Resort",
  "Pacific Sands":              "Pacific Sands Beach Resort",
  "Long Beach Lodge":           "Long Beach Lodge Resort",
  "Clayoquot Resort":           "Clayoquot Wilderness Resort",
  "Green Point":                "Green Point Campground",

  // Victoria
  "Butchart":                   "Butchart Gardens",
  "Empress":                    "Fairmont Empress",
  "Empress Hotel":              "Fairmont Empress",
  "Afternoon Tea":              "Fairmont Empress",
  "Beacon Hill":                "Beacon Hill Park",

  // Transport
  "Ferry":                      "BC Ferries",
  "Float Plane":                "Harbour Air",
};

/**
 * Look up a URL by place name. Tries exact match first, then aliases.
 */
export function lookupUrl(name) {
  if (!name) return null;
  const trimmed = name.trim();
  // Exact match
  if (VANCOUVER_URLS[trimmed]) return VANCOUVER_URLS[trimmed];
  // Alias match
  const canonical = VANCOUVER_ALIASES[trimmed];
  if (canonical && VANCOUVER_URLS[canonical]) return VANCOUVER_URLS[canonical];
  // Partial match — check if name contains a known place
  for (const [key, url] of Object.entries(VANCOUVER_URLS)) {
    if (trimmed.toLowerCase().includes(key.toLowerCase()) || key.toLowerCase().includes(trimmed.toLowerCase())) {
      return url;
    }
  }
  return null;
}
