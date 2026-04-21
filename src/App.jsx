// ═══════════════════════════════════════════════════════════════════════════════
// APP — Router wrapper & site map
// ═══════════════════════════════════════════════════════════════════════════════
//
// SITE MAP:
//
//   /                              → Homepage
//   /plan                          → Trip Planner (full-screen onboarding flow)
//   /destinations                  → Destinations landing (grid of all destinations)
//   /destinations/zion-canyon      → Dedicated Zion guide (custom page)
//   /destinations/:slug            → Generic destination guide (auto-generated)
//   /group-trips                   → Group Trips landing (Threshold Trips)
//   /practice                       → Practice Library (four card deck landing page)
//   /ethos                         → Ethos (three braids + philosophy)
//   /ethos/:slug                   → Individual philosophy detail
//   /ethos/philosophy               → Philosophy deep-dive (five principles × five traditions)
//   /ethos/practices                → Practices Explorer (interactive wisdom layer browser)
//   /practice/meditations            → Lila Meditations (30-card deck explorer)
//   /practice/teachings             → Lila Teachings (30-concept tradition deck)
//   /practice/movements             → Lila Movements (body science card deck)
//   /ways-to-travel                → Ways to Travel (how to get started)
//   /trips/:slug                   → Individual Threshold Trip detail
//   /trip/:token                   → Saved/shared itinerary (loaded via share token)
//   /itineraries/utah              → Utah National Parks itinerary (PWA trip guide)
//   /contact                       → Contact page
//   *                              → 404
//
// ─── HOW TO ADD A NEW PAGE ───────────────────────────────────────────────────
//
//   1. Create your page component in src/pages/  (e.g. About.jsx)
//   2. Import it below
//   3. Add a <Route> with the path pattern
//   4. (Optional) Add a nav link in src/components/Nav.jsx
//   5. (Optional) Add a footer link in src/components/Footer.jsx
//
// ─── HOW TO ADD A NEW DEDICATED GUIDE ────────────────────────────────────────
//
//   1. Create your guide in src/pages/guides/  (e.g. BigSurGuide.jsx)
//   2. Import it below (via React.lazy)
//   3. Add a specific <Route> ABOVE the generic :slug route
//      (React Router matches top-to-bottom, first match wins)
//
// ─── HOW TO ADD A NEW ITINERARY ──────────────────────────────────────────────
//
//   1. Create your itinerary in src/itineraries/<destination>/
//   2. Import the main component below (via React.lazy)
//   3. Add a <Route> under the Itineraries section
//
// ═══════════════════════════════════════════════════════════════════════════════

import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect, lazy, Suspense } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { C } from '@data/brand';
import FeedbackWidget from '@components/FeedbackWidget';

// ─── Loading Spinner ─────────────────────────────────────────────────────────
function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-cream">
      <div
        className="w-7 h-7 rounded-full animate-lila-spin"
        style={{
          /* dynamic */ border: `2px solid ${C.oceanTeal}30`,
          /* dynamic */ borderTopColor: C.oceanTeal,
        }}
      />
    </div>
  );
}

// ─── Lazy Pages ─────────────────────────────────────────────────────────────
const HomePage = lazy(() => import('@pages/Home'));
const DestinationsPage = lazy(() => import('@pages/Destinations'));
const DestinationGuide = lazy(() => import('@pages/DestinationGuide'));
const EthosPage = lazy(() => import('@pages/Ethos'));
const EthosDetail = lazy(() => import('@pages/RitualDetail'));
const WaysToTravelPage = lazy(() => import('@pages/HowItWorks'));
const ContactPage = lazy(() => import('@pages/Contact'));
const PlanMyTrip = lazy(() => import('@pages/PlanMyTrip'));
const NotFound = lazy(() => import('@pages/NotFound'));
const GroupTripsPage = lazy(() => import('@pages/GroupTrips'));
const PhilosophyPage = lazy(() => import('@pages/Philosophy'));
const PracticesExplorerPage = lazy(() => import('@pages/PracticesExplorer'));
const MeditationsPage = lazy(() => import('@pages/Meditations'));
const TeachingsDeckPage = lazy(() => import('@pages/ethos/TeachingsDeck'));
const MovementsL1Page = lazy(() => import('@pages/MovementsL1'));
const MovementsL2Page = lazy(() => import('@pages/MovementsL2'));
const PracticeLibraryPage = lazy(() => import('@pages/PracticeLibrary'));
const TripPage = lazy(() => import('@pages/trips/TripPage'));
const ItineraryResults = lazy(() => import('./pages/ItineraryResults'));

