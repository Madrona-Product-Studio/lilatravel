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

const LABEL = {
  fontFamily: "'Quicksand', sans-serif",
  fontSize: 10, fontWeight: 700,
  letterSpacing: "0.2em", textTransform: "uppercase",
  color: "#b8b0a8", marginBottom: 6,
};

const VALUE = {
  fontFamily: "'Quicksand', sans-serif",
  fontSize: 14, fontWeight: 600,
  color: C.darkInk, lineHeight: 1.4,
};

const DETAIL = {
  fontFamily: "'Quicksand', sans-serif",
  fontSize: 12, fontWeight: 400,
  color: "#8a9098", lineHeight: 1.5,
};


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
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ display: "block", margin: "6px auto 2px" }}>
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
    <span style={{ display: "inline-flex", gap: 3 }}>
      {Array.from({ length: max }, (_, i) => (
        <span key={i} style={{
          width: 6, height: 6, borderRadius: "50%",
          background: i < rating ? C.goldenAmber : C.stone,
          transition: "background 0.3s",
        }} />
      ))}
    </span>
  );
}

function RiverBar({ level }) {
  const colors = { low: C.seaGlass, moderate: C.skyBlue, high: C.goldenAmber, dangerous: C.sunSalmon };
  const widths = { low: "25%", moderate: "50%", high: "75%", dangerous: "100%" };
  return (
    <div style={{ height: 4, background: C.stone, width: "100%", marginTop: 6 }}>
      <div style={{
        height: "100%", width: widths[level],
        background: colors[level], transition: "width 0.5s, background 0.5s",
      }} />
    </div>
  );
}


// ─── RiverDot (collapsed grid indicator) ─────────────────────────────────────

function RiverDot({ level }) {
  const colors = { low: C.seaGlass, moderate: C.skyBlue, high: C.goldenAmber, dangerous: C.sunSalmon };
  return (
    <span style={{
      display: "inline-block",
      width: 10, height: 10, borderRadius: "50%",
      background: colors[level] || C.stone,
    }} />
  );
}


// ─── Collapsed View ──────────────────────────────────────────────────────────

