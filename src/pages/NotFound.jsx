// ═══════════════════════════════════════════════════════════════════════════════
// PAGE: 404
// ═══════════════════════════════════════════════════════════════════════════════

import { Link } from 'react-router-dom';
import { Nav, Footer } from '@components';

export default function NotFound() {
  return (
    <>
      <Nav />
      <section className="min-h-[80vh] flex items-center justify-center bg-cream pt-20">
        <div className="text-center max-w-[480px]">
          <span className="font-serif text-[80px] font-light text-stone block mb-4">404</span>
          <h2 className="font-body text-2xl font-light text-dark-ink mb-4">Trail Not Found</h2>
          <p className="font-body text-sm text-[#7a90a0] leading-[1.8] mb-8">
            Looks like this path hasn't been blazed yet. Let's get you back on track.
          </p>
          <Link to="/" className="underline-link">Back to Home</Link>
        </div>
      </section>
      <Footer />
    </>
  );
}
