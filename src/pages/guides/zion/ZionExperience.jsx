import { Helmet } from 'react-helmet-async';
import SubGuideLayout from '@components/guide/SubGuideLayout';
import { SubLabel, Prose, ContentList, ItemList } from '@components/guide';
import { G } from '@data/guides/guide-styles';
import experiences from '../../../data/restaurants/zion-experience.json';
import events from '../../../data/events/zion.json';

const experienceItems = experiences.map(e => ({
  name: e.name,
  badge: e.type.charAt(0).toUpperCase() + e.type.slice(1).replace(/-/g, ' '),
  context: e.location,
  detail: e.highlights[0],
  lilaPick: e.lilaPick,
}));

const eventItems = events
  .filter(e => ['festival', 'cultural', 'market'].includes(e.type))
  .map(e => ({
    name: e.name,
    context: e.timing.approximate_dates,
    detail: e.description.split('.').slice(0, 2).join('.') + '.',
  }));

export default function ZionExperience() {
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
        <ContentList items={experienceItems} />

        <SubLabel>Events</SubLabel>
        <ItemList items={eventItems} />
      </SubGuideLayout>
    </>
  );
}
