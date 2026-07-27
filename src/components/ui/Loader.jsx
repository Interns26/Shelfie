function Loader({ label = 'Loading' }) {
  return (
    <div className="flex min-h-[220px] items-center justify-center rounded-[24px] border border-white/10 bg-white/5 p-8 text-center text-sm text-muted shadow-panel">
      <div className="space-y-3">
        <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-white/10 border-t-brand" />
        <p>{label}</p>
      </div>
    </div>
  );
}

export default Loader;
