import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import SubGuideLayout from '@components/guide/SubGuideLayout';
import { SubLabel, Prose, ContentList } from '@components/guide';
import GuideDetailSheet from '@components/guide/GuideDetailSheet';
import experiences from '../../../data/restaurants/olympic-peninsula-experience.json';

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

export default function OlympicPeninsulaExperience() {
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
        <title>Culture & Heritage Guide | Olympic Peninsula | Lila</title>
        <meta name="description" content="Indigenous heritage, arts, community, and discovery on the Olympic Peninsula." />
      </Helmet>
      <SubGuideLayout
        title="Culture & Heritage Guide"
        descriptor="Indigenous heritage, arts, community, and discovery."
        backPath="/destinations/olympic-peninsula"
        backLabel="Olympic Peninsula Guide"
      >
        <Prose>
          The Olympic Peninsula has a deeper cultural life than most people expect. Nine Indigenous Nations have called this home since time immemorial — the Makah Museum in Neah Bay houses artifacts from the Ozette archaeological site, one of the most significant finds in North America. Port Townsend carries a Victorian heritage and a thriving arts community. Fort Worden hosts residencies and festivals. This is what makes a place more than a park.
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
