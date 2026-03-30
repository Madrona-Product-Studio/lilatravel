// ═══════════════════════════════════════════════════════════════════════════════
// CELESTIAL SNAPSHOT — inline expandable card for destination guides
// ═══════════════════════════════════════════════════════════════════════════════
//
// Inline card showing weather, sun, moon, night sky, river level,
// upcoming celestial events, and NPS alerts. Collapsed by default with
// a 4-across summary grid; expands to full detail rows.
//

import { useState, useEffect, useCallback } from 'react';
import { C } from '@data/brand';
import { getCelestialSnapshot } from '@services/celestialService';


// ─── Shared Typography ──────────────────────────────────────────────────────

const LABEL = "font-body text-[10px] font-bold tracking-[0.2em] uppercase text-[#b8b0a8] mb-1.5";
const VALUE = "font-body text-sm font-semibold text-dark-ink leading-[1.4]";
const DETAIL = "font-body text-xs font-normal text-[#8a9098] leading-[1.5]";


// ─── SVG Helpers ─────────────────────────────────────────────────────────────

function SunArc({ progress }) {
  // Semicircular arc showing daylight progress (0 = sunrise/left, 1 = sunset/right)
  const w = 180, h = 50;
  const cx = w / 2, cy = h - 4;
  const r = 72;

  const arcPath = `M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`;
  const arcLen = Math.PI * r;

  // Angle along the semicircle: π (left) → 0 (right)
  const angle = Math.PI * (1 - progress);
  const dotX = cx + r * Math.cos(angle);
  const dotY = cy - r * Math.sin(angle);

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="block mx-auto mt-1.5 mb-0.5">
      {/* Full semicircle background */}
      <path d={arcPath} fill="none" stroke={C.stone} strokeWidth="1.5" />
      {progress > 0 && progress < 1 && (
        <>
          {/* Progress stroke */}
          <path
            d={arcPath}
            fill="none" stroke={C.goldenAmber} strokeWidth="1.5"
            strokeDasharray={`${progress * arcLen} ${arcLen}`}
          />
          <circle cx={dotX} cy={dotY} r="4" fill={C.goldenAmber} />
        </>
      )}
      {/* Horizon line */}
      <line x1={cx - r - 8} y1={cy} x2={cx + r + 8} y2={cy} stroke={C.stone} strokeWidth="0.5" />
    </svg>
  );
}

let moonClipId = 0;

function MoonDisc({ illumination, phaseName, r = 14 }) {
  const [clipId] = useState(() => `moonClip-${++moonClipId}`);
  const size = r * 2 + 4;
  const cx = r + 2, cy = r + 2;

  const isWaning = phaseName.includes("Waning") || phaseName === "Last Quarter";
  const fraction = illumination / 100;

  // Full moon or new moon — simple circle
  if (fraction >= 0.98) {
    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={cx} cy={cy} r={r} fill="#e8e4d8" />
      </svg>
    );
  }
  if (fraction <= 0.02) {
    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={cx} cy={cy} r={r} fill="#2a3040" />
      </svg>
    );
  }

  // Terminator as an ellipse: rx shrinks from r → 0 as fraction goes 0 → 0.5,
  // then grows 0 → r as fraction goes 0.5 → 1
  const termRx = Math.abs(1 - 2 * fraction) * r;
  // Before half-lit the dark side bulges past center; after, the lit side does
  const litHalf = fraction > 0.5;

  // Build two-half path: lit half is always a semicircle, terminator is an elliptical arc
  // For waxing, right side is lit; for waning, left side is lit
  const flip = isWaning ? -1 : 1;

  // Semicircle arc on the lit side
  const litPath = `M ${cx} ${cy - r} A ${r} ${r} 0 0 ${isWaning ? 0 : 1} ${cx} ${cy + r}`;
  // Terminator arc curving back
  const sweepBack = litHalf ? (isWaning ? 1 : 0) : (isWaning ? 0 : 1);
  const termPath = `A ${termRx} ${r} 0 0 ${sweepBack} ${cx} ${cy - r}`;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={cx} cy={cy} r={r} fill="#2a3040" />
      <clipPath id={clipId}>
        <circle cx={cx} cy={cy} r={r} />
      </clipPath>
      <path d={`${litPath} ${termPath} Z`} fill="#e8e4d8" clipPath={`url(#${clipId})`} />
    </svg>
  );
}

