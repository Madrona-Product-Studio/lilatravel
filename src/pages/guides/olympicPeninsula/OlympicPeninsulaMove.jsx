import { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import SubGuideLayout from '@components/guide/SubGuideLayout';
import { SubLabel, Prose, ContentList } from '@components/guide';
import GuideDetailSheet from '@components/guide/GuideDetailSheet';
import { getNPSData, findNPSMatch } from '@services/npsService';
import moveItems from '../../../data/restaurants/olympic-peninsula-move.json';
import permits from '../../../data/permits/olympic-peninsula.json';

const moveContentItems = moveItems.map(m => ({
  ...m,
  type: 'list',
  badge: m.moveTier.charAt(0).toUpperCase() + m.moveTier.slice(1),
  context: [m.distance, m.difficulty, m.permitRequired && 'Permit required'].filter(Boolean).join(' \u00b7 '),
  detail: m.highlights[0],
  highlights: m.highlights,
  featured: m.lilaPick,
  url: m.links?.website,
  section: 'Move',
}));

const permitItems = permits.map(p => ({
  name: p.activity,
  badge: p.permitType,
  context: p.where,
  detail: p.description,
  lilaPick: false,
}));

export default function OlympicPeninsulaMove() {
  const [activeSheet, setActiveSheet] = useState(null);
  const [npsLookup, setNpsLookup] = useState(null);
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth <= 768);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    getNPSData(['olym']).then(setNpsLookup).catch(() => {});
  }, []);

  const openSheet = useCallback((item) => {
    const npsMatch = npsLookup ? findNPSMatch(item.name, npsLookup) : null;
    setActiveSheet({ ...item, nps: npsMatch || undefined });
  }, [npsLookup]);

  return (
    <>
      <Helmet>
        <title>Hikes, Paddles, etc. Guide | Olympic Peninsula | Lila</title>
        <meta name="description" content="Every trail, hike, paddle, and scenic drive across the peninsula." />
      </Helmet>
      <SubGuideLayout
        title="Hikes, Paddles, etc. Guide"
        descriptor="Every trail, hike, paddle, and scenic drive across the peninsula."
        backPath="/destinations/olympic-peninsula"
        backLabel="Olympic Peninsula Guide"
      >
        <Prose>
          Olympic is a place that asks you to move through it. On foot through old-growth rainforest, along wild Pacific coastline, into alpine meadows above the clouds. The terrain is the teacher. Some of these are easy walks to extraordinary places. Others are full-day commitments that will change how you think about your body in the landscape.
        </Prose>

        <SubLabel>Highlights</SubLabel>
        <ContentList items={moveContentItems} onOpenSheet={openSheet} />

        <SubLabel>Permits</SubLabel>
        <ContentList items={permitItems} />
      </SubGuideLayout>
      <GuideDetailSheet
        item={activeSheet}
        onClose={() => setActiveSheet(null)}
        isMobile={isMobile}
      />
    </>
  );
}
