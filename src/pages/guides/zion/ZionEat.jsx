// ═══════════════════════════════════════════════════════════════════════════════
// SUB-GUIDE: EAT
// ═══════════════════════════════════════════════════════════════════════════════
//
// Springdale, the corridor, and a few things worth the drive.
// Route: /destinations/zion/eat
//

import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import SubGuideLayout from '@components/guide/SubGuideLayout';
import { ListItem, GuideDetailSheet, ExpandableList } from '@components/guide';
import { C } from '@data/brand';
import { trackEvent } from '@utils/analytics';
import restaurants from '../../../data/restaurants/zion-eat.json';
import experiences from '../../../data/restaurants/zion-experience.json';

// ─── Page ───────────────────────────────────────────────────────────────────

export default function ZionEat() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  const [activeSheet, setActiveSheet] = useState(null);

  // Lock body scroll when sheet is open
  useEffect(() => {
    if (activeSheet) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [activeSheet]);

  const openSheet = (section) => (item) => {
    trackEvent('guide_sheet_opened', { section, item: item.name, destination: 'zion' });
    setActiveSheet({ ...item, section });
  };

  const coreRestaurants = restaurants
    .filter(r => !r.corridor)
    .sort((a, b) => (b.lilaPick ? 1 : 0) - (a.lilaPick ? 1 : 0));

  const corridorRestaurants = restaurants
    .filter(r => r.corridor)
    .sort((a, b) => (b.lilaPick ? 1 : 0) - (a.lilaPick ? 1 : 0));

  const sortedExperiences = experiences
    .sort((a, b) => (b.lilaPick ? 1 : 0) - (a.lilaPick ? 1 : 0));

  return (
    <>
      <Helmet>
        <title>Eat — Zion Guide | Lila Trips</title>
        <meta name="description" content="Where to eat near Zion. Springdale restaurants, corridor dining, and cultural experiences worth the drive." />
        <link rel="canonical" href="https://lilatrips.com/destinations/zion/eat" />
      </Helmet>

      <SubGuideLayout
        title="Eat"
        description="Springdale, the corridor, and a few things worth the drive."
      >

        {/* ── Eat Section ── */}
        <section className="mb-10">
          <p className="font-body text-[10px] font-bold tracking-[0.18em] uppercase mb-3.5" style={{ color: C.sunSalmon }}>
            Eat
          </p>
          <div className="font-body text-[12px] font-medium text-[#7A857E] mb-4">{restaurants.length} places</div>

          <ExpandableList initialCount={4} label="places">
            {coreRestaurants.map(r => (
              <ListItem
                key={r.id}
                name={r.name}
                detail={r.highlights?.join('. ')}
                note={r.hours}
                tags={r.tags}
                featured={r.lilaPick}
                url={r.links?.website}
                location={r.location}
                onOpenSheet={openSheet('Eat')}
                cuisine={r.cuisine}
                priceRange={r.priceRange}
                reservations={r.reservations}
                dietary={r.dietary}
                energy={r.energy}
              />
            ))}
            {corridorRestaurants.length > 0 && (
              <>
                <p className="font-body text-[13px] font-semibold tracking-[0.08em] uppercase text-warm-gray mt-8 mb-3">
                  Regional Corridor
                </p>
                {corridorRestaurants.map(r => (
                  <ListItem
                    key={r.id}
                    name={r.name}
                    detail={r.highlights?.join('. ')}
                    note={r.hours}
                    tags={r.tags}
                    featured={r.lilaPick}
                    url={r.links?.website}
                    location={r.location}
                    onOpenSheet={openSheet('Eat')}
                    cuisine={r.cuisine}
                    priceRange={r.priceRange}
                    reservations={r.reservations}
                    dietary={r.dietary}
                    energy={r.energy}
                  />
                ))}
              </>
            )}
          </ExpandableList>
        </section>

        {/* ── Experience Section ── */}
        <section className="mb-4">
          <div className="h-px mb-10" style={{ background: C.stone }} />
          <p className="font-body text-[10px] font-bold tracking-[0.18em] uppercase mb-3.5" style={{ color: C.goldenAmber }}>
            Experience
          </p>
          <div className="font-body text-[12px] font-medium text-[#7A857E] mb-4">{experiences.length} experiences</div>

          <ExpandableList initialCount={4} label="experiences">
            {sortedExperiences.map(item => (
              <ListItem
                key={item.id}
                name={item.name}
                detail={item.highlights?.[0]}
                note={item.admission === 'reservation-required' || item.admission === 'paid' ? item.admission : null}
                tags={item.tags}
                featured={item.lilaPick}
                url={item.links?.website}
                location={item.location}
                onOpenSheet={openSheet('Experience')}
              />
            ))}
          </ExpandableList>
        </section>

        {/* Detail sheet */}
        <GuideDetailSheet item={activeSheet} onClose={() => setActiveSheet(null)} isMobile={isMobile} />
      </SubGuideLayout>
    </>
  );
}
