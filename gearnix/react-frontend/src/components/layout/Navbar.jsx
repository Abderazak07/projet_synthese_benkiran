import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Search, User, Menu, X, Heart, Settings, HelpCircle, Box } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

const NAV_LINKS = [
  { label: 'ACCUEIL', to: '/' },
  { label: 'PRODUITS', to: '/produits' },
  { label: 'SOLDE', to: '/produits?promo=true' },
  { label: 'À PROPOS', to: '/about' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { user, logout } = useAuth();
  const { count } = useCart();
  const location = useLocation();

  return (
    <header className="sticky top-0 w-full z-[100]">
      {/* Tier 1: Utility Bar */}
      <div className="adidas-header-tier-1 hidden md:flex">
        <Link to="/aide" className="hover:underline">aide</Link>
        <Link to="/mes-commandes" className="hover:underline">suivi de commande</Link>
        <Link to="/adiclub" className="hover:underline">adiclub</Link>
        {!user ? (
          <Link to="/login" className="hover:underline">se connecter</Link>
        ) : (
          <button onClick={() => setDropdownOpen(!dropdownOpen)} className="flex items-center gap-1 hover:underline">
            <User size={12} /> {user.nom}
          </button>
        )}
      </div>

      {/* Tier 2: Main Navigation */}
      <nav className="adidas-header-tier-2 shadow-none border-b border-adi-silver">
        <div className="flex justify-between items-center w-full h-full">
          
          {/* Logo (Left aligned exactly like Adidas) */}
          <Link to="/" className="flex items-center flex-shrink-0 mr-8">
            <span className="font-black text-3xl md:text-4xl tracking-tighter text-black uppercase italic">
              GEARNIX
            </span>
          </Link>

          {/* Desktop Navigation (Center-left) */}
          <div className="hidden md:flex items-center h-full mr-auto">
            {NAV_LINKS.map(link => (
              <Link 
                key={link.to} 
                to={link.to} 
                className={`adi-nav-link ${
                  location.pathname + location.search === link.to ? 'after:w-full' : ''
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Actions: Search, Wishlist, Bag */}
          <div className="flex items-center gap-2 md:gap-4 h-full">
            {/* Search Input - Desktop */}
            <div className="hidden md:flex relative items-center group">
              <input 
                type="text" 
                placeholder="RECHERCHER" 
                className="bg-adi-silver border-0 h-10 px-4 py-1 text-[13px] font-black placeholder:text-adi-gray placeholder:italic focus:w-64 transition-all outline-none w-48"
              />
              <Search size={20} alt="Rechercher" className="ml-2 cursor-pointer" />
            </div>

            <div className="flex items-center gap-4">
              <Link to="/wishlist" className="p-2 hover:bg-adi-silver transition-all hidden md:block">
                <Heart size={22} strokeWidth={2} />
              </Link>

              <Link to="/panier" className="relative p-2 hover:bg-adi-silver transition-all">
                <ShoppingCart size={22} strokeWidth={2.5} />
                {count > 0 && (
                  <span className="absolute bottom-1 right-1 bg-black text-white text-[9px] w-4 h-4 flex items-center justify-center font-black">
                    {count}
                  </span>
                )}
              </Link>
              
              {/* Mobile Menu Toggle */}
              <button 
                onClick={() => setIsOpen(!isOpen)} 
                className="md:hidden p-2 text-black"
              >
                {isOpen ? <X size={26} /> : <Menu size={26} />}
              </button>
            </div>
          </div>
        </div>

        {/* User Dropdown (if logic required) */}
        {dropdownOpen && user && (
          <div className="absolute right-10 top-28 w-56 bg-white border-2 border-black shadow-none py-0 z-[110]" onMouseLeave={() => setDropdownOpen(false)}>
            <div className="px-4 py-3 border-b border-adi-silver bg-adi-silver">
              <p className="text-xs font-black uppercase text-black italic">{user.nom}</p>
              <p className="text-[10px] text-adi-gray font-black uppercase tracking-widest">{user.role}</p>
            </div>
            <div className="flex flex-col">
              {user.role === 'ADMIN' && (
                <Link to="/admin" className="px-4 py-3 text-xs font-black uppercase hover:bg-adi-silver border-b border-adi-silver">Dashboard Admin</Link>
              )}
              <Link to="/mes-commandes" className="px-4 py-3 text-xs font-black uppercase hover:bg-adi-silver border-b border-adi-silver">Mes Commandes</Link>
              <button onClick={logout} className="px-4 py-3 text-xs font-black uppercase text-adi-red hover:bg-adi-silver text-left">Déconnexion</button>
            </div>
          </div>
        )}
      </nav>

      {/* Tier 3: Promotion Bar */}
      <div className="adidas-header-tier-3">
        LIVRAISON GRATUITE SUR TOUTES LES COMMANDES DE PLUS DE 100€
      </div>

      {/* Mobile Drawer (Pixel Perfect Slide-in) */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 bg-black/50 z-[90] animate-in fade-in duration-300">
          <div className="absolute left-0 top-0 bottom-0 w-4/5 bg-white p-6 shadow-xl animate-in slide-in-from-left duration-500">
             <div className="flex items-center justify-between mb-10">
               <span className="font-black italic text-2xl">GEARNIX</span>
               <button onClick={() => setIsOpen(false)}><X size={30}/></button>
             </div>
             <div className="flex flex-col gap-6">
                {NAV_LINKS.map(link => (
                  <Link 
                    key={link.to} 
                    to={link.to} 
                    onClick={() => setIsOpen(false)}
                    className="text-3xl font-black uppercase italic tracking-tighter border-b-2 border-adi-silver pb-2"
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="mt-10 pt-10 border-t border-adi-silver space-y-4">
                  <Link to="/mes-commandes" className="block text-sm font-bold uppercase italic tracking-widest">Suivi de commande</Link>
                  <Link to="/adiclub" className="block text-sm font-bold uppercase italic tracking-widest">adiClub</Link>
                  <Link to="/login" className="block text-sm font-bold uppercase italic tracking-widest">Se connecter</Link>
                </div>
             </div>
          </div>
        </div>
      )}
    </header>
  );
}
