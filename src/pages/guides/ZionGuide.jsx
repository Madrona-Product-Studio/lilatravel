// ═══════════════════════════════════════════════════════════════════════════════
// PAGE: ZION GUIDE — Editorial Main Page (Redesign v2)
// ═══════════════════════════════════════════════════════════════════════════════
//
// Top-level editorial guide for Zion & its orbit. Eight sections:
//   01. Terrain & Parks    05. Hikes, Bikes, etc.
//   02. Travel Lightly     06. Yoga & Mindfulness
//   03. Where to Stay      07. Arts & Culture
//   04. Where to Eat       08. Stars & Sky
//
// Route: /destinations/zion-canyon
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
import { PARKS, TOWNS, WILDLIFE_GROUPS } from '@data/guides/zion-constants';
import accommodations from '../../data/accommodations/zion.json';
import restaurants from '../../data/restaurants/zion-eat.json';
import moveItems from '../../data/restaurants/zion-move.json';
import breatheItems from '../../data/restaurants/zion-breathe.json';
import experiences from '../../data/restaurants/zion-experience.json';


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

const TIMING_WINDOWS = [
  { name: 'The Golden Corridor', window: 'Late Sept \u2013 Oct', detail: 'Cottonwoods turn gold along the Virgin River. Crowds thin. Light goes amber. Best hiking weather of the year.' },
  { name: 'Spring Equinox', window: 'Mar \u2013 Apr', detail: 'After a wet winter, the desert floor erupts in wildflowers. Cacti crown themselves. The canyon wakes up.' },
  { name: 'Dark Sky Season', window: 'Jun \u2013 Sep nights', detail: 'Warm nights for stargazing. The Milky Way peaks overhead June through September. Zion is a certified Dark Sky Park.' },
  { name: 'Winter Solstice', window: 'Dec 19\u201322', detail: 'Shortest day, most dramatic canyon light. Snow dusting the upper walls. Fewer people, deeper silence.' },
];

const WILDLIFE = [
  { name: 'California Condor', detail: 'Reintroduced to Zion in 1996. Wingspan up to 9.5 ft \u2014 visible as a dark silhouette riding thermals above the canyon rim.', season: 'Year-round', parks: ['Zion'] },
  { name: 'Desert Bighorn Sheep', detail: 'Often seen on rocky ledges above the canyon floor, especially along the Angels Landing trail. Completely at home on near-vertical terrain.', season: 'Year-round', parks: ['Zion', 'Capitol Reef'] },
  { name: 'Ringtail Cat', detail: 'Nocturnal, rarely seen. Related to raccoons. Lives in rocky outcrops and canyon walls. Enormous eyes for hunting at night.', season: 'Year-round', parks: ['Zion'] },
];

const wildlifeItems = WILDLIFE.map(w => ({
  ...w,
  type: 'wildlife',
  badge: 'Wildlife',
  context: w.season,
  lat: 37.2,
  lng: -112.9,
}));

// Mockup park descriptions (editorial, differs from zion-constants data)
const PARKS_EDITORIAL = [
  { name: 'Zion National Park',         context: 'Canyon \u00B7 River \u00B7 Desert',    url: 'https://www.nps.gov/zion/', description: 'The anchor. Sandstone walls two thousand feet high, the Virgin River running through the floor of it. Most people come, do the Narrows, do Angels Landing, and leave. This guide is for the ones who want to actually be inside the place.' },
  { name: 'Bryce Canyon National Park', context: 'High Plateau \u00B7 Hoodoos',          url: 'https://www.nps.gov/brca/', description: 'Lifts you 8,000 feet into a forest of stone pillars. The hoodoos form from frost wedging and erosion \u2014 water that freezes in cracks overnight and expands until the rock gives way. Spectacular at sunrise.' },
  { name: 'Capitol Reef National Park', context: 'Waterpocket Fold \u00B7 Solitude',     url: 'https://www.nps.gov/care/', description: 'A hundred-mile wrinkle in the earth\u2019s crust that most people drive right past. Orchards planted by early settlers still fruit every fall. The least visited of the three \u2014 which is most of its appeal.' },
];

