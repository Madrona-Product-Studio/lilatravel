import React, { useState, useEffect } from 'react';
import { C, FONTS } from '@data/brand';
import useNightSky from '../../hooks/useNightSky';

// ─── Colors ──────────────────────────────────────────────────────────────────
const DARK = '#1a1a18';
const LINEN = '#E8E0D5';
const TEAL = '#7BAAB0';
const AMBER = '#C9A06A';
const WARM = '#C9856A';
const LABEL = '#999';
const DIVIDER = '#ccc5bc';

// ─── Moon SVG ────────────────────────────────────────────────────────────────
function MoonSVG({ age, illumination }) {
  const r = 34, cx = 40, cy = 40;
  const waxing = age < 14.77;
  const illum = illumination / 100;
  const k = 2 * illum - 1;
  const rx = Math.max(0.5, Math.abs(k) * r);
  const d = `M ${cx} ${cy - r} A ${r} ${r} 0 0 ${waxing ? 1 : 0} ${cx} ${cy + r} A ${rx} ${r} 0 0 ${k >= 0 ? (waxing ? 0 : 1) : (waxing ? 1 : 0)} ${cx} ${cy - r} Z`;
  return (
    <svg viewBox="0 0 80 80" style={{ width: 80, height: 80 }}>
      <circle cx={cx} cy={cy} r={r} fill="#2a2a28" />
      <path d={d} fill="#E8E0D5" opacity={0.9} />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#444" strokeWidth={0.5} />
    </svg>
  );
}

// ─── Pulsing Dot Keyframes (injected once) ───────────────────────────────────
const PULSE_ID = 'nightsky-pulse-style';
function ensurePulseStyle() {
  if (typeof document === 'undefined') return;
  if (document.getElementById(PULSE_ID)) return;
  const style = document.createElement('style');
  style.id = PULSE_ID;
  style.textContent = `@keyframes nightsky-pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }`;
  document.head.appendChild(style);
}

