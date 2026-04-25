import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import SubGuideLayout from '@components/guide/SubGuideLayout';
import { SubLabel, Prose, ContentList } from '@components/guide';
import GuideDetailSheet from '@components/guide/GuideDetailSheet';
import breatheItems from '../../../data/restaurants/kauai-breathe.json';

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

export default function KauaiBreathe() {
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
        <title>Yoga & Healing Guide | Kauai | Lila</title>
        <meta name="description" content="Yoga, lomilomi, Hawaiian healing, and restoration across Kauai." />
      </Helmet>
      <SubGuideLayout
        title="Yoga & Healing Guide"
        descriptor="Yoga, lomilomi, Hawaiian healing, and restoration across Kauai."
        backPath="/destinations/kauai"
        backLabel="Kauai Guide"
      >
        <Prose>
          The island has a long tradition of healing — Hawaiian la'au lapa'au (plant medicine), lomilomi bodywork, and a yoga community that draws serious practitioners from around the world. The landscape itself does half the work: trade winds, ocean sound, and the particular quality of light that only Kauai has. These are the people and places that help you meet the island on a different register.
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