// ─── Dedicated Guides ───────────────────────────────────────────────────────
const ZionGuide = lazy(() => import('@pages/guides/ZionGuide'));
const ZionKnowThePlace = lazy(() => import('@pages/guides/zion/ZionKnowThePlace'));
const ZionWhenToGo = lazy(() => import('@pages/guides/zion/ZionWhenToGo'));
const ZionMove = lazy(() => import('@pages/guides/zion/ZionMove'));
const ZionSleep = lazy(() => import('@pages/guides/zion/ZionSleep'));
const ZionEat = lazy(() => import('@pages/guides/zion/ZionEat'));
const ZionBreathe = lazy(() => import('@pages/guides/zion/ZionBreathe'));
const ZionNightSky = lazy(() => import('@pages/guides/zion/ZionNightSky'));
const ZionBeThere = lazy(() => import('@pages/guides/zion/ZionBeThere'));
const ZionExperience = lazy(() => import('@pages/guides/zion/ZionExperience'));
const BigSurGuide = lazy(() => import('@pages/guides/BigSurGuide'));
const BigSurKnowThePlace = lazy(() => import('@pages/guides/bigSur/BigSurKnowThePlace'));
const BigSurBeThere = lazy(() => import('@pages/guides/bigSur/BigSurBeThere'));
const BigSurSleep = lazy(() => import('@pages/guides/bigSur/BigSurSleep'));
const BigSurEat = lazy(() => import('@pages/guides/bigSur/BigSurEat'));
const BigSurMove = lazy(() => import('@pages/guides/bigSur/BigSurMove'));
const BigSurBreathe = lazy(() => import('@pages/guides/bigSur/BigSurBreathe'));
const BigSurExperience = lazy(() => import('@pages/guides/bigSur/BigSurExperience'));
const BigSurNightSky = lazy(() => import('@pages/guides/bigSur/BigSurNightSky'));
const JoshuaTreeGuide = lazy(() => import('@pages/guides/JoshuaTreeGuide'));
const JoshuaTreeKnowThePlace = lazy(() => import('@pages/guides/joshuaTree/JoshuaTreeKnowThePlace'));
const JoshuaTreeBeThere = lazy(() => import('@pages/guides/joshuaTree/JoshuaTreeBeThere'));
const JoshuaTreeSleep = lazy(() => import('@pages/guides/joshuaTree/JoshuaTreeSleep'));
const JoshuaTreeEat = lazy(() => import('@pages/guides/joshuaTree/JoshuaTreeEat'));
const JoshuaTreeMove = lazy(() => import('@pages/guides/joshuaTree/JoshuaTreeMove'));
const JoshuaTreeBreathe = lazy(() => import('@pages/guides/joshuaTree/JoshuaTreeBreathe'));
const JoshuaTreeExperience = lazy(() => import('@pages/guides/joshuaTree/JoshuaTreeExperience'));
const JoshuaTreeNightSky = lazy(() => import('@pages/guides/joshuaTree/JoshuaTreeNightSky'));
const OlympicPeninsulaGuide = lazy(() => import('@pages/guides/OlympicPeninsulaGuide'));
const OlympicPeninsulaKnowThePlace = lazy(() => import('@pages/guides/olympicPeninsula/OlympicPeninsulaKnowThePlace'));
const OlympicPeninsulaBeThere = lazy(() => import('@pages/guides/olympicPeninsula/OlympicPeninsulaBeThere'));
const OlympicPeninsulaSleep = lazy(() => import('@pages/guides/olympicPeninsula/OlympicPeninsulaSleep'));
const OlympicPeninsulaEat = lazy(() => import('@pages/guides/olympicPeninsula/OlympicPeninsulaEat'));
const OlympicPeninsulaMove = lazy(() => import('@pages/guides/olympicPeninsula/OlympicPeninsulaMove'));
const OlympicPeninsulaBreathe = lazy(() => import('@pages/guides/olympicPeninsula/OlympicPeninsulaBreathe'));
const OlympicPeninsulaExperience = lazy(() => import('@pages/guides/olympicPeninsula/OlympicPeninsulaExperience'));
const OlympicPeninsulaNightSky = lazy(() => import('@pages/guides/olympicPeninsula/OlympicPeninsulaNightSky'));
const VancouverIslandGuide = lazy(() => import('@pages/guides/VancouverIslandGuide'));
const VancouverIslandKnowThePlace = lazy(() => import('@pages/guides/vancouverIsland/VancouverIslandKnowThePlace'));
const VancouverIslandBeThere = lazy(() => import('@pages/guides/vancouverIsland/VancouverIslandBeThere'));
const VancouverIslandSleep = lazy(() => import('@pages/guides/vancouverIsland/VancouverIslandSleep'));
const VancouverIslandEat = lazy(() => import('@pages/guides/vancouverIsland/VancouverIslandEat'));
const VancouverIslandMove = lazy(() => import('@pages/guides/vancouverIsland/VancouverIslandMove'));
const VancouverIslandBreathe = lazy(() => import('@pages/guides/vancouverIsland/VancouverIslandBreathe'));
const VancouverIslandExperience = lazy(() => import('@pages/guides/vancouverIsland/VancouverIslandExperience'));
const VancouverIslandNightSky = lazy(() => import('@pages/guides/vancouverIsland/VancouverIslandNightSky'));
const KauaiGuide = lazy(() => import('@pages/guides/KauaiGuide'));
const KauaiKnowThePlace = lazy(() => import('@pages/guides/kauai/KauaiKnowThePlace'));
const KauaiBeThere = lazy(() => import('@pages/guides/kauai/KauaiBeThere'));
const KauaiSleep = lazy(() => import('@pages/guides/kauai/KauaiSleep'));
const KauaiEat = lazy(() => import('@pages/guides/kauai/KauaiEat'));
const KauaiMove = lazy(() => import('@pages/guides/kauai/KauaiMove'));
const KauaiBreathe = lazy(() => import('@pages/guides/kauai/KauaiBreathe'));
const KauaiExperience = lazy(() => import('@pages/guides/kauai/KauaiExperience'));
const KauaiNightSky = lazy(() => import('@pages/guides/kauai/KauaiNightSky'));