// Mockup town descriptions (editorial)
const TOWNS_EDITORIAL = [
  { name: 'Springdale',  context: 'Your Home Base',       url: 'https://www.zionpark.com/', description: 'A single-street town pressed against the canyon mouth. Walk to the park entrance. Restaurants, gear shops, and galleries line the half-mile stretch \u2014 all sandstone red and cottonwood green.' },
  { name: 'Kanab',       context: 'Film-Set Desert Town', url: 'https://visitsouthernutah.com/kanab/', description: 'An hour south of Zion. Old Western film sets, a growing food scene, and the staging point for permits to The Wave and Buckskin Gulch.' },
  { name: 'Escalante',   context: 'Trailhead Town',       url: 'https://www.escalante.cc/', description: 'A one-stoplight town on Scenic Byway 12. Slot canyons, petrified forests, and the kind of solitude the main parks can\u2019t offer.' },
  { name: 'Torrey',      context: 'Capitol Reef Gateway',  url: 'https://www.capitolreefcountry.com/', description: 'A handful of buildings at the edge of the Waterpocket Fold. The nearest services to Capitol Reef. The orchards start just down the road.' },
];


// ─── Data derivations ───────────────────────────────────────────────────────

const sleepPicks = accommodations.filter(a => a.lilaPick).slice(0, 4);
const eatPicks = restaurants.filter(r => r.lilaPick).slice(0, 4);
const moveHighlights = moveItems.filter(m => m.lilaPick).slice(0, 4);
const breatheHighlights = breatheItems.filter(b => b.lilaPick).slice(0, 4);
const experienceHighlights = experiences.filter(e => e.featured || e.lilaPick).slice(0, 4);


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

