/**
 * Movements.jsx — Lila Movements Card Deck
 * ═════════════════════════════════════════
 *
 * Full-screen swipeable deck, same interaction model as Meditations.
 *
 * Screen sequence:
 *   Cover → Chapters Overview → per chapter: [Title → TOC → ...cards]
 *
 * Route: /practice/movements
 */

import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate as useRouterNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { C, FONTS } from '@data/brand';
import MovementTabs from '@components/movements/MovementTabs';
import DeckMark from '@components/guide/DeckMarks';
import PrincipleMark from '@components/guide/PrincipleMarks';

const SANS = FONTS.body;

// ═══════════════════════════════════════════════════════════════════════════════
// FLIP ARROW (reused on card faces)
// ═══════════════════════════════════════════════════════════════════════════════

function FlipArrow({ dark = false }) {
  const stroke = dark ? '#1C1917' : 'white';
  return (
    <svg width="22" height="22" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="M3 8 a5 5 0 1 0 5 -5" stroke={stroke} strokeWidth="1.2" strokeLinecap="round" fill="none" />
      <path d="M2.6 4.5 L3 8 L6.4 7.6" stroke={stroke} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// WELCOME SCREEN (matches Meditations WelcomeScreen layout exactly)
// ═══════════════════════════════════════════════════════════════════════════════

function WelcomeScreen({ welcome }) {
  if (!welcome) return null;
  return (
    <div style={{
      width: '100%', height: '100%',
      background: '#F7F4EE',
      display: 'flex', flexDirection: 'column',
      justifyContent: 'center',
      padding: '0 36px 48px',
      position: 'relative', overflow: 'hidden',
      borderRadius: 14,
      border: '0.5px solid rgba(0,0,0,0.08)',
    }}>
      {/* Subtle warm glow */}
      <div style={{
        position: 'absolute', bottom: '-5%', left: '50%',
        transform: 'translateX(-50%)',
        width: '100%', height: '35%',
        background: 'radial-gradient(ellipse, rgba(180,100,60,0.05) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Title */}
      <div style={{
        fontSize: 'clamp(46px, 10vw, 58px)', fontFamily: SANS,
        color: '#1C1917', fontWeight: 700, lineHeight: 1.0,
        letterSpacing: '-0.01em', marginBottom: 10,
        position: 'relative',
      }}>
        {welcome.title}
      </div>

      {/* Tagline */}
      <div style={{
        fontSize: 15, fontFamily: SANS, fontWeight: 500,
        color: 'rgba(28,25,23,0.58)', lineHeight: 1.75,
        marginBottom: 22,
        position: 'relative',
      }}>
        {welcome.tagline}
      </div>

      {/* Bold line */}
      <div style={{ position: 'relative', marginBottom: 8 }}>
        <div style={{
          fontSize: 17, fontFamily: SANS, fontWeight: 600,
          color: 'rgba(28,25,23,0.82)', lineHeight: 1.55,
          marginBottom: 14,
        }}>
          {welcome.bold}
        </div>
        <div style={{
          fontSize: 15, fontFamily: SANS, fontWeight: 400,
          color: 'rgba(28,25,23,0.55)', lineHeight: 2.0,
        }}>
          {welcome.lines.map((line, i) => (
            <span key={i}>{line}{i < welcome.lines.length - 1 && <br />}</span>
          ))}
        </div>
      </div>

      {/* Return */}
      <div style={{
        fontSize: 14, fontFamily: SANS,
        color: 'rgba(28,25,23,0.4)', lineHeight: 1.9,
        position: 'relative',
      }}>
        {welcome.returnLine}
      </div>

      {/* Bottom anchor */}
      <div style={{
        position: 'absolute', bottom: 36, left: 36,
        fontSize: 12, fontFamily: SANS,
        color: 'rgba(28,25,23,0.25)',
        letterSpacing: '0.04em',
      }}>
        {welcome.bottomAnchor}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// COVER SCREEN
// ═══════════════════════════════════════════════════════════════════════════════

function CoverScreen({ subtitle, countLabel, markIds }) {
  // Warm sky gradient — sibling to the meditations cover but earthier
  const sky = ['#4a6858', '#6a7868', '#a08060', '#c89868'];

  return (
    <div style={{
      width: '100%', height: '100%',
      position: 'relative', overflow: 'hidden',
      borderRadius: 14,
    }}>
      {/* Sky gradient */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `linear-gradient(185deg, ${sky[0]} 0%, ${sky[1]} 30%, ${sky[2]} 60%, ${sky[3]} 100%)`,
      }} />

      {/* Sun glow */}
      <div style={{
        position: 'absolute', left: '50%', top: '55%',
        transform: 'translate(-50%, -50%)',
        width: 220, height: 220, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(200,152,104,0.5) 0%, rgba(200,128,64,0.15) 45%, transparent 70%)',
        filter: 'blur(32px)', pointerEvents: 'none',
      }} />

      {/* Wave silhouettes — uniform sine-like curves */}
      {/* Wave silhouettes — waves at top, solid fill to bottom */}
      <svg style={{ position: 'absolute', bottom: 0, width: '100%', height: '45%' }}
        viewBox="0 0 400 200" preserveAspectRatio="none">
        {/* Back wave — offset phase */}
        <path d="M0,200 L0,70 C33,50 66,50 100,70 C133,90 166,90 200,70 C233,50 266,50 300,70 C333,90 366,90 400,70 L400,200 Z"
          fill="rgba(20,28,22,0.40)" />
        {/* Front wave */}
        <path d="M0,200 L0,85 C33,65 66,65 100,85 C133,105 166,105 200,85 C233,65 266,65 300,85 C333,105 366,105 400,85 L400,200 Z"
          fill="rgba(20,28,22,0.82)" />
      </svg>

      {/* Bottom vignette */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to bottom, rgba(20,28,22,0.05) 0%, rgba(20,28,22,0.4) 100%)',
        pointerEvents: 'none',
      }} />

      {/* Content */}
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '0 28px 15%', gap: 16, zIndex: 2,
      }}>
        {/* Section/chapter marks */}
        {markIds && markIds.length > 0 && (
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            {markIds.map(id => (
              <DeckMark key={id} id={id} size={22} />
            ))}
          </div>
        )}
        <div style={{
          width: 28, height: '0.5px',
          background: 'rgba(255,255,255,0.35)',
        }} />
        <div style={{ textAlign: 'center' }}>
          <div style={{
            fontSize: 'clamp(42px,10vw,58px)', fontFamily: SANS,
            color: C.warmWhite, fontWeight: 700, lineHeight: 1.0,
            letterSpacing: '-0.01em',
            textShadow: '0 2px 24px rgba(0,0,0,0.3)',
          }}>lila</div>
          <div style={{
            fontSize: 'clamp(42px,10vw,58px)', fontFamily: SANS,
            color: C.warmWhite, fontWeight: 700, lineHeight: 1.0,
            letterSpacing: '-0.01em',
            textShadow: '0 2px 24px rgba(0,0,0,0.3)',
          }}>movements</div>
        </div>
        <div style={{
          width: 28, height: '0.5px',
          background: 'rgba(255,255,255,0.35)',
        }} />
        <div style={{
          fontSize: 12, fontFamily: SANS,
          color: 'rgba(255,255,255,0.75)', fontWeight: 400,
          letterSpacing: '0.06em', textAlign: 'center', lineHeight: 1.9,
        }}>
          {subtitle || 'the body as teacher'}
        </div>
        <div style={{
          fontSize: 11, fontFamily: SANS,
          color: 'rgba(255,255,255,0.35)', fontWeight: 400,
          letterSpacing: '0.06em',
        }}>
          {countLabel}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// CHAPTERS OVERVIEW SCREEN
// ═══════════════════════════════════════════════════════════════════════════════

function ChaptersScreen({ chapters }) {
  const chapterList = chapters;
  return (
    <div style={{
      width: '100%', height: '100%',
      background: '#F7F4EE',
      display: 'flex', flexDirection: 'column',
      justifyContent: 'center',
      padding: '0 32px',
      position: 'relative', overflow: 'hidden',
      borderRadius: 14,
      border: '0.5px solid rgba(0,0,0,0.08)',
    }}>
      {/* Title */}
      <div style={{
        fontSize: 'clamp(32px, 8vw, 42px)', fontFamily: SANS,
        color: '#1C1917', fontWeight: 700, lineHeight: 1.0,
        letterSpacing: '-0.01em', marginBottom: 32,
      }}>
        Chapters
      </div>

      {/* Chapter list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {chapterList.map((ch, i) => (
          <div key={ch.id}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 4 }}>
              <div style={{
                width: 20, height: 2,
                background: ch.accent,
                flexShrink: 0,
                marginBottom: 2,
              }} />
              <div style={{
                fontSize: 18, fontFamily: SANS,
                fontWeight: 600,
                color: '#1C1917', lineHeight: 1.3,
              }}>
                {ch.title}
              </div>
            </div>
            <div style={{
              fontSize: 13, fontFamily: SANS,
              fontWeight: 400, color: 'rgba(28,25,23,0.45)',
              paddingLeft: 30, lineHeight: 1.5,
            }}>
              {ch.subtitle}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom hint */}
      <div style={{
        position: 'absolute', bottom: 32, left: 32,
        fontSize: 12, fontFamily: SANS,
        color: 'rgba(28,25,23,0.25)',
        letterSpacing: '0.04em',
      }}>
        Swipe to begin.
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// CHAPTER TITLE SCREEN
// ═══════════════════════════════════════════════════════════════════════════════

function ChapterTitleScreen({ chapter, chapterIndex, markId }) {
  return (
    <div style={{
      width: '100%', height: '100%',
      background: chapter.accent,
      display: 'flex', flexDirection: 'column',
      justifyContent: 'center',
      padding: '0 32px',
      position: 'relative', overflow: 'hidden',
      borderRadius: 14,
    }}>
      {/* Radial highlight */}
      <div
        aria-hidden
        style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse at 50% 10%, rgba(255,255,255,0.09) 0%, transparent 55%)',
          pointerEvents: 'none',
        }}
      />

      {/* Chapter mark */}
      {markId && (
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16, position: 'relative' }}>
          <DeckMark id={markId} size={52} />
        </div>
      )}

      {/* Chapter number */}
      <div style={{
        fontSize: 12, fontFamily: SANS,
        fontWeight: 600, color: 'rgba(255,255,255,0.4)',
        letterSpacing: '0.14em', textTransform: 'uppercase',
        marginBottom: 16,
        position: 'relative',
      }}>
        Chapter {chapterIndex + 1}
      </div>

      {/* Title */}
      <div style={{
        fontSize: 'clamp(28px, 7vw, 38px)', fontFamily: SANS,
        color: 'white', fontWeight: 700, lineHeight: 1.1,
        letterSpacing: '-0.01em', marginBottom: 16,
        position: 'relative',
      }}>
        {chapter.title}
      </div>

      {/* Divider */}
      <div style={{
        width: 28, height: '0.5px',
        background: 'rgba(255,255,255,0.35)',
        marginBottom: 16,
      }} />

      {/* Description */}
      <div style={{
        fontSize: 15, fontFamily: SANS,
        fontWeight: 400, color: 'rgba(255,255,255,0.7)',
        lineHeight: 1.8, maxWidth: '92%',
        position: 'relative',
      }}>
        {chapter.desc}
      </div>

      {/* Group count */}
      <div style={{
        position: 'absolute', bottom: 32, left: 32,
        fontSize: 11, fontFamily: SANS,
        color: 'rgba(255,255,255,0.3)',
        letterSpacing: '0.06em',
      }}>
        {chapter.groups.length} {chapter.groups.length === 1 ? 'section' : 'sections'} &middot;{' '}
        {chapter.groups.reduce((s, g) => s + g.cards.length, 0)} cards
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// CHAPTER TOC SCREEN
// ═══════════════════════════════════════════════════════════════════════════════

function ChapterTocScreen({ chapter }) {
  return (
    <div style={{
      width: '100%', height: '100%',
      background: chapter.accent,
      display: 'flex', flexDirection: 'column',
      justifyContent: 'center',
      padding: '0 28px',
      position: 'relative', overflow: 'hidden',
      borderRadius: 14,
    }}>
      {/* Radial highlight */}
      <div aria-hidden style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse at 50% 10%, rgba(255,255,255,0.09) 0%, transparent 55%)',
        pointerEvents: 'none',
      }} />

      {/* Section label */}
      <div style={{
        fontSize: 11, fontFamily: SANS,
        fontWeight: 600, color: 'rgba(255,255,255,0.4)',
        letterSpacing: '0.14em', textTransform: 'uppercase',
        marginBottom: 8,
        position: 'relative',
      }}>
        {chapter.title}
      </div>

      {/* Title */}
      <div style={{
        fontSize: 'clamp(28px, 7vw, 36px)', fontFamily: SANS,
        color: 'white', fontWeight: 700, lineHeight: 1.1,
        letterSpacing: '-0.01em', marginBottom: 28,
        position: 'relative',
      }}>
        Sections
      </div>

      {/* Content list — card terms for small chapters, group names for large ones */}
      {(() => {
        const totalCards = chapter.groups.reduce((s, g) => s + g.cards.length, 0);
        const isSmall = totalCards <= 4;

        if (isSmall) {
          // List individual card terms
          const allCards = chapter.groups.flatMap(g => g.cards);
          return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, position: 'relative' }}>
              {allCards.map((card) => (
                <div key={card.id} style={{
                  fontSize: 16, fontFamily: SANS,
                  fontWeight: 600,
                  color: 'rgba(255,255,255,0.85)', lineHeight: 1.2,
                }}>
                  {card.term}
                </div>
              ))}
            </div>
          );
        }

        // List groups
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18, position: 'relative' }}>
            {chapter.groups.map((group) => (
              <div key={group.id}>
                <div style={{
                  fontSize: 16, fontFamily: SANS,
                  fontWeight: 600,
                  color: 'rgba(255,255,255,0.85)', lineHeight: 1.2,
                  marginBottom: 3,
                }}>
                  {group.label}
                </div>
                <div style={{
                  fontSize: 12, fontFamily: SANS,
                  fontWeight: 400, color: 'rgba(255,255,255,0.4)',
                }}>
                  {group.subtitle} &middot; {group.cards.length} cards
                </div>
              </div>
            ))}
          </div>
        );
      })()}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// GROUP TITLE SCREEN (section divider before each group's cards)
