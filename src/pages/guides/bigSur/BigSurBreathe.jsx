import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import SubGuideLayout from '@components/guide/SubGuideLayout';
import { SubLabel, Prose, ContentList } from '@components/guide';
import GuideDetailSheet from '@components/guide/GuideDetailSheet';
import HowWeChoose from '@components/guide/HowWeChoose';
import breatheItems from '../../../data/restaurants/big-sur-breathe.json';

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

export default function BigSurBreathe() {
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
        <title>Yoga & Mindfulness Guide | Big Sur | Lila</title>
        <meta name="description" content="Esalen, hot springs, yoga, bodywork, and restoration on the Big Sur coast." />
      </Helmet>
      <SubGuideLayout
        title="Yoga & Mindfulness Guide"
        descriptor="Esalen, hot springs, yoga, bodywork, and restoration on the coast."
        backPath="/destinations/big-sur"
        backLabel="Big Sur Guide"
      >
        <HowWeChoose section="breathe" />
        <Prose>
          Esalen Institute put Big Sur on the map for a reason — the hot springs on the cliff edge, the workshops, the long history of consciousness exploration. But the coast itself does the work. The sound of surf through redwoods, the fog burning off, the scale of the landscape — it recalibrates the nervous system whether you intend it to or not. These are the people and places that help you meet the coast on a different register — through the body, through the breath, through stillness.
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
