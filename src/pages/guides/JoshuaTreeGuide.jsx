// ═══════════════════════════════════════════════════════════════════════════════
// PAGE: JOSHUA TREE GUIDE — Editorial Main Page (Redesign v2)
// ═══════════════════════════════════════════════════════════════════════════════
//
// Top-level editorial guide for Joshua Tree & its orbit. Eight sections:
//   01. Terrain & Parks    05. Hikes, Bikes, etc.
//   02. Travel Lightly     06. Yoga & Mindfulness
//   03. Where to Stay      07. Arts & Culture
//   04. Where to Eat       08. Stars & Sky
//
// Route: /destinations/joshua-tree
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
import { PARKS, TOWNS, HIGHLIGHTS, WILDLIFE, TIMING_WINDOWS } from '@data/guides/joshua-tree-constants';
import accommodations from '../../data/accommodations/joshua-tree.json';
import restaurants from '../../data/restaurants/joshua-tree-eat.json';
import moveItems from '../../data/restaurants/joshua-tree-move.json';
import breatheItems from '../../data/restaurants/joshua-tree-breathe.json';
import experiences from '../../data/restaurants/joshua-tree-experience.json';


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
  lat: 33.87,
  lng: -115.9,
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

export default function JoshuaTreeGuide() {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth <= 768);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const breathConfig = BREATH_CONFIG.joshuaTree;
  const breathWrapperRef = useRef(null);
  const breathValueRef = useBreathCanvas(breathConfig, breathWrapperRef);

  // ── NPS Data ──
  const [npsLookup, setNpsLookup] = useState(null);
  const [activeSheet, setActiveSheet] = useState(null);

  useEffect(() => {
    getNPSData(['jotr'])
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
        <title>Joshua Tree Guide — Desert Stillness, Dark Sky & Low-Impact Travel | Lila Trips</title>
        <meta name="description" content="One of California's darkest skies, and one of its most fragile landscapes. A guide for travelers who come to listen, not just look." />
        <link rel="canonical" href="https://lilatrips.com/destinations/joshua-tree" />
        <meta property="og:title" content="Joshua Tree Guide — Desert Stillness, Dark Sky & Low-Impact Travel | Lila Trips" />
        <meta property="og:description" content="One of California's darkest skies, and one of its most fragile landscapes. A guide for travelers who come to listen, not just look." />
        <meta property="og:url" content="https://lilatrips.com/destinations/joshua-tree" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://lilatrips.com/og-image.png" />
        <meta property="og:image:alt" content="Joshua Tree — Lila Trips" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Joshua Tree Guide — Desert Stillness, Dark Sky & Low-Impact Travel | Lila Trips" />
        <meta name="twitter:description" content="One of California's darkest skies, and one of its most fragile landscapes. A guide for travelers who come to listen, not just look." />
        <meta name="twitter:image" content="https://lilatrips.com/og-image.png" />
      </Helmet>
      <Nav breathConfig={breathConfig} breathValueRef={breathValueRef} />

      {/* ══ CELESTIAL DRAWER + BREATH CANVAS ═══════════════════════════════════ */}
      <div ref={breathWrapperRef} style={{ background: breathConfig ? G.warmWhite : undefined }}>
        <CelestialDrawer destination="joshua-tree" isMobile={isMobile} breathValueRef={breathValueRef} />

        <div style={{ background: breathConfig ? 'transparent' : G.warmWhite, color: G.ink, fontFamily: FONTS.body }}>

          {/* ══ MASTHEAD ═══════════════════════════════════════════════════════ */}
          <div style={{ padding: isMobile ? '68px 20px 32px' : '76px 52px 40px', maxWidth: 1080, margin: '0 auto' }}>
            <div style={{ fontFamily: FONTS.body, fontSize: 10, fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: G.goldenAmber, marginBottom: 20 }}>
              Destination Guide
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 300px', gap: isMobile ? '28px' : '52px', alignItems: 'start' }}>
              <div>
                <h1 style={{ fontFamily: FONTS.body, fontSize: 'clamp(48px, 8vw, 84px)', fontWeight: 700, lineHeight: 0.95, letterSpacing: '-0.02em', color: G.darkInk, margin: '0 0 32px' }}>
                  Joshua<br />Tree
                </h1>
                <p style={{ fontFamily: FONTS.body, fontSize: 16, fontWeight: 400, lineHeight: 1.85, color: G.inkBody, margin: '0 0 16px', maxWidth: 480 }}>
                  Joshua Tree sits at the convergence of two deserts — the Mojave and the Colorado — and that collision is part of what makes it singular. The high desert is cool and boulder-studded. The silence here has weight.
                </p>
                <p style={{ fontFamily: FONTS.body, fontSize: 16, fontWeight: 400, lineHeight: 1.85, color: G.inkBody, margin: 0, maxWidth: 480 }}>
                  This is a place for people who want to feel small in the best possible way. One park, four orbit towns, and one of the darkest skies in Southern California.
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
              { src: P.joshuaTreeDawn,     alt: 'First light in the high desert',       caption: 'Joshua Tree · dawn',          width: '32%' },
              { src: P.joshuaTreeCholla,    alt: 'Cholla Cactus Garden at golden hour',  caption: 'Cholla Cactus Garden',        width: '22%' },
              { src: P.joshuaTreeBoulders,  alt: 'Jumbo Rocks boulder formations',       caption: 'Jumbo Rocks · ancient granite', width: '24%' },
              { src: P.joshuaTreeNightSky,  alt: 'Night sky over Joshua Tree',           caption: 'Bortle Class 2 darkness',     width: '22%' },
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
                    Joshua Tree sits at the convergence of two deserts — the Mojave and the Colorado — and that collision is part of what makes it singular. The high desert is cool and boulder-studded, carpeted in the alien silhouettes of Yucca brevifolia. Drop below the transition zone into the Colorado Desert and the landscape shifts: more open, more stark, warmer. The park covers 800,000 acres. Most visitors see a fraction of it.
                  </Prose>
                  <Prose>
                    The surrounding communities each add a distinct layer. The town of Joshua Tree is small, arty, and increasingly a destination in itself. Twentynine Palms is the working town with the quietest skies. Pioneertown was built as a movie set in 1946 and never entirely stopped performing. Palm Springs is 45 minutes south: mid-century architecture, serious spas, a counterpoint when you want polished comfort after days in the dust.
                  </Prose>
                </div>

                <SubLabel>The Park</SubLabel>
                <EditorialList items={PARKS_EDITORIAL.map(p => ({ context: p.context, name: p.name, detail: p.description, url: p.url }))} />

                <SubLabel>The Towns</SubLabel>
                <EditorialList items={TOWNS_EDITORIAL.map(t => ({ context: t.context, name: t.name, detail: t.description, url: t.url }))} />

                <SubLabel>When to Go</SubLabel>
                <Prose>The desert transforms with the seasons. These are the moments when the land is most alive.</Prose>
                <EditorialList items={TIMING_WINDOWS.map(tw => ({ context: tw.context, name: tw.name, detail: tw.detail }))} />

                <SubLabel>Desert Wildlife</SubLabel>
                <Prose>The park supports a surprising diversity of life. Most of it is nocturnal, subtle, and easy to miss unless you slow down.</Prose>
                <ContentList items={wildlifeItems} onOpenSheet={openSheet('Wildlife')} />

                <PlaceGuideCard label="Full Terrain & Parks Guide" descriptor="Terrain · When to go · Desert wildlife" bg="linear-gradient(155deg, #C4956A 0%, #7A9190 100%)" to="/destinations/joshua-tree/terrain-and-parks" />
              </div>

              <Divider />


              {/* ══ 02 TRAVEL LIGHTLY ═════════════════════════════════════════ */}
              <div id="responsibly">
                <SectionTransition num="02" title="Travel Lightly" />
                <div style={{ marginTop: 28 }}>
                  <Prose>
                    The desert moves slowly. So should you. Joshua Tree is one of the most fragile landscapes in the National Park System — and one of the most visited. How you move through this place matters.
                  </Prose>
                </div>

                <SubLabel warm>Joshua Trees · Age & Fragility</SubLabel>
                <Prose>The trees you're walking past are older than anyone you know. Joshua trees grow roughly an inch a year — the ones lining the trail may be a century old or more. Off-trail movement compacts soil that took millennia to develop and damages root systems that aren't visible from the surface. Stay on trail without exception. The desert floor looks empty. It isn't.</Prose>

                <SubLabel warm>Dark Sky · IDA Certification</SubLabel>
                <Prose>Joshua Tree sits sandwiched between the Inland Empire's 4 million residents to the west and the last pool of natural darkness in Southern California to the east. The park earned International Dark Sky Park designation in 2017. That status depends on visitors using red-filtered lights at night, staying in designated stargazing areas, and not pulling off-road into undisturbed terrain. The darker you let it stay, the more sky you get.</Prose>

                <SubLabel warm>Peregrine Falcons · Seasonal Closures</SubLabel>
                <Prose>In spring, certain trails and rock-climbing routes close to protect nesting peregrine falcons. These closures are temporary and specific. Respecting them is the difference between a falcon pair successfully nesting and abandoning the site entirely. Check the NPS alerts page before you arrive — route closures shift year to year.</Prose>

                <SubLabel warm>Camping · Fire & Waste</SubLabel>
                <Prose>During the 2019 government shutdown, visitors camped illegally in sensitive areas and drove off-road vehicles over fragile landscapes, creating new roads in previously undisturbed terrain. The damage took months to recover from. Camp only in designated sites. Pack out all waste. Never build fires outside established rings — desert scrub ignites fast and the park has limited suppression capacity.</Prose>

                <SubLabel warm>Give Back</SubLabel>
                <Prose>The Mojave Desert Land Trust protects the California desert through land acquisition, habitat restoration, and a native plant seed bank — including growing thousands of Joshua trees for replanting. The Native American Land Conservancy brings Indigenous cultural knowledge to desert stewardship. The park's own volunteer program offers trail maintenance and restoration work for visitors who want to give time.</Prose>

                <PlaceGuideCard label="Full Travel Lightly Guide" descriptor="Tread lightly · give back · indigenous stewardship" bg="linear-gradient(155deg, #A8896A 0%, #4A6B5A 100%)" to="/destinations/joshua-tree/travel-lightly" />
              </div>

              <Divider />


              {/* ══ 03 WHERE TO STAY ══════════════════════════════════════════ */}
              <div id="stay">
                <SectionTransition num="03" title="Where to Stay" />
                <div style={{ marginTop: 28 }}>
                  <Prose>The town of Joshua Tree is the most convenient base — five minutes to the north entrance. Twentynine Palms is quieter, with access to the park's eastern half. Pioneertown and Palm Springs add range if you want to split nights.</Prose>
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

                <PlaceGuideCard label="Full Where to Stay Guide" descriptor="Full accommodations across Joshua Tree, Twentynine Palms, Pioneertown & Palm Springs" bg="linear-gradient(155deg, #C4A882 0%, #8A7A6A 100%)" to="/destinations/joshua-tree/where-to-stay" />
              </div>

              <Divider />


              {/* ══ 04 WHERE TO EAT ═══════════════════════════════════════════ */}
              <div id="eat">
                <SectionTransition num="04" title="Where to Eat" />
                <div style={{ marginTop: 28 }}>
                  <Prose>The desert dining scene is better than anyone expects. Pappy & Harriet's in Pioneertown is the anchor — live music, mesquite-grilled everything. La Copine does the farm-to-table thing with real conviction. Natural Sisters Cafe is the Joshua Tree morning move. And Palm Springs has a food scene deep enough to fill a separate guide.</Prose>
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

                <PlaceGuideCard label="Full Where to Eat Guide" descriptor="Joshua Tree · Pioneertown · Palm Springs" bg="linear-gradient(155deg, #C49A6A 0%, #8A6A4A 100%)" to="/destinations/joshua-tree/where-to-eat" />
              </div>


              {/* ══ 05 HIKES, BIKES, ETC. ═════════════════════════════════════ */}
              <div id="move">
                <SectionTransition num="05" title="Hikes, Bikes, etc." />
                <div style={{ marginTop: 28 }}>
                  <Prose>The park has over 8,000 climbing routes and dozens of trails across two distinct desert ecosystems. Ryan Mountain gives you the full panorama. The Skull Rock Loop is easy and uncrowded at dawn. Keys View is the sunset move. And the boulder fields — Jumbo Rocks, Hidden Valley, Split Rock — are some of the best rock climbing in the American West.</Prose>
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

                <PlaceGuideCard label="Full Hikes, Bikes, etc. Guide" descriptor="Full trail & activity guide across the park" bg="linear-gradient(155deg, #8AAA7A 0%, #4A6A5A 100%)" to="/destinations/joshua-tree/hikes-bikes" />
              </div>

              <Divider />


              {/* ══ 06 YOGA & MINDFULNESS ═════════════════════════════════════ */}
              <div id="breathe">
                <SectionTransition num="06" title="Yoga & Mindfulness" />
                <div style={{ marginTop: 28 }}>
                  <Prose>The desert does half the work. The silence, the scale, the way the light shifts every twenty minutes — it recalibrates the nervous system whether you intend it to or not. Sound baths in Joshua Tree have become a thing for a reason. The landscape is the instrument.</Prose>
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

                <PlaceGuideCard label="Full Yoga & Mindfulness Guide" descriptor="Yoga · sound baths · desert silence · restore" bg="linear-gradient(155deg, #8AADA8 0%, #4A6B7A 100%)" to="/destinations/joshua-tree/yoga-mindfulness" />
              </div>

              <Divider />


              {/* ══ 07 ARTS & CULTURE ═════════════════════════════════════════ */}
              <div id="experience">
                <SectionTransition num="07" title="Arts & Culture" />
                <div style={{ marginTop: 28 }}>
                  <Prose>The desert has drawn artists, musicians, and seekers for decades. Noah Purifoy's outdoor sculpture museum is one of the most striking art installations in the American West. The Integratron promises acoustic healing inside a dome built on an alleged geomagnetic vortex. Pioneertown is a living film set. The creative energy here is real and specific.</Prose>
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

                <PlaceGuideCard label="Full Art & Culture Guide" descriptor="Arts · culture · music · community" bg="linear-gradient(155deg, #B8956A 0%, #6A7A5A 100%)" to="/destinations/joshua-tree/arts-and-culture" />
              </div>

              <Divider />


              {/* ══ 08 STARS & SKY ════════════════════════════════════════════ */}
              <div id="night-sky">
                <SectionTransition num="08" title="Stars & Sky" />
                <div style={{ marginTop: 28 }}>
                  <Prose>At night, the sky opens. Joshua Tree is a certified International Dark Sky Park — IDA designated in 2017, Bortle Class 2–3. On a moonless night, the Milky Way arcs directly overhead, brighter and more detailed than most Americans have ever seen. Bring a blanket, lie down, give yourself an hour.</Prose>
                  <Prose>The eastern half of the park — Pinto Basin Road, Cholla Cactus Garden, Jumbo Rocks — offers the darkest skies. The volunteer-run Sky's the Limit Observatory in Twentynine Palms hosts free public star parties on Saturday nights.</Prose>
                </div>

                <EditorialList items={[
                  { context: 'Bortle Class 2–3', name: 'Joshua Tree National Park', detail: 'Certified International Dark Sky Park. Best viewing from Pinto Basin Road pullouts and Cholla Cactus Garden parking area.' },
                  { context: 'Best Spot', name: 'Cap Rock Area', detail: 'Iconic rock formations silhouetted against the Milky Way. The classic astrophotography spot in the park.' },
                  { context: 'Community', name: 'Sky\'s the Limit Observatory', detail: 'Volunteer-run observatory in Twentynine Palms offering free public star parties on Saturday nights. Bring binoculars — the volunteers bring the telescopes.' },
                  { context: 'Best Window', name: 'Nov – Feb · New Moon', detail: 'Winter\'s long nights and dry, stable air create the park\'s best stargazing conditions. Geminid meteor shower peaks Dec 13–14 with 120+ meteors per hour.' },
                ]} />

                <PlaceGuideCard label="Full Stars & Sky Guide" descriptor="Dark sky ratings · best windows · viewing areas" bg="linear-gradient(155deg, #5A6B8A 0%, #1E2A3E 100%)" to="/destinations/joshua-tree/stars-and-sky" />
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
                  Your desert trip<br />starts here
                </h3>
                <p style={{ fontFamily: FONTS.body, fontSize: 13, fontWeight: 400, lineHeight: 1.65, color: 'rgba(255,255,255,0.5)', margin: '0 0 28px' }}>
                  Turn this guide into a day-by-day itinerary built around how you actually travel.
                </p>
                <button
                  onClick={() => { trackEvent('guide_cta_clicked', { guide: 'joshua-tree' }); navigate('/plan'); }}
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
      <WhisperBar destination="joshuaTree" label="Joshua Tree" />
      <Footer />
    </>
  );
}
