function Logo({ compact = false, className = '' }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div
        className={`flex h-12 w-12 items-center justify-center rounded-3xl bg-gradient-to-br from-brand via-violet-600 to-fuchsia-500 text-white shadow-xl shadow-fuchsia-500/15 ${
          compact ? 'h-10 w-10' : 'h-12 w-12'
        }`}
      >
        <svg viewBox="0 0 48 48" className="h-6 w-6" aria-hidden="true">
          <g fill="none" stroke="currentColor" strokeWidth="3">
            <rect x="11" y="10" width="26" height="8" rx="4" />
            <rect x="11" y="22" width="18" height="8" rx="4" />
            <rect x="11" y="34" width="10" height="8" rx="4" />
          </g>
          <circle cx="36" cy="16" r="4" fill="currentColor" />
        </svg>
      </div>
      <div className={`min-w-0 ${compact ? 'space-y-1' : 'space-y-1'}`}>
        <p className={`truncate text-[0.7rem] uppercase tracking-[0.28em] text-muted ${compact ? 'text-[0.65rem]' : 'text-xs'}`}>
          Retail Shelf
        </p>
        <p className={`truncate font-semibold text-soft ${compact ? 'text-sm' : 'text-lg'}`}>
          Intelligence
        </p>
      </div>
    </div>
  );
}



export default Logo;