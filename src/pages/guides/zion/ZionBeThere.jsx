import { Helmet } from 'react-helmet-async';
import SubGuideLayout from '@components/guide/SubGuideLayout';
import { SubLabel, Prose, ContentList } from '@components/guide';
import permits from '../../../data/permits/zion.json';

const permitItems = permits.map(p => ({
  name: p.activity,
  badge: p.permitType,
  context: p.where,
  detail: p.description,
  lilaPick: false,
}));

export default function ZionBeThere() {
  return (
    <>
      <Helmet>
        <title>Travel Responsibly Guide | Zion | Lila</title>
        <meta name="description" content="How to move through Zion in a way that's good for it." />
      </Helmet>
      <SubGuideLayout
        title="Travel Responsibly Guide"
        descriptor="How to move through this place in a way that's good for it."
      >
        <SubLabel warm>Tread Lightly</SubLabel>
        <Prose>
          The dark, lumpy crust on the desert floor is cryptobiotic soil — a living community of cyanobacteria, mosses, and fungi that takes decades to form and a single footstep to destroy. Stay on trail. Stay on rock. The Virgin River corridor is equally fragile — avoid trampling riverbanks and disturbing riparian vegetation.
        </Prose>

        <SubLabel warm>Give Back</SubLabel>
        <Prose>
          Zion Forever Project is the park's official nonprofit partner. They fund trail restoration, scientific research, and educational programming. If you buy a book at the visitor center, the proceeds go here. If you want to volunteer, they run trail days and habitat restoration events throughout the year.
        </Prose>

        <SubLabel warm>Native Culture</SubLabel>
        <Prose>
          The Southern Paiute people are the original stewards of this landscape. The canyon's Paiute name is Mukuntuweap — "straight canyon." The Paiute Indian Tribe of Utah maintains cultural programs and hosts the annual Restoration Powwow in Cedar City each June. Pipe Spring National Monument, jointly managed by NPS and the Kaibab Band of Paiute Indians, is one of the most historically layered sites in the corridor.
        </Prose>

        <SubLabel warm>Supporting People Here</SubLabel>
        <Prose>
          Springdale is a one-street town. When you eat at a locally owned restaurant, buy gear from a local outfitter, or stay at a family-run lodge, that money stays in the community. The corridor economy depends almost entirely on visitors who choose local over chain. Zion Guru, Deep Creek Coffee, Bit & Spur — these are the businesses that make Springdale Springdale.
        </Prose>

        <SubLabel warm>Permits</SubLabel>
        <Prose>
          Several of Zion's most iconic experiences require advance permits through recreation.gov. Plan ahead — the lottery system rewards early applicants.
        </Prose>
        <ContentList items={permitItems} />
      </SubGuideLayout>
    </>
  );
}
