import { Helmet } from 'react-helmet-async';
import SubGuideLayout from '@components/guide/SubGuideLayout';
import { SubLabel, Prose, EditorialList } from '@components/guide';
import NightSkyWidget from '@components/guide/NightSkyWidget';

const SKY_LOCATIONS = [
  { name: 'Polihale State Park (West Shore)', context: 'Bortle 3', detail: 'The most remote and darkest beach accessible by road on Kauai. Open horizon, no development for miles. Best for serious dark sky photography.' },
  { name: 'Poipu Beach / Shipwreck Beach (South Shore)', context: 'South Shore', detail: 'Open horizon to the south and west, minimal coastal light. Best for Milky Way core viewing.' },
  { name: 'Kilauea Lighthouse Headland (North Shore)', context: 'North Shore', detail: 'Faces open ocean north. Best for star trails and Milky Way arcing overhead.' },
];

const SKY_CALENDAR = [
  { name: 'Milky Way Core', context: 'Apr \u2013 Oct', detail: 'Best from the south and west shores where light pollution is lowest.' },
  { name: 'Perseid Meteor Shower', context: 'Mid-August', detail: 'Peak viewing from Polihale or Poipu. Warm nights, open horizons.' },
  { name: 'Whale Spouts by Moonlight', context: 'Dec \u2013 Apr', detail: 'Humpback whales visible from shore. Combine with a new moon night for the full experience.' },
  { name: 'Humpback Peak', context: 'Jan \u2013 Mar', detail: 'Peak whale season. North Shore and South Shore both offer sightings from clifftop trails.' },
];

export default function KauaiNightSky() {
  return (
    <>
      <Helmet>
        <title>Stars & Sky Guide | Kauai | Lila</title>
        <meta name="description" content="Dark beaches, best viewing windows, and whale season nights on Kauai." />
      </Helmet>
      <SubGuideLayout
        title="Stars & Sky Guide"
        descriptor="Dark beaches, best viewing windows, and whale season nights."
        backPath="/destinations/kauai"
        backLabel="Kauai Guide"
      >
        <Prose>
          Kauai has no certified Dark Sky designation, but it doesn't need one. The building-height ordinance, low population density, and remote western beaches produce some of the darkest skies in Hawaii. The Milky Way core is visible April through October from the south and west shores. On a clear, moonless night at Polihale, the sky is as good as anywhere in the state.
        </Prose>
        <Prose>
          Whale season adds another dimension. December through April, humpback spouts are visible by moonlight from the south shore overlooks. The combination of dark sky conditions and whale activity in winter is unique to this island.
        </Prose>

        <NightSkyWidget
          title="Tonight Over Kauai"
          lat={22.07} lng={-159.52}
          bortleSites={[
            { name: 'Polihale Beach', bortle: 3, label: 'Class 3', color: '#3a7d7b' },
            { name: 'Kokee Lookout', bortle: 2, label: 'Class 2', color: '#3a7d7b' },
            { name: 'North Shore', bortle: 4, label: 'Class 4', color: '#c9963a' },
          ]}
        />

        <SubLabel>Best Viewing Locations</SubLabel>
        <EditorialList items={SKY_LOCATIONS} />

        <SubLabel>Calendar Anchors</SubLabel>
        <EditorialList items={SKY_CALENDAR} />
      </SubGuideLayout>
    </>
  );
}
