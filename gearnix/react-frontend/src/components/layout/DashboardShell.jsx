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
      {/* Sidebar - Adidas Brand Aesthetic */}
      <aside className="dash-sidebar shrink-0 hidden lg:flex flex-col">
        <div className="sidebar-profile">
          <Link to="/" className="flex items-center gap-2 mb-6 group">
             <div className="bg-black text-white p-1 transition-transform group-hover:rotate-90">
                <Search size={20} strokeWidth={3} />
             </div>
             <span className="text-2xl font-[900] italic uppercase tracking-tighter text-black">GEARNIX</span>
          </Link>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-black flex items-center justify-center font-black text-white">
              {brand?.slice?.(0, 1) ?? 'G'}
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-adi-gray leading-none mb-1">Système</p>
              <p className="text-sm font-black uppercase italic tracking-tighter text-black leading-none">{brand}</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto custom-scrollbar">
          {navItems.map((it) => {
            const Icon = it.icon;
            return (
              <NavLink
                key={it.to}
                to={it.to}
                end={it.end}
                className={({ isActive }) =>
                  `sidebar-link ${isActive ? 'sidebar-link-active' : 'text-black/60'}`
                }
              >
                {Icon ? <Icon size={18} /> : null}
                <span>{it.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="mt-auto border-t border-adi-silver">
          {/* Mode Client — View Live Site Button */}
          <Link
            to="/"
            className="sidebar-link hover:bg-black hover:text-white group"
          >
            <Eye size={18} />
            <span>Mode Client</span>
            <div className="ml-auto px-2 py-0.5 bg-adi-red text-[8px] text-white font-black italic">LIVE</div>
          </Link>

          <button 
            onClick={handleLogout}
            className="sidebar-link w-full text-left hover:bg-adi-red hover:text-white"
          >
            <LogOut size={18} />
            <span>Déconnexion</span>
          </button>
        </div>
      </aside>

      <div className="dash-main">
        {/* Topbar - Clean Adidas Header */}
        <header className="dash-topbar">
          <div className="flex flex-col">
            {headerTitle ? (
              <h2 className="text-2xl font-black uppercase italic tracking-tighter text-black">{headerTitle}</h2>
            ) : null}
            {headerSubtitle ? (
              <p className="text-[10px] text-adi-gray font-black uppercase tracking-widest">{headerSubtitle}</p>
            ) : null}
          </div>

          <div className="flex items-center gap-6">
            {actions ? <div className="flex items-center gap-3">{actions}</div> : null}
            <div className="flex items-center gap-2 px-4 py-2 bg-adi-silver text-[11px] font-black uppercase tracking-widest">
               <UserCircle size={16} />
               <span>Admin Account</span>
            </div>
          </div>
        </header>

        {/* Dynamic Content Area */}
        <div className="dash-content-area custom-scrollbar overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
