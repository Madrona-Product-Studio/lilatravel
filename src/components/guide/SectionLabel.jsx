export default function SectionLabel({ children, accentColor }) {
  return (
    <div className="font-body text-[12px] font-bold tracking-[0.28em] uppercase mb-3 text-center"
      style={accentColor ? { color: accentColor } : undefined}
    >
      {children}
    </div>
  );
}
