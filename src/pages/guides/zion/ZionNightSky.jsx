import { Helmet } from 'react-helmet-async';
import SubGuideLayout from '@components/guide/SubGuideLayout';
import { SubLabel, Prose, EditorialList } from '@components/guide';
import events from '../../../data/events/zion.json';

const SKY_FACTS = [
  { name: 'Zion National Park', context: 'Bortle 3', detail: 'Certified International Dark Sky Park. The Milky Way is visible to the naked eye on clear moonless nights from the canyon floor.' },
  { name: 'Bryce Canyon', context: 'Bortle 2', detail: 'One of the darkest skies in the continental US. On a clear night, over 7,500 stars are visible. The hoodoos at night are extraordinary.' },
  { name: 'Capitol Reef', context: 'Bortle 2', detail: 'Designated International Dark Sky Park. Remote location means minimal light pollution. The Waterpocket Fold under starlight is otherworldly.' },
  { name: 'Best Viewing Window', context: 'Jun \u2013 Sep', detail: 'Warm nights, clear skies, and the Milky Way core directly overhead. New moon windows offer the darkest conditions.' },
];

const astronomyEvents = events
  .filter(e => e.type === 'astronomy')
  .map(e => ({
    name: e.name,
    context: e.timing.approximate_dates,
    detail: e.description.split('.').slice(0, 2).join('.') + '.',
  }));

export default function ZionNightSky() {
  return (
    <>
      <Helmet>
        <title>Stars & Sky Guide | Zion | Lila</title>
        <meta name="description" content="Dark sky ratings, best viewing windows, and ranger programs." />
      </Helmet>
      <SubGuideLayout
        title="Stars & Sky Guide"
        descriptor="Dark sky ratings, best viewing windows, and ranger programs."
      >
        <Prose>
          The canyon is a different place after dark. The walls disappear into silhouette and the sky opens up — wider, deeper, and more populated than anything most people have seen. Zion, Bryce Canyon, and Capitol Reef are all certified International Dark Sky Parks.
        </Prose>
        <Prose>
          The Milky Way is visible to the naked eye from all three parks on clear moonless nights. At Bryce Canyon, over 7,500 stars are visible — more than anywhere else in the lower 48. The best viewing is June through September, when the galactic core passes directly overhead and the nights are warm enough to stay out.
        </Prose>

        <EditorialList items={SKY_FACTS} />

        <SubLabel>Programs</SubLabel>
        <EditorialList items={astronomyEvents} />
      </SubGuideLayout>
    </>
  );
}
