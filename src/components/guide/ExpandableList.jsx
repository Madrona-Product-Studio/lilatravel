import { useState } from 'react';

function ExpandableList({ children, initialCount = 5, label = "more" }) {
  const [expanded, setExpanded] = useState(false);
  const items = Array.isArray(children) ? children : [children];
  const visible = expanded ? items : items.slice(0, initialCount);
  const hasMore = items.length > initialCount;

  return (
    <div>
      {visible}
      {hasMore && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="inline-flex items-center gap-2 mt-5 pt-2 pb-1 bg-transparent border-none border-b border-dark-ink cursor-pointer font-body text-[12px] font-bold tracking-[0.2em] uppercase text-dark-ink transition-opacity duration-200 hover:opacity-55"
        >
          {expanded ? "Show less" : `Show ${items.length - initialCount} more ${label}`}
          <span className="inline-block transition-transform duration-[250ms] ease-in-out text-[11px]"
            style={{ transform: expanded ? "rotate(180deg)" : "rotate(0deg)" }}>{"▼"}</span>
        </button>
      )}
    </div>
  );
}

export default ExpandableList;
