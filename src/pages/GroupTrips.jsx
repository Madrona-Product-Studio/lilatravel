// ═══════════════════════════════════════════════════════════════════════════════
// PAGE: GROUP TRIPS
// ═══════════════════════════════════════════════════════════════════════════════
//
// 3-column grid of trip cards using shared TripCard component.
// Route: /group-trips
//
// ═══════════════════════════════════════════════════════════════════════════════

import { Link } from 'react-router-dom';
import { Nav, Footer, FadeIn, PageHeader } from '@components';
import TripCard from '@components/TripCard';
import { C } from '@data/brand';
import { allTrips } from '@data/trips';
import { trackEvent } from '@utils/analytics';

export default function GroupTrips() {
  return (
    <>
      <Nav />

      <PageHeader
        eyebrow="Group Trips"
        title="Tuned to Cosmic Rhythms"
        subtitle="Small group experiences timed to equinoxes, solstices, and celestial events. Eight travelers maximum."
        accentColor={C.seaGlass}
        tag="In Dev"
      />

      {/* Trip Grid */}
      <section style={{
        padding: "48px 0 96px",
        background: C.cream,
      }}>
        <div className="trips-grid-container" style={{
          maxWidth: 1100, margin: "0 auto", padding: "0 52px",
        }}>
          <div className="trips-grid" style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 28,
          }}>
            {allTrips.map((trip, i) => (
              <FadeIn key={trip.slug} delay={i * 0.08}>
                <div style={{ position: "relative", height: "100%" }}>
                  {/* Disable click-through by intercepting pointer events */}
                  <div style={{ pointerEvents: "none", opacity: 0.75, height: "100%" }}>
                    <TripCard trip={trip} />
                  </div>
                  {/* Coming Soon badge */}
                  <div style={{
                    position: "absolute", top: 14, right: 14, zIndex: 2,
                    fontFamily: "'Quicksand', sans-serif",
                    fontSize: 10, fontWeight: 700,
                    letterSpacing: "0.18em", textTransform: "uppercase",
                    color: C.darkInk,
                    background: "rgba(255,255,255,0.92)",
                    backdropFilter: "blur(8px)",
                    padding: "5px 12px",
                  }}>Coming Soon</div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section style={{
        padding: "64px 52px",
        background: C.darkInk,
        textAlign: "center",
      }}>
        <FadeIn>
          <p style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 22, fontWeight: 300, fontStyle: "normal",
            color: "rgba(255,255,255,0.5)", marginBottom: 24,
          }}>
            Can't find the right dates?
          </p>
          <Link to="/contact" style={{
            fontFamily: "'Quicksand', sans-serif",
            fontSize: 11, fontWeight: 700,
            letterSpacing: "0.2em", textTransform: "uppercase",
            color: "white", padding: "12px 28px",
            border: "1px solid rgba(255,255,255,0.35)",
            textDecoration: "none", transition: "all 0.3s",
          }}
          onClick={() => trackEvent('group_trip_contact_clicked', {})}
          onMouseEnter={e => { e.target.style.background = "rgba(255,255,255,0.1)"; e.target.style.borderColor = "rgba(255,255,255,0.6)"; }}
          onMouseLeave={e => { e.target.style.background = "transparent"; e.target.style.borderColor = "rgba(255,255,255,0.35)"; }}
          >
            Get in Touch
          </Link>
        </FadeIn>
      </section>

      <Footer />

      <style>{`
        @media (max-width: 900px) {
          .trips-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .trips-grid-container { padding: 0 24px !important; }
        }
        @media (max-width: 600px) {
          .trips-grid { grid-template-columns: 1fr !important; gap: 20px !important; }
        }
      `}</style>
    </>
  );
}
