function SectionTitle({ title, subtitle }) {
  return (
    <div className="mb-6">
      <p className="text-sm uppercase tracking-[0.34em] text-lavender/80">{title}</p>
      <p className="mt-3 text-3xl font-bold text-soft md:text-4xl">{subtitle}</p>
    </div>
  );
}

export default SectionTitle;