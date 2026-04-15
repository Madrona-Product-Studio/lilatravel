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
import { G } from '@data/guides/guide-styles';
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
          <div
            className="flex items-center gap-2 font-body text-[10px] font-semibold tracking-[0.2em] uppercase mb-3.5"
            style={{ color: G.accentMid }}
          >
            <span style={{ width: 16, height: 1, background: G.accent, display: 'block' }} />
            Eat
          </div>
          <div className="font-body text-[12px] font-medium mb-4" style={{ color: G.ink40 }}>{restaurants.length} places</div>

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
                <div
                  className="flex items-center gap-2 font-body text-[10px] font-semibold tracking-[0.2em] uppercase mt-8 mb-3"
                  style={{ color: G.accentMid }}
                >
                  <span style={{ width: 16, height: 1, background: G.accent, display: 'block' }} />
                  Regional Corridor
                </div>
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
          <div className="mb-10" style={{ height: 1, background: G.border }} />
          <div
            className="flex items-center gap-2 font-body text-[10px] font-semibold tracking-[0.2em] uppercase mb-3.5"
            style={{ color: G.accentMid }}
          >
            <span style={{ width: 16, height: 1, background: G.accent, display: 'block' }} />
            Experience
          </div>
          <div className="font-body text-[12px] font-medium mb-4" style={{ color: G.ink40 }}>{experiences.length} experiences</div>

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
