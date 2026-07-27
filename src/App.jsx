import { AnimatePresence, motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import AppRoutes from './routes/router.jsx';

function App() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-bg text-soft font-sans overflow-x-hidden">
      <div className="relative isolate overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-radial-soft opacity-80" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.08),_transparent_24%),radial-gradient(circle_at_bottom_right,_rgba(139,92,246,0.08),_transparent_22%)]" />
        <div className="pointer-events-none absolute left-1/2 top-0 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-purple-500/10 blur-3xl" />
        <div className="relative mx-auto flex min-h-screen max-w-[1700px] px-4 py-6 lg:px-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.45, ease: 'easeOut' }}
              className="flex min-h-screen w-full"
            >
              <AppRoutes />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default App;
