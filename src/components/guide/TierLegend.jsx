/**
 * TierLegend — reusable tier legend row for Breathe, Move, and Sleep sections.
 * Same visual pattern as the Sleep tier legend.
 *
 * @param {Array} tiers - [{ label, desc, color }]
 */
export default function TierLegend({ tiers }) {
  return (
    <div className="p-3.5 bg-cream border border-stone mb-5 flex flex-col md:flex-row gap-2.5 md:gap-4 flex-wrap">
      {tiers.map((t, i) => (
        <div key={i} className="flex-none md:flex-[1_1_140px]">
          <span className="font-body text-[12px] font-bold tracking-[0.1em]" style={{ color: t.color }}>{t.label}</span>
          <span className="font-body text-[13px] font-normal text-[#4A5650] ml-1.5">{t.desc}</span>
        </div>
      ))}
    </div>
  );
}
