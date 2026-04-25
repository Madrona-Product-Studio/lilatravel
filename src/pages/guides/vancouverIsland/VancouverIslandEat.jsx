import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import SubGuideLayout from '@components/guide/SubGuideLayout';
import { SubLabel, Prose, ContentList } from '@components/guide';
import GuideDetailSheet from '@components/guide/GuideDetailSheet';
import restaurants from '../../../data/restaurants/vancouver-island-eat.json';

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

export default function VancouverIslandEat() {
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
        <title>Where to Eat Guide | Vancouver Island | Lila</title>
        <meta name="description" content="Tofino, Ucluelet, Victoria, and a few things worth the drive." />
      </Helmet>
      <SubGuideLayout
        title="Where to Eat Guide"
        descriptor="Tofino, Ucluelet, Victoria, and a few things worth the drive."
        backPath="/destinations/vancouver-island"
        backLabel="Vancouver Island Guide"
      >
        <Prose>
          Tofino punches well above its weight for a town of 2,000. The seafood is extraordinary — spot prawns, halibut, Dungeness crab pulled from the waters you can see from the restaurant. Ucluelet is catching up. Victoria adds heritage and refinement.
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
