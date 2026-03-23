import { useState, useEffect, useRef } from 'react';
import { C } from '@data/brand';
import { getCelestialSnapshot } from '@services/celestialService';

const F = "'Quicksand', sans-serif";
const F_SERIF = "'Cormorant Garamond', serif";
const EYEBROW = { fontFamily: F, fontSize: 9, fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(107,122,114,0.55)', marginBottom: 8 };
const SECTION_BORDER = { borderBottom: `1px solid ${C.stone}`, padding: '14px 0 13px' };
const SUB = { fontFamily: F, fontSize: 11, fontWeight: 400, color: '#8a9098', lineHeight: 1.55 };

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
    <div style={{ display: 'flex', gap: 3, marginBottom: 4 }}>
      {[1,2,3,4,5].map(i => (
        <div key={i} style={{
          height: 7, flex: 1, borderRadius: 1,
          background: i <= intensity
            ? `rgba(122,174,200,${0.4 + (i / intensity) * 0.5})`
            : 'rgba(122,174,200,0.12)',
        }} />
      ))}
    </div>
  );
}

export default function CelestialDrawer({ destination, isMobile }) {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const contentRef = useRef(null);
  const [contentHeight, setContentHeight] = useState(0);

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
    if (document.getElementById('celestial-pulse-style')) return;
    const style = document.createElement('style');
    style.id = 'celestial-pulse-style';
    style.textContent = '@keyframes celestialPulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }';
    document.head.appendChild(style);
    return () => { style.remove(); };
  }, []);

  const NAV_HEIGHT = isMobile ? 58 : 64;

  if (loading || !data) return (
    <div style={{ position: 'relative', background: C.stone, borderBottom: `1px solid ${C.stone}` }}>
      <div style={{ height: NAV_HEIGHT + 14 }} />
      <div style={{ height: 44 }} />
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
    <div style={{ position: 'relative', zIndex: open ? 95 : 'auto', background: C.stone, borderBottom: `1px solid ${C.stone}` }}>
      <div style={{ height: NAV_HEIGHT + 14 }} />

      {/* Teaser bar */}
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: '100%', border: 'none', cursor: 'pointer', background: 'transparent',
          padding: isMobile ? '14px 20px' : '14px 52px',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          transition: 'background 0.2s',
        }}
        onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,0,0,0.045)'}
        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
      >
        <span style={{ width: 5, height: 5, borderRadius: '50%', background: C.seaGlass, animation: 'celestialPulse 2s ease-in-out infinite', flexShrink: 0 }} />
        <span style={{ fontFamily: F, fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#5c6358', flexShrink: 0 }}>
          {label} Right Now
        </span>
        {!isMobile && teasers.length > 0 && (
          <span style={{ fontFamily: F, fontSize: 11, fontWeight: 600, color: '#6b6359', letterSpacing: '0.04em' }}>
            — {teasers.map((t, i) => (
              <span key={i}>
                {i > 0 && <span style={{ margin: '0 10px', opacity: 0.55, fontWeight: 300 }}>|</span>}
                {t}
              </span>
            ))}
          </span>
        )}
        {isMobile && weather && (
          <span style={{ fontFamily: F, fontSize: 11, fontWeight: 600, color: '#6b6359', letterSpacing: '0.04em' }}>
            · {weather.temp}° · {moon?.name}
          </span>
        )}
        <span style={{ fontSize: 14, color: '#6b6359', transition: 'color 0.3s ease, transform 0.35s ease', marginLeft: 6, flexShrink: 0, display: 'inline-block', lineHeight: 1 }}>
          {open ? '\u2715' : '\u25BE'}
        </span>
      </button>

      {/* Expanded content */}
      <div style={{ position: 'relative', zIndex: 95, maxHeight: open ? contentHeight : 0, overflow: 'hidden', transition: 'max-height 0.5s ease', background: C.warmWhite }}>
        <div ref={contentRef} style={{ padding: isMobile ? '16px 20px 24px' : '20px 52px 32px', maxWidth: 920, margin: '0 auto' }}>

          {/* 1. Temperature + Sunlight */}
          {(weather || sun) && (
            <div style={{ ...SECTION_BORDER, display: 'grid', gridTemplateColumns: '1fr 1px 1fr', gap: '0 20px' }}>
              {weather ? (
                <div>
                  <div style={EYEBROW}>Temperature</div>
                  <div style={{ height: 3, borderRadius: 2, background: 'linear-gradient(to right, #7aaec8, #D4A853, #E8856A)', marginBottom: 6 }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <div>
                      <div style={{ fontFamily: F_SERIF, fontSize: 20, fontWeight: 300, color: '#7aaec8', lineHeight: 1 }}>{weather.low}°</div>
                      <div style={{ fontFamily: F, fontSize: 9, color: '#8a9098', marginTop: 1 }}>low</div>
                    </div>
                    <div style={{ fontFamily: F, fontSize: 9, color: 'rgba(26,37,48,0.3)' }}>today</div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontFamily: F_SERIF, fontSize: 20, fontWeight: 300, color: '#E8856A', lineHeight: 1 }}>{weather.high}°</div>
                      <div style={{ fontFamily: F, fontSize: 9, color: '#8a9098', marginTop: 1 }}>high</div>
                    </div>
                  </div>
                </div>
              ) : <div />}
              <div style={{ width: 1, background: C.stone, marginTop: 18, alignSelf: 'stretch' }} />
              {sun ? (
                <div>
                  <div style={EYEBROW}>Sunlight</div>
                  <svg width="100%" height="28" viewBox="0 0 140 28" fill="none" style={{ display: 'block', marginBottom: 4 }}>
                    <path d="M10 24 Q70 3 130 24" stroke="rgba(212,168,83,0.12)" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
                    <path d="M10 24 Q70 3 130 24" stroke="rgba(212,168,83,0.5)" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
                    <circle cx="10" cy="24" r="2.5" fill="rgba(212,168,83,0.85)"/>
                    <circle cx="130" cy="24" r="2.5" fill="rgba(212,168,83,0.35)"/>
                    <circle cx="70" cy="3" r="1.8" fill="rgba(212,168,83,0.25)"/>
                  </svg>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <div>
                      <div style={{ fontFamily: F, fontSize: 12, fontWeight: 600, color: C.darkInk, lineHeight: 1 }}>{sun.rise}</div>
                      <div style={{ fontFamily: F, fontSize: 9, color: '#8a9098', marginTop: 1 }}>sunrise</div>
                    </div>
                    <div style={{ fontFamily: F, fontSize: 10, color: 'rgba(26,37,48,0.32)' }}>{sun.daylight}</div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontFamily: F, fontSize: 12, fontWeight: 600, color: 'rgba(26,37,48,0.5)', lineHeight: 1 }}>{sun.set}</div>
                      <div style={{ fontFamily: F, fontSize: 9, color: '#8a9098', marginTop: 1 }}>sunset</div>
                    </div>
                  </div>
                </div>
              ) : <div />}
            </div>
          )}

          {/* 2. Moon + Stars */}
          {(moon || sky) && (
            <div style={{ ...SECTION_BORDER, display: 'grid', gridTemplateColumns: '1fr 1px 1fr', gap: '0 20px' }}>
              {moon ? (
                <div>
                  <div style={EYEBROW}>Moon</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="9"
                        fill={moon.phase > 50 ? 'rgba(212,168,83,0.35)' : 'rgba(26,37,48,0.12)'}
                        stroke={moon.phase > 50 ? 'rgba(212,168,83,0.5)' : 'rgba(26,37,48,0.2)'}
                        strokeWidth="1.2"/>
                    </svg>
                    <span style={{ fontFamily: F_SERIF, fontSize: 16, fontWeight: 400, color: C.darkInk }}>{moon.name}</span>
                  </div>
                  <div style={{ ...SUB, paddingLeft: 22 }}>{moon.phase}% illuminated</div>
                </div>
              ) : <div />}
              <div style={{ width: 1, background: C.stone, marginTop: 18, alignSelf: 'stretch' }} />
              {sky ? (
                <div>
                  <div style={EYEBROW}>Tonight's Sky</div>
                  <div style={{ fontFamily: F_SERIF, fontSize: 16, fontWeight: 400, color: C.seaGlass, marginBottom: 4 }}>{sky.label}</div>
                  <div style={SUB}>
                    Bortle {sky.bortle}
                    {sky.milkyWayVisible && sky.milkyWayWindow && <> · MW {sky.milkyWayWindow}</>}
                  </div>
                  {nextEvent && (
                    <div style={{ marginTop: 8 }}>
                      <div style={{ fontFamily: F, fontSize: 9, color: '#8a9098' }}>{nextEvent.name} · {nextEvent.date} · {nextEvent.daysAway}d away</div>
                    </div>
                  )}
                </div>
              ) : <div />}
            </div>
          )}

          {/* 3. Ocean (coastal only) */}
          {isCoastal && oceanData && (
            <div style={SECTION_BORDER}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1px 1fr', gap: '0 20px', alignItems: 'start' }}>
                <div>
                  <div style={EYEBROW}>Swell</div>
                  <div style={{ fontFamily: F_SERIF, fontSize: 15, fontWeight: 400, color: C.darkInk, marginBottom: 6 }}>{oceanData.swell.name}</div>
                  <SwellIntensityBar intensity={oceanData.swell.intensity} />
                  <div style={{ fontFamily: F, fontSize: 9, color: '#8a9098', marginBottom: 6 }}>{oceanData.swell.range} typical</div>
                  <div style={{ height: 1, background: 'rgba(28,28,26,0.05)', marginBottom: 6 }} />
                  <div style={{ fontFamily: F, fontSize: 11, color: '#8a9098', lineHeight: 1.6 }}>{oceanData.swell.note}</div>
                </div>
                <div style={{ width: 1, background: C.stone, marginTop: 18, alignSelf: 'stretch' }} />
                <div>
                  <div style={EYEBROW}>Tides</div>
                  <div style={{ fontFamily: F_SERIF, fontSize: 15, fontWeight: 400, color: C.darkInk, marginBottom: 6 }}>{oceanData.tides.name}</div>
                  <div style={{ position: 'relative', height: 7, borderRadius: 4, background: 'rgba(122,174,200,0.12)', marginBottom: 4 }}>
                    <div style={{
                      position: 'absolute', left: 0, top: 0, height: 7, borderRadius: 4,
                      width: `${Math.min(95, Math.max(30, (parseFloat(oceanData.tides.high) / 7) * 100))}%`,
                      background: 'linear-gradient(to right, rgba(122,174,200,0.25), rgba(122,174,200,0.65))',
                    }} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <div style={{ fontFamily: F, fontSize: 9, color: 'rgba(122,174,200,0.55)' }}>{oceanData.tides.low}</div>
                    <div style={{ fontFamily: F, fontSize: 9, fontWeight: 600, color: '#7aaec8' }}>{oceanData.tides.high}</div>
                  </div>
                  <div style={{ height: 1, background: 'rgba(28,28,26,0.05)', marginBottom: 6 }} />
                  <div style={{ fontFamily: F, fontSize: 11, color: '#8a9098', lineHeight: 1.6 }}>{oceanData.tides.note}</div>
                </div>
              </div>
            </div>
          )}

          {/* 4. River (Zion only) */}
          {river && (
            <div style={SECTION_BORDER}>
              <div style={EYEBROW}>Virgin River</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: riverColors[river.level] || C.stone }} />
                <span style={{ fontFamily: F, fontSize: 14, fontWeight: 600, color: C.darkInk, lineHeight: 1.3 }}>{river.label}</span>
              </div>
              <div style={SUB}>{river.cfs} cfs · {river.tempF}°F water</div>
            </div>
          )}

          {/* 5. NPS Alerts */}
          {npsAlerts.length > 0 && (
            <div style={SECTION_BORDER}>
              <div style={{ ...EYEBROW, color: 'rgba(232,133,106,0.7)' }}>Active Alerts</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {npsAlerts.map((alert, i) => (
                  <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#E8856A', opacity: 0.7, flexShrink: 0, marginTop: 5 }} />
                    <div>
                      <div style={{ fontFamily: F, fontSize: 12, fontWeight: 600, color: C.darkInk, marginBottom: 2 }}>{alert.title}</div>
                      {alert.description && <div style={SUB}>{alert.description}</div>}
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
