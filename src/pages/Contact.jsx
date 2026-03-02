// ═══════════════════════════════════════════════════════════════════════════════
// PAGE: CONTACT
// ═══════════════════════════════════════════════════════════════════════════════

import { Nav, Footer, FadeIn, PageHero } from '@components';
import { C } from '@data/brand';
import { trackEvent } from '@utils/analytics';

export default function ContactPage() {
  return (
    <>
      <Nav />
      <PageHero
        eyebrow="Contact"
        title="Let's Talk"
        subtitle="Questions, custom trip requests, or just want to say hello."
        gradient={`linear-gradient(165deg, ${C.slate}, ${C.darkInk})`}
        accentColor={C.goldenAmber}
        height="50vh"
      />

      <section className="page-content" style={{ padding: "80px 52px", background: C.cream }}>
        <div style={{ maxWidth: 600, margin: "0 auto", textAlign: "center" }}>
          <FadeIn>
            <span style={{ fontSize: 32, display: "block", marginBottom: 24, opacity: 0.4 }}>{"△"}</span>
            <p style={{
              fontFamily: "'Quicksand', sans-serif",
              fontSize: 16, fontWeight: 400, color: "#5a6a78",
              lineHeight: 2.0, marginBottom: 40,
            }}>
              This page is being crafted. In the meantime, reach out and we'll get back to you with the same care we put into everything we do.
            </p>
            <a href="mailto:hello@lilatrips.com" style={{
              padding: "14px 36px", display: "inline-block",
              background: C.darkInk, color: "white",
              fontFamily: "'Quicksand'", fontSize: 11, fontWeight: 700,
              letterSpacing: "0.18em", textTransform: "uppercase",
              cursor: "pointer", transition: "opacity 0.2s", textDecoration: "none",
            }}
            onClick={() => trackEvent('contact_email_clicked', {})}
            onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
            onMouseLeave={e => e.currentTarget.style.opacity = "1"}
            >
              hello@lilatrips.com
            </a>
          </FadeIn>
        </div>
      </section>

      <Footer />
    </>
  );
}
