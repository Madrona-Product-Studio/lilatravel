// ═══════════════════════════════════════════════════════════════════════════════
// PAGE: BIG SUR GUIDE — Editorial Main Page (Redesign v2)
// ═══════════════════════════════════════════════════════════════════════════════
//
// Top-level editorial guide for Big Sur & the Central Coast. Eight sections:
//   01. Terrain & Parks    05. Hikes, Bikes, etc.
//   02. Travel Lightly     06. Yoga & Mindfulness
//   03. Where to Stay      07. Arts & Culture
//   04. Where to Eat       08. Stars & Sky
//
// Route: /destinations/big-sur
//

import { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Nav, Footer, FadeIn, WhisperBar } from '@components';
import { SectionTransition, SubLabel, Prose, ContentList, EditorialList, PlaceGuideCard, GuideDetailSheet, PhotoStrip } from '@components/guide';
import { G, FONTS } from '@data/guides/guide-styles';
import { P } from '@data/photos';
import { trackEvent } from '@utils/analytics';
import { Helmet } from 'react-helmet-async';
import { CelestialDrawer } from '@components';
import { BREATH_CONFIG } from '@data/breathConfig';
import useBreathCanvas from '@hooks/useBreathCanvas';
import { PARKS, TOWNS, HIGHLIGHTS, WILDLIFE, TIMING_WINDOWS } from '@data/guides/big-sur-constants';
import accommodations from '../../data/accommodations/big-sur.json';
import restaurants from '../../data/restaurants/big-sur-eat.json';
import moveItems from '../../data/restaurants/big-sur-move.json';
import breatheItems from '../../data/restaurants/big-sur-breathe.json';
import experiences from '../../data/restaurants/big-sur-experience.json';


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
  context: w.season,
  lat: 36.27,
  lng: -121.81,
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