// ─── Itineraries ────────────────────────────────────────────────────────────
const UtahTripGuide = lazy(() => import('./itineraries/utah/UtahTripGuide'));

// ─── Scroll to top on route change ──────────────────────────────────────────
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);
  return null;
}

// ─── App ────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <div className="font-body bg-cream text-dark-ink overflow-x-clip">
      <BrowserRouter>
        <ScrollToTop />
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            {/* Homepage */}
            <Route path="/" element={<HomePage />} />

            {/* Trip Planner — full-screen onboarding (no Nav/Footer) */}
            <Route path="/plan" element={<PlanMyTrip />} />
            <Route path="/itinerary" element={<ItineraryResults />} />

            {/* Destinations */}
            <Route path="/destinations" element={<DestinationsPage />} />
            {/* ↓ Dedicated guides go HERE (above the generic :slug catch-all) */}
            <Route path="/destinations/zion" element={<ZionGuide />} />
            <Route path="/destinations/zion/terrain-and-parks" element={<ZionKnowThePlace />} />
            <Route path="/destinations/zion/when-to-go" element={<ZionWhenToGo />} />
            <Route path="/destinations/zion/hikes-bikes" element={<ZionMove />} />
            <Route path="/destinations/zion/where-to-stay" element={<ZionSleep />} />
            <Route path="/destinations/zion/where-to-eat" element={<ZionEat />} />
            <Route path="/destinations/zion/yoga-mindfulness" element={<ZionBreathe />} />
            <Route path="/destinations/zion/stars-and-sky" element={<ZionNightSky />} />
            <Route path="/destinations/zion/travel-lightly" element={<ZionBeThere />} />
            <Route path="/destinations/zion/arts-and-culture" element={<ZionExperience />} />
            {/* Redirects from old paths */}
            <Route path="/destinations/zion/know-the-place" element={<Navigate to="/destinations/zion/terrain-and-parks" replace />} />
            <Route path="/destinations/zion/move" element={<Navigate to="/destinations/zion/hikes-bikes" replace />} />
            <Route path="/destinations/zion/sleep" element={<Navigate to="/destinations/zion/where-to-stay" replace />} />
            <Route path="/destinations/zion/eat" element={<Navigate to="/destinations/zion/where-to-eat" replace />} />
            <Route path="/destinations/zion/breathe" element={<Navigate to="/destinations/zion/yoga-mindfulness" replace />} />
            <Route path="/destinations/zion/night-sky" element={<Navigate to="/destinations/zion/stars-and-sky" replace />} />
            <Route path="/destinations/zion/be-there-well" element={<Navigate to="/destinations/zion/travel-lightly" replace />} />
            <Route path="/destinations/zion/experience" element={<Navigate to="/destinations/zion/arts-and-culture" replace />} />
            <Route path="/destinations/zion-canyon" element={<Navigate to="/destinations/zion" replace />} />
            {/* Big Sur */}
            <Route path="/destinations/big-sur" element={<BigSurGuide />} />
            <Route path="/destinations/big-sur/terrain-and-parks" element={<BigSurKnowThePlace />} />
            <Route path="/destinations/big-sur/travel-lightly" element={<BigSurBeThere />} />
            <Route path="/destinations/big-sur/where-to-stay" element={<BigSurSleep />} />
            <Route path="/destinations/big-sur/where-to-eat" element={<BigSurEat />} />
            <Route path="/destinations/big-sur/hikes-bikes" element={<BigSurMove />} />
            <Route path="/destinations/big-sur/yoga-mindfulness" element={<BigSurBreathe />} />
            <Route path="/destinations/big-sur/arts-and-culture" element={<BigSurExperience />} />
            <Route path="/destinations/big-sur/stars-and-sky" element={<BigSurNightSky />} />
            {/* Joshua Tree */}
            <Route path="/destinations/joshua-tree" element={<JoshuaTreeGuide />} />
            <Route path="/destinations/joshua-tree/terrain-and-parks" element={<JoshuaTreeKnowThePlace />} />
            <Route path="/destinations/joshua-tree/travel-lightly" element={<JoshuaTreeBeThere />} />
            <Route path="/destinations/joshua-tree/where-to-stay" element={<JoshuaTreeSleep />} />
            <Route path="/destinations/joshua-tree/where-to-eat" element={<JoshuaTreeEat />} />
            <Route path="/destinations/joshua-tree/hikes-bikes" element={<JoshuaTreeMove />} />
            <Route path="/destinations/joshua-tree/yoga-mindfulness" element={<JoshuaTreeBreathe />} />
            <Route path="/destinations/joshua-tree/arts-and-culture" element={<JoshuaTreeExperience />} />
            <Route path="/destinations/joshua-tree/stars-and-sky" element={<JoshuaTreeNightSky />} />
            {/* Olympic Peninsula */}
            <Route path="/destinations/olympic-peninsula" element={<OlympicPeninsulaGuide />} />
            <Route path="/destinations/olympic-peninsula/terrain-and-parks" element={<OlympicPeninsulaKnowThePlace />} />
            <Route path="/destinations/olympic-peninsula/travel-lightly" element={<OlympicPeninsulaBeThere />} />
            <Route path="/destinations/olympic-peninsula/where-to-stay" element={<OlympicPeninsulaSleep />} />
            <Route path="/destinations/olympic-peninsula/where-to-eat" element={<OlympicPeninsulaEat />} />
            <Route path="/destinations/olympic-peninsula/hikes-bikes" element={<OlympicPeninsulaMove />} />
            <Route path="/destinations/olympic-peninsula/yoga-mindfulness" element={<OlympicPeninsulaBreathe />} />
            <Route path="/destinations/olympic-peninsula/arts-and-culture" element={<OlympicPeninsulaExperience />} />
            <Route path="/destinations/olympic-peninsula/stars-and-sky" element={<OlympicPeninsulaNightSky />} />
            {/* Vancouver Island */}
            <Route path="/destinations/vancouver-island" element={<VancouverIslandGuide />} />
            <Route path="/destinations/vancouver-island/terrain-and-parks" element={<VancouverIslandKnowThePlace />} />
            <Route path="/destinations/vancouver-island/travel-lightly" element={<VancouverIslandBeThere />} />
            <Route path="/destinations/vancouver-island/where-to-stay" element={<VancouverIslandSleep />} />
            <Route path="/destinations/vancouver-island/where-to-eat" element={<VancouverIslandEat />} />
            <Route path="/destinations/vancouver-island/hikes-bikes" element={<VancouverIslandMove />} />
            <Route path="/destinations/vancouver-island/yoga-mindfulness" element={<VancouverIslandBreathe />} />
            <Route path="/destinations/vancouver-island/arts-and-culture" element={<VancouverIslandExperience />} />
            <Route path="/destinations/vancouver-island/stars-and-sky" element={<VancouverIslandNightSky />} />
            {/* Kauai */}
            <Route path="/destinations/kauai" element={<KauaiGuide />} />
            <Route path="/destinations/kauai/terrain-and-parks" element={<KauaiKnowThePlace />} />
            <Route path="/destinations/kauai/travel-lightly" element={<KauaiBeThere />} />
            <Route path="/destinations/kauai/where-to-stay" element={<KauaiSleep />} />
            <Route path="/destinations/kauai/where-to-eat" element={<KauaiEat />} />
            <Route path="/destinations/kauai/hikes-bikes" element={<KauaiMove />} />
            <Route path="/destinations/kauai/yoga-mindfulness" element={<KauaiBreathe />} />
            <Route path="/destinations/kauai/arts-and-culture" element={<KauaiExperience />} />
            <Route path="/destinations/kauai/stars-and-sky" element={<KauaiNightSky />} />
            {/* ↓ Generic guide for destinations without a dedicated page */}
            <Route path="/destinations/:slug" element={<DestinationGuide />} />

            {/* Group Trips */}
            <Route path="/group-trips" element={<GroupTripsPage />} />

            {/* Practice Library */}
            <Route path="/practice" element={<PracticeLibraryPage />} />

            {/* Ethos (formerly "Our Approach") */}
            <Route path="/ethos" element={<EthosPage />} />
            <Route path="/ethos/philosophy" element={<PhilosophyPage />} />
            <Route path="/ethos/practices" element={<PracticesExplorerPage />} />
            <Route path="/practice/meditations" element={<MeditationsPage />} />
            <Route path="/practice/teachings" element={<TeachingsDeckPage />} />
            <Route path="/practice/movements" element={<Navigate to="/practice/movements/practice" replace />} />
            <Route path="/practice/movements/practice" element={<MovementsL1Page />} />
            <Route path="/practice/movements/science" element={<MovementsL2Page />} />
            <Route path="/ethos/:slug" element={<EthosDetail />} />

            {/* Trips (Threshold Trip detail pages) */}
            <Route path="/trips/:slug" element={<TripPage />} />

            {/* Saved/shared itinerary via share token */}
            <Route path="/trip/:token" element={<ItineraryResults />} />

            {/* Itineraries (self-contained trip guides) */}
            <Route path="/itineraries/utah" element={<UtahTripGuide />} />

            {/* Ways to Travel (formerly "How It Works") */}
            <Route path="/ways-to-travel" element={<WaysToTravelPage />} />

            {/* Other pages */}
            <Route path="/contact" element={<ContactPage />} />

            {/* ─── Redirects from old routes ───────────────────────────────── */}
            <Route path="/approach" element={<Navigate to="/ethos" replace />} />
            <Route path="/approach/philosophy" element={<Navigate to="/ethos/philosophy" replace />} />
            <Route path="/approach/:slug" element={<Navigate to="/ethos" replace />} />
            <Route path="/ethos/meditations" element={<Navigate to="/practice/meditations" replace />} />
            <Route path="/ethos/teachings" element={<Navigate to="/practice/teachings" replace />} />
            <Route path="/ethos/movements" element={<Navigate to="/practice/movements" replace />} />
            <Route path="/ethos/movements/practice" element={<Navigate to="/practice/movements/practice" replace />} />
            <Route path="/ethos/movements/science" element={<Navigate to="/practice/movements/science" replace />} />
            <Route path="/how-it-works" element={<Navigate to="/ways-to-travel" replace />} />

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
      <Analytics />
      <FeedbackWidget source="Lila Trips" hideOnPaths={['/plan']} showAfterScroll={400} />
    </div>
  );
}
