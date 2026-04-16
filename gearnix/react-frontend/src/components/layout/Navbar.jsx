import { Link } from 'react-router-dom';
import { ShoppingCart, Search, User, Menu, X, LogOut, Package, LayoutDashboard } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { user, logout } = useAuth();
  const { count } = useCart();

  return (
    <nav className="fixed w-full z-50 transition-all duration-300 bg-dark/80 backdrop-blur-md border-b border-white/5 shadow-[0_4px_30px_rgba(0,0,0,0.1)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded bg-gradient-to-br from-primary to-accent flex items-center justify-center transform group-hover:rotate-12 transition-transform">
              <span className="font-black text-white text-lg">G</span>
            </div>
            <span className="font-black text-xl tracking-widest text-white">GEARNIX</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">Home</Link>
            <Link to="/produits" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">Products</Link>
          </div>

          {/* Icons & Actions */}
          <div className="hidden md:flex items-center space-x-6">
            <button className="text-gray-300 hover:text-primary transition-colors">
              <Search size={20} />
            </button>

            <Link to="/panier" className="text-gray-300 hover:text-accent transition-colors relative">
              <ShoppingCart size={20} />
              {count > 0 && (
                <span className="absolute -top-2 -right-2 bg-accent text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
                  {count}
                </span>
              )}
            </Link>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center border border-primary/30">
                    <User size={16} className="text-primary" />
                  </div>
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-3 w-48 rounded-xl bg-darker border border-white/10 shadow-xl overflow-hidden py-2" onClick={() => setDropdownOpen(false)}>
                    <div className="px-4 py-2 border-b border-white/5 mb-2">
                      <p className="text-sm font-bold text-white truncate">{user.nom}</p>
                      <p className="text-xs text-gray-400 capitalize">{user.role}</p>
                    </div>

                    {user.role === 'ADMIN' && (
                      <Link to="/admin" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:bg-white/5 hover:text-primary">
                        <LayoutDashboard size={16} /> Admin Panel
                      </Link>
                    )}
                    {user.role === 'FOURNISSEUR' && (
                      <Link to="/fournisseur" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:bg-white/5 hover:text-primary">
                        <Package size={16} /> Mon Espace Modérateur
                      </Link>
                    )}
                    {(user.role === 'CLIENT' || user.role === 'ADMIN') && (
                      <Link to="/mes-commandes" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:bg-white/5 hover:text-primary">
                        <Package size={16} /> Mes Commandes
                      </Link>
                    )}

                    <button onClick={logout} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 mt-2">
                      <LogOut size={16} /> Déconnexion
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="text-sm font-semibold text-white/80 hover:text-white border border-white/20 hover:border-white/50 px-4 py-2 rounded-lg transition-all">
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-4">
            <Link to="/panier" className="text-white relative">
              <ShoppingCart size={20} />
              {count > 0 && (
                <span className="absolute -top-2 -right-2 bg-accent text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
                  {count}
                </span>
              )}
            </Link>
            <button onClick={() => setIsOpen(!isOpen)} className="text-white">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-darker border-b border-white/10 px-4 pt-2 pb-4 space-y-2">
          <Link to="/" className="block px-3 py-2 text-base font-medium text-white hover:bg-white/5 rounded-md">Home</Link>
          <Link to="/produits" className="block px-3 py-2 text-base font-medium text-white hover:bg-white/5 rounded-md">Products</Link>
          {!user && <Link to="/login" className="block px-3 py-2 text-base font-medium text-primary hover:bg-white/5 rounded-md">Sign In</Link>}
        </div>
      )}
    </nav>
  );
}
