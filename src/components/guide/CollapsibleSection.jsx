import { useRef } from 'react';

function CollapsibleSection({ id, label, title, teaser, isOpen, onToggle, children }) {
  const bodyRef = useRef(null);

  return (
    <section id={id} className="scroll-mt-[126px]">
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-4 py-6 bg-transparent border-none cursor-pointer text-left group"
      >
        <div className="flex-1 min-w-0">
          <div className="font-body text-[10px] font-bold tracking-[0.22em] uppercase text-[#7A857E] mb-1">{label}</div>
          <div className="font-serif text-[clamp(20px,3vw,26px)] font-light text-dark-ink leading-[1.2]">{title}</div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <span className="font-body text-[12px] text-[#7A857E] whitespace-nowrap">{teaser}</span>
          <span className="inline-block text-[12px] text-[#7A857E] transition-transform duration-300 ease-in-out"
            style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>▾</span>
        </div>
      </button>
      <div
        className="overflow-hidden transition-[max-height] duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]"
        style={{ maxHeight: isOpen ? 5000 : 0 }}
      >
        <div ref={bodyRef} className="pb-6">
          {children}
        </div>
      </div>
    </section>
  );
}

export default CollapsibleSection;
