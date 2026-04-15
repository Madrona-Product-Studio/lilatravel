// ═══════════════════════════════════════════════════════════════════════════════
// SUB-GUIDE: BREATHE
// ═══════════════════════════════════════════════════════════════════════════════
//
// Practices, yoga, bodywork, and soaking across the orbit.
// Route: /destinations/zion/breathe
//

import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import SubGuideLayout from '@components/guide/SubGuideLayout';
import { TierItem, TierFilter, TierLegend, GuideDetailSheet, ExpandableList } from '@components/guide';
import { C } from '@data/brand';
import { BREATHE_TIERS, BREATHE_LEGEND } from '@data/guides/zion-constants';
import { trackEvent } from '@utils/analytics';
import breatheItems from '../../../data/restaurants/zion-breathe.json';

// ─── Derived filter tiers ───────────────────────────────────────────────────

const breatheFilterTiers = [
  { key: 'practice', label: 'Practice', desc: 'In the tradition', color: '#4A9B9F' },
  { key: 'soak',     label: 'Soak',     desc: 'Water & heat',     color: '#7BB8D4' },
  { key: 'restore',  label: 'Restore',  desc: 'Integration',      color: '#7BB8A0' },
];

// ─── Page ───────────────────────────────────────────────────────────────────

export default function ZionBreathe() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  const [activeSheet, setActiveSheet] = useState(null);
  const [activeTiers, setActiveTiers] = useState(() => new Set(['practice', 'soak', 'restore']));

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
    trackEvent('guide_sheet_opened', { section: 'Breathe', item: item.name, destination: 'zion' });
    setActiveSheet({ ...item, section: 'Breathe' });
  };

  const filtered = breatheItems
    .filter(item => activeTiers.has(item.breatheTier))
    .sort((a, b) => (b.lilaPick ? 1 : 0) - (a.lilaPick ? 1 : 0));

  const total = breatheItems.length;
  const countLabel = filtered.length < total
    ? `${filtered.length} of ${total} options`
    : `${total} options`;

  return (
    <>
      <Helmet>
        <title>Breathe — Zion Guide | Lila Trips</title>
        <meta name="description" content="Yoga, thermal waters, bodywork, and soaking across the Zion orbit. Practice, soak, and restore." />
        <link rel="canonical" href="https://lilatrips.com/destinations/zion/breathe" />
      </Helmet>

      <SubGuideLayout
        title="Breathe"
        description="Practices, yoga, bodywork, and soaking across the orbit."
      >
        {/* Count */}
        <div className="font-body text-[12px] font-medium text-[#7A857E] mb-4">{countLabel}</div>

        {/* Tier filter */}
        <TierFilter tiers={breatheFilterTiers} activeTiers={activeTiers} onToggle={handleTierToggle} />

        {/* Tier legend */}
        <TierLegend items={BREATHE_LEGEND} />

        {/* Items */}
        <div className="mt-2">
          <ExpandableList initialCount={5} label="wellness options">
            {filtered.map(item => (
              <TierItem
                key={item.id}
                name={item.name}
                location={item.location}
                tier={item.breatheTier}
                tierStyles={BREATHE_TIERS}
                highlights={item.highlights}
                bookingWindow={item.bookingWindow}
                priceRange={item.priceRange}
                type={item.type}
                tags={item.tags}
                url={item.links?.website}
                featured={item.lilaPick}
                note={item.bookingWindow}
                tradition={item.tradition}
                onOpenSheet={openSheet}
              />
            ))}
          </ExpandableList>
        </div>

        {/* Detail sheet */}
        <GuideDetailSheet item={activeSheet} onClose={() => setActiveSheet(null)} isMobile={isMobile} />
      </SubGuideLayout>
    </>
  );
}
