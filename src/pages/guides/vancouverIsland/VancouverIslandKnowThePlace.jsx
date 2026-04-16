import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import SubGuideLayout from '@components/guide/SubGuideLayout';
import { SubLabel, Prose, EditorialList, ContentList } from '@components/guide';
import GuideDetailSheet from '@components/guide/GuideDetailSheet';
import { PARKS, TOWNS, WILDLIFE, TIMING_WINDOWS, HIGHLIGHTS } from '@data/guides/vancouver-island-constants';

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
  lat: 49.2,
  lng: -125.9,
}));

const highlightItems = HIGHLIGHTS.map(h => ({
  name: h.name,
  context: h.category,
  detail: h.blurb,
}));

export default function VancouverIslandKnowThePlace() {
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
        <title>Terrain & Parks Guide | Vancouver Island | Lila</title>
        <meta name="description" content="Parks, towns, wildlife, and places that stop you across Vancouver Island." />
      </Helmet>
      <SubGuideLayout
        title="Terrain & Parks Guide"
        descriptor="Parks, towns, wildlife, and places that stop you across the island."
        backPath="/destinations/vancouver-island"
        backLabel="Vancouver Island Guide"
      >
        <SubLabel>The Parks</SubLabel>
        <Prose>
          Two protected areas anchor the island experience — Pacific Rim National Park Reserve along the coast and Strathcona Provincial Park in the wild interior. Clayoquot Sound, a UNESCO Biosphere Reserve, ties them together. Parks Canada and BC Parks administer them; the Nuu-chah-nulth Nations are the original stewards.
        </Prose>
        <EditorialList items={parkItems} />

        <SubLabel>The Towns</SubLabel>
        <Prose>
          Tofino is the draw, but the island rewards those who move around. Ucluelet is quieter and equally compelling. Victoria offers architecture and ceremony. Nanaimo is the practical hub.
        </Prose>
        <EditorialList items={townItems} />

        <SubLabel>When to Go</SubLabel>
        <Prose>
          Both seasons are true. Summer is warm, dry, and crowded. Storm season is cold, wet, and transformative. The island is a different place in each — and both versions deserve your attention.
        </Prose>
        <EditorialList items={TIMING_WINDOWS} />

        <SubLabel>Island Wildlife</SubLabel>
        <Prose>
          The waters and forests around Tofino host an extraordinary density of marine and terrestrial life. Gray whales, black bears, sea otters, and orcas share this coastline with surfers and kayakers.
        </Prose>
        <ContentList items={wildlifeItems} onOpenSheet={setActiveSheet} />

        <SubLabel>Places That Stop You</SubLabel>
        <Prose>
          Some places on the island rearrange your sense of scale. These are the ones we keep coming back to.
        </Prose>
        <EditorialList items={highlightItems} />
      </SubGuideLayout>
      <GuideDetailSheet
        item={activeSheet}
        onClose={() => setActiveSheet(null)}
        isMobile={isMobile}
      />
    </>
  );
}
