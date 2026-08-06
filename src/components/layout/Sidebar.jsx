import { NavLink } from 'react-router-dom';
import { HiOutlineChartPie, HiOutlineX } from 'react-icons/hi';
import Logo from './Logo.jsx';

const navItems = [
  { label: 'Dashboard', path: '/', icon: HiOutlineChartPie },
];

function Sidebar({ isOpen = false, onClose = () => {} }) {
  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`card-glass fixed inset-y-0 left-0 z-50 flex h-full w-[82%] max-w-[300px] flex-col gap-8 p-6 shadow-panel transition-transform duration-300 ease-out lg:static lg:z-0 lg:h-auto lg:w-full lg:max-w-[320px] lg:min-h-[calc(100vh-48px)] lg:translate-x-0 lg:sticky lg:top-6 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between gap-3">
          <div className="w-full rounded-3xl bg-black/[0.03] px-4 py-3 shadow-sm shadow-black/10 dark:bg-white/5">
            <Logo compact className="max-w-[210px]" />
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-black/[0.04] text-soft dark:bg-white/10 lg:hidden"
            aria-label="Close menu"
          >
            <HiOutlineX size={18} />
          </button>
        </div>

        <div>
          <p className="text-sm text-muted">Premium AI retail monitoring platform with real-time insights.</p>
        </div>

        <nav className="flex flex-1 flex-col gap-3">
          {navItems.map(({ label, path, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-3xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-black/[0.05] text-soft shadow-glow dark:bg-white/10'
                    : 'text-muted hover:bg-black/[0.03] hover:text-soft dark:hover:bg-white/5'
                }`
              }
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-black/[0.03] text-lavender dark:bg-white/5">
                <Icon size={20} />
              </span>
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="rounded-3xl border border-black/10 bg-black/[0.03] p-4 text-sm text-muted dark:border-white/10 dark:bg-white/5">
          <p>Version 1.0</p>
          <p className="mt-2 text-xs text-soft/70">AI shelf analytics — enterprise ready.</p>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;