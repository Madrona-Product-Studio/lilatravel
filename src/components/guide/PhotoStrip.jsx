// ─── PhotoStrip — Shared image strip with mobile carousel + lightbox ────────
//
// Props:
//   images: [{ src, alt, caption, width }]   — width is desktop flex-basis (e.g. '32%')
//   isMobile: boolean
//   height: { mobile, desktop } — optional, defaults to 240 / 360

import { useState, useRef, useEffect, useCallback } from 'react';
import { G, FONTS } from '@data/guides/guide-styles';

export default function PhotoStrip({ images, isMobile, height }) {
  const mobileH = height?.mobile || 340;
  const desktopH = height?.desktop || 360;

  // ── Lightbox state ──
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const lightboxOpen = lightboxIndex !== null;

  const closeLightbox = useCallback(() => setLightboxIndex(null), []);

  // Close on Escape
  useEffect(() => {
    if (!lightboxOpen) return;
    const onKey = (e) => { if (e.key === 'Escape') closeLightbox(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightboxOpen, closeLightbox]);

  // Lock body scroll when lightbox open
  useEffect(() => {
    if (lightboxOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [lightboxOpen]);

  // ── Mobile carousel scroll tracking ──
  const scrollRef = useRef(null);
  const [activeDot, setActiveDot] = useState(0);

  useEffect(() => {
    if (!isMobile || !scrollRef.current) return;
    const el = scrollRef.current;
    const onScroll = () => {
      const scrollLeft = el.scrollLeft;
      const itemWidth = el.firstElementChild?.offsetWidth || 1;
      const gap = 2;
      const index = Math.round(scrollLeft / (itemWidth + gap));
      setActiveDot(Math.min(index, images.length - 1));
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, [isMobile, images.length]);

  // ── Desktop layout ──
  if (!isMobile) {
    return (
      <>
        <div style={{ display: 'flex', gap: 2, overflow: 'hidden', marginTop: 2 }}>
          {images.map((img, i) => (
            <div
              key={i}
              onClick={() => setLightboxIndex(i)}
              style={{ flex: `0 0 ${img.width}`, position: 'relative', overflow: 'hidden', height: desktopH, cursor: 'pointer' }}
            >
              <img src={img.src} alt={img.alt} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', animation: 'fadeIn 0.3s ease' }} />
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '28px 14px 12px', background: 'linear-gradient(to top, rgba(10,18,26,0.65), transparent)' }}>
                <span style={{ fontFamily: FONTS.body, fontSize: 10, fontWeight: 600, letterSpacing: '0.06em', color: 'rgba(255,255,255,0.8)' }}>{img.caption}</span>
              </div>
            </div>
          ))}
        </div>
        {lightboxOpen && <Lightbox images={images} index={lightboxIndex} onClose={closeLightbox} />}
      </>
    );
  }

  // ── Mobile carousel ──
  return (
    <>
      <div
        ref={scrollRef}
        className="photo-strip-scroll"
        style={{
          display: 'flex', gap: 2, marginTop: 2,
          overflowX: 'auto', overflowY: 'hidden',
          scrollSnapType: 'x mandatory',
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        <style>{`.photo-strip-scroll::-webkit-scrollbar { display: none; }`}</style>
        {images.map((img, i) => (
          <div
            key={i}
            onClick={() => setLightboxIndex(i)}
            style={{
              flex: `0 0 85%`,
              scrollSnapAlign: 'start',
              position: 'relative', overflow: 'hidden',
              height: mobileH, cursor: 'pointer',
            }}
          >
            <img src={img.src} alt={img.alt} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', animation: 'fadeIn 0.3s ease' }} />
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '28px 14px 12px', background: 'linear-gradient(to top, rgba(10,18,26,0.65), transparent)' }}>
              <span style={{ fontFamily: FONTS.body, fontSize: 10, fontWeight: 600, letterSpacing: '0.06em', color: 'rgba(255,255,255,0.8)' }}>{img.caption}</span>
            </div>
          </div>
        ))}
      </div>

      {lightboxOpen && <Lightbox images={images} index={lightboxIndex} onClose={closeLightbox} />}
    </>
  );
}


// ─── Lightbox overlay ──────────────────────────────────────────────────────
function Lightbox({ images, index, onClose }) {
  const img = images[index];
  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(0,0,0,0.92)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer',
      }}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        style={{
          position: 'absolute', top: 16, right: 16, zIndex: 10000,
          background: 'none', border: 'none', cursor: 'pointer',
          color: 'rgba(255,255,255,0.7)', fontSize: 28, fontWeight: 300,
          lineHeight: 1, padding: 8,
        }}
        aria-label="Close lightbox"
      >
        &times;
      </button>

      {/* Image */}
      <img
        src={img.src}
        alt={img.alt}
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '94vw', maxHeight: '90vh',
          objectFit: 'contain', display: 'block',
          cursor: 'default',
        }}
      />

      {/* Caption */}
      {img.caption && (
        <div style={{
          position: 'absolute', bottom: 24, left: 0, right: 0,
          textAlign: 'center',
          fontFamily: "'Quicksand', sans-serif", fontSize: 11, fontWeight: 600,
          letterSpacing: '0.06em', color: 'rgba(255,255,255,0.6)',
        }}>
          {img.caption}
        </div>
      )}
    </div>
  );
}
