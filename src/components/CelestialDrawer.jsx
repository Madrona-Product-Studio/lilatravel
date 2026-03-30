import { useState, useEffect, useRef } from 'react';
import { C } from '@data/brand';
import { getCelestialSnapshot } from '@services/celestialService';

const EYEBROW = "font-body text-[10px] font-bold tracking-[0.2em] uppercase text-[#6B8078] mb-2.5";
const SECTION_BORDER = "border-b border-stone py-3";
const SUB = "font-body text-xs font-normal text-dark-ink/65 leading-[1.65]";

const DESTINATION_LABELS = {
  'zion': 'Zion',
  'big-sur': 'Big Sur',
  'joshua-tree': 'Joshua Tree',
  'olympic-peninsula': 'Olympic Peninsula',
  'vancouver-island': 'Vancouver Island',
  'kauai': 'Kaua\u02BBi',
};

// Map destination slugs to celestialConfig keys
const CONFIG_KEYS = {
  'zion': 'zion',
  'big-sur': 'big-sur',
  'joshua-tree': 'joshuaTree',
  'olympic-peninsula': 'olympic-peninsula',
  'vancouver-island': 'vancouver',
  'kauai': 'kauai',
};

const COASTAL_DESTINATIONS = ['big-sur', 'kauai', 'olympic-peninsula', 'vancouver-island'];

const OCEAN_BY_MONTH = {
  january: {
    swell: { name: 'Peak NW Swell', range: '6\u201312 ft', intensity: 5, note: 'Largest swells of the year. Powerful and consistent. Experienced surfers only.' },
    tides: { name: 'King Tides', high: '5.9 ft', low: '\u22120.9 ft', note: 'Extreme tidal swings. Minus tides in the afternoon expose hidden tide pools and sea caves.' },
  },
  february: {
    swell: { name: 'Strong NW Swell', range: '5\u201310 ft', intensity: 4, note: 'Still powerful NW energy. Occasional windows of clean surf between systems.' },
    tides: { name: 'Spring Tides', high: '5.7 ft', low: '\u22120.6 ft', note: 'Large range continues. Minus tides shift toward morning \u2014 good for early tide pool walks.' },
  },
  march: {
    swell: { name: 'NW Swell Fading', range: '4\u20138 ft', intensity: 3, note: 'Winter swell season winding down. More consistent windows of cleaner conditions.' },
    tides: { name: 'Morning Minus Tides', high: '5.4 ft', low: '\u22120.4 ft', note: 'Best morning tide pool access of the year. Lows fall early \u2014 arrive at dawn.' },
  },
  april: {
    swell: { name: 'Mixed Swell', range: '3\u20136 ft', intensity: 3, note: 'Transition month. NW and S swells mix. Calmer mornings, wind picks up by afternoon.' },
    tides: { name: 'Minus Tides at Dawn', high: '5.2 ft', low: '\u22120.3 ft', note: 'Excellent early morning low tide access. Hidden pools and rocky reefs exposed at sunrise.' },
  },
  may: {
    swell: { name: 'Spring Calm', range: '2\u20135 ft', intensity: 2, note: 'Ocean settles. Light S swells. Good for kayaking, paddling, and beginner surfing.' },
    tides: { name: 'Minus Tides at Dawn', high: '5.0 ft', low: '\u22120.2 ft', note: 'Low tides fall at first light. Calm seas make coastal exploration easy.' },
  },
  june: {
    swell: { name: 'Summer Calm', range: '1\u20133 ft', intensity: 1, note: 'Gentlest ocean of the year. Ideal for beginners, snorkeling, and flat-water paddling.' },
    tides: { name: 'Moderate Range', high: '4.5 ft', low: '0.1 ft', note: 'Predictable rhythm. Morning lows make for easy tide pool access before crowds arrive.' },
  },
  july: {
    swell: { name: 'Summer Calm', range: '1\u20133 ft', intensity: 1, note: 'Consistent light S swell. Warm water. Best month for calm ocean activities.' },
    tides: { name: 'Moderate Range', high: '4.6 ft', low: '0.2 ft', note: 'Stable, predictable tides. High tide in the morning, low in the afternoon.' },
  },
  august: {
    swell: { name: 'S Swell Season', range: '2\u20135 ft', intensity: 2, note: 'Southern hemisphere storms send occasional long-period swells. Fun for all levels.' },
    tides: { name: 'Moderate Range', high: '4.8 ft', low: '0.0 ft', note: 'Range building through the month. Afternoon lows best for beach exploration.' },
  },
  september: {
    swell: { name: 'Swell Building', range: '3\u20136 ft', intensity: 3, note: 'NW swell season begins. First powerful sets of autumn. Mornings tend to be cleanest.' },
    tides: { name: 'Tides Building', high: '5.1 ft', low: '\u22120.3 ft', note: 'Range increasing. Minus tides return to late afternoon. Coastal access improves.' },
  },
  october: {
    swell: { name: 'NW Swell Arrives', range: '4\u20138 ft', intensity: 3, note: 'Autumn swells arrive with force. Consistent NW energy. Best for intermediate to advanced surfers.' },
    tides: { name: 'Tides Strengthening', high: '5.4 ft', low: '\u22120.6 ft', note: 'Strong tidal swings return. Low tides at dusk begin to expose rocky reefs and tide pools.' },
  },
  november: {
    swell: { name: 'NW Swell Season', range: '4\u20138 ft', intensity: 3, note: 'Powerful NW sets. First serious swell month. Experienced surfers. Cleanest in the morning.' },
    tides: { name: 'King Tides', high: '5.8 ft', low: '\u22120.8 ft', note: 'Largest swings of the year begin. Minus tides at dusk expose hidden tide pools and sea caves.' },
  },
  december: {
    swell: { name: 'Peak NW Swell', range: '6\u201312 ft', intensity: 5, note: 'Biggest swells of the year. Powerful and unpredictable. Experienced surfers only.' },
    tides: { name: 'King Tides', high: '6.0 ft', low: '\u22121.0 ft', note: 'Extreme tidal range. Dramatic high tides flood beaches. Extraordinary minus tides at low.' },
  },
};

