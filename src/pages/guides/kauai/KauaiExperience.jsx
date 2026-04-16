import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import SubGuideLayout from '@components/guide/SubGuideLayout';
import { SubLabel, Prose, ContentList } from '@components/guide';
import GuideDetailSheet from '@components/guide/GuideDetailSheet';
import experiences from '../../../data/restaurants/kauai-experience.json';

const experienceItems = experiences.map(e => ({
  ...e,
  type: 'list',
  badge: (e.type || '').charAt(0).toUpperCase() + (e.type || '').slice(1).replace(/-/g, ' '),
  context: e.location,
  detail: e.highlights[0],
  highlights: e.highlights,
  featured: e.lilaPick,
  url: e.links?.website,
  section: 'Experience',
}));

export default function KauaiExperience() {
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
        <title>Culture & Heritage Guide | Kauai | Lila</title>
        <meta name="description" content="Hawaiian culture, botanical gardens, heritage, and discovery across Kauai." />
      </Helmet>
      <SubGuideLayout
        title="Culture & Heritage Guide"
        descriptor="Hawaiian culture, botanical gardens, heritage, and discovery across Kauai."
        backPath="/destinations/kauai"
        backLabel="Kauai Guide"
      >
        <Prose>
          Kauai's cultural life runs deeper than most visitors see. The island's isolation preserved Hawaiian traditions that were disrupted elsewhere. Botanical gardens with plants the Polynesian navigators brought across the Pacific. Taro farms that have been cultivated for centuries. A film history that spans from South Pacific to Jurassic Park. The culture here is alive and ongoing — not a performance for visitors but a continuation of something old and specific to this place.
        </Prose>

        <SubLabel>Highlights</SubLabel>
        <ContentList items={experienceItems} onOpenSheet={setActiveSheet} />
      </SubGuideLayout>
      <GuideDetailSheet
        item={activeSheet}
        onClose={() => setActiveSheet(null)}
        isMobile={isMobile}
      />
    </>
  );
}