// ═══════════════════════════════════════════════════════════════════════════════

function GroupTitleScreen({ group, chapter }) {
  const accent = chapter.accent;

  return (
    <div style={{
      width: '100%', height: '100%',
      background: accent,
      display: 'flex', flexDirection: 'column',
      justifyContent: 'center',
      position: 'relative', overflow: 'hidden',
      borderRadius: 14,
    }}>
      {/* Radial highlight */}
      <div aria-hidden style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse at 50% 10%, rgba(255,255,255,0.09) 0%, transparent 55%)',
        pointerEvents: 'none',
      }} />

      {/* ── Header (centered) ── */}
      <div style={{
        textAlign: 'center',
        padding: '0 28px',
        position: 'relative',
      }}>
        {/* Section mark */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
          <DeckMark id={group.id} size={52} />
        </div>

        {/* Chapter context */}
        <div style={{
          fontSize: 9, fontFamily: SANS,
          fontWeight: 600, color: 'rgba(255,255,255,0.35)',
          letterSpacing: '0.18em', textTransform: 'uppercase',
          marginBottom: 14,
        }}>
          {chapter.title}
        </div>

        {/* Group name */}
        <div style={{
          fontSize: 'clamp(26px, 6vw, 34px)', fontFamily: SANS,
          color: 'white', fontWeight: 700, lineHeight: 1.1,
          letterSpacing: '-0.01em', marginBottom: 8,
        }}>
          {group.label}
        </div>

        {/* Subtitle */}
        <div style={{
          fontSize: 14, fontFamily: SANS,
          fontWeight: 400, color: 'rgba(255,255,255,0.5)',
          lineHeight: 1.5,
        }}>
          {group.subtitle}
        </div>

        {/* Divider */}
        <div style={{
          width: 28, height: '0.5px',
          background: 'rgba(255,255,255,0.25)',
          margin: '18px auto 0',
        }} />
      </div>

      {/* ── Description (if present) ── */}
      {group.desc && (
        <div style={{
          padding: '18px 28px 0',
          position: 'relative',
        }}>
          <div style={{
            fontSize: 15, fontFamily: SANS,
            fontWeight: 400, color: 'rgba(255,255,255,0.65)',
            lineHeight: 1.75,
          }}>
            {group.desc}
          </div>
        </div>
      )}

      {/* ── Card list ── */}
      <div style={{
        padding: '20px 28px 0',
        position: 'relative',
      }}>
        {group.cards.map((card, i) => (
          <div key={card.id} style={{
            display: 'flex', alignItems: 'baseline',
            padding: '10px 0',
            borderTop: i === 0 ? 'none' : '0.5px solid rgba(255,255,255,0.08)',
          }}>
            {/* Number */}
            <div style={{
              fontSize: 12, fontFamily: SANS,
              fontWeight: 400, color: 'rgba(255,255,255,0.25)',
              width: 32, flexShrink: 0,
            }}>
              {i + 1}.
            </div>

            {/* Term */}
            <div style={{
              fontSize: 15, fontFamily: SANS,
              fontWeight: 500, color: 'rgba(255,255,255,0.75)',
              flex: 1, lineHeight: 1.3,
            }}>
              {card.term}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// CARD SCREEN (two-faced flip card)
// ═══════════════════════════════════════════════════════════════════════════════

function CardScreen({ card, group, chapter }) {
  const [flipped, setFlipped] = useState(false);
  const [flipAnimating, setFlipAnimating] = useState(false);

  const handleFlip = (e) => {
    // Don't flip if clicking inside tabs
    if (e?.target?.closest?.('[data-no-flip]')) return;
    if (flipAnimating) return;
    setFlipAnimating(true);
    setFlipped(f => !f);
    setTimeout(() => setFlipAnimating(false), 520);
  };

  const accent = chapter.accent;

  return (
    <div style={{
      width: '100%', height: '100%',
      perspective: 1200,
      borderRadius: 14,
      overflow: 'hidden',
    }}>
      <div style={{
        width: '100%', height: '100%',
        position: 'relative',
        transformStyle: 'preserve-3d',
        willChange: 'transform',
        transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        animation: flipAnimating
          ? `${flipped ? 'flipCard' : 'flipCardBack'} 0.5s ease-in-out forwards`
          : 'none',
      }}>
        {/* ── Front Face ── */}
        <div
          onClick={handleFlip}
          style={{
            position: 'absolute', inset: 0,
            background: card.image ? '#F7F4EE' : accent,
            color: card.image ? '#1C1917' : 'white',
            cursor: 'pointer',
            overflow: 'hidden',
            borderRadius: 14,
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            WebkitTapHighlightColor: 'transparent',
            ...(card.image ? { border: '0.5px solid rgba(0,0,0,0.08)' } : {}),
          }}
        >
          {/* Radial highlight — only on solid-color cards */}
          {!card.image && (
            <div aria-hidden style={{
              position: 'absolute', inset: 0,
              background: 'radial-gradient(ellipse at 50% 10%, rgba(255,255,255,0.09) 0%, transparent 55%)',
              pointerEvents: 'none',
            }} />
          )}

          <div style={{
            position: 'relative',
            height: '100%',
            display: 'flex', flexDirection: 'column',
            justifyContent: card.image ? 'center' : 'flex-start',
          }}>
            {/* ── Image card layout: image as background, fading into cream ── */}
            {card.image && (<>
              {/* Full-bleed image behind card, centered vertically in upper half */}
              <div aria-hidden style={{
                position: 'absolute', inset: 0,
                overflow: 'hidden',
              }}>
                <img
                  src={`/images/anatomy/${card.image}`}
                  alt=""
                  style={{
                    width: '100%', height: '60%',
                    objectFit: 'cover', objectPosition: 'center',
                    mixBlendMode: 'multiply',
                  }}
                />
                {/* Fade image into cream */}
                <div style={{
                  position: 'absolute', left: 0, right: 0,
                  top: '35%', bottom: 0,
                  background: 'linear-gradient(to bottom, rgba(247,244,238,0) 0%, #F7F4EE 55%)',
                  pointerEvents: 'none',
                }} />
              </div>

              {/* Text content — positioned in lower portion */}
              <div style={{
                position: 'relative',
                marginTop: 'auto',
                padding: '0 clamp(20px, 4vw, 28px) clamp(52px, 8vh, 64px)',
              }}>
                {/* Section mark + label */}
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  marginBottom: 10,
                }}>
                  <DeckMark id={group.id} size={18} color={accent} />
                  <div style={{
                    fontSize: 9, fontFamily: SANS,
                    fontWeight: 600, color: accent,
                    opacity: 0.6,
                    letterSpacing: '0.18em', textTransform: 'uppercase',
                  }}>
                    {group.label}
                  </div>
                </div>

                {/* Term */}
                <div style={{
                  fontSize: 'clamp(22px, 5vw, 26px)',
                  fontFamily: SANS, fontWeight: 700,
                  color: '#1C1917', lineHeight: 1.1,
                  letterSpacing: '-0.01em', marginBottom: 10,
                }}>
                  {card.term}
                </div>

                {/* Sanskrit */}
                {card.sanskrit && (
                  <div style={{
                    fontSize: 14, fontFamily: SANS, fontWeight: 300,
                    color: 'rgba(28,25,23,0.4)',
                    marginTop: -6, marginBottom: 8,
                  }}>
                    {card.sanskrit}
                  </div>
                )}

                {/* Brief */}
                <div style={{
                  fontSize: 15, fontFamily: SANS, fontWeight: 400,
                  color: 'rgba(28,25,23,0.55)', lineHeight: 1.7,
                }}>
                  {card.brief}
                </div>
              </div>
            </>)}

            {/* ── Non-image card layout ── */}
            {!card.image && (
              <div style={{
                flex: 1, display: 'flex', flexDirection: 'column',
                padding: 'clamp(60px, 12vh, 100px) clamp(20px, 4vw, 28px) clamp(52px, 8vh, 64px)',
              }}>
                {/* Section mark + label */}
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  marginBottom: 8,
                }}>
                  <DeckMark id={group.id} size={18} color="rgba(255,255,255,0.55)" />
                  <div style={{
                    fontSize: 12, fontFamily: SANS,
                    fontWeight: 600, color: 'rgba(255,255,255,0.55)',
                    letterSpacing: '0.12em', textTransform: 'uppercase',
                  }}>
                    {group.label}
                  </div>
                </div>

                {/* Term */}
                <div style={{
                  fontSize: 'clamp(22px, 5vw, 26px)',
                  fontFamily: SANS, fontWeight: 700,
                  color: 'white', lineHeight: 1.1,
                  letterSpacing: '-0.01em', marginBottom: 10,
                }}>
                  {card.term}
                </div>

                {/* Sanskrit */}
                {card.sanskrit && (
                  <div style={{
                    fontSize: 14, fontFamily: SANS, fontWeight: 300,
                    color: 'rgba(255,255,255,0.45)',
                    marginTop: -6, marginBottom: 8,
                  }}>
                    {card.sanskrit}
                  </div>
                )}
                {!card.sanskrit && <div style={{ height: 12 }} />}

                {/* Brief */}
                <div style={{
                  fontSize: 15, fontFamily: SANS, fontWeight: 400,
                  color: 'rgba(255,255,255,0.85)', lineHeight: 1.7,
                  flex: 1, overflow: 'auto',
                }}>
                  {card.brief}
                </div>
              </div>
            )}

            {/* Flip cue — anchored bottom-right */}
            <div style={{
              position: 'absolute',
              bottom: 'clamp(16px, 3vw, 22px)',
              right: 'clamp(18px, 3.5vw, 26px)',
              display: 'flex', alignItems: 'center', gap: 6,
            }}>
              <span style={{
                fontSize: 11, fontFamily: SANS, fontWeight: 400,
                color: card.image ? accent : 'white',
                opacity: card.image ? 0.6 : 0.5,
                letterSpacing: '0.06em', textTransform: 'uppercase',
              }}>flip</span>
              <div style={{
                width: 22, height: 22, borderRadius: '50%',
                border: card.image ? `1px solid ${accent}40` : '1px solid rgba(255,255,255,0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                opacity: 0.6,
              }}>
                <FlipArrow dark={!!card.image} />
              </div>
            </div>
          </div>
        </div>

        {/* ── Back Face ── */}
        <div
          onClick={handleFlip}
          style={{
            position: 'absolute', inset: 0,
            background: '#F7F4EE',
            color: '#1C1917',
            cursor: 'pointer',
            overflow: 'hidden',
            borderRadius: 14,
            border: '0.5px solid rgba(0,0,0,0.08)',
            transform: 'rotateY(180deg)',
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            WebkitTapHighlightColor: 'transparent',
            display: 'flex', flexDirection: 'column',
          }}
        >
          <div style={{
            flex: 1,
            display: 'flex', flexDirection: 'column',
            padding: 'clamp(16px, 3.5vw, 28px)',
            paddingTop: 'clamp(24px, 4vw, 32px)',
            overflow: 'auto',
          }}>
            {/* Deep Dive label */}
            <div style={{
              fontSize: 13, fontFamily: SANS,
              fontWeight: 600, color: accent,
              letterSpacing: '0.01em', marginBottom: 6,
            }}>
              Deep Dive
            </div>

            {/* Term */}
            <div style={{
              fontSize: 22, fontFamily: SANS,
              fontWeight: 700, color: '#1C1917',
              lineHeight: 1.2, letterSpacing: '-0.01em',
              marginBottom: 16,
            }}>
              {card.term}
            </div>

            {/* Mnemonic */}
            {card.mnemonic && (
              <div style={{
                fontSize: 14, fontFamily: SANS,
                fontWeight: 400, fontStyle: 'italic',
                color: 'rgba(44,36,32,0.6)',
                lineHeight: 1.7,
                borderLeft: `2px solid ${accent}99`,
                paddingLeft: 14, marginBottom: 20,
              }}>
                {card.mnemonic}
              </div>
            )}

            {/* Tabs */}
            <div data-no-flip style={{ flex: 1 }}>
              <MovementTabs tabs={card.tabs} accent={accent} />
            </div>
          </div>

          {/* Flip back cue */}
          <div style={{
            position: 'absolute', right: 22, bottom: 18,
            display: 'flex', alignItems: 'center', gap: 6,
          }}>
            <span style={{
              fontSize: 8, fontFamily: SANS,
              color: '#8C7B6B', opacity: 0.5,
              letterSpacing: '0.12em', textTransform: 'uppercase',
            }}>back</span>
            <div style={{ opacity: 0.5 }}>
              <FlipArrow dark />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// CONTINUE SCREEN (end card — mirrors Welcome)
// ═══════════════════════════════════════════════════════════════════════════════

const SIBLING_DECKS = [
  { key: 'meditations', name: 'Meditations', desc: 'Five principles, thirty practices.', route: '/practice/meditations', markType: 'principle', markId: 'presence' },
  { key: 'movements', name: 'Movements', desc: 'The practice of the body.', route: '/practice/movements/practice', markType: 'deck', markId: 'arrive' },
  { key: 'body', name: 'Body', desc: 'The body beneath the movement.', route: '/practice/movements/science', markType: 'deck', markId: 'body' },
  { key: 'teachings', name: 'Teachings', desc: 'The wisdom beneath the practice.', route: '/practice/teachings', markType: 'text', markSymbol: '\u0950\uFE0E' },
];

function SiblingMark({ deck, size = 28 }) {
  const color = 'rgba(28,25,23,0.4)';
  if (deck.markType === 'principle') return <PrincipleMark id={deck.markId} size={size} color={color} />;
  if (deck.markType === 'deck') return <DeckMark id={deck.markId} size={size} color={color} />;
  return <span style={{ fontSize: size * 0.7, color, lineHeight: 1 }}>{deck.markSymbol}</span>;
}

function ContinueScreen({ continueConfig }) {
  const nav = useRouterNavigate();
  if (!continueConfig) return null;
  const siblings = SIBLING_DECKS.filter(d => !continueConfig.omit.includes(d.key));
  return (
    <div style={{
      width: '100%', height: '100%',
      background: '#F7F4EE',
      display: 'flex', flexDirection: 'column',
      justifyContent: 'center',
      padding: '0 36px 48px',
      position: 'relative', overflow: 'hidden',
      borderRadius: 14,
      border: '0.5px solid rgba(0,0,0,0.08)',
    }}>
      {/* Subtle warm glow */}
      <div style={{
        position: 'absolute', bottom: '-5%', left: '50%',
        transform: 'translateX(-50%)',
        width: '100%', height: '35%',
        background: 'radial-gradient(ellipse, rgba(180,100,60,0.05) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Title */}
      <div style={{
        fontSize: 'clamp(46px, 10vw, 58px)', fontFamily: SANS,
        color: '#1C1917', fontWeight: 700, lineHeight: 1.0,
        letterSpacing: '-0.01em', marginBottom: 10,
        position: 'relative',
      }}>
        Continue
      </div>

      {/* Subtitle */}
      <div style={{
        fontSize: 15, fontFamily: SANS, fontWeight: 500,
        color: 'rgba(28,25,23,0.58)', lineHeight: 1.75,
        marginBottom: 22,
        position: 'relative',
      }}>
        {continueConfig.subtitle}
      </div>

      {/* Three lines */}
      <div style={{ position: 'relative', marginBottom: 14 }}>
        <div style={{
          fontSize: 15, fontFamily: SANS, fontWeight: 400,
          color: 'rgba(28,25,23,0.55)', lineHeight: 2.0,
        }}>
          {continueConfig.lines.map((line, i) => (
            <span key={i}>{line}{i < continueConfig.lines.length - 1 && <br />}</span>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div style={{ height: '0.5px', background: 'rgba(28,25,23,0.08)', margin: '20px 0 16px', position: 'relative' }} />

      {/* Up next label */}
      <div style={{
        fontSize: 10, fontFamily: SANS,
        color: 'rgba(28,25,23,0.35)',
        letterSpacing: '0.22em',
        textTransform: 'uppercase',
        marginBottom: 12,
        position: 'relative',
      }}>
        Up next
      </div>

      {/* Sibling deck rows */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 0, position: 'relative' }}>
        {siblings.map((deck, i) => (
          <div
            key={deck.key}
            onClick={() => nav(deck.route)}
            style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '10px 0',
              borderTop: i > 0 ? '0.5px solid rgba(28,25,23,0.08)' : 'none',
              cursor: 'pointer',
            }}
          >
            <div style={{ width: 28, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <SiblingMark deck={deck} size={22} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontFamily: SANS, fontWeight: 600, color: '#1C1917', letterSpacing: '0.02em' }}>
                {deck.name}
              </div>
              <div style={{ fontSize: 11, fontFamily: SANS, color: 'rgba(28,25,23,0.45)' }}>
                {deck.desc}
              </div>
            </div>
            <div style={{ fontSize: 16, color: 'rgba(28,25,23,0.25)' }}>→</div>
          </div>
        ))}
      </div>

      {/* All decks link */}
      <div
        onClick={() => nav('/practice')}
        style={{
          fontSize: 12, fontFamily: SANS,
          color: 'rgba(28,25,23,0.35)',
          letterSpacing: '0.04em',
          marginTop: 14,
          cursor: 'pointer',
          position: 'relative',
        }}
      >
        ◈ All card decks
      </div>

      {/* Footer */}
      <div style={{
        position: 'absolute', bottom: 36, left: 36,
        fontSize: 12, fontFamily: SANS,
        color: 'rgba(28,25,23,0.25)',
        letterSpacing: '0.04em',
      }}>
        The walk continues.
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SCREEN RENDERER
// ═══════════════════════════════════════════════════════════════════════════════

function renderScreen(scr, deckConfig) {
  if (!scr) return null;
  if (scr.type === 'cover') {
    if (deckConfig?.coverOverride) {
      const Override = deckConfig.coverOverride;
      return <Override />;
    }
    return <CoverScreen subtitle={deckConfig?.subtitle} countLabel={deckConfig?.countLabel} markIds={deckConfig?.markIds} />;
  }
  if (scr.type === 'welcome') return <WelcomeScreen welcome={deckConfig?.welcome} />;
  if (scr.type === 'chapters') return <ChaptersScreen chapters={deckConfig?.chapters} />;
  if (scr.type === 'chapter-title') return <ChapterTitleScreen chapter={scr.chapter} chapterIndex={scr.chapterIndex} markId={deckConfig?.chapterMarkMap?.[scr.chapter.id]} />;
  if (scr.type === 'chapter-toc') return <ChapterTocScreen chapter={scr.chapter} />;
  if (scr.type === 'group-title') return <GroupTitleScreen key={`gt-${scr.chapterIndex}-${scr.groupIndex}`} group={scr.group} chapter={scr.chapter} />;
  if (scr.type === 'card') return <CardScreen key={`${scr.chapterIndex}-${scr.groupIndex}-${scr.cardIndex}`} card={scr.card} group={scr.group} chapter={scr.chapter} />;
  if (scr.type === 'continue') return <ContinueScreen continueConfig={deckConfig?.continue} />;
  return null;
}

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export { CoverScreen as MovementsCover };

export default function Movements({ screens: screensProp, deckConfig } = {}) {
  if (!screensProp || !deckConfig) {
    throw new Error('Movements requires screens and deckConfig props. Use MovementsL1 or MovementsL2 instead.');
  }
  const SCREENS = screensProp;
  const config = deckConfig;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [baseIndex, setBaseIndex] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [animScreen, setAnimScreen] = useState(null);
  const [animType, setAnimType] = useState(null);
  const touchStartX = useRef(null);
  const touchStartY = useRef(null);

  const total = SCREENS.length;

  const navigate = useCallback((dir) => {
    if (animating) return;
    const next = currentIndex + dir;
    if (next < 0 || next >= total) return;
    setAnimating(true);

    if (dir > 0) {
      setBaseIndex(next);
      setAnimScreen(SCREENS[currentIndex]);
      setAnimType('exit');
      setCurrentIndex(next);
      setTimeout(() => {
        setAnimScreen(null);
        setAnimType(null);
        setAnimating(false);
      }, 280);
    } else {
      setAnimScreen(SCREENS[next]);
      setAnimType('enter');
      setTimeout(() => {
        setBaseIndex(next);
        setCurrentIndex(next);
        setAnimScreen(null);
        setAnimType(null);
        setAnimating(false);
      }, 300);
    }
  }, [animating, currentIndex, total]);

  // Lock body scroll
  useEffect(() => {
    const prev = document.body.style.overflow;
    const prevTouch = document.body.style.touchAction;
    document.body.style.overflow = 'hidden';
    document.body.style.touchAction = 'none';
    document.documentElement.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
      document.body.style.touchAction = prevTouch;
      document.documentElement.style.overflow = '';
    };
  }, []);

  // Keyboard
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'ArrowRight') navigate(1);
      if (e.key === 'ArrowLeft') navigate(-1);
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  // Touch swipe
  function handleTouchStart(e) {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  }
  function handleTouchMove(e) { e.preventDefault(); }
  function handleTouchEnd(e) {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = Math.abs(e.changedTouches[0].clientY - touchStartY.current);
    if (Math.abs(dx) > dy && Math.abs(dx) > 44) {
      navigate(dx < 0 ? 1 : -1);
    }
    touchStartX.current = null;
  }

  return (
    <>
      <Helmet>
        <title>{config.title}</title>
        <meta name="description" content={config.description} />
        <link rel="canonical" href="https://lilatrips.com/practice/movements" />
      </Helmet>

      {/* Keyframes + desktop-only arrows */}
      <style>{`
        .mv-deck-arrow { display: none !important; }
        @media (min-width: 768px) { .mv-deck-arrow { display: flex !important; } }
        @keyframes dealOff {
          0%   { transform: translateX(0) rotate(0deg); }
          100% { transform: translateX(-115%) rotate(-3deg); }
        }
        @keyframes stackOn {
          0%   { transform: translateX(-115%) rotate(-3deg); }
          100% { transform: translateX(0) rotate(0deg); }
        }
        @keyframes flipCard {
          0%   { transform: rotateY(0deg)   scale(1)    translateY(0); }
          50%  { transform: rotateY(90deg)  scale(1.02) translateY(-4px); }
          100% { transform: rotateY(180deg) scale(1)    translateY(0); }
        }
        @keyframes flipCardBack {
          0%   { transform: rotateY(180deg) scale(1)    translateY(0); }
          50%  { transform: rotateY(90deg)  scale(1.02) translateY(-4px); }
          100% { transform: rotateY(0deg)   scale(1)    translateY(0); }
        }
      `}</style>

      <div
        style={{
          height: '100dvh',
          background: '#E8E0D5',
          display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          fontFamily: SANS, userSelect: 'none',
          outline: 'none', position: 'relative',
          overflow: 'hidden', touchAction: 'none',
        }}
      >
        {/* Card + side arrows */}
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>

          {/* Left arrow */}
          <button
            className="mv-deck-arrow"
            onClick={() => navigate(-1)}
            aria-label="Previous"
            style={{
              background: 'none',
              border: 'none', cursor: 'pointer',
              padding: '12px 10px', marginRight: 20,
              opacity: currentIndex === 0 ? 0.15 : 0.5,
              pointerEvents: currentIndex === 0 ? 'none' : 'auto',
              transition: 'opacity 0.2s',
              color: '#6B5A50',
              alignItems: 'center', justifyContent: 'center',
            }}
            onMouseEnter={e => { if (currentIndex > 0) e.currentTarget.style.opacity = '0.9'; }}
            onMouseLeave={e => { e.currentTarget.style.opacity = currentIndex === 0 ? '0.15' : '0.5'; }}
          >
            <svg width="12" height="22" viewBox="0 0 12 22" fill="none">
              <path d="M 10 1 L 1 11 L 10 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {/* Card viewport */}
          <div
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            style={{
              width: 'min(400px, calc(100vw - 28px))',
              height: 'min(720px, calc(100dvh - 48px))',
              position: 'relative', overflow: 'hidden',
              borderRadius: 14,
              background: 'transparent',
            }}
          >
            {/* Base layer */}
            <div style={{ position: 'absolute', inset: 0, zIndex: 1 }}>
              {renderScreen(SCREENS[baseIndex], config)}
            </div>

            {/* Animation layer */}
            {animScreen && (
              <div style={{
                position: 'absolute', inset: 0, zIndex: 2,
                animation: animType === 'exit'
                  ? 'dealOff 0.28s cubic-bezier(0.4, 0, 0.8, 0.6) forwards'
                  : 'stackOn 0.30s cubic-bezier(0.2, 0, 0.1, 1) forwards',
              }}>
                {renderScreen(animScreen, config)}
              </div>
            )}
          </div>

          {/* Right arrow */}
          <button
            className="mv-deck-arrow"
            onClick={() => navigate(1)}
            aria-label="Next"
            style={{
              background: 'none',
              border: 'none', cursor: 'pointer',
              padding: '12px 10px', marginLeft: 20,
              opacity: currentIndex === total - 1 ? 0.15 : 0.5,
              pointerEvents: currentIndex === total - 1 ? 'none' : 'auto',
              transition: 'opacity 0.2s',
              color: '#6B5A50',
              alignItems: 'center', justifyContent: 'center',
            }}
            onMouseEnter={e => { if (currentIndex < total - 1) e.currentTarget.style.opacity = '0.9'; }}
            onMouseLeave={e => { e.currentTarget.style.opacity = currentIndex === total - 1 ? '0.15' : '0.5'; }}
          >
            <svg width="12" height="22" viewBox="0 0 12 22" fill="none">
              <path d="M 1 1 L 11 11 L 1 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

        </div>
      </div>
    </>
  );
}
