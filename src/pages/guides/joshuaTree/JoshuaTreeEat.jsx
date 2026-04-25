import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import SubGuideLayout from '@components/guide/SubGuideLayout';
import { SubLabel, Prose, ContentList } from '@components/guide';
import GuideDetailSheet from '@components/guide/GuideDetailSheet';
import restaurants from '../../../data/restaurants/joshua-tree-eat.json';

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

export default function JoshuaTreeEat() {
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
        <title>Where to Eat Guide | Joshua Tree | Lila</title>
        <meta name="description" content="Joshua Tree, Pioneertown, Palm Springs, and a few things worth the drive." />
      </Helmet>
      <SubGuideLayout
        title="Where to Eat Guide"
        descriptor="Joshua Tree, Pioneertown, Palm Springs, and a few things worth the drive."
        backPath="/destinations/joshua-tree"
        backLabel="Joshua Tree Guide"
      >
        <Prose>
          The desert dining scene is better than anyone expects. Pappy & Harriet's in Pioneertown is the anchor — live music, mesquite-grilled everything. La Copine does the farm-to-table thing with real conviction. Natural Sisters Cafe is the Joshua Tree morning move. And Palm Springs has a food scene deep enough to fill a separate guide.
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