function CollapsedView({ data, onExpand }) {
  const { weather, moon, sky, river } = data;

  const CELL_LABEL = {
    fontFamily: "'Quicksand', sans-serif",
    fontSize: 10, fontWeight: 700,
    letterSpacing: "0.18em", textTransform: "uppercase",
    color: "#b8b0a8", marginTop: 6,
  };

  const riverColors = { low: C.seaGlass, moderate: C.skyBlue, high: C.goldenAmber, dangerous: C.sunSalmon };
  const riverLabels = { low: "Low", moderate: "OK", high: "High", dangerous: "High" };

  const cells = [];
  if (weather) cells.push({ key: "temp", content: (
    <>
      <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 300, color: C.darkInk, lineHeight: 1 }}>
        {weather.temp}°
      </span>
      <span style={CELL_LABEL}>{weather.condition}</span>
    </>
  )});
  if (moon) cells.push({ key: "moon", content: (
    <>
      <MoonDisc illumination={moon.phase} phaseName={moon.name} r={10} />
      <span style={CELL_LABEL}>{moon.name.split(" ")[0]}</span>
    </>
  )});
  if (sky) cells.push({ key: "sky", content: (
    <>
      <span style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 15, fontWeight: 600, color: C.goldenAmber }}>{sky.label}</span>
      <span style={CELL_LABEL}>Sky</span>
    </>
  )});
  if (river) cells.push({ key: "river", content: (
    <>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <RiverDot level={river.level} />
        <span style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 12, fontWeight: 600, color: riverColors[river.level] || C.stone }}>
          {riverLabels[river.level] || river.label}
        </span>
      </div>
      <span style={CELL_LABEL}>River</span>
    </>
  )});

  return (
    <>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
        <span style={{
          width: 8, height: 8, borderRadius: "50%",
          background: C.seaGlass,
          animation: "celestialPulse 2s ease-in-out infinite",
        }} />
        <span style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 20, fontWeight: 300,
          color: C.darkInk, lineHeight: 1.2,
        }}>Celestial Snapshot</span>
      </div>
      <div style={{
        fontFamily: "'Quicksand', sans-serif",
        fontSize: 12, fontWeight: 400,
        color: "#8a9098", marginBottom: 16,
      }}>Zion Canyon — right now</div>

      {/* 4-across flex grid */}
      {cells.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", marginBottom: 14 }}>
          {cells.map((cell, i) => (
            <div key={cell.key} style={{
              flex: "1 1 auto", minWidth: 60,
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              padding: "14px 12px 12px",
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
        style={{
          background: "none", border: "none", padding: 0, cursor: "pointer",
          fontFamily: "'Quicksand', sans-serif",
          fontSize: 11, fontWeight: 700,
          letterSpacing: "0.14em", textTransform: "uppercase",
          color: C.oceanTeal,
        }}
      >Full conditions ▼</button>
    </>
  );
}


// ─── Expanded View ───────────────────────────────────────────────────────────

function ExpandedView({ data, onCollapse }) {
  const { weather, sun, moon, sky, river, nextEvent, alerts } = data;

  return (
    <>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
        <span style={{
          width: 8, height: 8, borderRadius: "50%",
          background: C.seaGlass,
          animation: "celestialPulse 2s ease-in-out infinite",
        }} />
        <span style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 20, fontWeight: 300,
          color: C.darkInk, lineHeight: 1.2,
        }}>Celestial Snapshot</span>
      </div>
      <div style={{
        fontFamily: "'Quicksand', sans-serif",
        fontSize: 12, fontWeight: 400,
        color: "#8a9098", marginBottom: 16,
      }}>Zion Canyon — right now</div>

      {/* 1. Conditions */}
      {weather && (
        <div style={{ borderBottom: `1px solid ${C.stone}`, padding: "14px 0" }}>
          <div style={LABEL}>CONDITIONS</div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
            <span style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 32, fontWeight: 300,
              color: C.darkInk, lineHeight: 1,
            }}>{weather.temp}°</span>
            <span style={VALUE}>{weather.condition}</span>
          </div>
          <div style={{ ...DETAIL, marginTop: 6 }}>
            H {weather.high}° / L {weather.low}° · Wind {weather.wind} mph
          </div>
        </div>
      )}

      {/* 2. Daylight */}
      {sun && (
        <div style={{ borderBottom: `1px solid ${C.stone}`, padding: "14px 0" }}>
          <div style={LABEL}>DAYLIGHT</div>
          <SunArc progress={sun.progress} />
          <div style={{ ...VALUE, fontSize: 13, textAlign: "center" }}>{sun.daylight}</div>
          <div style={{
            display: "flex", justifyContent: "space-between",
            marginTop: 8, padding: "8px 10px",
            background: `${C.goldenAmber}08`,
            border: `1px solid ${C.goldenAmber}18`,
          }}>
            <div style={{ textAlign: "left" }}>
              <div style={{ ...LABEL, fontSize: 9, marginBottom: 2 }}>SUNRISE</div>
              <div style={{ ...VALUE, fontSize: 14 }}>{sun.rise}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ ...LABEL, fontSize: 9, marginBottom: 2 }}>SUNSET</div>
              <div style={{ ...VALUE, fontSize: 14 }}>{sun.set}</div>
            </div>
          </div>
        </div>
      )}

      {/* 3. Moon */}
      {moon && (
        <div style={{ borderBottom: `1px solid ${C.stone}`, padding: "14px 0" }}>
          <div style={LABEL}>MOON</div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <MoonDisc illumination={moon.phase} phaseName={moon.name} />
            <div>
              <div style={VALUE}>{moon.name}</div>
              <div style={DETAIL}>{moon.phase}% illuminated</div>
            </div>
          </div>
        </div>
      )}

      {/* 4. Tonight's Sky */}
      {sky && (
        <div style={{ borderBottom: `1px solid ${C.stone}`, padding: "14px 0" }}>
          <div style={LABEL}>{"TONIGHT'S SKY"}</div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ ...VALUE, color: C.goldenAmber }}>{sky.label}</span>
            <QualityDots rating={sky.quality} />
          </div>
          <div style={{ ...DETAIL, marginTop: 6 }}>
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
        <div style={{ borderBottom: `1px solid ${C.stone}`, padding: "14px 0" }}>
          <div style={LABEL}>VIRGIN RIVER</div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <RiverDot level={river.level} />
            <span style={VALUE}>{river.label}</span>
          </div>
          <div style={{ ...DETAIL, marginTop: 6 }}>
            {river.cfs} cfs · Water temp {river.tempF}°F
          </div>
        </div>
      )}

      {/* 6. Next Celestial Event */}
      {nextEvent && (
        <div style={{ borderBottom: `1px solid ${C.stone}`, padding: "14px 0" }}>
          <div style={LABEL}>NEXT CELESTIAL EVENT</div>
          <div style={VALUE}>{nextEvent.name}</div>
          <div style={{ ...DETAIL, marginTop: 4 }}>
            {nextEvent.date} · {nextEvent.daysAway} day{nextEvent.daysAway !== 1 ? "s" : ""} away
          </div>
          <div style={{ ...DETAIL, marginTop: 4, fontStyle: "normal" }}>{nextEvent.detail}</div>
        </div>
      )}

      {/* Collapse button */}
      <button
        onClick={onCollapse}
        style={{
          background: "none", border: "none", padding: 0, cursor: "pointer",
          fontFamily: "'Quicksand', sans-serif",
          fontSize: 11, fontWeight: 700,
          letterSpacing: "0.14em", textTransform: "uppercase",
          color: C.oceanTeal, marginTop: 14,
        }}
      >Show less ▲</button>

      {/* NPS Alerts */}
      {alerts && alerts.length > 0 && (
        <div style={{
          padding: "10px 12px", marginTop: 14,
          background: `${C.sunSalmon}10`,
          border: `1px solid ${C.sunSalmon}25`,
        }}>
          {alerts.map((alert, i) => (
            <div key={i} style={{
              display: "flex", gap: 8, alignItems: "flex-start",
              marginBottom: i < alerts.length - 1 ? 8 : 0,
            }}>
              <span style={{
                width: 5, height: 5, borderRadius: "50%",
                background: C.sunSalmon, marginTop: 4, flexShrink: 0,
              }} />
              <span style={{ ...DETAIL, fontSize: 12, color: "#5a6a78" }}>{alert}</span>
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
    <div style={{
      width: "100%",
      padding: "20px 22px",
      background: C.warmWhite,
      border: `1px solid ${C.stone}`,
    }}>
      {/* Header skeleton */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: C.stone, opacity: 0.4 }} />
        <div style={{ width: 140, height: 14, background: C.stone, opacity: 0.3 }} />
      </div>
      <div style={{ width: 120, height: 8, background: C.stone, opacity: 0.25, marginBottom: 16 }} />
      {/* Grid skeleton */}
      <div style={{ display: "flex", gap: 0, marginBottom: 14 }}>
        {[1, 2, 3, 4].map(i => (
          <div key={i} style={{
            flex: "1 1 auto", display: "flex", alignItems: "center", justifyContent: "center",
            padding: "8px 0",
            borderRight: i < 4 ? `1px solid ${C.stone}` : "none",
          }}>
            <div style={{ width: 24, height: 16, background: C.stone, opacity: 0.2 }} />
          </div>
        ))}
      </div>
      {/* Button skeleton */}
      <div style={{ width: 100, height: 8, background: C.stone, opacity: 0.2 }} />
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

  // Inject pulse animation
  useEffect(() => {
    if (document.getElementById("celestial-pulse-style")) return;
    const style = document.createElement("style");
    style.id = "celestial-pulse-style";
    style.textContent = `
      @keyframes celestialPulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.4; }
      }
    `;
    document.head.appendChild(style);
    return () => { style.remove(); };
  }, []);

  if (loading) return <CardSkeleton />;
  if (!data) return null;

  return (
    <div style={{
      width: "100%",
      padding: "20px 22px",
      background: C.warmWhite,
      border: `1px solid ${C.stone}`,
    }}>
      {expanded
        ? <ExpandedView data={data} onCollapse={() => setExpanded(false)} />
        : <CollapsedView data={data} onExpand={() => setExpanded(true)} />
      }
    </div>
  );
}
