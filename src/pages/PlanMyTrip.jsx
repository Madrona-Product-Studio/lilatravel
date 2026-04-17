import { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { C as BrandC } from '@data/brand';
import { translateFormToApi } from "../services/form-to-api";
import { trackEvent } from '@utils/analytics';
import { safeJson, fetchWithTimeout } from '@utils/fetchHelpers';
import { clearSession } from '@services/sessionManager';
import LilaModal from '@components/LilaModal';
import { Helmet } from 'react-helmet-async';

// ─── Brand Tokens (extended from site brand system) ─────────────────────────
const C = {
  ...BrandC,
  cream:      BrandC.cream,
  creamMid:   "#EDE7DC",
  creamDark:  "#E8DCC8",
  slate:      BrandC.darkInk,
  slateLight: "#2d3d4d",
  sage:       "#6B8078",
  sageDark:   "#4A5A54",
  sageLight:  "#8FA39A",
  skyBlue:    BrandC.skyBlue,
  oceanTeal:  BrandC.oceanTeal,
  sunSalmon:  BrandC.sunSalmon,
  goldenAmber: BrandC.goldenAmber,
  seaGlass:   BrandC.seaGlass,
  coralBlush: "#FFD1C1",
  white:      "#FFFFFF",
};

// ═══════════════════════════════════════════════════════════════════════════════
// ICON SYSTEM — hand-drawn-feel SVGs from four traditions
// Buddhism (ensō, lotus, dharma wheel, bodhi leaf)
// Taoism (yin-yang, water/wave, mountain, bagua)
// Yoga/Hinduism (om, unalome, mudra, bindu/third eye, flame)
// Shinto (torii, magatama, shide)
// ═══════════════════════════════════════════════════════════════════════════════

function Icon({ children, size = 24, color = C.sage, ...props }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
      {...props}>
      {children}
    </svg>
  );
}

// ─── Buddhism ───────────────────────────────────────────────────────────────
function IconEnso({ size, color }) {
  return (
    <Icon size={size} color={color}>
      <path d="M12 3 C17.5 3 21 7 21 12 C21 17 17.5 21 12 21 C6.5 21 3 17 3 12 C3 8.5 5 5.5 8 4" strokeWidth="2" fill="none" />
    </Icon>
  );
}

function IconLotus({ size, color }) {
  return (
    <Icon size={size} color={color}>
      <path d="M12 20 C12 20 8 16 8 12 C8 8 10 5 12 3 C14 5 16 8 16 12 C16 16 12 20 12 20Z" fill={`${color}15`} />
      <path d="M12 20 C12 20 5 15 4 11 C3 7 6 5 8 6" />
      <path d="M12 20 C12 20 19 15 20 11 C21 7 18 5 16 6" />
      <line x1="12" y1="20" x2="12" y2="8" strokeWidth="1" opacity="0.4" />
    </Icon>
  );
}

function IconDharmaWheel({ size, color }) {
  return (
    <Icon size={size} color={color}>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="3" />
      {[0,45,90,135,180,225,270,315].map(a => {
        const rad = a * Math.PI / 180;
        return <line key={a} x1={12 + Math.cos(rad)*3} y1={12 + Math.sin(rad)*3} x2={12 + Math.cos(rad)*9} y2={12 + Math.sin(rad)*9} strokeWidth="1" />;
      })}
    </Icon>
  );
}

function IconShovel({ size, color }) {
  return (
    <Icon size={size} color={color}>
      <line x1="12" y1="3" x2="12" y2="14"/>
      <path d="M9.5 3 Q12 1.5 14.5 3"/>
      <path d="M8 14 L8 18 Q8 21 12 21 Q16 21 16 18 L16 14 Z"/>
      <line x1="8" y1="14" x2="16" y2="14"/>
    </Icon>
  );
}

function IconBodhiLeaf({ size, color }) {
  return (
    <Icon size={size} color={color}>
      <path d="M12 2 C6 6 4 12 6 18 C8 20 10 21 12 22 C14 21 16 20 18 18 C20 12 18 6 12 2Z" fill={`${color}10`} />
      <line x1="12" y1="6" x2="12" y2="22" strokeWidth="1" />
      <path d="M12 10 L8 13" strokeWidth="1" />
      <path d="M12 14 L16 17" strokeWidth="1" />
      <path d="M12 12 L16 10" strokeWidth="1" />
    </Icon>
  );
}

// ─── Taoism ─────────────────────────────────────────────────────────────────
function IconYinYang({ size, color }) {
  return (
    <Icon size={size} color={color}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 3 C8 3 6 6.5 6 8 C6 11 9 12 12 12 C15 12 18 13 18 16 C18 19 15 21 12 21" fill={`${color}20`} />
      <circle cx="12" cy="8" r="1.5" fill={`${color}20`} />
      <circle cx="12" cy="16" r="1.5" fill="none" />
    </Icon>
  );
}

function IconWave({ size, color }) {
  return (
    <Icon size={size} color={color}>
      <path d="M2 12 C4 8 6 8 8 12 C10 16 12 16 14 12 C16 8 18 8 22 12" />
      <path d="M2 16 C4 12 6 12 8 16 C10 20 12 20 14 16" opacity="0.4" />
    </Icon>
  );
}

function IconMountain({ size, color }) {
  return (
    <Icon size={size} color={color}>
      <path d="M3 20 L10 6 L14 13 L17 8 L21 20 Z" fill={`${color}10`} />
      <path d="M3 20 L10 6 L14 13 L17 8 L21 20" />
    </Icon>
  );
}

// ─── Yoga / Hinduism ────────────────────────────────────────────────────────
function IconUnalome({ size, color }) {
  return (
    <Icon size={size} color={color}>
      <path d="M12 22 L12 10" />
      <path d="M12 10 C12 10 15 9 15 7 C15 5 12 5 12 7 C12 5 9 5 9 7 C9 9 12 8 12 7" strokeWidth="1.3" />
      <circle cx="12" cy="3" r="1" fill={color} stroke="none" />
    </Icon>
  );
}

function IconFlame({ size, color }) {
  return (
    <Icon size={size} color={color}>
      <path d="M12 2 C12 2 18 8 18 14 C18 17.3 15.3 20 12 20 C8.7 20 6 17.3 6 14 C6 8 12 2 12 2Z" fill={`${color}12`} />
      <path d="M12 10 C12 10 15 13 15 15.5 C15 17.4 13.6 19 12 19 C10.4 19 9 17.4 9 15.5 C9 13 12 10 12 10Z" fill={`${color}08`} />
    </Icon>
  );
}

function IconMudra({ size, color }) {
  return (
    <Icon size={size} color={color}>
      <circle cx="12" cy="8" r="4" fill={`${color}08`} />
      <path d="M8 12 C8 12 6 15 8 18" />
      <path d="M16 12 C16 12 18 15 16 18" />
      <path d="M10 18 L14 18" />
      <circle cx="12" cy="7" r="0.8" fill={color} stroke="none" />
    </Icon>
  );
}

function IconSinglePaddle({ size, color }) {
  return (
    <Icon size={size} color={color}>
      <line x1="12" y1="3" x2="12" y2="21"/>
      <path d="M12 13 C9 15 8 19 12 21 C16 19 15 15 12 13Z"/>
      <line x1="9.5" y1="3" x2="14.5" y2="3"/>
    </Icon>
  );
}

function IconForkKnife({ size, color }) {
  return (
    <Icon size={size} color={color}>
      <line x1="9" y1="21" x2="9" y2="11"/>
      <path d="M7 3 L7 7 Q7 11 9 11 Q11 11 11 7 L11 3"/>
      <line x1="9" y1="3" x2="9" y2="7"/>
      <path d="M15 3 C17 3 17 5 17 8 L17 21"/>
      <path d="M15 3 L15 8 Q15 11 17 11"/>
    </Icon>
  );
}

// ─── Shinto ─────────────────────────────────────────────────────────────────
function IconTorii({ size, color }) {
  return (
    <Icon size={size} color={color}>
      <line x1="5" y1="6" x2="19" y2="6" strokeWidth="2" />
      <line x1="6" y1="10" x2="18" y2="10" />
      <line x1="7" y1="6" x2="7" y2="21" />
      <line x1="17" y1="6" x2="17" y2="21" />
      <line x1="3" y1="5" x2="21" y2="5" strokeWidth="1" />
    </Icon>
  );
}

function IconMagatama({ size, color }) {
  return (
    <Icon size={size} color={color}>
      <path d="M12 3 C7 3 4 7 4 11 C4 15 7 17 10 17 C13 17 14 15 14 13 C14 11 12 10 10 11" fill={`${color}12`} />
      <circle cx="9" cy="8" r="1.5" fill={`${color}25`} />
    </Icon>
  );
}

function IconBoxBreath({ size, color }) {
  return (
    <Icon size={size} color={color}>
      <rect x="5" y="7" width="14" height="14" rx="1.5"/>
      <circle cx="12" cy="7" r="2" fill={color} stroke="none"/>
    </Icon>
  );
}

// ─── Person (Solo traveler) ─────────────────────────────────────────────────
function IconPerson({ size, color }) {
  return (
    <Icon size={size} color={color}>
      <circle cx="12" cy="7" r="3" fill={`${color}15`} />
      <path d="M7 21 C7 16.5 9 14 12 14 C15 14 17 16.5 17 21" fill={`${color}08`} />
    </Icon>
  );
}

// ─── Compound: Stars ────────────────────────────────────────────────────────
function IconStars({ size, color }) {
  return (
    <Icon size={size} color={color}>
      <path d="M18 12 C18 7 13 3 8 5 C12 5 15 8 15 12 C15 16 12 19 8 19 C13 21 18 17 18 12Z" fill={`${color}10`} />
      <path d="M4 5 L4.8 3 L5.6 5" />
      <path d="M3 9 L3.5 8 L4 9" />
      <path d="M6 3 L6.4 2 L6.8 3" />
    </Icon>
  );
}

function IconJournal({ size, color }) {
  return (
    <Icon size={size} color={color}>
      <rect x="5" y="3" width="14" height="18" rx="2" fill={`${color}08`} />
      <line x1="9" y1="3" x2="9" y2="21" strokeWidth="1" opacity="0.3" />
      <line x1="11" y1="8" x2="16" y2="8" strokeWidth="1" />
      <line x1="11" y1="11" x2="16" y2="11" strokeWidth="1" />
      <line x1="11" y1="14" x2="14" y2="14" strokeWidth="1" />
    </Icon>
  );
}

function IconMassage({ size, color }) {
  return (
    <Icon size={size} color={color}>
      <path d="M6 14 C6 10 9 7 12 7 C15 7 18 10 18 14" fill={`${color}08`} />
      <path d="M4 16 C5 12 8 9 12 9 C16 9 19 12 20 16" />
      <path d="M4 16 C4 18 6 19 8 18" />
      <path d="M20 16 C20 18 18 19 16 18" />
    </Icon>
  );
}

function IconSoundBath({ size, color }) {
  return (
    <Icon size={size} color={color}>
      <path d="M4 16 C4 16 8 4 12 4 C16 4 20 16 20 16" fill={`${color}10`} />
      <path d="M4 16 L20 16" />
      <path d="M7 16 L7 19" strokeWidth="1" opacity="0.4" />
      <path d="M12 16 L12 20" strokeWidth="1" opacity="0.4" />
      <path d="M17 16 L17 19" strokeWidth="1" opacity="0.4" />
    </Icon>
  );
}

function IconBike({ size, color }) {
  return (
    <Icon size={size} color={color}>
      <circle cx="7" cy="16" r="3.5" />
      <circle cx="17" cy="16" r="3.5" />
      <path d="M7 16 L10 8 L14 8" />
      <path d="M14 8 L17 16 L12 16 L10 8" />
    </Icon>
  );
}

function IconBird({ size, color }) {
  return (
    <Icon size={size} color={color}>
      <path d="M3 14 C6 8 10 6 14 8 C16 9 18 8 21 6" />
      <path d="M14 8 C12 11 10 13 3 14" fill={`${color}10`} />
      <path d="M14 8 L16 12" />
    </Icon>
  );
}

function IconMusic({ size, color }) {
  return (
    <Icon size={size} color={color}>
      <path d="M9 18 L9 6 L19 4 L19 16" />
      <circle cx="6.5" cy="18" r="2.5" fill={`${color}10`} />
      <circle cx="16.5" cy="16" r="2.5" fill={`${color}10`} />
    </Icon>
  );
}

