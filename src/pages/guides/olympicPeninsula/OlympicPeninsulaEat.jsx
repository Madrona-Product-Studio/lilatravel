import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import SubGuideLayout from '@components/guide/SubGuideLayout';
import { SubLabel, Prose, ContentList } from '@components/guide';
import GuideDetailSheet from '@components/guide/GuideDetailSheet';
import HowWeChoose from '@components/guide/HowWeChoose';
import MapView from '@components/guide/MapView';
import ViewToggle from '@components/guide/ViewToggle';
import restaurants from '../../../data/restaurants/olympic-peninsula-eat.json';

const eatItems = restaurants.map(r => ({
  ...r,
  type: 'list',
  badge: ((r.cuisine || r.type || '').charAt(0).toUpperCase() + (r.cuisine || r.type || '').slice(1)),
  context: [r.energy, r.location].filter(Boolean).join(' \u00b7 '),
  detail: r.highlights[0],
  highlights: r.highlights,
  featured: r.lilaPick,
  url: r.links?.website,
  links: r.links,
  section: 'Eat',
}));

export default function OlympicPeninsulaEat() {
  const [activeSheet, setActiveSheet] = useState(null);
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth <= 768);
  const [view, setView] = useState('list');

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return (
    <>
      <Helmet>
        <title>Where to Eat Guide | Olympic Peninsula | Lila</title>
        <meta name="description" content="Port Angeles, Port Townsend, Forks, and provisions for the trail." />
      </Helmet>
      <SubGuideLayout
        title="Where to Eat Guide"
        descriptor="Port Angeles, Port Townsend, Forks, and provisions for the trail."
        backPath="/destinations/olympic-peninsula"
        backLabel="Olympic Peninsula Guide"
      >
        <HowWeChoose section="eat" />
        <Prose>
          Port Angeles has more good food than any gateway town its size deserves. Port Townsend punches above its weight with craft dining and waterfront spots. Forks is practical — solid provisions and timber-town diners. The peninsula food scene is small, personal, and genuinely good.
        </Prose>
        <ViewToggle view={view} onToggle={setView} />
        {view === 'list' ? (
          <ContentList items={eatItems} onOpenSheet={setActiveSheet} />
        ) : (
          <MapView items={eatItems} onSelectItem={setActiveSheet} />
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
