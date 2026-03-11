// ─── TravelYourWay.jsx ────────────────────────────────────────────────────────
// "Travel Your Way" four-card grid used on Homepage and HowItWorks page.

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { C } from "@data/brand";
import { trackEvent } from "@utils/analytics";

const cardBg = "#FEFEFE";

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
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <section style={{ padding: isMobile ? "64px 20px" : "96px 48px", background: C.cream }}>
      <div style={{ maxWidth: 1080, margin: "0 auto" }}>

        {showHeading && (
          <div style={{ marginBottom: 56, maxWidth: 480 }}>
            <span style={{
              fontFamily: "Quicksand, sans-serif",
              fontSize: 10, fontWeight: 700,
              letterSpacing: "0.22em", textTransform: "uppercase",
              color: C.sunSalmon, display: "block", marginBottom: 16,
            }}>Your Path</span>
            <h2 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(30px, 3.5vw, 44px)",
              fontWeight: 300, lineHeight: 1.15,
              color: C.darkInk, margin: "0 0 18px",
            }}>Travel your way</h2>
            <p style={{
              fontFamily: "Quicksand, sans-serif",
              fontSize: 13, fontWeight: 400,
              color: "#6a7a84", lineHeight: 1.8,
              margin: 0,
            }}>
              From free guides to fully custom itineraries —<br />
              every level of support, however deep you want to go.
            </p>
          </div>
        )}

        {/* Cards */}
        <div style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "repeat(4, 1fr)",
          gap: isMobile ? 14 : 16,
        }}>
          {offerings.map((o, i) => {
            const isHov = hovered === i;

            return (
              <div
                key={o.label}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  padding: "32px 24px 28px",
                  border: `1px solid ${isHov ? o.color : "#D6CFC4"}`,
                  background: isHov ? "#FFFFFF" : cardBg,
                  display: "flex",
                  flexDirection: "column",
                  transition: "border-color 0.25s, background 0.25s",
                  cursor: "default",
                }}
              >
                {/* Top row: icon + status tag */}
                <div style={{
                  display: "flex", justifyContent: "space-between",
                  alignItems: "flex-start", marginBottom: 28,
                }}>
                  <div style={{
                    fontFamily: "serif",
                    fontSize: 24, color: o.color,
                    lineHeight: 1,
                    opacity: isHov ? 1 : 0.7,
                    transition: "opacity 0.25s",
                  }}>{o.icon}</div>
                  {o.beta && (
                    <span style={{
                      fontFamily: "Quicksand, sans-serif",
                      fontSize: 8, fontWeight: 700,
                      letterSpacing: "0.12em", textTransform: "uppercase",
                      color: C.oceanTeal,
                      border: `1px solid ${C.oceanTeal}`,
                      padding: "3px 7px",
                    }}>Beta</span>
                  )}
                  {o.inDev && (
                    <span style={{
                      fontFamily: "Quicksand, sans-serif",
                      fontSize: 8, fontWeight: 700,
                      letterSpacing: "0.12em", textTransform: "uppercase",
                      color: "#aab0b8",
                      border: "1px solid #d0d5d9",
                      padding: "3px 7px",
                    }}>In Dev</span>
                  )}
                </div>

                {/* Eyebrow */}
                <span style={{
                  fontFamily: "Quicksand, sans-serif",
                  fontSize: 9, fontWeight: 700,
                  letterSpacing: "0.22em", textTransform: "uppercase",
                  color: o.color, display: "block", marginBottom: 10,
                }}>{o.label}</span>

                {/* Title */}
                <h3 style={{
                  fontFamily: "Quicksand, sans-serif",
                  fontSize: 15, fontWeight: 600,
                  color: C.darkInk, margin: "0 0 14px",
                  letterSpacing: "0.01em", lineHeight: 1.3,
                }}>
                  {o.title}
                </h3>

                {/* Desc */}
                <p style={{
                  fontFamily: "Quicksand, sans-serif",
                  fontSize: 12, fontWeight: 400,
                  color: "#6a7a84", lineHeight: 1.85,
                  flex: 1, margin: 0,
                }}>{o.desc}</p>

                {/* CTA */}
                <div style={{ marginTop: 28 }}>
                  <Link
                    to={o.ctaLink}
                    onClick={() => trackEvent("offering_cta_clicked", { offering: o.offeringType, destination_url: o.ctaLink })}
                    style={{
                      width: "100%",
                      padding: "11px 16px",
                      background: o.color,
                      border: "none",
                      fontFamily: "Quicksand, sans-serif",
                      fontSize: 9, fontWeight: 700,
                      letterSpacing: "0.18em", textTransform: "uppercase",
                      color: "white",
                      cursor: "pointer",
                      display: "block",
                      marginBottom: 10,
                      opacity: isHov ? 1 : 0.88,
                      transition: "opacity 0.25s",
                      textDecoration: "none",
                      textAlign: "center",
                      boxSizing: "border-box",
                    }}
                  >{o.cta}</Link>
                  <span style={{
                    fontFamily: "Quicksand, sans-serif",
                    fontSize: 10, color: "#aab0b8",
                    display: "block",
                  }}>{o.detail}</span>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
