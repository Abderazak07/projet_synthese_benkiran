import { NavLink, Link, useNavigate } from 'react-router-dom';
import { Search, UserCircle, LogOut, Eye } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function DashboardShell({
  brand = 'GEARNIX',
  navItems = [],
  headerTitle,
  headerSubtitle,
  actions,
  children,
}) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };
  return (
    <div className="dash-shell">
      {/* Sidebar - Design Identique au projet de référence */}
      <aside className="dash-sidebar shrink-0 hidden lg:flex flex-col shadow-2xl z-40">
        <div className="h-20 flex items-center px-6 mb-4">
          <div className="h-12 w-12 rounded-2xl bg-white/10 flex items-center justify-center font-black text-xl border border-white/20 shadow-inner">
            {brand?.slice?.(0, 1) ?? 'G'}
          </div>
          <div className="ml-4">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/50 leading-none mb-1">Espace</p>
            <p className="text-lg font-black tracking-tight text-white leading-none">{brand}</p>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {navItems.map((it) => {
            const Icon = it.icon;
            return (
              <NavLink
                key={it.to}
                to={it.to}
                end={it.end}
                className={({ isActive }) =>
                  `flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all duration-300 group
                  ${isActive 
                    ? 'bg-white shadow-xl shadow-[#1e4e52]/40 text-[#2c767c]' 
                    : 'text-white/70 hover:bg-white/10 hover:text-white'}`
                }
              >
                {Icon ? <Icon size={20} className={`transition-transform duration-300 group-hover:scale-110`} /> : null}
                <span className="tracking-wide">{it.label}</span>
                {/* Petit indicateur pour l'actif */}
                {/* <div className={`ml-auto w-1.5 h-1.5 rounded-full bg-white opacity-0 transition-opacity`} /> */}
              </NavLink>
            );
          })}
        </nav>

        <div className="mt-auto px-4 py-6 space-y-3 border-t border-white/10">
          {/* Mode Client — View Live Site Button */}
          <Link
            to="/"
            id="sidebar-view-live-site"
            className="sidebar-live-btn group"
          >
            <div className="sidebar-live-btn-glow" />
            <Eye size={18} className="relative z-10 group-hover:scale-110 transition-transform duration-300" />
            <span className="relative z-10 tracking-wide">Mode Client</span>
            <span className="sidebar-live-btn-badge">LIVE</span>
          </Link>

          <button 
            onClick={handleLogout}
            className="flex items-center gap-4 w-full px-5 py-3.5 rounded-2xl bg-white/10 text-white font-bold text-sm hover:bg-red-500/20 hover:text-red-200 transition-all border border-white/5 group"
          >
            <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
            Se déconnecter
          </button>
        </div>
      </aside>

      <div className="dash-main flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Topbar - Design Identique */}
        <header className="dash-topbar flex-shrink-0">
          <div className="flex flex-col min-w-0">
            {headerTitle ? (
              <h2 className="text-xl font-black text-slate-900 tracking-tight truncate">{headerTitle}</h2>
            ) : null}
            {headerSubtitle ? (
              <p className="text-xs text-slate-400 font-semibold tracking-wide truncate">{headerSubtitle}</p>
            ) : null}
          </div>

          <div className="flex items-center gap-6">
            {actions ? <div className="flex items-center gap-3">{actions}</div> : null}
            
            <button className="flex items-center gap-3 group">
              <div className="relative">
                <div className="h-10 w-10 rounded-2xl bg-[#2c767c]/10 flex items-center justify-center text-[#2c767c] font-black border border-[#2c767c]/20 group-hover:bg-[#2c767c] group-hover:text-white transition-all shadow-sm">
                   A
                </div>
                <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-emerald-500 border-2 border-white shadow-sm" title="En ligne" />
              </div>
            </button>
          </div>
        </header>

        {/* Dynamic Content Area */}
        <div className="dash-content-area custom-scrollbar">
          {children}
        </div>
      </div>
    </div>
  );
}
