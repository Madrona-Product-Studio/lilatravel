import { useParams, Link, Navigate } from 'react-router-dom';
import { Nav, Footer, FadeIn, Breadcrumb } from '@components';
import { C } from '@data/brand';
import { ritualsPillars, traditions } from '@data/rituals';

export default function RitualDetail() {
  const { slug } = useParams();
  const pillar = ritualsPillars.find(p => p.slug === slug);

  if (!pillar) return <Navigate to="/404" replace />;

  return (
    <>
      <Nav />

      <section className="relative min-h-[50vh] overflow-hidden flex items-end bg-dark-ink">
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(ellipse at 30% 70%, ${pillar.color}25 0%, transparent 50%), radial-gradient(ellipse at 70% 30%, ${pillar.color}15 0%, transparent 50%), linear-gradient(165deg, ${C.darkInk}, #1a3040)`,
          }}
        />
        <div className="relative z-[2] p-16 px-7 md:px-[52px] max-w-[900px] w-full">
          <FadeIn from="bottom" delay={0.1}>
            <span className="text-5xl block mb-5 opacity-60" style={{ color: pillar.color }}>{pillar.icon}</span>
            <span className="eyebrow" style={{ color: pillar.color }}>{pillar.word}</span>
            <h1
              className="font-body font-light text-white leading-[1.2] mb-4"
              style={{ fontSize: "clamp(28px, 5vw, 48px)" }}
            >
              {pillar.desc.split(".")[0]}.
            </h1>
          </FadeIn>
        </div>
      </section>

      <section className="page-content py-16 px-7 md:px-[52px] bg-cream">
        <div className="max-w-[760px] mx-auto">
          <Breadcrumb items={[
            { label: "Home", to: "/" },
            { label: "Rituals", to: "/rituals" },
            { label: pillar.word },
          ]} />

          <div className="mt-12">
            <FadeIn>
              <p
                className="font-serif font-light not-italic text-[#4a6070] leading-[1.8] mb-12"
                style={{ fontSize: "clamp(20px, 2.5vw, 26px)" }}
              >
                {pillar.longDesc}
              </p>
            </FadeIn>

            <FadeIn delay={0.1}>
              <span className="eyebrow mb-6 block" style={{ color: pillar.color }}>
                Across Traditions
              </span>
              <div className="flex flex-col gap-5">
                {pillar.traditions.map((t, j) => {
                  const tradMeta = traditions.find(tr => tr.name === t.name);
                  return (
                    <FadeIn key={j} delay={0.1 + j * 0.08}>
                      <div
                        className="py-7 px-8 bg-warm-white relative"
                        style={{ borderLeft: `3px solid ${tradMeta?.color || pillar.color}` }}
                      >
                        <div className="flex items-center gap-2.5 mb-3">
                          <span className="text-xl opacity-60" style={{ color: tradMeta?.color }}>
                            {tradMeta?.symbol}
                          </span>
                          <span
                            className="font-body text-xs font-bold tracking-[0.15em] uppercase"
                            style={{ color: tradMeta?.color || C.darkInk }}
                          >
                            {t.name}
                          </span>
                        </div>

                        <div className="mb-3">
                          <span className="font-body text-lg font-semibold text-dark-ink tracking-[0.02em]">
                            {t.concept}
                          </span>
                          {t.script && (
                            <span className="font-serif text-base font-light text-[#9aabba] ml-3 opacity-70">
                              {t.script}
                            </span>
                          )}
                        </div>

                        <p className="font-body text-sm font-normal text-[#5a6a78] leading-[1.8] mb-2.5">
                          {t.essence}
                        </p>

                        <p className="font-serif text-[15px] font-light not-italic text-[#9aabba] mb-0">
                          &ldquo;{t.metaphor}&rdquo;
                        </p>
                      </div>
                    </FadeIn>
                  );
                })}
              </div>
            </FadeIn>

            <FadeIn delay={0.3}>
              <div
                className="mt-16 py-10 px-9"
                style={{
                  background: `linear-gradient(135deg, ${pillar.color}08, ${pillar.color}04)`,
                  borderTop: `2px solid ${pillar.color}30`,
                }}
              >
                <span className="eyebrow mb-4 block" style={{ color: pillar.color }}>
                  How We Apply This to Travel
                </span>
                <p className="font-body text-[15px] font-normal text-[#4a6070] leading-[2.0] mb-6">
                  {pillar.application}
                </p>

                <div className="flex flex-col gap-3">
                  {pillar.details.map((detail, j) => (
                    <div
                      key={j}
                      className="flex items-center gap-3.5 py-3.5 px-5 bg-warm-white"
                      style={{ borderLeft: `2px solid ${pillar.color}40` }}
                    >
                      <span className="font-body text-sm font-medium text-dark-ink tracking-[0.02em]">
                        {detail}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={0.35}>
              <div className="mt-20">
                <span className="eyebrow text-[#9aabba]">Other Principles</span>
                <div className="flex gap-4 flex-wrap mt-4">
                  {ritualsPillars.filter(p => p.slug !== pillar.slug).map(other => (
                    <Link
                      key={other.slug}
                      to={`/rituals/${other.slug}`}
                      className="flex items-center gap-2.5 py-3 px-5 border border-stone transition-all duration-[250ms] bg-warm-white no-underline hover:border-current"
                      style={{ '--tw-border-opacity': 1 }}
                      onMouseEnter={e => e.currentTarget.style.borderColor = other.color}
                      onMouseLeave={e => e.currentTarget.style.borderColor = C.stone}
                    >
                      <span className="text-base" style={{ color: other.color }}>{other.icon}</span>
                      <span className="font-body text-[13px] font-semibold tracking-[0.1em] uppercase text-dark-ink">
                        {other.word}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
