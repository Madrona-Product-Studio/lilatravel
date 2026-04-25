import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import SubGuideLayout from '@components/guide/SubGuideLayout';
import { SubLabel, Prose, ContentList } from '@components/guide';
import GuideDetailSheet from '@components/guide/GuideDetailSheet';
import breatheItems from '../../../data/restaurants/vancouver-island-breathe.json';

const breatheContentItems = breatheItems.map(b => ({
  ...b,
  type: 'list',
  badge: b.breatheTier.charAt(0).toUpperCase() + b.breatheTier.slice(1),
  context: [b.type || b.subtype, b.location].filter(Boolean).join(' \u00b7 '),
  detail: b.highlights[0],
  highlights: b.highlights,
  featured: b.lilaPick,
  url: b.links?.website,
  links: b.links,
  section: 'Breathe',
}));

export default function VancouverIslandBreathe() {
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
        <title>Yoga & Mindfulness Guide | Vancouver Island | Lila</title>
        <meta name="description" content="Hot springs, forest bathing, sauna, and restoration on the island." />
      </Helmet>
      <SubGuideLayout
        title="Yoga & Mindfulness Guide"
        descriptor="Hot springs, forest bathing, sauna, and restoration."
        backPath="/destinations/vancouver-island"
        backLabel="Vancouver Island Guide"
      >
        <Prose>
          The coast does half the work. The sound of rain on cedar, the rhythm of the surf, the ancient scale of the forest — it works on you whether you intend it to or not. Hot Springs Cove is accessible only by boat, and the boardwalk through the forest to the thermal pools carved into coastal rock is one of the most beautiful approaches to hot water anywhere. Cedar saunas overlook the Pacific. Forest bathing on Meares Island happens among 1,500-year-old trees.
        </Prose>

        <SubLabel>Highlights</SubLabel>
        <ContentList items={breatheContentItems} onOpenSheet={setActiveSheet} />
      </SubGuideLayout>
      <GuideDetailSheet
        item={activeSheet}
        onClose={() => setActiveSheet(null)}
        isMobile={isMobile}
      />
    </>
  );
}
