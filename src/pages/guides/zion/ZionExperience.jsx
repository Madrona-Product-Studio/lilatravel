import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import SubGuideLayout from '@components/guide/SubGuideLayout';
import { SubLabel, Prose, ContentList, EditorialList } from '@components/guide';
import GuideDetailSheet from '@components/guide/GuideDetailSheet';
import experiences from '../../../data/restaurants/zion-experience.json';
import events from '../../../data/events/zion.json';

const experienceItems = experiences.map(e => ({
  ...e,
  type: 'list',
  badge: e.type.charAt(0).toUpperCase() + e.type.slice(1).replace(/-/g, ' '),
  context: e.location,
  detail: e.highlights[0],
  highlights: e.highlights,
  featured: e.lilaPick,
  url: e.links?.website,
  section: 'Experience',
}));

const eventItems = events
  .filter(e => ['festival', 'cultural', 'market'].includes(e.type))
  .map(e => ({
    name: e.name,
    context: e.timing.approximate_dates,
    detail: e.description.split('.').slice(0, 2).join('.') + '.',
  }));

export default function ZionExperience() {
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
        <title>Art & Culture Guide | Zion | Lila</title>
        <meta name="description" content="Arts, culture, food, and community across the corridor." />
      </Helmet>
      <SubGuideLayout
        title="Art & Culture Guide"
        descriptor="Arts, culture, food, and community across the corridor."
      >
        <Prose>
          The corridor has a cultural life that surprises people. Native art traditions thousands of years old. A Tony Award-winning Shakespeare festival in Cedar City. Farm-to-table dining on Scenic Byway 12. Springdale galleries showing work directly inspired by the canyon. This is what makes a place more than a park.
        </Prose>

        <SubLabel>Highlights</SubLabel>
        <ContentList items={experienceItems} onOpenSheet={setActiveSheet} />

        <SubLabel>Events</SubLabel>
        <EditorialList items={eventItems} />
      </SubGuideLayout>
      <GuideDetailSheet
        item={activeSheet}
        onClose={() => setActiveSheet(null)}
        isMobile={isMobile}
      />
    </>
  );
}
