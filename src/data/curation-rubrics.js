// ═══════════════════════════════════════════════════════════════════════════════
// CURATION RUBRICS — "How we choose" copy for each sub-guide section
// ═══════════════════════════════════════════════════════════════════════════════
//
// These rubrics are static across all destinations — they describe Lila's
// curation philosophy, not destination-specific content. Each sub-guide page
// renders the rubric for its section via the HowWeChoose component.
//

export const curationRubrics = {
  eat: {
    heading: "How we choose where to eat",
    criteria: [
      { name: "Place-rooted", body: "The kitchen sources locally and tastes like where it is — not like anywhere else." },
      { name: "Quality without theater", body: "Real care in the cooking, no wellness performance, no \"epic\" energy." },
      { name: "Plant-leaning, not puritanical", body: "Whole foods done well. Room for butter, room for fish." },
      { name: "Independent", body: "Owned by people, not chains. Often the kind of place that's been there a while." },
    ],
  },
  move: {
    heading: "How we choose where to walk",
    criteria: [
      { name: "The reward justifies the visit", body: "Some trails are crowded for good reason. We say so honestly, and tell you when to go." },
      { name: "The land can hold us", body: "We send travelers toward trails built to absorb them, away from places that can't." },
      { name: "The full set spreads the load", body: "Heroes, mid-tier walks, and quieter alternatives — so the guide redistributes attention rather than concentrating it." },
      { name: "Some places we deliberately leave off", body: "The most fragile magic isn't ours to broadcast." },
    ],
  },
  breathe: {
    heading: "How we choose where to practice",
    criteria: [
      { name: "Place-shaped", body: "The space is informed by where it is — desert light, ocean air, mountain quiet. Not dropped in from anywhere." },
      { name: "Lineage-honest", body: "Teachers and traditions named with specificity. Real practice, not wellness aesthetics." },
      { name: "Quiet register", body: "No transformation promised, no hype. The practice trusts you." },
      { name: "Independent", body: "Local teachers, local ownership, or genuinely rooted institutions." },
    ],
  },
  artsCulture: {
    heading: "How we choose what to experience",
    criteria: [
      { name: "Locally and indigenously led", body: "The people whose place this is are the ones telling its story — not interpreting it for outsiders, but living it." },
      { name: "Living, not preserved", body: "Traditions still practiced, music still made, crafts still worked. The past kept alive in the present, not displayed behind glass." },
      { name: "Materially rooted", body: "Artists working with what the land gives — local clay, local wood, local song. The place audible in the work." },
      { name: "Reciprocal", body: "Your visit supports the people and traditions that make it possible." },
    ],
  },
  sleep: {
    heading: "How we choose where to stay",
    criteria: [
      { name: "Place-amplifying", body: "The building, the siting, the materials — part of the destination itself, not just a base for visiting it." },
      { name: "Independent or rooted", body: "Small operators, family-run, design-led, or longtime lodges that have been part of the landscape for decades. Rarely chains." },
      { name: "Quality without theater", body: "Real care, real materials. No performative luxury, no wellness branding without substance." },
      { name: "Stewardship-aware", body: "Properties that take their relationship to the land seriously — solar, water-conscious, dark-sky, working in partnership with local communities." },
    ],
  },
};