export default function BigSurGuide() {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth <= 768);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const breathConfig = BREATH_CONFIG.bigSur;
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
        <title>Big Sur Guide — Coastal Wilderness, Hot Springs & Slow Travel | Lila Trips</title>
        <meta name="description" content="Big Sur is slipping into the sea. A guide for travelers who want to experience it deeply and tread lightly while it's still here." />
        <link rel="canonical" href="https://lilatrips.com/destinations/big-sur" />
        <meta property="og:title" content="Big Sur Guide — Coastal Wilderness, Hot Springs & Slow Travel | Lila Trips" />
        <meta property="og:description" content="Big Sur is slipping into the sea. A guide for travelers who want to experience it deeply and tread lightly while it's still here." />
        <meta property="og:url" content="https://lilatrips.com/destinations/big-sur" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://lilatrips.com/og-image.jpg" />
        <meta property="og:image:alt" content="Big Sur — Lila Trips" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Big Sur Guide — Coastal Wilderness, Hot Springs & Slow Travel | Lila Trips" />
        <meta name="twitter:description" content="Big Sur is slipping into the sea. A guide for travelers who want to experience it deeply and tread lightly while it's still here." />
        <meta name="twitter:image" content="https://lilatrips.com/og-image.jpg" />
      </Helmet>
      <Nav breathConfig={breathConfig} breathValueRef={breathValueRef} />

      {/* ══ CELESTIAL DRAWER + BREATH CANVAS ═══════════════════════════════════ */}
      <div ref={breathWrapperRef} style={{ background: breathConfig ? G.warmWhite : undefined }}>
        <CelestialDrawer destination="big-sur" isMobile={isMobile} breathValueRef={breathValueRef} />

        <div style={{ background: breathConfig ? 'transparent' : G.warmWhite, color: G.ink, fontFamily: FONTS.body }}>

          {/* ══ MASTHEAD ═══════════════════════════════════════════════════════ */}
          <div style={{ padding: isMobile ? '68px 20px 32px' : '76px 52px 40px', maxWidth: 1080, margin: '0 auto' }}>
            <div style={{ fontFamily: FONTS.body, fontSize: 10, fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: G.goldenAmber, marginBottom: 20 }}>
              Destination Guide
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 300px', gap: isMobile ? '28px' : '52px', alignItems: 'start' }}>
              <div>
                <h1 style={{ fontFamily: FONTS.body, fontSize: 'clamp(48px, 8vw, 84px)', fontWeight: 700, lineHeight: 0.95, letterSpacing: '-0.02em', color: G.darkInk, margin: '0 0 32px' }}>
                  Big Sur &amp;<br />the Coast
                </h1>
                <p style={{ fontFamily: FONTS.body, fontSize: 16, fontWeight: 400, lineHeight: 1.85, color: G.inkBody, margin: '0 0 16px', maxWidth: 480 }}>
                  Big Sur is not a town. It's a condition. Ninety miles of Highway 1 between Carmel and
                  San Simeon where the Santa Lucia Mountains drop directly into the Pacific — no coastal
                  plain, no buffer, just rock and ocean and redwood and fog. The place has gravity.
                </p>
                <p style={{ fontFamily: FONTS.body, fontSize: 16, fontWeight: 400, lineHeight: 1.85, color: G.inkBody, margin: 0, maxWidth: 480 }}>
                  The orbit pulls north to Carmel-by-the-Sea and Monterey, south toward San Simeon
                  and Cambria. This guide covers the full coast: four parks, four base towns, and
                  one of the most dramatic roads on earth.
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
              { src: P.bigSur,          alt: 'Big Sur coastline at sunset',                    caption: 'Highway 1 · where the mountains meet the sea', width: '32%' },
              { src: P.bigSurSurfer,     alt: 'Surfer at sunset in Big Sur',                    caption: 'Golden hour on the Central Coast',              width: '22%' },
              { src: P.bigSurHiddenCove, alt: 'Hidden cove along the Big Sur coast',            caption: 'Hidden cove · only accessible on foot',         width: '24%' },
              { src: P.bigSurRedwoods,   alt: 'Redwood canopy looking up through towering trunks', caption: 'Looking up through the redwoods',             width: '22%' },
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
                    Big Sur is not a town. It's a condition. Ninety miles of Highway 1 between Carmel
                    and San Simeon where the Santa Lucia Mountains drop directly into the Pacific — no
                    coastal plain, no buffer, just rock and ocean and redwood and fog. The landscape here
                    does something to people. It has always drawn artists, seekers, and writers who needed
                    the edge of the continent to think clearly: Henry Miller, Robinson Jeffers, Jack
                    Kerouac, the founders of Esalen. The place has gravity.
                  </Prose>
                  <Prose>
                    The orbit pulls in two directions. North, Carmel-by-the-Sea is a fairytale village —
                    cottage gardens, galleries, one of the most beautiful white-sand beaches in California.
                    Further north, Monterey is the working counterpoint: the Aquarium, Cannery Row, a
                    serious food scene, the Monterey Bay National Marine Sanctuary extending 276 miles
                    along the coast. These towns are not afterthoughts to Big Sur — they are the base camp.
                  </Prose>
                </div>

                <SubLabel>The Parks</SubLabel>
                <Prose>Four parks, four distinct personalities. Los Padres is the wild backbone. Julia Pfeiffer Burns has the iconic waterfall. Pfeiffer Big Sur is the heart of the valley. Andrew Molera is the expansive, uncrowded one.</Prose>
                <EditorialList items={PARKS_EDITORIAL.map(p => ({ context: p.context, name: p.name, detail: p.description, url: p.url }))} />

                <SubLabel>The Towns</SubLabel>
                <EditorialList items={TOWNS_EDITORIAL.map(t => ({ context: t.context, name: t.name, detail: t.description, url: t.url }))} />

                <SubLabel>When to Go</SubLabel>
                <Prose>Big Sur rewards every season differently. These are the moments when the coast is most alive.</Prose>
                <EditorialList items={TIMING_WINDOWS.map(tw => ({ context: tw.context, name: tw.name, detail: tw.detail }))} />

                <SubLabel>Coastal Wildlife</SubLabel>
                <Prose>The coast is alive. Condors ride thermals above the ridges. Sea otters float in the kelp. Gray whales breach offshore. Pay attention at dawn and dusk.</Prose>
                <ContentList items={wildlifeItems} onOpenSheet={openSheet('Wildlife')} />

                <PlaceGuideCard label="Full Terrain & Parks Guide" descriptor="Parks · Towns · When to go · Coastal wildlife" bg="linear-gradient(155deg, #7A9B9A 0%, #5A7A6A 100%)" to="/destinations/big-sur/terrain-and-parks" />
              </div>

              <Divider />


              {/* ══ 02 TRAVEL LIGHTLY ═════════════════════════════════════════ */}
              <div id="responsibly">
                <SectionTransition num="02" title="Travel Lightly" />
                <div style={{ marginTop: 28 }}>
                  <Prose>
                    What Big Sur asks of you is presence. The road is too narrow and winding for
                    distraction. The vistas demand pause. The fog that rolls in most mornings burns
                    off by noon, and when it does, the light on the water is unrepeatable. How you
                    move through this place matters — for the place itself, and for the 1,500 people
                    who actually live here.
                  </Prose>
                </div>

                <SubLabel warm>Highway 1 · Erosion & Access</SubLabel>
                <Prose>The dramatic cliffs of Big Sur aren't a stable place to build a highly trafficked highway — collapses, mudslides, and fires are a recurring reality. The pullouts are engineered for momentary stops, not extended gatherings. Parking on the shoulder damages drainage infrastructure that keeps the road viable. When a section closes, it closes for everyone — including the 1,500 people who live here.</Prose>

                <SubLabel warm>Overtourism · Bixby Bridge</SubLabel>
                <Prose>Bixby Creek Bridge has become a tourist magnet — traffic jams, illegal parking, visitors clambering down unstable cliffs for the shot. We route toward the interior trails and quieter coves instead. The encounter feels earned rather than extracted. Several of the most-photographed spots along this coast are on private land or actively eroding. Closed means closed.</Prose>

                <SubLabel warm>Fire & Camping</SubLabel>
                <Prose>The Soberanes Fire of 2016 started from an illegal campfire. Big Sur's coastal scrub and redwood understory ignite fast in dry conditions. Dispersed camping outside designated sites is not just illegal here — it's genuinely dangerous for the ecosystem and for the permanent community that depends on Highway 1 remaining open. Book a site or a stay.</Prose>

                <SubLabel warm>Resident Community</SubLabel>
                <Prose>Big Sur's permanent population is just 1,500 people. Four to five million visitors come annually. Many of the most beautiful spots are on private land or actively managed for conservation. The locals who remain here have chosen a difficult life in exchange for the landscape. Respect that bargain — and when you find somewhere that feels undiscovered, consider not sharing the exact location.</Prose>

                <SubLabel warm>Give Back</SubLabel>
                <Prose>The Big Sur Land Trust has conserved over 45,000 acres of Monterey County coastline and interior lands. They partner with the Esselen Tribe to manage Basin Ranch using traditional ecological stewardship. Los Padres ForestWatch protects the interior backbone from overdevelopment and fire mismanagement. Both are worth supporting.</Prose>

                <PlaceGuideCard label="Full Travel Lightly Guide" descriptor="Tread lightly · give back · indigenous stewardship · local support" bg="linear-gradient(155deg, #A8896A 0%, #4A6B5A 100%)" to="/destinations/big-sur/travel-lightly" />
              </div>

              <Divider />


              {/* ══ 03 WHERE TO STAY ══════════════════════════════════════════ */}
              <div id="stay">
                <SectionTransition num="03" title="Where to Stay" />
                <div style={{ marginTop: 28 }}>
                  <Prose>Big Sur's lodging is as varied as the coast itself — from clifftop glamping at Treebones to the historic rusticity of Deetjen's Big Sur Inn to the world-class Post Ranch Inn. If you're running the full orbit, plan to split nights between the Big Sur corridor, Carmel, and Monterey.</Prose>
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
                }))} />

                <PlaceGuideCard label="Full Where to Stay Guide" descriptor="Full accommodations across Big Sur, Carmel, Monterey & Cambria" bg="linear-gradient(155deg, #C4A882 0%, #8A7A6A 100%)" to="/destinations/big-sur/where-to-stay" />
              </div>

              <Divider />


              {/* ══ 04 WHERE TO EAT ═══════════════════════════════════════════ */}
              <div id="eat">
                <SectionTransition num="04" title="Where to Eat" />
                <div style={{ marginTop: 28 }}>
                  <Prose>Nepenthe is the iconic perch — burgers on a terrace 800 feet above the ocean. Deetjen's does the candlelit dinner. Sierra Mar at Post Ranch is the splurge with a view that earns every dollar. Head north and Carmel has a food scene that punches well above its one-square-mile footprint. Monterey anchors the working end with Cannery Row and the wharf.</Prose>
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
                  };
                })} />

                <PlaceGuideCard label="Full Where to Eat Guide" descriptor="Big Sur corridor · Carmel · Monterey · provisions" bg="linear-gradient(155deg, #C49A6A 0%, #8A6A4A 100%)" to="/destinations/big-sur/where-to-eat" />
              </div>


              {/* ══ 05 HIKES, BIKES, ETC. ═════════════════════════════════════ */}
              <div id="move">
                <SectionTransition num="05" title="Hikes, Bikes, etc." />
                <div style={{ marginTop: 28 }}>
                  <Prose>Ewoldsen Trail is the signature — old-growth redwoods that open onto coastal ridge views in a single switchback. Point Lobos is the crown jewel of California's state reserves. The Ventana Wilderness offers genuine backcountry. And the coast itself — sea kayaking, surfing at Sand Dollar Beach, cycling Highway 1 — is the real activity guide.</Prose>
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
                }))} />

                <PlaceGuideCard label="Full Hikes, Bikes, etc. Guide" descriptor="Full trail & activity guide across the coast" bg="linear-gradient(155deg, #8AAA7A 0%, #4A6A5A 100%)" to="/destinations/big-sur/hikes-bikes" />
              </div>

              <Divider />


              {/* ══ 06 YOGA & MINDFULNESS ═════════════════════════════════════ */}
              <div id="breathe">
                <SectionTransition num="06" title="Yoga & Mindfulness" />
                <div style={{ marginTop: 28 }}>
                  <Prose>Esalen Institute put Big Sur on the map for a reason — the hot springs on the cliff edge, the workshops, the long history of consciousness exploration. But the coast itself does the work. The sound of surf through redwoods, the fog burning off, the scale of the landscape — it recalibrates the nervous system whether you intend it to or not.</Prose>
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
                }))} />

                <PlaceGuideCard label="Full Yoga & Mindfulness Guide" descriptor="Esalen · hot springs · yoga · bodywork · restore" bg="linear-gradient(155deg, #8AADA8 0%, #4A6B7A 100%)" to="/destinations/big-sur/yoga-mindfulness" />
              </div>

              <Divider />


              {/* ══ 07 ARTS & CULTURE ═════════════════════════════════════════ */}
              <div id="experience">
                <SectionTransition num="07" title="Arts & Culture" />
                <div style={{ marginTop: 28 }}>
                  <Prose>The landscape has attracted artists, writers, and seekers for over a century. Henry Miller wrote here. Robinson Jeffers built Tor House from the granite of Carmel Point. The Henry Miller Library in Big Sur is part bookshop, part cultural center, part gathering place. Carmel's 80+ galleries and Monterey's Cannery Row carry a cultural density that surprises visitors.</Prose>
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

                <PlaceGuideCard label="Full Art & Culture Guide" descriptor="Arts · literature · culture · community" bg="linear-gradient(155deg, #B8956A 0%, #6A7A5A 100%)" to="/destinations/big-sur/arts-and-culture" />
              </div>

              <Divider />


              {/* ══ 08 STARS & SKY ════════════════════════════════════════════ */}
              <div id="night-sky">
                <SectionTransition num="08" title="Stars & Sky" />
                <div style={{ marginTop: 28 }}>
                  <Prose>Big Sur has some of the darkest skies on the California coast — Bortle 2 at Pfeiffer Beach on clear nights. The marine layer is the variable: it can roll in fast and erase the sky, or part dramatically to frame the Milky Way over the ocean.</Prose>
                  <Prose>Kirk Creek Campground offers clifftop sites with unobstructed ocean horizon. Pfeiffer Ridge rises above the marine layer when the coast is socked in. Andrew Molera's beach access opens a wide, dark sky at the river mouth.</Prose>
                </div>

                <EditorialList items={[
                  { context: 'Bortle Class 2', name: 'Pfeiffer Beach', detail: 'Bortle 2 on clear nights. The keyhole rock silhouetted against the Milky Way is the defining image.' },
                  { context: 'Clifftop', name: 'Kirk Creek Campground', detail: 'Clifftop sites with unobstructed ocean horizon. Fall asleep to the sound of surf under open sky.' },
                  { context: 'Above the Fog', name: 'Pfeiffer Ridge', detail: 'Higher elevation, above the marine layer. When the coast is socked in, the ridge is often clear.' },
                  { context: 'Best Window', name: 'June – October', detail: 'Milky Way core visible March through October. Perseids peak mid-August. Best after midnight in spring, earlier as summer progresses.' },
                ]} />

                <PlaceGuideCard label="Full Stars & Sky Guide" descriptor="Dark sky ratings · best windows · viewing locations" bg="linear-gradient(155deg, #5A6B8A 0%, #1E2A3E 100%)" to="/destinations/big-sur/stars-and-sky" />
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
                  Your coastal trip<br />starts here
                </h3>
                <p style={{ fontFamily: FONTS.body, fontSize: 13, fontWeight: 400, lineHeight: 1.65, color: 'rgba(255,255,255,0.5)', margin: '0 0 28px' }}>
                  Turn this guide into a day-by-day itinerary built around how you actually travel.
                </p>
                <button
                  onClick={() => { trackEvent('guide_cta_clicked', { guide: 'big-sur' }); navigate('/plan'); }}
                  onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
                  onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                  style={{ fontFamily: FONTS.body, fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#E8E0D5', border: 'none', background: G.darkInk, padding: '14px 32px', cursor: 'pointer', transition: 'opacity 0.2s' }}
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
      <WhisperBar destination="bigSur" label="Big Sur" />
      <Footer />
    </>
  );
}
