import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from 'react-router-dom';
import { C as BrandC } from '@data/brand';
import { translateFormToApi } from "../services/form-to-api";
import { trackEvent } from '@utils/analytics';
import { safeJson, fetchWithTimeout } from '@utils/fetchHelpers';
import LilaModal from '@components/LilaModal';

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

function IconBindu({ size, color }) {
  return (
    <Icon size={size} color={color}>
      <path d="M6 16 C6 10 9 6 12 4 C15 6 18 10 18 16" />
      <circle cx="12" cy="10" r="2" fill={`${color}25`} />
      <circle cx="12" cy="10" r="0.8" fill={color} stroke="none" />
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

function IconShide({ size, color }) {
  return (
    <Icon size={size} color={color}>
      <line x1="12" y1="2" x2="12" y2="22" />
      <path d="M12 5 L17 5 L17 9 L12 9" fill={`${color}08`} />
      <path d="M12 9 L7 9 L7 13 L12 13" fill={`${color}08`} />
      <path d="M12 13 L17 13 L17 17 L12 17" fill={`${color}08`} />
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
  { id: "zion", name: "Zion", subtitle: "Red cathedral walls", icon: IconMountain, gradient: `linear-gradient(135deg, ${C.sunSalmon}30, ${C.goldenAmber}20)` },
  { id: "joshuaTree", name: "Joshua Tree", subtitle: "Desert silence & starlight", icon: IconStars, gradient: `linear-gradient(135deg, ${C.goldenAmber}30, ${C.coralBlush}20)` },
  { id: "bigSur", name: "Big Sur", subtitle: "Where mountains meet the sea", icon: IconWave, gradient: `linear-gradient(135deg, ${C.oceanTeal}30, ${C.skyBlue}20)` },
  { id: "olympic", name: "Olympic", subtitle: "Temperate rainforest magic", icon: IconBodhiLeaf, gradient: `linear-gradient(135deg, ${C.seaGlass}30, ${C.sage}20)` },
  { id: "kauai", name: "Kauaʻi", subtitle: "Garden isle, sacred coast", icon: IconLotus, gradient: `linear-gradient(135deg, ${C.seaGlass}20, ${C.oceanTeal}30)` },
  { id: "vancouver", name: "Vancouver Island", subtitle: "Wild coast, ancient forest", icon: IconTorii, gradient: `linear-gradient(135deg, ${C.sage}25, ${C.seaGlass}20)` },
];

const INTENTIONS = [
  { id: "reconnect", label: "Reconnect", desc: "Remember you're part of something bigger.", icon: IconEnso, color: C.oceanTeal },
  { id: "tune_in", label: "Tune In", desc: "Get quiet enough to hear yourself again.", icon: IconLotus, color: C.skyBlue },
  { id: "slow_down", label: "Slow Down", desc: "Give yourself permission to stop rushing.", icon: IconWave, color: C.seaGlass },
  { id: "light_up", label: "Light Up", desc: "Chase the moments that make you feel alive.", icon: IconFlame, color: C.sunSalmon },
];


const PRACTICES = [
  { id: "yoga", label: "Yoga", icon: IconLotus, color: C.oceanTeal },
  { id: "breathwork", label: "Breathwork", icon: IconShide, color: C.skyBlue },
  { id: "coldPlunge", label: "Cold Plunge", icon: IconWave, color: C.seaGlass },
  { id: "meditation", label: "Meditation", icon: IconEnso, color: C.sage },
  { id: "hiking", label: "Mindful Hiking", icon: IconMountain, color: C.goldenAmber },
  { id: "stargazing", label: "Stargazing", icon: IconStars, color: C.slateLight },
  { id: "localFarms", label: "Local Farms", icon: IconBindu, color: C.seaGlass },
  { id: "soundBath", label: "Sound Bath", icon: IconSoundBath, color: C.sageLight },
  { id: "sauna", label: "Sauna", icon: IconFlame, color: C.sunSalmon },
  { id: "service", label: "Service Work", icon: IconDharmaWheel, color: C.seaGlass },
  { id: "plantMedicine", label: "Plant Medicine", icon: IconBodhiLeaf, color: C.sage },
  { id: "massage", label: "Massage", icon: IconMassage, color: C.coralBlush },
  { id: "biking", label: "Biking", icon: IconBike, color: C.skyBlue },
  { id: "birding", label: "Local Culture", icon: IconTorii, color: C.sage },
  { id: "liveMusic", label: "Live Music", icon: IconMusic, color: C.sunSalmon },
  { id: "wildlife", label: "Wildlife", icon: IconPaw, color: C.goldenAmber },
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
    <div style={{ display: "flex", gap: 6, justifyContent: "center", marginBottom: 32, padding: "0 24px" }}>
      {Array.from({ length: total }, (_, i) => (
        <div key={i} style={{
          width: i === current ? 28 : 8, height: 8, borderRadius: 4,
          background: i === current ? C.oceanTeal : i < current ? C.sage : `${C.sage}30`,
          transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
        }} />
      ))}
    </div>
  );
}

function NavButtons({ onBack, onNext, nextLabel = "Continue", nextDisabled = false, showBack = true }) {
  return (
    <div style={{ display: "flex", gap: 12, justifyContent: "center", padding: "40px 24px" }}>
      {showBack && (
        <button onClick={onBack} style={{
          fontFamily: "'Quicksand', sans-serif",
          fontSize: 14, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase",
          background: "none", border: `1.5px solid ${C.sage}40`,
          color: C.sage, padding: "14px 28px", borderRadius: 40,
          cursor: "pointer", transition: "all 0.3s",
          minHeight: 48, WebkitTapHighlightColor: "transparent",
        }}>Back</button>
      )}
      <button onClick={onNext} disabled={nextDisabled} style={{
        fontFamily: "'Quicksand', sans-serif",
        fontSize: 14, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase",
        background: nextDisabled ? `${C.oceanTeal}30` : C.oceanTeal,
        border: "none", color: C.white, padding: "14px 36px", borderRadius: 40,
        cursor: nextDisabled ? "not-allowed" : "pointer",
        transition: "all 0.3s", opacity: nextDisabled ? 0.5 : 1,
        boxShadow: nextDisabled ? "none" : `0 4px 20px ${C.oceanTeal}30`,
        minHeight: 48, WebkitTapHighlightColor: "transparent",
      }}>{nextLabel}</button>
    </div>
  );
}

function StepTitle({ eyebrow, title, subtitle }) {
  return (
    <div style={{ textAlign: "center", marginBottom: 32, padding: "0 24px" }}>
      {eyebrow && (
        <span style={{
          fontFamily: "'Quicksand', sans-serif",
          fontSize: 12, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase",
          color: C.oceanTeal, display: "block", marginBottom: 14,
        }}>{eyebrow}</span>
      )}
      <h2 style={{
        fontFamily: "'Cormorant Garamond', serif",
        fontSize: "clamp(28px, 6vw, 36px)", fontWeight: 300, lineHeight: 1.2,
        color: C.slate, marginBottom: subtitle ? 12 : 0,
      }}>{title}</h2>
      {subtitle && (
        <p style={{
          fontFamily: "'Quicksand', sans-serif",
          fontSize: "clamp(14px, 3.5vw, 15px)", fontWeight: 400, color: `${C.slate}BB`,
          lineHeight: 1.6, maxWidth: 480, margin: "0 auto",
        }}>{subtitle}</p>
      )}
    </div>
  );
}

// ─── Radar Chart ─────────────────────────────────────────────────────────────
function RadarChart({ values, size = 260 }) {
  const pad = 32;
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

// ─── Additional Welcome Screen Icons (matching Ways to Travel page) ──────────
function IconCircleDot({ size, color }) {
  // Matches "Plan a Trip" icon on offerings page
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
      <circle cx="14" cy="14" r="11" stroke={color} strokeWidth="1.5" fill="none" />
      <circle cx="14" cy="14" r="3.5" fill={color} stroke="none" />
    </svg>
  );
}

function IconCrescent({ size, color }) {
  // Matches "Join a Group" icon on offerings page
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
      <path d="M18 6 A10 10 0 1 0 18 22 A7 7 0 1 1 18 6 Z" stroke={color} strokeWidth="1.5" fill="none" />
    </svg>
  );
}

function IconTriangle({ size, color }) {
  // Matches "Designed for You" icon on offerings page
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
      <path d="M4 20 L14 6 L24 20" stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconArrowRight({ size = 16, color = C.white }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="3" y1="8" x2="13" y2="8" />
      <polyline points="9,4 13,8 9,12" />
    </svg>
  );
}

// ─── Welcome Path Card ──────────────────────────────────────────────────────
function WelcomePathCard({ icon: IconComp, title, subtitle, description, buttonLabel, isPrimary, tag, tagColor, delay, visible, onClick }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        background: C.white,
        border: isPrimary ? `2px solid ${C.sage}30` : `1px solid ${C.sage}15`,
        borderRadius: 2,
        padding: isPrimary ? "32px 28px 28px" : "24px 24px 22px",
        cursor: "pointer",
        transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
        opacity: visible ? 1 : 0,
        transform: visible ? (hovered ? "translateY(-2px)" : "translateY(0)") : "translateY(16px)",
        transitionDelay: visible ? `${delay}ms` : "0ms",
        boxShadow: isPrimary
          ? (hovered ? `0 12px 48px ${C.sage}18, 0 4px 12px ${C.sage}10` : `0 8px 40px ${C.sage}12, 0 2px 8px ${C.sage}08`)
          : (hovered ? `0 6px 24px ${C.sage}12` : `0 2px 12px ${C.sage}06`),
        WebkitTapHighlightColor: "transparent",
      }}
    >
      {tag && (
        <div style={{
          position: "absolute", top: -10, left: 24,
          background: tagColor || C.oceanTeal,
          color: C.white,
          fontFamily: "'Quicksand', sans-serif",
          fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase",
          padding: "4px 14px", borderRadius: 20,
        }}>{tag}</div>
      )}
      <div style={{ display: "flex", alignItems: "flex-start", gap: isPrimary ? 20 : 16 }}>
        <div style={{
          width: isPrimary ? 52 : 44, height: isPrimary ? 52 : 44,
          borderRadius: 14,
          background: isPrimary ? `${C.oceanTeal}10` : `${C.sage}08`,
          display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0,
        }}>
          <IconComp size={isPrimary ? 26 : 22} color={isPrimary ? C.oceanTeal : C.sage} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontFamily: "'Quicksand', sans-serif",
            fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase",
            color: isPrimary ? C.oceanTeal : `${C.sage}AA`,
            marginBottom: 4,
          }}>{subtitle}</div>
          <h3 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: isPrimary ? "clamp(22px, 5vw, 26px)" : "clamp(18px, 4.5vw, 22px)",
            fontWeight: 400, lineHeight: 1.2,
            color: C.slate, margin: "2px 0 0",
          }}>{title}</h3>
          <p style={{
            fontFamily: "'Quicksand', sans-serif",
            fontSize: isPrimary ? 14 : 13, fontWeight: 400,
            color: `${C.slate}99`, lineHeight: 1.55,
            margin: "8px 0 0",
          }}>{description}</p>
          <div style={{ marginTop: isPrimary ? 20 : 14 }}>
            <span style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              fontFamily: "'Quicksand', sans-serif",
              fontSize: 13, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase",
              ...(isPrimary ? {
                background: "none",
                color: C.oceanTeal,
                padding: "11px 28px",
                border: `1.5px solid ${C.oceanTeal}`,
                borderRadius: 2,
              } : {
                background: "none",
                color: C.sage,
                padding: 0,
              }),
            }}>
              {buttonLabel}
              <IconArrowRight size={14} color={isPrimary ? C.oceanTeal : C.sage} />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// STEPS
