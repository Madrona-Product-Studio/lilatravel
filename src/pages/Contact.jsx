// ═══════════════════════════════════════════════════════════════════════════════
// PAGE: CONTACT
// ═══════════════════════════════════════════════════════════════════════════════

import { useState } from 'react';
import { Nav, Footer, FadeIn } from '@components';
import { C } from '@data/brand';
import { trackEvent } from '@utils/analytics';

const CATEGORIES = [
  { value: "Trip Planning", detail: "Custom itineraries, group trips, timing advice" },
  { value: "Partnerships", detail: "Lodges, guides, wellness practitioners" },
  { value: "General", detail: "Questions, feedback, or just to say hello" },
];

const INPUT_STYLE = {
  width: "100%",
  padding: "12px 16px",
  border: `1px solid ${C.stone}`,
  background: "#fff",
  fontFamily: "'Quicksand', sans-serif",
  fontSize: 14, fontWeight: 400,
  color: C.darkInk,
  outline: "none",
  transition: "border-color 0.2s",
  boxSizing: "border-box",
};

const LABEL_STYLE = {
  fontFamily: "'Quicksand', sans-serif",
  fontSize: 10, fontWeight: 700,
  letterSpacing: "0.18em", textTransform: "uppercase",
  color: "#7A857E", marginBottom: 8, display: "block",
};

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [category, setCategory] = useState("General");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error

  const canSubmit = email.includes("@") && message.trim().length > 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit || status === "sending") return;

    setStatus("sending");
    trackEvent("contact_form_submitted", { category });

    try {
      const res = await fetch("/api/send-contact-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, category, message }),
      });
      if (!res.ok) throw new Error("Send failed");
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  };

  return (
    <>
      <Nav />

      {/* Hero */}
      <section className="contact-hero" style={{
        background: C.darkInk,
        padding: "160px 52px 80px",
        textAlign: "center",
      }}>
        <FadeIn from="bottom" delay={0.1}>
          <span style={{
            fontFamily: "'Quicksand', sans-serif",
            fontSize: 11, fontWeight: 700,
            letterSpacing: "0.28em", textTransform: "uppercase",
            color: C.goldenAmber, display: "block", marginBottom: 20,
          }}>Get in Touch</span>
          <h1 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "clamp(36px, 6vw, 56px)", fontWeight: 300,
            color: "white", lineHeight: 1.1,
            margin: "0 0 20px", letterSpacing: "-0.02em",
          }}>
            We'd love to hear from you.
          </h1>
          <p style={{
            fontFamily: "'Quicksand', sans-serif",
            fontSize: "clamp(14px, 1.8vw, 16px)", fontWeight: 400,
            color: "rgba(255,255,255,0.55)", lineHeight: 1.7,
            maxWidth: 480, margin: "0 auto",
          }}>
            Whether you have a question about a destination, want help planning a trip, or just want to say hello — we're here.
          </p>
        </FadeIn>
      </section>

      {/* Contact Form */}
      <section className="contact-body" style={{
        padding: "80px 52px 100px",
        background: C.cream,
      }}>
        <div style={{ maxWidth: 520, margin: "0 auto" }}>
          <FadeIn delay={0.15}>

            {status === "sent" ? (
              <div style={{
                padding: "60px 36px",
                border: `1px solid ${C.stone}`,
                background: C.warmWhite,
                textAlign: "center",
              }}>
                <div style={{
                  fontFamily: "'Quicksand', sans-serif",
                  fontSize: 10, fontWeight: 700,
                  letterSpacing: "0.22em", textTransform: "uppercase",
                  color: C.seaGlass, marginBottom: 16,
                }}>Message Sent</div>
                <div style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "clamp(22px, 3vw, 28px)", fontWeight: 400,
                  color: C.darkInk, marginBottom: 12,
                }}>Thanks for reaching out.</div>
                <p style={{
                  fontFamily: "'Quicksand', sans-serif",
                  fontSize: 14, fontWeight: 400,
                  color: "#7A857E", lineHeight: 1.65, margin: 0,
                }}>We'll get back to you soon — usually within a day.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                {/* Category selector */}
                <div style={{ marginBottom: 28 }}>
                  <label style={LABEL_STYLE}>What's this about?</label>
                  <div className="contact-grid" style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: 0,
                    border: `1px solid ${C.stone}`,
                  }}>
                    {CATEGORIES.map((cat, i) => {
                      const isActive = category === cat.value;
                      return (
                        <button
                          key={cat.value}
                          type="button"
                          onClick={() => setCategory(cat.value)}
                          style={{
                            padding: "18px 12px",
                            borderRight: i < 2 ? `1px solid ${C.stone}` : "none",
                            border: "none",
                            borderBottom: `2px solid ${isActive ? C.oceanTeal : "transparent"}`,
                            background: isActive ? `${C.oceanTeal}08` : C.warmWhite,
                            cursor: "pointer",
                            textAlign: "center",
                            transition: "all 0.2s",
                          }}
                        >
                          <div style={{
                            fontFamily: "'Quicksand', sans-serif",
                            fontSize: 11, fontWeight: isActive ? 700 : 600,
                            letterSpacing: "0.12em", textTransform: "uppercase",
                            color: isActive ? C.oceanTeal : "#7A857E",
                            marginBottom: 4,
                          }}>{cat.value}</div>
                          <div style={{
                            fontFamily: "'Quicksand', sans-serif",
                            fontSize: 11, fontWeight: 400,
                            color: "#7A857E", lineHeight: 1.4,
                          }}>{cat.detail}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Name + Email row */}
                <div style={{
                  display: "grid", gridTemplateColumns: "1fr 1fr",
                  gap: 16, marginBottom: 20,
                }}>
                  <div>
                    <label style={LABEL_STYLE}>Name</label>
                    <input
                      type="text"
                      placeholder="Your name"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      style={INPUT_STYLE}
                      onFocus={e => e.target.style.borderColor = C.oceanTeal}
                      onBlur={e => e.target.style.borderColor = C.stone}
                    />
                  </div>
                  <div>
                    <label style={LABEL_STYLE}>Email *</label>
                    <input
                      type="email"
                      required
                      placeholder="your@email.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      style={INPUT_STYLE}
                      onFocus={e => e.target.style.borderColor = C.oceanTeal}
                      onBlur={e => e.target.style.borderColor = C.stone}
                    />
                  </div>
                </div>

                {/* Message */}
                <div style={{ marginBottom: 28 }}>
                  <label style={LABEL_STYLE}>Message *</label>
                  <textarea
                    required
                    placeholder="What's on your mind?"
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    rows={6}
                    style={{
                      ...INPUT_STYLE,
                      resize: "vertical",
                      minHeight: 120,
                      lineHeight: 1.65,
                    }}
                    onFocus={e => e.target.style.borderColor = C.oceanTeal}
                    onBlur={e => e.target.style.borderColor = C.stone}
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={!canSubmit || status === "sending"}
                  style={{
                    width: "100%",
                    padding: "14px 28px",
                    background: canSubmit ? C.darkInk : C.stone,
                    border: "none",
                    color: canSubmit ? "#fff" : "#7A857E",
                    fontFamily: "'Quicksand', sans-serif",
                    fontSize: 12, fontWeight: 700,
                    letterSpacing: "0.18em", textTransform: "uppercase",
                    cursor: canSubmit ? "pointer" : "default",
                    transition: "all 0.25s",
                    opacity: status === "sending" ? 0.6 : 1,
                  }}
                  onMouseEnter={e => { if (canSubmit) e.currentTarget.style.opacity = "0.85"; }}
                  onMouseLeave={e => { if (canSubmit) e.currentTarget.style.opacity = "1"; }}
                >
                  {status === "sending" ? "Sending..." : "Send Message"}
                </button>

                {status === "error" && (
                  <p style={{
                    fontFamily: "'Quicksand', sans-serif",
                    fontSize: 12, fontWeight: 500,
                    color: C.sunSalmon, textAlign: "center",
                    marginTop: 12,
                  }}>Something went wrong. Please try again or email us directly.</p>
                )}
              </form>
            )}
          </FadeIn>
        </div>
      </section>

      <Footer />

      <style>{`
        @media (max-width: 600px) {
          .contact-grid { grid-template-columns: 1fr !important; }
          .contact-grid > button { border-right: none !important; border-bottom: 1px solid ${C.stone}; }
          .contact-grid > button:last-child { border-bottom: none !important; }
        }
        @media (max-width: 768px) {
          .contact-hero { padding: 140px 20px 60px !important; }
          .contact-body { padding: 60px 20px 80px !important; }
        }
      `}</style>
    </>
  );
}
