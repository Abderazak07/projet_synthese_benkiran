import { Outlet } from 'react-router-dom';
import { LayoutDashboard, Users, Package, ShoppingCart, CreditCard, Truck, Tag } from 'lucide-react';
import DashboardShell from '../../components/layout/DashboardShell';

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
    <DashboardShell
      brand="Admin"
      navItems={adminLinks.map((l) => ({ ...l, end: l.to === '/admin' }))}
      headerTitle="Administration"
      headerSubtitle="Gestion du catalogue, des commandes et des paiements"
    >
      <Outlet />
    </DashboardShell>
  );
}
