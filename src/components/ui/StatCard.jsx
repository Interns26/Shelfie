/* Copyright (c) UWorx Services 2026. All Rights Reserved. The information contained herein is proprietary and confidential. This proprietary and confidential information, either in whole or in part, shall not be used for any purpose unless permitted by the terms of a valid license agreement. */
function StatCard({ icon, title, value, description, accent = 'from-brand' }) {
  return (
    <div className="card-glass p-6">
      <div className="flex items-center justify-between">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-black/[0.04] text-lavender shadow-sm dark:bg-white/10">
          {icon}
        </div>
        <div className="rounded-full bg-black/[0.03] px-3 py-1 text-xs uppercase tracking-[0.24em] text-lavender dark:bg-white/5">Live</div>
      </div>
      <div className="mt-6 space-y-3">
        <p className="text-sm text-muted">{title}</p>
        <p className="text-3xl font-semibold text-soft">{value}</p>
        <p className="text-sm leading-6 text-muted">{description}</p>
      </div>
    </div>
  );
}

export default StatCard;