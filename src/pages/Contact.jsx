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
      <section className="bg-dark-ink pt-[140px] px-5 pb-[60px] md:pt-[160px] md:px-[52px] md:pb-20 text-center">
        <FadeIn from="bottom" delay={0.1}>
          <span className="font-body text-xs font-bold tracking-[0.28em] uppercase text-golden-amber block mb-5">
            Get in Touch
          </span>
          <h1 className="font-serif text-[clamp(36px,6vw,56px)] font-light text-white leading-[1.1] mb-5 -tracking-[0.02em]">
            We'd love to hear from you.
          </h1>
          <p className="font-body text-[clamp(14px,1.8vw,16px)] font-normal text-white/55 leading-[1.7] max-w-[480px] mx-auto">
            Whether you have a question about a destination, want help planning a trip, or just want to say hello — we're here.
          </p>
        </FadeIn>
      </section>

      {/* Contact Form */}
      <section className="px-5 pt-[60px] pb-20 md:px-[52px] md:pt-20 md:pb-[100px] bg-cream">
        <div className="max-w-[520px] mx-auto">
          <FadeIn delay={0.15}>

            {status === "sent" ? (
              <div className="p-[60px_36px] border border-stone bg-warm-white text-center">
                <div className="font-body text-[11px] font-bold tracking-[0.22em] uppercase text-sea-glass mb-4">
                  Message Sent
                </div>
                <div className="font-serif text-[clamp(22px,3vw,28px)] font-normal text-dark-ink mb-3">
                  Thanks for reaching out.
                </div>
                <p className="font-body text-sm font-normal text-[#7A857E] leading-[1.65] m-0">
                  We'll get back to you soon — usually within a day.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                {/* Category selector */}
                <div className="mb-7">
                  <label className="font-body text-[11px] font-bold tracking-[0.18em] uppercase text-[#7A857E] mb-2 block">
                    What's this about?
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 border border-stone">
                    {CATEGORIES.map((cat, i) => {
                      const isActive = category === cat.value;
                      return (
                        <button
                          key={cat.value}
                          type="button"
                          onClick={() => setCategory(cat.value)}
                          className="py-[18px] px-3 border-none cursor-pointer text-center transition-all duration-200 sm:[&:not(:last-child)]:border-r sm:border-r-stone"
                          style={{
                            borderBottom: `2px solid ${isActive ? C.oceanTeal : "transparent"}`,
                            background: isActive ? `${C.oceanTeal}08` : C.warmWhite,
                          }}
                        >
                          <div
                            className="font-body text-xs tracking-[0.12em] uppercase mb-1"
                            style={{
                              fontWeight: isActive ? 700 : 600,
                              color: isActive ? C.oceanTeal : "#7A857E",
                            }}
                          >
                            {cat.value}
                          </div>
                          <div className="font-body text-xs font-normal text-[#7A857E] leading-[1.4]">
                            {cat.detail}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Name + Email row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
                  <div>
                    <label className="font-body text-[11px] font-bold tracking-[0.18em] uppercase text-[#7A857E] mb-2 block">
                      Name
                    </label>
                    <input
                      type="text"
                      placeholder="Your name"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      className="w-full py-3 px-4 border border-stone bg-white font-body text-sm font-normal text-dark-ink outline-none transition-colors duration-200 box-border focus:border-ocean-teal"
                    />
                  </div>
                  <div>
                    <label className="font-body text-[11px] font-bold tracking-[0.18em] uppercase text-[#7A857E] mb-2 block">
                      Email *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="your@email.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="w-full py-3 px-4 border border-stone bg-white font-body text-sm font-normal text-dark-ink outline-none transition-colors duration-200 box-border focus:border-ocean-teal"
                    />
                  </div>
                </div>

                {/* Message */}
                <div className="mb-7">
                  <label className="font-body text-[11px] font-bold tracking-[0.18em] uppercase text-[#7A857E] mb-2 block">
                    Message *
                  </label>
                  <textarea
                    required
                    placeholder="What's on your mind?"
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    rows={6}
                    className="w-full py-3 px-4 border border-stone bg-white font-body text-sm font-normal text-dark-ink outline-none transition-colors duration-200 box-border resize-y min-h-[120px] leading-[1.65] focus:border-ocean-teal"
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={!canSubmit || status === "sending"}
                  className="w-full py-3.5 px-7 border-none font-body text-[13px] font-bold tracking-[0.18em] uppercase transition-all duration-250 hover:opacity-85 disabled:cursor-default disabled:hover:opacity-100"
                  style={{
                    background: canSubmit ? C.darkInk : C.stone,
                    color: canSubmit ? "#fff" : "#7A857E",
                    cursor: canSubmit ? "pointer" : "default",
                    opacity: status === "sending" ? 0.6 : 1,
                  }}
                >
                  {status === "sending" ? "Sending..." : "Send Message"}
                </button>

                {status === "error" && (
                  <p className="font-body text-[13px] font-medium text-sun-salmon text-center mt-3">
                    Something went wrong. Please try again or email us directly.
                  </p>
                )}
              </form>
            )}
          </FadeIn>
        </div>
      </section>

      <Footer />
    </>
  );
}
