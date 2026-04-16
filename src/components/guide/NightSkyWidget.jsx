import { useState, useEffect } from 'react';
import { G, FONTS } from '@data/guides/guide-styles';
import useNightSky from '../../hooks/useNightSky';

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

export default function NightSkyWidget() {
  const sky = useNightSky();
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    const check = () => setMobile(window.innerWidth < 640);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const dash = '\u2014';
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

  const mp = sky.moonPhase;
  const planets = sky.planets || [];
  const mw = sky.milkyWay;
  const nn = sky.nextNewMoon;
  const rating = sky.stargazingRating;
  const showers = sky.showers;

  const label = { fontFamily: FONTS.body, fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: G.ink40, marginBottom: 4 };
  const val = { fontFamily: FONTS.body, fontSize: 15, fontWeight: 600, color: G.ink, lineHeight: 1.3 };
  const lightLabel = { ...label, color: 'rgba(232,224,213,0.4)' };

  return (
    <div style={{ margin: '28px 0 32px' }}>
      <style>{`@keyframes nightsky-pulse{0%,100%{opacity:1}50%{opacity:0.3}}`}</style>

      {/* Live badge */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 20 }}>
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: G.oceanTeal, animation: 'nightsky-pulse 2s ease-in-out infinite' }} />
        <span style={{ fontFamily: FONTS.body, fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: G.oceanTeal }}>
          Live Conditions
        </span>
      </div>

      {/* ── Moon + Conditions ── */}
      <div style={{ display: 'grid', gridTemplateColumns: mobile ? '1fr' : '1fr 1fr', gap: 2, marginBottom: 2 }}>

        {/* Moon */}
        <div style={{ background: G.darkInk, padding: 24, display: 'flex', alignItems: 'center', gap: 20 }}>
          <div style={{ flexShrink: 0 }}>
            {mp ? (
              <MoonSVG age={mp.age} illumination={mp.illumination} />
            ) : (
              <div style={{ width: 80, height: 80, background: '#2a2a28' }} />
            )}
          </div>
          <div>
            <div style={{ fontFamily: FONTS.serif, fontSize: 26, fontWeight: 300, color: '#E8E0D5', lineHeight: 1.15, marginBottom: 6 }}>
              {mp ? mp.name : dash}
            </div>
            <div style={{ fontFamily: FONTS.body, fontSize: 13, fontWeight: 500, color: 'rgba(232,224,213,0.5)' }}>
              {mp ? `${mp.illumination}% illuminated` : dash}
            </div>
          </div>
        </div>

        {/* Conditions */}
        <div style={{ background: '#E8E0D5', padding: '20px 24px' }}>
          <div style={{ marginBottom: 14 }}>
            <div style={label}>Stargazing</div>
            <div style={{
              fontFamily: FONTS.body, fontSize: 18, fontWeight: 700,
              color: rating?.quality === 'good' ? G.oceanTeal : rating?.quality === 'warn' ? '#C9856A' : G.ink,
            }}>
              {rating ? rating.label : dash}
            </div>
          </div>
          <div style={{ height: '0.5px', background: 'rgba(0,0,0,0.08)', margin: '0 0 14px' }} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 20px' }}>
            <div>
              <div style={label}>MW Core</div>
              <div style={val}>{mw ? mw.status : dash}</div>
            </div>
            <div>
              <div style={label}>Moonrise</div>
              <div style={val}>{sky.moonrise || dash}</div>
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <div style={label}>Best Window</div>
              <div style={{ ...val, color: G.oceanTeal }}>{sky.bestWindow || dash}</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Planets ── */}
      <div style={{ background: '#E8E0D5', padding: '18px 24px', marginTop: 2 }}>
        <div style={{ ...label, marginBottom: 14 }}>Planets Tonight</div>
        {planets.map((p, i) => {
          const barPct = p.visible ? Math.max(3, Math.round((p.altitude / 90) * 100)) : 0;
          return (
            <div key={p.name} style={{
              display: 'grid', gridTemplateColumns: '72px 1fr 36px 24px auto', alignItems: 'center', gap: 10,
              padding: '9px 0',
              borderTop: i > 0 ? `0.5px solid rgba(0,0,0,0.06)` : 'none',
            }}>
              <span style={{ fontFamily: FONTS.body, fontSize: 14, fontWeight: 600, color: G.ink }}>{p.name}</span>
              <div style={{ height: 3, background: 'rgba(0,0,0,0.06)', position: 'relative' }}>
                {barPct > 0 && (
                  <div style={{
                    position: 'absolute', left: 0, top: 0, height: '100%',
                    width: `${barPct}%`,
                    background: p.bright ? G.goldenAmber : G.oceanTeal,
                  }} />
                )}
              </div>
              <span style={{ fontFamily: FONTS.body, fontSize: 12, color: G.ink40, textAlign: 'right' }}>{p.visible ? p.altitude + '°' : dash}</span>
              <span style={{ fontFamily: FONTS.body, fontSize: 11, color: G.ink40, textAlign: 'center' }}>{p.visible ? p.direction : ''}</span>
              <span style={{
                fontFamily: FONTS.body, fontSize: 11, fontWeight: 700,
                color: p.visible ? (p.bright ? G.goldenAmber : G.oceanTeal) : G.ink25,
                textAlign: 'right', minWidth: 80,
              }}>
                {p.visible ? (p.bright ? 'Bright' : 'Visible') : 'Below horizon'}
              </span>
            </div>
          );
        })}
      </div>

      {/* ── Milky Way ── */}
      <div style={{ background: G.darkInk, padding: '20px 24px', marginTop: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }}>
          <div style={lightLabel}>Milky Way Core</div>
          <div style={{ fontFamily: FONTS.body, fontSize: 18, fontWeight: 600, color: '#E8E0D5', marginBottom: 4 }}>
            {mw ? mw.status : dash}
          </div>
          <div style={{ fontFamily: FONTS.body, fontSize: 12, fontWeight: 400, color: 'rgba(232,224,213,0.45)', lineHeight: 1.55, maxWidth: 340 }}>
            {mw ? mw.note : dash}
          </div>
        </div>
        <div style={{ textAlign: 'right', flexShrink: 0, paddingLeft: 20 }}>
          <div style={{ fontFamily: FONTS.serif, fontSize: 36, fontWeight: 300, color: G.goldenAmber, lineHeight: 1 }}>
            {mw ? mw.score : dash}
          </div>
          <div style={{ fontFamily: FONTS.body, fontSize: 10, color: 'rgba(232,224,213,0.3)' }}>/ 10</div>
        </div>
      </div>

      {/* ── New Moon + Shower ── */}
      <div style={{ display: 'grid', gridTemplateColumns: showers?.next ? '1fr 1fr' : '1fr', gap: 2, marginTop: 2 }}>
        <div style={{ background: '#E8E0D5', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={label}>Next New Moon</div>
            <div style={val}>{nn ? nn.date : dash}</div>
          </div>
          <div style={{ fontFamily: FONTS.serif, fontSize: 24, fontWeight: 300, color: G.ink }}>
            {nn ? `${nn.daysAway}d` : dash}
          </div>
        </div>
        {showers?.next && (
          <div style={{ background: '#E8E0D5', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={label}>{showers.active ? 'Active Shower' : 'Next Shower'}</div>
              <div style={{ ...val }}>{showers.next.name}</div>
              <div style={{ fontFamily: FONTS.body, fontSize: 11, fontWeight: 400, color: G.ink40, marginTop: 2 }}>{showers.next.rate}</div>
            </div>
            <div style={{ fontFamily: FONTS.serif, fontSize: 24, fontWeight: 300, color: showers.active ? G.goldenAmber : G.ink }}>
              {showers.active ? 'Now' : `${showers.next.daysAway}d`}
            </div>
          </div>
        )}
      </div>

      {/* ── Bortle ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 2, marginTop: 2 }}>
        {[
          { name: 'Zion', bortle: 3, label: 'Class 3', color: G.goldenAmber },
          { name: 'Bryce Canyon', bortle: 2, label: 'Class 2', color: G.oceanTeal },
          { name: 'Capitol Reef', bortle: 2, label: 'Class 2', color: G.oceanTeal },
        ].map(site => (
          <div key={site.name} style={{ background: G.darkInk, padding: '16px 12px', textAlign: 'center' }}>
            <div style={{ fontFamily: FONTS.serif, fontSize: 28, fontWeight: 300, color: '#E8E0D5', lineHeight: 1, marginBottom: 4 }}>
              {site.bortle}
            </div>
            <div style={{ fontFamily: FONTS.body, fontSize: 9, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: site.color, marginBottom: 3 }}>
              {site.label}
            </div>
            <div style={{ fontFamily: FONTS.body, fontSize: 12, fontWeight: 400, color: 'rgba(232,224,213,0.5)' }}>
              {site.name}
            </div>
          </div>
        ))}
      </div>

      {/* Date */}
      <div style={{ fontFamily: FONTS.body, fontSize: 10, fontWeight: 400, color: G.ink25, textAlign: 'right', marginTop: 14 }}>
        Conditions for {today}
      </div>
    </div>
  );
}
