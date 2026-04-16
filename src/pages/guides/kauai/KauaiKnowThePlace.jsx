import { Helmet } from 'react-helmet-async';
import SubGuideLayout from '@components/guide/SubGuideLayout';
import { SubLabel, Prose, EditorialList } from '@components/guide';
import { PARKS, TOWNS, WILDLIFE, TIMING_WINDOWS, ISLAND_AREAS, HIGHLIGHTS } from '@data/guides/kauai-constants';

const parkItems = PARKS.map(p => ({
  name: p.name,
  context: p.attribute || p.designation,
  detail: p.soul,
  url: p.infoUrl,
}));

const areaItems = ISLAND_AREAS.map(a => ({
  name: a.name,
  context: a.context,
  detail: a.description,
}));

const highlightItems = HIGHLIGHTS.map(h => ({
  name: h.name,
  context: h.category,
  detail: h.blurb,
}));

const wildlifeItems = WILDLIFE.map(w => ({
  name: w.name,
  detail: w.detail,
}));

export default function KauaiKnowThePlace() {
  return (
    <>
      <Helmet>
        <title>Terrain & Parks Guide | Kauai | Lila</title>
        <meta name="description" content="Parks, island areas, when to go, and wildlife across Kauai." />
      </Helmet>
      <SubGuideLayout
        title="Terrain & Parks Guide"
        descriptor="Parks, island areas, when to go, and wildlife across the Garden Isle."
        backPath="/destinations/kauai"
        backLabel="Kauai Guide"
      >
        <SubLabel>The Parks</SubLabel>
        <Prose>
          Three state parks define the terrain. Na Pali is raw and remote — fluted sea cliffs accessible only by trail, boat, or helicopter. Waimea Canyon is the geological showpiece — the Grand Canyon of the Pacific. Koke'e is the quiet interior — cool forest and lookouts at 4,000 feet.
        </Prose>
        <EditorialList items={parkItems} />

        <SubLabel>The Island</SubLabel>
        <Prose>
          Kauai has four distinct sides, each with its own weather, terrain, and character. Understanding the geography helps you plan — the North Shore and West Side are the dramatic headliners, while the South Shore and East Side provide the sun and the services.
        </Prose>
        <EditorialList items={areaItems} />

        <SubLabel>Places That Stop You</SubLabel>
        <Prose>
          These are the landmarks that define a trip to Kauai — the places you'll remember years later. Some require permits and planning. Others are visible from the road.
        </Prose>
        <EditorialList items={highlightItems} />

        <SubLabel>When to Go</SubLabel>
        <Prose>
          Kauai rewards every season differently. Whale season peaks in winter. The Kalalau Trail is best in spring. Summer calms the North Shore for swimming. Fall is the quiet shoulder.
        </Prose>
        <EditorialList items={TIMING_WINDOWS} />

        <SubLabel>Island Wildlife</SubLabel>
        <Prose>
          The island's isolation created species found nowhere else on earth. Many are endangered. Knowing what you're looking at — and how to behave around it — is part of being here.
        </Prose>
        <EditorialList items={wildlifeItems} />
      </SubGuideLayout>
    </>
  );
}
