// ═══════════════════════════════════════════════════════════════════════════════
// BREADCRUMB — navigation trail for subpages
// ═══════════════════════════════════════════════════════════════════════════════

import { Link } from 'react-router-dom';
import { C } from '@data/brand';

export default function Breadcrumb({ items }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap",
      fontFamily: "'Quicksand'", fontSize: 11, fontWeight: 600,
      letterSpacing: "0.16em", textTransform: "uppercase",
      padding: "24px 0 0",
    }}>
      {items.map((item, i) => (
        <span key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {i > 0 && <span style={{ color: "#bcc8d0" }}>·</span>}
          {item.to ? (
            <Link to={item.to} style={{
              color: "#9aabba", transition: "color 0.2s", textDecoration: "none",
            }}
            onMouseEnter={e => e.currentTarget.style.color = C.darkInk}
            onMouseLeave={e => e.currentTarget.style.color = "#9aabba"}
            >
              {item.label}
            </Link>
          ) : (
            <span style={{ color: C.darkInk }}>{item.label}</span>
          )}
        </span>
      ))}
    </div>
  );
}
