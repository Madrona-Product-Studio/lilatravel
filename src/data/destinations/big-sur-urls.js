// ═══════════════════════════════════════════════════════════════════════════════
// BIG SUR URL REGISTRY — Maps place names to external URLs
// ═══════════════════════════════════════════════════════════════════════════════
//
// Used by:
//   1. The AI prompt (injected into the guide so Claude can include URLs)
//   2. The ItineraryResults renderer (client-side fallback matching)
//
// Keep this in sync with BigSurGuide.jsx — it's the canonical URL source.
//

export const BIG_SUR_URLS = {
  // ── Accommodation ──────────────────────────────────────────────────────────
  "Post Ranch Inn":             "https://www.postranchinn.com/",
  "Alila Ventana Big Sur":      "https://www.ventanabigsur.com/",
  "Treebones Resort":           "https://www.treebonesresort.com/",
  "Glen Oaks Big Sur":          "https://www.glenoaksbigur.com/",
  "Big Sur Lodge":              "https://www.bigsurlodge.com/",
  "Fernwood Resort":            "https://fernwoodbigsur.com/",
  "L'Auberge Carmel":           "https://www.laubergecarmel.com/",
  "Asilomar Conference Grounds": "https://www.visitasilomar.com/",
  "Asilomar State Beach & Conference Grounds": "https://www.visitasilomar.com/",
  "Bernardus Lodge & Spa":      "https://www.bernarduslodge.com/",
  "Hyatt Carmel Highlands":     "https://www.hyatt.com/en-US/hotel/california/hyatt-carmel-highlands/mryxh",

  // ── Dining — Big Sur ───────────────────────────────────────────────────────
  "Sierra Mar":                 "https://www.postranchinn.com/dining/sierra-mar/",
  "Sur House":                  "https://www.ventanabigsur.com/dining/",
  "Nepenthe":                   "https://www.nepenthebigSur.com/",
  "Big Sur Bakery":             "https://www.bigsurbakery.com/",
  "Big Sur River Inn Restaurant": "https://www.bigsurriverinn.com/",
  "Fernwood Tavern Bar & Grill": "https://fernwoodbigsur.com/",

  // ── Dining — Carmel ────────────────────────────────────────────────────────
  "Aubergine":                  "https://www.laubergecarmel.com/dining/aubergine/",
  "La Bicyclette":              "https://www.labicycletterestaurant.com/",
  "Casanova":                   "https://www.casanovarestaurant.com/",
  "Mission Ranch Restaurant":   "https://www.missionranchcarmel.com/",
  "Carmel Belle":               "https://www.carmelbelle.com/",

  // ── Dining — Monterey ──────────────────────────────────────────────────────
  "Coastal Kitchen Monterey":   "https://www.coastalkitchenmonterey.com/",
  "Stokes Adobe":               "https://www.stokesadobe.com/",
  "Old Fisherman's Grotto":     "https://www.oldfishermansgrotto.com/",
  "Alta Bakery":                "https://www.altabakery.com/",

  // ── Trails & Hikes ────────────────────────────────────────────────────────
  "McWay Falls Overlook Trail": "https://www.parks.ca.gov/JuliaPfeifferBurns",
  "Partington Cove Trail":      "https://www.parks.ca.gov/JuliaPfeifferBurns",
  "Pfeiffer Falls Trail":       "https://www.parks.ca.gov/PfeifferBigSur",
  "Valley View Trail":          "https://www.parks.ca.gov/PfeifferBigSur",
  "Soberanes Point Trail":      "https://www.parks.ca.gov/GarrapataSP",
  "Creamery Meadow Loop":       "https://www.parks.ca.gov/AndrewMolera",
  "Tanbark Trail":              "https://www.parks.ca.gov/JuliaPfeifferBurns",
  "Tin House Trail":            "https://www.parks.ca.gov/JuliaPfeifferBurns",
  "Buzzard's Roost Trail":      "https://www.parks.ca.gov/PfeifferBigSur",
  "Cypress Grove Trail":        "https://www.parks.ca.gov/pointlobos",
  "Bird Island Trail":          "https://www.parks.ca.gov/pointlobos",
  "South Shore Trail":          "https://www.parks.ca.gov/pointlobos",

  // ── Yoga & Studios ──────────────────────────────────────────────────────────
  "Yoga Shala by the Sea":       "https://www.yogashalabythesea.com/",
  "Mount Madonna Center":        "https://mountmadonna.org/",
  "Mount Madonna":               "https://mountmadonna.org/",
  "Seaside Yoga Sanctuary":      "https://seasideyogasanctuary.com/",

  // ── Wellness & Practices ──────────────────────────────────────────────────
  "Refuge Carmel":               "https://www.refuge.com/",
  "Esalen Institute":           "https://www.esalen.org/",
  "Esalen Hot Springs":         "https://www.esalen.org/visit/campus-features",
  "Spa Alila":                  "https://www.ventanabigsur.com/spa/",
  "Post Ranch Spa":             "https://www.postranchinn.com/spa/",

  // ── Culture & Art ─────────────────────────────────────────────────────────
  "Henry Miller Memorial Library": "https://www.henrymiller.org/",
  "Tor House":                  "https://www.torhouse.org/",
  "Monterey Bay Aquarium":      "https://www.montereybayaquarium.org/",
  "Carmel Art Association":     "https://www.carmelart.org/",
  "Pacific Grove Monarch Butterfly Sanctuary": "https://www.pgmuseum.org/monarch-butterflies",
  "Cannery Row":                "https://www.canneryrow.com/",
  "Lovers Point":               "https://www.seemonterey.com/things-to-do/parks/lovers-point/",
  "Lovers Point Park":          "https://www.seemonterey.com/things-to-do/parks/lovers-point/",
  "Robinson Jeffers' Tor House": "https://www.torhouse.org/",
  "Point Lobos State Natural Reserve": "https://www.parks.ca.gov/?page_id=571",
  "Carmel Mission Basilica":    "https://carmelmission.org/",
  "Carmel Mission":             "https://www.carmelmission.org/",

  // ── Parks & Resources ──────────────────────────────────────────────────────
  "Big Sur":                    "https://www.bigsurcalifornia.org/",
  "Pfeiffer Big Sur State Park": "https://www.parks.ca.gov/PfeifferBigSur",
  "Julia Pfeiffer Burns State Park": "https://www.parks.ca.gov/JuliaPfeifferBurns",
  "Andrew Molera State Park":   "https://www.parks.ca.gov/AndrewMolera",
  "Garrapata State Park":       "https://www.parks.ca.gov/GarrapataSP",
  "Point Lobos":                "https://www.parks.ca.gov/pointlobos",
  "Los Padres National Forest": "https://www.fs.usda.gov/lpnf",
  "Ventana Wilderness":         "https://www.ventanawild.org/",
  "Ventana Wilderness Alliance": "https://www.ventanawild.org/",
  "17-Mile Drive":              "https://www.pebblebeach.com/17-mile-drive/",
  "Bixby Creek Bridge":         "https://www.bigsurcalifornia.org/bixby_bridge.html",
  "Point Sur":                  "https://www.pointsur.org/",
  "Monterey Bay National Marine Sanctuary": "https://montereybay.noaa.gov/",

  // ── Conservation ───────────────────────────────────────────────────────────
  "Big Sur Land Trust":         "https://www.bigsurlandtrust.org/",
  "Point Lobos Foundation":     "https://www.ptlobos.org/",
  "Seafood Watch":              "https://www.seafoodwatch.org/",

  // ── Water Activities ───────────────────────────────────────────────────────
  "Monterey Bay Kayaks":        "https://www.montereybaykayaks.com/",
};

