import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import SubGuideLayout from '@components/guide/SubGuideLayout';
import { SubLabel, Prose, ContentList } from '@components/guide';
import GuideDetailSheet from '@components/guide/GuideDetailSheet';
import restaurants from '../../../data/restaurants/kauai-eat.json';

const eatItems = restaurants.map(r => ({
  ...r,
  type: 'list',
  badge: ((r.cuisine || r.type || '').charAt(0).toUpperCase() + (r.cuisine || r.type || '').slice(1)),
  context: [r.energy, r.location].filter(Boolean).join(' \u00b7 '),
  detail: r.highlights[0],
  highlights: r.highlights,
  featured: r.lilaPick,
  url: r.links?.website,
  links: r.links,
  section: 'Eat',
}));

export default function KauaiEat() {
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
        <title>Where to Eat Guide | Kauai | Lila</title>
        <meta name="description" content="Poke, plate lunch, farm-to-table, and fish markets across Kauai." />
      </Helmet>
      <SubGuideLayout
        title="Where to Eat Guide"
        descriptor="Poke, plate lunch, farm-to-table, and fish markets across Kauai."
        backPath="/destinations/kauai"
        backLabel="Kauai Guide"
      >
        <Prose>
          Kauai's food scene is rooted in the land and the ocean. Poke is religion. Plate lunch is infrastructure. The farm-to-table movement here draws from soil that grows year-round. The best meals are often the least formal — roadside stands, fish markets, and the places locals eat when no one's watching.
        </Prose>
        <ContentList items={eatItems} onOpenSheet={setActiveSheet} />
      </SubGuideLayout>
      <GuideDetailSheet
        item={activeSheet}
        onClose={() => setActiveSheet(null)}
        isMobile={isMobile}
      />
    </>
  );
}
