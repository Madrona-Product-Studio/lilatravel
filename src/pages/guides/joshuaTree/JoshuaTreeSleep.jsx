import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import SubGuideLayout from '@components/guide/SubGuideLayout';
import { SubLabel, Prose, EditorialList, ContentList } from '@components/guide';
import GuideDetailSheet from '@components/guide/GuideDetailSheet';
import { TOWNS } from '@data/guides/joshua-tree-constants';
import accommodations from '../../../data/accommodations/joshua-tree.json';

const townItems = TOWNS.map(t => ({
  name: t.name,
  context: t.context,
  detail: t.description,
  url: t.url,
}));

const stayItems = accommodations.map(a => ({
  ...a,
  type: 'stay',
  badge: a.stayStyle.charAt(0).toUpperCase() + a.stayStyle.slice(1),
  context: a.location,
  detail: a.highlights?.[0] || '',
  highlights: a.highlights,
  featured: a.lilaPick,
  tier: a.stayStyle,
  url: a.links?.website || a.links?.booking,
}));

export default function JoshuaTreeSleep() {
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
        <title>Where to Stay Guide | Joshua Tree | Lila</title>
        <meta name="description" content="Full accommodations across Joshua Tree, Twentynine Palms, Pioneertown & Palm Springs." />
      </Helmet>
      <SubGuideLayout
        title="Where to Stay Guide"
        descriptor="Full accommodations across Joshua Tree, Twentynine Palms, Pioneertown & Palm Springs."
        backPath="/destinations/joshua-tree"
        backLabel="Joshua Tree Guide"
      >
        <SubLabel>Towns</SubLabel>
        <EditorialList items={townItems} />

        <SubLabel>Hotels</SubLabel>
        <ContentList items={stayItems} onOpenSheet={setActiveSheet} />
      </SubGuideLayout>
      <GuideDetailSheet
        item={activeSheet}
        onClose={() => setActiveSheet(null)}
        isMobile={isMobile}
      />
    </>
  );
}