function QualityDots({ rating, max = 5 }) {
  return (
    <span className="inline-flex gap-[3px]">
      {Array.from({ length: max }, (_, i) => (
        <span key={i} className="w-1.5 h-1.5 rounded-full transition-colors duration-300" style={{
          background: i < rating ? C.goldenAmber : C.stone,
        }} />
      ))}
    </span>
  );
}

function RiverBar({ level }) {
  const colors = { low: C.seaGlass, moderate: C.skyBlue, high: C.goldenAmber, dangerous: C.sunSalmon };
  const widths = { low: "25%", moderate: "50%", high: "75%", dangerous: "100%" };
  return (
    <div className="h-1 bg-stone w-full mt-1.5">
      <div className="h-full transition-all duration-500" style={{
        width: widths[level],
        background: colors[level],
      }} />
    </div>
  );
}


// ─── RiverDot (collapsed grid indicator) ─────────────────────────────────────

function RiverDot({ level }) {
  const colors = { low: C.seaGlass, moderate: C.skyBlue, high: C.goldenAmber, dangerous: C.sunSalmon };
  return (
    <span className="inline-block w-2.5 h-2.5 rounded-full" style={{
      background: colors[level] || C.stone,
    }} />
  );
}


// ─── Collapsed View ──────────────────────────────────────────────────────────

function CollapsedView({ data, onExpand }) {
  const { weather, moon, sky, river, destinationName } = data;

  const CELL_LABEL = "font-body text-[10px] font-bold tracking-[0.18em] uppercase text-[#b8b0a8] mt-1.5";

  const riverColors = { low: C.seaGlass, moderate: C.skyBlue, high: C.goldenAmber, dangerous: C.sunSalmon };
  const riverLabels = { low: "Low", moderate: "OK", high: "High", dangerous: "High" };

  const cells = [];
  if (weather) cells.push({ key: "temp", content: (
    <>
      <span className="font-serif text-[28px] font-light text-dark-ink leading-none">
        {weather.temp}°
      </span>
      <span className={CELL_LABEL}>{weather.condition}</span>
    </>
  )});
  if (moon) cells.push({ key: "moon", content: (
    <>
      <MoonDisc illumination={moon.phase} phaseName={moon.name} r={10} />
      <span className={CELL_LABEL}>{moon.name.split(" ")[0]}</span>
    </>
  )});
  if (sky) cells.push({ key: "sky", content: (
    <>
      <span className="font-body text-[15px] font-semibold text-golden-amber">{sky.label}</span>
      <span className={CELL_LABEL}>Sky</span>
    </>
  )});
  if (river) cells.push({ key: "river", content: (
    <>
      <div className="flex items-center gap-1.5">
        <RiverDot level={river.level} />
        <span className="font-body text-xs font-semibold" style={{ color: riverColors[river.level] || C.stone }}>
          {riverLabels[river.level] || river.label}
        </span>
      </div>
      <span className={CELL_LABEL}>River</span>
    </>
  )});

  return (
    <>
      {/* Header */}
      <div className="flex items-center gap-2 mb-1">
        <span className="w-2 h-2 rounded-full bg-sea-glass animate-celestial-pulse" />
        <span className="font-serif text-xl font-light text-dark-ink leading-[1.2]">Celestial Snapshot</span>
      </div>
      <div className="font-body text-xs font-normal text-[#8a9098] mb-4">{destinationName} — right now</div>

      {/* 4-across flex grid */}
      {cells.length > 0 && (
        <div className="flex flex-wrap mb-3.5">
          {cells.map((cell, i) => (
            <div key={cell.key} className="flex-auto min-w-[60px] flex flex-col items-center justify-center py-3.5 px-3" style={{
              borderRight: i < cells.length - 1 ? `1px solid ${C.stone}` : "none",
            }}>
              {cell.content}
            </div>
          ))}
        </div>
      )}

      {/* Expand button */}
      <button
        onClick={onExpand}
        className="bg-transparent border-none p-0 cursor-pointer font-body text-[11px] font-bold tracking-[0.14em] uppercase text-ocean-teal"
      >Full conditions ▼</button>
    </>
  );
}


