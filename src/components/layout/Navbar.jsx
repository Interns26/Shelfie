import { HiOutlineSun, HiOutlineMoon } from 'react-icons/hi';
import { useTheme } from '../../hooks/UseTheme';
import { HiOutlineViewGrid } from 'react-icons/hi';


function Navbar({ onMenuClick }) {
  const { theme, toggleTheme } = useTheme();
  return (
    <header className="card-glass flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between">
      <button
  type="button"
  onClick={onMenuClick}
  aria-label="Open menu"
  className="mb-2 inline-flex h-10 w-10 items-center justify-center rounded-full bg-black/[0.03] text-soft dark:bg-white/10 lg:hidden"
>
  <HiOutlineViewGrid size={20} />
</button>
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-[0.3em] text-lavender/80">Retail Shelf Intelligence</p>
        <h1 className="text-2xl font-bold text-soft sm:text-3xl"></h1>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-black/[0.03] px-4 py-3 text-sm text-soft shadow-sm dark:border-white/10 dark:bg-white/5">
          <span className="inline-flex h-3.5 w-3.5 rounded-full bg-emerald-400 shadow-glow" />
          System status: Live
        </div>
        <button
  type="button"
  onClick={toggleTheme}
  aria-label="Toggle dark or light theme"
  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-black/10 bg-black/[0.03] text-lavender shadow-sm transition-colors hover:bg-black/[0.06] dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
>
  {theme === 'dark' ? <HiOutlineSun size={20} /> : <HiOutlineMoon size={20} />}
</button>
        <div className="flex items-center gap-3 rounded-full border border-black/10 bg-black/[0.03] px-4 py-3 text-sm text-soft shadow-sm dark:border-white/10 dark:bg-white/5">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-black/[0.03] text-lavender dark:bg-white/5">RI</span>
          <div className="text-left">
            <p className="text-sm font-semibold text-soft">Retail AI</p>
            <p className="text-xs text-muted">Operator</p>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
