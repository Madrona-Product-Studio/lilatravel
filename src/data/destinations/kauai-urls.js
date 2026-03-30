// ═══════════════════════════════════════════════════════════════════════════════
// KAUAI URL REGISTRY — Maps place names to external URLs
// ═══════════════════════════════════════════════════════════════════════════════
//
// Used by:
//   1. The AI prompt (injected into the guide so Claude can include URLs)
//   2. The ItineraryResults renderer (client-side fallback matching)
//

export const KAUAI_URLS = {
  // ── Trails & Hikes ────────────────────────────────────────────────────────
  "Kalalau Trail":              "https://dlnr.hawaii.gov/dsp/parks/kauai/napali-coast-state-wilderness-park/",
  "Hanakāpīʻai Beach":         "https://dlnr.hawaii.gov/dsp/parks/kauai/napali-coast-state-wilderness-park/",
  "Kalalau Beach":              "https://dlnr.hawaii.gov/dsp/parks/kauai/napali-coast-state-wilderness-park/",
  "Awaʻawapuhi Trail":          "https://dlnr.hawaii.gov/dsp/parks/kauai/kokee-state-park/",
  "Waimea Canyon Trail":        "https://dlnr.hawaii.gov/dsp/parks/kauai/waimea-canyon-state-park/",
  "Pihea Trail":                "https://dlnr.hawaii.gov/dsp/parks/kauai/kokee-state-park/",
  "Sleeping Giant":             "https://dlnr.hawaii.gov/dsp/parks/kauai/nounou-mountain-east-side/",

  // ── Beaches & Coast ──────────────────────────────────────────────────────
  "Ke'e Beach":                 "https://www.gohaena.com/",
  "Hāʻena State Park":         "https://www.gohaena.com/",
  "Tunnels Reef":               "https://gohaena.com/",
  "Poipū Beach":                "https://www.poipubeach.org/",
  "Shipwreck Beach":            "https://www.poipubeach.org/",
  "Polihale State Park":        "https://dlnr.hawaii.gov/dsp/parks/kauai/polihale-state-park/",
  "Hanalei Bay":                "https://www.gohawaii.com/islands/kauai/regions/north-shore/hanalei-bay",

  // ── Parks & Areas ────────────────────────────────────────────────────────
  "Nā Pali Coast":              "https://dlnr.hawaii.gov/dsp/parks/kauai/napali-coast-state-wilderness-park/",
  "Waimea Canyon":              "https://dlnr.hawaii.gov/dsp/parks/kauai/waimea-canyon-state-park/",
  "Kōkeʻe State Park":         "https://dlnr.hawaii.gov/dsp/parks/kauai/kokee-state-park/",
  "Alaka'i Swamp":              "https://dlnr.hawaii.gov/dsp/parks/kauai/kokee-state-park/",

  // ── Dining — North Shore ─────────────────────────────────────────────────
  "Bar Acuda":                  "https://www.baracuda.com/",
  "Dolphin Restaurant":         "https://www.hanaleidolphin.com/",
  "Hanalei Taro & Juice Co.":  "https://www.hanaleitaroandjuice.com/",
  "Wishing Well Shave Ice":    "https://www.wishingwellshaveice.com/",

  // ── Dining — South Shore ─────────────────────────────────────────────────
  "The Beach House Restaurant": "https://www.the-beach-house.com/",
  "Beach House Restaurant":     "https://www.the-beach-house.com/",
  "Merriman's Fish House":      "https://www.merrimanshawaii.com/poipu/",
  "Koloa Rum Company":          "https://www.koloarum.com/",

  // ── Dining — West Side ───────────────────────────────────────────────────
  "Waimea Brewing Company":     "https://www.waimea-plantation.com/dining/",
  "Hanappe'e Café":             "https://www.hanapepe.org/",

  // ── Provisions ───────────────────────────────────────────────────────────
  "Healthy Hut":                "https://www.healthyhutkauai.com/",

  // ── Yoga & Wellness ──────────────────────────────────────────────────────
  "Black Coral Yoga":           "https://www.blackcoralyoga.com/",
  "Anara Spa":                  "https://www.hyatt.com/grand-hyatt/en-US/kauai",
  "Kauaʻi Yoga":               "https://www.kauaiyoga.com/",

  // ── Sacred Practice & Culture ────────────────────────────────────────────
  "Kauai Aadheenam":            "https://www.himalayanacademy.com/visit/",
  "Kauaʻi's Hindu Monastery":  "https://www.himalayanacademy.com/visit/",
  "Kauai's Hindu Monastery":    "https://www.himalayanacademy.com/visit/",
  "Kadavul Temple":             "https://www.himalayanacademy.com/",
  "Lydgate Farms":              "https://lydgatefarms.com/chocolate-farm-tour/",
  "Lydgate Farms Chocolate Tour": "https://lydgatefarms.com/chocolate-farm-tour/",

  // ── Gardens & Nature ─────────────────────────────────────────────────────
  "Limahuli Garden":            "https://ntbg.org/gardens/limahuli/",
  "Limahuli Garden & Preserve": "https://ntbg.org/gardens/limahuli/",
  "McBryde Garden":             "https://ntbg.org/gardens/mcbryde/",
  "National Tropical Botanical Garden": "https://ntbg.org/",
  "Kīlauea Lighthouse":        "https://www.fws.gov/refuge/kilauea-point",
  "Kilauea Lighthouse":         "https://www.fws.gov/refuge/kilauea-point",
  "Kilauea Point National Wildlife Refuge": "https://www.fws.gov/refuge/kilauea-point",
  "Hanalei National Wildlife Refuge": "https://www.fws.gov/refuge/hanalei/",

  // ── Tours & Activities ───────────────────────────────────────────────────
  "Na Pali Coast Boat Tour":    "https://www.captainandy.com/",
  "Captain Andy's":             "https://www.captainandy.com/",
  "Blue Dolphin Charters":      "https://www.bluedolphinkauai.com/",
  "Blue Hawaiian Helicopters":  "https://www.bluehawaiian.com/kauai/",
  "Jack Harter Helicopters":    "https://www.helicopters-kauai.com/",
  "Kayak Kauai":                "https://www.kayakkauai.com/",
  "Wailua Kayak Adventures":    "https://www.wailuakayak.com/",

  // ── Give Back & Stewardship ──────────────────────────────────────────────
  "Waipa Foundation":           "https://waipafoundation.org/",
  "Waipā Foundation":           "https://waipafoundation.org/",
  "Surfrider Foundation Kauaʻi": "https://www.surfrider.org/chapters/kauai",
  "Malama Kauaʻi":             "https://www.malamakauai.org/",
  "Malama i na Honu":           "https://www.pacificwhale.org/",

  // ── Art & Culture ────────────────────────────────────────────────────────
  "Hanapepe":                   "https://www.hanapepe.org/",
  "Hanapepe Swinging Bridge":   "https://www.hanapepe.org/",

  // ── Accommodation ────────────────────────────────────────────────────────
  "Hanalei Colony Resort":      "https://www.hcr.com/",
  "Grand Hyatt Kauaʻi":        "https://www.hyatt.com/grand-hyatt/en-US/kauai",
  "Grand Hyatt Kauai":          "https://www.hyatt.com/grand-hyatt/en-US/kauai",
  "Timbers Kauaʻi":            "https://www.timberskauai.com/",
  "Timbers Kauai":              "https://www.timberskauai.com/",
  "Kōkeʻe Lodge":              "https://www.kokee.net/",
  "Kauaʻi Inn":                "https://www.kauai-inn.com/",

  // ── Scenic Drives ────────────────────────────────────────────────────────
  "Waimea Canyon Drive":        "https://dlnr.hawaii.gov/dsp/parks/kauai/waimea-canyon-state-park/",
};

