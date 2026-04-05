import { useState, useEffect } from 'react';
import { C } from '@data/brand';

const F = "'Quicksand', sans-serif";

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

const CloseIcon = ({ size = 12, color = '#5A7068' }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4l8 8" /><path d="M12 4l-8 8" />
  </svg>
);

export default function IterationsPill({ isOpen, onClose, iterations = [], currentItineraryId }) {
  if (!isOpen) return null;

  const isCurrent = (iter) => iter.id === currentItineraryId;

  return (
    <div style={{
      position: 'fixed', top: 56, right: 20, zIndex: 150,
      width: 320, maxWidth: 'calc(100vw - 40px)',
      background: C.warmWhite, borderRadius: 0,
      border: `1px solid ${C.stone}`,
      boxShadow: `0 8px 40px rgba(30,40,37,0.1)`,
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '14px 16px 12px',
        borderBottom: `1px solid ${C.stone}`,
      }}>
        <span style={{ fontFamily: F, fontSize: 14, fontWeight: 600, color: C.darkInk }}>
          Trip iterations
        </span>
        <button onClick={onClose} style={{
          width: 26, height: 26, borderRadius: '50%',
          background: 'none', border: `1px solid ${C.stone}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', WebkitTapHighlightColor: 'transparent',
        }}>
          <CloseIcon size={10} />
        </button>
      </div>

      {/* Iteration list */}
      <div style={{ padding: '8px 0' }}>
        {iterations.length <= 1 ? (
          /* Single iteration — empty state */
          <div style={{ padding: '12px 16px' }}>
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '10px 12px', borderRadius: 0,
              background: `${C.cream}`,
            }}>
              <div>
                <div style={{ fontFamily: F, fontSize: 13, fontWeight: 600, color: C.darkInk }}>Original</div>
                {iterations[0]?.created_at && (
                  <div style={{ fontFamily: F, fontSize: 11, color: '#7A857E', marginTop: 2 }}>{timeAgo(iterations[0].created_at)}</div>
                )}
              </div>
              <span style={{ fontFamily: F, fontSize: 11, fontWeight: 600, color: '#7A857E' }}>Current</span>
            </div>
            <p style={{ fontFamily: F, fontSize: 12, color: '#7A857E', lineHeight: 1.5, marginTop: 12 }}>
              Refine your itinerary to build a trip history.
            </p>
          </div>
        ) : (
          /* Multiple iterations */
          iterations.map((iter, i) => {
            const current = isCurrent(iter);
            const label = iter.iteration === 0 ? 'Original' : `Iteration ${iter.iteration}`;
            return (
              <div key={iter.id} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '10px 16px',
                background: current ? C.cream : 'transparent',
                borderBottom: i < iterations.length - 1 ? `1px solid ${C.stone}` : 'none',
              }}>
                <div>
                  <div style={{ fontFamily: F, fontSize: 13, fontWeight: current ? 600 : 500, color: C.darkInk }}>{label}</div>
                  <div style={{ fontFamily: F, fontSize: 11, color: '#7A857E', marginTop: 2 }}>{timeAgo(iter.created_at)}</div>
                </div>
                {current ? (
                  <span style={{ fontFamily: F, fontSize: 11, fontWeight: 600, color: '#7A857E' }}>Current</span>
                ) : (
                  <a
                    href={`/trip/${iter.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      fontFamily: F, fontSize: 12, fontWeight: 600,
                      color: C.oceanTeal, textDecoration: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    Open ↗
                  </a>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
