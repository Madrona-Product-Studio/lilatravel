// ═══════════════════════════════════════════════════════════════════════════════
// PAGE: PRIVACY POLICY
// ═══════════════════════════════════════════════════════════════════════════════

import { Nav, Footer, FadeIn } from '@components';
import { C } from '@data/brand';

const LAST_UPDATED = 'April 23, 2026';

const sections = [
  {
    title: 'What We Collect',
    content: `When you use Lila Trips, we collect only what's needed to provide our services:

• **Account information** — If you sign in with Google or Apple, we receive your name, email address, and profile photo from your provider. We do not store your password.

• **Trip data** — Destinations, preferences, and itinerary details you provide when planning a trip. This is stored so you can return to your trips later.

• **Usage data** — Anonymous analytics (page views, feature usage) to help us improve the experience. We use Vercel Analytics, which does not use cookies or track individuals across sites.`,
  },
  {
    title: 'How We Use Your Information',
    content: `• To generate and save personalized trip itineraries
• To let you access your trips across devices when signed in
• To respond to messages you send through our contact form
• To improve our service based on aggregate, anonymous usage patterns

We do not sell, rent, or share your personal information with third parties for marketing purposes.`,
  },
  {
    title: 'Data Storage & Security',
    content: `Your data is stored securely using Supabase (hosted on AWS) with encryption at rest and in transit. Authentication is handled through industry-standard OAuth 2.0 protocols via your Google or Apple account.

We retain your trip data for as long as your account is active. You can request deletion of your data at any time by contacting us.`,
  },
  {
    title: 'Cookies',
    content: `Lila Trips does not use tracking cookies. We use local browser storage (localStorage) to remember your recent trips for convenience. This data stays on your device and is not transmitted to third parties.`,
  },
  {
    title: 'Third-Party Services',
    content: `We use the following services to operate Lila Trips:

• **Vercel** — Hosting and analytics
• **Supabase** — Database and authentication
• **Google OAuth / Apple Sign In** — Account authentication
• **Anthropic (Claude)** — AI-powered itinerary generation

Each service has its own privacy policy. We only share the minimum data needed for each service to function.`,
  },
  {
    title: 'Your Rights',
    content: `You have the right to:

• Access the personal data we hold about you
• Request correction of inaccurate data
• Request deletion of your data
• Export your trip data
• Withdraw consent and delete your account

To exercise any of these rights, email us at the address on our contact page.`,
  },
  {
    title: 'Changes to This Policy',
    content: `We may update this policy from time to time. We'll note the date of the last update at the top of this page. Continued use of Lila Trips after changes constitutes acceptance of the updated policy.`,
  },
];

export default function PrivacyPage() {
  return (
    <>
      <Nav />

      {/* Hero */}
      <section className="bg-dark-ink pt-[140px] px-5 pb-[60px] md:pt-[160px] md:px-[52px] md:pb-20 text-center">
        <FadeIn>
          <h1
            className="font-serif font-light text-white leading-[1.1] mb-4"
            style={{ fontSize: 'clamp(2rem, 5vw, 3rem)' }}
          >
            Privacy Policy
          </h1>
          <p className="font-body text-white/60 text-sm tracking-wide">
            Last updated {LAST_UPDATED}
          </p>
        </FadeIn>
      </section>

      {/* Content */}
      <section className="bg-cream px-5 py-16 md:px-[52px] md:py-24">
        <div className="max-w-[680px] mx-auto">
          <FadeIn>
            <p className="font-body text-dark-ink/80 leading-relaxed mb-12" style={{ fontSize: 'clamp(0.9rem, 1.8vw, 1.05rem)' }}>
              Lila Trips is built by people who value simplicity and respect. We
              treat your data the way we'd want ours treated — collect only
              what's needed, keep it safe, and never sell it.
            </p>
          </FadeIn>

          {sections.map((section, i) => (
            <FadeIn key={i}>
              <div className="mb-10">
                <h2
                  className="font-body font-semibold text-dark-ink tracking-wide mb-3"
                  style={{ fontSize: 'clamp(1rem, 2vw, 1.15rem)' }}
                >
                  {section.title}
                </h2>
                <div
                  className="font-body text-dark-ink/75 leading-relaxed whitespace-pre-line"
                  style={{ fontSize: 'clamp(0.85rem, 1.6vw, 0.95rem)' }}
                  dangerouslySetInnerHTML={{
                    __html: section.content
                      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
                  }}
                />
              </div>
            </FadeIn>
          ))}

          <FadeIn>
            <div className="mt-16 pt-8" style={{ borderTop: `1px solid ${C.stone}` }}>
              <p className="font-body text-dark-ink/50 text-sm">
                Questions about this policy? Reach out on our{' '}
                <a href="/contact" className="underline text-dark-ink/60 hover:text-dark-ink transition-colors">
                  contact page
                </a>.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      <Footer />
    </>
  );
}
