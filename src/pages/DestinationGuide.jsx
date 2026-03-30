// ═══════════════════════════════════════════════════════════════════════════════
// PAGE: DESTINATION GUIDE (generic scaffold)
// ═══════════════════════════════════════════════════════════════════════════════
//
// This is the default guide page for destinations that don't have a
// dedicated guide component (like ZionGuide.jsx). It shows the destination
// overview plus a "coming soon" or placeholder guide structure.
//
// When you build out a full guide for a destination, create a dedicated
// file (e.g. pages/guides/BigSurGuide.jsx) and wire it up in App.jsx.
//

import { useParams, Link, Navigate } from 'react-router-dom';
import { Nav, Footer, FadeIn, PageHero } from '@components';
import { destinations } from '@data/destinations';
import { trackEvent } from '@utils/analytics';

export default function DestinationGuide() {
  const { slug } = useParams();
  const dest = destinations.find(d => d.slug === slug);

  if (!dest) return <Navigate to="/404" replace />;

  return (
    <>
      <Nav />
      <PageHero
        eyebrow={dest.location}
        title={dest.name}
        subtitle={dest.description}
        photo={dest.photo}
        gradient={dest.gradient}
        accentColor={dest.accent}
      />

      <section className="page-content px-6 py-12 md:px-[52px] md:py-20 bg-cream">
        <div className="max-w-[900px] mx-auto">
          <div>
            <FadeIn>
              <div
                className="inline-flex items-center gap-2 mb-8 py-2.5 px-5"
                style={{
                  background: `${dest.accent}15`,
                  border: `1px solid ${dest.accent}30`,
                }}
              >
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: dest.accent }} />
                <span
                  className="font-body text-xs font-bold tracking-[0.18em] uppercase"
                  style={{ color: dest.accent }}
                >
                  Best Window: {dest.threshold}
                </span>
              </div>
            </FadeIn>

            <FadeIn delay={0.1}>
              <h2 className="font-body text-[clamp(24px,3.5vw,36px)] font-light text-dark-ink leading-[1.3] mb-6">
                {dest.guideAvailable ? "Your Complete Guide" : "Guide Coming Soon"}
              </h2>
            </FadeIn>

            <FadeIn delay={0.2}>
              <p className="font-body text-base font-normal text-[#5a6a78] leading-[2.0] mb-8">
                {dest.guideAvailable
                  ? `Everything you need to experience ${dest.name} at its most magical. Curated accommodations, inspired itineraries, wellness rituals, and insider knowledge — all timed to the perfect threshold window.`
                  : `We're crafting something special for ${dest.name}. This guide is being built with the same care and depth as all Lila Trips experiences — vetted accommodations, curated itineraries, and wellness practices woven into extraordinary terrain.`
                }
              </p>
            </FadeIn>

            {/* Guide sections or coming soon */}
            {dest.guideAvailable ? (
              <FadeIn delay={0.3}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                  {["Itinerary", "Accommodations", "Rituals & Wellness", "Practical Details"].map((section, i) => (
                    <div
                      key={section}
                      className="p-[32px_28px] bg-warm-white border border-stone transition-colors duration-300 cursor-pointer hover:border-ocean-teal"
                    >
                      <span
                        className="font-body text-[11px] font-bold tracking-[0.2em] uppercase block mb-3"
                        style={{ color: dest.accent }}
                      >
                        {`0${i + 1}`}
                      </span>
                      <h4 className="font-body text-lg font-medium text-dark-ink mb-2">
                        {section}
                      </h4>
                      <p className="font-body text-sm text-[#7a90a0] leading-[1.7]">
                        Content for this section will be expanded as the guide is built out.
                      </p>
                    </div>
                  ))}
                </div>
              </FadeIn>
            ) : (
              <FadeIn delay={0.3}>
                <div className="p-[48px_40px] bg-warm-white border border-stone text-center">
                  <span className="text-[32px] block mb-4 opacity-40">✦</span>
                  <h3 className="font-body text-lg font-medium text-dark-ink mb-3">
                    Notify Me When Ready
                  </h3>
                  <p className="font-body text-sm text-[#7a90a0] leading-[1.7] max-w-[400px] mx-auto mb-6">
                    Be the first to know when the {dest.name} guide launches — including early access to threshold timing and curated experiences.
                  </p>
                  <div
                    className="inline-block py-3 px-8 bg-dark-ink text-white font-body text-xs font-bold tracking-[0.18em] uppercase cursor-pointer transition-opacity duration-200 hover:opacity-85"
                    onClick={() => trackEvent('guide_notify_clicked', { destination: dest.slug })}
                  >
                    Get Notified
                  </div>
                </div>
              </FadeIn>
            )}

            {/* Other destinations */}
            <FadeIn delay={0.4}>
              <div className="mt-20">
                <span className="eyebrow text-[#9aabba]">Also Explore</span>
                <div className="flex gap-4 flex-wrap mt-4">
                  {destinations.filter(d => d.slug !== dest.slug).slice(0, 3).map(other => (
                    <Link
                      key={other.slug}
                      to={`/destinations/${other.slug}`}
                      className="flex items-center gap-3 py-3 px-5 border border-stone transition-all duration-250 bg-warm-white no-underline hover:-translate-y-0.5 hover:border-ocean-teal"
                    >
                      <div className="w-2 h-2 rounded-full opacity-60" style={{ background: other.accent }} />
                      <span className="font-body text-[13px] font-semibold tracking-[0.1em] uppercase text-dark-ink">
                        {other.name}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
