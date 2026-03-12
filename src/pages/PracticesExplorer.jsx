// ═══════════════════════════════════════════════════════════════════════════════
// PRACTICES EXPLORER — /philosophy/practices
// ═══════════════════════════════════════════════════════════════════════════════
//
// Full interactive explorer for the Lila Trips Wisdom Layer.
// Browse teachings, practices, and ceremonies across five traditions
// mapped to four foundational principles.
//
// Route: /ethos/practices
// Parent: Ethos (/ethos)
//
// Imports:
//   - Nav, Footer, PageHero from @components
//   - C, FONTS from @data/brand
//   - Full data + helpers from @services/practicesService
//

import { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { Nav, Footer, PageHeader } from "@components";
import { C, FONTS } from "@data/brand";
import {
  TRADITIONS,
  PRINCIPLES,
  TYPE_META,
  ENTRIES,
  getPractices,
  getServiceStats,
} from "@services/practicesService";

const V = { ink: '#1E2825', body: '#4A5650', muted: '#7A857E', sage: '#5A7068', amber: '#B8863A', warm: '#D4A95A' };

// ═══════════════════════════════════════════════════════════════════════════════
// SUB-COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════════

function PrinciplePill({ id, active, onClick }) {
  const p = PRINCIPLES[id];
  return (
    <button onClick={onClick} style={{
      display: "inline-flex", alignItems: "center", gap: 6,
      padding: "7px 14px", borderRadius: 10,
      background: active ? `${p.color}15` : "transparent",
      border: `1.5px solid ${active ? p.color : `${V.sage}18`}`,
      cursor: "pointer", transition: "all 0.25s",
      fontFamily: FONTS.body, fontSize: 13, fontWeight: 700,
      color: active ? p.color : V.body,
      letterSpacing: "0.12em",
    }}>
      <span style={{ fontSize: 14, lineHeight: 1 }}>{p.glyph}</span>
      {p.name}
    </button>
  );
}

function TraditionTab({ id, active, onClick, count }) {
  const t = TRADITIONS[id];
  return (
    <button onClick={onClick} style={{
      padding: "10px 16px", borderRadius: 10,
      background: active ? `${t.color}12` : "transparent",
      border: active ? `1.5px solid ${t.color}30` : "1.5px solid transparent",
      cursor: "pointer", transition: "all 0.25s",
      fontFamily: FONTS.body, fontSize: 13, fontWeight: 700,
      color: active ? t.color : V.body,
      display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
      minWidth: 72,
    }}>
      <span style={{ fontFamily: FONTS.body, fontSize: 15, fontWeight: 500 }}>
        {t.shortName}
      </span>
      <span style={{ fontSize: 10, fontWeight: 500, opacity: 0.6 }}>
        {count} entries
      </span>
    </button>
  );
}

function TypeBadge({ type }) {
  const m = TYPE_META[type];
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 4,
      padding: "3px 10px", borderRadius: 10,
      background: `${m.color}12`, fontSize: 11, fontWeight: 700,
      color: m.color, letterSpacing: "0.12em", textTransform: "uppercase",
      fontFamily: FONTS.body,
    }}>
      <span style={{ fontSize: 13 }}>{m.icon}</span> {m.label}
    </span>
  );
}

// ─── Tradition glyphs (matches Philosophy page) ────────────────────────────
const TRADITION_GLYPHS = {
  hinduism: "ॐ\uFE0E",
  buddhism: "✿\uFE0E",
  taoism: "☯\uFE0E",
  shinto: "⛩\uFE0E",
  stoicism: "△\uFE0E",
};


