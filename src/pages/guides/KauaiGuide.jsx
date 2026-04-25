// =================================================================================
// PAGE: KAUAI GUIDE -- Editorial Main Page (Redesign v2)
// =================================================================================
//
// Top-level editorial guide for Kauai -- The Garden Isle. Eight sections:
//   01. Terrain & Parks    05. Hikes, Surf, etc.
//   02. Travel Lightly     06. Yoga & Healing
//   03. Where to Stay      07. Culture & Heritage
//   04. Where to Eat       08. Stars & Sky
//
// Route: /destinations/kauai
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
import { PARKS, TOWNS, WILDLIFE, TIMING_WINDOWS, ISLAND_AREAS, HIGHLIGHTS } from '@data/guides/kauai-constants';
import accommodations from '../../data/accommodations/kauai.json';
import restaurants from '../../data/restaurants/kauai-eat.json';
import moveItems from '../../data/restaurants/kauai-move.json';
import breatheItems from '../../data/restaurants/kauai-breathe.json';
import experiences from '../../data/restaurants/kauai-experience.json';


// --- Constants -------------------------------------------------------------------

const GUIDE_SECTIONS = [
  { id: 'the-place',   label: 'Terrain & Parks' },
  { id: 'responsibly', label: 'Travel Lightly' },
  { id: 'stay',        label: 'Where to Stay' },
  { id: 'eat',         label: 'Where to Eat' },
  { id: 'move',        label: 'Hikes, Surf, etc.' },
  { id: 'breathe',     label: 'Yoga & Healing' },
  { id: 'experience',  label: 'Culture & Heritage' },
  { id: 'night-sky',   label: 'Stars & Sky' },
];

const PARKS_EDITORIAL = PARKS.map(p => ({
  context: p.attribute || p.designation,
  name: p.name,
  detail: p.soul,
  url: p.url,
}));

const TOWNS_EDITORIAL = TOWNS.map(t => ({
  context: t.context,
  name: t.name,
  detail: t.description,
  url: t.url,
}));


// --- Data derivations ------------------------------------------------------------

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
  lat: 22.07,
  lng: -159.52,
}));


// --- Divider ---------------------------------------------------------------------

function Divider() {
  return <div style={{ height: '0.5px', background: G.border, margin: '56px 0 0' }} />;
}


// --- GuideNav --------------------------------------------------------------------

