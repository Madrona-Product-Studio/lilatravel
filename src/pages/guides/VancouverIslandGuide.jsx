// ═══════════════════════════════════════════════════════════════════════════════
// PAGE: VANCOUVER ISLAND GUIDE — Editorial Main Page (Redesign v2)
// ═══════════════════════════════════════════════════════════════════════════════
//
// Top-level editorial guide for Vancouver Island & its orbit. Eight sections:
//   01. Terrain & Parks    05. Hikes, Bikes, etc.
//   02. Travel Lightly     06. Yoga & Mindfulness
//   03. Where to Stay      07. Arts & Culture
//   04. Where to Eat       08. Stars & Sky
//
// Route: /destinations/vancouver-island
//

import { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Nav, Footer, FadeIn, WhisperBar } from '@components';
import { SectionTransition, SubLabel, Prose, ContentList, EditorialList, PlaceGuideCard, GuideDetailSheet } from '@components/guide';
import { G, FONTS } from '@data/guides/guide-styles';
import { P } from '@data/photos';
import { trackEvent } from '@utils/analytics';
import { Helmet } from 'react-helmet-async';
import { CelestialDrawer } from '@components';
import { BREATH_CONFIG } from '@data/breathConfig';
import useBreathCanvas from '@hooks/useBreathCanvas';
import { PARKS, TOWNS, WILDLIFE, TIMING_WINDOWS } from '@data/guides/vancouver-island-constants';
import accommodations from '../../data/accommodations/vancouver-island.json';
import restaurants from '../../data/restaurants/vancouver-island-eat.json';
import moveItems from '../../data/restaurants/vancouver-island-move.json';
import breatheItems from '../../data/restaurants/vancouver-island-breathe.json';
import experiences from '../../data/restaurants/vancouver-island-experience.json';


// ─── Constants ───────────────────────────────────────────────────────────────

const GUIDE_SECTIONS = [
  { id: 'the-place',   label: 'Terrain & Parks' },
  { id: 'responsibly', label: 'Travel Lightly' },
  { id: 'stay',        label: 'Where to Stay' },
  { id: 'eat',         label: 'Where to Eat' },
  { id: 'move',        label: 'Hikes, Bikes, etc.' },
  { id: 'breathe',     label: 'Yoga & Mindfulness' },
  { id: 'experience',  label: 'Arts & Culture' },
  { id: 'night-sky',   label: 'Stars & Sky' },
];

// ─── Editorial data for main page ────────────────────────────────────────────

const PARKS_EDITORIAL = PARKS.map(p => ({
  name: p.name,
  context: p.attribute || p.designation,
  description: p.soul,
  url: p.infoUrl,
}));

const TOWNS_EDITORIAL = TOWNS.map(t => ({
  name: t.name,
  context: t.context,
  description: t.description,
  url: t.url,
}));


// ─── Data derivations ───────────────────────────────────────────────────────

const sleepPicks = accommodations.filter(a => a.lilaPick).slice(0, 4);
const eatPicks = restaurants.filter(r => r.lilaPick).slice(0, 4);
const moveHighlights = moveItems.filter(m => m.lilaPick).slice(0, 4);
const breatheHighlights = breatheItems.filter(b => b.lilaPick).slice(0, 4);
const experienceHighlights = experiences.filter(e => e.featured || e.lilaPick).slice(0, 4);

const wildlifeItems = WILDLIFE.map(w => ({
  ...w,
  type: 'wildlife',
  badge: 'Wildlife',
  context: w.season || '',
  lat: 49.2,
  lng: -125.9,
}));


// ─── Divider ─────────────────────────────────────────────────────────────────

function Divider() {
  return <div style={{ height: '0.5px', background: G.border, margin: '56px 0 0' }} />;
}


// ─── GuideNav ────────────────────────────────────────────────────────────────

