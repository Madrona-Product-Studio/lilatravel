// ═══════════════════════════════════════════════════════════════════════════════
// SUB-GUIDE: KNOW THE PLACE
// ═══════════════════════════════════════════════════════════════════════════════
//
// The land, the parks, the story of this landscape.
// Route: /destinations/zion/know-the-place
//

import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import SubGuideLayout from '@components/guide/SubGuideLayout';
import { G } from '@data/guides/guide-styles';
import { PARKS, TOWNS, WILDLIFE_GROUPS } from '@data/guides/zion-constants';

// ─── Inline Components (Zion-specific) ──────────────────────────────────────

function DesignationIcon({ designation, size = 14, color = "#2D5F2B" }) {
  if (designation === "us-national-park") return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M12 2L4 22h3l5-11 5 11h3L12 2z" fill={color} opacity="0.85" />
      <circle cx="12" cy="16" r="2.5" fill={color} opacity="0.6" />
    </svg>
  );
  if (designation === "canadian-national-park") return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M12 2L3 8v8l9 6 9-6V8L12 2z" stroke={color} strokeWidth="1.5" fill={`${color}15`} />
      <path d="M9 11l3-3 3 3M12 8v8" stroke={color} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
  return null;
}

function ParkCard({ park }) {
  const DESIGNATION_LABELS = {
    "us-national-park": "National Park",
    "canadian-national-park": "National Park Reserve",
    "state-park": "State Park",
    "provincial-park": "Provincial Park",
    "national-forest": "National Forest",
    "state-wilderness": "State Wilderness Preserve",
  };
  const NPS_CODES = { zion: "zion", bryce: "brca", "capitol-reef": "care" };
  const npsCode = NPS_CODES[park.id] || null;
  const stats = [park.acreage, park.elevation, park.attribute, park.driveFrom].filter(Boolean);
  return (
    <div className="py-4 md:py-5" style={{ borderBottom: '1px solid ' + G.borderSoft }}>
      <div className="font-body text-[9px] tracking-[0.16em] uppercase mb-1" style={{ color: G.ink40 }}>
        {DESIGNATION_LABELS[park.designation] || park.designation}{park.established ? ` · Est. ${park.established}` : ""}
      </div>
      <div className="font-serif font-light text-[19px] leading-[1.2] mb-1" style={{ color: G.ink }}>{park.name}</div>
      <div className="font-body text-[11px] leading-[1.4] mb-3" style={{ color: G.ink40 }}>
        {stats.map((s, i) => <span key={i}>{i > 0 && " · "}{s}</span>)}
      </div>
      <p className="font-body text-[13px] font-normal leading-[1.7] m-0" style={{ color: G.inkDetail }}>{park.soul}</p>
      {npsCode && (
        <a href={`https://www.nps.gov/${npsCode}/`} target="_blank" rel="noopener noreferrer"
          className="inline-block mt-3 font-body text-[10px] font-semibold tracking-[0.12em] uppercase no-underline"
          style={{ color: G.accentWarm, borderBottom: '1px solid rgba(201,150,58,0.3)' }}>
          nps.gov/{npsCode} &#8599;
        </a>
      )}
    </div>
  );
}

function WildlifeEntry({ name, season, parks, detail }) {
  return (
    <div className="py-4 md:py-5" style={{ borderBottom: '1px solid ' + G.borderSoft }}>
      <div className="font-body text-[14px] font-semibold leading-[1.3] mb-1" style={{ color: G.ink }}>{name}</div>
      <div className="font-body text-[9px] font-semibold tracking-[0.14em] uppercase mb-2" style={{ color: G.accent }}>
        {season} · {parks.join(", ")}
      </div>
      <p className="font-body text-[13px] font-normal leading-[1.6] m-0" style={{ color: G.inkDetail }}>{detail}</p>
    </div>
  );
}

// ─── Page ───────────────────────────────────────────────────────────────────

