import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import SubGuideLayout from '@components/guide/SubGuideLayout';
import { SubLabel, Prose, ContentList, EditorialList } from '@components/guide';
import GuideDetailSheet from '@components/guide/GuideDetailSheet';
import experiences from '../../../data/restaurants/joshua-tree-experience.json';

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

export default function JoshuaTreeExperience() {
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
        <title>Art & Culture Guide | Joshua Tree | Lila</title>
        <meta name="description" content="Arts, culture, music, and community in Joshua Tree and its orbit." />
      </Helmet>
      <SubGuideLayout
        title="Art & Culture Guide"
        descriptor="Arts, culture, music, and community in Joshua Tree and its orbit."
        backPath="/destinations/joshua-tree"
        backLabel="Joshua Tree Guide"
      >
        <Prose>
          The desert has drawn artists, musicians, and seekers for decades. Noah Purifoy's outdoor sculpture museum is one of the most striking art installations in the American West. The Integratron promises acoustic healing inside a dome built on an alleged geomagnetic vortex. Pioneertown is a living film set. The creative energy here is real and specific.
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
