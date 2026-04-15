import { Helmet } from 'react-helmet-async';
import SubGuideLayout from '@components/guide/SubGuideLayout';
import { SubLabel, Prose, ItemList, ContentList } from '@components/guide';
import { G } from '@data/guides/guide-styles';
import { TOWNS } from '@data/guides/zion-constants';
import accommodations from '../../../data/accommodations/zion.json';

const townItems = TOWNS.map(t => ({
  name: t.name,
  context: t.context,
  detail: t.description,
}));

const stayItems = accommodations.map(a => ({
  name: a.name,
  badge: a.stayStyle.charAt(0).toUpperCase() + a.stayStyle.slice(1),
  context: a.location,
  detail: a.highlights[0],
  lilaPick: a.lilaPick,
}));

export default function ZionSleep() {
  return (
    <>
      <Helmet>
        <title>Stay Guide | Zion | Lila</title>
        <meta name="description" content="Full accommodations across Springdale, Kanab, Escalante & Torrey." />
      </Helmet>
      <SubGuideLayout
        title="Stay Guide"
        descriptor="Full accommodations across Springdale, Kanab, Escalante & Torrey."
      >
        <SubLabel>Towns</SubLabel>
        <ItemList items={townItems} />

        <SubLabel>Hotels</SubLabel>
        <ContentList items={stayItems} />
      </SubGuideLayout>
    </>
  );
}
