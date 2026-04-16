import { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import SubGuideLayout from '@components/guide/SubGuideLayout';
import { SubLabel, Prose, ContentList } from '@components/guide';
import GuideDetailSheet from '@components/guide/GuideDetailSheet';
import { getNPSData, findNPSMatch } from '@services/npsService';
import moveItems from '../../../data/restaurants/joshua-tree-move.json';

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

export default function JoshuaTreeMove() {
  const [activeSheet, setActiveSheet] = useState(null);
  const [npsLookup, setNpsLookup] = useState(null);
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth <= 768);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    getNPSData(['jotr']).then(setNpsLookup).catch(() => {});
  }, []);

  const openSheet = useCallback((item) => {
    const npsMatch = npsLookup ? findNPSMatch(item.name, npsLookup) : null;
    setActiveSheet({ ...item, nps: npsMatch || undefined });
  }, [npsLookup]);

  return (
    <>
      <Helmet>
        <title>Hikes, Bikes, etc. Guide | Joshua Tree | Lila</title>
        <meta name="description" content="Every trail, hike, climb, and scenic drive across Joshua Tree." />
      </Helmet>
      <SubGuideLayout
        title="Hikes, Bikes, etc. Guide"
        descriptor="Every trail, hike, climb, and scenic drive across the park."
        backPath="/destinations/joshua-tree"
        backLabel="Joshua Tree Guide"
      >
        <Prose>
          The park has over 8,000 climbing routes and dozens of trails across two distinct desert ecosystems. Ryan Mountain gives you the full panorama. The Skull Rock Loop is easy and uncrowded at dawn. Keys View is the sunset move. And the boulder fields — Jumbo Rocks, Hidden Valley, Split Rock — are some of the best rock climbing in the American West.
        </Prose>

        <SubLabel>Highlights</SubLabel>
        <ContentList items={moveContentItems} onOpenSheet={openSheet} />
      </SubGuideLayout>
      <GuideDetailSheet
        item={activeSheet}
        onClose={() => setActiveSheet(null)}
        isMobile={isMobile}
      />
    </>
  );
}
