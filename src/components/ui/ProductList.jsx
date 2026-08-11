/* Copyright (c) UWorx Services 2026. All Rights Reserved. The information contained herein is proprietary and confidential. This proprietary and confidential information, either in whole or in part, shall not be used for any purpose unless permitted by the terms of a valid license agreement. */
function ProductList({ title, items, highlight }) {
  const normalizedItems = items.map((item) => {
    if (typeof item === 'string') {
      return { name: item };
    }

    if (item?.name) {
      return item;
    }

    return {
      name: item?.title || item?.label || 'Unknown item',
      rowNumber: item?.rowNumber || item?.row,
      productNumber: item?.productNumber,
      expectedProduct: item?.expectedProduct,
      missingCount: item?.missingCount,
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
          <div key={`${item.name}-${item.rowNumber ?? index}`} className="min-h-[9rem] rounded-3xl border border-black/10 bg-black/[0.03] px-4 py-3 text-sm text-soft dark:border-white/10 dark:bg-white/5">
            <div className="font-medium text-soft">{item.name}</div>
            {item.productNumber != null ? (
              <div className="mt-1 text-xs uppercase tracking-[0.18em] text-muted">Product #: {item.productNumber}</div>
            ) : null}
            {item.rowNumber ? (
              <div className="mt-1 text-xs uppercase tracking-[0.18em] text-muted">Row: {item.rowNumber}</div>
            ) : null}
            {item.expectedProduct ? (
              <div className="mt-1 text-xs uppercase tracking-[0.18em] text-muted">Expected: {item.expectedProduct}</div>
            ) : null}
            {item.missingCount != null ? (
              <div className="mt-1 text-xs uppercase tracking-[0.18em] text-muted">Missing count: {item.missingCount}</div>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductList;