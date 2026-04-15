// ═══════════════════════════════════════════════════════════════════════════════
// SUB-GUIDE: SLEEP
// ═══════════════════════════════════════════════════════════════════════════════
//
// Where to stay across the full orbit.
// Route: /destinations/zion/sleep
//

import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import SubGuideLayout from '@components/guide/SubGuideLayout';
import { StayItem, GuideDetailSheet, ExpandableList, TierFilter, sortByTierDiversity } from '@components/guide';
import { G } from '@data/guides/guide-styles';
import { sleepFilterTiers } from '@data/guides/zion-constants';
import { trackEvent } from '@utils/analytics';
import accommodations from '../../../data/accommodations/zion.json';

// ─── Page ───────────────────────────────────────────────────────────────────

export default function ZionSleep() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  const [activeSheet, setActiveSheet] = useState(null);
  const [activeTiers, setActiveTiers] = useState(() => new Set(['elemental', 'rooted', 'premium', 'luxury']));

  // Lock body scroll when sheet is open
  useEffect(() => {
    if (activeSheet) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [activeSheet]);

  const handleTierToggle = (tierKey) => {
    setActiveTiers(prev => {
      if (prev.has(tierKey) && prev.size === 1) return prev;
      const next = new Set(prev);
      next.has(tierKey) ? next.delete(tierKey) : next.add(tierKey);
      return next;
    });
  };

  const openSheet = (item) => {
    trackEvent('guide_sheet_opened', { section: 'Sleep', item: item.name, destination: 'zion' });
    setActiveSheet({ ...item, section: 'Sleep' });
  };

  const coreAccommodations = accommodations.filter(a => !a.corridor && activeTiers.has(a.stayStyle));
  const corridorAccommodations = accommodations.filter(a => a.corridor && activeTiers.has(a.stayStyle));

  const filteredCount = accommodations.filter(a => activeTiers.has(a.stayStyle)).length;
  const total = accommodations.length;
  const countLabel = filteredCount < total
    ? `${filteredCount} of ${total} options`
    : `${total} options`;

  return (
    <>
      <Helmet>
        <title>Sleep — Zion Guide | Lila Trips</title>
        <meta name="description" content="Where to stay across the full Zion orbit. Camping, boutique inns, and lodges — filtered by style and budget." />
        <link rel="canonical" href="https://lilatrips.com/destinations/zion/sleep" />
      </Helmet>

      <SubGuideLayout
        title="Sleep"
        description="Where to stay across the full orbit."
      >
        {/* Count */}
        <div className="font-body text-[12px] font-medium mb-4" style={{ color: G.ink40 }}>{countLabel}</div>

        {/* Tier filter */}
        <TierFilter tiers={sleepFilterTiers} activeTiers={activeTiers} onToggle={handleTierToggle} />

        {/* Core accommodations */}
        <div className="mt-2">
          <ExpandableList initialCount={5} label="places to stay">
            {sortByTierDiversity(coreAccommodations).map(a => (
              <StayItem
                key={a.id}
                name={a.name}
                location={a.location}
                tier={a.stayStyle}
                detail={a.highlights?.join('. ')}
                tags={a.tags}
                url={a.links?.booking || a.links?.website}
                featured={a.lilaPick}
                onOpenSheet={openSheet}
                priceRange={a.priceRange}
                amenities={a.amenities}
                bookingWindow={a.bookingWindow}
                seasonalNotes={a.seasonalNotes}
                groupFit={a.groupFit}
              />
            ))}
          </ExpandableList>

          {/* Regional corridor */}
          {corridorAccommodations.length > 0 && (
            <>
              <div
                className="flex items-center gap-2 font-body text-[10px] font-semibold tracking-[0.2em] uppercase mt-8 mb-3"
                style={{ color: G.accentMid }}
              >
                <span style={{ width: 16, height: 1, background: G.accent, display: 'block' }} />
                Regional Corridor
              </div>
              {sortByTierDiversity(corridorAccommodations).map(a => (
                <StayItem
                  key={a.id}
                  name={a.name}
                  location={a.location}
                  tier={a.stayStyle}
                  detail={a.highlights?.join('. ')}
                  tags={a.tags}
                  url={a.links?.booking || a.links?.website}
                  featured={a.lilaPick}
                  onOpenSheet={openSheet}
                  priceRange={a.priceRange}
                  amenities={a.amenities}
                  bookingWindow={a.bookingWindow}
                  seasonalNotes={a.seasonalNotes}
                  groupFit={a.groupFit}
                />
              ))}
            </>
          )}
        </div>

        {/* Detail sheet */}
        <GuideDetailSheet item={activeSheet} onClose={() => setActiveSheet(null)} isMobile={isMobile} />
      </SubGuideLayout>
    </>
  );
}
