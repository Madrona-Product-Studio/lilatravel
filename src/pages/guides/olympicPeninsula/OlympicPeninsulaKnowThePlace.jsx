import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import SubGuideLayout from '@components/guide/SubGuideLayout';
import { SubLabel, Prose, EditorialList, ContentList } from '@components/guide';
import GuideDetailSheet from '@components/guide/GuideDetailSheet';
import { PARKS, TOWNS, TIMING_WINDOWS, WILDLIFE, HIGHLIGHTS } from '@data/guides/olympic-peninsula-constants';

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

const wildlifeItems = WILDLIFE.map(w => ({
  ...w,
  type: 'wildlife',
  badge: 'Wildlife',
  context: w.season || '',
  lat: 47.8,
  lng: -123.6,
}));

const highlightItems = HIGHLIGHTS.map(h => ({
  name: h.name,
  context: h.category,
  detail: h.blurb,
}));

export default function OlympicPeninsulaKnowThePlace() {
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
        <title>Terrain & Parks Guide | Olympic Peninsula | Lila</title>
        <meta name="description" content="Parks, towns, seasons, and wildlife across the Olympic Peninsula." />
      </Helmet>
      <SubGuideLayout
        title="Terrain & Parks Guide"
        descriptor="Parks, towns, seasons, and wildlife across the Olympic Peninsula."
        backPath="/destinations/olympic-peninsula"
        backLabel="Olympic Peninsula Guide"
      >
        <SubLabel>The Parks</SubLabel>
        <Prose>
          Two public lands, two different philosophies. Olympic National Park protects nearly a million acres of mountain, rainforest, and coastline as intact ecosystems — UNESCO World Heritage Site and International Biosphere Reserve. Olympic National Forest surrounds it on three sides, offering 628,000 acres of working forest, wild rivers, and dispersed campsites where the park draws boundaries.
        </Prose>
        <EditorialList items={parkItems} />

        <SubLabel>The Towns</SubLabel>
        <Prose>
          Four gateway towns, each with a different personality and relationship to the landscape. Port Angeles is the main hub. Sequim sits in the rain shadow. Forks guards the rainforest entrance. Port Townsend anchors the civilized end.
        </Prose>
        <EditorialList items={townItems} />

        <SubLabel>When to Go</SubLabel>
        <Prose>
          Olympic rewards every season differently. Summer opens the alpine zone. Fall brings elk rut and golden light. Winter storms turn the coast dramatic and the rainforest atmospheric. Spring delivers whale migration and wildflowers.
        </Prose>
        <EditorialList items={TIMING_WINDOWS} />

        <SubLabel>Places That Stop You</SubLabel>
        <Prose>
          These are the moments that redefine the trip — the places where the peninsula shows you something you didn't know you were looking for.
        </Prose>
        <EditorialList items={highlightItems} />

        <SubLabel>Peninsula Wildlife</SubLabel>
        <Prose>
          The peninsula's isolation — separated from the mainland by Hood Canal — has created endemic species found nowhere else. Roosevelt elk, Olympic marmots, and migrating gray whales are among the most memorable encounters. Pay attention at dawn and dusk.
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
