import { useState, useEffect } from 'react';
import { createShareableUrl, sendTripEmail } from '@services/shareService';
import { C as BrandC } from '@data/brand';

const C = {
  cream:     BrandC.cream,
  slate:     BrandC.darkInk,
  ink:       '#1E2825',
  body:      '#4A5650',
  muted:     '#7A857E',
  sage:      '#5A7068',
  oceanTeal: BrandC.oceanTeal,
  seaGlass:  BrandC.seaGlass,
  white:     '#FFFFFF',
};

const F = "'Quicksand', sans-serif";

const SaveIcon = ({ size = 14, color = C.white }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 2h9l3 3v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1z" />
    <path d="M11 15V9H5v6" /><path d="M5 2v4h5" />
  </svg>
);

const ShareIcon = ({ size = 14, color = C.sage }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2L7 9" /><path d="M14 2l-4 12-3-5-5-3z" />
  </svg>
);

const CheckIcon = ({ size = 14, color = C.seaGlass }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3,8.5 6.5,12 13,4" />
  </svg>
);

const CopyIcon = ({ size = 13, color = C.sage }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="5" y="5" width="9" height="9" rx="1" />
    <path d="M2 11V3a1 1 0 0 1 1-1h8" />
  </svg>
);

const CloseIcon = ({ size = 12, color = C.sage }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4l8 8" /><path d="M12 4l-8 8" />
  </svg>
);

