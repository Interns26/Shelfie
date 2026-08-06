import { motion } from 'framer-motion';

function ImageViewer({ src, label, className = '' }) {
  return (
    <motion.div whileHover={{ y: -4 }} className={`card-glass overflow-hidden ${className}`}>
      <div className="relative h-full w-full overflow-hidden rounded-[24px] bg-slate-950/40">
        <img src={src} alt={label} className="h-full w-full object-cover" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-bg/95 to-transparent" />
      </div>
    </motion.div>
  );
}

export default ImageViewer;
