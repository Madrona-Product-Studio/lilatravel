// ═══════════════════════════════════════════════════════════════════════════════
// PAGE: DESTINATIONS LANDING
// ═══════════════════════════════════════════════════════════════════════════════

import { Link } from 'react-router-dom';
import { Nav, Footer, FadeIn, PageHeader } from '@components';
import { C } from '@data/brand';
import { destinations } from '@data/destinations';
import { trackEvent } from '@utils/analytics';
import { Helmet } from 'react-helmet-async';

// ─── Main Page ───────────────────────────────────────────────────────────────
export default function DestinationsPage() {
  return (
    <>
      <Helmet>
        <title>Destinations — Zion, Joshua Tree, Big Sur & More | Lila Trips</title>
        <meta name="description" content="Curated destination guides for travelers seeking depth over distance. From Utah's canyon corridor to the Na Pali Coast — each place chosen for its capacity to transform." />
        <link rel="canonical" href="https://lilatrips.com/destinations" />
        <meta property="og:title" content="Destinations — Zion, Joshua Tree, Big Sur & More | Lila Trips" />
        <meta property="og:description" content="Curated destination guides for travelers seeking depth over distance. From Utah's canyon corridor to the Na Pali Coast — each place chosen for its capacity to transform." />
        <meta property="og:url" content="https://lilatrips.com/destinations" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://lilatrips.com/og-image.png" />
        <meta property="og:image:alt" content="Lila Trips Destinations" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Destinations — Zion, Joshua Tree, Big Sur & More | Lila Trips" />
        <meta name="twitter:description" content="Curated destination guides for travelers seeking depth over distance. From Utah's canyon corridor to the Na Pali Coast — each place chosen for its capacity to transform." />
        <meta name="twitter:image" content="https://lilatrips.com/og-image.png" />
      </Helmet>
      <Nav />
      <PageHeader
        eyebrow="Destinations"
        title="Sacred Terrain"
        subtitle="Each place chosen for its capacity to dissolve the ordinary — timed to its most luminous window."
        accentColor={C.seaGlass}
      />

      <style>{`
        .bento-tile {
          position: relative;
          overflow: hidden;
          display: block;
          cursor: pointer;
          text-decoration: none;
          color: inherit;
        }
        .bento-tile img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.6s ease;
        }
        .bento-tile:hover img {
          transform: scale(1.05);
        }
        .bento-tile .bento-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(10,18,26,0.75) 0%, rgba(10,18,26,0.1) 50%, transparent 100%);
          transition: background 0.4s ease;
        }
        .bento-tile:hover .bento-overlay {
          background: linear-gradient(to top, rgba(10,18,26,0.85) 0%, rgba(10,18,26,0.2) 60%, transparent 100%);
        }
        .bento-tile .bento-desc {
          max-height: 0;
          opacity: 0;
          overflow: hidden;
          transition: max-height 0.4s ease, opacity 0.3s ease;
        }
        .bento-tile:hover .bento-desc {
          max-height: 80px;
          opacity: 1;
        }
        .bento-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          grid-template-rows: repeat(3, 300px);
          gap: 4px;
        }
        @media (max-width: 860px) {
          .bento-grid {
            grid-template-columns: 1fr 1fr;
            grid-template-rows: repeat(3, 240px);
            gap: 3px;
          }
        }
        @media (max-width: 540px) {
          .bento-grid {
            grid-template-columns: 1fr;
            grid-template-rows: repeat(6, 240px);
            gap: 3px;
          }
        }
      `}</style>

      <section className="page-content px-6 pt-6 pb-20 md:px-[52px] md:pt-6 md:pb-20 bg-cream">
        <div className="max-w-[1100px] mx-auto">
          <div className="bento-grid">
            {destinations.map((d, i) => {

              return (
                <FadeIn key={d.slug} delay={i * 0.06}>
                  <Link
                    to={`/destinations/${d.slug}`}
                    className="bento-tile h-full"
                    onClick={() => trackEvent('destination_selected', { destination: d.slug })}
                  >
                    {d.photo ? (
                      <img src={d.photo} alt={d.name} />
                    ) : (
                      <div className="w-full h-full brightness-[0.65] saturate-[1.3]" style={{ background: d.gradient }} />
                    )}
                    <div className="bento-overlay" />
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      {/* Golden Windows + Guide status */}
                      <div className="flex items-center gap-2.5 mb-1.5 flex-wrap">
                        <div className="inline-flex items-center gap-2">
                          <div className="w-4 h-px shadow-[0_0_4px_rgba(0,0,0,0.3)]" style={{ background: d.accent }} />
                          <span className="font-body text-[10px] font-bold tracking-[0.22em] uppercase text-white/[0.92] [text-shadow:0_1px_6px_rgba(0,0,0,0.5),0_0_2px_rgba(0,0,0,0.3)]">
                            Golden Windows
                          </span>
                        </div>
                      </div>

                      {/* Season pills */}
                      {d.windows && (
                        <div className="flex gap-1 flex-wrap mb-2.5">
                          {d.windows.map((w, wi) => (
                            <span key={wi} className="font-body text-[9px] font-semibold tracking-[0.04em] text-white/90 py-[3px] px-2 border border-white/20 backdrop-blur-[4px] bg-black/15 leading-none whitespace-nowrap">
                              {w.season} · {w.months}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Name */}
                      <h3 className="font-serif text-[clamp(22px,3vw,30px)] font-light text-white leading-[1.1] mb-1">
                        {d.slug === 'zion-canyon' ? 'Zion & Orbit' : d.name}
                      </h3>

                      {/* Location */}
                      <p className="font-body text-[11px] font-semibold tracking-[0.18em] uppercase text-white/50 mb-0">
                        {d.location}
                      </p>

                      {/* Description on hover */}
                      <div className="bento-desc">
                        <p className="font-serif text-sm font-light text-white/70 leading-[1.6] mt-2">
                          {d.description}
                        </p>
                      </div>
                    </div>
                  </Link>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
