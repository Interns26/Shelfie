import { useState } from 'react';
import { motion } from 'framer-motion';
import AppShell from '../../components/layout/AppShell.jsx';
import GradientButton from '../../components/ui/GradientButton.jsx';
import StatusBadge from '../../components/ui/StatusBadge.jsx';
import ImageViewer from '../../components/ui/ImageViewer.jsx';
import SectionTitle from '../../components/ui/SectionTitle.jsx';
import Loader from '../../components/ui/Loader.jsx';
import { analyzeShelf } from '../../services/api/index.js';

function ShelfMonitoring() {
  const [status, setStatus] = useState('Waiting');
  const [loading, setLoading] = useState(false);
  const [confidence, setConfidence] = useState('—');
  const [lastAnalysis, setLastAnalysis] = useState('No action taken yet');

  const handleAnalyze = async () => {
    setLoading(true);
    setStatus('Analyzing');
    const start = Date.now();
    await analyzeShelf();
    setLoading(false);
    setStatus('Completed');
    setConfidence('94%');
    setLastAnalysis(`${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • shelf frame analyzed`);
    const elapsed = Date.now() - start;
    if (elapsed < 1200) {
      await new Promise((resolve) => setTimeout(resolve, 300));
    }
  };

  return (
    <AppShell>
      <div className="grid gap-6 xl:grid-cols-[1.6fr_0.9fr]">
        <div className="space-y-8">
          <SectionTitle title="Shelf Monitoring" subtitle="Simulated live shelf analysis." />
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="card-glass p-6"
          >
            <div className="grid gap-6 lg:grid-cols-[1.6fr_0.9fr]">
              <div className="space-y-6">
                {loading ? (
                  <Loader label="Analyzing current shelf frame" />
                ) : (
                  <ImageViewer
                    src="https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1200&q=60"
                    label="Retail shelf"
                  />
                )}
                <div className="rounded-[24px] border border-white/10 bg-white/5 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm uppercase tracking-[0.28em] text-lavender/80">Current shelf frame</p>
                      <p className="mt-2 text-xl font-semibold text-white">Aisle 3 — Fresh categories</p>
                    </div>
                    <span className="rounded-full bg-brand/15 px-3 py-1 text-sm text-brand">Live feed</span>
                  </div>
                </div>
              </div>
              <div className="space-y-6">
                <div className="rounded-[24px] border border-white/10 bg-white/5 p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm uppercase tracking-[0.24em] text-lavender/80">Current status</p>
                      <span className="rounded-full bg-emerald-400/15 px-3 py-1 text-sm text-emerald-200">{status}</span>
                    </div>
                    <div className="space-y-3">
                      <StatusBadge label="Detection Status" value={status} />
                      <StatusBadge label="Confidence" value={confidence} />
                      <StatusBadge label="Last Analysis" value={lastAnalysis} />
                    </div>
                  </div>
                </div>
                <GradientButton onClick={handleAnalyze} className="w-full">
                  {loading ? 'Analyzing...' : 'Analyze Shelf'}
                </GradientButton>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </AppShell>
  );
}

export default ShelfMonitoring;
