import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import SubGuideLayout from '@components/guide/SubGuideLayout';
import { SubLabel, Prose, ContentList } from '@components/guide';
import GuideDetailSheet from '@components/guide/GuideDetailSheet';
import moveItems from '../../../data/restaurants/big-sur-move.json';

const moveContentItems = moveItems.map(m => ({
  ...m,
  type: 'list',
  badge: m.moveTier.charAt(0).toUpperCase() + m.moveTier.slice(1),
  context: [m.distance, m.difficulty, m.permitRequired && 'Permit required'].filter(Boolean).join(' \u00b7 '),
  detail: m.highlights[0],
  highlights: m.highlights,
  featured: m.lilaPick,
  url: m.links?.website,
  links: m.links,
  section: 'Move',
}));

export default function BigSurMove() {
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
        <title>Hikes, Bikes, etc. Guide | Big Sur | Lila</title>
        <meta name="description" content="Every trail, hike, surf break, and scenic drive along the Big Sur coast." />
      </Helmet>
      <SubGuideLayout
        title="Hikes, Bikes, etc. Guide"
        descriptor="Every trail, hike, surf break, and scenic drive along the coast."
        backPath="/destinations/big-sur"
        backLabel="Big Sur Guide"
      >
        <Prose>
          Ewoldsen Trail is the signature — old-growth redwoods that open onto coastal ridge views in a single switchback. Point Lobos is the crown jewel of California's state reserves. The Ventana Wilderness offers genuine backcountry. And the coast itself — sea kayaking, surfing at Sand Dollar Beach, cycling Highway 1 — is the real activity guide.
        </Prose>

        <SubLabel>Highlights</SubLabel>
        <ContentList items={moveContentItems} onOpenSheet={setActiveSheet} />
      </SubGuideLayout>
      <GuideDetailSheet
        item={activeSheet}
        onClose={() => setActiveSheet(null)}
        isMobile={isMobile}
      />
    </>
  );
}
