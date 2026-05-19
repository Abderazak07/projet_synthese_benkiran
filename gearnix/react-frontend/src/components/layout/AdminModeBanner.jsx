import { Link } from 'react-router-dom';
import { ShieldCheck, ArrowLeft, Eye, Store } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function AdminModeBanner() {
  const { user } = useAuth();
  
  const isAdmin = user?.role === 'ADMIN';
  const dashboardLink = isAdmin ? '/admin' : '/fournisseur';
  const label = isAdmin ? 'Mode Administrateur' : 'Mode Vendeur';

  return (
    <div className="admin-mode-banner">
      <div className="admin-mode-banner-inner">
        {/* Left: Badge + status */}
        <div className="admin-mode-badge-group">
          <div className="admin-mode-icon-wrapper">
            <ShieldCheck size={24} strokeWidth={2.5} />
            <span className="admin-pulse-dot" />
          </div>
          <div className="admin-mode-text">
            <span className="admin-mode-label">{label}</span>
            <span className="admin-mode-sublabel">
              <Eye size={10} className="inline mr-1" />
              SÉCURITÉ ACTIVE — NAVIGATION CLIENT RÉEL
            </span>
          </div>
        </div>

        {/* Right: Return button */}
        <Link to={dashboardLink} className="admin-mode-return-btn group">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span>ACCÉDER AU DASHBOARD</span>
        </Link>
      </div>
    </div>
  );
}
