// ═══════════════════════════════════════════════════════════════════════════════
// SUB-GUIDE: MOVE
// ═══════════════════════════════════════════════════════════════════════════════
//
// Every trail. Every drive. Zion, Bryce Canyon, Capitol Reef.
// Route: /destinations/zion/move
//

import { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import SubGuideLayout from '@components/guide/SubGuideLayout';
import { TierItem, TierFilter, TierLegend } from '@components/guide';
import { GuideDetailSheet } from '@components/guide';
import { C } from '@data/brand';
import { MOVE_TIERS, MOVE_TIER_META } from '@data/guides/zion-constants';
import { getNPSData, buildNPSLookup, findNPSMatch } from '@services/npsService';
import { trackEvent } from '@utils/analytics';
import moveItems from '../../../data/restaurants/zion-move.json';

// ─── Derived filter tiers ───────────────────────────────────────────────────

const moveFilterTiers = [...new Set(moveItems.map(i => i.moveTier))].map(t => ({ key: t, ...MOVE_TIER_META[t] }));

// ─── Page ───────────────────────────────────────────────────────────────────

export default function ZionMove() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  const [activeSheet, setActiveSheet] = useState(null);
  const [activeTiers, setActiveTiers] = useState(() => new Set(moveItems.map(i => i.moveTier)));
  const [npsLookup, setNpsLookup] = useState(null);

  // Load NPS data
  useEffect(() => {
    getNPSData(['zion', 'brca', 'care'])
      .then(data => {
        setNpsLookup(buildNPSLookup(data.thingsToDo));
      })
      .catch(err => console.warn('NPS fetch failed:', err.message));
  }, []);

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

  const openSheet = useCallback((item) => {
    const npsMatch = npsLookup ? findNPSMatch(item.name, npsLookup) : null;
    trackEvent('guide_sheet_opened', { section: 'Move', item: item.name, destination: 'zion' });
    setActiveSheet({ ...item, section: 'Move', nps: npsMatch || undefined });
  }, [npsLookup]);

  const checkNPS = useCallback((name) => npsLookup ? !!findNPSMatch(name, npsLookup) : false, [npsLookup]);

  const filtered = moveItems
    .filter(item => activeTiers.has(item.moveTier))
    .sort((a, b) => (b.lilaPick ? 1 : 0) - (a.lilaPick ? 1 : 0));

  const total = moveItems.length;
  const countLabel = filtered.length < total
    ? `${filtered.length} of ${total} activities`
    : `${total} activities`;

  return (
    <>
      <Helmet>
        <title>Move — Zion Guide | Lila Trips</title>
        <meta name="description" content="Every trail, drive, and route across Zion, Bryce Canyon, and Capitol Reef. Filtered by type, difficulty, and season." />
        <link rel="canonical" href="https://lilatrips.com/destinations/zion/move" />
      </Helmet>

      <SubGuideLayout
        title="Move"
        description="Every trail. Every drive. Zion, Bryce Canyon, Capitol Reef."
      >
        {/* Count */}
        <div className="font-body text-[12px] font-medium text-[#7A857E] mb-4">{countLabel}</div>

        {/* Tier filter */}
        <TierFilter tiers={moveFilterTiers} activeTiers={activeTiers} onToggle={handleTierToggle} />

        {/* Tier legend */}
        <TierLegend items={Object.values(MOVE_TIER_META)} />

        {/* Items */}
        <div className="mt-2">
          {filtered.map(item => (
            <TierItem
              key={item.id}
              name={item.name}
              location={item.location}
              tier={item.moveTier}
              tierStyles={MOVE_TIERS}
              highlights={item.highlights}
              difficulty={item.difficulty}
              bookingWindow={item.bookingWindow}
              priceRange={item.priceRange}
              type={item.type}
              tags={item.tags}
              url={item.links?.website}
              featured={item.lilaPick}
              note={item.bookingWindow}
              duration={item.duration}
              distance={item.distance}
              operator={item.operator}
              light={item.type === 'climb'}
              onOpenSheet={openSheet}
              hasNPS={item.type === 'hike' && checkNPS(item.name)}
            />
          ))}
        </div>

        {/* Detail sheet */}
        <GuideDetailSheet item={activeSheet} onClose={() => setActiveSheet(null)} isMobile={isMobile} />
      </SubGuideLayout>
    </>
  );
}
