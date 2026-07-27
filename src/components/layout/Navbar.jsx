function Navbar() {
  return (
    <header className="card-glass flex flex-col gap-4 border border-white/10 bg-white/5 p-5 shadow-panel md:flex-row md:items-center md:justify-between">
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-[0.3em] text-lavender/80">Retail Shelf Intelligence</p>
        <h1 className="text-2xl font-bold text-white sm:text-3xl">Enterprise AI shelf monitoring</h1>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-3 text-sm text-soft shadow-sm">
          <span className="inline-flex h-3.5 w-3.5 rounded-full bg-emerald-400 shadow-glow" />
          System status: Live
        </div>
        <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-3 text-sm text-soft shadow-sm">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/5 text-lavender">RI</span>
          <div className="text-left">
            <p className="text-sm font-semibold text-white">Retail AI</p>
            <p className="text-xs text-muted">Operator</p>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
