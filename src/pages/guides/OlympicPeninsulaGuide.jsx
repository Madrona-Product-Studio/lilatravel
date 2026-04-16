// ═══════════════════════════════════════════════════════════════════════════════
// PAGE: OLYMPIC PENINSULA GUIDE — Editorial Main Page (Redesign v2)
// ═══════════════════════════════════════════════════════════════════════════════
//
// Top-level editorial guide for Olympic Peninsula. Eight sections:
//   01. Terrain & Parks    05. Hikes, Paddles, etc.
//   02. Travel Lightly     06. Hot Springs & Stillness
//   03. Where to Stay      07. Culture & Heritage
//   04. Where to Eat       08. Stars & Sky
//
// Route: /destinations/olympic-peninsula
//

import { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Nav, Footer, FadeIn, WhisperBar } from '@components';
import { SectionTransition, SubLabel, Prose, ContentList, EditorialList, PlaceGuideCard, GuideDetailSheet, PhotoStrip } from '@components/guide';
import { getNPSData, buildNPSLookup, findNPSMatch } from '@services/npsService';
import { G, FONTS } from '@data/guides/guide-styles';
import { P } from '@data/photos';
import { trackEvent } from '@utils/analytics';
import { Helmet } from 'react-helmet-async';
import { CelestialDrawer } from '@components';
import { BREATH_CONFIG } from '@data/breathConfig';
import useBreathCanvas from '@hooks/useBreathCanvas';
import { PARKS, TOWNS, TIMING_WINDOWS, WILDLIFE, HIGHLIGHTS } from '@data/guides/olympic-peninsula-constants';
import accommodations from '../../data/accommodations/olympic-peninsula.json';
import restaurants from '../../data/restaurants/olympic-peninsula-eat.json';
import moveItems from '../../data/restaurants/olympic-peninsula-move.json';
import breatheItems from '../../data/restaurants/olympic-peninsula-breathe.json';
import experiences from '../../data/restaurants/olympic-peninsula-experience.json';


// ─── Constants ───────────────────────────────────────────────────────────────

const GUIDE_SECTIONS = [
  { id: 'the-place',   label: 'Terrain & Parks' },
  { id: 'responsibly', label: 'Travel Lightly' },
  { id: 'stay',        label: 'Where to Stay' },
  { id: 'eat',         label: 'Where to Eat' },
  { id: 'move',        label: 'Hikes, Paddles, etc.' },
  { id: 'breathe',     label: 'Hot Springs & Stillness' },
  { id: 'experience',  label: 'Culture & Heritage' },
  { id: 'night-sky',   label: 'Stars & Sky' },
];

// ─── Editorial data for main page ────────────────────────────────────────────

const PARKS_EDITORIAL = PARKS.map(p => ({
  context: p.attribute || p.designation,
  name: p.name,
  detail: p.soul,
  url: p.infoUrl,
}));

const TOWNS_EDITORIAL = TOWNS.map(t => ({
  context: t.context,
  name: t.name,
  detail: t.description,
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
  lat: 47.8,
  lng: -123.6,
}));


// ─── Divider ─────────────────────────────────────────────────────────────────

function Divider() {
  return <div style={{ height: '0.5px', background: G.border, margin: '56px 0 0' }} />;
}


// ─── GuideNav ────────────────────────────────────────────────────────────────

