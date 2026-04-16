import { Helmet } from 'react-helmet-async';
import SubGuideLayout from '@components/guide/SubGuideLayout';
import { SubLabel, Prose, EditorialList } from '@components/guide';
import NightSkyWidget from '@components/guide/NightSkyWidget';

const SKY_FACTS = [
  { name: 'Pfeiffer Beach', context: 'Bortle Class 2', detail: 'Bortle 2 on clear nights. The keyhole rock silhouetted against the Milky Way is the defining image of Big Sur after dark.' },
  { name: 'Kirk Creek Campground', context: 'Clifftop', detail: 'Clifftop sites with unobstructed ocean horizon. Fall asleep to the sound of surf under open sky. One of the best dark sky camping experiences in California.' },
  { name: 'Pfeiffer Ridge / Tin House', context: 'Above the Fog', detail: 'Higher elevation, above the marine layer. When the coast is socked in, the ridge is often clear. The best backup plan for fog nights.' },
  { name: 'Andrew Molera State Park', context: 'River Mouth', detail: 'Beach access with minimal light pollution. The meadow near the river mouth opens a wide sky. Best for casual stargazing without a long drive.' },
];

const CALENDAR = [
  { name: 'Milky Way Core', context: 'Mar – Oct', detail: 'Best after midnight in spring, earlier as summer progresses. Check marine layer forecasts — fog can erase the sky in minutes.' },
  { name: 'Perseid Meteor Shower', context: 'Aug 12–13 peak', detail: 'Peak viewing from Pfeiffer Beach or Kirk Creek. Warm nights, minimal fog in August. Up to 100 meteors per hour.' },
  { name: 'Bixby Bridge Astro', context: 'New Moon Nights', detail: 'The bridge lit by starlight only. A pilgrimage shot for astrophotographers. Best composed from the north side pullout.' },
  { name: 'Gray Whale + Stars', context: 'Dec – Apr', detail: 'Whale spouts by moonlight from the bluffs. Point Lobos and Andrew Molera are the best vantage points for combining coastal wildlife with dark sky.' },
];

export default function BigSurNightSky() {
  return (
    <>
      <Helmet>
        <title>Stars & Sky Guide | Big Sur | Lila</title>
        <meta name="description" content="Dark sky ratings, best viewing windows, and viewing locations along the Big Sur coast." />
      </Helmet>
      <SubGuideLayout
        title="Stars & Sky Guide"
        descriptor="Dark sky ratings, best viewing windows, and viewing locations."
        backPath="/destinations/big-sur"
        backLabel="Big Sur Guide"
      >
        <Prose>
          Big Sur has some of the darkest skies on the California coast — Bortle 2 at Pfeiffer Beach on clear nights. The marine layer is the variable: it can roll in fast and erase the sky, or part dramatically to frame the Milky Way over the ocean. The trick is elevation — when the coast is socked in, the ridges above are often clear.
        </Prose>
        <Prose>
          There are no organized dark sky programs on the Big Sur coast, which is part of the appeal. Bring a red headlamp, a blanket, and patience. The sky here is best experienced lying on the ground, listening to the surf.
        </Prose>

        <NightSkyWidget />

        <SubLabel>Viewing Areas</SubLabel>
        <EditorialList items={SKY_FACTS} />

        <SubLabel>Calendar Anchors</SubLabel>
        <EditorialList items={CALENDAR} />
      </SubGuideLayout>
    </>
  );
}
