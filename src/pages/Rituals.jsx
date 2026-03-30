import { Link } from 'react-router-dom';
import { Nav, Footer, FadeIn } from '@components';
import { C } from '@data/brand';
import { ritualsPillars, traditions, ritualsIntro } from '@data/rituals';

export default function RitualsPage() {
  return (
    <>
      <Nav />

      <section className="relative min-h-[55vh] overflow-hidden flex items-end bg-dark-ink">
        <img
          src="/images/rituals-hero.jpg"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          style={{ objectPosition: "center 70%" }}
        />
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(to bottom, rgba(15,30,42,0.3) 0%, rgba(15,30,42,0.65) 70%, rgba(15,30,42,0.85) 100%)" }}
        />
        <div className="relative z-[2] p-16 px-7 md:px-[52px] max-w-[900px] w-full">
          <FadeIn from="bottom" delay={0.1}>
            <span className="eyebrow" style={{ color: "#6BA4B8" }}>Rituals</span>
            <h1
              className="font-body font-light text-white leading-[1.2] mb-3"
              style={{ fontSize: "clamp(32px, 5vw, 52px)" }}
            >
              {ritualsIntro.headline}
            </h1>
            <p
              className="font-serif font-light not-italic leading-[1.6] max-w-[560px]"
              style={{
                fontSize: "clamp(16px, 2vw, 20px)",
                color: "rgba(255,255,255,0.7)",
              }}
            >
              {ritualsIntro.subtitle}
            </p>
          </FadeIn>
        </div>
      </section>

      <section className="py-20 px-7 md:px-[52px] bg-cream">
        <div className="max-w-[760px] mx-auto">
          <FadeIn>
            <p
              className="font-serif font-light not-italic text-[#4a6070] leading-[1.9] mb-0"
              style={{ fontSize: "clamp(20px, 2.5vw, 26px)" }}
            >
              {ritualsIntro.body}
            </p>
          </FadeIn>

          <FadeIn delay={0.15}>
            <div className="grid grid-cols-6 gap-y-7 gap-x-0 mt-12 pt-12 border-t border-stone">
              {traditions.map((t, i) => (
                <div
                  key={t.name}
                  className="flex items-center gap-3"
                  style={{
                    gridColumn: i < 3
                      ? `${i * 2 + 1} / span 2`
                      : i === 3 ? "2 / span 2" : "4 / span 2",
                  }}
                >
                  <span className="text-[28px] opacity-70 leading-none font-serif" style={{ color: t.color }}>
                    {t.symbol}
                  </span>
                  <div>
                    <span className="font-body text-[13px] font-bold tracking-[0.12em] uppercase text-dark-ink block">
                      {t.name}
                    </span>
                    <span className="font-body text-xs font-normal text-[#9aabba]">
                      {t.origin} &middot; {t.age}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      <section className="page-content pt-10 pb-20 px-7 md:px-[52px] bg-cream">
        <div className="max-w-[900px] mx-auto">
          {ritualsPillars.map((pillar, i) => (
            <FadeIn key={pillar.slug} delay={i * 0.1}>
              <Link to={`/rituals/${pillar.slug}`} className="block no-underline">
                <div
                  className="grid grid-cols-[120px_1fr] gap-10 py-12 cursor-pointer transition-[padding-left] duration-300 hover:pl-3"
                  style={{
                    borderBottom: i < ritualsPillars.length - 1 ? `1px solid ${C.stone}` : "none",
                  }}
                >
                  <div className="flex flex-col items-center gap-3">
                    <span className="text-4xl opacity-70" style={{ color: pillar.color }}>{pillar.icon}</span>
                    <span className="font-body text-[13px] font-bold tracking-[0.2em] uppercase" style={{ color: pillar.color }}>
                      {pillar.word}
                    </span>
                  </div>

                  <div>
                    <p className="font-body text-base font-normal text-[#5a6a78] leading-[2.0] mb-5">
                      {pillar.desc}
                    </p>

                    <div className="flex gap-3 flex-wrap mb-4">
                      {pillar.traditions.map((t, j) => (
                        <span
                          key={j}
                          className="font-body text-xs font-medium tracking-[0.04em] text-[#7a8a9a] py-1.5 px-3.5 border border-stone flex items-center gap-1.5"
                        >
                          <span className="text-sm opacity-50">
                            {traditions.find(tr => tr.name === t.name)?.symbol}
                          </span>
                          {t.concept}
                        </span>
                      ))}
                    </div>

                    <p className="font-serif text-[17px] font-light not-italic text-[#7a8a9a] leading-[1.6] mb-5">
                      &ldquo;{pillar.quote}&rdquo;
                      <br />
                      <span
                        className="font-body text-[11px] font-semibold not-italic tracking-[0.08em] opacity-70"
                        style={{ color: pillar.color }}
                      >
                        &mdash; {pillar.quoteAuthor}
                      </span>
                    </p>

                    <div>
                      <span className="font-body text-xs font-bold tracking-[0.18em] uppercase" style={{ color: pillar.color }}>
                        Explore This Principle &rarr;
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </FadeIn>
          ))}
        </div>
      </section>

      <section
        className="py-20 px-7 md:px-[52px]"
        style={{ background: `linear-gradient(165deg, ${C.darkInk}, #1a3040)` }}
      >
        <div className="max-w-[700px] mx-auto text-center">
          <FadeIn>
            <span className="eyebrow mb-6 block" style={{ color: "#6BA4B8" }}>
              The Convergence
            </span>
            <p
              className="font-serif font-light not-italic leading-[1.9] mb-10"
              style={{
                fontSize: "clamp(18px, 2.5vw, 24px)",
                color: "rgba(255,255,255,0.75)",
              }}
            >
              {ritualsIntro.convergence}
            </p>
            <p className="font-body text-[15px] font-normal leading-[1.9]" style={{ color: "rgba(255,255,255,0.55)" }}>
              {ritualsIntro.closing}
            </p>
          </FadeIn>
        </div>
      </section>

      <Footer />
    </>
  );
}