export default function ZionGuide() {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth <= 768);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const breathConfig = BREATH_CONFIG.zion;
  const breathWrapperRef = useRef(null);
  const breathValueRef = useBreathCanvas(breathConfig, breathWrapperRef);

  // ── NPS Data ──
  const [npsLookup, setNpsLookup] = useState(null);
  const [activeSheet, setActiveSheet] = useState(null);

  useEffect(() => {
    getNPSData(['zion', 'brca', 'care'])
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
    const offset = 44 + 16; // guideNav + padding (guideNav covers main nav when sticky)
    const y = el.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top: y, behavior: 'smooth' });
    setActiveSection(id);
  }, []);


  return (
    <>
      <Helmet>
        <title>Zion Guide — Southern Utah Destination Guide | Lila Trips</title>
        <meta name="description" content="An editorial guide to Zion and its orbit — trails, dark sky, where to stay, and how to move through Southern Utah with intention." />
        <link rel="canonical" href="https://lilatrips.com/destinations/zion-canyon" />
        <meta property="og:title" content="Zion Guide — Southern Utah Destination Guide | Lila Trips" />
        <meta property="og:description" content="An editorial guide to Zion and its orbit — trails, dark sky, where to stay, and how to move through Southern Utah with intention." />
        <meta property="og:url" content="https://lilatrips.com/destinations/zion-canyon" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://lilatrips.com/og-image.png" />
        <meta property="og:image:alt" content="Zion — Lila Trips" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Zion Guide — Southern Utah Destination Guide | Lila Trips" />
        <meta name="twitter:description" content="An editorial guide to Zion and its orbit — trails, dark sky, where to stay, and how to move through Southern Utah with intention." />
        <meta name="twitter:image" content="https://lilatrips.com/og-image.png" />
      </Helmet>
      <Nav breathConfig={breathConfig} breathValueRef={breathValueRef} />

      {/* ══ CELESTIAL DRAWER + BREATH CANVAS ═══════════════════════════════════ */}
      <div ref={breathWrapperRef} style={{ background: breathConfig ? G.warmWhite : undefined }}>
        <CelestialDrawer destination="zion" isMobile={isMobile} breathValueRef={breathValueRef} />

        <div style={{ background: breathConfig ? 'transparent' : G.warmWhite, color: G.ink, fontFamily: FONTS.body }}>

          {/* ══ MASTHEAD ═══════════════════════════════════════════════════════ */}
          <div style={{ padding: isMobile ? '68px 20px 32px' : '76px 52px 40px', maxWidth: 1080, margin: '0 auto' }}>
            <div style={{ fontFamily: FONTS.body, fontSize: 10, fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: G.goldenAmber, marginBottom: 20 }}>
              Destination Guide
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 300px', gap: isMobile ? '28px' : '52px', alignItems: 'start' }}>
              <div>
                <h1 style={{ fontFamily: FONTS.body, fontSize: 'clamp(48px, 8vw, 84px)', fontWeight: 700, lineHeight: 0.95, letterSpacing: '-0.02em', color: G.darkInk, margin: '0 0 32px' }}>
                  Zion &amp;<br />Its Orbit
                </h1>
                <p style={{ fontFamily: FONTS.body, fontSize: 16, fontWeight: 400, lineHeight: 1.85, color: G.inkBody, margin: '0 0 16px', maxWidth: 480 }}>
                  The walls are two thousand feet high and the river runs through the floor of it.
                  Something in the ordinary mind gets quiet the moment you arrive.
                </p>
                <p style={{ fontFamily: FONTS.body, fontSize: 16, fontWeight: 400, lineHeight: 1.85, color: G.inkBody, margin: 0, maxWidth: 480 }}>
                  This guide covers the full landscape: three parks, four towns, and one of the most
                  dramatic roads in the American West. Built for people who want to actually be inside the place.
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
          <PhotoStrip
            isMobile={isMobile}
            images={[
              { src: P.zionWatchman, alt: 'The Watchman at golden hour', caption: 'The Watchman · golden hour', width: '32%' },
              { src: P.zionNarrows, alt: 'The Narrows', caption: 'The Narrows', width: '22%' },
              { src: P.bryceCanyon, alt: 'Bryce Canyon hoodoos', caption: 'Bryce Canyon · hoodoos', width: '24%' },
              { src: P.capitolReef, alt: 'Capitol Reef at sunset', caption: 'Capitol Reef · sunset', width: '22%' },
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
                    There are places you visit and places that visit you. Zion is the second kind.
                    The canyon walls close in above you — sandstone cut two thousand feet high, copper
                    at sunrise, impossible pink at dusk — and something in the ordinary mind gets quiet.
                    The Paiute people called it Mukuntuweap: straight-up land. Whatever you call it,
                    you feel it the moment you arrive.
                  </Prose>
                  <Prose>
                    But Zion is just the anchor. Three parks, three personalities, connected by some
                    of the most dramatic road in America. A week here, done right, is genuinely
                    disorienting — in the best way.
                  </Prose>
                </div>

                <SubLabel>The Terrain</SubLabel>
                <Prose>Three parks, three distinct personalities. Zion is intimate — the canyon holds you. Bryce is theatrical — the hoodoos perform. Capitol Reef is quiet and immense — the Waterpocket Fold stretches a hundred miles and most people never stop to look at it.</Prose>
                <EditorialList items={PARKS_EDITORIAL.map(p => ({ context: p.context, name: p.name, detail: p.description, url: p.url }))} />

                <SubLabel>When to Go</SubLabel>
                <Prose>The desert doesn't do subtle — it blooms, it burns gold, it goes silent under snow. These are the windows we build trips around.</Prose>
                <EditorialList items={TIMING_WINDOWS.map(tw => ({ context: tw.window, name: tw.name, detail: tw.detail }))} />

                <SubLabel>Desert Wildlife</SubLabel>
                <Prose>The canyon's biodiversity surprises people. The Virgin River riparian corridor supports nearly 300 bird species, plus mammals that most visitors never see.</Prose>
                <ContentList items={wildlifeItems} onOpenSheet={openSheet('Wildlife')} />

                <PlaceGuideCard label="Full Terrain & Parks Guide" descriptor="Terrain · When to go · Desert wildlife" bg="linear-gradient(155deg, #C4956A 0%, #7A9190 100%)" to="/destinations/zion/terrain-and-parks" />
              </div>

              <Divider />


              {/* ══ 02 TRAVEL LIGHTLY ═════════════════════════════════════════ */}
              <div id="responsibly">
                <SectionTransition num="02" title="Travel Lightly" />
                <div style={{ marginTop: 28 }}>
                  <Prose>
                    The canyon doesn't belong to any single story. The Paiute people called this place
                    Mukuntuweap — straight-up land — for thousands of years before a Methodist minister
                    renamed it in 1916. Some stories were here first. How you move through this place matters.
                  </Prose>
                </div>

                <SubLabel warm>Tread Lightly</SubLabel>
                <Prose>The dark, lumpy crust visible just off the trail is cryptobiotic soil — a living community of cyanobacteria, lichens, and fungi that can take 50–250 years to recover from a single footstep. It holds the desert floor together. It looks like nothing. It is everything.</Prose>
                <Prose>The Virgin River sustains one of the most biodiverse riparian corridors in the Southwest. Apply sunscreen well before entering the water. Pack out everything. The river is not a wash.</Prose>

                <SubLabel warm>Give Back</SubLabel>
                <Prose>The Zion Forever Project is the official nonprofit partner of Zion National Park — they fund trail restoration, youth programs, and ranger-led education. The Colorado Plateau Dark Sky Cooperative maintains night sky designations across the region. Both are worth supporting.</Prose>

                <SubLabel warm>Native Culture</SubLabel>
                <Prose>The Southern Paiute people have maintained a relationship with this landscape for thousands of years. The name Mukuntuweap, the rock art along canyon walls, the plant knowledge embedded in the desert — these are living traditions, not museum exhibits. Approach them with that understanding.</Prose>

                <SubLabel warm>Supporting People Here</SubLabel>
                <Prose>Springdale's economy runs almost entirely on tourism. Eat at locally owned restaurants, buy from local galleries, hire local guides. The difference between a national park visit and a real experience of a place is usually the people you meet who actually live there.</Prose>

                <PlaceGuideCard label="Full Travel Lightly Guide" descriptor="Tread lightly · give back · native culture · local support" bg="linear-gradient(155deg, #A8896A 0%, #4A6B5A 100%)" to="/destinations/zion/travel-lightly" />
              </div>

              <Divider />


              {/* ══ 03 WHERE TO STAY ══════════════════════════════════════════ */}
              <div id="stay">
                <SectionTransition num="03" title="Where to Stay" />
                <div style={{ marginTop: 28 }}>
                  <Prose>Springdale is the move for a Zion-focused trip — you can walk to the park entrance. If you're running the full orbit, plan to split nights. The corridor towns are worth slowing down in.</Prose>
                </div>

                <SubLabel>Towns</SubLabel>
                <EditorialList items={TOWNS_EDITORIAL.map(t => ({ context: t.context, name: t.name, detail: t.description, url: t.url }))} />

                <SubLabel>Hotels</SubLabel>
                <p style={{ fontFamily: FONTS.body, fontSize: 13, fontWeight: 400, color: G.ink40, marginBottom: 0 }}>A few we like across the region:</p>
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

                <PlaceGuideCard label="Full Where to Stay Guide" descriptor="Full accommodations across Springdale, Kanab, Escalante & Torrey" bg="linear-gradient(155deg, #C4A882 0%, #8A7A6A 100%)" to="/destinations/zion/where-to-stay" />
              </div>

              <Divider />


              {/* ══ 04 WHERE TO EAT ═══════════════════════════════════════════ */}
              <div id="eat">
                <SectionTransition num="04" title="Where to Eat" />
                <div style={{ marginTop: 28 }}>
                  <Prose>Springdale has more good food than a town its size should. Oscar's is the local breakfast institution. Deep Creek does the coffee right. Bit & Spur is the dinner move — Southwestern with actual range. And if you make it to Boulder on Scenic Byway 12, Hell's Backbone Grill is one of the best farm-to-table restaurants in the West, full stop.</Prose>
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

                <PlaceGuideCard label="Full Where to Eat Guide" descriptor="Springdale · Byway 12 · provisions" bg="linear-gradient(155deg, #C49A6A 0%, #8A6A4A 100%)" to="/destinations/zion/where-to-eat" />
              </div>


              {/* ══ 05 HIKES, BIKES, ETC. ═════════════════════════════════════ */}
              <div id="move">
                <SectionTransition num="05" title="Hikes, Bikes, etc." />
                <div style={{ marginTop: 28 }}>
                  <Prose>The Narrows is the signature — wading a river through slot canyon walls two thousand feet high. Angels Landing is the one everyone knows. But the orbit has more: Bryce Canyon's rim trail at dawn, Capitol Reef's desert varnish canyons, and some of the best canyoneering in the American Southwest.</Prose>
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

                <PlaceGuideCard label="Full Hikes, Bikes, etc. Guide" descriptor="Full trail & activity guide across all three parks" bg="linear-gradient(155deg, #8AAA7A 0%, #4A6A5A 100%)" to="/destinations/zion/hikes-bikes" />
              </div>

              <Divider />


              {/* ══ 06 YOGA & MINDFULNESS ═════════════════════════════════════ */}
              <div id="breathe">
                <SectionTransition num="06" title="Yoga & Mindfulness" />
                <div style={{ marginTop: 28 }}>
                  <Prose>The canyon has a way of slowing the nervous system down. The scale of the walls, the sound of the river, the way the light changes every twenty minutes — it works on you whether you intend it to or not. These are some ways to go deeper with that.</Prose>
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

                <PlaceGuideCard label="Full Yoga & Mindfulness Guide" descriptor="Yoga · bodywork · sauna · cold plunge · restore" bg="linear-gradient(155deg, #8AADA8 0%, #4A6B7A 100%)" to="/destinations/zion/yoga-mindfulness" />
              </div>

              <Divider />


              {/* ══ 07 ARTS & CULTURE ═════════════════════════════════════════ */}
              <div id="experience">
                <SectionTransition num="07" title="Arts & Culture" />
                <div style={{ marginTop: 28 }}>
                  <Prose>Southern Utah has a deeper cultural life than most people expect. The landscape has attracted artists, writers, and naturalists for over a century. The towns along Scenic Byway 12 carry that history in their galleries, ghost towns, and community programs.</Prose>
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

                <PlaceGuideCard label="Full Art & Culture Guide" descriptor="Arts · culture · food · community" bg="linear-gradient(155deg, #B8956A 0%, #6A7A5A 100%)" to="/destinations/zion/arts-and-culture" />
              </div>

              <Divider />


              {/* ══ 08 STARS & SKY ════════════════════════════════════════════ */}
              <div id="night-sky">
                <SectionTransition num="08" title="Stars & Sky" />
                <div style={{ marginTop: 28 }}>
                  <Prose>At night, the sky opens. Zion is a certified International Dark Sky Park. On a moonless night, the Milky Way arcs directly overhead between the canyon walls — framed by two thousand feet of sandstone on either side. Bring a blanket, lie down, give yourself an hour.</Prose>
                  <Prose>Bryce Canyon is one of the darkest places in the continental United States. Capitol Reef offers Bortle Class 2 skies — almost no light pollution at all.</Prose>
                </div>

                <EditorialList items={[
                  { context: 'Bortle Class 3', name: 'Zion National Park', detail: 'Certified International Dark Sky Park. Best viewing from Zion Canyon Scenic Drive after the last shuttle.' },
                  { context: 'Bortle Class 2', name: 'Bryce Canyon', detail: 'Among the darkest parks in the country. Annual Astronomy Festival in June. Best at higher elevations.' },
                  { context: 'Bortle Class 2', name: 'Capitol Reef', detail: 'Remote and uncrowded. Virtually no light pollution. Best of the three for serious dark sky photography.' },
                  { context: 'Best Window', name: 'June \u2013 September', detail: 'New moon periods June through September. Milky Way core visible May\u2013October. Perseids peak mid-August.' },
                ]} />

                <PlaceGuideCard label="Full Stars & Sky Guide" descriptor="Dark sky ratings · best windows · ranger programs" bg="linear-gradient(155deg, #5A6B8A 0%, #1E2A3E 100%)" to="/destinations/zion/stars-and-sky" />
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
                  Your Zion trip<br />starts here
                </h3>
                <p style={{ fontFamily: FONTS.body, fontSize: 13, fontWeight: 400, lineHeight: 1.65, color: 'rgba(255,255,255,0.5)', margin: '0 0 28px' }}>
                  Turn this guide into a day-by-day itinerary built around how you actually travel.
                </p>
                <button
                  onClick={() => { trackEvent('guide_cta_clicked', { guide: 'zion' }); navigate('/plan'); }}
                  onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
                  onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                  style={{ fontFamily: FONTS.body, fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#E8E0D5', border: 'none', background: G.darkInk, padding: '14px 32px', cursor: 'pointer', transition: 'opacity 0.2s' }}
                >
                  Plan a Trip →
                </button>
              </div>

              <div style={{ minWidth: 180 }}>
                <div style={{ fontFamily: FONTS.body, fontSize: 9, fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', marginBottom: 16 }}>Place Guides</div>
                {['Terrain & Parks Guide', 'Travel Responsibly Guide', 'Stay Guide', 'Eat Guide', 'Move Guide', 'Breathe Guide', 'Art & Culture Guide', 'Night Sky Guide'].map((g, i, arr) => (
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
      <WhisperBar destination="zion" label="Zion" />
      <Footer />
    </>
  );
}
