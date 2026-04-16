import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import SubGuideLayout from '@components/guide/SubGuideLayout';
import { SubLabel, Prose, EditorialList, ContentList } from '@components/guide';
import GuideDetailSheet from '@components/guide/GuideDetailSheet';
import { PARKS, TOWNS, HIGHLIGHTS, WILDLIFE, TIMING_WINDOWS } from '@data/guides/joshua-tree-constants';

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
  lat: 33.87,
  lng: -115.9,
}));

export default function JoshuaTreeKnowThePlace() {
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
        <title>Terrain & Parks Guide | Joshua Tree | Lila</title>
        <meta name="description" content="Terrain, geology, parks, towns, and desert wildlife across the Joshua Tree orbit." />
      </Helmet>
      <SubGuideLayout
        title="Terrain & Parks Guide"
        descriptor="Terrain, geology, parks, towns, and desert wildlife across the orbit."
        backPath="/destinations/joshua-tree"
        backLabel="Joshua Tree Guide"
      >
        <SubLabel>The Terrain</SubLabel>
        <Prose>
          Joshua Tree sits at the convergence of two deserts — the Mojave and the Colorado — and that collision is part of what makes it singular. The high desert is cool and boulder-studded, carpeted in the alien silhouettes of Yucca brevifolia. Drop below the transition zone into the Colorado Desert and the landscape shifts: more open, more stark, warmer. The park covers 800,000 acres. Most visitors see a fraction of it.
        </Prose>
        <EditorialList items={parkItems} />

        <SubLabel>The Towns</SubLabel>
        <Prose>
          The surrounding communities each add a distinct layer. The town of Joshua Tree is small, arty, and increasingly a destination in itself. Twentynine Palms is the working town with the quietest skies. Pioneertown was built as a movie set in 1946 and never entirely stopped performing. Palm Springs is 45 minutes south: mid-century architecture, serious spas, a counterpoint when you want polished comfort after days in the dust.
        </Prose>
        <EditorialList items={townItems} />

        <SubLabel>Places That Stop You</SubLabel>
        <Prose>
          The park's highlights range from easy sunset viewpoints to full-day scrambles. These are the ones we build trips around.
        </Prose>
        <EditorialList items={highlightItems} />

        <SubLabel>When to Go</SubLabel>
        <Prose>
          The desert transforms with the seasons. These are the moments when the land is most alive.
        </Prose>
        <EditorialList items={TIMING_WINDOWS} />

        <SubLabel>Desert Wildlife</SubLabel>
        <Prose>
          The park supports a surprising diversity of life. Most of it is nocturnal, subtle, and easy to miss unless you slow down.
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
