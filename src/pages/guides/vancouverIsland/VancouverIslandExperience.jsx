import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import SubGuideLayout from '@components/guide/SubGuideLayout';
import { SubLabel, Prose, ContentList } from '@components/guide';
import GuideDetailSheet from '@components/guide/GuideDetailSheet';
import HowWeChoose from '@components/guide/HowWeChoose';
import experiences from '../../../data/restaurants/vancouver-island-experience.json';

const experienceItems = experiences.map(e => ({
  ...e,
  type: 'list',
  badge: (e.type || '').charAt(0).toUpperCase() + (e.type || '').slice(1).replace(/-/g, ' '),
  context: e.location,
  detail: e.highlights[0],
  highlights: e.highlights,
  featured: e.lilaPick,
  url: e.links?.website,
  links: e.links,
  section: 'Experience',
}));

export default function VancouverIslandExperience() {
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
        <title>Art & Culture Guide | Vancouver Island | Lila</title>
        <meta name="description" content="First Nations art, galleries, museums, and cultural heritage across the island." />
      </Helmet>
      <SubGuideLayout
        title="Art & Culture Guide"
        descriptor="First Nations art, galleries, museums, and cultural heritage."
        backPath="/destinations/vancouver-island"
        backLabel="Vancouver Island Guide"
      >
        <HowWeChoose section="artsCulture" />
        <Prose>
          Vancouver Island has a deeper cultural life than most visitors expect. First Nations art traditions thousands of years old — cedar carving, weaving, ceremonial regalia — are alive and evolving. Tofino's gallery scene is small but genuine. Victoria's Royal BC Museum is world-class. And Indigenous-led cultural tourism connects you to the land in ways a trail map never will.
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
