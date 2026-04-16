import { Helmet } from 'react-helmet-async';
import SubGuideLayout from '@components/guide/SubGuideLayout';
import { SubLabel, Prose, EditorialList } from '@components/guide';
import NightSkyWidget from '@components/guide/NightSkyWidget';

const SKY_FACTS = [
  { name: 'Joshua Tree National Park', context: 'Bortle 2–3', detail: 'Certified International Dark Sky Park since 2017. Best viewing from Pinto Basin Road pullouts and Cholla Cactus Garden parking area. Zero light pollution from the east.' },
  { name: 'Cap Rock Area', context: 'Best Photo Spot', detail: 'Iconic rock formations silhouetted against the Milky Way. The classic astrophotography location in the park. Easy access from the main road.' },
  { name: 'Jumbo Rocks Campground', context: 'Sleep Under Stars', detail: 'Sleep under Bortle 2 skies. Best experienced during a new moon window. The boulders frame the sky in every direction.' },
  { name: 'Pinto Basin Road', context: 'Darkest Corridor', detail: 'The quietest, darkest corridor in the park. Zero light pollution from any direction. Pull off at any of the turnouts after dark.' },
  { name: 'Best Viewing Window', context: 'Nov – Feb', detail: 'Winter\'s long nights and dry, stable air create the park\'s best stargazing conditions. Geminid meteor shower peaks Dec 13–14 with 120+ meteors per hour.' },
];

const CALENDAR = [
  { name: 'New Moon Windows', context: 'Monthly', detail: 'Check the lunar calendar. Plan your visit around the darkest nights for the most spectacular sky.' },
  { name: 'Perseid Meteor Shower', context: 'Aug 12–13 peak', detail: 'Up to 100 meteors per hour at peak. Best after midnight, face northeast. Summer heat means warm, comfortable viewing.' },
  { name: 'Geminid Meteor Shower', context: 'Dec 13–14 peak', detail: 'The year\'s best shower. 120+ per hour. Cold desert nights — dress warm and bring a sleeping pad.' },
  { name: 'Milky Way Core', context: 'May – August', detail: 'The galactic core rises overhead. Visible to the naked eye from anywhere in the park. Peak detail in June and July.' },
];

export default function JoshuaTreeNightSky() {
  return (
    <>
      <Helmet>
        <title>Stars & Sky Guide | Joshua Tree | Lila</title>
        <meta name="description" content="Dark sky ratings, best viewing windows, and viewing areas." />
      </Helmet>
      <SubGuideLayout
        title="Stars & Sky Guide"
        descriptor="Dark sky ratings, best viewing windows, and viewing areas."
        backPath="/destinations/joshua-tree"
        backLabel="Joshua Tree Guide"
      >
        <Prose>
          At night, the sky opens. Joshua Tree is a certified International Dark Sky Park — IDA designated in 2017, Bortle Class 2–3. On a moonless night, the Milky Way arcs directly overhead, brighter and more detailed than most Americans have ever seen. The eastern half of the park offers the darkest conditions, with virtually zero light pollution from any direction.
        </Prose>
        <Prose>
          The volunteer-run Sky's the Limit Observatory & Nature Center in Twentynine Palms hosts free public star parties on Saturday nights. Bring binoculars — the volunteers bring the telescopes. It's one of the best community-run astronomy programs in the West.
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
