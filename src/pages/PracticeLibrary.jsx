/**
 * PracticeLibrary.jsx — Landing page for the four card deck experiences
 * Route: /practice
 */

import { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Nav, Footer } from '@components';
import { C, FONTS } from '@data/brand';
import { MeditationsCover } from '@pages/Meditations';
import { TeachingsCover } from '@pages/ethos/TeachingsDeck';
import { MovementsCover } from '@pages/Movements';
import { CoverScreen as BodyCover } from '@pages/MovementsL2';
import { L1_MARK_IDS } from '@components/guide/DeckMarks';

const SERIF = FONTS.serif;
const SANS = FONTS.body;

// Source dimensions the CoverScreen components were designed for
const SRC_W = 400;
const SRC_H = 720;
const ASPECT = SRC_H / SRC_W; // 1.8

const DECKS = [
  {
    key: 'meditations',
    route: '/practice/meditations',
    name: 'Meditations',
    subtitle: 'Reflective \u00b7 Spiritual',
    desc: '30 practice cards across five wisdom traditions.',
    Cover: () => <MeditationsCover />,
  },
  {
    key: 'teachings',
    route: '/practice/teachings',
    name: 'Teachings',
    subtitle: 'Conceptual \u00b7 Traditional',
    desc: '30 concept cards \u2014 what the traditions believe.',
    Cover: () => <TeachingsCover />,
  },
  {
    key: 'movements-l1',
    route: '/practice/movements/practice',
    name: 'Movements',
    subtitle: 'Physical \u00b7 Embodied \u00b7 L1',
    desc: '31 cards. A complete flowing yoga sequence.',
    Cover: () => (
      <MovementsCover
        subtitle="30 poses for a complete practice"
        countLabel="6 sections \u00b7 31 cards"
        markIds={L1_MARK_IDS}
      />
    ),
  },
  {
    key: 'movements-l2',
    route: '/practice/movements/science',
    name: 'Lila Body',
    subtitle: 'Intellectual \u00b7 Scientific \u00b7 L2',
    desc: '47 cards on movement science and the body.',
    Cover: () => <BodyCover />,
  },
];

function DeckTile({ deck }) {
  const { route, name, subtitle, desc, Cover } = deck;
  const containerRef = useRef(null);
  const [scale, setScale] = useState(0.5);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      setScale(entry.contentRect.width / SRC_W);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <Link
      to={route}
      style={{
        textDecoration: 'none',
        color: 'inherit',
        display: 'block',
        transition: 'transform 0.2s ease',
      }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
    >
      {/* Scaled cover thumbnail — fluid width, fixed aspect ratio */}
      <div
        ref={containerRef}
        style={{
          width: '100%',
          paddingBottom: `${ASPECT * 100}%`,
          overflow: 'hidden',
          position: 'relative',
          borderRadius: 10,
        }}
      >
        <div style={{
          width: SRC_W,
          height: SRC_H,
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
          pointerEvents: 'none',
          position: 'absolute',
          top: 0,
          left: 0,
        }}>
          <Cover />
        </div>
      </div>

      {/* Labels */}
      <div style={{
        fontSize: 18, fontFamily: SERIF, fontWeight: 400,
        color: C.darkInk, marginTop: 12,
      }}>
        {name}
      </div>
      <div style={{
        fontSize: 10, fontFamily: SANS, fontWeight: 500,
        letterSpacing: '0.1em', color: C.slate,
        textTransform: 'uppercase', marginTop: 4,
      }}>
        {subtitle}
      </div>
      <div style={{
        fontSize: 11, fontFamily: SANS, fontWeight: 400,
        color: C.slate, lineHeight: 1.6, marginTop: 6,
      }}>
        {desc}
      </div>
    </Link>
  );
}

export default function PracticeLibrary() {
  return (
    <>
      <Helmet>
        <title>Practice Library — Lila Trips</title>
        <meta name="description" content="Four card decks for the curious traveler — body, mind, tradition, and ancient practices." />
        <link rel="canonical" href="https://lilatrips.com/practice" />
      </Helmet>

      <Nav />

      {/* Hero */}
      <section style={{
        background: C.warmWhite,
        padding: '120px 28px 60px',
      }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          {/* Eyebrow */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 40, height: 1, background: C.goldenAmber }} />
            <span style={{
              fontFamily: SANS, fontSize: 10, fontWeight: 500,
              letterSpacing: '2.5px', color: C.goldenAmber,
              textTransform: 'uppercase',
            }}>
              PRACTICE LIBRARY
            </span>
          </div>

          {/* Title */}
          <h1 style={{
            fontFamily: SERIF,
            fontSize: 'clamp(32px, 6vw, 52px)',
            fontWeight: 300,
            color: C.darkInk,
            lineHeight: 1.1,
            marginTop: 0,
            marginBottom: 12,
          }}>
            Go Deeper
          </h1>

          {/* Headline */}
          <p style={{
            fontFamily: SERIF,
            fontSize: 18,
            color: C.darkInk,
            lineHeight: 1.4,
            maxWidth: 560,
            marginTop: 0,
            marginBottom: 10,
          }}>
            Ancient practices for wild places.
          </p>

          {/* Body */}
          <p style={{
            fontFamily: SERIF,
            fontSize: 16,
            color: C.slate,
            lineHeight: 1.7,
            maxWidth: 560,
            marginTop: 0,
            marginBottom: 0,
          }}>
            Four ways to help you move through these landscapes differently — with more attention, more intention, and more of yourself present.
          </p>
        </div>
      </section>

      {/* Deck grid */}
      <section style={{
        background: C.warmWhite,
        padding: '0 28px 80px',
      }}>
        <div
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
          style={{ maxWidth: 960, margin: '0 auto' }}
        >
          {DECKS.map(deck => (
            <DeckTile key={deck.key} deck={deck} />
          ))}
        </div>
      </section>

      <Footer />
    </>
  );
}