// ═══════════════════════════════════════════════════════════════════════════════

function StepWelcome({ onNext }) {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  useEffect(() => { setTimeout(() => setVisible(true), 100); }, []);
  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center",
      minHeight: "100vh", padding: "min(10vh, 120px) 20px 40px", textAlign: "center",
    }}>
      {/* Hero */}
      <div style={{
        opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(20px)",
        transition: "all 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
        marginBottom: 8,
      }}>
        <div style={{ marginBottom: 10, opacity: 0.45, display: "flex", justifyContent: "center" }}>
          <IconEnso size={32} color={C.sage} />
        </div>
        <h1 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: "clamp(32px, 7.5vw, 42px)", fontWeight: 300, lineHeight: 1.15,
          color: C.slate, marginBottom: 16, maxWidth: 460, margin: "0 auto",
        }}>Let's design<br />your journey</h1>
      </div>

      {/* Three paths */}
      <div style={{
        display: "flex", flexDirection: "column", gap: 16,
        marginTop: 24, width: "100%", maxWidth: 520,
      }}>
        {/* PRIMARY: DIY Path */}
        <WelcomePathCard
          icon={IconCircleDot}
          subtitle="Self-Guided"
          title="Plan My Own Trip"
          description="Answer a few questions about what you're seeking and we'll craft a personalized itinerary — complete with trails, wellness practices, timing, and local picks."
          buttonLabel="Design Your Trip"
          isPrimary={true}
          tag="Beta"
          tagColor={C.oceanTeal}
          delay={200}
          visible={visible}
          onClick={onNext}
        />

        {/* SECONDARY ROW */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {/* Group Trips */}
          {[
            {
              icon: IconCrescent, color: C.sunSalmon, eyebrow: "Join a Group",
              title: "Explore Group Trips",
              desc: "Join others on curated Threshold Trips timed to nature's crescendos.",
              cta: "View Trips", delay: "350ms",
              onClick: () => navigate('/offerings'),
            },
            {
              icon: IconTriangle, color: C.goldenAmber, eyebrow: "Designed for You",
              title: "Expert Planning",
              desc: "Work with a trip designer to build something completely bespoke.",
              cta: "Learn More", delay: "450ms",
              onClick: () => navigate('/offerings'),
            },
          ].map((card) => {
            const Ic = card.icon;
            return (
              <div key={card.eyebrow}
                onClick={card.onClick}
                style={{
                  position: "relative",
                  background: C.white,
                  border: `1px solid ${C.sage}15`,
                  borderRadius: 2,
                  padding: "22px 20px",
                  cursor: "pointer",
                  transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                  opacity: visible ? 1 : 0,
                  transform: visible ? "translateY(0)" : "translateY(16px)",
                  transitionDelay: card.delay,
                  boxShadow: `0 2px 12px ${C.sage}06`,
                  textAlign: "center",
                  WebkitTapHighlightColor: "transparent",
                }}
              >
                <div style={{
                  position: "absolute", top: -9, left: "50%", transform: "translateX(-50%)",
                  fontFamily: "'Quicksand', sans-serif",
                  fontSize: 9, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase",
                  color: "#aab0b8",
                  border: "1px solid #d0d5d9",
                  background: C.white,
                  padding: "3px 7px",
                }}>In Dev</div>
                <div style={{
                  width: 44, height: 44, borderRadius: 12,
                  background: `${card.color}10`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  margin: "0 auto 14px",
                }}>
                  <Ic size={22} color={card.color} />
                </div>
                <div style={{
                  fontFamily: "'Quicksand', sans-serif",
                  fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase",
                  color: card.color, marginBottom: 6,
                }}>{card.eyebrow}</div>
                <h3 style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "clamp(17px, 4vw, 20px)", fontWeight: 400, lineHeight: 1.2,
                  color: C.slate, margin: 0,
                }}>{card.title}</h3>
                <p style={{
                  fontFamily: "'Quicksand', sans-serif",
                  fontSize: 13, fontWeight: 400,
                  color: `${C.slate}99`, lineHeight: 1.5,
                  margin: "8px 0 0",
                }}>{card.desc}</p>
                <div style={{
                  marginTop: 14, display: "inline-flex", alignItems: "center", gap: 6,
                  fontFamily: "'Quicksand', sans-serif",
                  fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
                  color: card.color,
                }}>
                  {card.cta} <IconArrowRight size={12} color={card.color} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Trust bar */}
      <div style={{
        opacity: visible ? 1 : 0,
        transition: "opacity 0.8s 0.6s",
        borderTop: `1px solid ${C.sage}12`,
        paddingTop: 20, marginTop: 24, width: "100%", maxWidth: 520,
        textAlign: "center",
      }}>
        <div style={{
          fontFamily: "'Quicksand', sans-serif",
          fontSize: 11, fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase",
          color: `${C.sage}99`, marginBottom: 12,
        }}>Powered by</div>
        <div style={{
          display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "6px 16px",
        }}>
          {[
            "National Park Service Data",
            "Real-Time Weather",
            "Lunar Cycle Timing",
            "Local Partner Network",
          ].map(item => (
            <span key={item} style={{
              fontFamily: "'Quicksand', sans-serif",
              fontSize: 12, fontWeight: 500, color: `${C.slate}99`,
              display: "flex", alignItems: "center", gap: 5,
            }}>
              <span style={{ width: 3, height: 3, borderRadius: "50%", background: `${C.oceanTeal}40`, flexShrink: 0 }} />
              {item}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function StepDestination({ data, onChange, onNext, onBack }) {
  const AVAILABLE = new Set(["zion", "joshuaTree", "bigSur", "olympic", "kauai", "vancouver"]); // destinations with guides ready

  // Auto-select if only one destination available
  useEffect(() => {
    if (!data.destination && AVAILABLE.size === 1) {
      onChange({ destination: [...AVAILABLE][0] });
    }
  }, []);
  return (
    <div>
      <StepTitle eyebrow="Where" title="Where is calling you?" subtitle="Choose the landscape that stirs something." />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 12, maxWidth: 560, margin: "0 auto", padding: "0 20px" }}>
        {DESTINATIONS.map(d => {
          const sel = data.destination === d.id;
          const available = AVAILABLE.has(d.id);
          const Ic = d.icon;
          return (
            <button key={d.id}
              onClick={() => available && onChange({ destination: d.id })}
              style={{
                position: "relative",
                background: !available ? `${C.sage}06` : sel ? `${C.oceanTeal}10` : C.white,
                border: `2px solid ${!available ? `${C.sage}10` : sel ? C.oceanTeal : `${C.sage}18`}`,
                borderRadius: 16, padding: "22px 14px",
                cursor: available ? "pointer" : "default",
                transition: "all 0.3s",
                textAlign: "center", minHeight: 110,
                boxShadow: sel ? `0 4px 20px ${C.sage}15` : "0 1px 4px rgba(0,0,0,0.04)",
                transform: sel ? "scale(1.02)" : "scale(1)",
                opacity: available ? 1 : 0.45,
                WebkitTapHighlightColor: "transparent",
              }}>
              {!available && (
                <div style={{
                  position: "absolute", top: 8, right: 8,
                  fontFamily: "'Quicksand', sans-serif",
                  fontSize: 9, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase",
                  color: C.sage, background: `${C.sage}12`,
                  padding: "3px 7px", borderRadius: 6,
                }}>Soon</div>
              )}
              <div style={{ display: "flex", justifyContent: "center", marginBottom: 10 }}>
                <Ic size={28} color={sel ? C.sage : `${C.sage}AA`} />
              </div>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(16px, 4vw, 18px)", fontWeight: 600, color: C.slate, marginBottom: 3 }}>{d.name}</div>
              <div style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 12, color: `${C.slate}99`, lineHeight: 1.3 }}>{d.subtitle}</div>
            </button>
          );
        })}
      </div>
      <NavButtons onBack={onBack} onNext={onNext} nextDisabled={!data.destination} showBack={false} />
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
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 10, maxWidth: 480, margin: '0 auto', padding: '0 20px',
      }}>
        {MONTHS.map(m => {
          const sel = data.month === m.id;
          const isGolden = goldenMonths.has(m.id);
          return (
            <button key={m.id} onClick={() => { onChange({ month: m.id }); if (showDates) { onChange({ month: m.id, dateStart: null, dateEnd: null }); setShowDates(false); } }} style={{
              position: 'relative',
              background: sel ? `${m.color}18` : C.white,
              border: `2px solid ${sel ? m.color : isGolden ? `${C.goldenAmber}35` : `${C.sage}18`}`,
              borderRadius: 14, padding: '16px 10px',
              cursor: 'pointer', transition: 'all 0.3s',
              textAlign: 'center', minHeight: 80,
              boxShadow: sel ? `0 3px 16px ${m.color}20` : isGolden ? `0 1px 8px ${C.goldenAmber}12` : '0 1px 4px rgba(0,0,0,0.04)',
              transform: sel ? 'scale(1.03)' : 'scale(1)',
              WebkitTapHighlightColor: 'transparent',
            }}>
              {isGolden && (
                <div style={{
                  position: 'absolute', top: 6, right: 6,
                  width: 7, height: 7, borderRadius: '50%',
                  background: C.goldenAmber, opacity: 0.6,
                }} />
              )}
              <div style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 'clamp(15px, 3.8vw, 17px)', fontWeight: 600,
                color: sel ? C.slate : `${C.slate}BB`, marginBottom: 3,
              }}>{m.label}</div>
              <div style={{
                fontFamily: "'Quicksand', sans-serif",
                fontSize: 10, fontWeight: 600, letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: sel ? m.color : `${C.sage}90`,
              }}>{(DESTINATION_WINDOWS[data.destination] || {})[m.id] || m.window}</div>
            </button>
          );
        })}
      </div>

      {/* Exact dates toggle */}
      {data.month && (
        <div style={{ maxWidth: 480, margin: '0 auto', padding: '0 20px' }}>
          <button onClick={toggleDates} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            width: '100%', padding: '12px 16px',
            background: 'none', border: 'none', cursor: 'pointer',
            fontFamily: "'Quicksand', sans-serif",
            fontSize: 13, fontWeight: 600, letterSpacing: '0.06em',
            color: showDates ? C.oceanTeal : `${C.sage}70`,
            WebkitTapHighlightColor: 'transparent',
          }}>
            <div style={{
              width: 16, height: 16, borderRadius: 4,
              border: `1.5px solid ${showDates ? C.oceanTeal : `${C.sage}40`}`,
              background: showDates ? C.oceanTeal : 'transparent',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.2s',
              flexShrink: 0,
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
            <div style={{
              display: 'flex', gap: 12, marginTop: 12,
              animation: 'fadeScale 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            }}>
              <div style={{ flex: 1 }}>
                <label style={{
                  display: 'block', marginBottom: 6,
                  fontFamily: "'Quicksand', sans-serif",
                  fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase',
                  color: `${C.sage}AA`,
                }}>Start date</label>
                <input
                  type="date"
                  value={data.dateStart || ''}
                  onChange={e => handleDateChange({ dateStart: e.target.value })}
                  style={{
                    width: '100%', padding: '14px 14px',
                    fontFamily: "'Quicksand', sans-serif", fontSize: 14, color: C.slate,
                    background: C.white, border: `1.5px solid ${C.sage}20`, borderRadius: 12,
                    outline: 'none', boxSizing: 'border-box',
                    WebkitAppearance: 'none',
                  }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{
                  display: 'block', marginBottom: 6,
                  fontFamily: "'Quicksand', sans-serif",
                  fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase',
                  color: `${C.sage}AA`,
                }}>End date</label>
                <input
                  type="date"
                  value={data.dateEnd || ''}
                  min={data.dateStart || ''}
                  onChange={e => handleDateChange({ dateEnd: e.target.value })}
                  style={{
                    width: '100%', padding: '14px 14px',
                    fontFamily: "'Quicksand', sans-serif", fontSize: 14, color: C.slate,
                    background: C.white, border: `1.5px solid ${C.sage}20`, borderRadius: 12,
                    outline: 'none', boxSizing: 'border-box',
                    WebkitAppearance: 'none',
                  }}
                />
              </div>
            </div>
          )}
        </div>
      )}

      <div style={{ marginTop: showDates ? -16 : 0 }}>
        <NavButtons onBack={onBack} onNext={onNext} nextDisabled={!data.month} />
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
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, maxWidth: 480, margin: "0 auto", padding: "0 20px" }}>
        {INTENTIONS.map(item => {
          const active = selected.includes(item.id);
          const Ic = item.icon;
          return (
            <button key={item.id} onClick={() => toggle(item.id)} style={{
              background: active ? `${item.color}12` : C.white,
              border: `2px solid ${active ? item.color : `${C.sage}18`}`,
              borderRadius: 16, padding: "24px 16px",
              cursor: "pointer", transition: "all 0.35s",
              textAlign: "center", minHeight: 140,
              boxShadow: active ? `0 4px 20px ${item.color}20` : "0 1px 4px rgba(0,0,0,0.04)",
              WebkitTapHighlightColor: "transparent",
            }}>
              <div style={{ display: "flex", justifyContent: "center", marginBottom: 10, transition: "opacity 0.3s", opacity: active ? 1 : 0.4 }}>
                <Ic size={30} color={active ? item.color : C.sage} />
              </div>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(16px, 4vw, 18px)", fontWeight: 600, color: C.slate, marginBottom: 3 }}>{item.label}</div>
              <div style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 12, color: `${C.slate}99`, lineHeight: 1.3 }}>{item.desc}</div>
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
      <div style={{ maxWidth: 440, margin: "0 auto", padding: "0 28px" }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(32px, 8vw, 40px)", fontWeight: 300, color: C.sage, marginBottom: 6 }}>{labels[labelIndex]}</div>
          <p style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 14, color: `${C.slate}99`, lineHeight: 1.6 }}>{descriptions[labelIndex]}</p>
        </div>
        <div style={{ position: "relative", padding: "16px 0" }}>
          <div style={{ position: "absolute", top: "50%", left: 0, right: 0, height: 6, background: `${C.sage}18`, borderRadius: 3, transform: "translateY(-50%)" }} />
          <div style={{ position: "absolute", top: "50%", left: 0, width: `${val}%`, height: 6, background: `linear-gradient(90deg, ${C.oceanTeal}, ${C.goldenAmber}, ${C.sunSalmon})`, borderRadius: 3, transform: "translateY(-50%)", transition: "width 0.15s" }} />
          <input type="range" min={0} max={100} value={val}
            onChange={e => onChange({ movement: Number(e.target.value) })}
            style={{ width: "100%", appearance: "none", WebkitAppearance: "none", background: "transparent", cursor: "pointer", position: "relative", zIndex: 2, height: 44, WebkitTapHighlightColor: "transparent" }}
          />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <IconYinYang size={16} color={C.oceanTeal} />
            <span style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 12, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: C.oceanTeal }}>Yin</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 12, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: C.sunSalmon }}>Yang</span>
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
      <div style={{ maxWidth: 460, margin: "0 auto", padding: "0 28px" }}>
        {/* Current level display */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>
            <Ic size={32} color={C.oceanTeal} />
          </div>
          <div style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "clamp(24px, 6vw, 32px)", fontWeight: 300, color: C.sage, marginBottom: 8,
          }}>{current.label}</div>
          <p style={{
            fontFamily: "'Quicksand', sans-serif",
            fontSize: "clamp(13px, 3.2vw, 14px)", color: `${C.slate}AA`, lineHeight: 1.65,
            minHeight: 48,
          }}>{current.desc}</p>
        </div>

        {/* Slider */}
        <div style={{ position: "relative", padding: "16px 0" }}>
          <div style={{ position: "absolute", top: "50%", left: 0, right: 0, height: 6, background: `${C.sage}18`, borderRadius: 3, transform: "translateY(-50%)" }} />
          <div style={{
            position: "absolute", top: "50%", left: 0,
            width: `${(level / 3) * 100}%`, height: 6,
            background: `linear-gradient(90deg, ${C.seaGlass}, ${C.oceanTeal})`,
            borderRadius: 3, transform: "translateY(-50%)", transition: "width 0.2s",
          }} />
          <input type="range" min={0} max={3} step={1} value={level}
            onChange={e => onChange({ practiceLevel: Number(e.target.value) })}
            style={{
              width: "100%", appearance: "none", WebkitAppearance: "none",
              background: "transparent", cursor: "pointer", position: "relative", zIndex: 2,
              height: 44, WebkitTapHighlightColor: "transparent",
            }}
          />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 4 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <IconBodhiLeaf size={14} color={C.seaGlass} />
            <span style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: "0.06em", color: C.seaGlass }}>Curious</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <span style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: "0.06em", color: C.oceanTeal }}>Deep</span>
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
      <div style={{ maxWidth: 460, margin: "0 auto", padding: "0 28px" }}>
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(4, 1fr)",
          gap: 10, maxWidth: 420, margin: "0 auto",
        }}>
          {PRACTICES.map(p => {
            const active = selected.includes(p.id);
            const Pic = p.icon;
            return (
              <button key={p.id} onClick={() => toggle(p.id)} style={{
                background: active ? `${p.color}12` : C.white,
                border: `1.5px solid ${active ? p.color : `${C.sage}15`}`,
                borderRadius: 14, padding: "18px 8px",
                cursor: "pointer", transition: "all 0.3s",
                textAlign: "center", minHeight: 80,
                boxShadow: active ? `0 3px 14px ${p.color}15` : "0 1px 4px rgba(0,0,0,0.04)",
                WebkitTapHighlightColor: "transparent",
              }}>
                <div style={{ display: "flex", justifyContent: "center", marginBottom: 6 }}>
                  <Pic size={24} color={active ? p.color : `${C.sage}50`} />
                </div>
                <div style={{
                  fontFamily: "'Quicksand', sans-serif",
                  fontSize: 12, fontWeight: 600, color: active ? C.slate : `${C.slate}AA`, lineHeight: 1.2,
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
      <div style={{ maxWidth: 440, margin: "0 auto", padding: "0 28px" }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(32px, 8vw, 40px)", fontWeight: 300, color: C.sage, marginBottom: 6 }}>{labels[labelIndex]}</div>
          <p style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 14, color: `${C.slate}99`, lineHeight: 1.6 }}>{descriptions[labelIndex]}</p>
        </div>
        <div style={{ position: "relative", padding: "16px 0" }}>
          <div style={{ position: "absolute", top: "50%", left: 0, right: 0, height: 6, background: `${C.sage}18`, borderRadius: 3, transform: "translateY(-50%)" }} />
          <div style={{ position: "absolute", top: "50%", left: 0, width: `${val}%`, height: 6, background: `linear-gradient(90deg, ${C.oceanTeal}, ${C.goldenAmber})`, borderRadius: 3, transform: "translateY(-50%)", transition: "width 0.15s" }} />
          <input type="range" min={0} max={100} value={val}
            onChange={e => onChange({ pacing: Number(e.target.value) })}
            style={{ width: "100%", appearance: "none", WebkitAppearance: "none", background: "transparent", cursor: "pointer", position: "relative", zIndex: 2, height: 44, WebkitTapHighlightColor: "transparent" }}
          />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <IconWave size={16} color={C.oceanTeal} />
            <span style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 12, fontWeight: 600, letterSpacing: "0.08em", color: C.oceanTeal }}>Spacious</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 12, fontWeight: 600, letterSpacing: "0.08em", color: C.goldenAmber }}>Full</span>
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
      <div style={{ maxWidth: 440, margin: "0 auto", padding: "0 28px" }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(32px, 8vw, 40px)", fontWeight: 300, color: C.sage, marginBottom: 6 }}>{labels[labelIndex]}</div>
          <p style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 14, color: `${C.slate}99`, lineHeight: 1.6 }}>{descriptions[labelIndex]}</p>
        </div>
        <div style={{ position: "relative", padding: "16px 0" }}>
          <div style={{ position: "absolute", top: "50%", left: 0, right: 0, height: 6, background: `${C.sage}18`, borderRadius: 3, transform: "translateY(-50%)" }} />
          <div style={{ position: "absolute", top: "50%", left: 0, width: `${val}%`, height: 6, background: `linear-gradient(90deg, ${C.seaGlass}, ${C.skyBlue}, ${C.goldenAmber})`, borderRadius: 3, transform: "translateY(-50%)", transition: "width 0.15s" }} />
          <input type="range" min={0} max={100} value={val}
            onChange={e => onChange({ range: Number(e.target.value) })}
            style={{ width: "100%", appearance: "none", WebkitAppearance: "none", background: "transparent", cursor: "pointer", position: "relative", zIndex: 2, height: 44, WebkitTapHighlightColor: "transparent" }}
          />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <IconMountain size={16} color={C.seaGlass} />
            <span style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 12, fontWeight: 600, letterSpacing: "0.08em", color: C.seaGlass }}>Rooted</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 12, fontWeight: 600, letterSpacing: "0.08em", color: C.goldenAmber }}>Drift</span>
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

  return (
    <div>
      <StepTitle
        eyebrow="Duration"
        title="How many days?"
        subtitle="We recommend 4–7 days for a transformative experience."
      />
      <div style={{ maxWidth: 480, margin: "0 auto", padding: "0 20px" }}>
        <div style={{
          background: C.white, borderRadius: 2, padding: "36px 24px",
          border: `1px solid ${C.sage}12`,
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 28 }}>
            <button onClick={() => onChange({ duration: Math.max(2, days - 1) })} style={{
              width: 48, height: 48, borderRadius: "50%",
              background: "transparent", border: `2px solid ${C.sage}25`,
              cursor: "pointer", fontSize: 20, color: C.sage,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: "'Quicksand', sans-serif", WebkitTapHighlightColor: "transparent",
            }}>−</button>
            <div style={{ textAlign: "center", minWidth: 60 }}>
              <div style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "clamp(48px, 12vw, 60px)", fontWeight: 300, color: C.slate, lineHeight: 1,
              }}>{days}</div>
              <div style={{
                fontFamily: "'Quicksand', sans-serif",
                fontSize: 12, fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase",
                color: `${C.sage}AA`, marginTop: 2,
              }}>days</div>
            </div>
            <button onClick={() => onChange({ duration: Math.min(14, days + 1) })} style={{
              width: 48, height: 48, borderRadius: "50%",
              background: "transparent", border: `2px solid ${C.sage}25`,
              cursor: "pointer", fontSize: 20, color: C.sage,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: "'Quicksand', sans-serif", WebkitTapHighlightColor: "transparent",
            }}>+</button>
          </div>
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
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, maxWidth: 480, margin: "0 auto", padding: "0 20px" }}>
        {GROUP_TYPES.map(item => {
          const active = selected === item.id;
          const Ic = item.icon;
          return (
            <button key={item.id} onClick={() => handleSelect(item.id)} style={{
              background: active ? `${item.color}12` : C.white,
              border: `2px solid ${active ? item.color : `${C.sage}18`}`,
              borderRadius: 16, padding: "24px 16px",
              cursor: "pointer", transition: "all 0.35s",
              textAlign: "center", minHeight: 140,
              boxShadow: active ? `0 4px 20px ${item.color}20` : "0 1px 4px rgba(0,0,0,0.04)",
              WebkitTapHighlightColor: "transparent",
            }}>
              <div style={{ display: "flex", justifyContent: "center", marginBottom: 10, transition: "opacity 0.3s", opacity: active ? 1 : 0.4 }}>
                <Ic size={30} color={active ? item.color : C.sage} />
              </div>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(16px, 4vw, 18px)", fontWeight: 600, color: C.slate, marginBottom: 3 }}>{item.label}</div>
              <div style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 12, color: `${C.slate}99`, lineHeight: 1.3 }}>{item.desc}</div>
            </button>
          );
        })}
      </div>
      {showCounter && (
        <div style={{
          maxWidth: 480, margin: "12px auto 0", padding: "0 20px",
          animation: "fadeScale 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
        }}>
          <div style={{
            background: C.white, borderRadius: 2, padding: "16px 24px",
            border: `1px solid ${C.sage}12`,
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 28 }}>
              <button onClick={() => onChange({ groupSize: Math.max(2, groupSize - 1) })} style={{
                width: 48, height: 48, borderRadius: "50%",
                background: "transparent", border: `2px solid ${C.sage}25`,
                cursor: "pointer", fontSize: 20, color: C.sage,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: "'Quicksand', sans-serif", WebkitTapHighlightColor: "transparent",
              }}>−</button>
              <div style={{ textAlign: "center", minWidth: 60 }}>
                <div style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "clamp(48px, 12vw, 60px)", fontWeight: 300, color: C.slate, lineHeight: 1,
                }}>{groupSize}</div>
                <div style={{
                  fontFamily: "'Quicksand', sans-serif",
                  fontSize: 12, fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase",
                  color: `${C.sage}AA`, marginTop: 2,
                }}>travelers</div>
              </div>
              <button onClick={() => onChange({ groupSize: Math.min(8, groupSize + 1) })} style={{
                width: 48, height: 48, borderRadius: "50%",
                background: "transparent", border: `2px solid ${C.sage}25`,
                cursor: "pointer", fontSize: 20, color: C.sage,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: "'Quicksand', sans-serif", WebkitTapHighlightColor: "transparent",
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
      <div style={{ maxWidth: 480, margin: "0 auto", padding: "0 20px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {BUDGET_TIERS.map(tier => {
            const active = data.budget === tier.id;
            return (
              <button key={tier.id} onClick={() => onChange({ budget: tier.id })} style={{
                display: "flex", alignItems: "center", gap: 14,
                background: active ? `${tier.color}08` : C.white,
                border: `1.5px solid ${active ? tier.color : `${C.sage}18`}`,
                borderRadius: 14, padding: "18px 20px",
                cursor: "pointer", transition: "all 0.25s",
                minHeight: 60, WebkitTapHighlightColor: "transparent",
                boxShadow: active ? `0 3px 16px ${tier.color}15` : "0 1px 4px rgba(0,0,0,0.04)",
                textAlign: "left",
              }}>
                <div style={{
                  fontFamily: "'Quicksand', sans-serif",
                  fontSize: 14, fontWeight: 700, color: active ? tier.color : `${C.sage}70`,
                  flexShrink: 0, minWidth: 40, textAlign: "center",
                }}>{tier.range}</div>
                <div style={{ flex: 1 }}>
                  <span style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: "clamp(16px, 4vw, 18px)", fontWeight: 600, color: C.slate,
                  }}>{tier.label}</span>
                  <span style={{
                    fontFamily: "'Quicksand', sans-serif",
                    fontSize: 13, color: `${C.slate}99`, marginLeft: 8,
                  }}>{tier.desc}</span>
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
      <div style={{ maxWidth: 480, margin: "0 auto", padding: "0 20px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {STAY_STYLES.map(style => {
            const active = data.stayStyle === style.id;
            const Ic = style.icon;
            return (
              <button key={style.id} onClick={() => onChange({ stayStyle: style.id })} style={{
                display: "flex", alignItems: "center", gap: 14,
                background: active ? `${style.color}08` : C.white,
                border: `1.5px solid ${active ? style.color : `${C.sage}18`}`,
                borderRadius: 14, padding: "18px 20px",
                cursor: "pointer", transition: "all 0.25s",
                minHeight: 60, WebkitTapHighlightColor: "transparent",
                boxShadow: active ? `0 3px 16px ${style.color}15` : "0 1px 4px rgba(0,0,0,0.04)",
                textAlign: "left",
              }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 12,
                  background: active ? `${style.color}12` : `${C.sage}08`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0, transition: "background 0.25s",
                }}>
                  <Ic size={20} color={active ? style.color : `${C.sage}60`} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <span style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: "clamp(16px, 4vw, 18px)", fontWeight: 600, color: C.slate,
                  }}>{style.label}</span>
                  <div style={{
                    fontFamily: "'Quicksand', sans-serif",
                    fontSize: 13, color: `${C.slate}99`, lineHeight: 1.4, marginTop: 2,
                  }}>{style.desc}</div>
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
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
         onClick={onClose}>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(26,37,48,0.6)' }} />
      <div onClick={e => e.stopPropagation()} style={{
        position: 'relative', background: '#FAF6F0', borderRadius: 0,
        width: '90vw', maxWidth: 520, maxHeight: '85vh', overflowY: 'auto',
        padding: '32px 24px',
        animation: 'fadeScale 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      }}>
        <button onClick={onClose} style={{
          position: 'absolute', top: 12, right: 12,
          width: 44, height: 44, background: 'none', border: 'none',
          fontSize: 20, color: C.sage, cursor: 'pointer',
        }}>×</button>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24, fontWeight: 300, color: C.slate }}>
            Travel Spirits
          </div>
        </div>
        {personas.map(p => (
          <div key={p.id} style={{
            borderLeft: `3px solid ${p.color}`,
            padding: '16px 20px', marginBottom: 12,
            background: p.id === currentId ? `${p.color}08` : 'transparent',
          }}>
            {p.id === currentId && (
              <div style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 10, fontWeight: 700,
                letterSpacing: '0.15em', textTransform: 'uppercase', color: p.color, marginBottom: 4 }}>
                Your profile
              </div>
            )}
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 300, color: C.slate }}>
              {p.name}
            </div>
            <div style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 10, fontWeight: 700,
              letterSpacing: '0.2em', textTransform: 'uppercase', color: p.color, marginTop: 2 }}>
              {p.subtitle}
            </div>
            <p style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 13, fontWeight: 400,
              color: `${C.slate}99`, lineHeight: 1.55, marginTop: 8, marginBottom: 0 }}>
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
      opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(20px)",
      transition: "all 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
    }}>
      <StepTitle eyebrow="Your Travel Spirit" />

      {/* Persona card */}
      <div style={{ maxWidth: 480, margin: "0 auto 12px", padding: "0 20px" }}>
        <div style={{
          background: C.white, borderRadius: 2, padding: "20px 20px",
          border: `2px solid ${persona.color}25`, boxShadow: `0 4px 24px ${persona.color}12`,
          textAlign: "center",
        }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 10 }}>
            <div style={{
              width: 44, height: 44, borderRadius: "50%",
              background: `${persona.color}12`, border: `1.5px solid ${persona.color}30`,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <PersonaIcon size={22} color={persona.color} />
            </div>
          </div>
          <div style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.25em", textTransform: "uppercase", color: persona.color, marginBottom: 6 }}>{persona.subtitle}</div>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(24px, 6vw, 30px)", fontWeight: 300, color: C.slate, marginBottom: 4, lineHeight: 1.1 }}>{persona.name}</div>
          <p style={{ fontFamily: "'Quicksand', sans-serif", fontSize: "clamp(13px, 3.2vw, 14px)", fontWeight: 400, color: `${C.slate}AA`, lineHeight: 1.55, marginTop: 10 }}>{persona.desc}</p>
        </div>
      </div>

      <div style={{ textAlign: 'center', marginTop: 8 }}>
        <button onClick={() => setShowProfilesModal(true)} style={{
          fontFamily: "'Quicksand', sans-serif", fontSize: 12, fontWeight: 500,
          color: `${C.sage}80`, background: 'none', border: 'none',
          cursor: 'pointer', padding: 8,
        }}>Not you? See all profiles →</button>
      </div>

      {showProfilesModal && (
        <ProfilesModal personas={PERSONAS} currentId={persona.id} onClose={() => setShowProfilesModal(false)} />
      )}

      <div style={{ display: "flex", justifyContent: "center", marginBottom: 8, padding: "0 20px" }}>
        <RadarChart values={radarValues} size={200} />
      </div>

      <div style={{ textAlign: "center", marginTop: 8, padding: "0 28px 20px" }}>
        <p style={{ fontFamily: "'Quicksand', sans-serif", fontSize: "clamp(14px, 3.5vw, 14px)", color: `${C.slate}99`, maxWidth: 380, margin: "0 auto 20px", lineHeight: 1.6 }}>
          A custom {data.duration || 4}-day {monthName ? `${monthName} ` : ''}plan for {destName} — built around your pace, your practices, and your intentions.
        </p>
        <button onClick={onUnlock} disabled={generating} style={{
          fontFamily: "'Quicksand', sans-serif",
          fontSize: 14, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase",
          background: generating
            ? `${C.sage}60`
            : `linear-gradient(135deg, ${C.sage}, ${C.oceanTeal})`,
          border: "none", color: C.white,
          padding: "18px 44px", borderRadius: 40, cursor: generating ? "wait" : "pointer",
          transition: "all 0.3s", boxShadow: generating ? "none" : `0 6px 28px ${C.oceanTeal}30`,
          minHeight: 56, WebkitTapHighlightColor: "transparent",
          opacity: generating ? 0.8 : 1,
        }}>{generating ? 'Creating your journey...' : 'Build My Itinerary'}</button>
        <div style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 13, color: `${C.sage}AA`, marginTop: 16 }}>Fully customizable · Powered by Lila Trips</div>
        <div style={{ marginTop: 20 }}>
          <button onClick={onBack} style={{
            fontFamily: "'Quicksand', sans-serif", fontSize: 13, fontWeight: 500, color: `${C.sage}AA`,
            background: "none", border: "none", cursor: "pointer",
            textDecoration: "underline", textUnderlineOffset: 3, padding: 12, minHeight: 44,
            WebkitTapHighlightColor: "transparent",
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

function GeneratingScreen({ destination }) {
  const [completedIndex, setCompletedIndex] = useState(-1);
  const [breathPhase, setBreathPhase] = useState(0);
  const allDone = completedIndex >= GENERATING_STEPS.length - 1;
  const activeIndex = completedIndex + 1;

  useEffect(() => {
    const timings = [4000, 12000, 24000, 40000, 60000, 85000, 115000];
    const timeouts = timings.map((delay, i) =>
      setTimeout(() => setCompletedIndex(i), delay)
    );
    return () => timeouts.forEach(clearTimeout);
  }, []);

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

  const destName = DESTINATIONS.find(d => d.id === destination)?.name || "your destination";
  const ringScale = 0.9 + breathPhase * 0.1;

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 200,
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      background: `linear-gradient(180deg, ${C.cream} 0%, ${C.white} 40%, ${C.cream} 100%)`,
      padding: "40px 28px",
    }}>
      {/* Breathing Ensō */}
      <div style={{
        position: "relative", width: 80, height: 80,
        display: "flex", alignItems: "center", justifyContent: "center",
        marginBottom: 24,
      }}>
        <div style={{
          position: "absolute", inset: -12,
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
      <div style={{
        fontFamily: "'Cormorant Garamond', serif",
        fontSize: "clamp(22px, 5.5vw, 28px)", fontWeight: 300,
        color: C.slate, marginBottom: 6, textAlign: "center",
      }}>Crafting your {destName} trip</div>

      <div style={{
        fontFamily: "'Quicksand', sans-serif",
        fontSize: "clamp(12px, 3vw, 14px)", fontWeight: 400,
        color: C.sage, opacity: 0.75,
        marginBottom: 28, textAlign: "center",
        lineHeight: 1.6,
      }}>This can take between one and two minutes.<br/>Sit tight — it's worth the wait.</div>

      {/* Checklist — compact with collapsing completed items */}
      <div style={{
        display: "flex", flexDirection: "column",
        alignItems: "center",
        width: "100%", maxWidth: 300,
      }}>
        {GENERATING_STEPS.map((step, i) => {
          const StepIcon = step.icon;
          const isComplete = i <= completedIndex;
          const isActive = i === activeIndex && !allDone;
          const isFuture = i > activeIndex;

          return (
            <div key={i} style={{
              display: "flex", alignItems: "center",
              gap: isComplete ? 6 : 10,
              justifyContent: "center",
              height: isComplete ? 20 : isActive ? 38 : 26,
              opacity: isComplete ? 0.35 : isFuture ? 0.22 : 1,
              transition: "all 0.7s cubic-bezier(0.4, 0, 0.2, 1)",
              overflow: "hidden",
            }}>
              <div style={{
                width: isComplete ? 16 : isActive ? 30 : 20,
                height: isComplete ? 16 : isActive ? 30 : 20,
                borderRadius: "50%",
                display: "flex", alignItems: "center", justifyContent: "center",
                background: isComplete ? "transparent" : isActive ? `${C.oceanTeal}10` : "transparent",
                border: isComplete ? "none" : isActive ? `1.5px solid ${C.oceanTeal}40` : `1px solid ${C.sage}20`,
                transition: "all 0.6s",
                flexShrink: 0,
              }}>
                {isComplete ? (
                  <svg width="10" height="10" viewBox="0 0 14 14" fill="none">
                    <path d="M3 7.5L5.5 10L11 4" stroke={C.sage} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : (
                  <StepIcon size={isActive ? 15 : 11} color={isActive ? C.oceanTeal : `${C.sage}50`} />
                )}
              </div>

              <div style={{
                fontFamily: "'Quicksand', sans-serif",
                fontSize: isComplete ? 10 : isActive ? 13.5 : 11.5,
                fontWeight: isActive ? 600 : 400,
                color: isComplete ? C.sage : isActive ? C.slate : C.sage,
                letterSpacing: isActive ? "0.03em" : "0.01em",
                transition: "all 0.6s",
                whiteSpace: "nowrap",
              }}>
                {step.text}
                {isActive && <span style={{ opacity: 0.4 }}><DotAnimation /></span>}
              </div>
            </div>
          );
        })}
      </div>

      {/* Thin progress bar */}
      <div style={{
        width: "100%", maxWidth: 200,
        height: 2, borderRadius: 1,
        background: `${C.sage}12`,
        marginTop: 24,
        overflow: "hidden",
      }}>
        <div style={{
          height: "100%", borderRadius: 1,
          background: C.oceanTeal,
          width: `${Math.min(100, ((completedIndex + 1) / GENERATING_STEPS.length) * 100)}%`,
          transition: "width 1.2s cubic-bezier(0.4, 0, 0.2, 1)",
        }} />
      </div>

      {/* Step count */}
      <div style={{
        fontFamily: "'Quicksand', sans-serif",
        fontSize: 11, fontWeight: 500,
        letterSpacing: "0.12em", textTransform: "uppercase",
        color: `${C.sage}70`,
        marginTop: 8,
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
  return <span style={{ display: "inline-block", width: 16, textAlign: "left" }}>{dots}</span>;
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
  const [step, setStep] = useState(0);
  const [data, setData] = useState({
    destination: null, groupType: null, groupSize: 1,
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
    const { signal, clear } = fetchWithTimeout(180000);
    try {
      const apiBody = translateFormToApi(data);
      const response = await fetch('/api/generate-itinerary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(apiBody),
        signal,
      });
      clear();
      const { ok, data: result, error } = await safeJson(response);
      if (ok && result.success) {
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
    <div ref={containerRef} style={{
      fontFamily: "'Quicksand', sans-serif",
      background: `linear-gradient(180deg, ${C.cream} 0%, ${C.white} 50%, ${C.cream} 100%)`,
      minHeight: "100vh", overflowY: "auto", position: "relative",
    }}>
      <div style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "16px 20px",
        background: step === 0 ? "transparent" : `linear-gradient(180deg, ${C.cream}ee 0%, ${C.cream}00 100%)`,
        pointerEvents: "none", transition: "background 0.4s",
      }}>
        <Link to="/" style={{
          fontFamily: "'Quicksand', sans-serif",
          fontSize: "clamp(18px, 4.5vw, 22px)", fontWeight: 500, letterSpacing: "0.08em",
          color: C.slate, pointerEvents: "auto", textDecoration: "none",
        }}>Lila Trips</Link>
        <button onClick={handleClose} aria-label="Close" style={{
          pointerEvents: "auto", width: 40, height: 40, borderRadius: "50%",
          background: `${C.white}90`, border: `1px solid ${C.sage}18`,
          cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
          backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)",
          WebkitTapHighlightColor: "transparent",
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
        @keyframes fadeScale {
          from { opacity: 0; transform: scale(0.95) translateY(4px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>

      {/* Generating overlay */}
      {generating && <GeneratingScreen destination={data.destination} />}

      <div style={{
        maxWidth: 640, margin: "0 auto",
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