export default function ZionKnowThePlace() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  return (
    <>
      <Helmet>
        <title>Know the Place — Zion Guide | Lila Trips</title>
        <meta name="description" content="The land, the parks, the story of this landscape. Three national parks, four gateway towns, and the living corridor that connects them." />
        <link rel="canonical" href="https://lilatrips.com/destinations/zion/know-the-place" />
      </Helmet>

      <SubGuideLayout
        title="Know the Place"
        description="The land, the parks, the story of this landscape."
      >

        {/* ── The Parks ── */}
        <section className="mb-10">
          <div className="flex items-center gap-2.5 mt-9 mb-2.5">
            <span style={{ width: 28, height: 1.5, background: G.accent, display: 'block', flexShrink: 0 }} />
            <span className="font-body text-[16px] font-bold tracking-[0.01em]" style={{ color: G.ink }}>The Parks</span>
          </div>
          <div>
            {PARKS.map((park) => (
              <ParkCard key={park.id} park={park} />
            ))}
          </div>
        </section>

        {/* ── The Road ── */}
        <section className="mb-10">
          <div className="mb-10" style={{ height: 1, background: G.border }} />
          <div className="flex items-center gap-2.5 mt-9 mb-2.5">
            <span style={{ width: 28, height: 1.5, background: G.accent, display: 'block', flexShrink: 0 }} />
            <span className="font-body text-[16px] font-bold tracking-[0.01em]" style={{ color: G.ink }}>The Road</span>
          </div>
          <p className="font-body text-[15px] font-normal leading-[1.75] mt-0 mb-5" style={{ color: G.inkBody }}>
            Scenic Byway 12 connects Bryce Canyon to Capitol Reef across 124 miles of the most dramatic terrain in the American West. It crosses hogback ridges with thousand-foot drops on both sides, climbs through the ponderosa forests of Boulder Mountain, and descends into the Waterpocket Fold. Most people drive it in two hours. It deserves a full day.
          </p>

          <div className="mb-5">
            {[
              { name: "Escalante Petrified Forest State Park", detail: "Trailhead town. Petrified wood scattered across red benches above the reservoir. A quick stop that resets your sense of time.", drive: "1 hr from Bryce" },
              { name: "Kiva Koffeehouse", detail: "A hand-built stone structure cantilevered over the canyon rim. Coffee, pie, and the single best roadside view in Utah.", drive: "30 min from Escalante" },
              { name: "Anasazi State Park Museum", detail: "The remains of an ancestral Puebloan village in Boulder, occupied from 1050 to 1200 AD. One of the largest communities west of the Colorado River. Small museum, large significance.", drive: "45 min from Escalante" },
            ].map((stop, i) => (
              <div key={i} className="py-4 md:py-5" style={{ borderBottom: '1px solid ' + G.borderSoft }}>
                <div className="font-serif text-[17px] font-normal leading-[1.3] mb-1" style={{ color: G.ink }}>{stop.name}</div>
                <div className="font-body text-[9px] font-semibold tracking-[0.14em] uppercase mb-2" style={{ color: G.accent }}>
                  {stop.drive}
                </div>
                <p className="font-body text-[13px] font-normal leading-[1.6] m-0" style={{ color: G.inkDetail }}>{stop.detail}</p>
              </div>
            ))}
          </div>

          <div>
            {[
              { from: "Zion to Bryce Canyon", time: "~1.5 hrs" },
              { from: "Bryce Canyon to Capitol Reef", time: "~2.5 hrs (via Byway 12)" },
              { from: "Zion to Capitol Reef", time: "~3 hrs (direct)" },
            ].map((d, i) => (
              <div key={i} className="py-3" style={{ borderBottom: '1px solid ' + G.borderSoft }}>
                <div className="font-body text-[10px] font-semibold tracking-[0.14em] uppercase mb-1" style={{ color: G.ink40 }}>{d.from}</div>
                <div className="font-body text-[14px] font-medium" style={{ color: G.ink }}>{d.time}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── The Towns ── */}
        <section className="mb-10">
          <div className="mb-10" style={{ height: 1, background: G.border }} />
          <div className="flex items-center gap-2.5 mt-9 mb-2.5">
            <span style={{ width: 28, height: 1.5, background: G.accent, display: 'block', flexShrink: 0 }} />
            <span className="font-body text-[16px] font-bold tracking-[0.01em]" style={{ color: G.ink }}>The Towns</span>
          </div>
          <div>
            {TOWNS.map(town => (
              <div key={town.name} className="py-4 md:py-5" style={{ borderBottom: '1px solid ' + G.borderSoft }}>
                <div className="font-body text-[9px] tracking-[0.16em] uppercase mb-1" style={{ color: G.ink40 }}>{town.context}</div>
                <div className="font-serif font-normal text-[19px] leading-[1.2] mb-3" style={{ color: G.ink }}>{town.name}</div>
                <p className="font-body text-[13px] font-normal leading-[1.7] m-0" style={{ color: G.inkDetail }}>{town.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Wildlife ── */}
        <section className="mb-10">
          <div className="mb-10" style={{ height: 1, background: G.border }} />
          <div className="flex items-center gap-2.5 mt-9 mb-2.5">
            <span style={{ width: 28, height: 1.5, background: G.accent, display: 'block', flexShrink: 0 }} />
            <span className="font-body text-[16px] font-bold tracking-[0.01em]" style={{ color: G.ink }}>The Living Corridor</span>
          </div>
          <div>
            {WILDLIFE_GROUPS.flatMap(g => g.entries).slice(0, 8).map(entry => (
              <WildlifeEntry
                key={entry.name}
                name={entry.name}
                season={entry.season}
                parks={entry.parks}
                detail={entry.detail}
              />
            ))}
          </div>
        </section>

        {/* ── Indigenous History ── */}
        <section className="mb-4">
          <div className="mb-10" style={{ height: 1, background: G.border }} />
          <div className="flex items-center gap-2.5 mt-9 mb-2.5">
            <span style={{ width: 28, height: 1.5, background: G.accent, display: 'block', flexShrink: 0 }} />
            <span className="font-body text-[16px] font-bold tracking-[0.01em]" style={{ color: G.ink }}>Indigenous History</span>
          </div>
          <p className="font-body text-[15px] font-normal leading-[1.75] mt-0 mb-5" style={{ color: G.inkBody }}>
            The Southern Paiute called this place <span className="font-semibold" style={{ color: G.ink }}>Mukuntuweap</span> — "straight-up land." They were here long before the canyon had an English name. The Paiute, along with Ancestral Puebloan peoples, inhabited this landscape for thousands of years, farming the river bottoms, hunting the plateaus, and developing an intimate understanding of the desert's rhythms that no guidebook can replicate.
          </p>
          <p className="font-body text-[15px] font-normal leading-[1.75] mt-0 mb-5" style={{ color: G.inkBody }}>
            When Mormon settlers arrived in the 1860s, they renamed the canyon "Zion." The name stuck. The people who gave it its first name are still here — the Paiute Indian Tribe of Utah maintains a cultural department working on language preservation, repatriation, and youth culture camps. The canyon walls carry petroglyphs and granaries that predate European contact by centuries.
          </p>
          <p className="font-body text-[15px] font-normal leading-[1.75] mt-0 mb-0" style={{ color: G.inkBody }}>
            To move through this landscape with any integrity is to acknowledge whose land you are standing on. The geology is 170 million years old. The human story here is at least 8,000 years deep. Both deserve your attention.
          </p>
        </section>

      </SubGuideLayout>
    </>
  );
}
