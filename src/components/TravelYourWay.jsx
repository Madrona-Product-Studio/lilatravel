// ─── TravelYourWay.jsx ────────────────────────────────────────────────────────
// "Travel Your Way" four-card grid used on Homepage and HowItWorks page.

import { useState } from "react";
import { Link } from "react-router-dom";
import { C } from "@data/brand";
import { trackEvent } from "@utils/analytics";

const offerings = [
  {
    icon: "☐",
    label: "DIY",
    color: C.skyBlue,
    title: "Explore the Guide",
    desc: "Browse curated picks for free — where to stay, what to hike, where to eat, and when the light is best.",
    cta: "Explore Free",
    ctaLink: "/destinations",
    detail: "Free · No account needed",
    offeringType: "diy",
  },
  {
    icon: "◎",
    label: "Plan a Trip",
    color: C.oceanTeal,
    title: "Trip Planner",
    desc: "Turn your favorites into a day-by-day itinerary with booking links, permit timing, and offline access.",
    cta: "Plan Free",
    ctaLink: "/plan",
    detail: "Free · No account needed",
    beta: true,
    offeringType: "trip_planner",
  },
  {
    icon: "☾",
    label: "Join a Group",
    color: C.sunSalmon,
    title: "Group Trips",
    desc: "Small group journeys timed to equinoxes, solstices, and natural crescendos. Eight travelers maximum.",
    cta: "View Trips",
    ctaLink: "/group-trips",
    detail: "From $895 per person",
    inDev: true,
    offeringType: "group_trips",
  },
  {
    icon: "△",
    label: "Designed for You",
    color: C.goldenAmber,
    title: "Custom Itinerary",
    desc: "Tell us your dates, group, and vibe. A real person builds a complete itinerary around your trip.",
    cta: "From $199",
    ctaLink: "/contact",
    detail: "Personalized · Human-crafted",
    inDev: true,
    offeringType: "custom",
  },
];

export default function TravelYourWay({ showHeading = true }) {
  const [hovered, setHovered] = useState(null);

  return (
    <section className="px-5 py-16 md:px-12 md:py-24 bg-cream">
      <div className="max-w-[1080px] mx-auto">

        {showHeading && (
          <div className="mb-14 max-w-[480px]">
            <span className="font-body text-[11px] font-bold tracking-[0.22em] uppercase text-sun-salmon block mb-4">
              Your Path
            </span>
            <h2 className="font-serif text-[clamp(30px,3.5vw,44px)] font-light leading-[1.15] text-dark-ink m-0 mb-[18px]">
              Travel your way
            </h2>
            <p className="font-body text-sm font-normal text-[#6a7a84] leading-[1.8] m-0">
              From free guides to fully custom itineraries —<br />
              every level of support, however deep you want to go.
            </p>
          </div>
        )}

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3.5 md:gap-4">
          {offerings.map((o, i) => {
            const isHov = hovered === i;

            return (
              <div
                key={o.label}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                className="flex flex-col cursor-default transition-[border-color,background] duration-[0.25s]"
                style={{
                  /* dynamic — border/bg color driven by card data */
                  padding: "32px 24px 28px",
                  border: `1px solid ${isHov ? o.color : "#D6CFC4"}`,
                  background: isHov ? "#FFFFFF" : "#FEFEFE",
                }}
              >
                {/* Top row: icon + status tag */}
                <div className="flex justify-between items-start mb-7">
                  <div
                    className="font-serif text-2xl leading-none transition-opacity duration-[0.25s]"
                    style={{ color: o.color, opacity: isHov ? 1 : 0.7 }}
                  >{o.icon}</div>
                  {o.beta && (
                    <span
                      className="font-body text-[9px] font-bold tracking-[0.12em] uppercase text-ocean-teal px-[7px] py-[3px]"
                      style={{ border: `1px solid ${C.oceanTeal}` }}
                    >Beta</span>
                  )}
                  {o.inDev && (
                    <span className="font-body text-[9px] font-bold tracking-[0.12em] uppercase text-[#aab0b8] border border-[#d0d5d9] px-[7px] py-[3px]">
                      In Dev
                    </span>
                  )}
                </div>

                {/* Eyebrow */}
                <span
                  className="font-body text-[10px] font-bold tracking-[0.22em] uppercase block mb-2.5"
                  style={{ color: o.color }}
                >{o.label}</span>

                {/* Title */}
                <h3 className="font-body text-[15px] font-semibold text-dark-ink m-0 mb-3.5 tracking-[0.01em] leading-[1.3]">
                  {o.title}
                </h3>

                {/* Desc */}
                <p className="font-body text-[13px] font-normal text-[#6a7a84] leading-[1.85] flex-1 m-0">
                  {o.desc}
                </p>

                {/* CTA */}
                <div className="mt-7">
                  <Link
                    to={o.ctaLink}
                    onClick={() => trackEvent("offering_cta_clicked", { offering: o.offeringType, destination_url: o.ctaLink })}
                    className="w-full block text-center font-body text-[10px] font-bold tracking-[0.18em] uppercase text-white no-underline cursor-pointer mb-2.5 transition-opacity duration-[0.25s] box-border"
                    style={{
                      /* dynamic — bg color from card data */
                      padding: "11px 16px",
                      background: o.color,
                      opacity: isHov ? 1 : 0.88,
                    }}
                  >{o.cta}</Link>
                  <span className="font-body text-[11px] text-[#aab0b8] block">
                    {o.detail}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
