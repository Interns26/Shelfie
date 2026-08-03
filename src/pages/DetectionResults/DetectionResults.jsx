import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { HiOutlineCheckCircle, HiOutlineSparkles, HiOutlineShieldCheck } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';
import AppShell from '../../components/layout/AppShell.jsx';
import SectionTitle from '../../components/ui/SectionTitle.jsx';
import ImageViewer from '../../components/ui/ImageViewer.jsx';
import ProductList from '../../components/ui/ProductList.jsx';
import ProgressBar from '../../components/ui/ProgressBar.jsx';
import GradientButton from '../../components/ui/GradientButton.jsx';
import Loader from '../../components/ui/Loader.jsx';
import { fetchResults } from '../../services/api/index.js';

function DetectionResults() {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchResults().then((data) => {
      setResults(data);
      setLoading(false);
    });
  }, []);

  return (
    <AppShell>
      <div className="grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
        <div className="space-y-8">
          <SectionTitle title="Detection results" subtitle="AI analysis of the latest shelf frame." />
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="card-glass p-6"
          >
            {loading || !results ? (
              <Loader />
            ) : (
              <div className="space-y-6">
                <ImageViewer src={results.image} label="Analyzed shelf" />
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-[24px] border border-black/10 bg-black/[0.03] p-5 dark:border-white/10 dark:bg-white/5">
                    <p className="text-sm text-muted">Shelf health</p>
                    <p className="mt-3 text-3xl font-semibold text-soft">{results.shelfHealth}%</p>
                  </div>
                  <div className="rounded-[24px] border border-black/10 bg-black/[0.03] p-5 dark:border-white/10 dark:bg-white/5">
                    <p className="text-sm text-muted">Confidence</p>
                    <p className="mt-3 text-3xl font-semibold text-soft">{results.confidence}%</p>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>

        <div className="space-y-6">
          <div className="card-glass p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.28em] text-lavender/80">Detection Summary</p>
                <h2 className="mt-2 text-2xl font-semibold text-soft">Shelf status</h2>
              </div>
              <div className="rounded-full bg-black/[0.03] px-3 py-1 text-sm text-muted dark:bg-white/5">Final review</div>
            </div>
            <div className="mt-6 grid gap-4">
              <div className="rounded-[24px] border border-black/10 bg-black/[0.03] p-5 dark:border-white/10 dark:bg-white/5">
                <div className="flex items-center gap-3">
                  <HiOutlineCheckCircle size={24} className="text-brand" />
                  <div>
                    <p className="text-sm font-semibold text-soft">Healthy</p>
                    <p className="text-sm text-muted">{results?.healthy}% of the layout is aligned</p>
                  </div>
                </div>
              </div>
              <div className="rounded-[24px] border border-black/10 bg-black/[0.03] p-5 dark:border-white/10 dark:bg-white/5">
                <div className="flex items-center gap-3">
                  <HiOutlineSparkles size={24} className="text-warning" />
                  <div>
                    <p className="text-sm font-semibold text-soft">Needs Rearrangement</p>
                    <p className="text-sm text-muted">{results?.rearrangement}% requires attention</p>
                  </div>
                </div>
              </div>
              <div className="rounded-[24px] border border-black/10 bg-black/[0.03] p-5 dark:border-white/10 dark:bg-white/5">
                <div className="flex items-center gap-3">
                  <HiOutlineShieldCheck size={24} className="text-success" />
                  <div>
                    <p className="text-sm font-semibold text-soft">Detection Confidence</p>
                    <p className="text-sm text-muted">A strong AI assessment score</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-6">
              <ProgressBar label="Analysis confidence" value={results?.confidence ?? 0} />
            </div>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <GradientButton onClick={() => navigate('/monitoring')} className="w-full">Analyze Again</GradientButton>
              <button
                type="button"
                onClick={() => navigate('/')}
                className="rounded-full border border-black/10 bg-black/[0.03] px-5 py-3 text-sm font-semibold text-soft transition hover:bg-black/[0.06] dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
              >
                Return Dashboard
              </button>
            </div>
          </div>
          <ProductList title="Misplaced products" items={results?.misplaced ?? []} />
          <ProductList title="Missing products" items={results?.missing ?? []} highlight />
        </div>
      </div>
    </AppShell>
  );
}

export default DetectionResults; 