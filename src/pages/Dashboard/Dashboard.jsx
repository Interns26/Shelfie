import { useEffect, useState } from 'react';
import { HiOutlineCube, HiOutlineExclamationCircle, HiOutlineShieldCheck, HiOutlineSparkles, HiOutlineArrowRight } from 'react-icons/hi';
import { motion } from 'framer-motion';
import AppShell from '../../components/layout/AppShell.jsx';
import StatCard from '../../components/ui/StatCard.jsx';
import StatusBadge from '../../components/ui/StatusBadge.jsx';
import GradientButton from '../../components/ui/GradientButton.jsx';
import SectionTitle from '../../components/ui/SectionTitle.jsx';
import UploadDropzone from '../../components/ui/UploadDropzone.jsx';
import { fetchDashboard } from '../../services/api/index.js';

function Dashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [referenceImage, setReferenceImage] = useState(null);
  const [currentImage, setCurrentImage] = useState(null);

  useEffect(() => {
    fetchDashboard().then(setDashboard);
  }, []);

  useEffect(() => () => {
    if (referenceImage) URL.revokeObjectURL(referenceImage.previewUrl);
    if (currentImage) URL.revokeObjectURL(currentImage.previewUrl);
  }, [referenceImage, currentImage]);

  const handleSelect = (setter) => (file) => {
    setter((prev) => {
      if (prev) URL.revokeObjectURL(prev.previewUrl);
      return { file, previewUrl: URL.createObjectURL(file) };
    });
  };

  const handleClear = (setter) => () => {
    setter((prev) => {
      if (prev) URL.revokeObjectURL(prev.previewUrl);
      return null;
    });
  };

  const readyToCompare = Boolean(referenceImage && currentImage);

  return (
    <AppShell>
      <SectionTitle title="Overview" subtitle="AI-powered retail shelf monitoring." />
      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-8">
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
            <div className="space-y-3">
              <p className="text-sm uppercase tracking-[0.28em] text-lavender/80">Shelf comparison</p>
              <h2 className="text-2xl font-semibold text-soft">Upload shelf images</h2>
              <p className="text-sm leading-7 text-muted">
                Add a reference planogram and the latest shelf capture so the AI model can compare them and flag any
                misplaced or missing products.
              </p>
            </div>

            <div className="mt-7 grid gap-4">
              <UploadDropzone
                step={1}
                label="Reference image"
                hint="Ideal planogram or previous approved layout"
                file={referenceImage?.file}
                previewUrl={referenceImage?.previewUrl}
                onSelect={handleSelect(setReferenceImage)}
                onClear={handleClear(setReferenceImage)}
              />

              <div className="flex items-center justify-center">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-black/[0.04] text-lavender dark:bg-white/10">
                  <HiOutlineArrowRight size={16} />
                </span>
              </div>

              <UploadDropzone
                step={2}
                label="Current shelf image"
                hint="Latest photo captured from the store floor"
                file={currentImage?.file}
                previewUrl={currentImage?.previewUrl}
                onSelect={handleSelect(setCurrentImage)}
                onClear={handleClear(setCurrentImage)}
              />
            </div>

            <GradientButton
              className="mt-7 w-full disabled:pointer-events-none disabled:opacity-40"
              disabled={!readyToCompare}
            >
              {readyToCompare ? 'Run shelf comparison' : 'Upload both images to continue'}
            </GradientButton>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

export default Dashboard;