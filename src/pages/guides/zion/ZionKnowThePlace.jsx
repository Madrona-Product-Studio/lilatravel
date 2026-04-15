import { Helmet } from 'react-helmet-async';
import SubGuideLayout from '@components/guide/SubGuideLayout';
import { SubLabel, Prose, ItemList, ItemListGrid } from '@components/guide';
import { G } from '@data/guides/guide-styles';
import { PARKS, TOWNS, WILDLIFE_GROUPS } from '@data/guides/zion-constants';

const TIMING_WINDOWS = [
  { name: 'The Golden Corridor', context: 'Late Sept \u2013 Oct', detail: 'Cottonwoods turn gold along the Virgin River. Crowds thin. Light goes amber. Best hiking weather of the year.' },
  { name: 'Spring Equinox', context: 'Mar \u2013 Apr', detail: 'After a wet winter, the desert floor erupts in wildflowers. Cacti crown themselves. The canyon wakes up.' },
  { name: 'Dark Sky Season', context: 'Jun \u2013 Sep nights', detail: 'Warm nights for stargazing. The Milky Way peaks overhead June through September. Zion is a certified Dark Sky Park.' },
  { name: 'Winter Solstice', context: 'Dec 19\u201322', detail: 'Shortest day, most dramatic canyon light. Snow dusting the upper walls. Fewer people, deeper silence.' },
];

const parkItems = PARKS.map(p => ({
  name: p.name,
  context: p.attribute || p.designation,
  detail: p.soul,
}));

const wildlifeItems = WILDLIFE_GROUPS.flatMap(group =>
  group.entries.map(e => ({
    name: e.name,
    context: group.label,
    detail: e.detail,
  }))
);

export default function ZionKnowThePlace() {
  return (
    <>
      <Helmet>
        <title>The Place Guide | Zion | Lila</title>
        <meta name="description" content="Terrain, geology, parks, towns, and desert wildlife across the Zion orbit." />
      </Helmet>
      <SubGuideLayout
        title="The Place Guide"
        descriptor="Terrain, geology, parks, towns, and desert wildlife across the orbit."
      >
        <SubLabel>The Terrain</SubLabel>
        <Prose>
          Three national parks strung along 200 miles of Southern Utah highway. Zion anchors the west end with its river-carved canyon. Bryce Canyon lifts you onto a high plateau of stone spires. Capitol Reef hides a hundred-mile wrinkle in the earth most people drive right past.
        </Prose>
        <ItemList items={parkItems} />

        <SubLabel>When to Go</SubLabel>
        <Prose>
          Every season changes the canyon. The trick is knowing which version of the place you want to meet.
        </Prose>
        <ItemListGrid items={TIMING_WINDOWS} />

        <SubLabel>Desert Wildlife</SubLabel>
        <Prose>
          The canyon is alive. Condors ride thermals above the rim. Bighorn sheep navigate ledges that look impossible. The ringtail cat hunts at night and is almost never seen. Pay attention at dawn and dusk.
        </Prose>
        <ItemList items={wildlifeItems} />
      </SubGuideLayout>
    </>
  );
}
