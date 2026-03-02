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
//   /ethos/philosophy               → Philosophy deep-dive (four principles × five traditions)
//   /ways-to-travel                → Ways to Travel (how to get started)
//   /trips/:slug                   → Individual Threshold Trip detail
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
//   2. Import it below
//   3. Add a specific <Route> ABOVE the generic :slug route
//      (React Router matches top-to-bottom, first match wins)
//
// ─── HOW TO ADD A NEW ITINERARY ──────────────────────────────────────────────
//
//   1. Create your itinerary in src/itineraries/<destination>/
//   2. Import the main component below
//   3. Add a <Route> under the Itineraries section
//
// ═══════════════════════════════════════════════════════════════════════════════

import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { C } from '@data/brand';

// ─── Pages ──────────────────────────────────────────────────────────────────
import HomePage from '@pages/Home';
import DestinationsPage from '@pages/Destinations';
import DestinationGuide from '@pages/DestinationGuide';
import EthosPage from '@pages/Ethos';              // renamed from Approach.jsx
import EthosDetail from '@pages/RitualDetail';     // TODO: rename file to EthosDetail.jsx
import WaysToTravelPage from '@pages/HowItWorks';  // TODO: rename file to WaysToTravel.jsx
import ContactPage from '@pages/Contact';
import PlanMyTrip from '@pages/PlanMyTrip';
import NotFound from '@pages/NotFound';
import GroupTripsPage from '@pages/GroupTrips';
import PhilosophyPage from '@pages/Philosophy';
import TripPage from '@pages/trips/TripPage';
import ItineraryResults from './pages/ItineraryResults';

// ─── Dedicated Guides ───────────────────────────────────────────────────────
import ZionGuide from '@pages/guides/ZionGuide';
// import BigSurGuide from '@pages/guides/BigSurGuide';
// import JoshuaTreeGuide from '@pages/guides/JoshuaTreeGuide';

// ─── Itineraries ────────────────────────────────────────────────────────────
import UtahTripGuide from './itineraries/utah/UtahTripGuide';
// import BigSurItinerary from './itineraries/bigsur/BigSurItinerary';
// import ZionAutumnItinerary from './itineraries/zion-autumn/ZionAutumnItinerary';

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
    <div style={{
      fontFamily: "'Quicksand', sans-serif",
      background: C.cream,
      color: C.darkInk,
      overflowX: "hidden",
    }}>
      <BrowserRouter>
        <ScrollToTop />
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
          {/* <Route path="/destinations/big-sur" element={<BigSurGuide />} /> */}
          {/* ↓ Generic guide for destinations without a dedicated page */}
          <Route path="/destinations/:slug" element={<DestinationGuide />} />

          {/* Group Trips */}
          <Route path="/group-trips" element={<GroupTripsPage />} />

          {/* Ethos (formerly "Our Approach") */}
          <Route path="/ethos" element={<EthosPage />} />
          <Route path="/ethos/philosophy" element={<PhilosophyPage />} />
          <Route path="/ethos/:slug" element={<EthosDetail />} />

          {/* Trips (Threshold Trip detail pages) */}
          <Route path="/trips/:slug" element={<TripPage />} />

          {/* Itineraries (self-contained trip guides) */}
          <Route path="/itineraries/utah" element={<UtahTripGuide />} />
          {/* <Route path="/itineraries/big-sur" element={<BigSurItinerary />} /> */}
          {/* <Route path="/itineraries/zion-autumn" element={<ZionAutumnItinerary />} /> */}

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
      </BrowserRouter>
    </div>
  );
}
