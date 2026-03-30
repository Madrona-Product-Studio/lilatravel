export default function SectionSub({ children }) {
  return (
    <p className="font-body text-[15px] md:text-[clamp(14px,1.8vw,15px)] font-normal text-[#4A5650] mx-auto mb-7 leading-[1.7] text-left md:text-center max-w-full md:max-w-[520px]">
      {children}
    </p>
  );
}