// Alias map for fuzzy matching — handles common AI variations
export const BIG_SUR_ALIASES = {
  // Accommodation
  "Post Ranch":                 "Post Ranch Inn",
  "Post Ranch Inn Big Sur":     "Post Ranch Inn",
  "Ventana":                    "Alila Ventana Big Sur",
  "Ventana Big Sur":            "Alila Ventana Big Sur",
  "Alila Ventana":              "Alila Ventana Big Sur",
  "Treebones":                  "Treebones Resort",
  "Glen Oaks":                  "Glen Oaks Big Sur",
  "Big Sur Lodge Pfeiffer":     "Big Sur Lodge",
  "Fernwood":                   "Fernwood Resort",
  "Fernwood Big Sur":           "Fernwood Resort",
  "L'Auberge":                  "L'Auberge Carmel",
  "Auberge Carmel":             "L'Auberge Carmel",
  "Asilomar":                   "Asilomar Conference Grounds",
  "Asilomar Hotel":             "Asilomar Conference Grounds",
  "Asilomar Conference Center": "Asilomar Conference Grounds",
  "Refuge by the Sea":          "Asilomar Conference Grounds",
  "Bernardus Lodge":            "Bernardus Lodge & Spa",
  "Bernardus":                  "Bernardus Lodge & Spa",
  "Bernardus Carmel Valley":    "Bernardus Lodge & Spa",
  "Hyatt Highlands":            "Hyatt Carmel Highlands",
  "Carmel Highlands":           "Hyatt Carmel Highlands",

  // Dining
  "Sierra Mar Restaurant":      "Sierra Mar",
  "Sur House Restaurant":       "Sur House",
  "Big Sur Bakery Restaurant":  "Big Sur Bakery",
  "Big Sur River Inn":          "Big Sur River Inn Restaurant",
  "Fernwood Tavern":            "Fernwood Tavern Bar & Grill",
  "Fernwood Bar":               "Fernwood Tavern Bar & Grill",
  "La Bicyclette Carmel":       "La Bicyclette",
  "Mission Ranch":              "Mission Ranch Restaurant",
  "Coastal Kitchen":            "Coastal Kitchen Monterey",
  "Old Fisherman's":            "Old Fisherman's Grotto",
  "Fisherman's Grotto":         "Old Fisherman's Grotto",
  "Alta":                       "Alta Bakery",

  // Trails
  "McWay Falls":                "McWay Falls Overlook Trail",
  "McWay Falls Overlook":       "McWay Falls Overlook Trail",
  "Partington Cove":            "Partington Cove Trail",
  "Pfeiffer Falls":             "Pfeiffer Falls Trail",
  "Pfeiffer Falls and Valley View": "Pfeiffer Falls Trail",
  "Soberanes Point":            "Soberanes Point Trail",
  "Whale Peak Trail":           "Soberanes Point Trail",
  "Soberanes":                  "Soberanes Point Trail",
  "Andrew Molera Loop":         "Creamery Meadow Loop",
  "Molera Loop":                "Creamery Meadow Loop",
  "Bluffs Panorama Trail":      "Creamery Meadow Loop",
  "Tanbark Tin House":          "Tanbark Trail",
  "Tin House":                  "Tin House Trail",
  "Buzzard's Roost":            "Buzzard's Roost Trail",
  "Buzzards Roost":             "Buzzard's Roost Trail",
  "Cypress Grove":              "Cypress Grove Trail",
  "Cypress Grove Point Lobos":  "Cypress Grove Trail",
  "Bird Island":                "Bird Island Trail",
  "China Cove Trail":           "Bird Island Trail",
  "South Shore Point Lobos":    "South Shore Trail",

  // Wellness
  "Esalen":                     "Esalen Institute",
  "Esalen Baths":               "Esalen Hot Springs",
  "Esalen Springs":             "Esalen Hot Springs",
  "Spa Alila Ventana":          "Spa Alila",
  "Post Ranch Spa Treatments":  "Post Ranch Spa",

  // Culture
  "Henry Miller Library":       "Henry Miller Memorial Library",
  "Miller Library":             "Henry Miller Memorial Library",
  "Robinson Jeffers":           "Tor House",
  "Jeffers Tor House":          "Tor House",
  "Monterey Aquarium":          "Monterey Bay Aquarium",
  "Monarch Grove":              "Pacific Grove Monarch Butterfly Sanctuary",
  "Butterfly Grove":            "Pacific Grove Monarch Butterfly Sanctuary",
  "Cannery Row Monterey":       "Cannery Row",
  "Lovers Point Pacific Grove": "Lovers Point",
  "Lovers Point Park Pacific Grove": "Lovers Point Park",
  "Carmel Mission Church":      "Carmel Mission Basilica",
  "Mission San Carlos":         "Carmel Mission Basilica",

  // Parks
  "Big Sur Coast":              "Big Sur",
  "Pfeiffer Big Sur":           "Pfeiffer Big Sur State Park",
  "Pfeiffer State Park":        "Pfeiffer Big Sur State Park",
  "Julia Pfeiffer":             "Julia Pfeiffer Burns State Park",
  "Julia Pfeiffer Burns":       "Julia Pfeiffer Burns State Park",
  "Andrew Molera":              "Andrew Molera State Park",
  "Molera":                     "Andrew Molera State Park",
  "Garrapata":                  "Garrapata State Park",
  "Point Lobos State Reserve":  "Point Lobos",
  "Point Lobos Reserve":        "Point Lobos",
  "Bixby Bridge":               "Bixby Creek Bridge",
  "Bixby":                      "Bixby Creek Bridge",
  "Point Sur Lighthouse":       "Point Sur",
  "MBNS":                       "Monterey Bay National Marine Sanctuary",

  // Conservation
  "Land Trust":                 "Big Sur Land Trust",
  "Monterey Seafood Watch":     "Seafood Watch",
};

/**
 * Look up a URL by place name. Tries exact match first, then aliases.
 */
export function lookupUrl(name) {
  if (!name) return null;
  const trimmed = name.trim();
  // Exact match
  if (BIG_SUR_URLS[trimmed]) return BIG_SUR_URLS[trimmed];
  // Alias match
  const canonical = BIG_SUR_ALIASES[trimmed];
  if (canonical && BIG_SUR_URLS[canonical]) return BIG_SUR_URLS[canonical];
  // Partial match — check if name contains a known place
  for (const [key, url] of Object.entries(BIG_SUR_URLS)) {
    if (trimmed.toLowerCase().includes(key.toLowerCase()) || key.toLowerCase().includes(trimmed.toLowerCase())) {
      return url;
    }
  }
  return null;
}
