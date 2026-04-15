import { Helmet } from 'react-helmet-async';
import SubGuideLayout from '@components/guide/SubGuideLayout';
import { SubLabel, Prose, ContentList } from '@components/guide';
import restaurants from '../../../data/restaurants/zion-eat.json';

const eatItems = restaurants.map(r => ({
  name: r.name,
  badge: ((r.cuisine || r.type || '').charAt(0).toUpperCase() + (r.cuisine || r.type || '').slice(1)),
  context: [r.energy, r.location].filter(Boolean).join(' \u00b7 '),
  detail: r.highlights[0],
  lilaPick: r.lilaPick,
}));

export default function ZionEat() {
  return (
    <>
      <Helmet>
        <title>Eat Guide | Zion | Lila</title>
        <meta name="description" content="Springdale, Byway 12, and a few things worth the drive." />
      </Helmet>
      <SubGuideLayout
        title="Eat Guide"
        descriptor="Springdale, Byway 12, and a few things worth the drive."
      >
        <Prose>
          Springdale has more good food than any gateway town its size deserves. A handful of places on Scenic Byway 12 are worth the detour. The corridor dining scene is small, personal, and genuinely good.
        </Prose>
        <ContentList items={eatItems} />
      </SubGuideLayout>
    </>
  );
}