// ─── Component ───────────────────────────────────────────────────────────────
export default function NightSkyWidget() {
  const sky = useNightSky();
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    ensurePulseStyle();
    const check = () => setMobile(window.innerWidth < 640);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const dash = '\u2014';
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

  // Shorthand accessors with loading fallback
  const mp = sky.moonPhase;
  const planets = sky.planets || [];
  const mw = sky.milkyWay;
  const nn = sky.nextNewMoon;
  const rating = sky.stargazingRating;
  const showers = sky.showers;

  return (
    <div style={{ background: '#F0EBE3', padding: '32px 28px 40px', maxWidth: 680 }}>

      {/* Section label */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
        <span style={{ fontFamily: FONTS.body, fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: LABEL, whiteSpace: 'nowrap' }}>
          Night Sky
        </span>
        <div style={{ flex: 1, height: 1, background: DIVIDER }} />
      </div>

      {/* Title */}
      <h2 style={{ fontFamily: FONTS.serif, fontSize: 32, fontWeight: 400, color: DARK, margin: '0 0 6px', lineHeight: 1.15 }}>
        Tonight Over Zion
      </h2>

      {/* Live badge */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 24 }}>
        <span style={{
          width: 7, height: 7, borderRadius: '50%', background: TEAL, display: 'inline-block',
          animation: 'nightsky-pulse 2s ease-in-out infinite',
        }} />
        <span style={{ fontFamily: FONTS.body, fontSize: 11, color: TEAL, fontWeight: 500, letterSpacing: '0.04em' }}>
          LIVE
        </span>
      </div>

      {/* Top grid */}
      <div style={{ display: 'grid', gridTemplateColumns: mobile ? '1fr' : '1fr 1fr', gap: 16, marginBottom: 16 }}>

        {/* Moon card */}
        <div style={{ background: DARK, padding: '24px 20px', display: 'flex', alignItems: 'center', gap: 18 }}>
          <div style={{ flexShrink: 0 }}>
            {mp?.svgUrl ? (
              <img src={mp.svgUrl} alt="Moon phase" style={{ width: 80, height: 80 }} />
            ) : mp ? (
              <MoonSVG age={mp.age} illumination={mp.illumination} />
            ) : (
              <div style={{ width: 80, height: 80, background: '#2a2a28', borderRadius: '50%' }} />
            )}
          </div>
          <div>
            <div style={{ fontFamily: FONTS.serif, fontSize: 22, color: LINEN, lineHeight: 1.2, marginBottom: 4 }}>
              {mp ? mp.name : dash}
            </div>
            <div style={{ fontFamily: FONTS.body, fontSize: 13, color: LABEL }}>
              {mp ? `${mp.illumination}% illuminated` : dash}
            </div>
          </div>
        </div>

        {/* Conditions card */}
        <div style={{ background: LINEN, padding: '20px 20px' }}>
          <div style={{ marginBottom: 10 }}>
            <div style={{ fontFamily: FONTS.body, fontSize: 10, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: LABEL, marginBottom: 3 }}>Stargazing</div>
            <div style={{
              fontFamily: FONTS.serif, fontSize: 20, fontWeight: 400,
              color: rating?.quality === 'good' ? TEAL : rating?.quality === 'warn' ? WARM : DARK,
            }}>
              {rating ? rating.label : dash}
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 16px' }}>
            <div>
              <div style={{ fontFamily: FONTS.body, fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: LABEL, marginBottom: 2 }}>MW Core</div>
              <div style={{ fontFamily: FONTS.body, fontSize: 13, color: DARK }}>{mw ? mw.status : dash}</div>
            </div>
            <div>
              <div style={{ fontFamily: FONTS.body, fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: LABEL, marginBottom: 2 }}>Moonrise</div>
              <div style={{ fontFamily: FONTS.body, fontSize: 13, color: DARK }}>{sky.moonrise || dash}</div>
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <div style={{ fontFamily: FONTS.body, fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: LABEL, marginBottom: 2 }}>Best Window</div>
              <div style={{ fontFamily: FONTS.body, fontSize: 13, color: DARK }}>{sky.bestWindow || dash}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Planets */}
      <div style={{ background: LINEN, padding: '20px 20px', marginBottom: 16 }}>
        <div style={{ fontFamily: FONTS.body, fontSize: 10, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: LABEL, marginBottom: 14 }}>
          Planets Tonight
        </div>
        {planets.length === 0 ? (
          <div style={{ fontFamily: FONTS.body, fontSize: 13, color: LABEL }}>{dash}</div>
        ) : planets.map((p, i) => (
          <div key={p.name} style={{
            display: 'grid', gridTemplateColumns: '70px 1fr 50px 36px auto', alignItems: 'center', gap: 10,
            padding: '7px 0',
            borderTop: i > 0 ? `1px solid ${DIVIDER}` : 'none',
          }}>
            <span style={{ fontFamily: FONTS.body, fontSize: 13, fontWeight: 600, color: DARK }}>{p.name}</span>
            <div style={{ height: 4, background: '#ddd7ce', position: 'relative' }}>
              <div style={{
                position: 'absolute', left: 0, top: 0, height: '100%',
                width: `${Math.max(0, Math.min(100, ((p.altitude + 10) / 100) * 100))}%`,
                background: p.bright ? AMBER : TEAL,
              }} />
            </div>
            <span style={{ fontFamily: FONTS.body, fontSize: 12, color: DARK, textAlign: 'right' }}>{p.altitude}&deg;</span>
            <span style={{ fontFamily: FONTS.body, fontSize: 11, color: LABEL, textAlign: 'center' }}>{p.direction}</span>
            <span style={{
              fontFamily: FONTS.body, fontSize: 10, fontWeight: 600, letterSpacing: '0.04em',
              color: p.visible ? (p.bright ? AMBER : TEAL) : LABEL,
            }}>
              {p.visible ? (p.bright ? 'BRIGHT' : 'VISIBLE') : 'SET'}
            </span>
          </div>
        ))}
      </div>

      {/* Milky Way block */}
      <div style={{ background: DARK, padding: '22px 20px', marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: FONTS.body, fontSize: 10, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: LABEL, marginBottom: 6 }}>
            Milky Way Core
          </div>
          <div style={{ fontFamily: FONTS.serif, fontSize: 22, color: LINEN, marginBottom: 4 }}>
            {mw ? mw.status : dash}
          </div>
          <div style={{ fontFamily: FONTS.body, fontSize: 12, color: LABEL, lineHeight: 1.5, maxWidth: 360 }}>
            {mw ? mw.note : dash}
          </div>
        </div>
        <div style={{ textAlign: 'right', flexShrink: 0, paddingLeft: 16 }}>
          <div style={{ fontFamily: FONTS.serif, fontSize: 36, color: LINEN, lineHeight: 1 }}>
            {mw ? mw.score : dash}
          </div>
          <div style={{ fontFamily: FONTS.body, fontSize: 11, color: LABEL }}>/10</div>
        </div>
      </div>

      {/* Next new moon */}
      <div style={{ background: LINEN, padding: '16px 20px', marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontFamily: FONTS.body, fontSize: 10, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: LABEL, marginBottom: 3 }}>
            Next New Moon
          </div>
          <div style={{ fontFamily: FONTS.body, fontSize: 14, color: DARK }}>
            {nn ? nn.date : dash}
          </div>
        </div>
        <div style={{ fontFamily: FONTS.serif, fontSize: 24, color: DARK }}>
          {nn ? `${nn.daysAway}d` : dash}
        </div>
      </div>

      {/* Meteor shower */}
      {showers?.next && (
        <div style={{ background: LINEN, padding: '16px 20px', marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontFamily: FONTS.body, fontSize: 10, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: LABEL, marginBottom: 3 }}>
              {showers.active ? 'Active Shower' : 'Next Meteor Shower'}
            </div>
            <div style={{ fontFamily: FONTS.body, fontSize: 14, color: DARK, fontWeight: 600 }}>
              {showers.next.name}
            </div>
            <div style={{ fontFamily: FONTS.body, fontSize: 12, color: LABEL, marginTop: 2 }}>
              {showers.next.date} &middot; {showers.next.rate} &middot; {showers.next.note}
            </div>
          </div>
          <div style={{ fontFamily: FONTS.serif, fontSize: 24, color: showers.active ? AMBER : DARK, flexShrink: 0, paddingLeft: 16 }}>
            {showers.active ? 'NOW' : `${showers.next.daysAway}d`}
          </div>
        </div>
      )}

      {/* Bortle comparison */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 20 }}>
        {[
          { name: 'Zion', bortle: 3, label: 'Class 3' },
          { name: 'Bryce Canyon', bortle: 2, label: 'Class 2' },
          { name: 'Capitol Reef', bortle: 2, label: 'Class 2' },
        ].map(site => (
          <div key={site.name} style={{ background: DARK, padding: '16px 14px', textAlign: 'center' }}>
            <div style={{ fontFamily: FONTS.serif, fontSize: 28, color: LINEN, lineHeight: 1, marginBottom: 4 }}>
              {site.bortle}
            </div>
            <div style={{ fontFamily: FONTS.body, fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: LABEL, marginBottom: 2 }}>
              {site.label}
            </div>
            <div style={{ fontFamily: FONTS.body, fontSize: 11, color: TEAL }}>
              {site.name}
            </div>
          </div>
        ))}
      </div>

      {/* Date line */}
      <div style={{ fontFamily: FONTS.body, fontSize: 11, color: LABEL, textAlign: 'center' }}>
        {today}
      </div>
    </div>
  );
}
