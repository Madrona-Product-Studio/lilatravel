// ═══════════════════════════════════════════════════════════════════════════════
// PAGE: ZION GUIDE — Editorial Main Page
// ═══════════════════════════════════════════════════════════════════════════════
//
// Top-level editorial guide for Zion & its orbit. Three sections:
//   1. The Place & How to Be In It
//   2. Find Your Base
//   3. Experience It
//
// Sub-guides (Move, Eat, Sleep, etc.) live in dedicated route pages.
// Route: /destinations/zion-canyon
//

import { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Nav, Footer, FadeIn, WhisperBar } from '@components';
import { SectionLabel, Divider, ListItem, StayItem, GuideDetailSheet, sortByTierDiversity } from '@components/guide';
import { C } from '@data/brand';
import { P } from '@data/photos';
import { trackEvent } from '@utils/analytics';
import { Helmet } from 'react-helmet-async';
import { CelestialDrawer } from '@components';
import { BREATH_CONFIG } from '@data/breathConfig';
import useBreathCanvas from '@hooks/useBreathCanvas';
import accommodations from '../../data/accommodations/zion.json';
import restaurants from '../../data/restaurants/zion-eat.json';
import moveItems from '../../data/restaurants/zion-move.json';


// ─── Constants ───────────────────────────────────────────────────────────────

const ACCENT = C.sunSalmon;

const GUIDE_SECTIONS = [
  { id: "the-place", label: "The Place" },
  { id: "find-base", label: "Find Your Base" },
  { id: "experience", label: "Experience It" },
];

const HIGHLIGHTS = [
  {
    name: "The Narrows",
    category: "Canyon \u00B7 Water",
    blurb: "You\u2019re wading a river through slot canyon walls two thousand feet high.",
  },
  {
    name: "Angels Landing",
    category: "Summit \u00B7 Exposure \u00B7 Permit",
    blurb: "Chain-assisted scramble to a rock fin suspended above the canyon.",
  },
  {
    name: "Bryce Canyon at Sunrise",
    category: "High Plateau \u00B7 Hoodoos",
    blurb: "A forest of stone pillars at 8,000 feet.",
  },
  {
    name: "Scenic Byway 12",
    category: "Drive \u00B7 Journey",
    blurb: "One of the most dramatic drives in the American West.",
  },
];

const TIMING_WINDOWS = [
  { window: "Late Sept \u2013 Oct", name: "The Golden Corridor", detail: "Cottonwoods turn gold along the Virgin River. Crowds thin. Light goes amber. Best hiking weather of the year." },
  { window: "Mar \u2013 Apr", name: "Spring Equinox", detail: "After a wet winter, the desert floor erupts in wildflowers. Cacti crown themselves. The canyon wakes up." },
  { window: "Jun \u2013 Sep nights", name: "Dark Sky Season", detail: "Warm nights for stargazing. The Milky Way peaks overhead from June through September. Zion is a certified Dark Sky Park." },
  { window: "Dec 19\u201322", name: "Winter Solstice", detail: "Shortest day, most dramatic canyon light. Snow dusting the upper walls at sunset. Fewer people, deeper silence." },
];

const TOWNS = [
  {
    name: "Kanab",
    context: "Film-Set Desert Town",
    description: "An hour south of Zion on the Utah\u2013Arizona line. Old Western film sets, a growing food scene, and the staging point for permits to The Wave, White Pocket, and Buckskin Gulch.",
  },
  {
    name: "Escalante",
    context: "Trailhead Town",
    description: "A one-stoplight town on Scenic Byway 12 that punches above its weight. Slot canyons, petrified forests, and the kind of solitude that the main parks can\u2019t offer.",
  },
  {
    name: "Torrey",
    context: "Capitol Reef Gateway",
    description: "A handful of buildings at the edge of the Waterpocket Fold. The nearest services to Capitol Reef. The orchards start just down the road.",
  },
];

const SLEEP_PICK_NAMES = ["Cable Mountain Lodge", "Zion Lodge", "Cliffrose Springdale", "Under Canvas Zion"];
const MOVE_PICK_NAMES = ["The Narrows", "Angels Landing", "Canyon Overlook Trail", "Keyhole Canyon Canyoneering"];
const EAT_PICK_NAMES = ["Oscar's Cafe", "Deep Creek Coffee", "Bit & Spur", "Hell's Backbone Grill & Farm"];


