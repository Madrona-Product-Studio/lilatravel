// ═══════════════════════════════════════════════════════════════════════════════
// BREADCRUMB — navigation trail for subpages
// ═══════════════════════════════════════════════════════════════════════════════

import { Link } from 'react-router-dom';

export default function Breadcrumb({ items }) {
  return (
    <div className="flex items-center gap-2 flex-wrap font-body text-[11px] font-semibold tracking-[0.16em] uppercase pt-6">
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-2">
          {i > 0 && <span className="text-[#bcc8d0]">·</span>}
          {item.to ? (
            <Link to={item.to} className="text-[#9aabba] hover:text-dark-ink transition-colors no-underline">
              {item.label}
            </Link>
          ) : (
            <span className="text-dark-ink">{item.label}</span>
          )}
        </span>
      ))}
    </div>
  );
}
