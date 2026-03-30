import { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { Nav, Footer, PageHeader } from "@components";
import { C } from "@data/brand";
import {
  TRADITIONS,
  PRINCIPLES,
  TYPE_META,
  ENTRIES,
  getPractices,
  getServiceStats,
} from "@services/practicesService";

const V = { ink: '#1E2825', body: '#4A5650', muted: '#7A857E', sage: '#5A7068', amber: '#B8863A', warm: '#D4A95A' };

function PrinciplePill({ id, active, onClick }) {
  const p = PRINCIPLES[id];
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-1.5 py-[7px] px-3.5 rounded-[10px] cursor-pointer transition-all duration-[250ms] font-body text-[13px] font-bold tracking-[0.12em]"
      style={{
        background: active ? `${p.color}15` : "transparent",
        border: `1.5px solid ${active ? p.color : `${V.sage}18`}`,
        color: active ? p.color : V.body,
      }}
    >
      <span className="text-sm leading-none">{p.glyph}</span>
      {p.name}
    </button>
  );
}

function TraditionTab({ id, active, onClick, count }) {
  const t = TRADITIONS[id];
  return (
    <button
      onClick={onClick}
      className="py-2.5 px-4 rounded-[10px] cursor-pointer transition-all duration-[250ms] font-body text-[13px] font-bold flex flex-col items-center gap-[3px] min-w-[72px]"
      style={{
        background: active ? `${t.color}12` : "transparent",
        border: active ? `1.5px solid ${t.color}30` : "1.5px solid transparent",
        color: active ? t.color : V.body,
      }}
    >
      <span className="font-body text-[15px] font-medium">{t.shortName}</span>
      <span className="text-[10px] font-medium opacity-60">{count} entries</span>
    </button>
  );
}

function TypeBadge({ type }) {
  const m = TYPE_META[type];
  return (
    <span
      className="inline-flex items-center gap-1 py-[3px] px-2.5 rounded-[10px] text-[11px] font-bold tracking-[0.12em] uppercase font-body"
      style={{ background: `${m.color}12`, color: m.color }}
    >
      <span className="text-[13px]">{m.icon}</span> {m.label}
    </span>
  );
}

const TRADITION_GLYPHS = {
  hinduism: "\u0950\uFE0E",
  buddhism: "\u273F\uFE0E",
  taoism: "\u262F\uFE0E",
  shinto: "\u26E9\uFE0E",
  stoicism: "\u25B3\uFE0E",
};