function GuideNav({ activeSection, onNav, isMobile }) {
  return (
    <div style={{
      position: 'sticky', top: 0, zIndex: 101,
      background: G.warmWhite,
      borderBottom: `0.5px solid ${G.border}`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: isMobile ? '0 16px' : '0 52px', height: 44,
      marginTop: -64,
      paddingTop: 64,
      boxSizing: 'content-box',
      overflowX: 'auto',
    }}>
      <style>{`.guide-nav-scroll::-webkit-scrollbar { display: none; }`}</style>
      {GUIDE_SECTIONS.map(s => {
        const active = activeSection === s.id;
        return (
          <button
            key={s.id}
            onClick={() => onNav(s.id)}
            style={{
              fontFamily: FONTS.body, fontSize: 10, fontWeight: 600,
              letterSpacing: '0.14em', textTransform: 'uppercase',
              background: 'none', border: 'none', cursor: 'pointer',
              padding: '0 14px', height: 44, whiteSpace: 'nowrap', flexShrink: 0,
              color: active ? G.oceanTeal : G.ink40,
              borderBottom: active ? `1.5px solid ${G.oceanTeal}` : '1.5px solid transparent',
              transition: 'color 0.2s, border-color 0.2s',
            }}
          >
            {s.label}
          </button>
        );
      })}
    </div>
  );
}


// ─── Main Page ───────────────────────────────────────────────────────────────

