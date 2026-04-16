import { Outlet } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart } from 'lucide-react';
import DashboardShell from '../../components/layout/DashboardShell';

const navItems = [
  { label: 'Tableau de bord', to: '/fournisseur', icon: LayoutDashboard },
  { label: 'Produits', to: '/fournisseur/produits', icon: Package },
  { label: 'Commandes', to: '/fournisseur/commandes', icon: ShoppingCart },
];

export default function FournisseurLayout() {
  return (
    <DashboardShell
      brand="Fournisseur"
      navItems={navItems.map((l) => ({ ...l, end: l.to === '/fournisseur' }))}
      headerTitle="Espace fournisseur"
      headerSubtitle="Catalogue et commandes"
    >
      <Outlet />
    </DashboardShell>
  );
}
