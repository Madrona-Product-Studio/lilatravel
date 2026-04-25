import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import SubGuideLayout from '@components/guide/SubGuideLayout';
import { SubLabel, Prose, ContentList } from '@components/guide';
import GuideDetailSheet from '@components/guide/GuideDetailSheet';
import HowWeChoose from '@components/guide/HowWeChoose';
import breatheItems from '../../../data/restaurants/olympic-peninsula-breathe.json';

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

export default function OlympicPeninsulaBreathe() {
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
        <title>Hot Springs & Stillness Guide | Olympic Peninsula | Lila</title>
        <meta name="description" content="Hot springs, forest bathing, silence, and restoration on the Olympic Peninsula." />
      </Helmet>
      <SubGuideLayout
        title="Hot Springs & Stillness Guide"
        descriptor="Hot springs, forest bathing, silence, and restoration."
        backPath="/destinations/olympic-peninsula"
        backLabel="Olympic Peninsula Guide"
      >
        <HowWeChoose section="breathe" />
        <Prose>
          The peninsula does half the work. The Hoh Rainforest has been measured as one of the quietest places in the contiguous US. Sol Duc Hot Springs lets you soak in mineral water surrounded by old-growth forest. The sound of the Pacific at Rialto Beach, the smell of cedar after rain, the weight of moss-filtered silence — it works on you whether you intend it to or not. These are the people and places that help you go deeper with that.
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
