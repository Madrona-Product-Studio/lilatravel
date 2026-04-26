import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import SubGuideLayout from '@components/guide/SubGuideLayout';
import { SubLabel, Prose, ContentList } from '@components/guide';
import GuideDetailSheet from '@components/guide/GuideDetailSheet';
import HowWeChoose from '@components/guide/HowWeChoose';
import MapView from '@components/guide/MapView';
import ViewToggle from '@components/guide/ViewToggle';
import restaurants from '../../../data/restaurants/big-sur-eat.json';

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

export default function BigSurEat() {
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
        <title>Where to Eat Guide | Big Sur | Lila</title>
        <meta name="description" content="Big Sur corridor, Carmel, Monterey, and a few things worth the drive." />
      </Helmet>
      <SubGuideLayout
        title="Where to Eat Guide"
        descriptor="Big Sur corridor, Carmel, Monterey, and a few things worth the drive."
        backPath="/destinations/big-sur"
        backLabel="Big Sur Guide"
      >
        <HowWeChoose section="eat" />
        <Prose>
          Nepenthe is the iconic perch — burgers on a terrace 800 feet above the ocean. Deetjen's does the candlelit dinner. Sierra Mar at Post Ranch is the splurge with a view that earns every dollar. Head north and Carmel has a food scene that punches well above its one-square-mile footprint. Monterey anchors the working end with Cannery Row and the wharf.
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
