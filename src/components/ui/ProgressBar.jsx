function ProgressBar({ label, value }) {
  return (
    <div className="card-glass p-6">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm font-semibold text-soft">{label}</p>
        <p className="text-sm font-semibold text-soft">{value}%</p>
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-black/[0.06] dark:bg-white/10">
        <div className="h-full rounded-full bg-gradient-to-r from-brand to-lavender" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

export default ProgressBar;