import { Helmet } from 'react-helmet-async';
import SubGuideLayout from '@components/guide/SubGuideLayout';
import { SubLabel, Prose, ContentList } from '@components/guide';
import { G } from '@data/guides/guide-styles';
import moveItems from '../../../data/restaurants/zion-move.json';
import permits from '../../../data/permits/zion.json';

const moveContentItems = moveItems.map(m => ({
  name: m.name,
  badge: m.moveTier.charAt(0).toUpperCase() + m.moveTier.slice(1),
  context: [m.distance, m.difficulty].filter(Boolean).join(' \u00b7 '),
  detail: m.highlights[0],
  lilaPick: m.lilaPick,
}));

const movePermits = permits.filter(p =>
  ['angels-landing', 'the-subway', 'narrows-top-down', 'backcountry-camping'].includes(p.id)
);

const permitItems = movePermits.map(p => ({
  name: p.activity,
  badge: p.permitType,
  context: p.where,
  detail: p.description,
  lilaPick: false,
}));

export default function ZionMove() {
  return (
    <>
      <Helmet>
        <title>Move Guide | Zion | Lila</title>
        <meta name="description" content="Every trail, hike, climb, and scenic drive across the orbit." />
      </Helmet>
      <SubGuideLayout
        title="Move Guide"
        descriptor="Every trail, hike, climb, and scenic drive across the orbit."
      >
        <Prose>
          Zion is a place that asks you to move through it. On foot, on water, on rock. The terrain is the teacher. Some of these are easy walks to extraordinary viewpoints. Others are full-day commitments that will change how you think about your body in the landscape.
        </Prose>

        <SubLabel>Highlights</SubLabel>
        <ContentList items={moveContentItems} />

        <SubLabel>Permits</SubLabel>
        <ContentList items={permitItems} />
      </SubGuideLayout>
    </>
  );
}
