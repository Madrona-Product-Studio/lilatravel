import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import SubGuideLayout from '@components/guide/SubGuideLayout';
import { SubLabel, Prose, ContentList, EditorialList } from '@components/guide';
import GuideDetailSheet from '@components/guide/GuideDetailSheet';
import experiences from '../../../data/restaurants/big-sur-experience.json';

const experienceItems = experiences.map(e => ({
  ...e,
  type: 'list',
  badge: (e.type || '').charAt(0).toUpperCase() + (e.type || '').slice(1).replace(/-/g, ' '),
  context: e.location,
  detail: e.highlights?.[0] || '',
  highlights: e.highlights,
  featured: e.lilaPick,
  url: e.links?.website,
  section: 'Experience',
}));

export default function BigSurExperience() {
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
        <title>Art & Culture Guide | Big Sur | Lila</title>
        <meta name="description" content="Arts, literature, culture, and community along the Big Sur coast." />
      </Helmet>
      <SubGuideLayout
        title="Art & Culture Guide"
        descriptor="Arts, literature, culture, and community along the coast."
        backPath="/destinations/big-sur"
        backLabel="Big Sur Guide"
      >
        <Prose>
          The landscape has attracted artists, writers, and seekers for over a century. Henry Miller wrote here. Robinson Jeffers built Tor House from the granite of Carmel Point. The Henry Miller Library in Big Sur is part bookshop, part cultural center, part gathering place. Carmel's 80+ galleries and Monterey's Cannery Row carry a cultural density that surprises visitors.
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