export default function VancouverIslandGuide() {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth <= 768);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const breathConfig = BREATH_CONFIG.vancouver;
  const breathWrapperRef = useRef(null);
  const breathValueRef = useBreathCanvas(breathConfig, breathWrapperRef);

  // ── Detail Sheet ──
  const [activeSheet, setActiveSheet] = useState(null);

  const openSheet = useCallback((section) => (item) => {
    setActiveSheet({ ...item, section });
  }, []);

  // ── IntersectionObserver for active section ──
  const [activeSection, setActiveSection] = useState('the-place');

  useEffect(() => {
    const ids = GUIDE_SECTIONS.map(s => s.id);
    const elements = ids.map(id => document.getElementById(id)).filter(Boolean);
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter(e => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) {
          setActiveSection(visible[0].target.id);
        }
      },
      { rootMargin: '-130px 0px -60% 0px', threshold: 0 }
    );

    elements.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const scrollTo = useCallback((id) => {
    const el = document.getElementById(id);
    if (!el) return;
    const offset = 44 + 16;
    const y = el.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top: y, behavior: 'smooth' });
    setActiveSection(id);
  }, []);


  return (
    <>
      <Helmet>
        <title>Vancouver Island Guide — Ancient Forest, Pacific Shores & Mindful Travel | Lila Trips</title>
        <meta name="description" content="Old-growth cedar, orca-watched straits, and wild coastline. A guide for travelers who understand that some places ask more of you than a photo." />
        <link rel="canonical" href="https://lilatrips.com/destinations/vancouver-island" />
        <meta property="og:title" content="Vancouver Island Guide — Ancient Forest, Pacific Shores & Mindful Travel | Lila Trips" />
        <meta property="og:description" content="Old-growth cedar, orca-watched straits, and wild coastline. A guide for travelers who understand that some places ask more of you than a photo." />
        <meta property="og:url" content="https://lilatrips.com/destinations/vancouver-island" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://lilatrips.com/og-image.png" />
        <meta property="og:image:alt" content="Vancouver Island — Lila Trips" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Vancouver Island Guide — Ancient Forest, Pacific Shores & Mindful Travel | Lila Trips" />
        <meta name="twitter:description" content="Old-growth cedar, orca-watched straits, and wild coastline. A guide for travelers who understand that some places ask more of you than a photo." />
        <meta name="twitter:image" content="https://lilatrips.com/og-image.png" />
      </Helmet>
      <Nav breathConfig={breathConfig} breathValueRef={breathValueRef} />

      {/* ══ CELESTIAL DRAWER + BREATH CANVAS ═══════════════════════════════════ */}
      <div ref={breathWrapperRef} style={{ background: breathConfig ? G.warmWhite : undefined }}>
        <CelestialDrawer destination="vancouver-island" isMobile={isMobile} breathValueRef={breathValueRef} />

        <div style={{ background: breathConfig ? 'transparent' : G.warmWhite, color: G.ink, fontFamily: FONTS.body }}>

          {/* ══ MASTHEAD ═══════════════════════════════════════════════════════ */}
          <div style={{ padding: isMobile ? '68px 20px 32px' : '76px 52px 40px', maxWidth: 1080, margin: '0 auto' }}>
            <div style={{ fontFamily: FONTS.body, fontSize: 10, fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: G.goldenAmber, marginBottom: 20 }}>
              Destination Guide
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 300px', gap: isMobile ? '28px' : '52px', alignItems: 'start' }}>
              <div>
                <h1 style={{ fontFamily: FONTS.body, fontSize: 'clamp(48px, 8vw, 84px)', fontWeight: 700, lineHeight: 0.95, letterSpacing: '-0.02em', color: G.darkInk, margin: '0 0 32px' }}>
                  Vancouver<br />Island
                </h1>
                <p style={{ fontFamily: FONTS.body, fontSize: 16, fontWeight: 400, lineHeight: 1.85, color: G.inkBody, margin: '0 0 16px', maxWidth: 480 }}>
                  Tofino sits at the end of Highway 4, where the road runs out of places to go. What surrounds it is enormous: Clayoquot Sound, a UNESCO Biosphere Reserve; the old-growth forests of Meares Island; Pacific Rim National Park's Long Beach; and an open Pacific horizon with nothing between you and Japan.
                </p>
                <p style={{ fontFamily: FONTS.body, fontSize: 16, fontWeight: 400, lineHeight: 1.85, color: G.inkBody, margin: 0, maxWidth: 480 }}>
                  Where the forest meets the sea — we built this guide to help you find it.
                </p>
              </div>

              <div style={{ borderLeft: isMobile ? 'none' : `0.5px solid ${G.border}`, borderTop: isMobile ? `0.5px solid ${G.border}` : 'none', paddingLeft: isMobile ? 0 : 36, paddingTop: isMobile ? 24 : 4 }}>
                <div style={{ fontFamily: FONTS.body, fontSize: 10, fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: G.ink40, marginBottom: 20 }}>
                  This guide covers
                </div>
                {[
                  { label: 'Terrain & Parks',     active: true  },
                  { label: 'Travel Lightly',      active: false },
                  { label: 'Where to Stay',       active: false },
                  { label: 'Hikes, Bikes, etc.',   active: false },
                  { label: 'Yoga & Mindfulness',  active: false },
                  { label: 'Arts & Culture',       active: false },
                  { label: 'Stars & Sky',          active: false },
                ].map((g, i, arr) => (
                  <div key={g.label} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: i < arr.length - 1 ? `0.5px solid ${G.borderSoft}` : 'none' }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', flexShrink: 0, background: g.active ? G.oceanTeal : G.ink25 }} />
                    <span style={{ fontFamily: FONTS.body, fontSize: 13, fontWeight: 600, color: g.active ? G.ink : G.inkDetail }}>{g.label}</span>
                  </div>
                ))}
                <div style={{ fontFamily: FONTS.body, fontSize: 11, fontWeight: 400, color: G.ink25, marginTop: 20, paddingTop: 16, borderTop: `0.5px solid ${G.border}` }}>
                  Updated 2026
                </div>
              </div>
            </div>
          </div>

          {/* ── Photo strip ─────────────────────────────────────────────────── */}
          <div style={{ display: 'flex', gap: 2, overflow: 'hidden', marginTop: 2 }}>
            {[
              { src: P.vancouver, alt: 'Vancouver Island coastline', caption: 'Where the forest meets the sea', width: '32%' },
              { src: P.vancouverInlet, alt: 'Clayoquot Sound inlet', caption: 'Clayoquot Sound', width: '22%' },
              { src: P.vancouverRainforest, alt: 'Old-growth rainforest boardwalk', caption: 'Ancient cedar — 1,000 years', width: '24%' },
              { src: P.vancouverBeach, alt: 'Pacific Rim beach at dusk', caption: 'Long Beach at low tide', width: '22%' },
            ].map((img, i) => (
              <div key={i} style={{ flex: `0 0 ${img.width}`, position: 'relative', overflow: 'hidden', height: isMobile ? 240 : 360 }}>
                <img src={img.src} alt={img.alt} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '28px 14px 12px', background: 'linear-gradient(to top, rgba(10,18,26,0.65), transparent)' }}>
                  <span style={{ fontFamily: FONTS.body, fontSize: 10, fontWeight: 600, letterSpacing: '0.06em', color: 'rgba(255,255,255,0.8)' }}>{img.caption}</span>
                </div>
              </div>
            ))}
          </div>

          {/* ══ GUIDE NAV ══════════════════════════════════════════════════════ */}
          <GuideNav activeSection={activeSection} onNav={scrollTo} isMobile={isMobile} />

          {/* ══ CONTENT ════════════════════════════════════════════════════════ */}
          <div style={{ background: G.warmWhite }}>
          <div style={{ padding: isMobile ? '0 20px' : '0 52px', maxWidth: 860, margin: '0 auto' }}>
            <div style={{ maxWidth: 660 }}>


              {/* ══ 01 TERRAIN & PARKS ════════════════════════════════════════ */}
              <div id="the-place">
                <SectionTransition num="01" title="Terrain & Parks" />
                <div style={{ marginTop: 28 }}>
                  <Prose>
                    The town is small — fewer than 2,000 residents — and for most of its history was accessible only by boat or float plane. The character here is shaped by weather. Tofino is a surf town that gets 3,000mm of rain a year. The storm season — November through March — draws a different kind of traveler than summer: people who want to watch the Pacific throw itself against the coast.
                  </Prose>
                  <Prose>
                    The land around Tofino has been home to the Nuu-chah-nulth peoples for over 10,000 years. Five Nations hold traditional territories in the region: Ahousaht, Hesquiaht, Tla-o-qui-aht, Toquaht, and Ucluelet. The forests, waters, and shorelines here are still in relationship with the people who have always called them home.
                  </Prose>
                  <Prose>
                    Ucluelet sits 40 minutes south — quieter, more weathered, equally compelling. Victoria, at the island's southern tip, is a world apart: architectural, ceremonial, the counterpoint when you want stone buildings and afternoon tea after a week of surf and cedar. Together they make a complete journey.
                  </Prose>
                </div>

                <SubLabel>The Parks</SubLabel>
                <Prose>Two protected areas anchor the island experience — Pacific Rim along the coast and Strathcona in the wild interior. Clayoquot Sound, a UNESCO Biosphere Reserve, ties them together.</Prose>
                <EditorialList items={PARKS_EDITORIAL.map(p => ({ context: p.context, name: p.name, detail: p.description, url: p.url }))} />

                <SubLabel>When to Go</SubLabel>
                <Prose>Both seasons are true. Both are worth knowing. The island is a different place in storm season than it is in summer — and both versions deserve your attention.</Prose>
                <EditorialList items={TIMING_WINDOWS} />

                <SubLabel>Island Wildlife</SubLabel>
                <Prose>The waters and forests around Tofino host an extraordinary density of marine and terrestrial life. Gray whales, black bears, sea otters, and orcas share this coastline with surfers and kayakers.</Prose>
                <ContentList items={wildlifeItems} onOpenSheet={openSheet('Wildlife')} />

                <PlaceGuideCard label="Full Terrain & Parks Guide" descriptor="Parks · towns · wildlife · when to go" bg="linear-gradient(155deg, #4f603b 0%, #7A9190 100%)" to="/destinations/vancouver-island/terrain-and-parks" />
              </div>

              <Divider />


              {/* ══ 02 TRAVEL LIGHTLY ═════════════════════════════════════════ */}
              <div id="responsibly">
                <SectionTransition num="02" title="Travel Lightly" />
                <div style={{ marginTop: 28 }}>
                  <Prose>
                    This land has a legal and spiritual context that precedes any trail map. Much of Vancouver Island remains the unceded traditional territories of the Kwakwaka'wakw, Nuu-chah-nulth, and Coast Salish peoples — meaning it was never ceded through treaty. How you move through this place matters.
                  </Prose>
                </div>

                <SubLabel warm>Unceded Territory</SubLabel>
                <Prose>Protected areas on this island move at the speed of the local First Nations whose territories they occupy. The land you're walking has Indigenous governance, law, and relationship that precede and supersede park boundaries.</Prose>

                <SubLabel warm>Old-Growth Crisis</SubLabel>
                <Prose>Vancouver Island is down to 20% of its original ancient forest. The Fairy Creek blockades — the largest act of civil disobedience in Canadian history, with over 1,100 arrests — were an attempt to save some of the last intact valleys. When you walk among these trees, you're in contested, living terrain.</Prose>

                <SubLabel warm>Coastal Access</SubLabel>
                <Prose>Tofino's permanent population is 2,500. Summer brings 20 times that. The corridor absorbs extreme visitor density against a sensitive marine environment. Grey whale migration, sea otters, and nesting shorebirds share the coastline with surfers and day-trippers. Stay on boardwalks in the dune systems, give wide berth to any wildlife, and book well ahead.</Prose>

                <SubLabel warm>Indigenous-Led Tourism</SubLabel>
                <Prose>Seek out Indigenous-led experiences — they're the best ones anyway. Tla-o-qui-aht Tribal Parks near Tofino, Namgis First Nation in Alert Bay, and others. These aren't add-ons to a trip — they're the most grounded way to understand where you are. Booking directly with Indigenous-operated guides and lodges ensures revenue flows to the community.</Prose>

                <PlaceGuideCard label="Full Travel Lightly Guide" descriptor="Unceded territory · old-growth · coastal access · giving back" bg="linear-gradient(155deg, #4f603b 0%, #4A6B5A 100%)" to="/destinations/vancouver-island/travel-lightly" />
              </div>

              <Divider />


              {/* ══ 03 WHERE TO STAY ══════════════════════════════════════════ */}
              <div id="stay">
                <SectionTransition num="03" title="Where to Stay" />
                <div style={{ marginTop: 28 }}>
                  <Prose>Tofino is the anchor for a west coast trip — storm-watching lodges, surf cabins, and forest retreats. Ucluelet offers quieter alternatives at better value. Victoria is the counterpoint when you want architecture and ceremony. Split your nights across the island for the full experience.</Prose>
                </div>

                <SubLabel>Towns</SubLabel>
                <EditorialList items={TOWNS_EDITORIAL.map(t => ({ context: t.context, name: t.name, detail: t.description, url: t.url }))} />

                <SubLabel>Hotels</SubLabel>
                <p style={{ fontFamily: FONTS.body, fontSize: 13, fontWeight: 400, color: G.ink40, marginBottom: 0 }}>A few we like across the island:</p>
                <ContentList onOpenSheet={openSheet('Stay')} items={sleepPicks.map(a => ({
                  ...a,
                  type: 'stay',
                  badge: a.stayStyle.charAt(0).toUpperCase() + a.stayStyle.slice(1),
                  context: a.location,
                  detail: a.highlights?.[0] || '',
                  featured: a.lilaPick,
                  tier: a.stayStyle,
                  url: a.links?.website || a.links?.booking,
                }))} />

                <PlaceGuideCard label="Full Where to Stay Guide" descriptor="Full accommodations across Tofino, Ucluelet, Victoria & Nanaimo" bg="linear-gradient(155deg, #C4A882 0%, #4f603b 100%)" to="/destinations/vancouver-island/where-to-stay" />
              </div>

              <Divider />


              {/* ══ 04 WHERE TO EAT ═══════════════════════════════════════════ */}
              <div id="eat">
                <SectionTransition num="04" title="Where to Eat" />
                <div style={{ marginTop: 28 }}>
                  <Prose>Tofino punches well above its weight for a town of 2,000. The seafood is extraordinary — spot prawns, halibut, Dungeness crab — and the dining scene has matured into something genuinely special. Ucluelet is catching up. Victoria adds heritage and refinement.</Prose>
                </div>

                <ContentList onOpenSheet={openSheet('Eat')} items={eatPicks.map(e => {
                  const raw = e.cuisine || e.type || '';
                  return {
                    ...e,
                    type: 'list',
                    badge: raw.charAt(0).toUpperCase() + raw.slice(1),
                    context: `${e.location}${e.reservations ? ' \u00B7 ' + e.reservations : ''}`,
                    detail: e.highlights?.[0] || '',
                    featured: e.lilaPick,
                    url: e.links?.website,
                  };
                })} />

                <PlaceGuideCard label="Full Where to Eat Guide" descriptor="Tofino · Ucluelet · Victoria · provisions" bg="linear-gradient(155deg, #C49A6A 0%, #4f603b 100%)" to="/destinations/vancouver-island/where-to-eat" />
              </div>


              {/* ══ 05 HIKES, BIKES, ETC. ═════════════════════════════════════ */}
              <div id="move">
                <SectionTransition num="05" title="Hikes, Bikes, etc." />
                <div style={{ marginTop: 28 }}>
                  <Prose>The West Coast Trail is the marquee — 75 km of wilderness coastline, ladders, cable cars, and tidal shelf. But the orbit has more: the Meares Island Big Trees boardwalk through cathedral-scale old growth, sea kayaking the Broken Group Islands, and some of the best cold-water surfing in the world at Cox Bay and Long Beach.</Prose>
                </div>

                <SubLabel>Highlights</SubLabel>
                <ContentList onOpenSheet={openSheet('Move')} items={moveHighlights.map(m => ({
                  ...m,
                  type: 'list',
                  badge: m.moveTier.charAt(0).toUpperCase() + m.moveTier.slice(1),
                  context: `${m.distance || ''} \u00B7 ${m.difficulty || ''}`.replace(/^\s*\u00B7\s*/, '').replace(/\s*\u00B7\s*$/, ''),
                  detail: m.highlights?.[0] || '',
                  featured: m.lilaPick,
                  url: m.links?.website,
                }))} />

                <PlaceGuideCard label="Full Hikes, Bikes, etc. Guide" descriptor="Full trail & activity guide across the island" bg="linear-gradient(155deg, #8AAA7A 0%, #4f603b 100%)" to="/destinations/vancouver-island/hikes-bikes" />
              </div>

              <Divider />


              {/* ══ 06 YOGA & MINDFULNESS ═════════════════════════════════════ */}
              <div id="breathe">
                <SectionTransition num="06" title="Yoga & Mindfulness" />
                <div style={{ marginTop: 28 }}>
                  <Prose>The coast has a way of slowing the nervous system down. The sound of rain on cedar, the rhythm of the surf, the ancient scale of the forest — it works on you whether you intend it to or not. Hot Springs Cove, forest bathing on Meares Island, cedar saunas overlooking the Pacific. These are some ways to go deeper with that.</Prose>
                </div>

                <SubLabel>Highlights</SubLabel>
                <ContentList onOpenSheet={openSheet('Breathe')} items={breatheHighlights.map(b => ({
                  ...b,
                  type: 'list',
                  badge: b.breatheTier.charAt(0).toUpperCase() + b.breatheTier.slice(1),
                  context: `${b.type || ''} \u00B7 ${b.location || ''}`.replace(/^\s*\u00B7\s*/, '').replace(/\s*\u00B7\s*$/, ''),
                  detail: b.highlights?.[0] || '',
                  featured: b.lilaPick,
                  url: b.links?.website,
                }))} />

                <PlaceGuideCard label="Full Yoga & Mindfulness Guide" descriptor="Hot springs · forest bathing · sauna · restore" bg="linear-gradient(155deg, #8AADA8 0%, #4f603b 100%)" to="/destinations/vancouver-island/yoga-mindfulness" />
              </div>

              <Divider />


              {/* ══ 07 ARTS & CULTURE ═════════════════════════════════════════ */}
              <div id="experience">
                <SectionTransition num="07" title="Arts & Culture" />
                <div style={{ marginTop: 28 }}>
                  <Prose>Vancouver Island has a deeper cultural life than most visitors expect. First Nations art traditions thousands of years old, a growing gallery scene in Tofino, the Royal BC Museum in Victoria, and Indigenous-led cultural tourism that connects you to the land in ways a trail map never will.</Prose>
                </div>

                <SubLabel>Highlights</SubLabel>
                <ContentList onOpenSheet={openSheet('Experience')} items={experienceHighlights.map(e => ({
                  ...e,
                  type: 'list',
                  badge: (e.type || '').charAt(0).toUpperCase() + (e.type || '').slice(1),
                  context: e.location || '',
                  detail: e.highlights?.[0] || '',
                  featured: e.featured || e.lilaPick,
                  url: e.links?.website,
                }))} />

                <PlaceGuideCard label="Full Art & Culture Guide" descriptor="First Nations art · galleries · museums · heritage" bg="linear-gradient(155deg, #B8956A 0%, #4f603b 100%)" to="/destinations/vancouver-island/arts-and-culture" />
              </div>

              <Divider />


              {/* ══ 08 STARS & SKY ════════════════════════════════════════════ */}
              <div id="night-sky">
                <SectionTransition num="08" title="Stars & Sky" />
                <div style={{ marginTop: 28 }}>
                  <Prose>Vancouver Island's west coast offers genuinely dark skies — no major cities for hundreds of kilometres in the Pacific direction. The best viewing is from Long Beach and the Wild Pacific Trail on clear winter nights. Storm season offers a different kind of sky spectacle: lightning over the open ocean, phosphorescent surf, and the Northern Lights on rare, spectacular occasions.</Prose>
                </div>

                <EditorialList items={[
                  { context: 'Wildlife & Sky', name: 'Whale Watching with Ahous Adventures', detail: 'Ahousaht Nation-owned operator. Gray whales (March\u2013October), humpbacks, occasional orcas. Guides carry Ahousaht cultural knowledge \u2014 every tour is an act of reciprocity.' },
                  { context: 'Nov\u2013Jan', name: 'Storm Watching', detail: 'Peak dramatic Pacific storms. Best vantage: Chesterman Beach, Wild Pacific Trail, and the windows of the Wickaninnish Inn. Many lodges host dedicated storm watching packages.' },
                  { context: 'Seasonal', name: 'Bioluminescence', detail: 'Warm summer nights can bring bioluminescent plankton to Tofino\u2019s beaches. The phosphorescent glow in the surf is one of the coast\u2019s most magical phenomena.' },
                  { context: 'Best Window', name: 'Winter Dark Skies', detail: 'Clear winter nights offer the darkest conditions. Milky Way visible autumn through spring. No light pollution over the open Pacific.' },
                ]} />

                <PlaceGuideCard label="Full Stars & Sky Guide" descriptor="Dark skies · storm watching · whale watching · bioluminescence" bg="linear-gradient(155deg, #5A6B8A 0%, #1E2A3E 100%)" to="/destinations/vancouver-island/stars-and-sky" />
              </div>

              <Divider />

            </div>
          </div>
          </div>


          {/* ══ CTA ════════════════════════════════════════════════════════════ */}
          <div style={{ background: G.warmWhite }}>
          <div style={{ padding: isMobile ? '40px 20px 60px' : '52px 52px 80px', maxWidth: 860, margin: '0 auto' }}>
            <div style={{ background: G.darkInk, padding: '52px 48px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 48, flexWrap: 'wrap' }}>
              <div style={{ maxWidth: 380 }}>
                <div style={{ fontFamily: FONTS.body, fontSize: 9, fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: 16 }}>Begin</div>
                <h3 style={{ fontFamily: FONTS.body, fontSize: 'clamp(24px, 4vw, 32px)', fontWeight: 700, color: 'white', lineHeight: 1.1, margin: '0 0 12px', letterSpacing: '-0.01em' }}>
                  Your island journey<br />starts here
                </h3>
                <p style={{ fontFamily: FONTS.body, fontSize: 13, fontWeight: 400, lineHeight: 1.65, color: 'rgba(255,255,255,0.5)', margin: '0 0 28px' }}>
                  Turn this guide into a day-by-day itinerary built around how you actually travel.
                </p>
                <button
                  onClick={() => { trackEvent('guide_cta_clicked', { guide: 'vancouver-island' }); navigate('/plan'); }}
                  style={{ fontFamily: FONTS.body, fontSize: 11, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: G.goldenAmber, border: `1.5px solid ${G.goldenAmber}`, background: 'transparent', padding: '13px 28px', cursor: 'pointer' }}
                >
                  Plan a Trip →
                </button>
              </div>

              <div style={{ minWidth: 180 }}>
                <div style={{ fontFamily: FONTS.body, fontSize: 9, fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', marginBottom: 16 }}>Place Guides</div>
                {['Terrain & Parks Guide', 'Travel Lightly Guide', 'Stay Guide', 'Eat Guide', 'Move Guide', 'Breathe Guide', 'Art & Culture Guide', 'Night Sky Guide'].map((g, i, arr) => (
                  <div key={g} style={{ fontFamily: FONTS.body, fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', color: 'rgba(255,255,255,0.4)', padding: '8px 0', borderBottom: i < arr.length - 1 ? '0.5px solid rgba(255,255,255,0.07)' : 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: 10 }}>{'\u2192'}</span>
                    {g}
                  </div>
                ))}
              </div>
            </div>
          </div>
          </div>

        </div>
      </div>

      <GuideDetailSheet
        item={activeSheet}
        onClose={() => setActiveSheet(null)}
        isMobile={isMobile}
      />
      <WhisperBar destination="vancouver" label="Vancouver Island" />
      <Footer />
    </>
  );
}
