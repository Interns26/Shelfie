/* Copyright (c) UWorx Services 2026. All Rights Reserved. The information contained herein is proprietary and confidential. This proprietary and confidential information, either in whole or in part, shall not be used for any purpose unless permitted by the terms of a valid license agreement. */
function StatusBadge({ label, value }) {
  return (
    <div className="rounded-3xl border border-black/10 bg-black/[0.03] px-4 py-3 text-sm text-soft dark:border-white/10 dark:bg-white/5">
      <p className="text-xs uppercase tracking-[0.24em] text-lavender/70">{label}</p>
      <p className="mt-2 text-sm font-semibold text-soft">{value}</p>
    </div>
  );
}

export default StatusBadge;
