import { Helmet } from 'react-helmet-async';
import SubGuideLayout from '@components/guide/SubGuideLayout';
import { SubLabel, Prose, EditorialList } from '@components/guide';

const SKY_AREAS = [
  { name: 'Hurricane Ridge', context: 'Above the Clouds', detail: 'At 5,200 ft, often above the lowland overcast. When the coast is socked in, the ridge can be clear. Summer nights only — road closes in winter.' },
  { name: 'Dungeness Spit Area', context: 'Rain Shadow', detail: 'In the rain shadow — 16 inches of rain versus 170 on the west side. The clearest and driest skies on the peninsula. Best for consistent viewing conditions.' },
  { name: 'Kalaloch Beach', context: 'Coastal Darkness', detail: 'Remote coastal darkness. The sound of surf under stars. Accessible year-round from the campground. No light pollution from any direction except the occasional ship.' },
  { name: 'Deer Park Campground', context: 'Highest Point', detail: 'The highest drive-to point in the park at 5,400 ft. No water, no services, extraordinary sky. Gravel road — check conditions before driving up.' },
];

const SKY_WINDOWS = [
  { name: 'Summer Milky Way', context: 'Jun–Sep', detail: 'The galactic core passes overhead. Best viewing from Hurricane Ridge or Deer Park when the alpine roads are open. Warm enough to stay out for hours.' },
  { name: 'Perseid Meteor Shower', context: 'Mid-August', detail: 'Peak activity around August 11–13. The peninsula\'s remote locations minimize light interference. Coastal beaches offer 180-degree horizon views for maximum meteor visibility.' },
  { name: 'Winter Constellations', context: 'Nov–Feb', detail: 'Orion, Sirius, and the Pleiades dominate. The rain shadow side — Sequim and Dungeness — offers the clearest winter skies while the west side is clouded over.' },
];

export default function OlympicPeninsulaNightSky() {
  return (
    <>
      <Helmet>
        <title>Stars & Sky Guide | Olympic Peninsula | Lila</title>
        <meta name="description" content="Viewing areas, best windows, and dark sky tips for the Olympic Peninsula." />
      </Helmet>
      <SubGuideLayout
        title="Stars & Sky Guide"
        descriptor="Viewing areas, best windows, and dark sky tips."
        backPath="/destinations/olympic-peninsula"
        backLabel="Olympic Peninsula Guide"
      >
        <Prose>
          Olympic isn't IDA-certified, but genuine darkness is available from any park campground away from Port Angeles. The key challenge is weather — the west side of the peninsula receives 140–170 inches of rain annually, and overcast nights are common. The rain shadow side — Sequim and Dungeness — offers the clearest skies, especially in summer when the west side is still clouded over.
        </Prose>
        <Prose>
          Hurricane Ridge, at 5,200 feet, often sits above the cloud layer. When the lowlands are socked in fog, the ridge can be crystal clear. Deer Park Campground at 5,400 feet is the highest drive-to point in the park — no water, no services, extraordinary sky. For coastal darkness, Kalaloch Beach delivers the sound of surf under stars with no light pollution from any direction.
        </Prose>

        <SubLabel>Best Viewing Areas</SubLabel>
        <EditorialList items={SKY_AREAS} />

        <SubLabel>Viewing Windows</SubLabel>
        <EditorialList items={SKY_WINDOWS} />
      </SubGuideLayout>
    </>
  );
}
