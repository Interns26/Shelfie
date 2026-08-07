import { useEffect, useState } from 'react';
import { HiOutlineCube, HiOutlineExclamationCircle, HiOutlineShieldCheck, HiOutlineSparkles, HiOutlineArrowRight } from 'react-icons/hi';
import { motion } from 'framer-motion';
import AppShell from '../../components/layout/AppShell.jsx';
import StatCard from '../../components/ui/StatCard.jsx';
import GradientButton from '../../components/ui/GradientButton.jsx';
import SectionTitle from '../../components/ui/SectionTitle.jsx';
import UploadDropzone from '../../components/ui/UploadDropzone.jsx';
import ProductList from '../../components/ui/ProductList.jsx';
import ProgressBar from '../../components/ui/ProgressBar.jsx';
import StatusBadge from '../../components/ui/StatusBadge.jsx';
import Loader from '../../components/ui/Loader.jsx';
import { analyzeShelf, fetchDashboard, fetchResults } from '../../services/api/index.js';

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

  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [results, setResults] = useState(null);

  const handleSelect = (setter) => (file) => {
    setResults(null);
    setter((prev) => {
      if (prev) URL.revokeObjectURL(prev.previewUrl);
      return { file, previewUrl: URL.createObjectURL(file) };
    });
  };

  const handleClear = (setter) => () => {
    setResults(null);
    setter((prev) => {
      if (prev) URL.revokeObjectURL(prev.previewUrl);
      return null;
    });
  };

  const readyToCompare = Boolean(referenceImage && currentImage);

  const defaultSummaryItems = [
    {
      title: 'Products Detected',
      value: '0',
      description: 'Items analyzed in last 24h',
      icon: 'box',
    },
    {
      title: 'Misplaced Products',
      value: 0,
      description: 'Detected position errors',
      icon: 'pin',
    },
    {
      title: 'Missing Products',
      value: 0,
      description: 'Items needing restock',
      icon: 'tag',
    },
    {
      title: 'Shelf Health',
      value: '0%',
      description: 'Optimal display score',
      icon: 'pulse',
    },
  ];

  const summaryItems = results
    ? [
        {
          title: 'Products Detected',
          value: typeof results.productsDetected === 'number'
            ? results.productsDetected.toLocaleString()
            : results.productsDetected || '0',
          description: 'Items analyzed in last 24h',
          icon: 'box',
        },
        {
          title: 'Misplaced Products',
          value:
            typeof results.misplaced === 'number'
              ? results.misplaced
              : results.misplaced?.length ?? results.misplacedCount ?? 0,
          description: 'Detected position errors',
          icon: 'pin',
        },
        {
          title: 'Missing Products',
          value:
            typeof results.missing === 'number'
              ? results.missing
              : results.missing?.length ?? results.missingCount ?? 0,
          description: 'Items needing restock',
          icon: 'tag',
        },
        {
          title: 'Shelf Health',
          value: `${results.shelfHealth ?? 0}%`,
          description: 'Optimal display score',
          icon: 'pulse',
        },
      ]
    : defaultSummaryItems;

  const [analysisError, setAnalysisError] = useState(null);

  const handleAnalyze = async () => {
    if (!readyToCompare) return;

    setAnalysisLoading(true);
    setAnalysisError(null);
    setResults(null);

    try {
      const analyzeResponse = await analyzeShelf(referenceImage.file, currentImage.file);
      const fetchedResults = analyzeResponse.results || await fetchResults();
      setResults(fetchedResults);
    } catch (error) {
      console.error('Analysis failed', error);
      setAnalysisError(error?.response?.data?.detail || error.message || 'Analysis failed');
    } finally {
      setAnalysisLoading(false);
    }
  };

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
            {summaryItems?.map((item, index) => {
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
          {results ? (
            <motion.div
              className="card-glass p-8"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.05 }}
            >
              <div className="space-y-6">
                <div>
                  <p className="text-sm uppercase tracking-[0.28em] text-lavender/80">Detailed findings</p>
                  <h2 className="text-2xl font-semibold text-soft">Tracking missing and misplaced products</h2>
                </div>

                <div className="grid gap-4 xl:grid-cols-2">
                  <ProductList title="Misplaced products" items={results.misplacedDetails || results.misplaced || []} />
                  <ProductList title="Missing products" items={results.missingDetails || results.missing || []} />
                </div>
              </div>
            </motion.div>
          ) : null}
          {/* Quick action and System health cards removed */}
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
              disabled={!readyToCompare || analysisLoading}
              onClick={handleAnalyze}
            >
              {analysisLoading
                ? 'Running shelf comparison...'
                : readyToCompare
                ? 'Run shelf comparison'
                : 'Upload both images to continue'}
            </GradientButton>

            {analysisLoading ? (
              <div className="mt-6">
                <Loader label="Analyzing shelf comparison..." />
              </div>
            ) : null}
            {analysisError ? (
              <div className="mt-6 rounded-3xl border border-red-400/20 bg-red-500/10 p-4 text-sm text-red-200">
                <strong>Error:</strong> {analysisError}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </AppShell>
  );
}

export default Dashboard;