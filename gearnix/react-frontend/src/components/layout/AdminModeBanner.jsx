import { Link } from 'react-router-dom';
import { ShieldCheck, ArrowLeft, Eye } from 'lucide-react';

export default function AdminModeBanner() {
  return (
    <div className="admin-mode-banner">
      <div className="admin-mode-banner-inner">
        {/* Left: Badge + status */}
        <div className="admin-mode-badge-group">
          <div className="admin-mode-icon-wrapper">
            <ShieldCheck size={18} />
            <span className="admin-pulse-dot" />
          </div>
          <div className="admin-mode-text">
            <span className="admin-mode-label">Mode Administrateur</span>
            <span className="admin-mode-sublabel">
              <Eye size={12} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} />
              Navigation client active — session admin préservée
            </span>
          </div>
        </div>

        {/* Right: Return button */}
        <Link to="/admin" className="admin-mode-return-btn">
          <ArrowLeft size={16} />
          <span>Tableau de bord</span>
        </Link>
      </div>
    </div>
  );
}
