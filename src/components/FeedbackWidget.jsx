// ═══════════════════════════════════════════════════════════════════════════════
// FEEDBACK WIDGET — structured sentiment + tags + open text
// ═══════════════════════════════════════════════════════════════════════════════
//
// Sends structured feedback via Resend API (lilatrips.com/api/send-feedback).
// Reusable across all Madrona Product Studio apps — all apps call the same endpoint.
//
// Usage:
//   <FeedbackWidget source="Lila Trips" />
//   <FeedbackWidget source="Utah Trip" />
//
// Props:
//   source    — app name included in the email subject (required)
//   className — optional, for position/z-index overrides

import { useState, useEffect, useRef, useCallback } from 'react';

// Feedback API endpoint — hosted on lilatrips.com, shared across all Madrona apps
const FEEDBACK_API = 'https://www.lilatrips.com/api/send-feedback';

// ─── Sentiment-conditional content ──────────────────────────────────────────

const TAG_SETS = {
  loved: { label: 'What stood out?', tags: ['It was easy', 'It felt thoughtful', 'Saved me time', 'Looked great', 'Something else'] },
  okay:  { label: 'What could be better?', tags: ['A step felt clunky', 'Content quality', 'The look & feel', 'I had an idea', 'Something else'] },
  off:   { label: 'What got in the way?', tags: ['Something broke', 'Confusing flow', 'Wrong result', 'Not for me', 'Something else'] },
};

const PROMPTS = {
  loved: { label: 'What made it land?', placeholder: "e.g. 'the itinerary nailed the vibe I wanted'" },
  okay:  { label: 'What would push this further?', placeholder: "e.g. 'would love to filter by walking distance'" },
  off:   { label: 'What got in the way?', placeholder: "e.g. 'the map wouldn't load after I changed dates'" },
};

const THANKS = {
  loved: { title: 'Thank you', body: "We're glad it landed. We'll keep pulling on what's working." },
  okay:  { title: 'Thank you', body: "Noted. We'll sit with this and you'll see what changed in our next release notes." },
  off:   { title: 'Thank you — truly', body: 'This is exactly what we need to hear. We read every one of these and it shapes what we work on next.' },
};

const SENTIMENT_LABELS = {
  loved: 'Loved it',
  okay:  'It was okay',
  off:   'Felt off',
};

// ─── Inline SVG helpers ─────────────────────────────────────────────────────

function FaceIcon({ mouth, size = 18 }) {
  // mouth: 'smile' | 'neutral' | 'frown'
  const paths = {
    smile: 'M8.5 14.5c0 0 1.5 2 3.5 2s3.5-2 3.5-2',
    neutral: 'M8.5 15h7',
    frown: 'M8.5 16c0 0 1.5-2 3.5-2s3.5 2 3.5 2',
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <circle cx="9" cy="10" r="0.75" fill="currentColor" stroke="none" />
      <circle cx="15" cy="10" r="0.75" fill="currentColor" stroke="none" />
      <path d={paths[mouth]} />
    </svg>
  );
}

function BubbleIcon({ size = 20, strokeWidth = 1.25 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 9c0-2.2 1.8-4 4-4h6c2.2 0 4 1.8 4 4v4c0 2.2-1.8 4-4 4h-3.5l-3 2.5v-2.5H9c-2.2 0-4-1.8-4-4V9Z" />
    </svg>
  );
}

function CloseIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="6" y1="6" x2="18" y2="18" />
      <line x1="18" y1="6" x2="6" y2="18" />
    </svg>
  );
}

