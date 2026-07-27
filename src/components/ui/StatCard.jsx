function StatCard({ icon, title, value, description, accent = 'from-brand' }) {
  return (
    <div className="card-glass p-6">
      <div className="flex items-center justify-between">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-white/10 text-lavender shadow-sm">
          {icon}
        </div>
        <div className="rounded-full bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.24em] text-lavender">Live</div>
      </div>
      <div className="mt-6 space-y-3">
        <p className="text-sm text-muted">{title}</p>
        <p className="text-3xl font-semibold text-white">{value}</p>
        <p className="text-sm leading-6 text-muted">{description}</p>
      </div>
    </div>
  );
}

export default StatCard;
