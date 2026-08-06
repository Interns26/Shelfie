function StatusBadge({ label, value }) {
  return (
    <div className="rounded-3xl border border-black/10 bg-black/[0.03] px-4 py-3 text-sm text-soft dark:border-white/10 dark:bg-white/5">
      <p className="text-xs uppercase tracking-[0.24em] text-lavender/70">{label}</p>
      <p className="mt-2 text-sm font-semibold text-soft">{value}</p>
    </div>
  );
}

export default StatusBadge;
