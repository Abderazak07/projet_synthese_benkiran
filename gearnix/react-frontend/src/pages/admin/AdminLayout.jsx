import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, Users, Package, ShoppingCart, CreditCard, Truck, Tag } from 'lucide-react';

const adminLinks = [
  { label: 'Tableau de bord', to: '/admin', icon: LayoutDashboard },
  { label: 'Utilisateurs', to: '/admin/utilisateurs', icon: Users },
  { label: 'Produits', to: '/admin/produits', icon: Package },
  { label: 'Catégories', to: '/admin/categories', icon: Tag },
  { label: 'Commandes', to: '/admin/commandes', icon: ShoppingCart },
  { label: 'Paiements', to: '/admin/paiements', icon: CreditCard },
  { label: 'Livraisons', to: '/admin/livraisons', icon: Truck },
];

export default function AdminLayout() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] bg-darker/50">
      <aside className="w-full lg:w-72 m-4 rounded-3xl border border-white/10 bg-[#07070e]/95 p-6 shadow-2xl shadow-black/30">
        <div className="mb-8">
          <p className="text-xs uppercase tracking-[0.4em] text-primary font-bold">Admin</p>
          <h2 className="mt-3 text-2xl font-black text-white">Panneau d’administration</h2>
          <p className="mt-2 text-sm text-gray-400">Accédez à toutes les sections de gestion du site.</p>
        </div>

        <nav className="space-y-3">
          {adminLinks.map(({ label, to, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/admin'}
              className={({ isActive }) =>
                `flex items-center gap-3 w-full rounded-2xl px-4 py-3 text-sm font-medium transition ${
                  isActive ? 'bg-primary/20 text-white shadow-[0_10px_30px_rgba(124,58,237,0.18)]' : 'text-gray-300 hover:bg-white/5 hover:text-white'
                }`
              }
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/5 text-primary">
                <Icon size={18} />
              </span>
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <main className="flex-1 p-4 md:p-8">
        <Outlet />
      </main>
    </div>
  );
}