function GuideNav({ activeSection, onNav, isMobile }) {
  const scrollContainerRef = useRef(null);
  const activeRef = useRef(null);

  // Auto-scroll active tab into view on mobile
  useEffect(() => {
    if (isMobile && activeRef.current && scrollContainerRef.current) {
      activeRef.current.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
    }
  }, [activeSection, isMobile]);

  return (
    <div ref={scrollContainerRef} className="guide-nav-scroll" style={{
      position: 'sticky', top: 64, zIndex: 98,
      background: G.warmWhite,
      borderBottom: `0.5px solid ${G.border}`,
      display: 'flex', alignItems: 'center', justifyContent: isMobile ? 'flex-start' : 'center',
      padding: isMobile ? '0 12px' : '0 52px', height: isMobile ? 48 : 44,
      overflowX: 'auto', scrollbarWidth: 'none', msOverflowStyle: 'none',
    }}>
      <style>{`.guide-nav-scroll::-webkit-scrollbar { display: none; }`}</style>
      {GUIDE_SECTIONS.map(s => {
        const active = activeSection === s.id;
        return (
          <button
            key={s.id}
            ref={active ? activeRef : undefined}
            onClick={() => onNav(s.id)}
            style={{
              fontFamily: FONTS.body, fontSize: 10, fontWeight: 600,
              letterSpacing: '0.14em', textTransform: 'uppercase',
              background: 'none', border: 'none', cursor: 'pointer',
              padding: isMobile ? '0 16px' : '0 14px', height: isMobile ? 48 : 44,
              whiteSpace: 'nowrap', flexShrink: 0,
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


// --- Main Page -------------------------------------------------------------------

export default function KauaiGuide() {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth <= 768);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const breathConfig = BREATH_CONFIG.kauai;
  const breathWrapperRef = useRef(null);
  const breathValueRef = useBreathCanvas(breathConfig, breathWrapperRef);

  // -- No NPS for Hawaii state parks --
  const [activeSheet, setActiveSheet] = useState(null);

  const openSheet = useCallback((section) => (item) => {
    setActiveSheet({ ...item, section });
  }, []);

  // -- IntersectionObserver for active section --
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
        <title>Kauai Guide — Na Pali, Sacred Land & Intentional Travel | Lila Trips</title>
        <meta name="description" content="Kauai is not just a destination — it's a responsibility. Curated trails, sacred valleys, and a guide built around reciprocity with Hawaiian land and culture." />
        <link rel="canonical" href="https://lilatrips.com/destinations/kauai" />
        <meta property="og:title" content="Kauai Guide — Na Pali, Sacred Land & Intentional Travel | Lila Trips" />
        <meta property="og:description" content="Kauai is not just a destination — it's a responsibility. Curated trails, sacred valleys, and a guide built around reciprocity with Hawaiian land and culture." />
        <meta property="og:url" content="https://lilatrips.com/destinations/kauai" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://lilatrips.com/og-image.jpg" />
        <meta property="og:image:alt" content="Kauai — Lila Trips" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Kauai Guide — Na Pali, Sacred Land & Intentional Travel | Lila Trips" />
        <meta name="twitter:description" content="Kauai is not just a destination — it's a responsibility. Curated trails, sacred valleys, and a guide built around reciprocity with Hawaiian land and culture." />
        <meta name="twitter:image" content="https://lilatrips.com/og-image.jpg" />
      </Helmet>
      <Nav breathConfig={breathConfig} breathValueRef={breathValueRef} />

      {/* == CELESTIAL DRAWER + BREATH CANVAS == */}
      <div ref={breathWrapperRef} style={{ background: breathConfig ? G.warmWhite : undefined }}>
        <CelestialDrawer destination="kauai" isMobile={isMobile} breathValueRef={breathValueRef} />

        <div style={{ background: breathConfig ? 'transparent' : G.warmWhite, color: G.ink, fontFamily: FONTS.body }}>

          {/* == MASTHEAD == */}
          <div style={{ padding: isMobile ? '68px 20px 32px' : '76px 52px 40px', maxWidth: 1080, margin: '0 auto' }}>
            <div style={{ fontFamily: FONTS.body, fontSize: 10, fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: G.goldenAmber, marginBottom: 20 }}>
              Destination Guide
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 300px', gap: isMobile ? '28px' : '52px', alignItems: 'start' }}>
              <div>
                <h1 style={{ fontFamily: FONTS.body, fontSize: 'clamp(48px, 8vw, 84px)', fontWeight: 700, lineHeight: 0.95, letterSpacing: '-0.02em', color: G.darkInk, margin: '0 0 32px' }}>
                  Kaua&#699;i &amp;<br />The Garden Isle
                </h1>
                <p style={{ fontFamily: FONTS.body, fontSize: 16, fontWeight: 400, lineHeight: 1.85, color: G.inkBody, margin: '0 0 16px', maxWidth: 480 }}>
                  Kaua&#699;i is the oldest of the main Hawaiian Islands — five million years old, worn into shapes
                  the other islands haven't had time to become yet. The Na Pali Coast is an argument
                  for the word sublime. The Waimea Canyon earned the name "Grand Canyon of the Pacific" without apology.
                </p>
                <p style={{ fontFamily: FONTS.body, fontSize: 16, fontWeight: 400, lineHeight: 1.85, color: G.inkBody, margin: 0, maxWidth: 480 }}>
                  The island is small enough that you can understand its geography from a single lookout but rich
                  enough that a week barely touches the surface. We built this guide to help you find it.
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
                  { label: 'Hikes, Surf, etc.',   active: false },
                  { label: 'Yoga & Healing',      active: false },
                  { label: 'Culture & Heritage',  active: false },
                  { label: 'Stars & Sky',         active: false },
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

          {/* -- Photo strip -- */}
          <PhotoStrip
            isMobile={isMobile}
            images={[
              { src: P.kauaiNapaliCoast,  alt: 'Na Pali Coast trail',          caption: 'Na Pali Coast \u00b7 the trail begins',       width: '32%' },
              { src: P.kauaiGardens,      alt: 'Kauai gardens at golden hour', caption: 'Garden light \u00b7 golden hour',              width: '22%' },
              { src: P.kauaiKalalauValley, alt: 'Kalalau Valley overlook',     caption: 'Kalalau Valley \u00b7 from the rim',           width: '24%' },
              { src: P.kauaiWaimeaCanyon, alt: 'Waimea Canyon waterfall',      caption: 'Waimea Canyon \u00b7 Grand Canyon of the Pacific', width: '22%' },
            ]}
          />

          {/* == GUIDE NAV == */}
          <GuideNav activeSection={activeSection} onNav={scrollTo} isMobile={isMobile} />

          {/* == CONTENT == */}
          <div style={{ background: G.warmWhite }}>
          <div style={{ padding: isMobile ? '0 20px' : '0 52px', maxWidth: 860, margin: '0 auto' }}>
            <div style={{ maxWidth: 660 }}>


              {/* == 01 TERRAIN & PARKS == */}
              <div id="the-place">
                <SectionTransition num="01" title="Terrain & Parks" />
                <div style={{ marginTop: 28 }}>
                  <Prose>
                    Kaua&#699;i is the oldest of the main Hawaiian Islands — five million years old, worn into
                    shapes the other islands haven't had time to become yet. The Na Pali Coast in the northwest
                    is an argument for the word sublime: fluted sea cliffs rising 4,000 feet directly from the
                    Pacific, draped in waterfalls, inaccessible by road. The Waimea Canyon cuts 14 miles through
                    the island's interior — red rock, green forest, silver river.
                  </Prose>
                  <Prose>
                    The island is wetter than the other islands — Mount Wai&#699;ale&#699;ale, near the center,
                    receives an average of 450 inches of rain a year, making it one of the wettest places on Earth.
                    That rain feeds waterfalls visible from the road, keeps the vegetation impossibly green, and
                    defines the character of the land.
                  </Prose>
                  <Prose>
                    The Hawaiian people have called Kaua&#699;i home for over 1,500 years. Place names carry
                    history: Hanalei means "crescent bay"; Waimea means "reddish water"; Poipu is a place of
                    crashing waves. The island avoided many of the worst impacts of tourism development through
                    a building-height ordinance — no structure taller than a palm tree — and through active Native
                    Hawaiian advocacy. That restraint shapes what Kaua&#699;i still is.
                  </Prose>
                </div>

                <SubLabel>The Parks</SubLabel>
                <Prose>Three state parks define the terrain. Na Pali is raw and remote. Waimea Canyon is the geological showpiece. Koke'e is the quiet interior — cool forest and lookouts at 4,000 feet.</Prose>
                <EditorialList items={PARKS_EDITORIAL} />

                <SubLabel>The Island</SubLabel>
                <Prose>Four distinct sides, four distinct characters. The North Shore is dramatic and wet. The South Shore is dry and sunny. The West Side is canyon country. The East Side is the practical hub.</Prose>
                <EditorialList items={ISLAND_AREAS.map(a => ({ context: a.context, name: a.name, detail: a.description }))} />

                <SubLabel>When to Go</SubLabel>
                <Prose>Kaua&#699;i rewards every season differently. These are the moments when the island is most alive.</Prose>
                <EditorialList items={TIMING_WINDOWS} />

                <SubLabel>Island Wildlife</SubLabel>
                <Prose>The island's isolation created species found nowhere else on earth. Many are endangered. Knowing what you're looking at — and how to behave around it — is part of being here.</Prose>
                <ContentList items={wildlifeItems} onOpenSheet={openSheet('Wildlife')} />

                <PlaceGuideCard label="Full Terrain & Parks Guide" descriptor="Parks \u00b7 island areas \u00b7 when to go \u00b7 wildlife" bg="linear-gradient(155deg, #3a7d7b 0%, #c9963a 100%)" to="/destinations/kauai/terrain-and-parks" />
              </div>

              <Divider />


              {/* == 02 TRAVEL LIGHTLY == */}
              <div id="responsibly">
                <SectionTransition num="02" title="Travel Lightly" />
                <div style={{ marginTop: 28 }}>
                  <Prose>
                    Hawai&#699;i receives more visitors per resident than almost anywhere on earth. Kaua&#699;i
                    is the least developed of the major islands and absorbs this pressure on a smaller
                    infrastructure. The tension between residents and visitors is real and documented. Traveling
                    with awareness of that dynamic — not just the landscape — is part of what it means to
                    visit respectfully.
                  </Prose>
                </div>

                <SubLabel warm>Sacred Sites</SubLabel>
                <Prose>Heiau — ancient Hawaiian temples, fishing shrines, and ceremonial platforms — have been desecrated in their use as tourist attractions, and hundreds have been destroyed for resort development. Several heiau on Kaua&#699;i are known to locals and deliberately kept off visitor maps. If you encounter a site that looks ceremonial or marked, leave it undisturbed and do not photograph it.</Prose>

                <SubLabel warm>Na Pali Coast &middot; Trail Safety</SubLabel>
                <Prose>The Kalalau Trail is one of the most spectacular and most dangerous trails in the United States. Flash flooding, steep unprotected sections, and difficult river crossings have killed experienced hikers. Permits are required and limited. Day hiking to Hanakapi'ai Beach (2 miles) requires no permit — the full 11-mile Kalalau Trail requires a camping permit.</Prose>

                <SubLabel warm>Ha&#699;ena State Park &middot; Community-Managed Access</SubLabel>
                <Prose>Ha&#699;ena State Park was the first in Hawai&#699;i to set a daily visitor cap, managed by nonprofits led by Native Hawaiian lineal descendants. Nonresidents must reserve and pay for entry. This is what responsible access looks like in practice — a community-led system built because the alternative was losing the place entirely.</Prose>

                <SubLabel warm>Give Back</SubLabel>
                <Prose>Malama Kauai runs local food, land stewardship, and cultural programs rooted in Native Hawaiian relationships to the land. The Malama Hawai&#699;i program connects visitors to volunteer opportunities — several hotels offer a complimentary night in exchange for a volunteer day. The Hawai&#699;i Conservation Alliance and Natural Area Reserves System accept direct donations that fund watershed protection and native species restoration.</Prose>

                <PlaceGuideCard label="Full Travel Lightly Guide" descriptor="Sacred sites \u00b7 trail safety \u00b7 community access \u00b7 give back" bg="linear-gradient(155deg, #A8896A 0%, #4A6B5A 100%)" to="/destinations/kauai/travel-lightly" />
              </div>

              <Divider />


              {/* == 03 WHERE TO STAY == */}
              <div id="stay">
                <SectionTransition num="03" title="Where to Stay" />
                <div style={{ marginTop: 28 }}>
                  <Prose>Poipu is the move for sun and snorkeling. Hanalei and Princeville own the North Shore. Kapa&#699;a is the practical hub with the best local food access. Where you sleep shapes which Kaua&#699;i you meet.</Prose>
                </div>

                <SubLabel>Towns</SubLabel>
                <EditorialList items={TOWNS_EDITORIAL} />

                <SubLabel>Hotels</SubLabel>
                <p style={{ fontFamily: FONTS.body, fontSize: 13, fontWeight: 400, color: G.ink40, marginBottom: 0 }}>A few we like across the island:</p>
                <ContentList onOpenSheet={openSheet('Stay')} items={sleepPicks.map(a => ({
                  ...a,
                  type: 'stay',
                  badge: a.stayStyle.charAt(0).toUpperCase() + a.stayStyle.slice(1),
                  context: a.location,
                  detail: a.highlights?.[0] || '',
                  tier: a.stayStyle,
                  url: a.links?.website || a.links?.booking,
                  links: a.links,
                }))} />

                <PlaceGuideCard label="Full Where to Stay Guide" descriptor="Full accommodations across Poipu, Hanalei, Princeville & Kapaa" bg="linear-gradient(155deg, #C4A882 0%, #8A7A6A 100%)" to="/destinations/kauai/where-to-stay" />
              </div>

              <Divider />


              {/* == 04 WHERE TO EAT == */}
              <div id="eat">
                <SectionTransition num="04" title="Where to Eat" />
                <div style={{ marginTop: 28 }}>
                  <Prose>Kaua&#699;i's food scene is rooted in the land and the ocean. Poke is religion. Plate lunch is infrastructure. The farm-to-table movement here draws from soil that grows year-round. The best meals are often the least formal — roadside stands, fish markets, and the places locals eat when no one's watching.</Prose>
                </div>

                <ContentList onOpenSheet={openSheet('Eat')} items={eatPicks.map(e => {
                  const raw = e.cuisine || e.type || '';
                  return {
                    ...e,
                    type: 'list',
                    badge: raw.charAt(0).toUpperCase() + raw.slice(1),
                    context: `${e.location}${e.reservations ? ' \u00b7 ' + e.reservations : ''}`,
                    detail: e.highlights?.[0] || '',
                    featured: e.lilaPick,
                    url: e.links?.website,
                    links: e.links,
                  };
                })} />

                <PlaceGuideCard label="Full Where to Eat Guide" descriptor="Poke \u00b7 plate lunch \u00b7 farm-to-table \u00b7 fish markets" bg="linear-gradient(155deg, #C49A6A 0%, #8A6A4A 100%)" to="/destinations/kauai/where-to-eat" />
              </div>


              {/* == 05 HIKES, SURF, ETC. == */}
              <div id="move">
                <SectionTransition num="05" title="Hikes, Surf, etc." />
                <div style={{ marginTop: 28 }}>
                  <Prose>The Kalalau Trail is the signature — eleven miles along the Na Pali Coast to a beach at the edge of the world. But the island has more: Waimea Canyon rim trails, kayaking the Wailua River, surfing Hanalei Bay, and snorkeling reefs that make the mainland look pale.</Prose>
                </div>

                <SubLabel>Highlights</SubLabel>
                <ContentList onOpenSheet={openSheet('Move')} items={moveHighlights.map(m => ({
                  ...m,
                  type: 'list',
                  badge: m.moveTier.charAt(0).toUpperCase() + m.moveTier.slice(1),
                  context: `${m.distance || ''} \u00b7 ${m.difficulty || ''}`.replace(/^\s*\u00b7\s*/, '').replace(/\s*\u00b7\s*$/, ''),
                  detail: m.highlights?.[0] || '',
                  featured: m.lilaPick,
                  url: m.links?.website,
                  links: m.links,
                }))} />

                <PlaceGuideCard label="Full Hikes, Surf, etc. Guide" descriptor="Full trail & activity guide across the island" bg="linear-gradient(155deg, #8AAA7A 0%, #4A6A5A 100%)" to="/destinations/kauai/hikes-surf" />
              </div>

              <Divider />


              {/* == 06 YOGA & HEALING == */}
              <div id="breathe">
                <SectionTransition num="06" title="Yoga & Healing" />
                <div style={{ marginTop: 28 }}>
                  <Prose>The island has a long tradition of healing — Hawaiian la&#699;au lapa&#699;au (plant medicine), lomilomi bodywork, and a yoga community that draws serious practitioners from around the world. The landscape itself does half the work: trade winds, ocean sound, and the particular quality of light that only Kaua&#699;i has.</Prose>
                </div>

                <SubLabel>Highlights</SubLabel>
                <ContentList onOpenSheet={openSheet('Breathe')} items={breatheHighlights.map(b => ({
                  ...b,
                  type: 'list',
                  badge: b.breatheTier.charAt(0).toUpperCase() + b.breatheTier.slice(1),
                  context: `${b.type || ''} \u00b7 ${b.location || ''}`.replace(/^\s*\u00b7\s*/, '').replace(/\s*\u00b7\s*$/, ''),
                  detail: b.highlights?.[0] || '',
                  featured: b.lilaPick,
                  url: b.links?.website,
                  links: b.links,
                }))} />

                <PlaceGuideCard label="Full Yoga & Healing Guide" descriptor="Yoga \u00b7 lomilomi \u00b7 Hawaiian healing \u00b7 restore" bg="linear-gradient(155deg, #8AADA8 0%, #4A6B7A 100%)" to="/destinations/kauai/yoga-healing" />
              </div>

              <Divider />


              {/* == 07 CULTURE & HERITAGE == */}
              <div id="experience">
                <SectionTransition num="07" title="Culture & Heritage" />
                <div style={{ marginTop: 28 }}>
                  <Prose>Kaua&#699;i's cultural life runs deeper than most visitors see. The island's isolation preserved Hawaiian traditions that were disrupted elsewhere. Botanical gardens with plants the Polynesian navigators brought across the Pacific. Taro farms that have been cultivated for centuries. A film history that spans from South Pacific to Jurassic Park. The culture here is alive and ongoing.</Prose>
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
                  links: e.links,
                }))} />

                <PlaceGuideCard label="Full Culture & Heritage Guide" descriptor="Hawaiian culture \u00b7 botanical gardens \u00b7 heritage" bg="linear-gradient(155deg, #B8956A 0%, #6A7A5A 100%)" to="/destinations/kauai/culture-heritage" />
              </div>

              <Divider />


              {/* == 08 STARS & SKY == */}
              <div id="night-sky">
                <SectionTransition num="08" title="Stars & Sky" />
                <div style={{ marginTop: 28 }}>
                  <Prose>Kaua&#699;i has no certified Dark Sky designation, but it doesn't need one. The building-height ordinance, low population density, and remote western beaches produce some of the darkest skies in Hawai&#699;i. Polihale State Park is Bortle Class 3 — open horizon, no development for miles. The Milky Way core is visible April through October from the south and west shores.</Prose>
                  <Prose>Whale season adds another dimension to the night sky. December through April, humpback spouts are visible by moonlight from the south shore overlooks. Combine a new moon night with peak whale season for the full experience.</Prose>
                </div>

                <EditorialList items={[
                  { context: 'Bortle 3', name: 'Polihale State Park (West Shore)', detail: 'The most remote and darkest beach accessible by road on Kauai. Open horizon, no development for miles. Best for serious dark sky photography.' },
                  { context: 'South Shore', name: 'Poipu Beach / Shipwreck Beach', detail: 'Open horizon to the south and west, minimal coastal light. Best for Milky Way core viewing.' },
                  { context: 'North Shore', name: 'Kilauea Lighthouse Headland', detail: 'Faces open ocean north. Best for star trails and Milky Way arcing overhead.' },
                  { context: 'Apr \u2013 Oct', name: 'Milky Way Core Season', detail: 'Best from the south and west shores where light pollution is lowest. New moon windows offer the darkest conditions.' },
                  { context: 'Mid-August', name: 'Perseid Meteor Shower', detail: 'Peak viewing from Polihale or Poipu. Warm nights, open horizons.' },
                ]} />

                <PlaceGuideCard label="Full Stars & Sky Guide" descriptor="Dark beaches \u00b7 best windows \u00b7 whale season nights" bg="linear-gradient(155deg, #5A6B8A 0%, #1E2A3E 100%)" to="/destinations/kauai/stars-and-sky" />
              </div>

              <Divider />

            </div>
          </div>
          </div>


          {/* == CTA == */}
          <div style={{ background: G.warmWhite }}>
          <div style={{ padding: isMobile ? '40px 20px 60px' : '52px 52px 80px', maxWidth: 860, margin: '0 auto' }}>
            <div style={{ background: G.darkInk, padding: '52px 48px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 48, flexWrap: 'wrap' }}>
              <div style={{ maxWidth: 380 }}>
                <div style={{ fontFamily: FONTS.body, fontSize: 9, fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: 16 }}>Begin</div>
                <h3 style={{ fontFamily: FONTS.body, fontSize: 'clamp(24px, 4vw, 32px)', fontWeight: 700, color: 'white', lineHeight: 1.1, margin: '0 0 12px', letterSpacing: '-0.01em' }}>
                  Your island trip<br />starts here
                </h3>
                <p style={{ fontFamily: FONTS.body, fontSize: 13, fontWeight: 400, lineHeight: 1.65, color: 'rgba(255,255,255,0.5)', margin: '0 0 28px' }}>
                  Turn this guide into a day-by-day itinerary built around how you actually travel.
                </p>
                <button
                  onClick={() => { trackEvent('guide_cta_clicked', { guide: 'kauai' }); navigate('/plan'); }}
                  onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
                  onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                  style={{ fontFamily: FONTS.body, fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#E8E0D5', border: 'none', background: G.darkInk, padding: '14px 32px', cursor: 'pointer', transition: 'opacity 0.2s' }}
                >
                  Plan a Trip &rarr;
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
      <WhisperBar destination="kauai" label="Kaua&#699;i" />
      <Footer />
    </>
  );
}
