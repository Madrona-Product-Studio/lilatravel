// ═══════════════════════════════════════════════════════════════════════════════
// PAGE: GROUP TRIPS
// ═══════════════════════════════════════════════════════════════════════════════
//
// 3-column grid of trip cards using shared TripCard component.
// Route: /group-trips
//
// ═══════════════════════════════════════════════════════════════════════════════

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Nav, Footer, FadeIn, PageHeader, ExpressInterestModal } from '@components';
import TripCard from '@components/TripCard';
import { C } from '@data/brand';
import { allTrips } from '@data/trips';
import { trackEvent } from '@utils/analytics';

export default function GroupTrips() {
  const [interestTrip, setInterestTrip] = useState(null);

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
      <section className="pt-12 pb-24 bg-cream">
        <div className="max-w-[1100px] mx-auto px-6 md:px-[52px]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-7">
            {allTrips.map((trip, i) => (
              <FadeIn key={trip.slug} delay={i * 0.08}>
                <div className="relative h-full flex flex-col">
                  {/* Card — slightly dimmed to signal not-yet-bookable */}
                  <div className="pointer-events-none opacity-75 flex-1">
                    <TripCard trip={trip} />
                  </div>
                  {/* Express Interest CTA — below the card, in flow */}
                  <button
                    onClick={() => {
                      trackEvent('express_interest_clicked', { trip_slug: trip.slug });
                      setInterestTrip(trip);
                    }}
                    className="w-full font-body text-[10px] font-bold tracking-[0.18em] uppercase text-white border-none cursor-pointer py-3 px-4 transition-opacity duration-200 hover:opacity-85"
                    style={{ background: trip.color }}
                  >
                    Express Interest
                  </button>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-16 px-6 md:px-[52px] bg-dark-ink text-center">
        <FadeIn>
          <p className="font-serif text-[22px] font-light not-italic text-white/50 mb-6">
            Can't find the right dates?
          </p>
          <Link
            to="/contact"
            className="font-body text-[11px] font-bold tracking-[0.2em] uppercase text-white py-3 px-7 border border-white/35 no-underline transition-all duration-300 hover:bg-white/10 hover:border-white/60"
            onClick={() => trackEvent('group_trip_contact_clicked', {})}
          >
            Get in Touch
          </Link>
        </FadeIn>
      </section>

      <ExpressInterestModal
        open={!!interestTrip}
        onClose={() => setInterestTrip(null)}
        tripTitle={interestTrip?.title}
        tripLocation={interestTrip?.location}
      />

      <Footer />
    </>
  );
}
