import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart } from 'lucide-react';

const navItems = [
  { label: 'Tableau de bord', to: '/fournisseur', icon: LayoutDashboard },
  { label: 'Produits', to: '/fournisseur/produits', icon: Package },
  { label: 'Commandes', to: '/fournisseur/commandes', icon: ShoppingCart },
];

export default function FournisseurLayout() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid gap-8 xl:grid-cols-[280px_1fr]">
        <aside className="glass-card p-6 border border-white/10 shadow-xl bg-dark/80">
          <div className="mb-8">
            <p className="text-sm uppercase tracking-[0.35em] text-primary/70 mb-2">Espace Fournisseur</p>
            <h2 className="text-2xl font-black">Gestion du catalogue</h2>
            <p className="mt-3 text-gray-400 text-sm">Accédez rapidement à vos produits et commandes.</p>
          </div>

          <nav className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/fournisseur'}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${
                      isActive ? 'bg-primary/20 text-white border border-primary/30' : 'text-gray-300 hover:bg-white/5 hover:text-white'
                    }`
                  }
                >
                  <span className="w-10 h-10 rounded-2xl flex items-center justify-center bg-white/5 text-primary">
                    <Icon size={18} />
                  </span>
                  {item.label}
                </NavLink>
              );
            })}
          </nav>
        </aside>

        <section className="space-y-8">
          <div className="glass-card p-6 border border-white/10 shadow-xl bg-dark/90">
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.35em] text-primary/70">Tableau fournisseur</p>
                <h1 className="text-3xl font-black">Navigation fluide</h1>
              </div>
              <p className="text-gray-400 max-w-xl">
                Utilise le menu latéral pour accéder à ton tableau de bord, gérer ton catalogue et suivre tes commandes sans quitter ton espace.
              </p>
            </div>
          </div>

          <Outlet />
        </section>
      </div>
    </div>
  );
}
