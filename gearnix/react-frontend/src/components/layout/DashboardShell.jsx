import { NavLink } from 'react-router-dom';
import { Search, UserCircle } from 'lucide-react';

export default function DashboardShell({
  brand = 'Dashboard',
  navItems = [],
  headerTitle,
  headerSubtitle,
  actions,
  children,
}) {
  return (
    <div className="dash-shell flex">
      <aside className="dash-sidebar w-[260px] shrink-0 hidden lg:flex flex-col">
        <div className="h-14 flex items-center px-5 border-b border-white/10">
          <div className="h-9 w-9 rounded-lg bg-white/10 flex items-center justify-center font-black">
            {brand?.slice?.(0, 1) ?? 'D'}
          </div>
          <div className="ml-3">
            <p className="text-xs uppercase tracking-[0.24em] text-white/70">Espace</p>
            <p className="text-sm font-black tracking-[0.18em] uppercase">{brand}</p>
          </div>
        </div>

        <nav className="px-3 py-4 space-y-1">
          {navItems.map((it) => {
            const Icon = it.icon;
            return (
              <NavLink
                key={it.to}
                to={it.to}
                end={it.end}
                className={({ isActive }) =>
                  `${isActive ? 'dash-link dash-link-active' : 'dash-link'}`
                }
              >
                {Icon ? (
                  <span className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center">
                    <Icon size={18} />
                  </span>
                ) : null}
                <span className="font-semibold">{it.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="mt-auto px-5 py-4 border-t border-white/10">
          <button className="w-full dash-btn-ghost bg-white/10 border-white/10 text-white hover:bg-white/15">
            Se déconnecter
          </button>
        </div>
      </aside>

      <div className="flex-1 min-w-0">
        <header className="dash-topbar">
          <div className="min-w-0">
            {headerTitle ? <p className="dash-title truncate">{headerTitle}</p> : null}
            {headerSubtitle ? (
              <p className="text-xs text-slate-500 truncate">{headerSubtitle}</p>
            ) : null}
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
              <Search size={16} className="text-slate-500" />
              <input
                placeholder="Rechercher..."
                className="bg-transparent outline-none text-sm w-56"
              />
            </div>
            {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
            <button className="rounded-full text-slate-600 hover:text-slate-900">
              <UserCircle size={28} />
            </button>
          </div>
        </header>

        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}

