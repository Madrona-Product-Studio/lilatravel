// ═══════════════════════════════════════════════════════════════════════════════
// FEEDBACK WIDGET — reusable floating feedback button + modal
// ═══════════════════════════════════════════════════════════════════════════════
//
// Sends feedback via Web3Forms to feedback@madronaproduct.com.
// Reusable across all Madrona Product Studio apps.
//
// Usage:
//   <FeedbackWidget source="Lila Trips" />
//   <FeedbackWidget source="Utah Trip" accessKey="..." />
//
// Props:
//   source  — app name included in the email subject (required)
//   accessKey — Web3Forms access key (defaults to shared key)

import { useState } from 'react';

const WEB3FORMS_KEY = '0d48df75-d380-4710-817b-4bf6c56b7386';

export default function FeedbackWidget({ source = 'Madrona App', accessKey = WEB3FORMS_KEY }) {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    setSubmitting(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('access_key', accessKey);
      formData.append('subject', `${source} — User Feedback`);
      formData.append('message', text);
      formData.append('from_name', `${source} User`);

      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData,
      });
      const result = await res.json();

      if (result.success) {
        setSubmitting(false);
        setSubmitted(true);
        setTimeout(() => {
          setOpen(false);
          setText('');
          setSubmitted(false);
        }, 2000);
      } else {
        setSubmitting(false);
        setError('Could not send feedback. Please try again.');
      }
    } catch {
      setSubmitting(false);
      setError('Could not send feedback. Please try again.');
    }
  };

  const handleClose = () => {
    setOpen(false);
    setText('');
    setSubmitted(false);
    setError(null);
  };

  return (
    <>
      {/* Floating button — bottom right */}
      <button
        onClick={() => setOpen(true)}
        aria-label="Send feedback"
        style={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          zIndex: 9000,
          width: 44,
          height: 44,
          borderRadius: '50%',
          border: 'none',
          background: 'rgba(28,25,23,0.75)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          color: 'white',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 2px 12px rgba(0,0,0,0.15)',
          transition: 'opacity 0.2s',
          opacity: open ? 0 : 1,
          pointerEvents: open ? 'none' : 'auto',
        }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      </button>

      {/* Modal overlay */}
      {open && (
        <div
          onClick={handleClose}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9500,
            background: 'rgba(0,0,0,0.4)',
            backdropFilter: 'blur(4px)',
            WebkitBackdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
            padding: 16,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#F7F4EE',
              borderRadius: 14,
              width: '100%',
              maxWidth: 400,
              boxShadow: '0 12px 48px rgba(0,0,0,0.2)',
              animation: 'feedbackSlideUp 0.25s ease-out',
              marginBottom: 8,
            }}
          >
            <style>{`
              @keyframes feedbackSlideUp {
                from { transform: translateY(20px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
              }
            `}</style>

            {/* Header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '18px 20px 14px',
              borderBottom: '0.5px solid rgba(28,25,23,0.08)',
            }}>
              <div style={{
                fontFamily: "'Quicksand', system-ui, sans-serif",
                fontSize: 15,
                fontWeight: 700,
                color: '#1C1917',
              }}>
                Share feedback
              </div>
              <button
                onClick={handleClose}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 4,
                  color: '#8C7B6B',
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="6" y1="6" x2="18" y2="18" />
                  <line x1="18" y1="6" x2="6" y2="18" />
                </svg>
              </button>
            </div>

            {submitted ? (
              /* Success state */
              <div style={{ padding: '32px 20px', textAlign: 'center' }}>
                <div style={{
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  background: 'rgba(74,155,159,0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 12px',
                }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4A9B9F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <div style={{
                  fontFamily: "'Quicksand', system-ui, sans-serif",
                  fontSize: 15,
                  fontWeight: 600,
                  color: '#1C1917',
                }}>
                  Thank you!
                </div>
                <div style={{
                  fontFamily: "'Quicksand', system-ui, sans-serif",
                  fontSize: 13,
                  color: 'rgba(28,25,23,0.5)',
                  marginTop: 4,
                }}>
                  Your feedback has been sent.
                </div>
              </div>
            ) : (
              /* Form */
              <form onSubmit={handleSubmit} style={{ padding: '16px 20px 20px' }}>
                <p style={{
                  fontFamily: "'Quicksand', system-ui, sans-serif",
                  fontSize: 13,
                  color: 'rgba(28,25,23,0.5)',
                  margin: '0 0 12px',
                  lineHeight: 1.5,
                }}>
                  Thoughts, suggestions, or issues — we'd love to hear from you.
                </p>

                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="What's on your mind?"
                  disabled={submitting}
                  style={{
                    width: '100%',
                    height: 100,
                    padding: '10px 12px',
                    border: '1px solid rgba(28,25,23,0.12)',
                    borderRadius: 8,
                    resize: 'none',
                    fontFamily: "'Quicksand', system-ui, sans-serif",
                    fontSize: 14,
                    color: '#1C1917',
                    background: 'white',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />

                {error && (
                  <div style={{
                    fontFamily: "'Quicksand', system-ui, sans-serif",
                    fontSize: 12,
                    color: '#C4875A',
                    marginTop: 8,
                  }}>
                    {error}
                  </div>
                )}

                <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
                  <button
                    type="button"
                    onClick={handleClose}
                    disabled={submitting}
                    style={{
                      flex: 1,
                      padding: '10px 0',
                      border: '1px solid rgba(28,25,23,0.12)',
                      borderRadius: 8,
                      background: 'none',
                      fontFamily: "'Quicksand', system-ui, sans-serif",
                      fontSize: 13,
                      fontWeight: 600,
                      color: 'rgba(28,25,23,0.5)',
                      cursor: 'pointer',
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!text.trim() || submitting}
                    style={{
                      flex: 1,
                      padding: '10px 0',
                      border: 'none',
                      borderRadius: 8,
                      background: !text.trim() || submitting ? 'rgba(28,25,23,0.15)' : '#1C1917',
                      fontFamily: "'Quicksand', system-ui, sans-serif",
                      fontSize: 13,
                      fontWeight: 600,
                      color: !text.trim() || submitting ? 'rgba(28,25,23,0.3)' : 'white',
                      cursor: !text.trim() || submitting ? 'not-allowed' : 'pointer',
                      transition: 'all 0.15s',
                    }}
                  >
                    {submitting ? 'Sending...' : 'Send'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