// ─── Expanded View ───────────────────────────────────────────────────────────

function ExpandedView({ data, onCollapse }) {
  const { weather, sun, moon, sky, river, nextEvent, alerts, destinationName } = data;

  return (
    <>
      {/* Header */}
      <div className="flex items-center gap-2 mb-1">
        <span className="w-2 h-2 rounded-full bg-sea-glass animate-celestial-pulse" />
        <span className="font-serif text-xl font-light text-dark-ink leading-[1.2]">Celestial Snapshot</span>
      </div>
      <div className="font-body text-xs font-normal text-[#8a9098] mb-4">{destinationName} — right now</div>

      {/* 1. Conditions */}
      {weather && (
        <div className="border-b border-stone py-3.5">
          <div className={LABEL}>CONDITIONS</div>
          <div className="flex items-baseline gap-2.5">
            <span className="font-serif text-[32px] font-light text-dark-ink leading-none">{weather.temp}°</span>
            <span className={VALUE}>{weather.condition}</span>
          </div>
          <div className={`${DETAIL} mt-1.5`}>
            H {weather.high}° / L {weather.low}° · Wind {weather.wind} mph
          </div>
        </div>
      )}

      {/* 2. Daylight */}
      {sun && (
        <div className="border-b border-stone py-3.5">
          <div className={LABEL}>DAYLIGHT</div>
          <SunArc progress={sun.progress} />
          <div className={`${VALUE} text-[13px] text-center`}>{sun.daylight}</div>
          <div className="flex justify-between mt-2 py-2 px-2.5" style={{
            background: `${C.goldenAmber}08`,
            border: `1px solid ${C.goldenAmber}18`,
          }}>
            <div className="text-left">
              <div className={`${LABEL} !text-[9px] !mb-0.5`}>SUNRISE</div>
              <div className={`${VALUE} text-sm`}>{sun.rise}</div>
            </div>
            <div className="text-right">
              <div className={`${LABEL} !text-[9px] !mb-0.5`}>SUNSET</div>
              <div className={`${VALUE} text-sm`}>{sun.set}</div>
            </div>
          </div>
        </div>
      )}

      {/* 3. Moon */}
      {moon && (
        <div className="border-b border-stone py-3.5">
          <div className={LABEL}>MOON</div>
          <div className="flex items-center gap-2.5">
            <MoonDisc illumination={moon.phase} phaseName={moon.name} />
            <div>
              <div className={VALUE}>{moon.name}</div>
              <div className={DETAIL}>{moon.phase}% illuminated</div>
            </div>
          </div>
        </div>
      )}

      {/* 4. Tonight's Sky */}
      {sky && (
        <div className="border-b border-stone py-3.5">
          <div className={LABEL}>{"TONIGHT'S SKY"}</div>
          <div className="flex items-center gap-2.5">
            <span className={`${VALUE} !text-golden-amber`}>{sky.label}</span>
            <QualityDots rating={sky.quality} />
          </div>
          <div className={`${DETAIL} mt-1.5`}>
            Bortle Class {sky.bortle}
            {sky.milkyWayVisible && sky.milkyWayWindow && (
              <> · Milky Way {sky.milkyWayWindow}</>
            )}
            {sky.milkyWayNote && <> · {sky.milkyWayNote}</>}
            {!sky.milkyWayVisible && <> · Milky Way core not visible this season</>}
          </div>
        </div>
      )}

      {/* 5. Virgin River */}
      {river && (
        <div className="border-b border-stone py-3.5">
          <div className={LABEL}>RIVER</div>
          <div className="flex items-center gap-2.5">
            <RiverDot level={river.level} />
            <span className={VALUE}>{river.label}</span>
          </div>
          <div className={`${DETAIL} mt-1.5`}>
            {river.cfs} cfs · Water temp {river.tempF}°F
          </div>
        </div>
      )}

      {/* 6. Next Celestial Event */}
      {nextEvent && (
        <div className="border-b border-stone py-3.5">
          <div className={LABEL}>NEXT CELESTIAL EVENT</div>
          <div className={VALUE}>{nextEvent.name}</div>
          <div className={`${DETAIL} mt-1`}>
            {nextEvent.date} · {nextEvent.daysAway} day{nextEvent.daysAway !== 1 ? "s" : ""} away
          </div>
          <div className={`${DETAIL} mt-1`}>{nextEvent.detail}</div>
        </div>
      )}

      {/* Collapse button */}
      <button
        onClick={onCollapse}
        className="bg-transparent border-none p-0 cursor-pointer font-body text-[11px] font-bold tracking-[0.14em] uppercase text-ocean-teal mt-3.5"
      >Show less ▲</button>

      {/* NPS Alerts */}
      {alerts && alerts.length > 0 && (
        <div className="py-2.5 px-3 mt-3.5" style={{
          background: `${C.sunSalmon}10`,
          border: `1px solid ${C.sunSalmon}25`,
        }}>
          {alerts.map((alert, i) => (
            <div key={i} className="flex gap-2 items-start" style={{
              marginBottom: i < alerts.length - 1 ? 8 : 0,
            }}>
              <span className="w-[5px] h-[5px] rounded-full bg-sun-salmon mt-1 shrink-0" />
              <span className={`${DETAIL} !text-[#5a6a78]`}>{alert}</span>
            </div>
          ))}
        </div>
      )}
    </>
  );
}