function EntryCard({ entry, expanded, onToggle }) {
  const t = TRADITIONS[entry.tradition];
  return (
    <div
      className="rounded-[10px] overflow-hidden transition-all duration-300 mb-2.5"
      style={{
        background: `linear-gradient(180deg, ${C.cream}40, #FFFFFF 60%)`,
        border: `1px solid ${expanded ? `${t.color}25` : `${V.sage}18`}`,
        boxShadow: expanded
          ? `0 4px 20px ${V.amber}08`
          : `0 1px 6px ${V.amber}06`,
      }}
    >
      <button
        onClick={onToggle}
        className="w-full flex items-start gap-3 py-4 px-[18px] bg-none border-none cursor-pointer text-left"
      >
        <div
          className="w-9 h-9 rounded-[10px] flex items-center justify-center shrink-0 font-body text-base font-semibold"
          style={{
            background: `${t.color}10`,
            border: `1px solid ${t.color}18`,
            color: t.color,
          }}
        >
          {TRADITION_GLYPHS[entry.tradition] || t.shortName.charAt(0)}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="font-body text-[17px] font-medium" style={{ color: V.ink }}>
              {entry.name}
            </span>
            <TypeBadge type={entry.type} />
          </div>
          <p className="font-body text-[13px] leading-[1.55] m-0" style={{ color: V.body }}>
            {entry.summary}
          </p>

          <div className="flex gap-1 flex-wrap mt-2">
            {entry.principles.map(p => (
              <span
                key={p}
                className="py-0.5 px-2 rounded-[10px] text-[10px] font-bold tracking-[0.12em] uppercase font-body"
                style={{
                  background: `${PRINCIPLES[p].color}10`,
                  color: PRINCIPLES[p].color,
                }}
              >
                {PRINCIPLES[p].name}
              </span>
            ))}
            {entry.practiceLevel > 0 && (
              <span
                className="py-0.5 px-2 rounded-[10px] text-[10px] font-bold tracking-[0.12em] font-body"
                style={{ background: `${V.sage}08`, color: V.body }}
              >
                Level {entry.practiceLevel}
              </span>
            )}
          </div>
        </div>

        <svg
          width="14" height="14" viewBox="0 0 16 16" fill="none"
          stroke={`${V.sage}60`} strokeWidth="1.5" strokeLinecap="round"
          className="shrink-0 mt-1 transition-transform duration-300"
          style={{ transform: expanded ? "rotate(180deg)" : "rotate(0)" }}
        >
          <polyline points="4.5,6 8,9.5 11.5,6" />
        </svg>
      </button>

      {expanded && (
        <div className="px-[18px] pb-[18px]" style={{ borderTop: `1.5px solid ${V.sage}14` }}>
          <div className="pt-3.5">
            <div
              className="font-body text-[10px] font-bold tracking-[0.14em] uppercase mb-2"
              style={{ color: t.color }}
            >
              Going Deeper
            </div>
            <p className="font-body text-sm leading-[1.7] m-0" style={{ color: V.body }}>
              {entry.deeper}
            </p>
          </div>

          {entry.quote?.text && (
            <div
              className="mt-4 py-3.5 px-[18px] rounded-r-lg"
              style={{
                borderLeft: `2px solid ${t.color}30`,
                background: `${t.color}04`,
              }}
            >
              <div
                className="font-serif text-[17px] font-normal leading-[1.65] tracking-[0.01em]"
                style={{ color: V.ink }}
              >
                &ldquo;{entry.quote.text}&rdquo;
              </div>
              <div
                className="font-body text-[11px] font-semibold mt-2 tracking-[0.04em]"
                style={{ color: `${t.color}cc` }}
              >
                &mdash; {entry.quote.author}{entry.quote.role ? `, ${entry.quote.role}` : ''}
              </div>
            </div>
          )}

          {entry.tripContext && (
            <div
              className="mt-3.5 py-2.5 px-3.5 rounded-[10px]"
              style={{
                background: `${C.goldenAmber}10`,
                border: `1px solid ${C.goldenAmber}18`,
              }}
            >
              <div className="font-body text-[10px] font-bold tracking-[0.12em] uppercase text-golden-amber mb-1">
                Trip Context
              </div>
              <p className="font-body text-[13px] leading-[1.55] m-0" style={{ color: V.body }}>
                {entry.tripContext}
              </p>
            </div>
          )}

          {(entry.timeOfDay || entry.duration) && (
            <div className="flex gap-3 mt-2.5">
              {entry.timeOfDay && (
                <span className="font-body text-xs" style={{ color: V.body }}>
                  &#9200; {entry.timeOfDay}
                </span>
              )}
              {entry.duration && (
                <span className="font-body text-xs" style={{ color: V.body }}>
                  &#9201; {entry.duration}
                </span>
              )}
            </div>
          )}

          {entry.sources && entry.sources.length > 0 && (
            <div
              className="mt-3.5 py-3 px-3.5 rounded-[10px]"
              style={{
                background: `${t.color}05`,
                border: `1.5px solid ${V.sage}14`,
              }}
            >
              <div
                className="font-body text-[10px] font-bold tracking-[0.12em] uppercase mb-2"
                style={{ color: t.color }}
              >
                Sources
              </div>
              {entry.sources.map((src, i) => (
                <div
                  key={i}
                  style={{
                    padding: i > 0 ? "8px 0 0" : "0",
                    borderTop: i > 0 ? `1.5px solid ${V.sage}14` : "none",
                    marginTop: i > 0 ? 8 : 0,
                  }}
                >
                  <div className="flex items-baseline gap-1.5 flex-wrap">
                    <span className="font-body text-[13px] font-medium" style={{ color: V.ink }}>
                      {src.text}
                    </span>
                    {src.section && (
                      <span className="font-body text-[11px] font-semibold" style={{ color: t.color }}>
                        {src.section}
                      </span>
                    )}
                    {src.era && (
                      <span className="font-body text-[11px]" style={{ color: V.muted }}>
                        ({src.era})
                      </span>
                    )}
                  </div>
                  {src.author && (
                    <div className="font-body text-[11px] font-semibold mt-px" style={{ color: V.body }}>
                      {src.author}
                    </div>
                  )}
                  {src.note && (
                    <p className="font-body text-xs leading-[1.5] mt-[3px] mb-0" style={{ color: V.muted }}>
                      {src.note}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}


function MatrixView({ onCellClick }) {
  const traditions = Object.keys(TRADITIONS);
  const principles = Object.keys(PRINCIPLES);

  const matrix = useMemo(() => {
    const m = {};
    for (const t of traditions) {
      m[t] = {};
      for (const p of principles) {
        m[t][p] = ENTRIES.filter(e => e.tradition === t && e.principles.includes(p));
      }
    }
    return m;
  }, []);

  return (
    <div className="overflow-x-auto px-1">
      <table className="w-full min-w-[500px]" style={{ borderCollapse: "separate", borderSpacing: 4 }}>
        <thead>
          <tr>
            <th className="w-[100px]" />
            {principles.map(p => (
              <th
                key={p}
                className="py-2 px-1 text-center font-body text-[11px] font-bold tracking-[0.12em] uppercase"
                style={{ color: PRINCIPLES[p].color }}
              >
                <span className="text-base block mb-0.5">{PRINCIPLES[p].glyph}</span>
                {PRINCIPLES[p].name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {traditions.map(t => (
            <tr key={t}>
              <td className="py-2 px-1.5 font-body text-sm font-medium align-middle" style={{ color: TRADITIONS[t].color }}>
                {TRADITIONS[t].shortName}
              </td>
              {principles.map(p => {
                const entries = matrix[t][p];
                return (
                  <td
                    key={p}
                    onClick={() => entries.length > 0 && onCellClick?.(t, p)}
                    className="p-1.5 align-top rounded-[10px] text-center transition-colors duration-200"
                    style={{
                      background: entries.length > 0 ? `${TRADITIONS[t].color}06` : "transparent",
                      cursor: entries.length > 0 ? "pointer" : "default",
                    }}
                    onMouseEnter={e => {
                      if (entries.length > 0) e.currentTarget.style.background = `${TRADITIONS[t].color}12`;
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = entries.length > 0 ? `${TRADITIONS[t].color}06` : "transparent";
                    }}
                  >
                    {entries.length > 0 ? (
                      <div className="flex flex-col gap-0.5 items-center">
                        <span className="font-body text-lg font-bold" style={{ color: TRADITIONS[t].color }}>
                          {entries.length}
                        </span>
                        <div className="flex gap-0.5 justify-center flex-wrap">
                          {entries.slice(0, 3).map(e => (
                            <span key={e.id} className="text-[11px]">{TYPE_META[e.type].icon}</span>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <span className="text-xs" style={{ color: `${V.sage}60` }}>&mdash;</span>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}


function StatsBar() {
  const stats = useMemo(() => ({
    total: ENTRIES.length,
    teachings: ENTRIES.filter(e => e.type === "teaching").length,
    practices: ENTRIES.filter(e => e.type === "practice").length,
    ceremonies: ENTRIES.filter(e => e.type === "ceremony").length,
  }), []);

  return (
    <div className="flex gap-8 flex-wrap justify-center pt-6 pb-2">
      {[
        { label: "Total Entries", value: stats.total, color: C.darkInk },
        { label: "Teachings", value: stats.teachings, color: TYPE_META.teaching.color },
        { label: "Practices", value: stats.practices, color: TYPE_META.practice.color },
        { label: "Ceremonies", value: stats.ceremonies, color: TYPE_META.ceremony.color },
      ].map(s => (
        <div key={s.label} className="text-center">
          <div className="font-body text-[28px] font-bold leading-none" style={{ color: s.color }}>
            {s.value}
          </div>
          <div className="font-body text-[10px] font-bold tracking-[0.14em] uppercase mt-1" style={{ color: V.muted }}>
            {s.label}
          </div>
        </div>
      ))}
    </div>
  );
}


function TraditionDetail({ traditionId }) {
  const t = TRADITIONS[traditionId];
  const [showSources, setShowSources] = useState(false);
  const [showTerms, setShowTerms] = useState(false);

  if (!t) return null;

  return (
    <div
      className="py-5 px-[22px] rounded-[10px] mb-4"
      style={{
        background: `${t.color}06`,
        border: `1px solid ${t.color}12`,
      }}
    >
      <div className="flex items-baseline gap-3 mb-1.5">
        <h3 className="font-body text-xl font-normal m-0" style={{ color: V.ink }}>
          {t.name}
        </h3>
        <span className="font-body text-[11px] font-medium" style={{ color: V.muted }}>
          {t.origin}
        </span>
      </div>

      <p className="font-body text-sm leading-[1.65] mt-0 mb-3" style={{ color: V.body }}>
        {t.essence}
      </p>

      <div className="flex gap-1.5 flex-wrap mb-3.5">
        {t.coreTexts.map(text => (
          <span
            key={text}
            className="py-[3px] px-2.5 rounded-[10px] font-body text-xs font-medium"
            style={{ background: `${t.color}10`, color: t.color }}
          >
            {text}
          </span>
        ))}
      </div>

      <div className="flex gap-2 flex-wrap">
        {t.primarySources && t.primarySources.length > 0 && (
          <button
            onClick={() => { setShowSources(!showSources); setShowTerms(false); }}
            className="font-body text-[11px] font-bold tracking-[0.12em] uppercase py-1.5 px-3.5 rounded-[10px] cursor-pointer transition-all duration-200"
            style={{
              background: showSources ? `${t.color}15` : "transparent",
              border: `1px solid ${showSources ? t.color : `${t.color}25`}`,
              color: showSources ? t.color : V.muted,
            }}
          >
            &#128218; Sources {showSources ? "\u25BE" : "\u25B8"}
          </button>
        )}
        {t.keyTerms && Object.keys(t.keyTerms).length > 0 && (
          <button
            onClick={() => { setShowTerms(!showTerms); setShowSources(false); }}
            className="font-body text-[11px] font-bold tracking-[0.12em] uppercase py-1.5 px-3.5 rounded-[10px] cursor-pointer transition-all duration-200"
            style={{
              background: showTerms ? `${t.color}15` : "transparent",
              border: `1px solid ${showTerms ? t.color : `${t.color}25`}`,
              color: showTerms ? t.color : V.muted,
            }}
          >
            &#128292; Key Terms {showTerms ? "\u25BE" : "\u25B8"}
          </button>
        )}
      </div>

      {showSources && t.primarySources && (
        <div
          className="mt-3.5 py-4 px-[18px] rounded-[10px] bg-white"
          style={{ border: `1.5px solid ${V.sage}14` }}
        >
          <div
            className="font-body text-[10px] font-bold tracking-[0.14em] uppercase mb-3"
            style={{ color: t.color }}
          >
            Primary Sources
          </div>
          {t.primarySources.map((src, i) => (
            <div
              key={i}
              className="py-2.5"
              style={{ borderTop: i > 0 ? `1.5px solid ${V.sage}14` : "none" }}
            >
              <div className="flex items-baseline gap-2 flex-wrap">
                <span className="font-body text-sm font-medium" style={{ color: V.ink }}>
                  {src.work}
                </span>
                <span className="font-body text-[11px]" style={{ color: V.muted }}>
                  {src.era}
                </span>
              </div>
              <div className="font-body text-xs font-semibold mt-0.5" style={{ color: V.body }}>
                {src.author}
              </div>
              <p className="font-body text-[13px] leading-[1.5] mt-1 mb-0" style={{ color: V.muted }}>
                {src.note}
              </p>
            </div>
          ))}
        </div>
      )}

      {showTerms && t.keyTerms && (
        <div
          className="mt-3.5 py-4 px-[18px] rounded-[10px] bg-white"
          style={{ border: `1.5px solid ${V.sage}14` }}
        >
          <div
            className="font-body text-[10px] font-bold tracking-[0.14em] uppercase mb-3"
            style={{ color: t.color }}
          >
            Key Terms
          </div>
          <div className="grid gap-2">
            {Object.entries(t.keyTerms).map(([term, definition]) => (
              <div
                key={term}
                className="py-2 px-3 rounded-[10px]"
                style={{ background: `${t.color}04` }}
              >
                <span className="font-body text-sm font-semibold capitalize" style={{ color: t.color }}>
                  {term.replace(/([A-Z])/g, ' $1').trim()}
                </span>
                <span className="font-body text-[13px] ml-2 leading-[1.5]" style={{ color: V.body }}>
                  &mdash; {definition}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}


export default function PracticesExplorerPage() {
  const [view, setView] = useState("browse");
  const [activeTradition, setActiveTradition] = useState(null);
  const [activePrinciples, setActivePrinciples] = useState(new Set());
  const [activeType, setActiveType] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const togglePrinciple = (id) => {
    setActivePrinciples(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const PRINCIPLE_ORDER = { oneness: 0, flow: 1, presence: 2, reverence: 3 };

  const filtered = useMemo(() => {
    return ENTRIES
      .filter(e => {
        if (activeTradition && e.tradition !== activeTradition) return false;
        if (activePrinciples.size > 0 && !e.principles.some(p => activePrinciples.has(p))) return false;
        if (activeType && e.type !== activeType) return false;
        return true;
      })
      .sort((a, b) => {
        const aPrimary = PRINCIPLE_ORDER[a.principles[0]] ?? 99;
        const bPrimary = PRINCIPLE_ORDER[b.principles[0]] ?? 99;
        if (aPrimary !== bPrimary) return aPrimary - bPrimary;
        const aTrad = Object.keys(TRADITIONS).indexOf(a.tradition);
        const bTrad = Object.keys(TRADITIONS).indexOf(b.tradition);
        return aTrad - bTrad;
      });
  }, [activeTradition, activePrinciples, activeType]);

  const traditionCounts = useMemo(() => {
    const counts = {};
    for (const t of Object.keys(TRADITIONS)) {
      counts[t] = ENTRIES.filter(e => e.tradition === t).length;
    }
    return counts;
  }, []);

  const handleMatrixCellClick = (tradition, principle) => {
    setActiveTradition(tradition);
    setActivePrinciples(new Set([principle]));
    setActiveType(null);
    setView("browse");
  };

  const clearFilters = () => {
    setActiveTradition(null);
    setActivePrinciples(new Set());
    setActiveType(null);
    setExpandedId(null);
  };

  const hasFilters = activeTradition || activePrinciples.size > 0 || activeType;

  return (
    <>
      <Nav />

      <PageHeader
        eyebrow="Wisdom Layer"
        title="Practices Explorer"
        subtitle="Five traditions, four principles — teachings, practices, and ceremonies for transformative travel."
      />

      <section className="max-w-[680px] mx-auto px-6">
        <StatsBar />
      </section>

      <section className="section-padded max-w-[680px] mx-auto px-6 pt-8 pb-20">

        <div className="flex justify-between items-center mb-5">
          <div className="flex gap-1.5">
            {[
              { key: "browse", label: "Browse", icon: "\uD83D\uDCCB" },
              { key: "matrix", label: "Matrix", icon: "\uD83D\uDD22" },
            ].map(v => (
              <button
                key={v.key}
                onClick={() => setView(v.key)}
                className="py-2 px-4 rounded-[10px] font-body text-xs font-bold tracking-[0.12em] cursor-pointer"
                style={{
                  background: view === v.key ? `${C.oceanTeal}12` : "transparent",
                  border: `1.5px solid ${view === v.key ? `${C.oceanTeal}30` : `${V.sage}18`}`,
                  color: view === v.key ? C.oceanTeal : V.muted,
                }}
              >
                {v.icon} {v.label}
              </button>
            ))}
          </div>

          {hasFilters && (
            <button
              onClick={clearFilters}
              className="font-body text-[11px] font-bold tracking-[0.12em] uppercase text-sun-salmon bg-none border-none cursor-pointer py-1 px-2"
            >
              Clear Filters
            </button>
          )}
        </div>

        {view === "matrix" && (
          <>
            <p className="font-body text-[13px] mb-4 leading-[1.5]" style={{ color: V.muted }}>
              Click any cell to browse its entries.
            </p>
            <MatrixView onCellClick={handleMatrixCellClick} />
          </>
        )}

        {view === "browse" && (
          <>
            <div
              className="flex gap-1 overflow-x-auto pb-2 mb-2"
              style={{ WebkitOverflowScrolling: "touch" }}
            >
              <button
                onClick={() => setActiveTradition(null)}
                className="py-2.5 px-3.5 rounded-[10px] cursor-pointer font-body text-xs font-bold min-w-[48px]"
                style={{
                  background: !activeTradition ? `${C.oceanTeal}12` : "transparent",
                  border: !activeTradition ? `1.5px solid ${C.oceanTeal}30` : "1.5px solid transparent",
                  color: !activeTradition ? C.oceanTeal : V.muted,
                }}
              >
                All
              </button>
              {Object.keys(TRADITIONS).map(id => (
                <TraditionTab key={id} id={id}
                  active={activeTradition === id}
                  onClick={() => setActiveTradition(activeTradition === id ? null : id)}
                  count={traditionCounts[id]}
                />
              ))}
            </div>

            {activeTradition && <TraditionDetail traditionId={activeTradition} />}

            <div className="flex gap-1.5 flex-wrap mb-2">
              {Object.keys(PRINCIPLES).map(id => (
                <PrinciplePill key={id} id={id}
                  active={activePrinciples.has(id)}
                  onClick={() => togglePrinciple(id)}
                />
              ))}
            </div>

            <div className="flex gap-1.5 mb-4">
              {["teaching", "practice", "ceremony"].map(type => (
                <button
                  key={type}
                  onClick={() => setActiveType(activeType === type ? null : type)}
                  className="inline-flex items-center gap-1 py-[5px] px-3 rounded-[10px] cursor-pointer text-xs font-bold font-body"
                  style={{
                    background: activeType === type ? `${TYPE_META[type].color}12` : "transparent",
                    border: `1px solid ${activeType === type ? `${TYPE_META[type].color}25` : `${V.sage}18`}`,
                    color: activeType === type ? TYPE_META[type].color : V.muted,
                  }}
                >
                  {TYPE_META[type].icon} {TYPE_META[type].label}s
                </button>
              ))}
            </div>

            <div className="font-body text-xs mb-3" style={{ color: V.muted }}>
              {filtered.length} {filtered.length === 1 ? "entry" : "entries"}
            </div>

            {filtered.map((entry, i) => {
              const primaryPrinciple = entry.principles[0];
              const prevPrinciple = i > 0 ? filtered[i - 1].principles[0] : null;
              const showDivider = primaryPrinciple !== prevPrinciple;
              const p = PRINCIPLES[primaryPrinciple];

              return (
                <div key={entry.id}>
                  {showDivider && p && (
                    <div
                      className="flex items-center gap-2.5"
                      style={{ padding: i > 0 ? "24px 0 12px" : "0 0 12px" }}
                    >
                      <span className="text-base opacity-50" style={{ color: p.color }}>
                        {p.glyph}
                      </span>
                      <span className="font-body text-base font-normal" style={{ color: p.color }}>
                        {p.name}
                      </span>
                      <div className="flex-1 h-px" style={{ background: `${p.color}20` }} />
                    </div>
                  )}
                  <EntryCard entry={entry}
                    expanded={expandedId === entry.id}
                    onToggle={() => setExpandedId(expandedId === entry.id ? null : entry.id)}
                  />
                </div>
              );
            })}

            {filtered.length === 0 && (
              <div className="text-center py-10 px-5" style={{ color: V.muted }}>
                <div className="text-2xl mb-2">&#128269;</div>
                <p className="font-body text-sm">No entries match these filters.</p>
                <button
                  onClick={clearFilters}
                  className="mt-3 font-body text-xs font-bold text-ocean-teal bg-none py-2 px-4 rounded-[10px] cursor-pointer"
                  style={{ border: `1px solid ${C.oceanTeal}30` }}
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </>
        )}
      </section>

      <section
        className="text-center pt-12 pb-16 px-6"
        style={{ borderTop: `1.5px solid ${V.sage}18` }}
      >
        <Link to="/ethos" className="underline-link">
          &larr; Back to Our Ethos
        </Link>
      </section>

      <Footer />
    </>
  );
}
