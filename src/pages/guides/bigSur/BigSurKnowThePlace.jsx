import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import SubGuideLayout from '@components/guide/SubGuideLayout';
import { SubLabel, Prose, EditorialList, ContentList } from '@components/guide';
import GuideDetailSheet from '@components/guide/GuideDetailSheet';
import { PARKS, TOWNS, HIGHLIGHTS, WILDLIFE, TIMING_WINDOWS } from '@data/guides/big-sur-constants';

const parkItems = PARKS.map(p => ({
  name: p.name,
  context: p.attribute || p.designation,
  detail: p.soul,
  url: p.infoUrl,
}));

const townItems = TOWNS.map(t => ({
  name: t.name,
  context: t.context,
  detail: t.description,
  url: t.url,
}));

const highlightItems = HIGHLIGHTS.map(h => ({
  name: h.name,
  context: h.category,
  detail: h.blurb,
}));

const wildlifeItems = WILDLIFE.map(w => ({
  ...w,
  type: 'wildlife',
  badge: 'Wildlife',
  context: w.season,
  lat: 36.27,
  lng: -121.81,
}));

export default function BigSurKnowThePlace() {
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
        <title>Terrain & Parks Guide | Big Sur | Lila</title>
        <meta name="description" content="Parks, towns, coastal wildlife, and the places that stop you along the Big Sur coast." />
      </Helmet>
      <SubGuideLayout
        title="Terrain & Parks Guide"
        descriptor="Parks, towns, coastal wildlife, and the places that stop you along the coast."
        backPath="/destinations/big-sur"
        backLabel="Big Sur Guide"
      >
        <SubLabel>The Parks</SubLabel>
        <Prose>
          Four parks, four distinct personalities. Los Padres National Forest is the wild backbone — nearly two million acres of chaparral, oak woodland, and coastal mountains. Julia Pfeiffer Burns has the iconic tidefall waterfall. Pfeiffer Big Sur is the heart of the valley with old-growth redwoods. Andrew Molera is the largest and least crowded.
        </Prose>
        <EditorialList items={parkItems} />

        <SubLabel>The Towns</SubLabel>
        <Prose>
          The orbit pulls north to Carmel-by-the-Sea and Monterey, south toward San Simeon and Cambria. Each adds a distinct layer — from Carmel's galleries to Monterey's aquarium to Cambria's quiet end of the coast.
        </Prose>
        <EditorialList items={townItems} />

        <SubLabel>Places That Stop You</SubLabel>
        <Prose>
          The coast has a handful of moments that stop people mid-sentence. McWay Falls, Bixby Bridge, Pfeiffer Beach's purple sand. These are the ones worth seeking out.
        </Prose>
        <EditorialList items={highlightItems} />

        <SubLabel>When to Go</SubLabel>
        <Prose>
          Big Sur rewards every season differently. Spring brings waterfalls and wildflowers. Fall brings clear skies and solitude. Winter brings gray whales and monarch butterflies. Summer brings fog and crowds.
        </Prose>
        <EditorialList items={TIMING_WINDOWS} />

        <SubLabel>Coastal Wildlife</SubLabel>
        <Prose>
          The coast is alive. Condors ride thermals above the ridges. Sea otters float in the kelp. Gray whales breach offshore. Elephant seals crowd the rookery at Piedras Blancas. Pay attention at dawn and dusk.
        </Prose>
        <ContentList items={wildlifeItems} onOpenSheet={setActiveSheet} />
      </SubGuideLayout>
      <GuideDetailSheet
        item={activeSheet}
        onClose={() => setActiveSheet(null)}
        isMobile={isMobile}
      />
    </>
  );
}
