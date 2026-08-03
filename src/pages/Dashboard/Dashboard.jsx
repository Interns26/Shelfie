import { useEffect, useState } from 'react';
import { HiOutlineCube, HiOutlineExclamationCircle, HiOutlineShieldCheck, HiOutlineSparkles } from 'react-icons/hi';
import { motion } from 'framer-motion';
import AppShell from '../../components/layout/AppShell.jsx';
import StatCard from '../../components/ui/StatCard.jsx';
import StatusBadge from '../../components/ui/StatusBadge.jsx';
import GradientButton from '../../components/ui/GradientButton.jsx';
import SectionTitle from '../../components/ui/SectionTitle.jsx';
import { fetchDashboard } from '../../services/api/index.js';

function Dashboard() {
  const [dashboard, setDashboard] = useState(null);

  useEffect(() => {
    fetchDashboard().then(setDashboard);
  }, []);

  return (
    <AppShell>
      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-8">
          <SectionTitle title="Overview" subtitle="AI-powered retail shelf monitoring." />
          <motion.div
            className="grid gap-6 md:grid-cols-2"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
          >
            {dashboard?.summary.map((item, index) => {
              const icons = {
                box: <HiOutlineCube size={24} />, 
                pin: <HiOutlineExclamationCircle size={24} />, 
                tag: <HiOutlineSparkles size={24} />, 
                pulse: <HiOutlineShieldCheck size={24} />,
              };

              return (
                <StatCard
                  key={item.title}
                  icon={icons[item.icon]}
                  title={item.title}
                  value={item.value}
                  description={item.description}
                />
              );
            })}
          </motion.div>
          <div className="grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
            <div className="card-glass p-8">
              <div className="flex flex-col gap-6">
                <div>
                  <p className="text-sm uppercase tracking-[0.28em] text-lavender/80">Quick action</p>
                  <h2 className="mt-3 text-2xl font-semibold text-soft">Analyze latest shelf frame</h2>
                </div>
                <p className="text-sm leading-7 text-muted">Initiate a new analysis cycle, review current statistics, and keep the shelf environment optimized with AI insights.</p>
                <GradientButton className="w-full max-w-xs">Analyze Shelf</GradientButton>
              </div>
            </div>
            <div className="card-glass p-8">
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm uppercase tracking-[0.28em] text-lavender/80">System health</p>
                    <p className="mt-2 text-lg font-semibold text-soft">Production readiness</p>
                  </div>
                  <span className="rounded-full bg-emerald-400/15 px-3 py-1 text-sm font-semibold text-emerald-300">Stable</span>
                </div>
                <div className="grid gap-4">
                  {dashboard?.status.map((item) => (
                    <StatusBadge key={item.label} label={item.label} value={item.value} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="card-glass p-8">
            <div className="space-y-4">
              <p className="text-sm uppercase tracking-[0.28em] text-lavender/80">Insights snapshot</p>
              <h2 className="text-2xl font-semibold text-soft">Retail shelf intelligence</h2>
              <p className="text-sm leading-7 text-muted">An elegant dashboard view with AI-driven metrics, readiness indicators, and space to track product availability across store shelves.</p>
            </div>
            <div className="mt-8 grid gap-4">
              <div className="rounded-[24px] border border-black/10 bg-black/[0.03] p-5 dark:border-white/10 dark:bg-white/5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm text-muted">Latest scan</p>
                    <p className="mt-2 text-xl font-semibold text-soft">Shelf A1 - Grocery aisle</p>
                  </div>
                  <span className="rounded-full bg-brand/15 px-3 py-1 text-sm text-brand">Verified</span>
                </div>
              </div>
              <div className="rounded-[24px] border border-black/10 bg-black/[0.03] p-5 dark:border-white/10 dark:bg-white/5">
                <p className="text-sm text-muted">AI activity</p>
                <div className="mt-3 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-2xl font-semibold text-soft">92%</p>
                    <p className="text-sm text-muted">Shelf conformity score</p>
                  </div>
                  <div className="rounded-full bg-emerald-400/10 px-3 py-1 text-sm text-emerald-200">Optimal</div>
                </div>
              </div>
            </div>
          </div>

          <div className="card-glass p-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.28em] text-lavender/80">Daily summary</p>
                <p className="mt-2 text-xl font-semibold text-soft">Shelf detection timeline</p>
              </div>
              <div className="rounded-full bg-black/[0.03] px-4 py-3 text-sm text-muted dark:bg-white/5">Live simulation</div>
            </div>
            <div className="mt-8 grid gap-4">
              <div className="rounded-3xl border border-black/10 bg-black/[0.03] p-4 text-sm text-soft dark:border-white/10 dark:bg-white/5">AI model has processed 98 shelf frames in the last hour.</div>
              <div className="rounded-3xl border border-black/10 bg-black/[0.03] p-4 text-sm text-soft dark:border-white/10 dark:bg-white/5">Restocking recommendations updated for 12 products.</div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

export default Dashboard;