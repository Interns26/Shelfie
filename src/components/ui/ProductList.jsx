function ProductList({ title, items, highlight }) {
  const normalizedItems = items.map((item) => {
    if (typeof item === 'string') {
      return { title: item };
    }

    if (item?.name) {
      return item;
    }

    return {
      title: item?.title || item?.label || 'Unknown item',
      row: item?.row,
      category: item?.category,
    };
  });

  return (
    <div className="card-glass p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-soft">{title}</p>
          <p className="text-sm text-muted">{normalizedItems.length} items detected</p>
        </div>
        {highlight && <span className="rounded-full bg-brand/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-brand">Priority</span>}
      </div>
      <div className="space-y-3">
        {normalizedItems.map((item, index) => (
          <div key={`${item.name || item.title}-${item.row ?? index}`} className="min-h-[9rem] rounded-3xl border border-black/10 bg-black/[0.03] px-4 py-3 text-sm text-soft dark:border-white/10 dark:bg-white/5">
            <div className="font-medium text-soft">{item.name || item.title}</div>
            {item.category ? <div className="mt-1 text-xs uppercase tracking-[0.18em] text-muted">Category: {item.category}</div> : null}
            {item.row ? <div className="mt-1 text-xs uppercase tracking-[0.18em] text-muted">Row: {item.row}</div> : null}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductList;