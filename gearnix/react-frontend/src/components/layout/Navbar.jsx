import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Search, User, Menu, X, LogOut, Package, LayoutDashboard, Users } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

const baseLinks = [
  { label: 'Accueil', to: '/' },
  { label: 'Produits', to: '/produits' },
];

const roleNav = {
  CLIENT: [
    { label: 'Mon panier', to: '/panier' },
    { label: 'Mes commandes', to: '/mes-commandes' },
  ],
  FOURNISSEUR: [
    { label: 'Mon panier', to: '/panier' },
    { label: 'Mes commandes', to: '/mes-commandes' },
  ],
  ADMIN: [
    { label: 'Mon panier', to: '/panier' },
    { label: 'Mes commandes', to: '/mes-commandes' },
  ],
};

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { user, logout } = useAuth();
  const { count } = useCart();
  const location = useLocation();

  const isDashboard = location.pathname.startsWith('/admin') || location.pathname.startsWith('/fournisseur');
  const isSpecialUserOnPublicSite = (user?.role === 'ADMIN' || user?.role === 'FOURNISSEUR') && !isDashboard;

  const additionalLinks = user ? roleNav[user.role] ?? [] : [];

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 bg-ink/80 backdrop-blur-xl border-b border-white/10`} style={isSpecialUserOnPublicSite ? { top: '58px' } : { top: 0 }}>
      <div className="lux-container">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sky-500 to-sky-600 flex items-center justify-center transform group-hover:rotate-12 transition-transform shadow-[0_0_0_1px_rgba(14,165,233,0.25)]">
              <span className="font-black text-ink text-lg">G</span>
            </div>
            <span className="font-black text-xl tracking-[0.28em] text-pearl">GEARNIX</span>
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            <div className="flex items-center gap-6">
              {baseLinks.map(link => (
                <Link key={link.to} to={link.to} className="text-gray-200/90 hover:text-pearl transition-colors text-xs font-semibold tracking-[0.18em] uppercase">
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-4">
              {additionalLinks.map(link => (
                <Link key={link.to} to={link.to} className="text-gray-200/80 hover:text-pearl transition-colors text-xs font-semibold tracking-[0.12em] uppercase">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-6">


            <Link to="/panier" className="text-gray-200/80 hover:text-sky-500 transition-colors relative" aria-label="Panier">
              <ShoppingCart size={20} />
              {count > 0 && (
                <span className="absolute -top-2 -right-2 bg-sky-500 text-ink text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-black">
                  {count}
                </span>
              )}
            </Link>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 text-gray-200/80 hover:text-pearl transition-colors"
                  aria-label="Menu utilisateur"
                >
                  <div className="w-8 h-8 rounded-full bg-white/[0.06] flex items-center justify-center border border-white/10 hover:border-sky-500/30 transition-colors">
                    <User size={16} className="text-sky-500" />
                  </div>
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-3 w-64 rounded-xl2 bg-graphite/95 border border-white/10 shadow-soft overflow-hidden py-2" onClick={() => setDropdownOpen(false)}>
                    <div className="px-4 py-3 border-b border-white/10 mb-2">
                      <p className="text-sm font-black text-pearl truncate tracking-wide">{user.nom}</p>
                      <p className="text-xs text-gray-400 capitalize">{user.role}</p>
                    </div>

                    {user.role === 'ADMIN' && (
                      <Link to="/admin" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-200 hover:bg-white/[0.06] hover:text-sky-500">
                        <LayoutDashboard size={16} /> Panneau Admin
                      </Link>
                    )}

                    {user.role === 'FOURNISSEUR' && (
                      <Link to="/fournisseur" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-200 hover:bg-white/[0.06] hover:text-sky-500">
                        <Package size={16} /> Espace Fournisseur
                      </Link>
                    )}

                    {user.role === 'CLIENT' && (
                      <Link to="/mes-commandes" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-200 hover:bg-white/[0.06] hover:text-sky-500">
                        <Package size={16} /> Mes commandes
                      </Link>
                    )}

                    <button onClick={logout} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-300 hover:bg-red-500/10 mt-2">
                      <LogOut size={16} /> Déconnexion
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="text-xs font-semibold tracking-[0.18em] uppercase text-gray-200 hover:text-pearl border border-white/15 hover:border-sky-500/35 px-5 py-2.5 rounded-full transition-all bg-white/[0.02] hover:bg-white/[0.04]">
                Connexion
              </Link>
            )}
          </div>

          <div className="md:hidden flex items-center gap-4">
            <Link to="/panier" className="text-white relative" aria-label="Panier">
              <ShoppingCart size={20} />
              {count > 0 && (
                <span className="absolute -top-2 -right-2 bg-sky-500 text-ink text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-black">
                  {count}
                </span>
              )}
            </Link>
            <button onClick={() => setIsOpen(!isOpen)} className="text-white" aria-label="Menu mobile">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-graphite/95 border-b border-white/10 px-4 pt-3 pb-5 space-y-2">
          {[...baseLinks, ...additionalLinks].map(link => (
            <Link key={link.to} to={link.to} className="block px-3 py-2 text-sm font-semibold tracking-[0.14em] uppercase text-pearl/90 hover:bg-white/[0.06] rounded-lg">
              {link.label}
            </Link>
          ))}
          {user ? (
            <button onClick={logout} className="w-full text-left px-3 py-2 text-sm font-semibold tracking-[0.14em] uppercase text-red-300 hover:bg-red-500/10 rounded-lg">
              Déconnexion
            </button>
          ) : (
            <Link to="/login" className="block px-3 py-2 text-sm font-semibold tracking-[0.14em] uppercase text-sky-500 hover:bg-white/[0.06] rounded-lg">Connexion</Link>
          )}
        </div>
      )}
    </nav>
  );
}
