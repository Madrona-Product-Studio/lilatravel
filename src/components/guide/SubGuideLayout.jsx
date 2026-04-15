/**
 * SubGuideLayout.jsx — Shared wrapper for Zion sub-guide pages.
 *
 * Provides: Nav, back link, eyebrow + title + description + rule, {children}, Footer.
 * No GuideNav, no WhisperBar.
 */

import { Link } from 'react-router-dom';
import { Nav, Footer } from '@components';
import { C } from '@data/brand';

export default function SubGuideLayout({
  title,
  eyebrow = 'Zion & Its Orbit',
  description,
  backTo = '/destinations/zion',
  backLabel = 'Zion & Its Orbit',
  children,
}) {
  return (
    <div className="font-body bg-warm-white text-dark-ink min-h-screen flex flex-col">
      <Nav />

      <main className="flex-1 max-w-[680px] w-full mx-auto px-5 pt-6 pb-16">
        {/* Back link */}
        <Link
          to={backTo}
          className="inline-flex items-center gap-1.5 font-body text-[12px] font-bold tracking-[0.16em] uppercase no-underline mb-8 transition-opacity duration-200 hover:opacity-60"
          style={{ color: C.oceanTeal }}
        >
          <span className="text-[14px]">←</span> {backLabel}
        </Link>

        {/* Header */}
        <div className="mb-8">
          <div
            className="font-body text-[10px] font-bold tracking-[0.22em] uppercase mb-2"
            style={{ color: C.oceanTeal }}
          >
            {eyebrow}
          </div>
          <h1 className="font-serif text-[clamp(28px,5vw,38px)] font-light text-dark-ink leading-[1.15] mb-3 mt-0">
            {title}
          </h1>
          {description && (
            <p className="font-body text-[15px] font-normal leading-[1.7] mt-0 mb-0" style={{ color: '#4A5650' }}>
              {description}
            </p>
          )}
          <div className="mt-5" style={{ height: 1, background: C.stone }} />
        </div>

        {/* Content */}
        {children}
      </main>

      <Footer />
    </div>
  );
}