function SwellIntensityBar({ intensity }) {
  return (
    <div className="flex gap-[3px] mb-1">
      {[1,2,3,4,5].map(i => (
        <div key={i} className="h-[7px] flex-1 rounded-sm" style={{
          background: i <= intensity
            ? `rgba(122,174,200,${0.4 + (i / intensity) * 0.5})`
            : 'rgba(122,174,200,0.12)',
        }} />
      ))}
    </div>
  );
}

export default function CelestialDrawer({ destination, isMobile, breathValueRef }) {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const contentRef = useRef(null);
  const [contentHeight, setContentHeight] = useState(0);
  const pipRef = useRef(null);

  const configKey = CONFIG_KEYS[destination] || destination;
  const label = DESTINATION_LABELS[destination] || destination;
  const isCoastal = COASTAL_DESTINATIONS.includes(destination);

  const currentMonth = new Date().toLocaleString('default', { month: 'long' }).toLowerCase();
  const oceanData = isCoastal ? (OCEAN_BY_MONTH[currentMonth] ?? OCEAN_BY_MONTH['september']) : null;

  useEffect(() => {
    getCelestialSnapshot(configKey)
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [configKey]);

  useEffect(() => {
    if (contentRef.current) setContentHeight(contentRef.current.scrollHeight);
  }, [data, open, isMobile]);

  useEffect(() => {
    if (!breathValueRef) return;
    let raf;
    const tick = () => {
      const v = breathValueRef.current;
      if (pipRef.current) {
        pipRef.current.style.transform = `scale(${0.75 + v * 0.25})`;
        pipRef.current.style.opacity = 0.5 + v * 0.5;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [breathValueRef]);

  const NAV_HEIGHT = isMobile ? 58 : 64;

  if (loading || !data) return (
    <div className="relative border-b border-stone" style={{ background: breathValueRef ? 'transparent' : C.stone }}>
      <div style={{ height: NAV_HEIGHT + 14 }} />
      <div className="h-11" />
    </div>
  );

  const { weather, sun, moon, sky, river, nextEvent, npsAlerts = [] } = data;
  const riverColors = { low: C.seaGlass, moderate: C.skyBlue, high: C.goldenAmber, dangerous: C.sunSalmon };

  const teasers = [];
  if (weather) teasers.push(`${weather.temp}\u00B0 ${weather.condition}`);
  if (sun) teasers.push(`${sun.rise} \u2013 ${sun.set}`);
  if (moon) teasers.push(moon.name);
  if (sky) teasers.push(`Sky: ${sky.label}`);
  if (npsAlerts?.length > 0) teasers.push(`${npsAlerts.length} Alert${npsAlerts.length > 1 ? 's' : ''}`);

  return (
    <div className="relative border-b border-stone" style={{ zIndex: open ? 95 : 'auto', background: breathValueRef ? 'transparent' : C.stone }}>
      <div style={{ height: NAV_HEIGHT + 14 }} />

      {/* Teaser bar */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full border-none cursor-pointer bg-transparent flex items-center justify-center gap-2 transition-colors duration-200 hover:bg-black/[0.045]"
        style={{ padding: isMobile ? '14px 20px' : '14px 52px' }}
      >
        <span
          ref={pipRef}
          className={`w-[5px] h-[5px] rounded-full bg-sea-glass shrink-0 ${breathValueRef ? 'will-change-[transform,opacity]' : 'animate-celestial-pulse'}`}
        />
        <span className="font-body text-[11px] font-bold tracking-[0.18em] uppercase text-[#5c6358] shrink-0">
          {label} Right Now
        </span>
        {!isMobile && teasers.length > 0 && (
          <span className="font-body text-[11px] font-semibold text-[#6b6359] tracking-[0.04em]">
            — {teasers.map((t, i) => (
              <span key={i}>
                {i > 0 && <span className="mx-2.5 opacity-55 font-light">|</span>}
                {t}
              </span>
            ))}
          </span>
        )}
        {isMobile && weather && (
          <span className="font-body text-[11px] font-semibold text-[#6b6359] tracking-[0.04em]">
            · {weather.temp}° · {moon?.name}
          </span>
        )}
        <span className="text-sm text-[#6b6359] transition-all duration-300 ml-1.5 shrink-0 inline-block leading-none">
          {open ? '\u2715' : '\u25BE'}
        </span>
      </button>

      {/* Expanded content */}
      <div
        className="relative z-[95] overflow-hidden transition-[max-height] duration-500 ease-in-out"
        style={{ maxHeight: open ? contentHeight : 0, background: breathValueRef ? C.warmWhite : C.stone }}
      >
        <div ref={contentRef} className="max-w-[920px] mx-auto" style={{ padding: isMobile ? '16px 20px 24px' : '20px 52px 32px' }}>

          {/* 1. Temperature + Sunlight */}
          {(weather || sun) && (
            <div className={`${SECTION_BORDER} grid grid-cols-[1fr_1px_1fr] gap-x-5`}>
              {weather ? (
                <div>
                  <div className={EYEBROW}>Temperature</div>
                  <div className="h-[3px] rounded-sm mb-1.5" style={{ background: 'linear-gradient(to right, #7aaec8, #D4A853, #E8856A)' }} />
                  <div className="flex justify-between items-end">
                    <div>
                      <div className="font-serif text-[22px] font-normal text-[#7aaec8] leading-none">{weather.low}°</div>
                      <div className="font-body text-[10px] text-dark-ink/65 mt-px">low</div>
                    </div>
                    <div className="font-body text-[10px] text-dark-ink/65">today</div>
                    <div className="text-right">
                      <div className="font-serif text-[22px] font-normal text-[#E8856A] leading-none">{weather.high}°</div>
                      <div className="font-body text-[10px] text-dark-ink/65 mt-px">high</div>
                    </div>
                  </div>
                </div>
              ) : <div />}
              <div className="w-px bg-stone mt-[18px] self-stretch" />
              {sun ? (
                <div>
                  <div className={EYEBROW}>Sunlight</div>
                  <svg width="100%" height="28" viewBox="0 0 140 28" fill="none" className="block mb-1">
                    <path d="M10 24 Q70 3 130 24" stroke="rgba(212,168,83,0.15)" strokeWidth="1" strokeLinecap="round" fill="none"/>
                    <path d="M10 24 Q70 3 130 24" stroke="rgba(212,168,83,0.65)" strokeWidth="1.8" strokeLinecap="round" fill="none"/>
                    <circle cx="10" cy="24" r="3" fill="rgba(212,168,83,0.9)"/>
                    <circle cx="130" cy="24" r="3" fill="rgba(212,168,83,0.45)"/>
                    <circle cx="70" cy="3" r="2" fill="rgba(212,168,83,0.35)"/>
                  </svg>
                  <div className="flex justify-between items-end">
                    <div>
                      <div className="font-body text-xs font-semibold text-dark-ink leading-none">{sun.rise}</div>
                      <div className="font-body text-[10px] text-dark-ink/65 mt-px">sunrise</div>
                    </div>
                    <div className="font-body text-[10px] text-dark-ink/65">{sun.daylight}</div>
                    <div className="text-right">
                      <div className="font-body text-xs font-semibold text-dark-ink leading-none">{sun.set}</div>
                      <div className="font-body text-[10px] text-dark-ink/65 mt-px">sunset</div>
                    </div>
                  </div>
                </div>
              ) : <div />}
            </div>
          )}

          {/* 2. Moon + Stars */}
          {(moon || sky) && (
            <div className={`${SECTION_BORDER} grid grid-cols-[1fr_1px_1fr] gap-x-5`}>
              {moon ? (
                <div>
                  <div className={EYEBROW}>Moon</div>
                  <div className="flex items-center gap-2 mb-[5px]">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="9"
                        fill={moon.phase > 50 ? 'rgba(212,168,83,0.35)' : 'rgba(26,37,48,0.12)'}
                        stroke={moon.phase > 50 ? 'rgba(212,168,83,0.5)' : 'rgba(26,37,48,0.2)'}
                        strokeWidth="1.2"/>
                    </svg>
                    <span className="font-serif text-xl font-normal text-dark-ink leading-[1.2]">{moon.name}</span>
                  </div>
                  <div className={`${SUB} pl-[22px]`}>{moon.phase}% illuminated</div>
                </div>
              ) : <div />}
              <div className="w-px bg-stone mt-[18px] self-stretch" />
              {sky ? (
                <div>
                  <div className={EYEBROW}>Tonight's Sky</div>
                  <div className="font-serif text-xl font-normal text-sea-glass leading-[1.2] mb-[5px]">{sky.label}</div>
                  <div className={SUB}>
                    Bortle {sky.bortle}
                    {sky.milkyWayVisible && sky.milkyWayWindow && <> · MW {sky.milkyWayWindow}</>}
                  </div>
                  {nextEvent && (
                    <div className="mt-2">
                      <div className="font-body text-[11px] text-dark-ink/65">{nextEvent.name} · {nextEvent.date} · {nextEvent.daysAway}d away</div>
                    </div>
                  )}
                </div>
              ) : <div />}
            </div>
          )}

          {/* 3. Ocean (coastal only) */}
          {isCoastal && oceanData && (
            <div className={SECTION_BORDER}>
              <div className="grid grid-cols-[1fr_1px_1fr] gap-x-5 items-start">
                <div>
                  <div className={EYEBROW}>Swell</div>
                  <div className="font-serif text-xl font-normal text-dark-ink leading-[1.2] mb-[5px]">{oceanData.swell.name}</div>
                  <SwellIntensityBar intensity={oceanData.swell.intensity} />
                  <div className="font-body text-[11px] text-dark-ink/65 mb-1.5">{oceanData.swell.range} typical</div>
                  <div className="h-px bg-black/5 mb-1.5" />
                  <div className="font-body text-xs text-dark-ink/65 leading-[1.65]">{oceanData.swell.note}</div>
                </div>
                <div className="w-px bg-stone mt-[18px] self-stretch" />
                <div>
                  <div className={EYEBROW}>Tides</div>
                  <div className="font-serif text-xl font-normal text-dark-ink leading-[1.2] mb-[5px]">{oceanData.tides.name}</div>
                  <div className="relative h-[7px] rounded bg-[rgba(122,174,200,0.12)] mb-1">
                    <div className="absolute left-0 top-0 h-[7px] rounded" style={{
                      width: `${Math.min(95, Math.max(30, (parseFloat(oceanData.tides.high) / 7) * 100))}%`,
                      background: 'linear-gradient(to right, rgba(122,174,200,0.25), rgba(122,174,200,0.65))',
                    }} />
                  </div>
                  <div className="flex justify-between mb-1.5">
                    <div className="font-body text-[10px] text-[rgba(122,174,200,0.7)]">{oceanData.tides.low}</div>
                    <div className="font-body text-[10px] font-semibold text-[#7aaec8]">{oceanData.tides.high}</div>
                  </div>
                  <div className="h-px bg-black/5 mb-1.5" />
                  <div className="font-body text-xs text-dark-ink/65 leading-[1.65]">{oceanData.tides.note}</div>
                </div>
              </div>
            </div>
          )}

          {/* 4. River (Zion only) */}
          {river && (
            <div className={SECTION_BORDER}>
              <div className={EYEBROW}>Virgin River</div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-[7px] h-[7px] rounded-full" style={{ background: riverColors[river.level] || C.stone }} />
                <span className="font-body text-sm font-semibold text-dark-ink leading-[1.3]">{river.label}</span>
              </div>
              <div className={SUB}>{river.cfs} cfs · {river.tempF}°F water</div>
            </div>
          )}

          {/* 5. NPS Alerts */}
          {npsAlerts.length > 0 && (
            <div className={SECTION_BORDER}>
              <div className={`${EYEBROW} !text-sun-salmon`}>Active Alerts</div>
              <div className="flex flex-col gap-2">
                {npsAlerts.map((alert, i) => (
                  <div key={i} className="flex gap-2.5 items-start">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#E8856A] shrink-0 mt-[5px]" />
                    <div>
                      <div className="font-body text-[13px] font-bold text-dark-ink mb-[3px]">{alert.title}</div>
                      {alert.description && <div className="font-body text-xs font-normal text-dark-ink/65 leading-[1.6]">{alert.description}</div>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
