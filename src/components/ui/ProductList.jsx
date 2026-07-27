function ProductList({ title, items, highlight }) {
  return (
    <div className="card-glass p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-white">{title}</p>
          <p className="text-sm text-muted">{items.length} items detected</p>
        </div>
        {highlight && <span className="rounded-full bg-brand/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-brand">Priority</span>}
      </div>
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item} className="rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-soft">
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductList;
