import { Helmet } from 'react-helmet-async';
import SubGuideLayout from '@components/guide/SubGuideLayout';
import { SubLabel, Prose, EditorialList } from '@components/guide';

const SKY_FACTS = [
  { name: 'Long Beach', context: 'Pacific Rim', detail: 'No light pollution to the west \u2014 just open Pacific. On clear winter nights the Milky Way arcs over the surf. Best conditions during new moon windows.' },
  { name: 'Wild Pacific Trail', context: 'Ucluelet', detail: 'The lighthouse peninsula offers 270 degrees of unobstructed sky over the ocean. Storm watching by day, stargazing by night during clear spells.' },
  { name: 'Strathcona Provincial Park', context: 'Interior', detail: 'The island\u2019s darkest skies. Alpine lakes at elevation with no settlements for kilometres. Forbidden Plateau and Buttle Lake are prime viewing spots.' },
  { name: 'Storm Watching', context: 'Nov\u2013Jan', detail: 'Peak dramatic Pacific storms generate their own spectacle \u2014 lightning over the open ocean, phosphorescent surf, and the occasional aurora borealis on clear nights between systems.' },
];

const WILDLIFE_SKY = [
  { name: 'Whale Watching with Ahous Adventures', context: 'Ahousaht Nation', detail: 'The recommended operator. Gray whales (March\u2013October), humpbacks (summer\u2013fall), occasional orcas. Guides carry Ahousaht cultural knowledge \u2014 place names, ecological relationships, history. Every tour is an act of reciprocity.' },
  { name: 'Bear Watching', context: 'Spring\u2013Fall', detail: 'Black bears foraging along the rocky intertidal shores of Clayoquot Sound. Best viewed by zodiac with an experienced guide. Ahousaht-guided tours recommended.' },
  { name: 'Bioluminescence', context: 'Summer Nights', detail: 'Warm summer nights can bring bioluminescent plankton to Tofino\u2019s beaches. The phosphorescent glow in the surf is one of the coast\u2019s most magical phenomena \u2014 unpredictable but unforgettable.' },
  { name: 'Tofino Botanical Gardens', context: 'Year-Round', detail: 'A 12-acre coastal garden at the edge of Tofino, adjacent to a working estuary. Native plant collections, Pacific Rim ecology exhibits, and the Raincoast Education Society\u2019s naturalist-led programming.' },
];

export default function VancouverIslandNightSky() {
  return (
    <>
      <Helmet>
        <title>Stars & Sky Guide | Vancouver Island | Lila</title>
        <meta name="description" content="Dark skies, storm watching, whale watching, and bioluminescence on Vancouver Island." />
      </Helmet>
      <SubGuideLayout
        title="Stars & Sky Guide"
        descriptor="Dark skies, storm watching, whale watching, and bioluminescence."
        backPath="/destinations/vancouver-island"
        backLabel="Vancouver Island Guide"
      >
        <Prose>
          Vancouver Island's west coast offers genuinely dark skies — no major cities for hundreds of kilometres in the Pacific direction. The best stargazing is from Long Beach and the Wild Pacific Trail on clear winter nights. But the sky here offers more than stars: storm season brings lightning over the open ocean, phosphorescent surf on warm summer nights glows with bioluminescent plankton, and on rare, spectacular occasions the Northern Lights reach this latitude.
        </Prose>

        <SubLabel>Dark Sky Viewing</SubLabel>
        <EditorialList items={SKY_FACTS} />

        <SubLabel>Wildlife & Phenomena</SubLabel>
        <Prose>
          The living coast is its own kind of spectacle. Whales, bears, storms, and bioluminescence — these are the experiences that define Vancouver Island after dark and beyond the trail.
        </Prose>
        <EditorialList items={WILDLIFE_SKY} />
      </SubGuideLayout>
    </>
  );
}