function EntryCard({ entry, expanded, onToggle }) {
  const t = TRADITIONS[entry.tradition];
  return (
    <div style={{
      background: `linear-gradient(180deg, ${C.cream}40, #FFFFFF 60%)`, borderRadius: 10,
      border: `1px solid ${expanded ? `${t.color}25` : `${V.sage}18`}`,
      boxShadow: expanded
        ? `0 4px 20px ${V.amber}08`
        : `0 1px 6px ${V.amber}06`,
      overflow: "hidden", transition: "all 0.3s", marginBottom: 10,
    }}>
      {/* Card Header — clickable */}
      <button onClick={onToggle} style={{
        width: "100%", display: "flex", alignItems: "flex-start", gap: 12,
        padding: "16px 18px", background: "none", border: "none",
        cursor: "pointer", textAlign: "left",
      }}>
        {/* Tradition icon */}
        <div style={{
          width: 36, height: 36, borderRadius: 10,
          background: `${t.color}10`, border: `1px solid ${t.color}18`,
          display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0, fontFamily: FONTS.body,
          fontSize: 16, fontWeight: 600, color: t.color,
        }}>
          {TRADITION_GLYPHS[entry.tradition] || t.shortName.charAt(0)}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 4 }}>
            <span style={{ fontFamily: FONTS.body, fontSize: 17, fontWeight: 500, color: V.ink }}>
              {entry.name}
            </span>
            <TypeBadge type={entry.type} />
          </div>
          <p style={{
            fontFamily: FONTS.body, fontSize: 13,
            color: V.body,
            lineHeight: 1.55, margin: 0,
          }}>
            {entry.summary}
          </p>

          {/* Principle + level tags */}
          <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginTop: 8 }}>
            {entry.principles.map(p => (
              <span key={p} style={{
                padding: "2px 8px", borderRadius: 10,
                background: `${PRINCIPLES[p].color}10`,
                fontSize: 10, fontWeight: 700, color: PRINCIPLES[p].color,
                letterSpacing: "0.12em", textTransform: "uppercase",
                fontFamily: FONTS.body,
              }}>
                {PRINCIPLES[p].name}
              </span>
            ))}
            {entry.practiceLevel > 0 && (
              <span style={{
                padding: "2px 8px", borderRadius: 10,
                background: `${V.sage}08`, fontSize: 10, fontWeight: 700,
                color: V.body, fontFamily: FONTS.body,
                letterSpacing: "0.12em",
              }}>
                Level {entry.practiceLevel}
              </span>
            )}
          </div>
        </div>

        {/* Chevron */}
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none"
          stroke={`${V.sage}60`} strokeWidth="1.5" strokeLinecap="round"
          style={{
            transform: expanded ? "rotate(180deg)" : "rotate(0)",
            transition: "transform 0.3s", flexShrink: 0, marginTop: 4,
          }}>
          <polyline points="4.5,6 8,9.5 11.5,6" />
        </svg>
      </button>

      {/* Expanded detail */}
      {expanded && (
        <div style={{ padding: "0 18px 18px", borderTop: `1.5px solid ${V.sage}14` }}>
          {/* Going Deeper */}
          <div style={{ padding: "14px 0 0" }}>
            <div style={{
              fontFamily: FONTS.body, fontSize: 10, fontWeight: 700,
              letterSpacing: "0.14em", textTransform: "uppercase",
              color: t.color, marginBottom: 8,
            }}>
              Going Deeper
            </div>
            <p style={{
              fontFamily: FONTS.body, fontSize: 14,
              color: V.body,
              lineHeight: 1.7, margin: 0,
            }}>
              {entry.deeper}
            </p>
          </div>

          {/* Trip Context */}
          {entry.tripContext && (
            <div style={{
              marginTop: 14, padding: "10px 14px", borderRadius: 10,
              background: `${C.goldenAmber}10`,
              border: `1px solid ${C.goldenAmber}18`,
            }}>
              <div style={{
                fontFamily: FONTS.body, fontSize: 10, fontWeight: 700,
                letterSpacing: "0.12em", textTransform: "uppercase",
                color: C.goldenAmber, marginBottom: 4,
              }}>
                Trip Context
              </div>
              <p style={{
                fontFamily: FONTS.body, fontSize: 13,
                color: V.body,
                lineHeight: 1.55, margin: 0,
              }}>
                {entry.tripContext}
              </p>
            </div>
          )}

          {/* Time / Duration */}
          {(entry.timeOfDay || entry.duration) && (
            <div style={{ display: "flex", gap: 12, marginTop: 10 }}>
              {entry.timeOfDay && (
                <span style={{ fontFamily: FONTS.body, fontSize: 12, color: V.body }}>
                  ⏰ {entry.timeOfDay}
                </span>
              )}
              {entry.duration && (
                <span style={{ fontFamily: FONTS.body, fontSize: 12, color: V.body }}>
                  ⏱ {entry.duration}
                </span>
              )}
            </div>
          )}

          {/* Sources */}
          {entry.sources && entry.sources.length > 0 && (
            <div style={{
              marginTop: 14, padding: "12px 14px", borderRadius: 10,
              background: `${t.color}05`,
              border: `1.5px solid ${V.sage}14`,
            }}>
              <div style={{
                fontFamily: FONTS.body, fontSize: 10, fontWeight: 700,
                letterSpacing: "0.12em", textTransform: "uppercase",
                color: t.color, marginBottom: 8,
              }}>
                Sources
              </div>
              {entry.sources.map((src, i) => (
                <div key={i} style={{
                  padding: i > 0 ? "8px 0 0" : "0",
                  borderTop: i > 0 ? `1.5px solid ${V.sage}14` : "none",
                  marginTop: i > 0 ? 8 : 0,
                }}>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 6, flexWrap: "wrap" }}>
                    <span style={{
                      fontFamily: FONTS.body, fontSize: 13, fontWeight: 500,
                      color: V.ink,
                    }}>
                      {src.text}
                    </span>
                    {src.section && (
                      <span style={{
                        fontFamily: FONTS.body, fontSize: 11, color: t.color,
                        fontWeight: 600,
                      }}>
                        {src.section}
                      </span>
                    )}
                    {src.era && (
                      <span style={{
                        fontFamily: FONTS.body, fontSize: 11, color: V.muted,
                      }}>
                        ({src.era})
                      </span>
                    )}
                  </div>
                  {src.author && (
                    <div style={{
                      fontFamily: FONTS.body, fontSize: 11, fontWeight: 600,
                      color: V.body, marginTop: 1,
                    }}>
                      {src.author}
                    </div>
                  )}
                  {src.note && (
                    <p style={{
                      fontFamily: FONTS.body, fontSize: 12, color: V.muted,
                      lineHeight: 1.5, margin: "3px 0 0",
                    }}>
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


// ═══════════════════════════════════════════════════════════════════════════════
// MATRIX VIEW
// ═══════════════════════════════════════════════════════════════════════════════

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
    <div style={{ overflowX: "auto", padding: "0 4px" }}>
      <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 4, minWidth: 500 }}>
        <thead>
          <tr>
            <th style={{ width: 100 }} />
            {principles.map(p => (
              <th key={p} style={{
                padding: "8px 4px", textAlign: "center",
                fontFamily: FONTS.body, fontSize: 11, fontWeight: 700,
                letterSpacing: "0.12em", textTransform: "uppercase",
                color: PRINCIPLES[p].color,
              }}>
                <span style={{ fontSize: 16, display: "block", marginBottom: 2 }}>
                  {PRINCIPLES[p].glyph}
                </span>
                {PRINCIPLES[p].name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {traditions.map(t => (
            <tr key={t}>
              <td style={{
                padding: "8px 6px", fontFamily: FONTS.body,
                fontSize: 14, fontWeight: 500, color: TRADITIONS[t].color,
                verticalAlign: "middle",
              }}>
                {TRADITIONS[t].shortName}
              </td>
              {principles.map(p => {
                const entries = matrix[t][p];
                return (
                  <td key={p}
                    onClick={() => entries.length > 0 && onCellClick?.(t, p)}
                    style={{
                      padding: 6, verticalAlign: "top",
                      background: entries.length > 0 ? `${TRADITIONS[t].color}06` : "transparent",
                      borderRadius: 10, textAlign: "center",
                      cursor: entries.length > 0 ? "pointer" : "default",
                      transition: "background 0.2s",
                    }}
                    onMouseEnter={e => {
                      if (entries.length > 0) e.currentTarget.style.background = `${TRADITIONS[t].color}12`;
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = entries.length > 0 ? `${TRADITIONS[t].color}06` : "transparent";
                    }}
                  >
                    {entries.length > 0 ? (
                      <div style={{ display: "flex", flexDirection: "column", gap: 2, alignItems: "center" }}>
                        <span style={{
                          fontFamily: FONTS.body, fontSize: 18, fontWeight: 700,
                          color: TRADITIONS[t].color,
                        }}>
                          {entries.length}
                        </span>
                        <div style={{ display: "flex", gap: 2, justifyContent: "center", flexWrap: "wrap" }}>
                          {entries.slice(0, 3).map(e => (
                            <span key={e.id} style={{ fontSize: 11 }}>{TYPE_META[e.type].icon}</span>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <span style={{ fontSize: 12, color: `${V.sage}60` }}>—</span>
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


// ═══════════════════════════════════════════════════════════════════════════════
// STATS BAR
// ═══════════════════════════════════════════════════════════════════════════════

function StatsBar() {
  const stats = useMemo(() => ({
    total: ENTRIES.length,
    teachings: ENTRIES.filter(e => e.type === "teaching").length,
    practices: ENTRIES.filter(e => e.type === "practice").length,
    ceremonies: ENTRIES.filter(e => e.type === "ceremony").length,
  }), []);

  return (
    <div style={{
      display: "flex", gap: 32, flexWrap: "wrap",
      justifyContent: "center", padding: "24px 0 8px",
    }}>
      {[
        { label: "Total Entries", value: stats.total, color: C.darkInk },
        { label: "Teachings", value: stats.teachings, color: TYPE_META.teaching.color },
        { label: "Practices", value: stats.practices, color: TYPE_META.practice.color },
        { label: "Ceremonies", value: stats.ceremonies, color: TYPE_META.ceremony.color },
      ].map(s => (
        <div key={s.label} style={{ textAlign: "center" }}>
          <div style={{
            fontFamily: FONTS.body, fontSize: 28, fontWeight: 700,
            color: s.color, lineHeight: 1,
          }}>
            {s.value}
          </div>
          <div style={{
            fontFamily: FONTS.body, fontSize: 10, fontWeight: 700,
            letterSpacing: "0.14em", textTransform: "uppercase",
            color: V.muted, marginTop: 4,
          }}>
            {s.label}
          </div>
        </div>
      ))}
    </div>
  );
}


// ═══════════════════════════════════════════════════════════════════════════════
// TRADITION DETAIL PANEL — shown above browse when a tradition is selected
// ═══════════════════════════════════════════════════════════════════════════════

function TraditionDetail({ traditionId }) {
  const t = TRADITIONS[traditionId];
  const [showSources, setShowSources] = useState(false);
  const [showTerms, setShowTerms] = useState(false);

  if (!t) return null;

  return (
    <div style={{
      padding: "20px 22px", borderRadius: 10, marginBottom: 16,
      background: `${t.color}06`,
      border: `1px solid ${t.color}12`,
    }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 6 }}>
        <h3 style={{
          fontFamily: FONTS.body, fontSize: 20, fontWeight: 400,
          color: V.ink, margin: 0,
        }}>
          {t.name}
        </h3>
        <span style={{
          fontFamily: FONTS.body, fontSize: 11, color: V.muted,
          fontWeight: 500,
        }}>
          {t.origin}
        </span>
      </div>

      {/* Essence */}
      <p style={{
        fontFamily: FONTS.body, fontSize: 14, color: V.body,
        lineHeight: 1.65, margin: "0 0 12px",
      }}>
        {t.essence}
      </p>

      {/* Core texts */}
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>
        {t.coreTexts.map(text => (
          <span key={text} style={{
            padding: "3px 10px", borderRadius: 10,
            background: `${t.color}10`, fontFamily: FONTS.body,
            fontSize: 12, fontWeight: 500, color: t.color,
          }}>
            {text}
          </span>
        ))}
      </div>

      {/* Toggle buttons */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {t.primarySources && t.primarySources.length > 0 && (
          <button onClick={() => { setShowSources(!showSources); setShowTerms(false); }} style={{
            fontFamily: FONTS.body, fontSize: 11, fontWeight: 700,
            letterSpacing: "0.12em", textTransform: "uppercase",
            padding: "6px 14px", borderRadius: 10, cursor: "pointer",
            background: showSources ? `${t.color}15` : "transparent",
            border: `1px solid ${showSources ? t.color : `${t.color}25`}`,
            color: showSources ? t.color : V.muted,
            transition: "all 0.2s",
          }}>
            📚 Sources {showSources ? "▾" : "▸"}
          </button>
        )}
        {t.keyTerms && Object.keys(t.keyTerms).length > 0 && (
          <button onClick={() => { setShowTerms(!showTerms); setShowSources(false); }} style={{
            fontFamily: FONTS.body, fontSize: 11, fontWeight: 700,
            letterSpacing: "0.12em", textTransform: "uppercase",
            padding: "6px 14px", borderRadius: 10, cursor: "pointer",
            background: showTerms ? `${t.color}15` : "transparent",
            border: `1px solid ${showTerms ? t.color : `${t.color}25`}`,
            color: showTerms ? t.color : V.muted,
            transition: "all 0.2s",
          }}>
            🔤 Key Terms {showTerms ? "▾" : "▸"}
          </button>
        )}
      </div>

      {/* Primary Sources Panel */}
      {showSources && t.primarySources && (
        <div style={{
          marginTop: 14, padding: "16px 18px", borderRadius: 10,
          background: "white", border: `1.5px solid ${V.sage}14`,
        }}>
          <div style={{
            fontFamily: FONTS.body, fontSize: 10, fontWeight: 700,
            letterSpacing: "0.14em", textTransform: "uppercase",
            color: t.color, marginBottom: 12,
          }}>
            Primary Sources
          </div>
          {t.primarySources.map((src, i) => (
            <div key={i} style={{
              padding: "10px 0",
              borderTop: i > 0 ? `1.5px solid ${V.sage}14` : "none",
            }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 8, flexWrap: "wrap" }}>
                <span style={{
                  fontFamily: FONTS.body, fontSize: 14, fontWeight: 500,
                  color: V.ink,
                }}>
                  {src.work}
                </span>
                <span style={{
                  fontFamily: FONTS.body, fontSize: 11, color: V.muted,
                }}>
                  {src.era}
                </span>
              </div>
              <div style={{
                fontFamily: FONTS.body, fontSize: 12, fontWeight: 600,
                color: V.body, marginTop: 2,
              }}>
                {src.author}
              </div>
              <p style={{
                fontFamily: FONTS.body, fontSize: 13, color: V.muted,
                lineHeight: 1.5, margin: "4px 0 0",
              }}>
                {src.note}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Key Terms Panel */}
      {showTerms && t.keyTerms && (
        <div style={{
          marginTop: 14, padding: "16px 18px", borderRadius: 10,
          background: "white", border: `1.5px solid ${V.sage}14`,
        }}>
          <div style={{
            fontFamily: FONTS.body, fontSize: 10, fontWeight: 700,
            letterSpacing: "0.14em", textTransform: "uppercase",
            color: t.color, marginBottom: 12,
          }}>
            Key Terms
          </div>
          <div style={{ display: "grid", gap: 8 }}>
            {Object.entries(t.keyTerms).map(([term, definition]) => (
              <div key={term} style={{
                padding: "8px 12px", borderRadius: 10,
                background: `${t.color}04`,
              }}>
                <span style={{
                  fontFamily: FONTS.body, fontSize: 14, fontWeight: 600,
                  color: t.color,
                  textTransform: "capitalize",
                }}>
                  {term.replace(/([A-Z])/g, ' $1').trim()}
                </span>
                <span style={{
                  fontFamily: FONTS.body, fontSize: 13, color: V.body,
                  marginLeft: 8, lineHeight: 1.5,
                }}>
                  — {definition}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}


// ═══════════════════════════════════════════════════════════════════════════════
// MAIN PAGE COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export default function PracticesExplorerPage() {
  const [view, setView] = useState("browse");
  const [activeTradition, setActiveTradition] = useState(null);
  const [activePrinciples, setActivePrinciples] = useState(new Set());
  const [activeType, setActiveType] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  // Scroll to top on mount
  useEffect(() => { window.scrollTo(0, 0); }, []);

  const togglePrinciple = (id) => {
    setActivePrinciples(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  // Principle ordering: oneness → flow → presence → reverence
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
        // Sort by primary principle first, then interleave traditions within each principle
        const aPrimary = PRINCIPLE_ORDER[a.principles[0]] ?? 99;
        const bPrimary = PRINCIPLE_ORDER[b.principles[0]] ?? 99;
        if (aPrimary !== bPrimary) return aPrimary - bPrimary;
        // Within the same principle, alternate traditions for variety
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

  // Matrix cell click → switch to browse with filters applied
  const handleMatrixCellClick = (tradition, principle) => {
    setActiveTradition(tradition);
    setActivePrinciples(new Set([principle]));
    setActiveType(null);
    setView("browse");
  };

  // Clear all filters
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

      {/* ── Page Header ── */}
      <PageHeader
        eyebrow="Wisdom Layer"
        title="Practices Explorer"
        subtitle="Five traditions, four principles — teachings, practices, and ceremonies for transformative travel."
      />

      {/* ── Stats ── */}
      <section style={{
        maxWidth: 680, margin: "0 auto",
        padding: "0 24px",
      }}>
        <StatsBar />
      </section>

      {/* ── Explorer Body ── */}
      <section className="section-padded" style={{
        maxWidth: 680, margin: "0 auto",
        padding: "32px 24px 80px",
      }}>

        {/* View Toggle + Clear */}
        <div style={{
          display: "flex", justifyContent: "space-between",
          alignItems: "center", marginBottom: 20,
        }}>
          <div style={{ display: "flex", gap: 6 }}>
            {[
              { key: "browse", label: "Browse", icon: "📋" },
              { key: "matrix", label: "Matrix", icon: "🔢" },
            ].map(v => (
              <button key={v.key} onClick={() => setView(v.key)} style={{
                padding: "8px 16px", borderRadius: 10,
                background: view === v.key ? `${C.oceanTeal}12` : "transparent",
                border: `1.5px solid ${view === v.key ? `${C.oceanTeal}30` : `${V.sage}18`}`,
                fontFamily: FONTS.body, fontSize: 12, fontWeight: 700,
                color: view === v.key ? C.oceanTeal : V.muted,
                letterSpacing: "0.12em",
                cursor: "pointer",
              }}>
                {v.icon} {v.label}
              </button>
            ))}
          </div>

          {hasFilters && (
            <button onClick={clearFilters} style={{
              fontFamily: FONTS.body, fontSize: 11, fontWeight: 700,
              letterSpacing: "0.12em", textTransform: "uppercase",
              color: C.sunSalmon, background: "none", border: "none",
              cursor: "pointer", padding: "4px 8px",
            }}>
              Clear Filters
            </button>
          )}
        </div>

        {/* ── Matrix View ── */}
        {view === "matrix" && (
          <>
            <p style={{
              fontFamily: FONTS.body, fontSize: 13, color: V.muted,
              marginBottom: 16, lineHeight: 1.5,
            }}>
              Click any cell to browse its entries.
            </p>
            <MatrixView onCellClick={handleMatrixCellClick} />
          </>
        )}

        {/* ── Browse View ── */}
        {view === "browse" && (
          <>
            {/* Tradition Filter */}
            <div style={{
              display: "flex", gap: 4, overflowX: "auto",
              paddingBottom: 8, marginBottom: 8,
              WebkitOverflowScrolling: "touch",
            }}>
              <button onClick={() => setActiveTradition(null)} style={{
                padding: "10px 14px", borderRadius: 10,
                background: !activeTradition ? `${C.oceanTeal}12` : "transparent",
                border: !activeTradition ? `1.5px solid ${C.oceanTeal}30` : "1.5px solid transparent",
                cursor: "pointer", fontFamily: FONTS.body, fontSize: 12, fontWeight: 700,
                color: !activeTradition ? C.oceanTeal : V.muted, minWidth: 48,
              }}>
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

            {/* Tradition Detail (when selected) */}
            {activeTradition && <TraditionDetail traditionId={activeTradition} />}

            {/* Principle Filter */}
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 8 }}>
              {Object.keys(PRINCIPLES).map(id => (
                <PrinciplePill key={id} id={id}
                  active={activePrinciples.has(id)}
                  onClick={() => togglePrinciple(id)}
                />
              ))}
            </div>

            {/* Type Filter */}
            <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
              {["teaching", "practice", "ceremony"].map(type => (
                <button key={type}
                  onClick={() => setActiveType(activeType === type ? null : type)}
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 4,
                    padding: "5px 12px", borderRadius: 10,
                    background: activeType === type ? `${TYPE_META[type].color}12` : "transparent",
                    border: `1px solid ${activeType === type ? `${TYPE_META[type].color}25` : `${V.sage}18`}`,
                    cursor: "pointer", fontSize: 12, fontWeight: 700,
                    color: activeType === type ? TYPE_META[type].color : V.muted,
                    fontFamily: FONTS.body,
                  }}
                >
                  {TYPE_META[type].icon} {TYPE_META[type].label}s
                </button>
              ))}
            </div>

            {/* Results count */}
            <div style={{
              fontFamily: FONTS.body, fontSize: 12,
              color: V.muted, marginBottom: 12,
            }}>
              {filtered.length} {filtered.length === 1 ? "entry" : "entries"}
            </div>

            {/* Entry Cards — grouped by principle */}
            {filtered.map((entry, i) => {
              const primaryPrinciple = entry.principles[0];
              const prevPrinciple = i > 0 ? filtered[i - 1].principles[0] : null;
              const showDivider = primaryPrinciple !== prevPrinciple;
              const p = PRINCIPLES[primaryPrinciple];

              return (
                <div key={entry.id}>
                  {showDivider && p && (
                    <div style={{
                      display: "flex", alignItems: "center", gap: 10,
                      padding: i > 0 ? "24px 0 12px" : "0 0 12px",
                    }}>
                      <span style={{ fontSize: 16, color: p.color, opacity: 0.5 }}>
                        {p.glyph}
                      </span>
                      <span style={{
                        fontFamily: FONTS.body, fontSize: 16, fontWeight: 400,
                        color: p.color,
                      }}>
                        {p.name}
                      </span>
                      <div style={{
                        flex: 1, height: 1,
                        background: `${p.color}20`,
                      }} />
                    </div>
                  )}
                  <EntryCard entry={entry}
                    expanded={expandedId === entry.id}
                    onToggle={() => setExpandedId(expandedId === entry.id ? null : entry.id)}
                  />
                </div>
              );
            })}

            {/* Empty state */}
            {filtered.length === 0 && (
              <div style={{ textAlign: "center", padding: "40px 20px", color: V.muted }}>
                <div style={{ fontSize: 24, marginBottom: 8 }}>🔍</div>
                <p style={{ fontFamily: FONTS.body, fontSize: 14 }}>
                  No entries match these filters.
                </p>
                <button onClick={clearFilters} style={{
                  marginTop: 12, fontFamily: FONTS.body, fontSize: 12,
                  fontWeight: 700, color: C.oceanTeal, background: "none",
                  border: `1px solid ${C.oceanTeal}30`, borderRadius: 10,
                  padding: "8px 16px", cursor: "pointer",
                }}>
                  Clear All Filters
                </button>
              </div>
            )}
          </>
        )}
      </section>

      {/* ── Back to Our Approach CTA ── */}
      <section style={{
        textAlign: "center", padding: "48px 24px 64px",
        borderTop: `1.5px solid ${V.sage}18`,
      }}>
        <Link to="/ethos" className="underline-link">
          ← Back to Our Ethos
        </Link>
      </section>

      <Footer />
    </>
  );
}
