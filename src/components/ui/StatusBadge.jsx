function StatusBadge({ label, value }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-soft">
      <p className="text-xs uppercase tracking-[0.24em] text-lavender/70">{label}</p>
      <p className="mt-2 text-sm font-semibold text-white">{value}</p>
    </div>
  );
}

export default StatusBadge;
