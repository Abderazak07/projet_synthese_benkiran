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
            {isAdmin ? <ShieldCheck size={18} /> : <Store size={18} />}
            <span className="admin-pulse-dot" />
          </div>
          <div className="admin-mode-text">
            <span className="admin-mode-label">{label}</span>
            <span className="admin-mode-sublabel">
              <Eye size={12} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} />
              Navigation client active — session {isAdmin ? 'admin' : 'vendeur'} préservée
            </span>
          </div>
        </div>

        {/* Right: Return button */}
        <Link to={dashboardLink} className="admin-mode-return-btn">
          <ArrowLeft size={16} />
          <span>Tableau de bord</span>
        </Link>
      </div>
    </div>
  );
}
