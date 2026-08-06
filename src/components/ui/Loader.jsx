function Loader({ label = 'Loading' }) {
  return (
    <div className="flex min-h-[220px] items-center justify-center rounded-[24px] border border-black/10 bg-black/[0.03] p-8 text-center text-sm text-muted shadow-panel dark:border-white/10 dark:bg-white/5">
      <div className="space-y-3">
        <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-black/10 border-t-brand dark:border-white/10" />
        <p>{label}</p>
      </div>
    </div>
  );
}

export default Loader;