function GuideNav({ activeSection, onNav, isMobile }) {
  const scrollContainerRef = useRef(null);

  // Reset scroll position to start on mobile mount
  useEffect(() => {
    if (isMobile && scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft = 0;
    }
  }, [isMobile]);

  return (
    <div ref={scrollContainerRef} style={{
      position: 'sticky', top: 0, zIndex: 101,
      background: G.warmWhite,
      borderBottom: `0.5px solid ${G.border}`,
      display: 'flex', alignItems: 'center', justifyContent: isMobile ? 'flex-start' : 'center',
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

export default function OlympicPeninsulaGuide() {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth <= 768);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const breathConfig = BREATH_CONFIG.olympic;
  const breathWrapperRef = useRef(null);
  const breathValueRef = useBreathCanvas(breathConfig, breathWrapperRef);

  // ── NPS Data ──
  const [npsLookup, setNpsLookup] = useState(null);
  const [activeSheet, setActiveSheet] = useState(null);

  useEffect(() => {
    getNPSData(['olym'])
      .then(data => { setNpsLookup(buildNPSLookup(data.thingsToDo)); })
      .catch(err => console.warn('NPS fetch failed:', err.message));
  }, []);

  const openSheet = useCallback((section) => (item) => {
    const npsMatch = npsLookup ? findNPSMatch(item.name, npsLookup) : null;
    setActiveSheet({ ...item, section, nps: npsMatch || undefined });
  }, [npsLookup]);

  const checkNPS = useCallback((name) => npsLookup ? !!findNPSMatch(name, npsLookup) : false, [npsLookup]);

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
        <title>Olympic Peninsula Guide — Rainforest, Wild Coast & Slow Travel | Lila Trips</title>
        <meta name="description" content="Temperate rainforest, tide pools, and isolated Pacific coastline. A guide for travelers who want to move through one of North America's most intact ecosystems with care." />
        <link rel="canonical" href="https://lilatrips.com/destinations/olympic-peninsula" />
        <meta property="og:title" content="Olympic Peninsula Guide — Rainforest, Wild Coast & Slow Travel | Lila Trips" />
        <meta property="og:description" content="Temperate rainforest, tide pools, and isolated Pacific coastline. A guide for travelers who want to move through one of North America's most intact ecosystems with care." />
        <meta property="og:url" content="https://lilatrips.com/destinations/olympic-peninsula" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://lilatrips.com/og-image.png" />
        <meta property="og:image:alt" content="Olympic Peninsula — Lila Trips" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Olympic Peninsula Guide — Rainforest, Wild Coast & Slow Travel | Lila Trips" />
        <meta name="twitter:description" content="Temperate rainforest, tide pools, and isolated Pacific coastline. A guide for travelers who want to move through one of North America's most intact ecosystems with care." />
        <meta name="twitter:image" content="https://lilatrips.com/og-image.png" />
      </Helmet>
      <Nav breathConfig={breathConfig} breathValueRef={breathValueRef} />

      {/* ══ CELESTIAL DRAWER + BREATH CANVAS ═══════════════════════════════════ */}
      <div ref={breathWrapperRef} style={{ background: breathConfig ? G.warmWhite : undefined }}>
        <CelestialDrawer destination="olympic-peninsula" isMobile={isMobile} breathValueRef={breathValueRef} />

        <div style={{ background: breathConfig ? 'transparent' : G.warmWhite, color: G.ink, fontFamily: FONTS.body }}>

          {/* ══ MASTHEAD ═══════════════════════════════════════════════════════ */}
          <div style={{ padding: isMobile ? '68px 20px 32px' : '76px 52px 40px', maxWidth: 1080, margin: '0 auto' }}>
            <div style={{ fontFamily: FONTS.body, fontSize: 10, fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: G.goldenAmber, marginBottom: 20 }}>
              Destination Guide
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 300px', gap: isMobile ? '28px' : '52px', alignItems: 'start' }}>
              <div>
                <h1 style={{ fontFamily: FONTS.body, fontSize: 'clamp(48px, 8vw, 84px)', fontWeight: 700, lineHeight: 0.95, letterSpacing: '-0.02em', color: G.darkInk, margin: '0 0 32px' }}>
                  Olympic<br />Peninsula
                </h1>
                <p style={{ fontFamily: FONTS.body, fontSize: 16, fontWeight: 400, lineHeight: 1.85, color: G.inkBody, margin: '0 0 16px', maxWidth: 480 }}>
                  Olympic is three parks in one, stacked against each other in ecological improbability.
                  Glacier-draped mountains, the wettest rainforests in the contiguous United States,
                  and 73 miles of wilderness shoreline — each zone requires its own day, its own state of mind.
                </p>
                <p style={{ fontFamily: FONTS.body, fontSize: 16, fontWeight: 400, lineHeight: 1.85, color: G.inkBody, margin: 0, maxWidth: 480 }}>
                  You cannot see Olympic in a loop. You have to choose. What you get in exchange is complete
                  immersion — in rain, in silence, in a landscape that feels like the Pacific Northwest
                  distilled to its essence.
                </p>
              </div>

              <div style={{ borderLeft: isMobile ? 'none' : `0.5px solid ${G.border}`, borderTop: isMobile ? `0.5px solid ${G.border}` : 'none', paddingLeft: isMobile ? 0 : 36, paddingTop: isMobile ? 24 : 4 }}>
                <div style={{ fontFamily: FONTS.body, fontSize: 10, fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: G.ink40, marginBottom: 20 }}>
                  This guide covers
                </div>
                {[
                  { label: 'Terrain & Parks',         active: true  },
                  { label: 'Travel Lightly',           active: false },
                  { label: 'Where to Stay',            active: false },
                  { label: 'Hikes, Paddles, etc.',     active: false },
                  { label: 'Hot Springs & Stillness',  active: false },
                  { label: 'Culture & Heritage',       active: false },
                  { label: 'Stars & Sky',              active: false },
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
          <PhotoStrip
            isMobile={isMobile}
            images={[
              { src: P.olympic,             alt: 'Olympic Range from Hurricane Ridge',        caption: 'Hurricane Ridge · alpine panorama', width: '32%' },
              { src: P.olympicHohRainforest, alt: 'Hoh Rainforest mossy trail',                caption: 'Hoh Rainforest · Hall of Mosses',   width: '22%' },
              { src: P.olympicLakeCrescent,  alt: 'Lake Crescent with Adirondack chairs',      caption: 'Lake Crescent · glacially carved',   width: '24%' },
              { src: P.olympicLakeSunset,    alt: 'Olympic lake at sunset',                    caption: 'Sunset over the peninsula',          width: '22%' },
            ]}
          />

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
                    Olympic is three parks in one, stacked against each other in ecological improbability.
                    In the center: the Olympic Mountains, glacier-draped and largely roadless, presiding over
                    the peninsula's wild interior. On the west slope: the Hoh, Quinault, and Queets Rainforests
                    — the wettest place in the contiguous United States, where bigleaf maples grow so dense
                    with mosses and ferns they look like they're breathing. On the coast: 73 miles of wilderness
                    shoreline, sea stacks rising from the surf, tide pools full of life, driftwood the size of
                    tree trunks.
                  </Prose>
                  <Prose>
                    Nine Indigenous Nations have called this peninsula home since time immemorial: the Makah,
                    Quileute, Hoh, Quinault, Jamestown S'Klallam, Port Gamble S'Klallam, Lower Elwha Klallam,
                    Skokomish, and Squaxin Island tribes. The land and water here carry thousands of years of
                    their relationship.
                  </Prose>
                </div>

                <SubLabel>The Parks</SubLabel>
                <Prose>Two public lands, two different philosophies. The national park protects ecosystems intact — the forest surrounds it and offers dispersed freedom.</Prose>
                <EditorialList items={PARKS_EDITORIAL} />

                <SubLabel>The Towns</SubLabel>
                <Prose>Four gateway towns, each with a different personality and relationship to the landscape.</Prose>
                <EditorialList items={TOWNS_EDITORIAL} />

                <SubLabel>When to Go</SubLabel>
                <Prose>Olympic rewards every season differently. These are the moments when the peninsula is most alive.</Prose>
                <EditorialList items={TIMING_WINDOWS} />

                <SubLabel>Peninsula Wildlife</SubLabel>
                <Prose>The peninsula's isolation — separated from the mainland by Hood Canal — has created endemic species found nowhere else. Pay attention at dawn and dusk.</Prose>
                <ContentList items={wildlifeItems} onOpenSheet={openSheet('Wildlife')} />

                <PlaceGuideCard label="Full Terrain & Parks Guide" descriptor="Parks · towns · when to go · wildlife" bg="linear-gradient(155deg, #568844 0%, #3D6B8A 100%)" to="/destinations/olympic-peninsula/terrain-and-parks" />
              </div>

              <Divider />


              {/* ══ 02 TRAVEL LIGHTLY ═════════════════════════════════════════ */}
              <div id="responsibly">
                <SectionTransition num="02" title="Travel Lightly" />
                <div style={{ marginTop: 28 }}>
                  <Prose>
                    One of the last temperate wildernesses in the lower 48. The Hoh Rainforest's mosses took
                    decades to grow — a single footstep can damage them. The Elwha River, freed from two dams
                    in 2014, is still healing. Nine Indigenous Nations call this home. How you move through
                    this place matters.
                  </Prose>
                </div>

                <SubLabel warm>Protect the Moss</SubLabel>
                <Prose>The surge in visitors has widened and compacted trails like the Hall of Mosses — paths previously edged with lush moss are now bare, hard-packed dirt. Social trails make it worse. Stay on wooden boardwalks and established paths. Resist the urge to step off for a photo.</Prose>

                <SubLabel warm>Arrive Early</SubLabel>
                <Prose>In August 2021, the Hoh Rainforest saw over 107,000 visitors — triple the count from a decade earlier. The single access road gridlocks by mid-morning. Arriving before 8am dramatically changes the experience and reduces pressure on the parking area.</Prose>

                <SubLabel warm>The Elwha Recovery</SubLabel>
                <Prose>The largest dam removal in US history is still healing. Salmon are returning for the first time in over a century. The riparian corridor is fragile. Witness the recovery from the trail — don't wade through active restoration zones or disturb newly colonizing vegetation.</Prose>

                <SubLabel warm>Indigenous Territory</SubLabel>
                <Prose>The Hoh River valley is the ancestral home of the Hoh people, who have maintained a continuous relationship with this watershed for centuries. The park's boundaries were drawn around — not with — the tribe. When visiting, that history is part of the landscape.</Prose>

                <SubLabel warm>Give Back</SubLabel>
                <Prose>The Lower Elwha Klallam Tribe drives river restoration. North Olympic Land Trust conserves land across the peninsula. Olympic Park Associates has supported the park since 1948. Washington Trails Association organizes trail maintenance work parties. Friends of the Hoh advocates for the rainforest. All are worth supporting.</Prose>

                <PlaceGuideCard label="Full Travel Lightly Guide" descriptor="Tread lightly · give back · Indigenous culture · local support" bg="linear-gradient(155deg, #6B8F71 0%, #3D5A6B 100%)" to="/destinations/olympic-peninsula/travel-lightly" />
              </div>

              <Divider />


              {/* ══ 03 WHERE TO STAY ══════════════════════════════════════════ */}
              <div id="stay">
                <SectionTransition num="03" title="Where to Stay" />
                <div style={{ marginTop: 28 }}>
                  <Prose>Port Angeles is the most practical base — closest to Hurricane Ridge and the widest selection of food and lodging. If you're running the full peninsula, plan to split nights. Each zone rewards at least one overnight.</Prose>
                </div>

                <SubLabel>Towns</SubLabel>
                <EditorialList items={TOWNS_EDITORIAL} />

                <SubLabel>Hotels</SubLabel>
                <p style={{ fontFamily: FONTS.body, fontSize: 13, fontWeight: 400, color: G.ink40, marginBottom: 0 }}>A few we like across the peninsula:</p>
                <ContentList onOpenSheet={openSheet('Stay')} items={sleepPicks.map(a => ({
                  ...a,
                  type: 'stay',
                  badge: a.stayStyle.charAt(0).toUpperCase() + a.stayStyle.slice(1),
                  context: a.location,
                  detail: a.highlights?.[0] || '',
                  featured: a.lilaPick,
                  tier: a.stayStyle,
                  url: a.links?.website || a.links?.booking,
                  hasNPS: checkNPS(a.name),
                }))} />

                <PlaceGuideCard label="Full Where to Stay Guide" descriptor="Full accommodations across Port Angeles, Forks, Sequim & Port Townsend" bg="linear-gradient(155deg, #7A9A8A 0%, #5A6B5A 100%)" to="/destinations/olympic-peninsula/where-to-stay" />
              </div>

              <Divider />


              {/* ══ 04 WHERE TO EAT ═══════════════════════════════════════════ */}
              <div id="eat">
                <SectionTransition num="04" title="Where to Eat" />
                <div style={{ marginTop: 28 }}>
                  <Prose>Port Angeles has more good food than a town its size should. Kokopelli Grill and Next Door Gastropub are reliable. Port Townsend's food scene punches well above its weight. Forks is practical — timber-town diners and solid provisions for the rainforest.</Prose>
                </div>

                <ContentList onOpenSheet={openSheet('Eat')} items={eatPicks.map(e => {
                  const raw = e.cuisine || e.type || '';
                  return {
                    ...e,
                    type: 'list',
                    badge: raw.charAt(0).toUpperCase() + raw.slice(1),
                    context: `${e.location}${e.reservations ? ' · ' + e.reservations : ''}`,
                    detail: e.highlights?.[0] || '',
                    featured: e.lilaPick,
                    url: e.links?.website,
                    hasNPS: checkNPS(e.name),
                  };
                })} />

                <PlaceGuideCard label="Full Where to Eat Guide" descriptor="Port Angeles · Port Townsend · Forks · provisions" bg="linear-gradient(155deg, #8A9A6A 0%, #5A6B4A 100%)" to="/destinations/olympic-peninsula/where-to-eat" />
              </div>


              {/* ══ 05 HIKES, PADDLES, ETC. ═════════════════════════════════ */}
              <div id="move">
                <SectionTransition num="05" title="Hikes, Paddles, etc." />
                <div style={{ marginTop: 28 }}>
                  <Prose>The Hall of Mosses is the signature — less than a mile through the quietest forest in the contiguous US. Hurricane Ridge delivers alpine panoramas. Rialto Beach puts you on the Pacific with sea stacks and tide pools. But the peninsula has more: Sol Duc Falls, Shi Shi Beach, and some of the best backcountry coast hiking in the American West.</Prose>
                </div>

                <SubLabel>Highlights</SubLabel>
                <ContentList onOpenSheet={openSheet('Move')} items={moveHighlights.map(m => ({
                  ...m,
                  type: 'list',
                  badge: m.moveTier.charAt(0).toUpperCase() + m.moveTier.slice(1),
                  context: `${m.distance || ''} · ${m.difficulty || ''}`.replace(/^\s*·\s*/, '').replace(/\s*·\s*$/, ''),
                  detail: m.highlights?.[0] || '',
                  featured: m.lilaPick,
                  url: m.links?.website,
                  hasNPS: checkNPS(m.name),
                }))} />

                <PlaceGuideCard label="Full Hikes, Paddles, etc. Guide" descriptor="Full trail & activity guide across all zones" bg="linear-gradient(155deg, #6B8F71 0%, #3D6B5A 100%)" to="/destinations/olympic-peninsula/hikes-paddles" />
              </div>

              <Divider />


              {/* ══ 06 HOT SPRINGS & STILLNESS ═════════════════════════════ */}
              <div id="breathe">
                <SectionTransition num="06" title="Hot Springs & Stillness" />
                <div style={{ marginTop: 28 }}>
                  <Prose>The peninsula has a way of slowing the nervous system down. The Hoh Rainforest has been measured as one of the quietest places in the contiguous US. Sol Duc Hot Springs lets you soak in mineral water surrounded by old-growth forest. These are some ways to go deeper with that.</Prose>
                </div>

                <SubLabel>Highlights</SubLabel>
                <ContentList onOpenSheet={openSheet('Breathe')} items={breatheHighlights.map(b => ({
                  ...b,
                  type: 'list',
                  badge: b.breatheTier.charAt(0).toUpperCase() + b.breatheTier.slice(1),
                  context: `${b.type || ''} · ${b.location || ''}`.replace(/^\s*·\s*/, '').replace(/\s*·\s*$/, ''),
                  detail: b.highlights?.[0] || '',
                  featured: b.lilaPick,
                  url: b.links?.website,
                  hasNPS: checkNPS(b.name),
                }))} />

                <PlaceGuideCard label="Full Hot Springs & Stillness Guide" descriptor="Hot springs · forest bathing · silence · restoration" bg="linear-gradient(155deg, #4A9B9F 0%, #3D6B7A 100%)" to="/destinations/olympic-peninsula/hot-springs-stillness" />
              </div>

              <Divider />


              {/* ══ 07 CULTURE & HERITAGE ═══════════════════════════════════ */}
              <div id="experience">
                <SectionTransition num="07" title="Culture & Heritage" />
                <div style={{ marginTop: 28 }}>
                  <Prose>The Olympic Peninsula has a deeper cultural life than most people expect. Nine Indigenous Nations have called this home since time immemorial. Port Townsend carries a Victorian heritage and a thriving arts community. The Makah Museum houses one of the most significant archaeological collections in North America.</Prose>
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
                  hasNPS: checkNPS(e.name),
                }))} />

                <PlaceGuideCard label="Full Culture & Heritage Guide" descriptor="Indigenous heritage · arts · community · discovery" bg="linear-gradient(155deg, #8A7A6A 0%, #5A6B5A 100%)" to="/destinations/olympic-peninsula/culture-heritage" />
              </div>

              <Divider />


              {/* ══ 08 STARS & SKY ════════════════════════════════════════════ */}
              <div id="night-sky">
                <SectionTransition num="08" title="Stars & Sky" />
                <div style={{ marginTop: 28 }}>
                  <Prose>Olympic isn't IDA-certified, but genuine darkness is available from any park campground away from Port Angeles. The rain shadow side — Sequim and Dungeness — offers the clearest skies, especially in summer when the west side is still clouded over.</Prose>
                  <Prose>Hurricane Ridge, at 5,200 feet, often sits above the cloud layer. Deer Park Campground at 5,400 feet is the highest drive-to point in the park — no water, no services, extraordinary sky. Kalaloch Beach offers remote coastal darkness under the sound of surf.</Prose>
                </div>

                <EditorialList items={[
                  { context: 'Above the Clouds', name: 'Hurricane Ridge', detail: 'At 5,200 ft, often above the lowland overcast. When the coast is socked in, the ridge can be clear. Summer nights only — road closes in winter.' },
                  { context: 'Rain Shadow', name: 'Dungeness Spit Area', detail: 'In the rain shadow — 16 inches of rain versus 170 on the west side. The clearest and driest skies on the peninsula.' },
                  { context: 'Coastal Darkness', name: 'Kalaloch Beach', detail: 'Remote coastal darkness. The sound of surf under stars. Accessible year-round from the campground.' },
                  { context: 'Highest Point', name: 'Deer Park Campground', detail: 'The highest drive-to point in the park at 5,400 ft. No water, no services, extraordinary sky.' },
                ]} />

                <PlaceGuideCard label="Full Stars & Sky Guide" descriptor="Viewing areas · best windows · dark sky tips" bg="linear-gradient(155deg, #3D5A6B 0%, #1E2A3E 100%)" to="/destinations/olympic-peninsula/stars-and-sky" />
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
                  Your peninsula trip<br />starts here
                </h3>
                <p style={{ fontFamily: FONTS.body, fontSize: 13, fontWeight: 400, lineHeight: 1.65, color: 'rgba(255,255,255,0.5)', margin: '0 0 28px' }}>
                  Turn this guide into a day-by-day itinerary built around how you actually travel.
                </p>
                <button
                  onClick={() => { trackEvent('guide_cta_clicked', { guide: 'olympic-peninsula' }); navigate('/plan'); }}
                  onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
                  onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                  style={{ fontFamily: FONTS.body, fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#E8E0D5', border: 'none', background: G.darkInk, padding: '14px 32px', cursor: 'pointer', transition: 'opacity 0.2s' }}
                >
                  Plan a Trip →
                </button>
              </div>

              <div style={{ minWidth: 180 }}>
                <div style={{ fontFamily: FONTS.body, fontSize: 9, fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', marginBottom: 16 }}>Place Guides</div>
                {['Terrain & Parks Guide', 'Travel Lightly Guide', 'Stay Guide', 'Eat Guide', 'Move Guide', 'Breathe Guide', 'Culture & Heritage Guide', 'Night Sky Guide'].map((g, i, arr) => (
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
      <WhisperBar destination="olympic" label="Olympic Peninsula" />
      <Footer />
    </>
  );
}