// ─── SubGuideThread ──────────────────────────────────────────────────────────

function SubGuideThread({ to, label, description }) {
  return (
    <Link
      to={to}
      onClick={() => trackEvent('subguide_clicked', { guide: to.split('/').pop() })}
      className="group flex items-center gap-2.5 py-3 mt-4 no-underline transition-opacity duration-200 hover:opacity-70"
    >
      <span className="font-body text-[13px] font-semibold" style={{ color: C.oceanTeal }}>{"\u2192"}</span>
      <span className="font-body text-[13px] font-semibold" style={{ color: C.oceanTeal }}>{label}</span>
      {description && (
        <span className="font-body text-[12px] font-normal" style={{ color: '#7A857E' }}> {"\u2014"} {description}</span>
      )}
    </Link>
  );
}


// ─── GuideNav ────────────────────────────────────────────────────────────────

function GuideNav({ isMobile }) {
  const [activeId, setActiveId] = useState(null);
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    if (isMobile) return;
    const ids = GUIDE_SECTIONS.map(s => s.id);
    const elements = ids.map(id => document.getElementById(id)).filter(Boolean);
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter(e => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: "-130px 0px -60% 0px", threshold: 0 }
    );

    elements.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, [isMobile]);

  const handleClick = useCallback((id) => {
    const el = document.getElementById(id);
    if (!el) return;
    const mainNavHeight = isMobile ? 58 : 64;
    const guideNavHeight = isMobile ? 0 : 52;
    const y = el.getBoundingClientRect().top + window.scrollY - guideNavHeight - mainNavHeight - 32;
    window.scrollTo({ top: y, behavior: "smooth" });
  }, [isMobile]);

  if (isMobile) {
    return (
      <div className="mx-5 mb-6 border border-stone p-4 bg-cream">
        <div className="flex items-center justify-between mb-3.5">
          <span className="font-body text-[10px] font-bold tracking-[0.22em] uppercase text-[#7A857E]">In this guide</span>
          <span className="font-body text-[10px] font-medium text-[#b8b0a8] tracking-[0.06em]">{GUIDE_SECTIONS.length} sections</span>
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-0.5">
          {GUIDE_SECTIONS.map((section, i) => (
            <button
              key={section.id}
              onClick={() => handleClick(section.id)}
              className="flex items-center gap-2 py-[7px] bg-transparent border-none cursor-pointer text-left"
            >
              <span className="font-body text-[9px] font-bold tracking-[0.1em] text-[#b8b0a8] min-w-[16px]">{String(i + 1).padStart(2, "0")}</span>
              <span className="font-body text-[11px] font-semibold tracking-[0.08em] uppercase text-[#4A5650]">{section.label}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <nav
      className="sticky top-[72px] z-[90] border-t border-b border-stone"
      style={{ background: "rgba(250, 247, 243, 0.97)" }}
    >
      <div className="max-w-[1120px] mx-auto pt-1 px-10 flex items-center">
        <div className="flex-1 min-w-0 relative">
          <div
            ref={scrollContainerRef}
            className="guide-nav-scroll flex items-center overflow-x-auto"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
          <style>{`
            .guide-nav-scroll::-webkit-scrollbar { display: none; }
          `}</style>

          {GUIDE_SECTIONS.map((section) => {
            const isActive = activeId === section.id;
            return (
              <button
                key={section.id}
                onClick={() => handleClick(section.id)}
                className="guide-nav-scroll px-3.5 h-[44px] bg-transparent border-none cursor-pointer font-body text-[11px] tracking-[0.14em] uppercase whitespace-nowrap shrink-0 relative transition-[color,border-color] duration-[250ms]"
                style={{
                  borderBottom: `2px solid ${isActive ? C.oceanTeal : "transparent"}`,
                  fontWeight: isActive ? 700 : 600,
                  color: isActive ? C.oceanTeal : "#7A857E",
                }}
                onMouseEnter={e => {
                  if (!isActive) {
                    e.currentTarget.style.color = C.darkInk;
                    e.currentTarget.style.borderBottomColor = C.stone;
                  }
                }}
                onMouseLeave={e => {
                  if (!isActive) {
                    e.currentTarget.style.color = "#7A857E";
                    e.currentTarget.style.borderBottomColor = "transparent";
                  }
                }}
              >
                {section.label}
              </button>
            );
          })}
          </div>
        </div>
      </div>
    </nav>
  );
}


// ─── Main Page ───────────────────────────────────────────────────────────────

export default function ZionGuide() {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth <= 768);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const breathConfig = BREATH_CONFIG.zion;
  const breathWrapperRef = useRef(null);
  const breathValueRef = useBreathCanvas(breathConfig, breathWrapperRef);

  const [activeSheet, setActiveSheet] = useState(null);

  useEffect(() => {
    if (activeSheet) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [activeSheet]);

  const openSheet = useCallback((item) => {
    setActiveSheet(item);
  }, []);

  // Filter curated picks from data
  const sleepPicks = SLEEP_PICK_NAMES.map(name => accommodations.find(a => a.name === name)).filter(Boolean);
  const movePicks = MOVE_PICK_NAMES.map(name => moveItems.find(m => m.name === name)).filter(Boolean);
  const eatPicks = EAT_PICK_NAMES.map(name => restaurants.find(r => r.name === name)).filter(Boolean);

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
      <Nav breathConfig={breathConfig} />

      {/* ══ CELESTIAL DRAWER ═══════════════════════════════════════════════ */}
      <div ref={breathWrapperRef} style={{ background: breathConfig ? C.warmWhite : undefined }}>
          <CelestialDrawer destination="zion" isMobile={isMobile} breathValueRef={breathValueRef} />

          {/* ══ TITLE MASTHEAD ═══════════════════════════════════════════════════ */}
          <section style={{ background: breathConfig ? 'transparent' : C.cream }}>
        <div className="px-5 py-7 md:px-[52px] md:py-11 max-w-[920px] mx-auto">
          <FadeIn from="bottom" delay={0.1}>

            <div className="grid grid-cols-1 md:grid-cols-[1fr_320px] gap-7 md:gap-[52px] items-start">

              {/* Left: Title + lede */}
              <div>
                <span className="eyebrow block mb-3.5 text-sun-salmon">Destination Guide {"\u00B7"} Southern Utah</span>

                <h1 className="font-serif text-[clamp(38px,6vw,64px)] font-light text-dark-ink leading-none tracking-[-0.02em] mt-0 mb-[22px]">
                  Zion &amp; Its Orbit
                </h1>

                <p className="font-body text-[14px] font-normal text-[#4A5650] leading-[1.75] max-w-[460px] mt-0 mb-0">
                  The walls are 2,000 feet high and the river runs through the floor of it. Most people come, do the Narrows, do Angels Landing, and leave. This guide is for the ones who want to actually be inside the place {"\u2014"} and the landscape that surrounds it.
                </p>
              </div>

              {/* Right: This Guide Covers */}
              <div className="border-t md:border-t-0 md:border-l border-stone pt-7 md:pt-0 md:pl-7">
                <div className="font-body text-[11px] font-bold tracking-[0.22em] uppercase text-[#7A857E] mb-[18px]">This guide covers</div>

                <div className="mb-4">
                  <div className="font-body text-[11px] font-bold tracking-[0.2em] uppercase text-sea-glass mb-2.5">Parks</div>
                  {[
                    { label: "Zion National Park", url: "https://www.nps.gov/zion/" },
                    { label: "Bryce Canyon National Park", url: "https://www.nps.gov/brca/" },
                    { label: "Capitol Reef National Park", url: "https://www.nps.gov/care/" },
                  ].map((park, i) => (
                    <a key={i} href={park.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 mb-[7px] no-underline">
                      <div className="w-[5px] h-[5px] rounded-full bg-sea-glass opacity-50" />
                      <span className="font-body text-[12px] font-semibold tracking-[0.02em] text-dark-ink">{park.label}</span>
                    </a>
                  ))}
                </div>

                <div className="mb-4">
                  <div className="font-body text-[11px] font-bold tracking-[0.2em] uppercase text-golden-amber mb-2.5">Gateway Towns</div>
                  {["Springdale", "Kanab", "Escalante", "Torrey"].map((town, i) => (
                    <div key={i} className="flex items-center gap-2.5 mb-[7px]">
                      <div className="w-[5px] h-[5px] rounded-full bg-golden-amber opacity-50" />
                      <span className="font-body text-[12px] font-semibold tracking-[0.02em] text-dark-ink">{town}</span>
                    </div>
                  ))}
                </div>

                <div className="font-body text-[11px] font-medium tracking-[0.06em] text-[#7A857E] mt-3.5 pt-3 border-t border-stone">
                  Updated 2026
                </div>
              </div>
            </div>
          </FadeIn>

          {/* Stats bar */}
          <FadeIn delay={0.06}>
            <div className="mt-8">
              <div className="h-px" style={{ background: `${C.darkInk}14` }} />
              <div className="grid grid-cols-2 md:grid-cols-4 py-5">
                {[
                  { l: "Best time", v: "Sept\u2013Oct, Mar\u2013May" },
                  { l: "Fly into", v: "Las Vegas (LAS)" },
                  { l: "Drive time", v: "~2.5 hrs" },
                  { l: "Stay", v: "4\u20137 days" },
                ].map((s, i) => (
                  <div key={i} className="text-center px-3 py-2 md:py-0" style={{ borderLeft: i > 0 ? `1px solid ${C.darkInk}14` : 'none' }}>
                    <div className="font-body text-[10px] font-bold tracking-[0.18em] uppercase text-[#7A857E] mb-1">{s.l}</div>
                    <div className="font-body text-[14px] font-medium text-dark-ink leading-[1.3]">{s.v}</div>
                  </div>
                ))}
              </div>
              <div className="h-px" style={{ background: `${C.darkInk}14` }} />
            </div>
          </FadeIn>
        </div>
          </section>
      </div>

      {/* ══ GUIDE SECTION NAV ═══════════════════════════════════════════════ */}
      <GuideNav isMobile={isMobile} />

      {/* ══ IMAGE STRIP ════════════════════════════════════════════════════ */}
      <section className="relative">
        <div className="flex gap-0.5 overflow-x-auto snap-x snap-mandatory" style={{ WebkitOverflowScrolling: "touch", scrollbarWidth: "none" }}>
          {[
            { src: P.zionWatchman, alt: "The Watchman at golden hour", caption: "The Watchman at golden hour", width: 420 },
            { src: P.zionNarrows, alt: "The Narrows", caption: "The Narrows \u2014 ankle to waist", width: 280 },
            { src: P.bryceCanyon, alt: "Bryce Canyon hoodoos", caption: "Bryce Canyon hoodoos", width: 420 },
            { src: P.capitolReef, alt: "Capitol Reef at sunset", caption: "Capitol Reef at sunset", width: 360 },
          ].map((img, i) => (
            <div key={i} className="flex-none snap-start relative overflow-hidden" style={{ width: isMobile ? "85vw" : img.width }}>
              <img src={img.src} alt={img.alt} className="w-full h-[320px] object-cover block" />
              <div className="absolute bottom-0 left-0 right-0 px-4 pt-8 pb-3.5" style={{ background: "linear-gradient(to top, rgba(10,18,26,0.7), transparent)" }}>
                <span className="font-body text-[11px] font-semibold tracking-[0.08em] text-white/80">{img.caption}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══ GUIDE CONTENT ═══════════════════════════════════════════════════ */}
      <section className="px-5 py-8 md:px-[52px] md:py-12 bg-cream">
        <div className="max-w-[680px] mx-auto">


          {/* ══════════════════════════════════════════════════════════════ */}
          {/* SECTION 1 — THE PLACE & HOW TO BE IN IT                      */}
          {/* ══════════════════════════════════════════════════════════════ */}
          <section id="the-place" className="scroll-mt-[126px] pt-11 pb-4">

            {/* 1a. The Awe */}
            <FadeIn>
              <SectionLabel>The Place</SectionLabel>
              <p className="font-body text-[clamp(14px,1.8vw,15px)] leading-[1.8] font-normal text-[#4A5650] mt-0 mb-4">
                There are places you visit and places that visit you. Zion is the second kind.
              </p>
              <p className="font-body text-[clamp(14px,1.8vw,15px)] leading-[1.8] font-normal text-[#4A5650] mt-0 mb-4">
                The canyon walls close in above you {"\u2014"} sandstone cut two thousand feet high, copper at sunrise, impossible pink at dusk {"\u2014"} and something in the ordinary mind gets quiet. The Paiute people called it Mukuntuweap: straight-up land. That name is more accurate than the one that replaced it. Whatever you call it, you feel it the moment you arrive.
              </p>
              <p className="font-body text-[clamp(14px,1.8vw,15px)] leading-[1.8] font-normal text-[#4A5650] mt-0 mb-4">
                But Zion is just the anchor. The landscape it sits inside is one continuous living thing {"\u2014"} three parks, three personalities, connected by some of the most dramatic road in America. Zion pulls you down into the earth. Bryce Canyon lifts you 8,000 feet into a forest of hoodoos that shouldn{"\u2019"}t exist. Capitol Reef takes you to the Waterpocket Fold {"\u2014"} a hundred-mile wrinkle in the earth{"\u2019"}s crust that most people drive right past. Scenic Byway 12, the road that connects them, is an experience in itself.
              </p>
              <p className="font-body text-[clamp(14px,1.8vw,15px)] leading-[1.8] font-normal text-[#4A5650] mt-0 mb-7">
                A week here, done right, is genuinely disorienting {"\u2014"} in the best way.
              </p>
            </FadeIn>

            {/* Highlights grid */}
            <FadeIn delay={0.08}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-px mb-8" style={{ background: `${C.stone}15` }}>
                {HIGHLIGHTS.map(h => (
                  <div key={h.name} style={{ background: C.warmWhite }} className="p-4 md:p-5">
                    <div className="font-body text-[11px] font-semibold mb-1" style={{ color: C.sunSalmon }}>{"\u25C8"}</div>
                    <div className="font-serif text-[17px] font-normal text-dark-ink leading-[1.3] mb-1">{h.name}</div>
                    <div className="font-body text-[9px] font-bold tracking-[0.16em] uppercase mb-2" style={{ color: '#7A857E' }}>{h.category}</div>
                    <p className="font-body text-[13px] font-normal text-[#4A5650] leading-[1.5] m-0">{h.blurb}</p>
                  </div>
                ))}
              </div>
            </FadeIn>

            <SubGuideThread to="/destinations/zion/know-the-place" label="Know the Place" />

            {/* 1b. How to be in it */}
            <FadeIn delay={0.1}>
              <div className="h-px my-10" style={{ background: `${C.darkInk}14` }} />
              <p className="font-body text-[10px] font-bold tracking-[0.18em] uppercase mb-3.5" style={{ color: ACCENT }}>How to Be In It</p>
              <p className="font-body text-[clamp(14px,1.8vw,15px)] leading-[1.8] font-normal text-[#4A5650] mt-0 mb-4">
                The dark, lumpy crust visible just off the trail is cryptobiotic soil {"\u2014"} a living community of cyanobacteria, lichens, and fungi that can take 50{"\u2013"}250 years to recover from a single footstep. It holds the desert floor together, fixes nitrogen, and retains moisture. It looks like nothing. It is everything. The trail exists for a reason.
              </p>
              <p className="font-body text-[clamp(14px,1.8vw,15px)] leading-[1.8] font-normal text-[#4A5650] mt-0 mb-4">
                The Virgin River runs through the entire canyon and sustains one of the most biodiverse riparian corridors in the American Southwest. Sunscreen, insect repellent, and soap {"\u2014"} even biodegradable {"\u2014"} affect the aquatic ecosystem. Apply well before you enter the water. Pack out everything. The river is not a wash.
              </p>
              <p className="font-body text-[clamp(14px,1.8vw,15px)] leading-[1.8] font-normal text-[#4A5650] mt-0 mb-4">
                The Paiute called this place Mukuntuweap. That name carries the weight of thousands of years of relationship with this land. Angels Landing was named by a Methodist minister in 1916. The canyon doesn{"\u2019"}t belong to any single story {"\u2014"} but some stories were here first, and they deserve to be heard.
              </p>
            </FadeIn>

            <SubGuideThread to="/destinations/zion/be-there-well" label="Be There Well" />

            {/* 1c. The deeper invitation */}
            <FadeIn delay={0.12}>
              <div className="h-px my-10" style={{ background: `${C.darkInk}14` }} />
              <p className="font-body text-[10px] font-bold tracking-[0.18em] uppercase mb-3.5" style={{ color: ACCENT }}>The Deeper Invitation</p>
              <p className="font-body text-[clamp(14px,1.8vw,15px)] leading-[1.8] font-normal text-[#4A5650] mt-0 mb-4">
                The canyon has a way of slowing the nervous system down. The scale of the walls, the sound of the river, the way the light changes every twenty minutes {"\u2014"} it works on you whether you want it to or not. There are places in Zion where you can sit for an hour and feel like you{"\u2019"}ve been meditating without trying.
              </p>
              <p className="font-body text-[clamp(14px,1.8vw,15px)] leading-[1.8] font-normal text-[#4A5650] mt-0 mb-4">
                At night, the sky opens. Zion is a certified International Dark Sky Park. On a moonless night, the Milky Way arcs directly overhead between the canyon walls. Bring a blanket, lie down, and give yourself an hour. The oldest light in the universe is falling on you.
              </p>
            </FadeIn>

            <SubGuideThread to="/destinations/zion/breathe" label="Breathe" />
            <SubGuideThread to="/destinations/zion/night-sky" label="Night Sky" />
          </section>


          <Divider />


          {/* ══════════════════════════════════════════════════════════════ */}
          {/* SECTION 2 — FIND YOUR BASE                                   */}
          {/* ══════════════════════════════════════════════════════════════ */}
          <section id="find-base" className="scroll-mt-[126px] py-11">
            <FadeIn>
              <SectionLabel>Find Your Base</SectionLabel>
              <p className="font-body text-[clamp(14px,1.8vw,15px)] leading-[1.8] font-normal text-[#4A5650] mt-0 mb-4">
                Springdale is the move. A single-street town pressed against the canyon mouth {"\u2014"} you can walk to the park entrance. Restaurants, gear shops, and galleries line the half-mile stretch, all of it sandstone red and cottonwood green. For a trip focused on Zion proper, this is where you sleep.
              </p>
              <p className="font-body text-[clamp(14px,1.8vw,15px)] leading-[1.8] font-normal text-[#4A5650] mt-0 mb-7">
                If you{"\u2019"}re running the full orbit {"\u2014"} Zion, Bryce, Capitol Reef {"\u2014"} you{"\u2019"}ll want to split nights. Two to three in Springdale, then move east along Scenic Byway 12. Kanab works as a southern anchor. Escalante and Torrey are the corridor towns that most people skip and shouldn{"\u2019"}t.
              </p>
            </FadeIn>

            {/* Springdale card */}
            <FadeIn delay={0.06}>
              <div className="p-5 mb-6" style={{ background: C.cream, border: `1px solid ${C.stone}` }}>
                <div className="font-body text-[10px] font-bold tracking-[0.18em] uppercase mb-2" style={{ color: C.goldenAmber }}>Your home base</div>
                <div className="font-serif text-[20px] font-normal text-dark-ink leading-[1.2] mb-2">Springdale</div>
                <p className="font-body text-[13px] font-normal text-[#4A5650] leading-[1.7] m-0">
                  A single-street town pressed against the canyon mouth. Walk to the park entrance. Restaurants, gear shops, and galleries line the half-mile stretch {"\u2014"} all of it sandstone red and cottonwood green.
                </p>
              </div>
            </FadeIn>

            {/* Corridor towns */}
            <FadeIn delay={0.08}>
              <p className="font-body text-[clamp(14px,1.8vw,15px)] leading-[1.8] font-normal text-[#4A5650] mt-0 mb-4">
                Beyond Springdale, the corridor towns each serve a different park and a different pace. If you{"\u2019"}re building a multi-day orbit, plan to sleep in at least two of them.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-px mb-8" style={{ background: `${C.stone}15` }}>
                {TOWNS.map(town => (
                  <div key={town.name} style={{ background: C.warmWhite }} className="p-4 md:p-5">
                    <div className="font-body text-[9px] tracking-[0.16em] uppercase text-[#7A857E] mb-1">{town.context}</div>
                    <div className="font-serif text-[17px] font-normal text-dark-ink leading-[1.2] mb-2">{town.name}</div>
                    <p className="font-body text-[13px] font-normal text-[#4A5650] leading-[1.7] m-0">{town.description}</p>
                  </div>
                ))}
              </div>
            </FadeIn>

            {/* Sleep picks */}
            <FadeIn delay={0.1}>
              <p className="font-body text-[clamp(14px,1.8vw,15px)] leading-[1.8] font-normal text-[#4A5650] mt-0 mb-4">
                Need somewhere to stay in Springdale? A few we like:
              </p>
              <div>
                {sleepPicks.map(a => (
                  <StayItem
                    key={a.id}
                    name={a.name}
                    location={a.location}
                    tier={a.stayStyle}
                    detail={a.highlights?.join('. ')}
                    tags={a.tags}
                    url={a.links?.booking || a.links?.website}
                    featured={a.lilaPick}
                    onOpenSheet={openSheet}
                    priceRange={a.priceRange}
                    amenities={a.amenities}
                    bookingWindow={a.bookingWindow}
                    seasonalNotes={a.seasonalNotes}
                    groupFit={a.groupFit}
                  />
                ))}
              </div>
            </FadeIn>

            <SubGuideThread to="/destinations/zion/sleep" label="Sleep" description="Full accommodations list across all towns" />
          </section>


          <Divider />


          {/* ══════════════════════════════════════════════════════════════ */}
          {/* SECTION 3 — EXPERIENCE IT                                    */}
          {/* ══════════════════════════════════════════════════════════════ */}
          <section id="experience" className="scroll-mt-[126px] py-11">
            <FadeIn>
              <SectionLabel>Experience It</SectionLabel>
              <p className="font-body text-[clamp(14px,1.8vw,15px)] leading-[1.8] font-normal text-[#4A5650] mt-0 mb-7">
                The landscape does a lot of the work. Your job is to show up at the right place at the right time, dressed for the weather, with enough water. Below are the essentials {"\u2014"} the full lists live in the sub-guides.
              </p>
            </FadeIn>


            {/* ── MOVE ── */}
            <FadeIn delay={0.06}>
              <div className="mb-10">
                <p className="font-body text-[10px] font-bold tracking-[0.18em] uppercase mb-1" style={{ color: ACCENT }}>Move</p>
                <div className="h-px mb-4" style={{ background: `${C.darkInk}14` }} />

                <p className="font-body text-[clamp(14px,1.8vw,15px)] leading-[1.8] font-normal text-[#4A5650] mt-0 mb-4">
                  The Narrows is the signature experience {"\u2014"} you{"\u2019"}re wading a river through slot canyon walls two thousand feet high. Angels Landing is the one everyone knows about: a chain-assisted scramble to a rock fin with a thousand feet of air on both sides (permit required). Canyon Overlook is the sleeper {"\u2014"} one mile round trip with an outsized reward.
                </p>

                <div>
                  {movePicks.map(item => (
                    <ListItem
                      key={item.id}
                      name={item.name}
                      detail={item.highlights?.join('. ')}
                      tags={item.tags}
                      featured={item.lilaPick}
                      url={item.links?.website}
                      location={item.location}
                      onOpenSheet={openSheet}
                    />
                  ))}
                </div>

                <SubGuideThread to="/destinations/zion/move" label="Move" description="Full trail and activity list" />
              </div>
            </FadeIn>


            {/* ── EAT ── */}
            <FadeIn delay={0.08}>
              <div className="mb-10">
                <p className="font-body text-[10px] font-bold tracking-[0.18em] uppercase mb-1" style={{ color: ACCENT }}>Eat</p>
                <div className="h-px mb-4" style={{ background: `${C.darkInk}14` }} />

                <p className="font-body text-[clamp(14px,1.8vw,15px)] leading-[1.8] font-normal text-[#4A5650] mt-0 mb-4">
                  Springdale has more good food than a town its size should. Oscar{"\u2019"}s is the local breakfast institution. Deep Creek does the coffee right. Bit & Spur is the dinner move {"\u2014"} Southwestern with actual range. And if you make it to Boulder on Scenic Byway 12, Hell{"\u2019"}s Backbone Grill is one of the best farm-to-table restaurants in the West, full stop.
                </p>

                <div>
                  {eatPicks.map(r => (
                    <ListItem
                      key={r.id}
                      name={r.name}
                      detail={r.highlights?.join('. ')}
                      note={r.hours}
                      tags={r.tags}
                      featured={r.lilaPick}
                      url={r.links?.website}
                      location={r.location}
                      onOpenSheet={openSheet}
                      cuisine={r.cuisine}
                      priceRange={r.priceRange}
                      reservations={r.reservations}
                      dietary={r.dietary}
                      energy={r.energy}
                    />
                  ))}
                </div>

                <SubGuideThread to="/destinations/zion/eat" label="Eat" description="Full restaurant guide" />
              </div>
            </FadeIn>


            {/* ── WHEN TO COME ── */}
            <FadeIn delay={0.1}>
              <div className="mb-4">
                <p className="font-body text-[10px] font-bold tracking-[0.18em] uppercase mb-1" style={{ color: ACCENT }}>When to Come</p>
                <div className="h-px mb-4" style={{ background: `${C.darkInk}14` }} />

                <p className="font-body text-[clamp(14px,1.8vw,15px)] leading-[1.8] font-normal text-[#4A5650] mt-0 mb-5">
                  Zion transforms with the seasons. The desert doesn{"\u2019"}t do subtle {"\u2014"} it blooms, it burns gold, it goes silent under snow. These are the windows we build trips around.
                </p>

                <div>
                  {TIMING_WINDOWS.map((tw, i) => (
                    <div key={i} className="py-4" style={{ borderBottom: i < TIMING_WINDOWS.length - 1 ? `1px solid ${C.stone}` : 'none' }}>
                      <div className="font-body text-[10px] font-bold tracking-[0.18em] uppercase mb-1" style={{ color: C.skyBlue }}>{tw.window}</div>
                      <div className="font-serif text-[17px] font-normal text-dark-ink leading-[1.3] mb-1">{tw.name}</div>
                      <p className="font-body text-[13px] font-normal text-[#4A5650] leading-[1.6] m-0">{tw.detail}</p>
                    </div>
                  ))}
                </div>

                <SubGuideThread to="/destinations/zion/when-to-go" label="When to Go" description="Seasonal detail and planning windows" />
              </div>
            </FadeIn>
          </section>


          <Divider />


          {/* ══════════════════════════════════════════════════════════════ */}
          {/* CTA                                                          */}
          {/* ══════════════════════════════════════════════════════════════ */}
          <section id="cta" className="scroll-mt-[126px] pt-14 pb-[72px] text-center">
            <FadeIn>
              <div className="py-12 px-6" style={{ background: C.darkInk }}>
                <span className="font-body text-[12px] font-bold tracking-[0.28em] uppercase block mb-4" style={{ color: C.skyBlue }}>Begin</span>
                <h3 className="font-serif text-[clamp(28px,5vw,42px)] font-light text-white mt-0 mb-2.5 leading-[1.2]">Your Zion trip starts here</h3>
                <p className="font-body text-[14px] font-normal max-w-[460px] mx-auto mb-9 leading-[1.65]" style={{ color: 'rgba(255,255,255,0.7)' }}>
                  Turn this guide into a day-by-day itinerary built around how you travel.
                </p>

                <Link to="/plan"
                  className="inline-block py-3.5 px-9 text-white text-center font-body text-[12px] font-bold tracking-[0.2em] uppercase cursor-pointer transition-opacity duration-200 no-underline"
                  style={{ border: '1.5px solid rgba(255,255,255,0.4)' }}
                  onClick={() => trackEvent('guide_cta_clicked', { action: 'plan_a_trip', destination: 'zion' })}
                  onMouseEnter={e => { e.currentTarget.style.background = 'white'; e.currentTarget.style.color = C.darkInk; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'white'; }}
                >Plan a Trip</Link>
              </div>
            </FadeIn>
          </section>


          <Divider />

        </div>
      </section>

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
