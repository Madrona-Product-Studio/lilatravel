/**
 * SubGuideLayout.jsx — Shared wrapper for destination sub-guide pages.
 *
 * Provides: Nav, back link, eyebrow + title + description + rule, {children}, Footer.
 * No GuideNav, no WhisperBar.
 */

import { Link } from 'react-router-dom';
import { Nav, Footer } from '@components';
import { G } from '@data/guides/guide-styles';

export default function SubGuideLayout({
  title,
  eyebrow = 'Zion & Its Orbit',
  description,
  backTo = '/destinations/zion',
  backLabel = 'Zion & Its Orbit',
  children,
}) {
  return (
    <div className="font-body min-h-screen flex flex-col" style={{ background: G.bg, color: G.ink }}>
      <Nav />

      <main className="flex-1 max-w-[700px] w-full mx-auto px-7 pt-6 pb-16">
        {/* Back link */}
        <Link
          to={backTo}
          className="inline-flex items-center gap-1.5 font-body text-[12px] font-semibold tracking-[0.06em] no-underline mb-8 transition-opacity duration-200 hover:opacity-60"
          style={{ color: G.accent }}
        >
          <span className="text-[14px]">←</span> {backLabel}
        </Link>

        {/* Header */}
        <div className="mb-10">
          {/* Eyebrow with accent bar */}
          <div className="flex items-center gap-2 mb-3">
            <span style={{ width: 28, height: 1.5, background: G.accent, display: 'block' }} />
            <span
              className="font-body text-[10px] font-bold tracking-[0.22em] uppercase"
              style={{ color: G.accentMid }}
            >
              {eyebrow}
            </span>
          </div>

          <h1
            className="font-serif font-light leading-[1.15] mb-3 mt-0"
            style={{ fontSize: 'clamp(32px, 6vw, 44px)', color: G.ink, letterSpacing: '-0.01em' }}
          >
            {title}
          </h1>

          {description && (
            <p
              className="font-body text-[14px] font-normal leading-[1.75] mt-0 mb-0"
              style={{ color: G.inkBody }}
            >
              {description}
            </p>
          )}

          <div className="mt-5" style={{ height: 1, background: G.border }} />
        </div>

        {/* Content */}
        {children}
      </main>

      <Footer />
    </div>
  );
}
