import { NavLink } from 'react-router-dom';
import { HiOutlineChartPie, HiOutlineViewGrid, HiOutlineClipboardList } from 'react-icons/hi';

const navItems = [
  { label: 'Dashboard', path: '/', icon: HiOutlineChartPie },
  { label: 'Shelf Monitoring', path: '/monitoring', icon: HiOutlineViewGrid },
  { label: 'Detection Results', path: '/results', icon: HiOutlineClipboardList },
];

function Sidebar() {
  return (
    <aside className="card-glass flex h-full min-h-[calc(100vh-48px)] w-full max-w-[320px] flex-col gap-8 border border-white/10 p-6 shadow-panel lg:sticky lg:top-6">
      <div className="space-y-4">
        <div className="rounded-3xl bg-white/5 px-4 py-3 shadow-sm shadow-black/10">
          <p className="text-[0.92rem] font-semibold uppercase tracking-[0.26em] text-lavender/90">Retail Shelf Intelligence</p>
        </div>
        <div>
          <p className="text-sm text-muted">Premium AI retail monitoring platform with real-time insights.</p>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-3">
        {navItems.map(({ label, path, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-3xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                isActive ? 'bg-white/10 text-white shadow-glow' : 'text-muted hover:bg-white/5 hover:text-soft'
              }`
            }
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/5 text-lavender">
              <Icon size={20} />
            </span>
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="rounded-3xl border border-white/10 bg-white/5 p-4 text-sm text-muted">
        <p>Version 1.0</p>
        <p className="mt-2 text-xs text-white/70">AI shelf analytics — enterprise ready.</p>
      </div>
    </aside>
  );
}

export default Sidebar;
