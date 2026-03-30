import { useState, useEffect } from "react";
import { C } from "@data/brand";
import { trackEvent } from "@utils/analytics";

export default function ExpressInterestModal({ open, onClose, tripTitle, tripLocation }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error

  // Reset state when modal opens
  useEffect(() => {
    if (open) {
      setEmail("");
      setStatus("idle");
    }
  }, [open]);

  // Lock body scroll while open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  // Escape key dismisses
  useEffect(() => {
    if (!open) return;
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!open) return null;

  const canSubmit = email.includes("@") && status !== "sending";
  const label = tripTitle && tripLocation
    ? `${tripTitle} — ${tripLocation}`
    : "Threshold Trip";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;

    setStatus("sending");
    trackEvent("express_interest_submitted", { trip: label, email });

    try {
      const res = await fetch("/api/send-contact-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          category: "Trip Planning",
          message: `Express interest in: ${label}`,
        }),
      });
      if (!res.ok) throw new Error("Send failed");
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 p-5"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-warm-white rounded-sm px-8 py-9 max-w-[420px] w-full shadow-[0_20px_60px_rgba(0,0,0,0.15)] animate-lila-modal-in"
      >
        {status === "sent" ? (
          <div className="text-center">
            <div className="font-body text-[11px] font-bold tracking-[0.22em] uppercase text-sea-glass mb-4">
              You're on the list
            </div>
            <div className="font-serif text-[22px] font-normal text-dark-ink mb-3">
              We'll be in touch.
            </div>
            <p className="font-body text-sm text-[#7A857E] leading-[1.65] m-0 mb-7">
              We'll reach out when {label} opens for booking.
            </p>
            <button
              onClick={onClose}
              className="font-body text-sm font-semibold tracking-[0.08em] uppercase border-none rounded-sm cursor-pointer px-7 py-3 transition-opacity duration-200 bg-slate text-warm-white"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <span className="font-body text-[10px] font-bold tracking-[0.2em] uppercase text-sun-salmon block mb-2">
              Express Interest
            </span>
            <h3 className="font-serif text-[22px] font-normal text-dark-ink m-0 mb-2">
              {label}
            </h3>
            <p className="font-body text-[13px] text-[#7A857E] leading-[1.65] m-0 mb-6">
              Leave your email and we'll notify you when this trip opens for booking.
            </p>

            <input
              type="email"
              required
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full py-3 px-4 border border-stone bg-white font-body text-sm font-normal text-dark-ink outline-none transition-colors duration-200 box-border mb-4 focus:border-ocean-teal"
            />

            <button
              type="submit"
              disabled={!canSubmit}
              className="w-full py-3 px-7 border-none font-body text-[13px] font-bold tracking-[0.18em] uppercase transition-all duration-250 hover:opacity-85 disabled:cursor-default disabled:hover:opacity-100"
              style={{
                background: canSubmit ? C.darkInk : C.stone,
                color: canSubmit ? "#fff" : "#7A857E",
                cursor: canSubmit ? "pointer" : "default",
                opacity: status === "sending" ? 0.6 : 1,
              }}
            >
              {status === "sending" ? "Sending..." : "Notify Me"}
            </button>

            {status === "error" && (
              <p className="font-body text-[13px] font-medium text-sun-salmon text-center mt-3 m-0">
                Something went wrong. Please try again.
              </p>
            )}
          </form>
        )}
      </div>
    </div>
  );
}
