// ═══════════════════════════════════════════════════════════════════════════════
// PAGE: OLYMPIC PENINSULA GUIDE (coming soon placeholder)
// ═══════════════════════════════════════════════════════════════════════════════
//
// Route: /destinations/olympic-peninsula
//

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Nav, Footer, FadeIn, Breadcrumb } from '@components';
import { C } from '@data/brand';
import { P } from '@data/photos';

export default function OlympicPeninsulaGuide() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <>
      <Nav />

      {/* Hero */}
      <section style={{
        position: "relative",
        height: isMobile ? 340 : 480,
        background: `url(${P.olympic}) center/cover no-repeat`,
      }}>
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to bottom, rgba(10,18,26,0.25) 0%, rgba(10,18,26,0.65) 100%)",
          display: "flex", flexDirection: "column", justifyContent: "flex-end",
          padding: isMobile ? "32px 20px" : "52px 52px",
        }}>
          <div style={{ maxWidth: 920, margin: "0 auto", width: "100%" }}>
            <FadeIn from="bottom" delay={0.1}>
              <Breadcrumb items={[
                { label: "Home", to: "/" },
                { label: "Destinations", to: "/destinations" },
                { label: "Olympic Peninsula" },
              ]} light />
              <h1 style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "clamp(38px, 6vw, 64px)", fontWeight: 300,
                color: "white", lineHeight: 1.0,
                margin: "16px 0 10px", letterSpacing: "-0.02em",
              }}>
                Olympic Peninsula
              </h1>
              <p style={{
                fontFamily: "'Quicksand', sans-serif",
                fontSize: "clamp(14px, 1.6vw, 15px)", fontWeight: 400,
                color: "rgba(255,255,255,0.8)", maxWidth: 460,
                margin: 0, lineHeight: 1.6,
              }}>
                Three ecosystems in one. Rainforest, glacial peaks, wild Pacific coast.
              </p>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Coming Soon */}
      <section style={{
        padding: isMobile ? "80px 20px" : "120px 52px",
        background: C.cream, textAlign: "center",
      }}>
        <FadeIn>
          <div style={{ maxWidth: 520, margin: "0 auto" }}>
            <span style={{
              fontFamily: "'Quicksand', sans-serif",
              fontSize: 12, fontWeight: 700,
              letterSpacing: "0.28em", textTransform: "uppercase",
              color: C.skyBlue, display: "block", marginBottom: 16,
            }}>Coming Soon</span>
            <h2 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(26px, 4vw, 36px)", fontWeight: 300,
              color: C.darkInk, margin: "0 0 16px", lineHeight: 1.2,
            }}>This guide is being woven together.</h2>
            <p style={{
              fontFamily: "'Quicksand', sans-serif",
              fontSize: "clamp(14px, 1.6vw, 15px)", fontWeight: 400,
              color: "#4A5650", lineHeight: 1.7, margin: "0 0 36px",
            }}>
              We're walking the moss-draped trails, timing the salmon runs, and listening to the rain on old-growth canopy. Check back soon — or start planning now.
            </p>
            <Link to="/plan" style={{
              display: "inline-block",
              padding: "14px 36px",
              background: C.darkInk, color: "#fff",
              fontFamily: "'Quicksand', sans-serif",
              fontSize: 12, fontWeight: 700,
              letterSpacing: "0.2em", textTransform: "uppercase",
              textDecoration: "none", transition: "opacity 0.2s",
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
            onMouseLeave={e => e.currentTarget.style.opacity = "1"}
            >Plan a Trip</Link>
          </div>
        </FadeIn>
      </section>

      <Footer />
    </>
  );
}