function CheckIcon({ size = 24 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

// ─── Shared inline style tokens ─────────────────────────────────────────────
// Using inline styles for portability across projects (not all use Tailwind)

const FONT = "'Quicksand', system-ui, sans-serif";
const INK = '#1C1917';
const INK_60 = 'rgba(28,25,23,0.6)';
const INK_35 = 'rgba(28,25,23,0.35)';
const INK_12 = 'rgba(28,25,23,0.12)';
const INK_08 = 'rgba(28,25,23,0.08)';
const TEAL = '#4A9B9F';
const CARD_BG = 'white';

// ─── Reduced motion check ───────────────────────────────────────────────────

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const handler = (e) => setReduced(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);
  return reduced;
}

// ═══════════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export default function FeedbackWidget({ source = 'Madrona App', className, hideOnPaths = [], showAfterScroll = 0 }) {
  const [open, setOpen] = useState(false);
  const [sentiment, setSentiment] = useState(null); // 'loved' | 'okay' | 'off'
  const [tag, setTag] = useState(null);
  const [text, setText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);
  const [scrolledPast, setScrolledPast] = useState(showAfterScroll === 0);

  const fabRef = useRef(null);
  const modalRef = useRef(null);
  const firstSentimentRef = useRef(null);
  const reducedMotion = usePrefersReducedMotion();

  // ─── Hide on specific paths ─────────────────────────────────────────────
  const [hidden, setHidden] = useState(false);
  useEffect(() => {
    const check = () => {
      const path = window.location.pathname;
      setHidden(hideOnPaths.some(p => path.startsWith(p)));
    };
    check();
    // Re-check on popstate (SPA navigation)
    window.addEventListener('popstate', check);
    // Also observe pushState/replaceState for react-router
    const origPush = history.pushState;
    const origReplace = history.replaceState;
    history.pushState = function() { origPush.apply(this, arguments); check(); };
    history.replaceState = function() { origReplace.apply(this, arguments); check(); };
    return () => {
      window.removeEventListener('popstate', check);
      history.pushState = origPush;
      history.replaceState = origReplace;
    };
  }, [hideOnPaths]);

  // ─── Show after scroll threshold ────────────────────────────────────────
  useEffect(() => {
    if (showAfterScroll === 0) { setScrolledPast(true); return; }
    const handler = () => setScrolledPast(window.scrollY >= showAfterScroll);
    window.addEventListener('scroll', handler, { passive: true });
    handler(); // check initial position
    return () => window.removeEventListener('scroll', handler);
  }, [showAfterScroll]);

  const animDuration = reducedMotion ? '0ms' : '350ms';
  const revealDuration = reducedMotion ? '0ms' : '300ms';

  // ─── Reset form state ───────────────────────────────────────────────────

  const resetForm = useCallback(() => {
    setSentiment(null);
    setTag(null);
    setText('');
    setError(null);
    setSubmitted(false);
    setSubmitting(false);
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
    // Delay reset so close animation finishes
    setTimeout(resetForm, 300);
    // Return focus to FAB
    setTimeout(() => fabRef.current?.focus(), 350);
  }, [resetForm]);

  // ─── Escape key ─────────────────────────────────────────────────────────

  useEffect(() => {
    if (!open) return;
    const handler = (e) => { if (e.key === 'Escape') handleClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, handleClose]);

  // ─── Focus first sentiment button on open ───────────────────────────────

  useEffect(() => {
    if (open && firstSentimentRef.current) {
      setTimeout(() => firstSentimentRef.current?.focus(), 100);
    }
  }, [open]);

  // ─── Submit ─────────────────────────────────────────────────────────────

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!sentiment) return;
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch(FEEDBACK_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source,
          sentiment,
          tag,
          text: text.trim(),
          pathname: window.location.pathname,
        }),
      });
      const result = await res.json();

      if (result.success) {
        setSubmitting(false);
        setSubmitted(true);
      } else {
        setSubmitting(false);
        setError('Could not send. Please try again.');
      }
    } catch {
      setSubmitting(false);
      setError('Could not send. Please try again.');
    }
  };

  // ─── Derived state ──────────────────────────────────────────────────────

  const tagSet = sentiment ? TAG_SETS[sentiment] : null;
  const prompt = sentiment ? PROMPTS[sentiment] : null;
  const thanks = sentiment ? THANKS[sentiment] : null;
  const canSubmit = !!sentiment && !submitting;
  const fabVisible = !open && !hidden && scrolledPast;

  // ─── Render ─────────────────────────────────────────────────────────────

  // Don't render anything if hidden on this path
  if (hidden && !open) return null;

  return (
    <>
      {/* ── FAB ── */}
      <button
        ref={fabRef}
        onClick={() => setOpen(true)}
        aria-label="Share feedback"
        className={className}
        style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 9000,
          width: 44,
          height: 44,
          borderRadius: '50%',
          border: '0.5px solid rgba(255,255,255,0.25)',
          background: 'rgba(255,255,255,0.15)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          color: 'rgba(255,255,255,0.7)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 1px 2px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.06)',
          transition: reducedMotion ? 'none' : 'opacity 0.25s, transform 0.2s, box-shadow 0.2s, color 0.2s, border-color 0.2s',
          opacity: fabVisible ? 1 : 0,
          pointerEvents: fabVisible ? 'auto' : 'none',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-1px)';
          e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.06), 0 6px 16px rgba(0,0,0,0.08)';
          e.currentTarget.style.color = 'rgba(255,255,255,0.9)';
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.35)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 1px 2px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.06)';
          e.currentTarget.style.color = 'rgba(255,255,255,0.7)';
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)';
        }}
      >
        <BubbleIcon />
      </button>

      {/* ── Modal overlay ── */}
      {open && (
        <div
          onClick={handleClose}
          role="dialog"
          aria-modal="true"
          aria-labelledby="feedback-title"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9500,
            background: 'rgba(0,0,0,0.08)',
            backdropFilter: reducedMotion ? 'none' : 'blur(2px)',
            WebkitBackdropFilter: reducedMotion ? 'none' : 'blur(2px)',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'flex-end',
            padding: '16px 24px 80px',
          }}
        >
          <style>{`
            @keyframes fbSlideUp {
              from { transform: translateY(8px) scale(0.98); opacity: 0; }
              to { transform: translateY(0) scale(1); opacity: 1; }
            }
            @media (max-width: 479px) {
              #feedback-modal-wrap { padding: 16px 16px 72px !important; }
            }
          `}</style>

          {/* ── Card ── */}
          <div
            ref={modalRef}
            onClick={(e) => e.stopPropagation()}
            style={{
              background: CARD_BG,
              borderRadius: 12,
              width: '100%',
              maxWidth: 400,
              border: `0.5px solid ${INK_12}`,
              boxShadow: '0 12px 48px rgba(0,0,0,0.12)',
              animation: reducedMotion ? 'none' : `fbSlideUp ${animDuration} cubic-bezier(0.16, 1, 0.3, 1)`,
              marginBottom: 0,
              fontFamily: FONT,
            }}
          >
            {submitted && thanks ? (
              /* ── Thank you state ── */
              <div style={{ padding: '32px 24px 28px', textAlign: 'center' }}>
                <div style={{
                  width: 32, height: 32, margin: '0 auto 12px',
                  color: INK_35,
                }}>
                  <BubbleIcon size={32} strokeWidth={1} />
                </div>
                <div style={{ fontSize: 15, fontWeight: 500, color: INK, marginBottom: 6 }}>
                  {thanks.title}
                </div>
                <div style={{
                  fontSize: 13, color: INK_60, lineHeight: 1.6,
                  maxWidth: 300, margin: '0 auto 20px',
                }}>
                  {thanks.body}
                </div>
                <button
                  onClick={handleClose}
                  style={{
                    background: 'none',
                    border: `0.5px solid ${INK_12}`,
                    borderRadius: 8,
                    padding: '8px 20px',
                    fontFamily: FONT,
                    fontSize: 13,
                    fontWeight: 500,
                    color: INK_60,
                    cursor: 'pointer',
                  }}
                >
                  Close
                </button>
              </div>
            ) : (
              /* ── Form ── */
              <form onSubmit={handleSubmit}>
                {/* Header */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '20px 24px 16px',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ color: INK_35 }}><BubbleIcon size={16} /></span>
                    <span id="feedback-title" style={{ fontSize: 15, fontWeight: 500, color: INK }}>
                      Share a thought
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleClose}
                    aria-label="Close"
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: INK_35 }}
                  >
                    <CloseIcon />
                  </button>
                </div>

                <div style={{ padding: '0 24px 20px' }}>
                  {/* Subheader */}
                  <div style={{ fontSize: 14, color: INK_60, marginBottom: 16, lineHeight: 1.5 }}>
                    Your thoughts help us shape what comes next.
                  </div>

                  {/* Sentiment label */}
                  <div style={{ fontSize: 14, color: INK, marginBottom: 10, fontWeight: 500 }}>
                    How was this?
                  </div>

                  {/* Sentiment buttons */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: sentiment ? 0 : 4 }}>
                    {[
                      { key: 'loved', mouth: 'smile' },
                      { key: 'okay', mouth: 'neutral' },
                      { key: 'off', mouth: 'frown' },
                    ].map((s, i) => {
                      const selected = sentiment === s.key;
                      return (
                        <button
                          key={s.key}
                          ref={i === 0 ? firstSentimentRef : undefined}
                          type="button"
                          aria-pressed={selected}
                          onClick={() => { setSentiment(s.key); setTag(null); }}
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: 4,
                            padding: '10px 8px',
                            borderRadius: 8,
                            border: selected ? `0.5px solid ${INK_35}` : `0.5px solid transparent`,
                            background: selected ? CARD_BG : 'rgba(28,25,23,0.03)',
                            color: selected ? INK : INK_60,
                            cursor: 'pointer',
                            fontFamily: FONT,
                            fontSize: 12,
                            fontWeight: 500,
                            transition: reducedMotion ? 'none' : 'all 0.15s',
                          }}
                          onMouseEnter={(e) => {
                            if (!selected) {
                              e.currentTarget.style.background = CARD_BG;
                              e.currentTarget.style.borderColor = INK_12;
                              e.currentTarget.style.color = INK;
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!selected) {
                              e.currentTarget.style.background = 'rgba(28,25,23,0.03)';
                              e.currentTarget.style.borderColor = 'transparent';
                              e.currentTarget.style.color = INK_60;
                            }
                          }}
                        >
                          <FaceIcon mouth={s.mouth} />
                          {SENTIMENT_LABELS[s.key]}
                        </button>
                      );
                    })}
                  </div>

                  {/* ── Follow-up (conditional, revealed after sentiment) ── */}
                  <div style={{
                    overflow: 'hidden',
                    maxHeight: sentiment ? 400 : 0,
                    opacity: sentiment ? 1 : 0,
                    transition: reducedMotion ? 'none' : `max-height ${revealDuration} ease, opacity ${revealDuration} ease`,
                    marginTop: sentiment ? 16 : 0,
                  }}>
                    {tagSet && (
                      <>
                        {/* Tag label */}
                        <div style={{ fontSize: 14, color: INK, fontWeight: 500, marginBottom: 8 }}>
                          {tagSet.label} <span style={{ opacity: 0.7 }}>(optional)</span>
                        </div>

                        {/* Tag pills */}
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
                          {tagSet.tags.map((t) => {
                            const selected = tag === t;
                            return (
                              <button
                                key={t}
                                type="button"
                                aria-pressed={selected}
                                onClick={() => setTag(selected ? null : t)}
                                style={{
                                  padding: '6px 12px',
                                  fontSize: 13,
                                  fontFamily: FONT,
                                  fontWeight: 500,
                                  borderRadius: 14,
                                  border: `0.5px solid ${selected ? INK : INK_12}`,
                                  background: selected ? INK : 'transparent',
                                  color: selected ? 'white' : INK_60,
                                  cursor: 'pointer',
                                  transition: reducedMotion ? 'none' : 'all 0.15s',
                                }}
                                onMouseEnter={(e) => {
                                  if (!selected) {
                                    e.currentTarget.style.borderColor = INK_35;
                                    e.currentTarget.style.color = INK;
                                  }
                                }}
                                onMouseLeave={(e) => {
                                  if (!selected) {
                                    e.currentTarget.style.borderColor = INK_12;
                                    e.currentTarget.style.color = INK_60;
                                  }
                                }}
                              >
                                {t}
                              </button>
                            );
                          })}
                        </div>
                      </>
                    )}

                    {prompt && (
                      <>
                        {/* Text label */}
                        <label htmlFor="feedback-text" style={{ display: 'block', fontSize: 14, color: INK, fontWeight: 500, marginBottom: 6 }}>
                          {prompt.label}
                        </label>
                        <textarea
                          id="feedback-text"
                          value={text}
                          onChange={(e) => setText(e.target.value)}
                          placeholder={prompt.placeholder}
                          disabled={submitting}
                          style={{
                            width: '100%',
                            minHeight: 76,
                            padding: '11px 13px',
                            border: `0.5px solid ${INK_12}`,
                            borderRadius: 8,
                            resize: 'vertical',
                            fontFamily: FONT,
                            fontSize: 14,
                            lineHeight: 1.6,
                            color: INK,
                            background: CARD_BG,
                            outline: 'none',
                            boxSizing: 'border-box',
                          }}
                          onFocus={(e) => { e.currentTarget.style.borderColor = INK_35; }}
                          onBlur={(e) => { e.currentTarget.style.borderColor = INK_12; }}
                        />
                        <div style={{
                          fontSize: 12,
                          fontStyle: 'italic',
                          color: INK_60,
                          marginTop: 4,
                        }}>
                          We read every response.
                        </div>
                      </>
                    )}
                  </div>

                  {/* Error */}
                  {error && (
                    <div style={{ fontSize: 12, color: '#C4875A', marginTop: 8 }}>
                      {error}
                    </div>
                  )}

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
                    <button
                      type="button"
                      onClick={handleClose}
                      disabled={submitting}
                      style={{
                        flex: 1,
                        padding: '10px 0',
                        border: `0.5px solid ${INK_12}`,
                        borderRadius: 8,
                        background: 'none',
                        fontFamily: FONT,
                        fontSize: 13,
                        fontWeight: 600,
                        color: INK_60,
                        cursor: 'pointer',
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={!canSubmit}
                      style={{
                        flex: 1,
                        padding: '10px 0',
                        border: 'none',
                        borderRadius: 8,
                        background: canSubmit ? INK : 'rgba(28,25,23,0.15)',
                        fontFamily: FONT,
                        fontSize: 13,
                        fontWeight: 600,
                        color: canSubmit ? 'white' : 'rgba(28,25,23,0.3)',
                        cursor: canSubmit ? 'pointer' : 'not-allowed',
                        opacity: canSubmit ? 1 : 0.4,
                        transition: reducedMotion ? 'none' : 'all 0.15s',
                      }}
                    >
                      {submitting ? 'Sending…' : 'Send'}
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