function IconPaw({ size, color }) {
  return (
    <Icon size={size} color={color}>
      <ellipse cx="12" cy="15" rx="4" ry="3.5" fill={`${color}10`} />
      <circle cx="7.5" cy="10" r="1.8" fill={`${color}10`} />
      <circle cx="10.5" cy="7.5" r="1.8" fill={`${color}10`} />
      <circle cx="13.5" cy="7.5" r="1.8" fill={`${color}10`} />
      <circle cx="16.5" cy="10" r="1.8" fill={`${color}10`} />
    </Icon>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// STEP DATA
// ═══════════════════════════════════════════════════════════════════════════════

const DESTINATIONS = [
  { id: "zion", name: "Zion", subtitle: "Red cathedral walls", icon: IconMountain, color: C.sunSalmon, gradient: `linear-gradient(135deg, ${C.sunSalmon}30, ${C.goldenAmber}20)` },
  { id: "joshuaTree", name: "Joshua Tree", subtitle: "Desert silence & starlight", icon: IconStars, color: C.goldenAmber, gradient: `linear-gradient(135deg, ${C.goldenAmber}30, ${C.coralBlush}20)` },
  { id: "bigSur", name: "Big Sur", subtitle: "Mountains meet the sea", icon: IconWave, color: C.oceanTeal, gradient: `linear-gradient(135deg, ${C.oceanTeal}30, ${C.skyBlue}20)` },
  { id: "olympic", name: "Olympic", subtitle: "Temperate rainforest magic", icon: IconBodhiLeaf, color: C.seaGlass, gradient: `linear-gradient(135deg, ${C.seaGlass}30, ${C.sage}20)` },
  { id: "kauai", name: "Kauaʻi", subtitle: "Garden isle, sacred coast", icon: IconLotus, color: C.oceanTeal, gradient: `linear-gradient(135deg, ${C.seaGlass}20, ${C.oceanTeal}30)` },
  { id: "vancouver", name: "Vancouver Island", subtitle: "Wild coast, ancient forest", icon: IconTorii, color: C.sage, gradient: `linear-gradient(135deg, ${C.sage}25, ${C.seaGlass}20)` },
];

const INTENTIONS = [
  { id: "reconnect", label: "Reconnect", desc: "Remember you're part of something bigger.", icon: IconEnso, color: C.oceanTeal },
  { id: "tune_in", label: "Tune In", desc: "Get quiet enough to hear yourself again.", icon: IconLotus, color: C.skyBlue },
  { id: "slow_down", label: "Slow Down", desc: "Give yourself permission to stop rushing.", icon: IconWave, color: C.seaGlass },
  { id: "light_up", label: "Light Up", desc: "Chase the moments that make you feel alive.", icon: IconFlame, color: C.sunSalmon },
];


const PRACTICES = [
  { id: "yoga",         label: "Yoga",           icon: IconLotus,       color: C.oceanTeal },
  { id: "breathwork",   label: "Breathwork",     icon: IconBoxBreath,   color: C.skyBlue },
  { id: "coldPlunge",   label: "Cold Plunge",    icon: IconWave,        color: C.seaGlass },
  { id: "meditation",   label: "Meditation",     icon: IconEnso,        color: C.sage },
  { id: "hiking",       label: "Hiking",         icon: IconMountain,    color: C.goldenAmber },
  { id: "stargazing",   label: "Stargazing",     icon: IconStars,       color: C.slateLight },
  { id: "stewardship",  label: "Stewardship",    icon: IconShovel,      color: C.seaGlass },
  { id: "spa",          label: "Spa & Massage",  icon: IconSoundBath,   color: C.sageLight },
  { id: "sauna",        label: "Sauna",          icon: IconFlame,       color: C.sunSalmon },
  { id: "biking",       label: "Biking",         icon: IconBike,        color: C.skyBlue },
  { id: "nativeCulture",label: "Native Culture", icon: IconTorii,       color: C.sage },
  { id: "wildlife",     label: "Wildlife",       icon: IconPaw,         color: C.goldenAmber },
  { id: "hotSprings",   label: "Hot Springs",    icon: IconWave,        color: C.oceanTeal },
  { id: "paddling",     label: "Paddling",       icon: IconSinglePaddle, color: C.skyBlue },
  { id: "farmToTable",  label: "Farm to Table",  icon: IconForkKnife,   color: C.goldenAmber },
  { id: "musicAndArts", label: "Music & Arts",   icon: IconMusic,       color: C.sunSalmon },
];

const BUDGET_TIERS = [
  { id: "mindful", label: "Mindful", desc: "Smart & intentional", range: "$", color: C.sage },
  { id: "balanced", label: "Balanced", desc: "Comfort meets experience", range: "$$", color: C.oceanTeal },
  { id: "premium", label: "Premium", desc: "Elevated at every turn", range: "$$$", color: C.goldenAmber },
  { id: "noLimits", label: "No Limits", desc: "The extraordinary", range: "$$$$", color: C.sunSalmon },
];

const STAY_STYLES = [
  { id: "elemental", label: "Elemental", desc: "Camping, glamping, under the stars — immersed in the landscape", icon: IconBodhiLeaf, color: C.goldenAmber },
  { id: "rooted",    label: "Rooted",    desc: "Boutique lodges, locally-owned inns — comfortable and connected", icon: IconTorii, color: C.oceanTeal },
  { id: "premium",   label: "Premium",   desc: "Design properties, luxury resorts — elevated experiences", icon: IconLotus, color: C.sunSalmon },
];

const GROUP_TYPES = [
  { id: "solo",    label: "Solo",    desc: "Just me",               icon: IconPerson,      color: C.oceanTeal },
  { id: "couple",  label: "Couple",  desc: "Two of us",             icon: IconYinYang,     color: C.sunSalmon },
  { id: "friends", label: "Friends", desc: "A group trip",          icon: IconDharmaWheel, color: C.goldenAmber },
  { id: "family",  label: "Family",  desc: "With kids or family",   icon: IconBodhiLeaf,   color: C.seaGlass },
];

const MONTHS = [
  { id: 'january',   label: 'January',   window: 'The Longest Shadow',   color: '#8BA4B8' },
  { id: 'february',  label: 'February',  window: 'Quiet Awakening',      color: '#9BAFBF' },
  { id: 'march',     label: 'March',     window: 'Spring Equinox',       color: '#8FA39A' },
  { id: 'april',     label: 'April',     window: 'Desert Bloom',         color: '#A8C5A0' },
  { id: 'may',       label: 'May',       window: 'Last Comfortable',     color: '#C5D4A0' },
  { id: 'june',      label: 'June',      window: 'Solstice Fire',        color: '#E8C07A' },
  { id: 'july',      label: 'July',      window: 'Monsoon Drama',        color: '#E8A860' },
  { id: 'august',    label: 'August',    window: 'Desert After Rain',    color: '#D4956A' },
  { id: 'september', label: 'September', window: 'The Golden Corridor',  color: '#D4855A' },
  { id: 'october',   label: 'October',   window: 'Peak Fall Color',      color: '#C47A52' },
  { id: 'november',  label: 'November',  window: 'Quiet Descent',        color: '#A08070' },
  { id: 'december',  label: 'December',  window: 'Winter Solstice',      color: '#7A8A9A' },
];

const DESTINATION_WINDOWS = {
  zion: {
    january: 'The Longest Shadow', february: 'Quiet Awakening',
    march: 'Spring Equinox', april: 'Desert Bloom',
    may: 'Last Comfortable', june: 'Solstice Fire',
    july: 'Monsoon Drama', august: 'Desert After Rain',
    september: 'The Golden Corridor', october: 'Peak Fall Color',
    november: 'Quiet Descent', december: 'Winter Solstice',
  },
  joshuaTree: {
    january: 'Cool Desert Calm', february: 'Early Wildflowers',
    march: 'Spring Bloom', april: 'Peak Wildflower',
    may: 'Last Cool Window', june: 'Solstice Starlight',
    july: 'Furnace Quiet', august: 'Perseid Meteor Shower',
    september: 'Heat Breaks', october: 'Desert Autumn',
    november: 'Stargazing Season', december: 'Winter Solstice Dark Sky',
  },
  bigSur: {
    january: 'Storm & Whale Watch', february: 'Monarch Twilight',
    march: 'Spring Green', april: 'Coastal Wildflower',
    may: 'Fog Lifts', june: 'Longest Light',
    july: 'Summer Fog', august: 'Perseid Coast',
    september: 'Fog Clears', october: 'Warm & Quiet',
    november: 'Autumn Gold', december: 'Gray Whale Return',
  },
  olympic: {
    january: 'Deep Rainforest', february: 'Quiet Canopy',
    march: 'Gray Whale Migration', april: 'Wildflower Ridge',
    may: 'Spring Unfurling', june: 'Longest Day',
    july: 'Alpine Access', august: 'Peak Summer',
    september: 'Elk Rut Season', october: 'Peak Fall Color',
    november: 'Storm Season Begins', december: 'Winter Rainforest',
  },
  kauai: {
    january: 'Whale Season', february: 'North Shore Swells',
    march: 'Peak Whale Watch', april: 'Kalalau Window',
    may: 'Trade Wind Season', june: 'Calm North Shore',
    july: 'Milky Way Season', august: 'Warm & Dry',
    september: 'Least Crowded', october: 'Quiet Season',
    november: 'Makahiki Begins', december: 'Humpback Return',
  },
  vancouver: {
    january: 'Peak Storm Watch', february: 'Storm & Surf',
    march: 'Gray Whale Migration', april: 'Whale Watch Peak',
    may: 'Trail Season Opens', june: 'Long Light',
    july: 'Peak Summer', august: 'Warmest Window',
    september: 'Swell Season', october: 'Storm Season Begins',
    november: 'Storm Watch Season', december: 'Deep Winter Storm',
  },
};

const DIMENSIONS = [
  { key: "movement", label: "Movement" },
  { key: "wellness", label: "Wellness" },
  { key: "adventure", label: "Adventure" },
  { key: "stillness", label: "Stillness" },
  { key: "social", label: "Connection" },
  { key: "luxury", label: "Luxury" },
];

// ─── Persona Engine ─────────────────────────────────────────────────────────
const PERSONAS = [
  {
    id: "sadhaka", name: "The Sādhaka", subtitle: "The Practitioner",
    desc: "Your journey is an extension of your practice. You're drawn to sacred spaces, intentional movement, and the kind of silence that teaches. We'll build your trip around the mat, the cushion, and the trail.",
    color: C.oceanTeal, icon: IconEnso,
    match: (d) => {
      const pl = d.practiceLevel ?? 1;
      const seeksStillness = (d.intentions || []).some(i => ["tune_in","slow_down"].includes(i));
      return (pl >= 3 && seeksStillness) ? 1 : (pl >= 2 && seeksStillness) ? 0.7 : (pl >= 3) ? 0.6 : 0;
    },
  },
  {
    id: "tapasvin", name: "The Tāpasvin", subtitle: "The One Who Burns",
    desc: "You came to be challenged. Cold water, high ridgelines, dawn summits — you light up when you're pushed to your edge. We'll take you there and give you the space to integrate what you find.",
    color: C.sunSalmon, icon: IconFlame,
    match: (d) => {
      const movement = d.movement ?? 50;
      const seeksLightUp = (d.intentions || []).includes("light_up");
      const highPractice = (d.practiceLevel ?? 1) >= 2;
      return (movement > 65 && seeksLightUp) ? 1 : (movement > 60 && highPractice) ? 0.7 : (movement > 70) ? 0.5 : 0;
    },
  },
  {
    id: "lilaPlayer", name: "The Līlā Player", subtitle: "The One Who Dances",
    desc: "You travel with an open hand. No rigid plans — just a willingness to be surprised. You're here for the beauty, the flavor, the spontaneous conversation with a stranger. We'll create a journey that feels like play.",
    color: C.goldenAmber, icon: IconEnso,
    match: (d) => {
      const pacing = d.pacing ?? 50;
      const balanced = pacing > 30 && pacing < 70;
      const seeksReconnect = (d.intentions || []).includes("reconnect");
      const moderate = (d.movement ?? 50) > 30 && (d.movement ?? 50) < 70;
      return (balanced && moderate) ? 0.8 : (seeksReconnect && balanced) ? 0.7 : 0;
    },
  },
  {
    id: "rishi", name: "The Ṛṣi", subtitle: "The Seer",
    desc: "You need wide horizons and quiet mornings. Books, views, long walks with no destination. You're not escaping — you're creating the conditions to see clearly. We'll give you the space and the stillness.",
    color: C.skyBlue, icon: IconMountain,
    match: (d) => {
      const slowPace = (d.pacing ?? 50) < 40;
      const seeksStillness = (d.intentions || []).some(i => ["tune_in","slow_down"].includes(i));
      const deepPractice = (d.practiceLevel ?? 1) >= 2;
      return (slowPace && seeksStillness) ? 1 : (slowPace && deepPractice) ? 0.8 : seeksStillness ? 0.5 : 0;
    },
  },
  {
    id: "explorer", name: "The Explorer", subtitle: "The Trailblazer",
    desc: "You want to see it all. The iconic overlook AND the hidden swimming hole. High energy, full days, a new adventure every morning. We'll pack your itinerary with the best of both worlds.",
    color: C.seaGlass, icon: IconTorii,
    match: (d) => {
      const fullPace = (d.pacing ?? 50) > 60;
      const active = (d.movement ?? 50) > 55;
      const seeksLightUp = (d.intentions || []).includes("light_up");
      return (fullPace && active) ? 0.9 : (active && seeksLightUp) ? 0.6 : 0;
    },
  },
];

function getPersona(data) {
  let best = PERSONAS[2];
  let bestScore = 0;
  for (const p of PERSONAS) {
    const score = p.match(data);
    if (score > bestScore) { bestScore = score; best = p; }
  }
  return best;
}

// ─── Utilities ───────────────────────────────────────────────────────────────
function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }

// ─── Sub-Components ──────────────────────────────────────────────────────────

function StepIndicator({ current, total }) {
  return (
    <div className="flex gap-1.5 justify-center mb-8 px-6">
      {Array.from({ length: total }, (_, i) => (
        <div key={i} style={{
          /* dynamic */
          width: i === current ? 28 : 8, height: 8, borderRadius: 4,
          background: i === current ? C.oceanTeal : i < current ? C.sage : `${C.sage}30`,
          transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
        }} />
      ))}
    </div>
  );
}

function NavButtons({ onBack, onNext, nextLabel = "Continue", nextDisabled = false, showBack = true, topPadding }) {
  return (
    <div className="flex gap-3 justify-center" style={{ padding: `${topPadding ?? 40}px 24px` }}>
      {showBack && (
        <button onClick={onBack} className="font-body text-[14px] font-semibold tracking-[0.12em] uppercase bg-none cursor-pointer transition-all duration-300 min-h-[48px]" style={{
          border: `1.5px solid ${C.sage}40`,
          color: C.sage, padding: "14px 28px", borderRadius: 40,
        }}>Back</button>
      )}
      <button onClick={onNext} disabled={nextDisabled} className="font-body text-[14px] font-semibold tracking-[0.12em] uppercase border-none transition-all duration-300 min-h-[48px]" style={{
        /* dynamic */
        background: nextDisabled ? `${C.oceanTeal}30` : C.oceanTeal,
        color: C.white, padding: "14px 36px", borderRadius: 40,
        cursor: nextDisabled ? "not-allowed" : "pointer",
        opacity: nextDisabled ? 0.5 : 1,
        boxShadow: nextDisabled ? "none" : `0 4px 20px ${C.oceanTeal}30`,
      }}>{nextLabel}</button>
    </div>
  );
}

function StepTitle({ eyebrow, title, subtitle }) {
  return (
    <div className="text-center mb-8 px-6">
      {eyebrow && (
        <span className="font-body text-[12px] font-bold tracking-[0.3em] uppercase block mb-3.5 text-ocean-teal">{eyebrow}</span>
      )}
      <h2 className="font-serif text-[clamp(28px,6vw,36px)] font-light leading-[1.2] text-dark-ink" style={{
        marginBottom: subtitle ? 12 : 0,
      }}>{title}</h2>
      {subtitle && (
        <p className="font-body text-[clamp(14px,3.5vw,15px)] font-normal leading-[1.6] max-w-[480px] mx-auto" style={{
          color: `${C.slate}BB`,
        }}>{subtitle}</p>
      )}
    </div>
  );
}

// ─── Radar Chart ─────────────────────────────────────────────────────────────
function RadarChart({ values, size = 260 }) {
  const pad = 24;
  const cx = size / 2 + pad, cy = size / 2 + pad, r = size * 0.36;
  const n = DIMENSIONS.length;
  const angleStep = (Math.PI * 2) / n;
  const [animProgress, setAnimProgress] = useState(0);

  useEffect(() => {
    setAnimProgress(0);
    let start = null;
    const duration = 1200;
    function frame(ts) {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      setAnimProgress(easeOutCubic(p));
      if (p < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }, [values]);

  const getPoint = (i, val) => {
    const angle = angleStep * i - Math.PI / 2;
    const dist = r * val * animProgress;
    return { x: cx + Math.cos(angle) * dist, y: cy + Math.sin(angle) * dist };
  };

  const gridLevels = [0.25, 0.5, 0.75, 1];
  const colors = [C.oceanTeal, C.skyBlue, C.sunSalmon, C.goldenAmber, C.seaGlass, C.sage];

  return (
    <svg width="100%" viewBox={`0 0 ${size + pad * 2} ${size + pad * 2}`} style={{ maxWidth: size + pad * 2 }}>
      {gridLevels.map((level, li) => (
        <polygon key={li}
          points={Array.from({ length: n }, (_, i) => {
            const angle = angleStep * i - Math.PI / 2;
            return `${cx + Math.cos(angle) * r * level},${cy + Math.sin(angle) * r * level}`;
          }).join(" ")}
          fill="none" stroke={`${C.sage}18`} strokeWidth={1}
        />
      ))}
      {Array.from({ length: n }, (_, i) => {
        const angle = angleStep * i - Math.PI / 2;
        return <line key={i} x1={cx} y1={cy} x2={cx + Math.cos(angle) * r} y2={cy + Math.sin(angle) * r} stroke={`${C.sage}15`} strokeWidth={1} />;
      })}
      <polygon
        points={Array.from({ length: n }, (_, i) => {
          const p = getPoint(i, values[DIMENSIONS[i].key] || 0);
          return `${p.x},${p.y}`;
        }).join(" ")}
        fill={`${C.oceanTeal}18`} stroke={C.oceanTeal} strokeWidth={2}
      />
      {DIMENSIONS.map((dim, i) => {
        const p = getPoint(i, values[dim.key] || 0);
        return (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r={5} fill={colors[i]} stroke={C.white} strokeWidth={2} />
            <text x={cx + Math.cos(angleStep * i - Math.PI / 2) * (r + 20)} y={cy + Math.sin(angleStep * i - Math.PI / 2) * (r + 20)}
              textAnchor="middle" dominantBaseline="middle"
              style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 10, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", fill: C.sage }}
            >{dim.label}</text>
          </g>
        );
      })}
    </svg>
  );
}

// ─── Additional Welcome Screen Icons ────────────────────────────────────────
function IconSunRays({ size, color }) {
  return (
    <Icon size={size} color={color}>
      <circle cx="12" cy="12" r="4" fill={`${color}10`} />
      {[0, 45, 90, 135, 180, 225, 270, 315].map(a => {
        const rad = a * Math.PI / 180;
        return <line key={a} x1={12 + Math.cos(rad) * 6} y1={12 + Math.sin(rad) * 6} x2={12 + Math.cos(rad) * 9} y2={12 + Math.sin(rad) * 9} strokeWidth="1.5" />;
      })}
    </Icon>
  );
}

function IconRefresh({ size, color }) {
  return (
    <Icon size={size} color={color}>
      <path d="M4 12 A8 8 0 0 1 20 12" />
      <path d="M20 12 A8 8 0 0 1 4 12" />
      <polyline points="4,8 4,12 8,12" />
      <polyline points="20,16 20,12 16,12" />
    </Icon>
  );
}

function IconCalendar({ size, color }) {
  return (
    <Icon size={size} color={color}>
      <rect x="4" y="5" width="16" height="16" rx="1" fill={`${color}08`} />
      <line x1="4" y1="10" x2="20" y2="10" />
      <line x1="8" y1="3" x2="8" y2="7" />
      <line x1="16" y1="3" x2="16" y2="7" />
    </Icon>
  );
}

function IconShare({ size, color }) {
  return (
    <Icon size={size} color={color}>
      <circle cx="6" cy="12" r="2.5" fill={`${color}10`} />
      <circle cx="18" cy="6" r="2.5" fill={`${color}10`} />
      <circle cx="18" cy="18" r="2.5" fill={`${color}10`} />
      <line x1="8.2" y1="10.8" x2="15.8" y2="7.2" />
      <line x1="8.2" y1="13.2" x2="15.8" y2="16.8" />
    </Icon>
  );
}

function IconBolt({ size, color }) {
  return (
    <Icon size={size} color={color}>
      <path d="M13 2 L5 14 L11 14 L11 22 L19 10 L13 10 Z" fill={`${color}10`} />
    </Icon>
  );
}

function IconChevronDown({ size, color }) {
  return (
    <Icon size={size} color={color}>
      <polyline points="6,9 12,15 18,9" />
    </Icon>
  );
}

function IconClose({ size, color }) {
  return (
    <Icon size={size} color={color}>
      <line x1="6" y1="6" x2="18" y2="18" />
      <line x1="18" y1="6" x2="6" y2="18" />
    </Icon>
  );
}

// ─── Data Sources Config ────────────────────────────────────────────────────
const DATA_SOURCES = [
  { name: "National Park Service", desc: "Live trail alerts, closures, campground availability, and events", color: C.seaGlass },
  { name: "Open-Meteo", desc: "Real-time weather forecasts, sunrise/sunset times, seasonal patterns", color: C.skyBlue },
  { name: "Lunar & celestial calendar", desc: "Moon phase and rise/set, Milky Way windows, golden hour", color: C.goldenAmber },
  { name: "Astronomy API", desc: "Planet positions, meteor shower calendars, Bortle dark sky ratings", color: C.slateLight },
  { name: "NOAA Tides & Currents", desc: "Tide predictions for coastal destinations — Big Sur, Olympic, Kauaʻi", color: C.oceanTeal },
  { name: "USGS Water Services", desc: "River flow and water temp — live conditions for Zion's Virgin River", color: C.sunSalmon },
  { name: "Google Places", desc: "Curated local restaurants, lodging, and experiences with live hours", color: C.sage },
  { name: "iNaturalist", desc: "Wildlife sighting data — species spotted near your destination", color: C.seaGlass },
  { name: "30 wisdom practices", desc: "Yoga, Buddhism, Taoism, Shinto, Stoicism — woven in as quiet cues", color: C.goldenAmber },
];

const SCROLLING_SOURCES = ["NPS", "Weather", "Tides", "River data", "Google Places", "Wildlife", "Astronomy"];

// ═══════════════════════════════════════════════════════════════════════════════
// STEPS
// ═══════════════════════════════════════════════════════════════════════════════

function StepWelcome({ onNext }) {
  const [visible, setVisible] = useState(false);
  const [sourcesOpen, setSourcesOpen] = useState(false);
  useEffect(() => { setTimeout(() => setVisible(true), 100); }, []);

  const sectionStyle = (delay) => ({
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0)" : "translateY(16px)",
    transition: "all 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
    transitionDelay: visible ? `${delay}ms` : "0ms",
  });

  return (
    <div className="flex flex-col min-h-screen" style={{ background: C.cream }}>
      {/* Full-page content wrapper — hero stretches, bottom anchored */}
      <div className="flex-1 flex flex-col justify-center" style={{ padding: "72px 0 0" }}>
        {/* Hero */}
        <div className="flex flex-col items-center text-center" style={{
          padding: "0 28px 24px",
          ...sectionStyle(0),
        }}>
          <div className="mb-3" style={{ opacity: 0.35 }}>
            <IconEnso size={24} color={C.sage} />
          </div>
          <h1 className="font-serif font-light leading-[1.15] text-dark-ink" style={{
            fontSize: "clamp(32px, 8vw, 44px)",
            margin: "0 0 16px",
          }}>
            Some trips change you.<br />Let's design one of those.
          </h1>
          <p className="font-body font-normal leading-[1.65] mx-auto" style={{
            fontSize: "clamp(13px, 3.5vw, 15px)",
            color: `${C.slate}99`,
            maxWidth: 380,
            margin: "0 0 22px",
          }}>
            Tell us how you want to feel. Live wilderness data, celestial timing, and 30 wisdom practices come together in one itinerary shaped around you — and it stays alive as your trip takes shape.
          </p>
          <button onClick={onNext} className="font-body text-[13px] font-bold tracking-[0.12em] uppercase cursor-pointer" style={{
            background: "none",
            color: C.oceanTeal,
            border: `1.5px solid ${C.oceanTeal}`,
            borderRadius: 2,
            padding: "13px 36px",
          }}>
            Design Your Trip →
          </button>
        </div>
      </div>

      {/* Bottom content — constrained width, anchored to bottom */}
      <div className="mx-auto w-full" style={{ maxWidth: 640, padding: "0 24px" }}>
        {/* Four-feature strip */}
        <div style={sectionStyle(150)}>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
          }}>
            {[
              { icon: IconMountain, color: C.oceanTeal, label: "Day-by-day arc", desc: "Morning to evening, shaped to your pace" },
              { icon: IconSunRays, color: C.goldenAmber, label: "Celestial timing", desc: "Moon phase, Milky Way, golden hour" },
              { icon: IconYinYang, color: C.sage, label: "Woven practices", desc: "30 practices across five traditions" },
              { icon: IconStars, color: C.goldenAmber, label: "Your archetype", desc: "Five traveler profiles shape every call" },
            ].map((f, i) => {
              const Ic = f.icon;
              return (
                <div key={f.label} style={{
                  padding: "12px 8px",
                  textAlign: "center",
                  borderLeft: i > 0 ? `1px solid ${C.sage}18` : "none",
                }}>
                  <div className="flex justify-center mb-2">
                    <Ic size={20} color={f.color} />
                  </div>
                  <div className="font-body font-bold tracking-[0.06em] uppercase" style={{
                    fontSize: 11,
                    color: C.slate,
                    marginBottom: 4,
                  }}>{f.label}</div>
                  <div className="font-body font-normal leading-[1.45]" style={{
                    fontSize: 11,
                    color: `${C.slate}88`,
                  }}>{f.desc}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Living itinerary strip */}
        <div style={{
          paddingTop: 8,
          ...sectionStyle(300),
        }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
          }}>
            {[
              { icon: IconRefresh, label: "Refine", desc: "Regenerates around your feedback" },
              { icon: IconCalendar, label: "Add logistics", desc: "Rewrites around your hard dates" },
              { icon: IconShare, label: "Share", desc: "Send a link for others to view" },
            ].map((f, i) => {
              const Ic = f.icon;
              return (
                <div key={f.label} style={{
                  padding: "10px 8px",
                  textAlign: "center",
                  borderLeft: i > 0 ? `1px solid ${C.sage}18` : "none",
                }}>
                  <div className="flex justify-center mb-1.5">
                    <Ic size={16} color={C.sage} />
                  </div>
                  <div className="font-body font-bold tracking-[0.06em] uppercase" style={{
                    fontSize: 11,
                    color: C.slate,
                    marginBottom: 4,
                  }}>{f.label}</div>
                  <div className="font-body font-normal leading-[1.45]" style={{
                    fontSize: 11,
                    color: `${C.slate}88`,
                  }}>{f.desc}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Powered by row */}
        <div style={{ paddingTop: 24, ...sectionStyle(450) }}>
          <button
            onClick={() => setSourcesOpen(true)}
            className="flex items-center cursor-pointer w-full"
            style={{
              padding: "10px 0",
              background: "none",
              border: "none",
              borderTop: `1px solid ${C.sage}15`,
            }}
          >
            <IconBolt size={14} color={C.goldenAmber} />
            <span className="font-body text-[11px] font-bold tracking-[0.15em] uppercase shrink-0" style={{
              color: C.goldenAmber,
              marginLeft: 6,
              marginRight: 10,
            }}>Powered by</span>
            <div className="flex-1 overflow-hidden" style={{ position: "relative" }}>
              <div className="flex gap-4" style={{
                animation: "welcomeScroll 14s linear infinite",
                whiteSpace: "nowrap",
              }}>
                {[...SCROLLING_SOURCES, ...SCROLLING_SOURCES].map((s, i) => (
                  <span key={i} className="font-body text-[12px] font-normal" style={{
                    color: `${C.slate}66`,
                  }}>{s}</span>
                ))}
              </div>
            </div>
            <IconChevronDown size={14} color={`${C.sage}66`} />
          </button>
        </div>
        <style>{`
          @keyframes welcomeScroll {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
        `}</style>

        {/* Bottom spacer */}
        <div style={{ height: 28, ...sectionStyle(600) }} />
      </div>

      {/* Data sources modal */}
      {sourcesOpen && (
        <div
          onClick={() => setSourcesOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            background: `${C.slate}66`,
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: C.cream,
              borderRadius: 0,
              maxHeight: "80vh",
              overflowY: "auto",
              padding: "28px 20px 36px",
              animation: "sheetSlideUp 0.3s ease-out",
            }}
          >
            <div className="flex items-start justify-between" style={{ marginBottom: 20 }}>
              <div>
                <div className="font-body text-[10px] font-bold tracking-[0.2em] uppercase" style={{
                  color: `${C.sage}99`,
                  marginBottom: 6,
                }}>What powers your trip</div>
                <h2 className="font-serif font-light text-dark-ink" style={{
                  fontSize: "clamp(22px, 5vw, 28px)",
                  margin: 0,
                  lineHeight: 1.2,
                }}>Live data sources</h2>
              </div>
              <button onClick={() => setSourcesOpen(false)} className="cursor-pointer" style={{
                background: "none",
                border: "none",
                padding: 4,
                marginTop: -4,
              }}>
                <IconClose size={20} color={C.sage} />
              </button>
            </div>
            <div className="flex flex-col" style={{ gap: 16 }}>
              {DATA_SOURCES.map((src) => (
                <div key={src.name} className="flex items-start" style={{ gap: 12 }}>
                  <span className="shrink-0" style={{
                    width: 7,
                    height: 7,
                    borderRadius: "50%",
                    background: src.color,
                    marginTop: 5,
                  }} />
                  <div>
                    <div className="font-body text-[13px] font-semibold" style={{
                      color: C.slate,
                      marginBottom: 2,
                    }}>{src.name}</div>
                    <div className="font-body text-[12px] font-normal leading-[1.5]" style={{
                      color: `${C.slate}99`,
                    }}>{src.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <style>{`
            @keyframes sheetSlideUp {
              from { transform: translateY(100%); }
              to { transform: translateY(0); }
            }
          `}</style>
        </div>
      )}
    </div>
  );
}

function StepDestination({ data, onChange, onNext, onBack }) {
  const AVAILABLE = new Set(["zion", "joshuaTree", "bigSur", "olympic", "kauai", "vancouver"]); // destinations with guides ready
  const hasPick = !!data.destination;

  // Auto-select if only one destination available
  useEffect(() => {
    if (!data.destination && AVAILABLE.size === 1) {
      onChange({ destination: [...AVAILABLE][0] });
    }
  }, []);

  const handleSurprise = () => {
    const pick = selectDestination(data);
    onChange({ destination: pick });
    // Short delay so the user sees which card lights up before advancing
    setTimeout(() => onNext(), 420);
  };

  return (
    <div>
      <StepTitle eyebrow="Where" title="Where is calling you?" subtitle="Choose the landscape that stirs something." />
      <div className="grid gap-3 max-w-[560px] mx-auto px-5" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))" }}>
        {DESTINATIONS.map(d => {
          const sel = data.destination === d.id;
          const available = AVAILABLE.has(d.id);
          const Ic = d.icon;
          return (
            <button key={d.id}
              onClick={() => available && onChange({ destination: d.id })}
              className="relative text-center min-h-[110px] transition-all duration-300"
              style={{
                /* dynamic */
                background: !available ? `${C.sage}06` : sel ? `${C.oceanTeal}10` : C.white,
                border: `2px solid ${!available ? `${C.sage}10` : sel ? C.oceanTeal : `${C.sage}18`}`,
                borderRadius: 16, padding: "22px 14px",
                cursor: available ? "pointer" : "default",
                boxShadow: sel ? `0 4px 20px ${C.sage}15` : "0 1px 4px rgba(0,0,0,0.04)",
                transform: sel ? "scale(1.02)" : "scale(1)",
                opacity: available ? 1 : 0.45,
              }}>
              {!available && (
                <div className="absolute font-body text-[9px] font-bold tracking-[0.12em] uppercase" style={{
                  top: 8, right: 8,
                  color: C.sage, background: `${C.sage}12`,
                  padding: "3px 7px", borderRadius: 6,
                }}>Soon</div>
              )}
              <div className="flex justify-center mb-2.5">
                <Ic size={28} color={sel ? C.oceanTeal : d.color} />
              </div>
              <div className="font-serif text-[clamp(16px,4vw,18px)] font-semibold text-dark-ink mb-[3px]">{d.name}</div>
              <div className="font-body text-[12px] leading-[1.3]" style={{ color: `${C.slate}99` }}>{d.subtitle}</div>
            </button>
          );
        })}
      </div>

      {/* Two-button row: Surprise Me + Continue */}
      <div className="flex gap-3 justify-center items-center" style={{ padding: "40px 24px" }}>
        {hasPick ? (
          <button onClick={handleSurprise} className="font-body text-[13px] font-medium bg-none border-none cursor-pointer underline" style={{
            color: C.sage,
            textUnderlineOffset: 3,
            padding: "14px 8px",
          }}>or surprise me</button>
        ) : (
          <button onClick={handleSurprise} className="font-body text-[14px] font-semibold tracking-[0.12em] uppercase bg-transparent cursor-pointer transition-all duration-300 min-h-[48px]" style={{
            border: `1.5px solid ${C.oceanTeal}`,
            color: C.oceanTeal, padding: "14px 28px", borderRadius: 40,
          }}>Surprise me</button>
        )}
        <button onClick={onNext} disabled={!hasPick} className="font-body text-[14px] font-semibold tracking-[0.12em] uppercase border-none transition-all duration-300 min-h-[48px]" style={{
          /* dynamic */
          background: !hasPick ? `${C.oceanTeal}30` : C.oceanTeal,
          color: C.white, padding: "14px 36px", borderRadius: 40,
          cursor: !hasPick ? "not-allowed" : "pointer",
          opacity: !hasPick ? 0.5 : 1,
          boxShadow: !hasPick ? "none" : `0 4px 20px ${C.oceanTeal}30`,
        }}>Continue</button>
      </div>
    </div>
  );
}

const GOLDEN_WINDOWS = {
  zion:       new Set(['march', 'april', 'october', 'november']),
  joshuaTree: new Set(['march', 'april', 'october', 'november']),
  bigSur:     new Set(['april', 'may', 'september', 'october']),
  olympic:    new Set(['july', 'august', 'september', 'october']),
  kauai:      new Set(['april', 'may', 'september', 'october']),
  vancouver:  new Set(['june', 'july', 'august', 'september']),
};

// ─── Destination Profiles (for Surprise Me scoring) ─────────────────────────
const DESTINATION_PROFILE = {
  zion: {
    terrain: 'canyon',
    elemental: ['rock', 'water', 'sky'],
    intensity: [2, 5],
    coastal: false,
    solitude: false,
    bestIntentions: ['reconnect', 'light_up'],
  },
  joshuaTree: {
    terrain: 'desert',
    elemental: ['rock', 'sky', 'fire'],
    intensity: [1, 4],
    coastal: false,
    solitude: true,
    bestIntentions: ['tune_in', 'slow_down'],
  },
  bigSur: {
    terrain: 'coastal-mountain',
    elemental: ['water', 'rock', 'wind'],
    intensity: [2, 4],
    coastal: true,
    solitude: false,
    bestIntentions: ['reconnect', 'slow_down'],
  },
  olympic: {
    terrain: 'rainforest-coast',
    elemental: ['water', 'earth', 'mist'],
    intensity: [1, 4],
    coastal: true,
    solitude: true,
    bestIntentions: ['slow_down', 'tune_in'],
  },
  kauai: {
    terrain: 'tropical-coast',
    elemental: ['water', 'earth', 'sky'],
    intensity: [1, 3],
    coastal: true,
    solitude: false,
    bestIntentions: ['reconnect', 'light_up'],
  },
  vancouver: {
    terrain: 'coastal-forest',
    elemental: ['water', 'earth', 'wind'],
    intensity: [1, 4],
    coastal: true,
    solitude: true,
    bestIntentions: ['slow_down', 'reconnect'],
  },
};

/**
 * Score each destination against the user's form inputs and return the best match.
 * Uses: month (golden window), movement (intensity fit), intentions, group type.
 */
function selectDestination(formData) {
  const candidates = Object.keys(DESTINATION_PROFILE);
  const scores = {};

  for (const id of candidates) {
    const profile = DESTINATION_PROFILE[id];
    let score = 0;

    // Month match (weight 3) — golden window bonus
    if (formData.month && GOLDEN_WINDOWS[id]?.has(formData.month)) {
      score += 3;
    }

    // Intensity match (weight 2) — map movement slider (0-100) to 1-5 scale
    const movement = formData.movement ?? 50;
    const intensityLevel = 1 + Math.round((movement / 100) * 4); // 1-5
    const [lo, hi] = profile.intensity;
    if (intensityLevel >= lo && intensityLevel <= hi) {
      score += 2;
    }

    // Intention match (weight 2) — any overlap with bestIntentions
    const intentions = formData.intentions || [];
    if (intentions.some(i => profile.bestIntentions.includes(i))) {
      score += 2;
    }

    // Coastal preference (weight 1) — family groups get a soft coastal bonus
    if (formData.groupType === 'family' && profile.coastal) {
      score += 1;
    }

    scores[id] = score;
  }

  // Find max score, collect ties, break with random
  const maxScore = Math.max(...Object.values(scores));
  const winners = candidates.filter(id => scores[id] === maxScore);
  return winners[Math.floor(Math.random() * winners.length)];
}

function StepMonth({ data, onChange, onNext, onBack }) {
  const goldenMonths = GOLDEN_WINDOWS[data.destination] || new Set();
  const hasExactDates = !!(data.dateStart && data.dateEnd);
  const [showDates, setShowDates] = useState(hasExactDates);

  // Derive month from start date when exact dates change
  const handleDateChange = (patch) => {
    const next = { ...patch };
    const startVal = patch.dateStart ?? data.dateStart;
    if (startVal) {
      const d = new Date(startVal + 'T12:00:00'); // noon to avoid timezone issues
      const monthId = MONTHS[d.getMonth()]?.id;
      if (monthId) next.month = monthId;
    }
    onChange(next);
  };

  const toggleDates = () => {
    if (showDates) {
      // Turning off exact dates — clear them
      onChange({ dateStart: null, dateEnd: null });
    }
    setShowDates(!showDates);
  };

  return (
    <div>
      <StepTitle
        eyebrow="When"
        title="When are you going?"
        subtitle="Each month has its own character. We'll match your trip to the season."
      />
      <div className="grid grid-cols-3 gap-2.5 max-w-[480px] mx-auto px-5">
        {MONTHS.map(m => {
          const sel = data.month === m.id;
          const isGolden = goldenMonths.has(m.id);
          return (
            <button key={m.id} onClick={() => { onChange({ month: m.id }); if (showDates) { onChange({ month: m.id, dateStart: null, dateEnd: null }); setShowDates(false); } }}
              className="relative cursor-pointer transition-all duration-300 text-center min-h-[72px]"
              style={{
                /* dynamic */
                background: sel ? `${m.color}18` : C.white,
                border: `2px solid ${sel ? m.color : isGolden ? `${C.goldenAmber}35` : `${C.sage}18`}`,
                borderRadius: 14, padding: '14px 10px',
                boxShadow: sel ? `0 3px 16px ${m.color}20` : isGolden ? `0 1px 8px ${C.goldenAmber}12` : '0 1px 4px rgba(0,0,0,0.04)',
                transform: sel ? 'scale(1.03)' : 'scale(1)',
              }}>
              {isGolden && (
                <div className="absolute" style={{
                  top: 6, right: 6,
                  width: 7, height: 7, borderRadius: '50%',
                  background: C.goldenAmber, opacity: 0.6,
                }} />
              )}
              <div className="font-serif text-[clamp(15px,3.8vw,17px)] font-semibold mb-[3px]" style={{
                /* dynamic */
                color: sel ? C.slate : `${C.slate}BB`,
              }}>{m.label}</div>
              <div className="font-body text-[10px] font-semibold tracking-[0.08em] uppercase" style={{
                /* dynamic */
                color: sel ? m.color : `${C.sage}90`,
              }}>{(DESTINATION_WINDOWS[data.destination] || {})[m.id] || m.window}</div>
            </button>
          );
        })}
      </div>

      {/* Exact dates toggle */}
      {data.month && (
        <div className="max-w-[480px] mx-auto px-5">
          <button onClick={toggleDates} className="flex items-center justify-center gap-2 w-full bg-none border-none cursor-pointer font-body text-[13px] font-semibold tracking-[0.06em]" style={{
            /* dynamic */
            padding: '12px 16px',
            color: showDates ? C.oceanTeal : `${C.sage}70`,
          }}>
            <div className="flex items-center justify-center shrink-0" style={{
              /* dynamic */
              width: 16, height: 16, borderRadius: 4,
              border: `1.5px solid ${showDates ? C.oceanTeal : `${C.sage}40`}`,
              background: showDates ? C.oceanTeal : 'transparent',
              transition: 'all 0.2s',
            }}>
              {showDates && (
                <svg width="10" height="10" viewBox="0 0 14 14" fill="none">
                  <path d="M3 7.5L5.5 10L11 4" stroke={C.white} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </div>
            I have exact dates
          </button>

          {showDates && (
            <div className="flex gap-3 mt-3 mb-2" style={{
              animation: 'fadeScale 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            }}>
              <div className="flex-1">
                <label className="block mb-1.5 font-body text-[11px] font-bold tracking-[0.15em] uppercase" style={{
                  color: `${C.sage}AA`,
                }}>Start date</label>
                <input
                  type="date"
                  value={data.dateStart || ''}
                  onChange={e => handleDateChange({ dateStart: e.target.value })}
                  className="w-full font-body text-[14px] bg-white outline-none box-border"
                  style={{
                    padding: '14px 14px',
                    color: C.slate,
                    border: `1.5px solid ${C.sage}20`, borderRadius: 12,
                    WebkitAppearance: 'none',
                  }}
                />
              </div>
              <div className="flex-1">
                <label className="block mb-1.5 font-body text-[11px] font-bold tracking-[0.15em] uppercase" style={{
                  color: `${C.sage}AA`,
                }}>End date</label>
                <input
                  type="date"
                  value={data.dateEnd || ''}
                  min={data.dateStart || ''}
                  onChange={e => handleDateChange({ dateEnd: e.target.value })}
                  className="w-full font-body text-[14px] bg-white outline-none box-border"
                  style={{
                    padding: '14px 14px',
                    color: C.slate,
                    border: `1.5px solid ${C.sage}20`, borderRadius: 12,
                    WebkitAppearance: 'none',
                  }}
                />
              </div>
            </div>
          )}
        </div>
      )}

      <div>
        <NavButtons onBack={onBack} onNext={onNext} nextDisabled={!data.month} topPadding={showDates ? 24 : 8} />
      </div>
    </div>
  );
}

function StepIntention({ data, onChange, onNext, onBack }) {
  const selected = data.intentions || [];
  const toggle = (id) => {
    const next = selected.includes(id) ? selected.filter(x => x !== id) : [...selected, id];
    onChange({ intentions: next });
  };
  return (
    <div>
      <StepTitle eyebrow="Intention" title="Set your intention" subtitle="What is this journey for? Choose all that resonate." />
      <div className="grid grid-cols-2 gap-3 max-w-[480px] mx-auto px-5">
        {INTENTIONS.map(item => {
          const active = selected.includes(item.id);
          const Ic = item.icon;
          return (
            <button key={item.id} onClick={() => toggle(item.id)}
              className="cursor-pointer transition-all duration-[350ms] text-center min-h-[140px]"
              style={{
                /* dynamic */
                background: active ? `${item.color}12` : C.white,
                border: `2px solid ${active ? item.color : `${C.sage}18`}`,
                borderRadius: 16, padding: "24px 16px",
                boxShadow: active ? `0 4px 20px ${item.color}20` : "0 1px 4px rgba(0,0,0,0.04)",
              }}>
              <div className="flex justify-center mb-2.5 transition-opacity duration-300 opacity-100">
                <Ic size={30} color={item.color} />
              </div>
              <div className="font-serif text-[clamp(16px,4vw,18px)] font-semibold text-dark-ink mb-[3px]">{item.label}</div>
              <div className="font-body text-[12px] leading-[1.3]" style={{ color: `${C.slate}99` }}>{item.desc}</div>
            </button>
          );
        })}
      </div>
      <NavButtons onBack={onBack} onNext={onNext} nextDisabled={selected.length === 0} />
    </div>
  );
}

function StepMovement({ data, onChange, onNext, onBack }) {
  const val = data.movement ?? 50;
  const labels = ["Yin", "Gentle", "Dynamic", "Yang"];
  const labelIndex = val < 25 ? 0 : val < 50 ? 1 : val < 75 ? 2 : 3;
  const descriptions = [
    "Restorative. Easy walks, gentle stretches, slow mornings.",
    "Light hikes, flowing yoga, comfortable pace.",
    "Full-day hikes, challenging trails, dynamic practice.",
    "Push your limits. Summits. Trail runs. Max effort.",
  ];

  return (
    <div>
      <StepTitle eyebrow="Movement" title="How physically intense?" subtitle="From restorative mornings to summit-level effort." />
      <div className="max-w-[440px] mx-auto px-7">
        <div className="text-center mb-8">
          <div className="font-serif text-[clamp(32px,8vw,40px)] font-light mb-1.5" style={{ color: C.sage }}>{labels[labelIndex]}</div>
          <p className="font-body text-[14px] leading-[1.6]" style={{ color: `${C.slate}99` }}>{descriptions[labelIndex]}</p>
        </div>
        <div className="relative" style={{ padding: "16px 0" }}>
          <div className="absolute left-0 right-0" style={{ top: "50%", height: 6, background: `${C.sage}18`, borderRadius: 3, transform: "translateY(-50%)" }} />
          <div className="absolute" style={{ top: "50%", left: 0, width: `${val}%`, height: 6, background: `linear-gradient(90deg, ${C.oceanTeal}, ${C.goldenAmber}, ${C.sunSalmon})`, borderRadius: 3, transform: "translateY(-50%)", transition: "width 0.15s" }} />
          <input type="range" min={0} max={100} value={val}
            onChange={e => onChange({ movement: Number(e.target.value) })}
            className="w-full appearance-none bg-transparent cursor-pointer relative z-[2]"
            style={{ height: 44, WebkitAppearance: "none" }}
          />
        </div>
        <div className="flex justify-between items-center mt-2">
          <div className="flex items-center gap-1.5">
            <IconYinYang size={16} color={C.oceanTeal} />
            <span className="font-body text-[12px] font-semibold tracking-[0.1em] uppercase text-ocean-teal">Yin</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-body text-[12px] font-semibold tracking-[0.1em] uppercase" style={{ color: C.sunSalmon }}>Yang</span>
            <IconFlame size={16} color={C.sunSalmon} />
          </div>
        </div>
      </div>
      <NavButtons onBack={onBack} onNext={onNext} />
    </div>
  );
}


// ─── Step: Practice (where are you at + what do you want) ───────────────────

const PRACTICE_LEVELS = [
  {
    label: "Dip my toes",
    desc: "A gentle yoga class at a beautiful overlook, maybe a guided meditation at sunset. Easy to try, no experience needed.",
    icon: IconWave,
  },
  {
    label: "Find a rhythm",
    desc: "We'll mix in some morning yoga, a breathwork session, maybe a sound bath — nothing too intense.",
    icon: IconDharmaWheel,
  },
  {
    label: "Go deep",
    desc: "Morning practice woven into each day — yoga, breathwork, or meditation. Plenty of space to explore.",
    icon: IconEnso,
  },
  {
    label: "Let it lead",
    desc: "Your days are anchored by practice — morning sessions, breathwork, stillness. The landscape becomes your teacher.",
    icon: IconUnalome,
  },
];

function StepPracticeLevel({ data, onChange, onNext, onBack }) {
  const level = data.practiceLevel ?? 1;
  const current = PRACTICE_LEVELS[level];
  const Ic = current.icon;

  return (
    <div>
      <StepTitle
        eyebrow="Practice"
        title="How deep into your wellness practice do you want to go?"
        subtitle="This helps us know how much yoga, meditation, and wellness to weave into your days."
      />
      <div className="max-w-[460px] mx-auto px-7">
        {/* Current level display */}
        <div className="text-center mb-7">
          <div className="flex justify-center mb-3">
            <Ic size={32} color={C.oceanTeal} />
          </div>
          <div className="font-serif text-[clamp(24px,6vw,32px)] font-light mb-2" style={{ color: C.sage }}>{current.label}</div>
          <p className="font-body text-[clamp(13px,3.2vw,14px)] leading-[1.65] min-h-[48px]" style={{
            color: `${C.slate}AA`,
          }}>{current.desc}</p>
        </div>

        {/* Slider */}
        <div className="relative" style={{ padding: "16px 0" }}>
          <div className="absolute left-0 right-0" style={{ top: "50%", height: 6, background: `${C.sage}18`, borderRadius: 3, transform: "translateY(-50%)" }} />
          <div className="absolute" style={{
            /* dynamic */
            top: "50%", left: 0,
            width: `${(level / 3) * 100}%`, height: 6,
            background: `linear-gradient(90deg, ${C.seaGlass}, ${C.oceanTeal})`,
            borderRadius: 3, transform: "translateY(-50%)", transition: "width 0.2s",
          }} />
          <input type="range" min={0} max={3} step={1} value={level}
            onChange={e => onChange({ practiceLevel: Number(e.target.value) })}
            className="w-full appearance-none bg-transparent cursor-pointer relative z-[2]"
            style={{ height: 44, WebkitAppearance: "none" }}
          />
        </div>
        <div className="flex justify-between items-center mt-1">
          <div className="flex items-center gap-[5px]">
            <IconBodhiLeaf size={14} color={C.seaGlass} />
            <span className="font-body text-[11px] font-semibold tracking-[0.06em] text-sea-glass">Curious</span>
          </div>
          <div className="flex items-center gap-[5px]">
            <span className="font-body text-[11px] font-semibold tracking-[0.06em] text-ocean-teal">Deep</span>
            <IconUnalome size={14} color={C.oceanTeal} />
          </div>
        </div>
      </div>
      <NavButtons onBack={onBack} onNext={onNext} />
    </div>
  );
}

function StepPracticeInterests({ data, onChange, onNext, onBack }) {
  const selected = data.practices || [];
  const toggle = (id) => {
    const next = selected.includes(id) ? selected.filter(x => x !== id) : [...selected, id];
    onChange({ practices: next });
  };

  return (
    <div>
      <StepTitle
        eyebrow="Interests"
        title="What jumps out?"
        subtitle="Select any practices you'd like woven into your trip. Choose as many as you like."
      />
      <div className="max-w-[460px] mx-auto px-7">
        <div className="grid grid-cols-4 gap-2.5 max-w-[420px] mx-auto">
          {PRACTICES.map(p => {
            const active = selected.includes(p.id);
            const Pic = p.icon;
            return (
              <button key={p.id} onClick={() => toggle(p.id)}
                className="cursor-pointer transition-all duration-300 text-center min-h-[80px]"
                style={{
                  /* dynamic */
                  background: active ? `${p.color}12` : C.white,
                  border: `1.5px solid ${active ? p.color : `${C.sage}15`}`,
                  borderRadius: 14, padding: "18px 8px",
                  boxShadow: active ? `0 3px 14px ${p.color}15` : "0 1px 4px rgba(0,0,0,0.04)",
                }}>
                <div className="flex justify-center mb-1.5">
                  <Pic size={24} color={active ? p.color : `${C.sage}50`} />
                </div>
                <div className="font-body text-[12px] font-semibold leading-[1.2]" style={{
                  /* dynamic */
                  color: active ? C.slate : `${C.slate}AA`,
                }}>{p.label}</div>
              </button>
            );
          })}
        </div>
      </div>
      <NavButtons onBack={onBack} onNext={onNext} />
    </div>
  );
}
function StepPacing({ data, onChange, onNext, onBack }) {
  const val = data.pacing ?? 50;
  const labels = ["Spacious", "Unhurried", "Balanced", "Full"];
  const labelIndex = val < 25 ? 0 : val < 50 ? 1 : val < 75 ? 2 : 3;
  const descriptions = [
    "One or two experiences a day. Long mornings. Space to breathe.",
    "Room to wander, but never bored. Natural flow.",
    "A good mix of planned moments and free time.",
    "Every window filled. Dawn to dark. Make the most of every hour.",
  ];

  return (
    <div>
      <StepTitle eyebrow="Rhythm" title="How packed should each day be?" subtitle="Your daily schedule density — from wide-open mornings to dawn-to-dark adventures." />
      <div className="max-w-[440px] mx-auto px-7">
        <div className="text-center mb-8">
          <div className="font-serif text-[clamp(32px,8vw,40px)] font-light mb-1.5" style={{ color: C.sage }}>{labels[labelIndex]}</div>
          <p className="font-body text-[14px] leading-[1.6]" style={{ color: `${C.slate}99` }}>{descriptions[labelIndex]}</p>
        </div>
        <div className="relative" style={{ padding: "16px 0" }}>
          <div className="absolute left-0 right-0" style={{ top: "50%", height: 6, background: `${C.sage}18`, borderRadius: 3, transform: "translateY(-50%)" }} />
          <div className="absolute" style={{ top: "50%", left: 0, width: `${val}%`, height: 6, background: `linear-gradient(90deg, ${C.oceanTeal}, ${C.goldenAmber})`, borderRadius: 3, transform: "translateY(-50%)", transition: "width 0.15s" }} />
          <input type="range" min={0} max={100} value={val}
            onChange={e => onChange({ pacing: Number(e.target.value) })}
            className="w-full appearance-none bg-transparent cursor-pointer relative z-[2]"
            style={{ height: 44, WebkitAppearance: "none" }}
          />
        </div>
        <div className="flex justify-between items-center mt-2">
          <div className="flex items-center gap-1.5">
            <IconWave size={16} color={C.oceanTeal} />
            <span className="font-body text-[12px] font-semibold tracking-[0.08em] text-ocean-teal">Spacious</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-body text-[12px] font-semibold tracking-[0.08em]" style={{ color: C.goldenAmber }}>Full</span>
            <IconFlame size={16} color={C.goldenAmber} />
          </div>
        </div>
      </div>
      <NavButtons onBack={onBack} onNext={onNext} />
    </div>
  );
}

function StepRange({ data, onChange, onNext, onBack }) {
  const val = data.range ?? 35;
  const labels = ["Rooted", "Flexible", "Nomadic", "Full Drift"];
  const labelIndex = val < 25 ? 0 : val < 50 ? 1 : val < 75 ? 2 : 3;
  const descriptions = [
    "One place, explored deeply. No car keys needed.",
    "A home base with a day trip or two woven in.",
    "Two or three stops. Each day, a new landscape.",
    "The open road is the trip. A different view every morning.",
  ];

  return (
    <div>
      <StepTitle eyebrow="Territory" title="How far do you want to roam?" subtitle="Some trips go deep in one place. Others cover ground." />
      <div className="max-w-[440px] mx-auto px-7">
        <div className="text-center mb-8">
          <div className="font-serif text-[clamp(32px,8vw,40px)] font-light mb-1.5" style={{ color: C.sage }}>{labels[labelIndex]}</div>
          <p className="font-body text-[14px] leading-[1.6]" style={{ color: `${C.slate}99` }}>{descriptions[labelIndex]}</p>
        </div>
        <div className="relative" style={{ padding: "16px 0" }}>
          <div className="absolute left-0 right-0" style={{ top: "50%", height: 6, background: `${C.sage}18`, borderRadius: 3, transform: "translateY(-50%)" }} />
          <div className="absolute" style={{ top: "50%", left: 0, width: `${val}%`, height: 6, background: `linear-gradient(90deg, ${C.seaGlass}, ${C.skyBlue}, ${C.goldenAmber})`, borderRadius: 3, transform: "translateY(-50%)", transition: "width 0.15s" }} />
          <input type="range" min={0} max={100} value={val}
            onChange={e => onChange({ range: Number(e.target.value) })}
            className="w-full appearance-none bg-transparent cursor-pointer relative z-[2]"
            style={{ height: 44, WebkitAppearance: "none" }}
          />
        </div>
        <div className="flex justify-between items-center mt-2">
          <div className="flex items-center gap-1.5">
            <IconMountain size={16} color={C.seaGlass} />
            <span className="font-body text-[12px] font-semibold tracking-[0.08em] text-sea-glass">Rooted</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-body text-[12px] font-semibold tracking-[0.08em]" style={{ color: C.goldenAmber }}>Drift</span>
            <IconTorii size={16} color={C.goldenAmber} />
          </div>
        </div>
      </div>
      <NavButtons onBack={onBack} onNext={onNext} />
    </div>
  );
}


// ─── Step: Duration (standalone) ──────────────────────────────────────────

function StepDuration({ data, onChange, onNext, onBack }) {
  const days = data.duration || 4;

  const DURATION_LABELS = {
    2:  { text: 'Just a taste',      sweet: false },
    3:  { text: 'Long weekend',      sweet: false },
    4:  { text: 'Finding your feet', sweet: true  },
    5:  { text: 'Full immersion',    sweet: true  },
    6:  { text: 'Room to breathe',   sweet: true  },
    7:  { text: 'The classic week',  sweet: true  },
    8:  { text: 'Unhurried pace',    sweet: false },
    9:  { text: 'Extended stay',     sweet: false },
    10: { text: 'Deep immersion',    sweet: false },
  };

  return (
    <div>
      <StepTitle
        eyebrow="Duration"
        title="How many days?"
        subtitle="We recommend 4–7 days for a full experience."
      />
      <div className="max-w-[440px] mx-auto px-7">
        {/* Large number display */}
        <div className="text-center mb-8">
          <div className="font-serif text-[clamp(64px,16vw,80px)] font-light text-dark-ink leading-[1]" style={{
            transition: 'transform 0.12s',
          }}>{days}</div>
          <div className="font-body text-[11px] font-bold tracking-[0.2em] uppercase mt-1" style={{
            color: `${C.sage}AA`,
          }}>days</div>
          <div className="font-body text-[12px] font-normal mt-0.5" style={{
            color: `${C.sage}88`,
          }}>{days - 1} night{days - 1 !== 1 ? 's' : ''}</div>
          <div className="font-serif italic text-[18px] font-light mt-2.5 min-h-[26px]" style={{
            /* dynamic */
            color: DURATION_LABELS[days].sweet ? C.oceanTeal : `${C.slate}55`,
            transition: 'color 0.2s',
          }}>{DURATION_LABELS[days].text}</div>
        </div>

        {/* Slider track */}
        <div className="relative" style={{ padding: '16px 0' }}>
          <div className="absolute left-0 right-0" style={{
            top: '50%',
            height: 4, background: `${C.sage}18`, borderRadius: 2,
            transform: 'translateY(-50%)',
          }} />
          <div className="absolute" style={{
            /* dynamic */
            top: '50%', left: 0,
            width: `${((days - 2) / 8) * 100}%`,
            height: 4, background: C.oceanTeal, borderRadius: 2,
            transform: 'translateY(-50%)', transition: 'width 0.15s',
          }} />
          <input
            id="duration-slider"
            type="range" min={2} max={10} step={1} value={days}
            onChange={e => onChange({ duration: Number(e.target.value) })}
            className="w-full appearance-none bg-transparent cursor-pointer relative z-[2]"
            style={{ height: 44, WebkitAppearance: 'none' }}
          />
        </div>

        {/* Min/max labels */}
        <div className="flex justify-between mt-2">
          <span className="font-body text-[11px] font-semibold" style={{ color: `${C.slate}40` }}>2 days</span>
          <span className="font-body text-[11px] font-semibold" style={{ color: `${C.slate}40` }}>10 days</span>
        </div>

        {/* Sweet spot badge */}
        <div className="text-center mt-5 min-h-[28px]">
          {DURATION_LABELS[days].sweet && (
            <span className="font-body text-[11px] font-semibold tracking-[0.1em] text-ocean-teal" style={{
              background: `${C.oceanTeal}10`,
              padding: '5px 16px', borderRadius: 20,
            }}>✦ Sweet spot</span>
          )}
        </div>
      </div>
      <NavButtons onBack={onBack} onNext={onNext} />
    </div>
  );
}

// ─── Step: Group (travel party) ───────────────────────────────────────────

function StepGroup({ data, onChange, onNext, onBack }) {
  const selected = data.groupType;
  const groupSize = data.groupSize || 1;
  const showCounter = selected === 'friends' || selected === 'family';

  const handleSelect = (id) => {
    const patch = { groupType: id };
    if (id === 'solo') patch.groupSize = 1;
    else if (id === 'couple') patch.groupSize = 2;
    else if (selected !== id) patch.groupSize = 2; // default when first selecting friends/family
    onChange(patch);
  };

  return (
    <div>
      <StepTitle eyebrow="Travel Party" title="Who's coming?" subtitle="This shapes everything — pace, dining, activities, lodging." />
      <div className="grid grid-cols-2 gap-3 max-w-[480px] mx-auto px-5">
        {GROUP_TYPES.map(item => {
          const active = selected === item.id;
          const Ic = item.icon;
          return (
            <button key={item.id} onClick={() => handleSelect(item.id)}
              className="cursor-pointer transition-all duration-[350ms] text-center min-h-[140px]"
              style={{
                /* dynamic */
                background: active ? `${item.color}12` : C.white,
                border: `2px solid ${active ? item.color : `${C.sage}18`}`,
                borderRadius: 16, padding: "24px 16px",
                boxShadow: active ? `0 4px 20px ${item.color}20` : "0 1px 4px rgba(0,0,0,0.04)",
              }}>
              <div className="flex justify-center mb-2.5 transition-opacity duration-300 opacity-100">
                <Ic size={30} color={item.color} />
              </div>
              <div className="font-serif text-[clamp(16px,4vw,18px)] font-semibold text-dark-ink mb-[3px]">{item.label}</div>
              <div className="font-body text-[12px] leading-[1.3]" style={{ color: `${C.slate}99` }}>{item.desc}</div>
            </button>
          );
        })}
      </div>
      {showCounter && (
        <div className="max-w-[480px] mx-auto px-5" style={{
          marginTop: 12,
          animation: "fadeScale 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
        }}>
          <div className="bg-white" style={{
            borderRadius: 2, padding: "16px 24px",
            border: `1px solid ${C.sage}12`,
          }}>
            <div className="flex items-center justify-center gap-7">
              <button onClick={() => onChange({ groupSize: Math.max(2, groupSize - 1) })} className="flex items-center justify-center bg-transparent cursor-pointer font-body text-[20px]" style={{
                width: 48, height: 48, borderRadius: "50%",
                border: `2px solid ${C.sage}25`,
                color: C.sage,
              }}>−</button>
              <div className="text-center min-w-[60px]">
                <div className="font-serif text-[clamp(48px,12vw,60px)] font-light text-dark-ink leading-[1]">{groupSize}</div>
                <div className="font-body text-[12px] font-semibold tracking-[0.15em] uppercase mt-0.5" style={{
                  color: `${C.sage}AA`,
                }}>travelers</div>
              </div>
              <button onClick={() => onChange({ groupSize: Math.min(8, groupSize + 1) })} className="flex items-center justify-center bg-transparent cursor-pointer font-body text-[20px]" style={{
                width: 48, height: 48, borderRadius: "50%",
                border: `2px solid ${C.sage}25`,
                color: C.sage,
              }}>+</button>
            </div>
          </div>
        </div>
      )}
      <NavButtons onBack={onBack} onNext={onNext} nextDisabled={!selected} />
    </div>
  );
}

// ─── Step: Budget (standalone) ────────────────────────────────────────────

function StepBudget({ data, onChange, onNext, onBack }) {
  return (
    <div>
      <StepTitle
        eyebrow="Budget"
        title="What budget feels right?"
        subtitle="This helps us match accommodations, dining, and experiences to your comfort."
      />
      <div className="max-w-[480px] mx-auto px-5">
        <div className="flex flex-col gap-2">
          {BUDGET_TIERS.map(tier => {
            const active = data.budget === tier.id;
            return (
              <button key={tier.id} onClick={() => onChange({ budget: tier.id })}
                className="flex items-center gap-3.5 cursor-pointer transition-all duration-[250ms] min-h-[60px] text-left"
                style={{
                  /* dynamic */
                  background: active ? `${tier.color}08` : C.white,
                  border: `1.5px solid ${active ? tier.color : `${C.sage}18`}`,
                  borderRadius: 14, padding: "18px 20px",
                  boxShadow: active ? `0 3px 16px ${tier.color}15` : "0 1px 4px rgba(0,0,0,0.04)",
                }}>
                <div className="font-body text-[14px] font-bold shrink-0 min-w-[40px] text-center" style={{
                  color: tier.color,
                }}>{tier.range}</div>
                <div className="flex-1">
                  <span className="font-serif text-[clamp(16px,4vw,18px)] font-semibold text-dark-ink">{tier.label}</span>
                  <span className="font-body text-[13px] ml-2" style={{ color: `${C.slate}99` }}>{tier.desc}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
      <NavButtons onBack={onBack} onNext={onNext} nextDisabled={!data.budget} />
    </div>
  );
}

// ─── Step: Stay Style ─────────────────────────────────────────────────────

function StepStay({ data, onChange, onNext, onBack }) {
  return (
    <div>
      <StepTitle
        eyebrow="Accommodation"
        title="How do you want to stay?"
        subtitle="From sleeping under the stars to design-forward retreats — we'll match your lodging to your vibe."
      />
      <div className="max-w-[480px] mx-auto px-5">
        <div className="flex flex-col gap-2">
          {STAY_STYLES.map(style => {
            const active = data.stayStyle === style.id;
            const Ic = style.icon;
            return (
              <button key={style.id} onClick={() => onChange({ stayStyle: style.id })}
                className="flex items-center gap-3.5 cursor-pointer transition-all duration-[250ms] min-h-[60px] text-left"
                style={{
                  /* dynamic */
                  background: active ? `${style.color}08` : C.white,
                  border: `1.5px solid ${active ? style.color : `${C.sage}18`}`,
                  borderRadius: 14, padding: "18px 20px",
                  boxShadow: active ? `0 3px 16px ${style.color}15` : "0 1px 4px rgba(0,0,0,0.04)",
                }}>
                <div className="flex items-center justify-center shrink-0" style={{
                  /* dynamic */
                  width: 40, height: 40, borderRadius: 12,
                  background: active ? `${style.color}12` : `${C.sage}08`,
                  transition: "background 0.25s",
                }}>
                  <Ic size={20} color={style.color} />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="font-serif text-[clamp(16px,4vw,18px)] font-semibold text-dark-ink">{style.label}</span>
                  <div className="font-body text-[13px] leading-[1.4] mt-0.5" style={{ color: `${C.slate}99` }}>{style.desc}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
      <NavButtons onBack={onBack} onNext={onNext} nextDisabled={!data.stayStyle} />
    </div>
  );
}

// ─── Profiles Modal ──────────────────────────────────────────────────────────
function ProfilesModal({ personas, currentId, onClose }) {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center"
         onClick={onClose}>
      <div className="absolute inset-0" style={{ background: 'rgba(26,37,48,0.6)' }} />
      <div onClick={e => e.stopPropagation()} className="relative w-[90vw] max-w-[520px] max-h-[85vh] overflow-y-auto" style={{
        background: '#FAF6F0',
        padding: '32px 24px',
        animation: 'fadeScale 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      }}>
        <button onClick={onClose} className="absolute bg-none border-none cursor-pointer text-[20px]" style={{
          top: 12, right: 12,
          width: 44, height: 44,
          color: C.sage,
        }}>×</button>
        <div className="text-center mb-6">
          <div className="font-serif text-[24px] font-light text-dark-ink">
            Travel Spirits
          </div>
        </div>
        {personas.map(p => (
          <div key={p.id} className="mb-3" style={{
            /* dynamic */
            borderLeft: `3px solid ${p.color}`,
            padding: '16px 20px',
            background: p.id === currentId ? `${p.color}08` : 'transparent',
          }}>
            {p.id === currentId && (
              <div className="font-body text-[10px] font-bold tracking-[0.15em] uppercase mb-1" style={{ color: p.color }}>
                Your profile
              </div>
            )}
            <div className="font-serif text-[20px] font-light text-dark-ink">
              {p.name}
            </div>
            <div className="font-body text-[10px] font-bold tracking-[0.2em] uppercase mt-0.5" style={{ color: p.color }}>
              {p.subtitle}
            </div>
            <p className="font-body text-[13px] font-normal leading-[1.55] mt-2 mb-0" style={{
              color: `${C.slate}99`,
            }}>
              {p.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Profile ─────────────────────────────────────────────────────────────────
function StepProfile({ data, onBack, onUnlock, generating }) {
  const [visible, setVisible] = useState(false);
  const [showProfilesModal, setShowProfilesModal] = useState(false);
  useEffect(() => { setTimeout(() => setVisible(true), 200); }, []);

  const persona = getPersona(data);
  const PersonaIcon = persona.icon;
  const practiceLevel = data.practiceLevel ?? 1;
  const practiceLevelLabel = PRACTICE_LEVELS[practiceLevel]?.label || "Curious";

  const radarValues = {
    movement: (data.movement ?? 50) / 100,
    wellness: Math.min(1, (practiceLevel / 3) * 0.7 + ((data.practices?.length || 0) / 5) * 0.3),
    adventure: Math.min(1, ((data.intentions || []).includes("light_up") ? 0.5 : 0.2) + ((data.range ?? 35) / 100) * 0.5),
    stillness: (data.intentions || []).some(i => ["tune_in","slow_down"].includes(i)) ? 0.85 : (data.pacing ?? 50) < 40 ? 0.7 : 0.3,
    social: (data.intentions || []).includes("reconnect") ? 0.85 : 0.4,
    luxury: data.budget === "noLimits" ? 1 : data.budget === "premium" ? 0.75 : data.budget === "balanced" ? 0.5 : 0.3,
  };

  const destName = DESTINATIONS.find(d => d.id === data.destination)?.name || "your destination";
  const monthName = MONTHS.find(m => m.id === data.month)?.label || "";
  const intentionLabels = (data.intentions || []).map(id => INTENTIONS.find(i => i.id === id)?.label).filter(Boolean);
  const practiceLabels = (data.practices || []).map(id => PRACTICES.find(p => p.id === id)?.label).filter(Boolean);

  return (
    <div style={{
      /* dynamic */
      opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(20px)",
      transition: "all 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
    }}>
      <StepTitle eyebrow="Your Travel Spirit" />

      {/* Persona card */}
      <div className="max-w-[480px] mx-auto px-5" style={{ marginBottom: 6 }}>
        <div className="relative bg-white text-center" style={{
          /* dynamic */
          borderRadius: 2, padding: "20px 20px",
          border: `2px solid ${persona.color}25`, boxShadow: `0 4px 24px ${persona.color}12`,
        }}>
          {/* Info icon — opens profiles modal */}
          <button onClick={() => setShowProfilesModal(true)} className="absolute flex items-center justify-center bg-transparent cursor-pointer p-0" style={{
            top: 10, right: 10,
            width: 20, height: 20, borderRadius: "50%",
            border: "1px solid rgba(26,37,48,0.2)",
            color: "rgba(26,37,48,0.4)",
          }}>
            <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" width="10" height="10">
              <circle cx="6" cy="6" r="5"/><line x1="6" y1="5.5" x2="6" y2="8.5"/><circle cx="6" cy="3.5" r="0.5" fill="currentColor" stroke="none"/>
            </svg>
          </button>
          <div className="flex justify-center mb-2.5">
            <div className="flex items-center justify-center" style={{
              /* dynamic */
              width: 44, height: 44, borderRadius: "50%",
              background: `${persona.color}12`, border: `1.5px solid ${persona.color}30`,
            }}>
              <PersonaIcon size={22} color={persona.color} />
            </div>
          </div>
          <div className="font-body text-[11px] font-bold tracking-[0.25em] uppercase mb-1.5" style={{ color: persona.color }}>{persona.subtitle}</div>
          <div className="font-serif text-[clamp(24px,6vw,30px)] font-light text-dark-ink mb-1 leading-[1.1]">{persona.name}</div>
          <p className="font-body text-[clamp(13px,3.2vw,14px)] font-normal leading-[1.55] mt-2.5" style={{ color: `${C.slate}AA` }}>{persona.desc}</p>
        </div>
      </div>

      {showProfilesModal && (
        <ProfilesModal personas={PERSONAS} currentId={persona.id} onClose={() => setShowProfilesModal(false)} />
      )}

      <div className="flex justify-center mb-1 px-5">
        <RadarChart values={radarValues} size={190} />
      </div>

      <div className="text-center mt-1" style={{ padding: "0 28px 20px" }}>
        <p className="font-body text-[clamp(14px,3.5vw,14px)] leading-[1.6] max-w-[380px] mx-auto mb-4" style={{ color: `${C.slate}99` }}>
          A custom {data.duration || 4}-day {monthName ? `${monthName} ` : ''}plan for {destName} — built around your pace, your practices, and your intentions.
        </p>
        <button onClick={onUnlock} disabled={generating} className="font-body text-[14px] font-semibold tracking-[0.12em] uppercase border-none transition-all duration-300 min-h-[56px]" style={{
          /* dynamic */
          background: generating
            ? `${C.sage}60`
            : `linear-gradient(135deg, ${C.sage}, ${C.oceanTeal})`,
          color: C.white,
          padding: "18px 44px", borderRadius: 40, cursor: generating ? "wait" : "pointer",
          boxShadow: generating ? "none" : `0 6px 28px ${C.oceanTeal}30`,
          opacity: generating ? 0.8 : 1,
        }}>{generating ? 'Creating your journey...' : 'Build My Itinerary'}</button>
        <div className="font-body text-[13px] mt-3" style={{ color: `${C.sage}AA` }}>Fully customizable · Powered by Lila Trips</div>
        <div className="mt-3.5">
          <button onClick={onBack} className="font-body text-[13px] font-medium bg-none border-none cursor-pointer underline min-h-[44px]" style={{
            color: `${C.sage}AA`,
            textUnderlineOffset: 3, padding: 12,
          }}>← Adjust my preferences</button>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// GENERATING SCREEN — meditative loading experience
// ═══════════════════════════════════════════════════════════════════════════════

const GENERATING_STEPS = [
  { text: "Studying the terrain", icon: IconMountain },
  { text: "Reading the season", icon: IconBodhiLeaf },
  { text: "Setting your pace", icon: IconWave },
  { text: "Weaving in your practices", icon: IconLotus },
  { text: "Curating your stays", icon: IconTorii },
  { text: "Finding the golden hours", icon: IconFlame },
  { text: "Assembling your journey", icon: IconEnso },
];

function estimateLabel(days) {
  if (days <= 2) return "Usually about a minute";
  if (days <= 3) return "Usually a minute or two";
  if (days <= 5) return "Usually two to three minutes";
  if (days <= 7) return "Usually about three minutes";
  return "Usually three to four minutes";
}

function GeneratingScreen({ destination, days = 4 }) {
  const [completedIndex, setCompletedIndex] = useState(-1);
  const [breathPhase, setBreathPhase] = useState(0);
  const allDone = completedIndex >= GENERATING_STEPS.length - 1;
  const activeIndex = completedIndex + 1;

  useEffect(() => {
    // Scale timings to trip length: ~30s base + ~18s per day
    // Back-weight: later steps take progressively longer so "Finalizing" doesn't linger
    const total = 40000 + days * 22000;
    const n = GENERATING_STEPS.length;
    // Quadratic weighting: step i gets weight (i+1)^1.4
    const weights = GENERATING_STEPS.map((_, i) => Math.pow(i + 1, 1.4));
    const sumW = weights.reduce((a, b) => a + b, 0);
    let cumulative = 0;
    const timings = weights.map(w => {
      cumulative += w;
      return Math.round(total * (cumulative / sumW));
    });
    const timeouts = timings.map((delay, i) =>
      setTimeout(() => setCompletedIndex(i), delay)
    );
    return () => timeouts.forEach(clearTimeout);
  }, [days]);

  useEffect(() => {
    let frame;
    const start = Date.now();
    const cycle = 4000;
    function tick() {
      const t = ((Date.now() - start) % cycle) / cycle;
      setBreathPhase(Math.sin(t * Math.PI));
      frame = requestAnimationFrame(tick);
    }
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  const resolvedName = DESTINATIONS.find(d => d.id === destination)?.name;
  const destName = resolvedName || null;
  const ringScale = 0.9 + breathPhase * 0.1;

  return (
    <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center" style={{
      background: `linear-gradient(180deg, ${C.cream} 0%, ${C.white} 40%, ${C.cream} 100%)`,
      padding: "40px 28px",
    }}>
      {/* Breathing Ensō */}
      <div className="relative flex items-center justify-center mb-6" style={{ width: 80, height: 80 }}>
        <div className="absolute" style={{
          /* dynamic */
          inset: -12,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${C.oceanTeal}${Math.round((0.06 + breathPhase * 0.1) * 255).toString(16).padStart(2, '0')} 0%, transparent 70%)`,
          transform: `scale(${ringScale})`,
        }} />
        <svg width="80" height="80" viewBox="0 0 80 80" style={{ transform: `scale(${ringScale})` }}>
          <circle cx="40" cy="40" r="32" fill="none" stroke={`${C.sage}20`} strokeWidth="1.5" />
          <circle cx="40" cy="40" r="32" fill="none"
            stroke={C.oceanTeal} strokeWidth="2" strokeLinecap="round"
            strokeDasharray={`${Math.PI * 64}`}
            strokeDashoffset={`${Math.PI * 64 * (1 - (0.7 + breathPhase * 0.28))}`}
            opacity={0.5 + breathPhase * 0.5}
            style={{ transform: "rotate(-90deg)", transformOrigin: "center" }}
          />
        </svg>
      </div>

      {/* Title */}
      <div className="font-serif text-[clamp(22px,5.5vw,28px)] font-light text-dark-ink mb-1.5 text-center">{destName ? `Crafting your ${destName} trip` : 'Preparing your journey'}</div>

      <div className="font-body text-[clamp(12px,3vw,14px)] font-normal mb-7 text-center leading-[1.6]" style={{
        color: C.sage, opacity: 0.75,
      }}>{estimateLabel(days)}<br/>Sit tight — it's worth the wait.</div>

      {/* Checklist — compact with collapsing completed items */}
      <div className="flex flex-col items-center w-full max-w-[300px]">
        {GENERATING_STEPS.map((step, i) => {
          const StepIcon = step.icon;
          const isComplete = i <= completedIndex;
          const isActive = i === activeIndex && !allDone;
          const isFuture = i > activeIndex;

          return (
            <div key={i} className="flex items-center justify-center overflow-hidden" style={{
              /* dynamic */
              gap: isComplete ? 6 : 10,
              height: isComplete ? 20 : isActive ? 38 : 26,
              opacity: isComplete ? 0.35 : isFuture ? 0.22 : 1,
              transition: "all 0.7s cubic-bezier(0.4, 0, 0.2, 1)",
            }}>
              <div className="flex items-center justify-center shrink-0" style={{
                /* dynamic */
                width: isComplete ? 16 : isActive ? 30 : 20,
                height: isComplete ? 16 : isActive ? 30 : 20,
                borderRadius: "50%",
                background: isComplete ? "transparent" : isActive ? `${C.oceanTeal}10` : "transparent",
                border: isComplete ? "none" : isActive ? `1.5px solid ${C.oceanTeal}40` : `1px solid ${C.sage}20`,
                transition: "all 0.6s",
              }}>
                {isComplete ? (
                  <svg width="10" height="10" viewBox="0 0 14 14" fill="none">
                    <path d="M3 7.5L5.5 10L11 4" stroke={C.sage} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : (
                  <StepIcon size={isActive ? 15 : 11} color={isActive ? C.oceanTeal : `${C.sage}50`} />
                )}
              </div>

              <div className="font-body whitespace-nowrap" style={{
                /* dynamic */
                fontSize: isComplete ? 10 : isActive ? 13.5 : 11.5,
                fontWeight: isActive ? 600 : 400,
                color: isComplete ? C.sage : isActive ? C.slate : C.sage,
                letterSpacing: isActive ? "0.03em" : "0.01em",
                transition: "all 0.6s",
              }}>
                {step.text}
                {isActive && <span style={{ opacity: 0.4 }}><DotAnimation /></span>}
              </div>
            </div>
          );
        })}
      </div>

      {/* Thin progress bar */}
      <div className="w-full max-w-[200px] mt-6 overflow-hidden" style={{
        height: 2, borderRadius: 1,
        background: `${C.sage}12`,
      }}>
        <div style={{
          /* dynamic */
          height: "100%", borderRadius: 1,
          background: C.oceanTeal,
          width: `${Math.min(100, ((completedIndex + 1) / GENERATING_STEPS.length) * 100)}%`,
          transition: "width 1.2s cubic-bezier(0.4, 0, 0.2, 1)",
        }} />
      </div>

      {/* Step count */}
      <div className="font-body text-[11px] font-medium tracking-[0.12em] uppercase mt-2" style={{
        color: `${C.sage}70`,
      }}>
        {allDone ? "Finalizing..." : `${Math.max(0, completedIndex + 1)} of ${GENERATING_STEPS.length}`}
      </div>
    </div>
  );
}

function DotAnimation() {
  const [dots, setDots] = useState("");
  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? "" : prev + ".");
    }, 500);
    return () => clearInterval(interval);
  }, []);
  return <span className="inline-block w-4 text-left">{dots}</span>;
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════════════════════════════════════

const STEP_NAMES = [
  'welcome', 'destination', 'group', 'month', 'duration', 'budget', 'stay',
  'intention', 'range', 'movement', 'pacing', 'practice_level',
  'practice_interests', 'profile',
];

export default function PlanMyTrip() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const destParam = searchParams.get('destination');
  const validDests = new Set(["zion","joshuaTree","bigSur","olympic","kauai","vancouver"]);
  const preselected = validDests.has(destParam) ? destParam : null;

  const [step, setStep] = useState(preselected ? 2 : 0);
  const [data, setData] = useState({
    destination: preselected, groupType: null, groupSize: 1,
    month: null, dateStart: null, dateEnd: null,
    intentions: [], movement: 30,
    pacing: 50, range: 35, duration: 4, budget: null, stayStyle: null,
    practiceLevel: 1, practices: [],
  });
  const [transitioning, setTransitioning] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const containerRef = useRef(null);
  const questionnaireCompleted = useRef(false);

  // questionnaire_started — fire once on mount
  useEffect(() => {
    trackEvent('questionnaire_started', { destination: data.destination || undefined });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // questionnaire_abandoned — fire on unmount if not completed
  useEffect(() => {
    return () => {
      if (!questionnaireCompleted.current) {
        trackEvent('questionnaire_abandoned', {
          last_step: STEP_NAMES[step] || step,
          steps_completed: step,
          destination: data.destination || undefined,
        });
      }
    };
  });

  const updateData = (patch) => setData(prev => ({ ...prev, ...patch }));
  const handleClose = () => {
    if (step > 0) { setShowLeaveModal(true); return; }
    navigate('/');
  };
  const goNext = () => {
    trackEvent('questionnaire_step_completed', {
      step_number: step,
      step_name: STEP_NAMES[step] || String(step),
      destination: data.destination || undefined,
    });

    // After intention step (step 7), nudge slider defaults based on selections
    if (step === 7 && data.intentions?.length > 0) {
      const intents = data.intentions;
      let movementNudge = 30; // default
      let pacingNudge = 50;   // default

      if (intents.includes("slow_down")) { movementNudge = 20; pacingNudge = 25; }
      if (intents.includes("tune_in"))   { movementNudge = Math.min(movementNudge, 25); pacingNudge = Math.min(pacingNudge, 35); }
      if (intents.includes("light_up"))  { movementNudge = Math.max(movementNudge, 65); pacingNudge = Math.max(pacingNudge, 70); }
      if (intents.includes("reconnect")) { movementNudge = Math.max(movementNudge, 40); pacingNudge = Math.max(pacingNudge, 50); }

      // Only nudge if user hasn't already manually adjusted from defaults
      const patch = {};
      if (data.movement === 30) patch.movement = movementNudge;
      if (data.pacing === 50) patch.pacing = pacingNudge;
      if (Object.keys(patch).length > 0) setData(prev => ({ ...prev, ...patch }));
    }

    setTransitioning(true);
    setTimeout(() => { setStep(s => s + 1); setTransitioning(false); if (containerRef.current) containerRef.current.scrollTop = 0; }, 300);
  };
  const goBack = () => {
    trackEvent('questionnaire_step_back', {
      from_step: STEP_NAMES[step] || String(step),
      to_step: STEP_NAMES[step - 1] || String(step - 1),
    });
    setTransitioning(true);
    setTimeout(() => { setStep(s => s - 1); setTransitioning(false); if (containerRef.current) containerRef.current.scrollTop = 0; }, 300);
  };
  const handleUnlock = async () => {
    questionnaireCompleted.current = true;
    trackEvent('questionnaire_completed', {
      destination: data.destination || undefined,
      trip_duration: data.duration,
      party_size: data.groupSize || 1,
      interests: data.practices?.join(',') || '',
    });
    trackEvent('itinerary_generation_started', { destination: data.destination || undefined });
    const t0 = performance.now();
    setGenerating(true);
    sessionStorage.removeItem('lila_raw_itinerary');
    sessionStorage.removeItem('lila_form_data');
    sessionStorage.removeItem('lila_metadata');
    const { signal, clear } = fetchWithTimeout(310000);
    try {
      const apiBody = translateFormToApi(data);
      const response = await fetch('/api/generate-itinerary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(apiBody),
        signal,
      });
      clear();
      // Server sends NDJSON (keepalive newlines + final JSON line) to prevent
      // mobile carriers from killing the connection during long generations.
      // Parse the last non-empty line as the JSON payload.
      const text = await response.text();
      const lines = text.split('\n').filter(l => l.trim());
      const lastLine = lines[lines.length - 1] || '{}';
      let result, error;
      try {
        result = JSON.parse(lastLine);
        error = result.success ? null : (result.error || `HTTP ${response.status}`);
      } catch {
        result = null;
        error = `HTTP ${response.status} (invalid JSON)`;
      }
      const ok = response.ok && result?.success;
      if (ok) {
        // Fresh session for each new trip so iterations don't cross-pollinate
        clearSession();
        navigate('/itinerary', {
          state: {
            itinerary: result.itinerary,
            metadata: result.metadata,
            formData: data,
          }
        });
      } else {
        trackEvent('itinerary_generation_failed', { destination: data.destination || undefined, error_type: 'api_error' });
        setErrorMessage(error || 'Something went wrong generating your itinerary. Please try again.');
      }
    } catch (err) {
      clear();
      console.error('Itinerary generation failed:', err);
      const isTimeout = err.name === 'AbortError';
      trackEvent('itinerary_generation_failed', { destination: data.destination || undefined, error_type: isTimeout ? 'timeout' : (err.message || 'network_error') });
      setErrorMessage(isTimeout ? 'This is taking longer than expected. Please try again.' : 'Something went wrong. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  // 14 screens: welcome → destination → group → month → duration → budget → stay → intention → territory → movement → pacing → practiceLevel → practiceInterests → profile
  const TOTAL_INNER_STEPS = 12; // steps shown in indicator (excludes welcome + profile)
  const renderStep = () => {
    switch (step) {
      case 0: return <StepWelcome onNext={goNext} />;
      case 1: return <StepDestination data={data} onChange={updateData} onNext={goNext} onBack={goBack} />;
      case 2: return <StepGroup data={data} onChange={updateData} onNext={goNext} onBack={goBack} />;
      case 3: return <StepMonth data={data} onChange={updateData} onNext={goNext} onBack={goBack} />;
      case 4: return <StepDuration data={data} onChange={updateData} onNext={goNext} onBack={goBack} />;
      case 5: return <StepBudget data={data} onChange={updateData} onNext={goNext} onBack={goBack} />;
      case 6: return <StepStay data={data} onChange={updateData} onNext={goNext} onBack={goBack} />;
      case 7: return <StepIntention data={data} onChange={updateData} onNext={goNext} onBack={goBack} />;
      case 8: return <StepRange data={data} onChange={updateData} onNext={goNext} onBack={goBack} />;
      case 9: return <StepMovement data={data} onChange={updateData} onNext={goNext} onBack={goBack} />;
      case 10: return <StepPacing data={data} onChange={updateData} onNext={goNext} onBack={goBack} />;
      case 11: return <StepPracticeLevel data={data} onChange={updateData} onNext={goNext} onBack={goBack} />;
      case 12: return <StepPracticeInterests data={data} onChange={updateData} onNext={goNext} onBack={goBack} />;
      case 13: return <StepProfile data={data} onBack={goBack} onUnlock={handleUnlock} generating={generating} />;
      default: return null;
    }
  };

  return (
    <div ref={containerRef} className="font-body min-h-screen overflow-y-auto relative" style={{
      background: step === 0 ? C.cream : `linear-gradient(180deg, ${C.cream} 0%, ${C.white} 50%, ${C.cream} 100%)`,
    }}>
      <Helmet>
        <title>Plan Your Trip — Custom Itineraries for Mindful Adventure | Lila Trips</title>
        <meta name="description" content="Answer a few questions about how you want to feel, and we'll build a personalized itinerary around your intentions, pace, and the land you're entering." />
        <link rel="canonical" href="https://lilatrips.com/plan" />
        <meta property="og:title" content="Plan Your Trip — Custom Itineraries for Mindful Adventure | Lila Trips" />
        <meta property="og:description" content="Answer a few questions about how you want to feel, and we'll build a personalized itinerary around your intentions, pace, and the land you're entering." />
        <meta property="og:url" content="https://lilatrips.com/plan" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://lilatrips.com/og-image.png" />
        <meta property="og:image:alt" content="Plan Your Trip — Lila Trips" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Plan Your Trip — Custom Itineraries for Mindful Adventure | Lila Trips" />
        <meta name="twitter:description" content="Answer a few questions about how you want to feel, and we'll build a personalized itinerary around your intentions, pace, and the land you're entering." />
        <meta name="twitter:image" content="https://lilatrips.com/og-image.png" />
      </Helmet>
      <div className="fixed top-0 left-0 right-0 z-[100] flex justify-between items-center pointer-events-none" style={{
        /* dynamic */
        padding: "16px 20px",
        background: step === 0 ? "transparent" : `linear-gradient(180deg, ${C.cream}ee 0%, ${C.cream}00 100%)`,
        transition: "background 0.4s",
      }}>
        <Link to="/" className="font-body text-[clamp(18px,4.5vw,22px)] font-medium tracking-[0.08em] text-dark-ink pointer-events-auto no-underline">Lila Trips</Link>
        <button onClick={handleClose} aria-label="Close" className="pointer-events-auto flex items-center justify-center cursor-pointer" style={{
          width: 40, height: 40, borderRadius: "50%",
          background: `${C.white}90`, border: `1px solid ${C.sage}18`,
          backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)",
        }}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke={C.sage} strokeWidth="1.8" strokeLinecap="round">
            <line x1="1" y1="1" x2="13" y2="13" /><line x1="13" y1="1" x2="1" y2="13" />
          </svg>
        </button>
      </div>

      <style>{`
        input[type="range"] { -webkit-tap-highlight-color: transparent; }
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none; appearance: none;
          width: 32px; height: 32px; border-radius: 50%;
          background: ${C.white}; border: 3px solid ${C.sage};
          box-shadow: 0 2px 10px rgba(0,0,0,0.15); cursor: pointer;
        }
        input[type="range"]::-moz-range-thumb {
          width: 32px; height: 32px; border-radius: 50%;
          background: ${C.white}; border: 3px solid ${C.sage};
          box-shadow: 0 2px 10px rgba(0,0,0,0.15); cursor: pointer;
        }
        input[type="range"]#duration-slider::-webkit-slider-thumb {
          -webkit-appearance: none; appearance: none;
          width: 28px; height: 28px; border-radius: 50%;
          background: #fff; border: 2.5px solid #4A9B9F;
          box-shadow: 0 2px 10px rgba(74,155,159,0.2);
          cursor: pointer;
        }
        input[type="range"]#duration-slider::-moz-range-thumb {
          width: 28px; height: 28px; border-radius: 50%;
          background: #fff; border: 2.5px solid #4A9B9F;
          box-shadow: 0 2px 10px rgba(74,155,159,0.2);
          cursor: pointer;
        }
        @keyframes fadeScale {
          from { opacity: 0; transform: scale(0.95) translateY(4px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>

      {/* Generating overlay */}
      {generating && <GeneratingScreen destination={data.destination} days={data.duration || 4} />}

      <div className={step === 0 ? "" : "max-w-[640px] mx-auto"} style={{
        /* dynamic */
        padding: step === 0 ? 0 : "76px 0 0",
        opacity: transitioning ? 0 : 1,
        transform: transitioning ? "translateY(12px)" : "translateY(0)",
        transition: "opacity 0.3s, transform 0.3s",
      }}>
        {step > 0 && step < 13 && <StepIndicator current={step - 1} total={TOTAL_INNER_STEPS} />}
        {renderStep()}
      </div>

      <LilaModal
        open={showLeaveModal}
        variant="confirm"
        message="Leave trip planner? Your selections won't be saved."
        confirmLabel="Leave"
        cancelLabel="Stay"
        onClose={() => setShowLeaveModal(false)}
        onConfirm={() => navigate('/')}
      />
      <LilaModal
        open={!!errorMessage}
        variant="alert"
        message={errorMessage}
        onClose={() => setErrorMessage(null)}
      />
    </div>
  );
}
