export default function SectionTitle({ children }) {
  return (
    <h2 className="font-serif text-[clamp(24px,4vw,32px)] font-normal text-dark-ink m-0 mb-1.5 leading-[1.2] text-center">
      {children}
    </h2>
  );
}