export default function SavePill({ itineraryId, rawItinerary, formData, itineraryTitle }) {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState('save'); // 'save' | 'share'
  const [email, setEmail] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [sendError, setSendError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState('');

  useEffect(() => {
    if (!itineraryId) {
      setShareUrl(window.location.href);
      return;
    }
    createShareableUrl({
      itineraryId,
      rawItinerary,
      formData,
    }).then(url => setShareUrl(url));
  }, [itineraryId]);

  // Reset state when panel closes
  const handleClose = () => {
    setOpen(false);
    setSent(false);
    setSendError(false);
    setEmail('');
  };

  const handleSend = async () => {
    if (!email.includes('@')) return;
    setSending(true);
    setSendError(false);
    try {
      await sendTripEmail({
        email,
        mode,
        itineraryUrl: shareUrl || window.location.href,
        itineraryTitle,
      });
      setSent(true);
    } catch (e) {
      console.error('Send failed:', e);
      setSendError(true);
    } finally {
      setSending(false);
    }
  };

  const handleCopy = () => {
    const url = shareUrl || window.location.href;
    navigator.clipboard.writeText(url).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  // Floating pill (collapsed)
  if (!open) {
    return (
      <button onClick={() => setOpen(true)} style={{
        position: 'fixed', bottom: 24, right: 24, zIndex: 150,
        display: 'flex', alignItems: 'center', gap: 7,
        padding: '10px 18px', borderRadius: 24,
        background: C.slate, color: C.white,
        border: 'none', cursor: 'pointer',
        fontFamily: F, fontSize: 13, fontWeight: 600,
        letterSpacing: '0.04em',
        boxShadow: `0 4px 20px ${C.ink}25`,
        WebkitTapHighlightColor: 'transparent',
        transition: 'transform 0.2s, box-shadow 0.2s',
      }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = `0 6px 24px ${C.ink}30`; }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = `0 4px 20px ${C.ink}25`; }}
      >
        <SaveIcon size={13} color={C.white} />
        Save this trip
      </button>
    );
  }

  // Expanded panel
  return (
    <div style={{
      position: 'fixed', bottom: 24, right: 24, zIndex: 150,
      width: 320, maxWidth: 'calc(100vw - 48px)',
      background: C.white, borderRadius: 2,
      border: `1px solid ${C.sage}15`,
      boxShadow: `0 8px 40px ${C.ink}18`,
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '14px 16px 12px',
        borderBottom: `1px solid ${C.sage}0c`,
      }}>
        <span style={{ fontFamily: F, fontSize: 14, fontWeight: 600, color: C.ink }}>
          {mode === 'save' ? 'Save this trip' : 'Share this trip'}
        </span>
        <button onClick={handleClose} style={{
          width: 26, height: 26, borderRadius: '50%',
          background: 'none', border: `1px solid ${C.sage}15`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', WebkitTapHighlightColor: 'transparent',
        }}>
          <CloseIcon size={10} color={C.sage} />
        </button>
      </div>

      {/* Mode tabs */}
      <div style={{ display: 'flex', padding: '10px 16px 0', gap: 6 }}>
        {[
          { key: 'save', label: 'Save for me', icon: <SaveIcon size={11} color={mode === 'save' ? C.oceanTeal : `${C.sage}60`} /> },
          { key: 'share', label: 'Share with someone', icon: <ShareIcon size={11} color={mode === 'share' ? C.oceanTeal : `${C.sage}60`} /> },
        ].map(tab => (
          <button key={tab.key} onClick={() => { setMode(tab.key); setSent(false); setSendError(false); setEmail(''); }} style={{
            flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
            padding: '7px 0', borderRadius: 6,
            background: mode === tab.key ? `${C.oceanTeal}0c` : 'transparent',
            border: `1px solid ${mode === tab.key ? `${C.oceanTeal}25` : `${C.sage}0c`}`,
            cursor: 'pointer', WebkitTapHighlightColor: 'transparent',
            transition: 'all 0.2s',
          }}>
            {tab.icon}
            <span style={{
              fontFamily: F, fontSize: 11, fontWeight: mode === tab.key ? 600 : 500,
              color: mode === tab.key ? C.oceanTeal : `${C.sage}70`,
            }}>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Body */}
      <div style={{ padding: '14px 16px 16px' }}>
        {sent ? (
          /* Confirmation */
          <div style={{ textAlign: 'center', padding: '8px 0' }}>
            <CheckIcon size={20} color={C.seaGlass} />
            <div style={{ fontFamily: F, fontSize: 14, fontWeight: 600, color: C.ink, marginTop: 8 }}>
              {mode === 'save' ? 'Link sent!' : 'Itinerary shared!'}
            </div>
            <div style={{ fontFamily: F, fontSize: 12, color: C.muted, marginTop: 4, lineHeight: 1.5 }}>
              {mode === 'save' ? 'Check your inbox for the link.' : `We sent it to ${email}.`}
            </div>
          </div>
        ) : (
          /* Email input + send */
          <>
            <div style={{ fontFamily: F, fontSize: 12, color: C.muted, marginBottom: 8, lineHeight: 1.5 }}>
              {mode === 'save'
                ? "We'll email you a link so you can pick up right where you left off."
                : "Enter their email and we'll send the itinerary over."}
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') handleSend(); }}
                placeholder={mode === 'save' ? 'your@email.com' : 'their@email.com'}
                style={{
                  flex: 1, padding: '9px 12px',
                  fontFamily: F, fontSize: 13, fontWeight: 400,
                  color: C.ink, background: C.white,
                  border: `1px solid ${C.sage}20`, borderRadius: 6,
                  outline: 'none', boxSizing: 'border-box',
                  transition: 'border-color 0.2s',
                }}
                onFocus={e => e.target.style.borderColor = `${C.oceanTeal}40`}
                onBlur={e => e.target.style.borderColor = `${C.sage}20`}
              />
              <button onClick={handleSend} disabled={sending || !email.includes('@')} style={{
                padding: '9px 14px', borderRadius: 6,
                fontFamily: F, fontSize: 12, fontWeight: 600,
                color: (sending || !email.includes('@')) ? `${C.sage}50` : C.white,
                background: (sending || !email.includes('@')) ? `${C.sage}08` : C.oceanTeal,
                border: (sending || !email.includes('@')) ? `1px solid ${C.sage}15` : 'none',
                cursor: (sending || !email.includes('@')) ? 'default' : 'pointer',
                WebkitTapHighlightColor: 'transparent',
                transition: 'all 0.2s',
                whiteSpace: 'nowrap',
              }}>
                {sending ? 'Sending...' : (mode === 'save' ? 'Send my link' : 'Send itinerary')}
              </button>
            </div>
            {sendError && (
              <div style={{ fontFamily: F, fontSize: 12, color: '#B06A5A', marginTop: 8, lineHeight: 1.5 }}>
                Hmm, that didn't go through. Try again?
              </div>
            )}
          </>
        )}

        {/* Copy link — always visible */}
        <div style={{
          marginTop: 12, paddingTop: 12,
          borderTop: `1px solid ${C.sage}0c`,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <span style={{ fontFamily: F, fontSize: 11, color: C.muted }}>Or copy link</span>
          <button onClick={handleCopy} style={{
            display: 'flex', alignItems: 'center', gap: 5,
            padding: '5px 10px', borderRadius: 5,
            background: copied ? `${C.seaGlass}0c` : `${C.sage}06`,
            border: `1px solid ${copied ? `${C.seaGlass}25` : `${C.sage}12`}`,
            cursor: 'pointer', WebkitTapHighlightColor: 'transparent',
            transition: 'all 0.2s',
          }}>
            {copied ? <CheckIcon size={10} color={C.seaGlass} /> : <CopyIcon size={10} color={C.sage} />}
            <span style={{
              fontFamily: F, fontSize: 11, fontWeight: 600,
              color: copied ? C.seaGlass : C.sage,
            }}>
              {copied ? 'Copied!' : 'Copy link'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
