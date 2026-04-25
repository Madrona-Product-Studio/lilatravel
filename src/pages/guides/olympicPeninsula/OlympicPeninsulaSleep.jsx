import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import SubGuideLayout from '@components/guide/SubGuideLayout';
import { SubLabel, Prose, EditorialList, ContentList } from '@components/guide';
import GuideDetailSheet from '@components/guide/GuideDetailSheet';
import HowWeChoose from '@components/guide/HowWeChoose';
import { TIER_COLORS } from '@data/guides/guide-styles';
import { TOWNS } from '@data/guides/olympic-peninsula-constants';
import accommodations from '../../../data/accommodations/olympic-peninsula.json';

const townItems = TOWNS.map(t => ({
  name: t.name,
  context: t.context,
  detail: t.description,
  url: t.url,
}));

const stayItems = accommodations.map(a => ({
  ...a,
  type: 'stay',
  badge: a.stayStyle.charAt(0).toUpperCase() + a.stayStyle.slice(1),
  context: a.location,
  detail: a.highlights?.[0] || '',
  highlights: a.highlights,
  tier: a.stayStyle,
  url: a.links?.website || a.links?.booking,
  links: a.links,
}));

export default function OlympicPeninsulaSleep() {
  const [activeSheet, setActiveSheet] = useState(null);
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth <= 768);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return (
    <>
      <Helmet>
        <title>Where to Stay Guide | Olympic Peninsula | Lila</title>
        <meta name="description" content="Full accommodations across Port Angeles, Forks, Sequim & Port Townsend." />
      </Helmet>
      <SubGuideLayout
        title="Where to Stay Guide"
        descriptor="Full accommodations across Port Angeles, Forks, Sequim & Port Townsend."
        backPath="/destinations/olympic-peninsula"
        backLabel="Olympic Peninsula Guide"
      >
        <HowWeChoose section="sleep" />
        <SubLabel>Towns</SubLabel>
        <EditorialList items={townItems} />

        {stayItems.some(s => s.tier === 'elemental') && (
          <>
            <SubLabel color={TIER_COLORS.elemental.color}>Elemental</SubLabel>
            <ContentList items={stayItems.filter(s => s.tier === 'elemental')} onOpenSheet={setActiveSheet} />
          </>
        )}

        {stayItems.some(s => s.tier === 'rooted') && (
          <>
            <SubLabel color={TIER_COLORS.rooted.color}>Rooted</SubLabel>
            <ContentList items={stayItems.filter(s => s.tier === 'rooted')} onOpenSheet={setActiveSheet} />
          </>
        )}

        {stayItems.some(s => s.tier === 'premium') && (
          <>
            <SubLabel color={TIER_COLORS.premium.color}>Premium</SubLabel>
            <ContentList items={stayItems.filter(s => s.tier === 'premium')} onOpenSheet={setActiveSheet} />
          </>
        )}
      </SubGuideLayout>
      <GuideDetailSheet
        item={activeSheet}
        onClose={() => setActiveSheet(null)}
        isMobile={isMobile}
      />
    </>
  );
}
