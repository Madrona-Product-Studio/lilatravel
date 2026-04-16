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
    <svg viewBox="0 0 80 80" style={{ width: 72, height: 72 }}>
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

  // Consistent label style
  const labelStyle = { fontFamily: FONTS.body, fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: G.ink40, marginBottom: 3 };
  const valueStyle = { fontFamily: FONTS.body, fontSize: 13, fontWeight: 500, color: G.ink };

  return (
    <div style={{ margin: '24px 0 28px' }}>

      {/* Live badge */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 16 }}>
        <style>{`@keyframes nightsky-pulse{0%,100%{opacity:1}50%{opacity:0.3}}`}</style>
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: G.oceanTeal, animation: 'nightsky-pulse 2s ease-in-out infinite' }} />
        <span style={{ fontFamily: FONTS.body, fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: G.oceanTeal }}>
          Live Conditions
        </span>
      </div>

      {/* Top grid: Moon + Conditions */}
      <div style={{ display: 'grid', gridTemplateColumns: mobile ? '1fr' : '1fr 1fr', gap: 2, marginBottom: 2 }}>

        {/* Moon card */}
        <div style={{ background: G.darkInk, padding: '20px', display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ flexShrink: 0 }}>
            {mp?.svgUrl ? (
              <img src={mp.svgUrl} alt="Moon phase" style={{ width: 72, height: 72 }} />
            ) : mp ? (
              <MoonSVG age={mp.age} illumination={mp.illumination} />
            ) : (
              <div style={{ width: 72, height: 72, background: '#2a2a28' }} />
            )}
          </div>
          <div>
            <div style={{ fontFamily: FONTS.serif, fontSize: 20, fontWeight: 300, color: '#E8E0D5', lineHeight: 1.2, marginBottom: 3 }}>
              {mp ? mp.name : dash}
            </div>
            <div style={{ fontFamily: FONTS.body, fontSize: 12, fontWeight: 400, color: 'rgba(232,224,213,0.55)' }}>
              {mp ? `${mp.illumination}% illuminated` : dash}
            </div>
          </div>
        </div>

        {/* Conditions card */}
        <div style={{ background: '#E8E0D5', padding: '16px 20px' }}>
          <div style={{ marginBottom: 10 }}>
            <div style={labelStyle}>Stargazing</div>
            <div style={{
              fontFamily: FONTS.serif, fontSize: 18, fontWeight: 300,
              color: rating?.quality === 'good' ? G.oceanTeal : rating?.quality === 'warn' ? '#C9856A' : G.ink,
            }}>
              {rating ? rating.label : dash}
            </div>
          </div>
          <div style={{ height: '0.5px', background: G.border, margin: '8px 0' }} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 16px' }}>
            <div>
              <div style={labelStyle}>MW Core</div>
              <div style={valueStyle}>{mw ? mw.status : dash}</div>
            </div>
            <div>
              <div style={labelStyle}>Moonrise</div>
              <div style={valueStyle}>{sky.moonrise || dash}</div>
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <div style={labelStyle}>Best Window</div>
              <div style={valueStyle}>{sky.bestWindow || dash}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Planets */}
      <div style={{ background: '#E8E0D5', padding: '16px 20px', marginTop: 2 }}>
        <div style={{ ...labelStyle, marginBottom: 10 }}>Planets Tonight</div>
        {planets.length === 0 ? (
          <div style={valueStyle}>{dash}</div>
        ) : planets.map((p, i) => (
          <div key={p.name} style={{
            display: 'grid', gridTemplateColumns: '68px 1fr 40px 28px auto', alignItems: 'center', gap: 8,
            padding: '6px 0',
            borderTop: i > 0 ? `0.5px solid ${G.border}` : 'none',
          }}>
            <span style={{ fontFamily: FONTS.body, fontSize: 13, fontWeight: 600, color: G.ink }}>{p.name}</span>
            <div style={{ height: 3, background: G.border, position: 'relative' }}>
              <div style={{
                position: 'absolute', left: 0, top: 0, height: '100%',
                width: `${p.visible ? Math.max(4, Math.min(100, (p.altitude / 90) * 100)) : 0}%`,
                background: p.bright ? G.goldenAmber : G.oceanTeal,
              }} />
            </div>
            <span style={{ fontFamily: FONTS.body, fontSize: 11, color: G.ink40, textAlign: 'right' }}>{p.visible ? p.altitude + '°' : dash}</span>
            <span style={{ fontFamily: FONTS.body, fontSize: 11, color: G.ink40, textAlign: 'center' }}>{p.visible ? p.direction : ''}</span>
            <span style={{
              fontFamily: FONTS.body, fontSize: 10, fontWeight: 700, letterSpacing: '0.06em',
              color: p.visible ? (p.bright ? G.goldenAmber : G.oceanTeal) : G.ink25,
            }}>
              {p.visible ? (p.bright ? 'Bright' : 'Visible') : 'Below horizon'}
            </span>
          </div>
        ))}
      </div>

      {/* Milky Way */}
      <div style={{ background: G.darkInk, padding: '18px 20px', marginTop: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: FONTS.body, fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(232,224,213,0.4)', marginBottom: 4 }}>
            Milky Way Core
          </div>
          <div style={{ fontFamily: FONTS.serif, fontSize: 20, fontWeight: 300, color: '#E8E0D5', marginBottom: 3 }}>
            {mw ? mw.status : dash}
          </div>
          <div style={{ fontFamily: FONTS.body, fontSize: 12, fontWeight: 400, color: 'rgba(232,224,213,0.5)', lineHeight: 1.5, maxWidth: 340 }}>
            {mw ? mw.note : dash}
          </div>
        </div>
        <div style={{ textAlign: 'right', flexShrink: 0, paddingLeft: 16 }}>
          <div style={{ fontFamily: FONTS.serif, fontSize: 32, fontWeight: 300, color: G.goldenAmber, lineHeight: 1 }}>
            {mw ? mw.score : dash}
          </div>
          <div style={{ fontFamily: FONTS.body, fontSize: 10, color: 'rgba(232,224,213,0.35)' }}>/ 10</div>
        </div>
      </div>

      {/* Next new moon + Meteor shower row */}
      <div style={{ display: 'grid', gridTemplateColumns: showers?.next ? '1fr 1fr' : '1fr', gap: 2, marginTop: 2 }}>
        <div style={{ background: '#E8E0D5', padding: '14px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={labelStyle}>Next New Moon</div>
            <div style={valueStyle}>{nn ? nn.date : dash}</div>
          </div>
          <div style={{ fontFamily: FONTS.serif, fontSize: 22, fontWeight: 300, color: G.ink }}>
            {nn ? `${nn.daysAway}d` : dash}
          </div>
        </div>

        {showers?.next && (
          <div style={{ background: '#E8E0D5', padding: '14px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={labelStyle}>{showers.active ? 'Active Shower' : 'Next Shower'}</div>
              <div style={{ ...valueStyle, fontWeight: 600 }}>{showers.next.name}</div>
              <div style={{ fontFamily: FONTS.body, fontSize: 11, color: G.ink40, marginTop: 1 }}>{showers.next.rate}</div>
            </div>
            <div style={{ fontFamily: FONTS.serif, fontSize: 22, fontWeight: 300, color: showers.active ? G.goldenAmber : G.ink }}>
              {showers.active ? 'Now' : `${showers.next.daysAway}d`}
            </div>
          </div>
        )}
      </div>

      {/* Bortle comparison */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 2, marginTop: 2 }}>
        {[
          { name: 'Zion', bortle: 3, label: 'Class 3', color: G.goldenAmber },
          { name: 'Bryce Canyon', bortle: 2, label: 'Class 2', color: G.oceanTeal },
          { name: 'Capitol Reef', bortle: 2, label: 'Class 2', color: G.oceanTeal },
        ].map(site => (
          <div key={site.name} style={{ background: G.darkInk, padding: '14px 12px', textAlign: 'center' }}>
            <div style={{ fontFamily: FONTS.serif, fontSize: 26, fontWeight: 300, color: '#E8E0D5', lineHeight: 1, marginBottom: 3 }}>
              {site.bortle}
            </div>
            <div style={{ fontFamily: FONTS.body, fontSize: 9, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: site.color, marginBottom: 2 }}>
              {site.label}
            </div>
            <div style={{ fontFamily: FONTS.body, fontSize: 11, fontWeight: 400, color: 'rgba(232,224,213,0.55)' }}>
              {site.name}
            </div>
          </div>
        ))}
      </div>

      {/* Date */}
      <div style={{ fontFamily: FONTS.body, fontSize: 10, color: G.ink25, textAlign: 'right', marginTop: 12, letterSpacing: '0.04em' }}>
        Conditions for {today}
      </div>
    </div>
  );
}