// Alias map for fuzzy matching — handles common AI variations
export const KAUAI_ALIASES = {
  // Trails
  "Kalalau":                    "Kalalau Trail",
  "Kalalau Hike":               "Kalalau Trail",
  "Napali Trail":               "Kalalau Trail",
  "Na Pali Trail":              "Kalalau Trail",
  "Hanakapiai":                 "Hanakāpīʻai Beach",
  "Hanakapiai Beach":           "Hanakāpīʻai Beach",
  "Awaawapuhi":                 "Awaʻawapuhi Trail",
  "Awaawapuhi Trail":           "Awaʻawapuhi Trail",
  "Pihea":                      "Pihea Trail",
  "Alakai Swamp":               "Alaka'i Swamp",
  "Alakai Swamp Trail":         "Pihea Trail",
  "Nounou Mountain":            "Sleeping Giant",
  "Nounou Trail":               "Sleeping Giant",

  // Beaches
  "Kee Beach":                  "Ke'e Beach",
  "Haena":                      "Hāʻena State Park",
  "Haena State Park":           "Hāʻena State Park",
  "Tunnels Beach":              "Tunnels Reef",
  "Tunnels":                    "Tunnels Reef",
  "Poipu Beach":                "Poipū Beach",
  "Poipu":                      "Poipū Beach",

  // Parks
  "Na Pali":                    "Nā Pali Coast",
  "Na Pali Coast":              "Nā Pali Coast",
  "Napali Coast":               "Nā Pali Coast",
  "Napali":                     "Nā Pali Coast",
  "Kokee":                      "Kōkeʻe State Park",
  "Kokee State Park":           "Kōkeʻe State Park",
  "Waimea Canyon State Park":   "Waimea Canyon",

  // Dining
  "Beach House":                "The Beach House Restaurant",
  "Beach House Kauai":          "The Beach House Restaurant",
  "Merriman's":                 "Merriman's Fish House",
  "Merrimans":                  "Merriman's Fish House",
  "Koloa Rum":                  "Koloa Rum Company",
  "Hanapepe Cafe":              "Hanappe'e Café",

  // Culture
  "Hindu Monastery":            "Kauai Aadheenam",
  "Hindu Temple Kauai":         "Kauai Aadheenam",
  "Lydgate Chocolate":          "Lydgate Farms",
  "Lydgate Farm Tour":          "Lydgate Farms",
  "Limahuli":                   "Limahuli Garden",
  "McBryde":                    "McBryde Garden",
  "NTBG":                       "National Tropical Botanical Garden",
  "Kilauea Point":              "Kīlauea Lighthouse",
  "Kilauea NWR":                "Kīlauea Lighthouse",

  // Tours
  "Captain Andys":              "Captain Andy's",
  "Na Pali Boat Tour":          "Captain Andy's",
  "Blue Hawaiian":              "Blue Hawaiian Helicopters",
  "Jack Harter":                "Jack Harter Helicopters",

  // Accommodation
  "Grand Hyatt":                "Grand Hyatt Kauaʻi",
  "Hyatt Kauai":                "Grand Hyatt Kauaʻi",
  "Timbers":                    "Timbers Kauaʻi",
  "HCR":                        "Hanalei Colony Resort",
  "Kokee Lodge":                "Kōkeʻe Lodge",
  "Kokee Cabins":               "Kōkeʻe Lodge",
  "Kauai Inn":                  "Kauaʻi Inn",

  // Stewardship
  "Waipa":                      "Waipa Foundation",
  "Surfrider Kauai":            "Surfrider Foundation Kauaʻi",
  "Malama Kauai":               "Malama Kauaʻi",
};

/**
 * Look up a URL by place name. Tries exact match first, then aliases.
 */
export function lookupUrl(name) {
  if (!name) return null;
  const trimmed = name.trim();
  // Exact match
  if (KAUAI_URLS[trimmed]) return KAUAI_URLS[trimmed];
  // Alias match
  const canonical = KAUAI_ALIASES[trimmed];
  if (canonical && KAUAI_URLS[canonical]) return KAUAI_URLS[canonical];
  // Partial match — check if name contains a known place
  for (const [key, url] of Object.entries(KAUAI_URLS)) {
    if (trimmed.toLowerCase().includes(key.toLowerCase()) || key.toLowerCase().includes(trimmed.toLowerCase())) {
      return url;
    }
  }
  return null;
}
