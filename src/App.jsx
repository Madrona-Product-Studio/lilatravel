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
//   /ethos                         → Ethos (three braids + philosophy)
//   /ethos/:slug                   → Individual philosophy detail
//   /ethos/philosophy               → Philosophy deep-dive (five principles × five traditions)
//   /ethos/practices                → Practices Explorer (interactive wisdom layer browser)
//   /ethos/meditations              → Lila Meditations (30-card deck explorer)
//   /ethos/movements               → Lila Movements (body science card deck)
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
const MovementsPage = lazy(() => import('@pages/Movements'));
const TripPage = lazy(() => import('@pages/trips/TripPage'));
const ItineraryResults = lazy(() => import('./pages/ItineraryResults'));

// ─── Dedicated Guides ───────────────────────────────────────────────────────
const ZionGuide = lazy(() => import('@pages/guides/ZionGuide'));
const BigSurGuide = lazy(() => import('@pages/guides/BigSurGuide'));
const JoshuaTreeGuide = lazy(() => import('@pages/guides/JoshuaTreeGuide'));
const OlympicPeninsulaGuide = lazy(() => import('@pages/guides/OlympicPeninsulaGuide'));
const VancouverIslandGuide = lazy(() => import('@pages/guides/VancouverIslandGuide'));
const KauaiGuide = lazy(() => import('@pages/guides/KauaiGuide'));

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
            <Route path="/destinations/zion-canyon" element={<ZionGuide />} />
            <Route path="/destinations/big-sur" element={<BigSurGuide />} />
            <Route path="/destinations/joshua-tree" element={<JoshuaTreeGuide />} />
            <Route path="/destinations/olympic-peninsula" element={<OlympicPeninsulaGuide />} />
            <Route path="/destinations/vancouver-island" element={<VancouverIslandGuide />} />
            <Route path="/destinations/kauai" element={<KauaiGuide />} />
            {/* ↓ Generic guide for destinations without a dedicated page */}
            <Route path="/destinations/:slug" element={<DestinationGuide />} />

            {/* Group Trips */}
            <Route path="/group-trips" element={<GroupTripsPage />} />

            {/* Ethos (formerly "Our Approach") */}
            <Route path="/ethos" element={<EthosPage />} />
            <Route path="/ethos/philosophy" element={<PhilosophyPage />} />
            <Route path="/ethos/practices" element={<PracticesExplorerPage />} />
            <Route path="/ethos/meditations" element={<MeditationsPage />} />
            <Route path="/ethos/movements" element={<MovementsPage />} />
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
            <Route path="/how-it-works" element={<Navigate to="/ways-to-travel" replace />} />

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
      <Analytics />
    </div>
  );
}