// ─── Card Skeleton ───────────────────────────────────────────────────────────

function CardSkeleton() {
  return (
    <div className="w-full px-[22px] py-5 bg-warm-white border border-stone">
      {/* Header skeleton */}
      <div className="flex items-center gap-2 mb-1">
        <div className="w-2 h-2 rounded-full bg-stone opacity-40" />
        <div className="w-[140px] h-3.5 bg-stone opacity-30" />
      </div>
      <div className="w-[120px] h-2 bg-stone opacity-25 mb-4" />
      {/* Grid skeleton */}
      <div className="flex gap-0 mb-3.5">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="flex-auto flex items-center justify-center py-2" style={{
            borderRight: i < 4 ? `1px solid ${C.stone}` : "none",
          }}>
            <div className="w-6 h-4 bg-stone opacity-20" />
          </div>
        ))}
      </div>
      {/* Button skeleton */}
      <div className="w-[100px] h-2 bg-stone opacity-20" />
    </div>
  );
}


// ─── Main Export ─────────────────────────────────────────────────────────────

export default function CelestialSnapshot({ destination = "zion" }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);

  // Fetch data
  const fetchData = useCallback(async () => {
    try {
      const snapshot = await getCelestialSnapshot(destination);
      setData(snapshot);
    } catch (err) {
      console.error("CelestialSnapshot fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, [destination]);

  useEffect(() => {
    fetchData();
    // Refresh every 30 minutes
    const interval = setInterval(fetchData, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchData]);

  if (loading) return <CardSkeleton />;
  if (!data) return null;

  return (
    <div className="w-full px-[22px] py-5 bg-warm-white border border-stone">
      {expanded
        ? <ExpandedView data={data} onCollapse={() => setExpanded(false)} />
        : <CollapsedView data={data} onExpand={() => setExpanded(true)} />
      }
    </div>
  );
}
