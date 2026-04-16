import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import SubGuideLayout from '@components/guide/SubGuideLayout';
import { SubLabel, Prose, ContentList } from '@components/guide';
import GuideDetailSheet from '@components/guide/GuideDetailSheet';
import breatheItems from '../../../data/restaurants/zion-breathe.json';

const breatheContentItems = breatheItems.map(b => ({
  ...b,
  type: 'list',
  badge: b.breatheTier.charAt(0).toUpperCase() + b.breatheTier.slice(1),
  context: [b.type || b.subtype, b.location].filter(Boolean).join(' \u00b7 '),
  detail: b.highlights[0],
  highlights: b.highlights,
  featured: b.lilaPick,
  url: b.links?.website,
  section: 'Breathe',
}));

export default function ZionBreathe() {
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
        <title>Yoga & Mindfulness Guide | Zion | Lila</title>
        <meta name="description" content="Yoga, bodywork, sauna, cold plunge, and restoration." />
      </Helmet>
      <SubGuideLayout
        title="Yoga & Mindfulness Guide"
        descriptor="Yoga, bodywork, sauna, cold plunge, and restoration."
      >
        <Prose>
          The canyon does half the work. The sound of the river, the scale of the walls, the silence at dawn. These are the people and places that help you meet the landscape on a different register — through the body, through the breath, through stillness.
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
