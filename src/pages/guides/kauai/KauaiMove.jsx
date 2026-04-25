import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import SubGuideLayout from '@components/guide/SubGuideLayout';
import { SubLabel, Prose, ContentList } from '@components/guide';
import GuideDetailSheet from '@components/guide/GuideDetailSheet';
import HowWeChoose from '@components/guide/HowWeChoose';
import moveItems from '../../../data/restaurants/kauai-move.json';

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

export default function KauaiMove() {
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
        <title>Hikes, Surf, etc. Guide | Kauai | Lila</title>
        <meta name="description" content="Every trail, hike, surf break, snorkel spot, and kayak route across Kauai." />
      </Helmet>
      <SubGuideLayout
        title="Hikes, Surf, etc. Guide"
        descriptor="Every trail, hike, surf break, snorkel spot, and kayak route across the island."
        backPath="/destinations/kauai"
        backLabel="Kauai Guide"
      >
        <HowWeChoose section="move" />
        <Prose>
          The Kalalau Trail is the signature — eleven miles along the Na Pali Coast to a beach at the edge of the world. But the island has more: Waimea Canyon rim trails, kayaking the Wailua River, surfing Hanalei Bay, and snorkeling reefs that make the mainland look pale. The terrain here asks you to move through it on every axis — on foot, on water, under water.
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
