import { Helmet } from 'react-helmet-async';
import SubGuideLayout from '@components/guide/SubGuideLayout';
import { SubLabel, Prose, ContentList } from '@components/guide';
import { G } from '@data/guides/guide-styles';
import breatheItems from '../../../data/restaurants/zion-breathe.json';

const breatheContentItems = breatheItems.map(b => ({
  name: b.name,
  badge: b.breatheTier.charAt(0).toUpperCase() + b.breatheTier.slice(1),
  context: [b.type || b.subtype, b.location].filter(Boolean).join(' \u00b7 '),
  detail: b.highlights[0],
  lilaPick: b.lilaPick,
}));

export default function ZionBreathe() {
  return (
    <>
      <Helmet>
        <title>Breathe Guide | Zion | Lila</title>
        <meta name="description" content="Yoga, bodywork, sauna, cold plunge, and restoration." />
      </Helmet>
      <SubGuideLayout
        title="Breathe Guide"
        descriptor="Yoga, bodywork, sauna, cold plunge, and restoration."
      >
        <Prose>
          The canyon does half the work. The sound of the river, the scale of the walls, the silence at dawn. These are the people and places that help you meet the landscape on a different register — through the body, through the breath, through stillness.
        </Prose>

        <SubLabel>Highlights</SubLabel>
        <ContentList items={breatheContentItems} />
      </SubGuideLayout>
    </>
  );
}
