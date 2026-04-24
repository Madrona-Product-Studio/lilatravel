import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import SubGuideLayout from '@components/guide/SubGuideLayout';
import { SubLabel, Prose, ContentList } from '@components/guide';
import GuideDetailSheet from '@components/guide/GuideDetailSheet';
import moveItems from '../../../data/restaurants/vancouver-island-move.json';

const moveContentItems = moveItems.map(m => ({
  ...m,
  type: 'list',
  badge: m.moveTier.charAt(0).toUpperCase() + m.moveTier.slice(1),
  context: [m.distance, m.difficulty, m.permitRequired && 'Permit required'].filter(Boolean).join(' \u00b7 '),
  detail: m.highlights[0],
  highlights: m.highlights,
  featured: m.lilaPick,
  url: m.links?.website,
  links: m.links,
  section: 'Move',
}));

export default function VancouverIslandMove() {
  const [activeSheet, setActiveSheet] = useState(null);
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth <= 768);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return (
    <>
      <Helmet>
        <title>Hikes, Bikes, etc. Guide | Vancouver Island | Lila</title>
        <meta name="description" content="Every trail, paddle, surf break, and scenic route across the island." />
      </Helmet>
      <SubGuideLayout
        title="Hikes, Bikes, etc. Guide"
        descriptor="Every trail, paddle, surf break, and scenic route across the island."
        backPath="/destinations/vancouver-island"
        backLabel="Vancouver Island Guide"
      >
        <Prose>
          The West Coast Trail is the marquee — 75 km of wilderness coastline, ladders, cable cars, and tidal shelf. But the island has more: the Meares Island Big Trees boardwalk through cathedral-scale old growth, sea kayaking the Broken Group Islands, and some of the best cold-water surfing in the world at Cox Bay and Long Beach. The Wild Pacific Trail in Ucluelet is the best coastal walk you can do in an afternoon.
        </Prose>

        <SubLabel>Highlights</SubLabel>
        <ContentList items={moveContentItems} onOpenSheet={setActiveSheet} />
      </SubGuideLayout>
      <GuideDetailSheet
        item={activeSheet}
        onClose={() => setActiveSheet(null)}
        isMobile={isMobile}
      />
    </>
  );
}
