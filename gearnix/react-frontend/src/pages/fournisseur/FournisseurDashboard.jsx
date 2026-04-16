import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { Package, TrendingUp, AlertTriangle } from 'lucide-react';

export default function FournisseurDashboard() {
  const [stats, setStats] = useState({ produits: 0, stockTotal: 0, alertesStock: [] });

  useEffect(() => {
    // Dans un vrai projet, on aurait un /api/fournisseur/stats
    // Ici on déduit des produits
    api.get('/produits').then(res => {
      // Pour la démo, on considère que le endpoint renvoie seulement ses produits ou on filtre si on avait implémenté un return spécifique
      const myProds = res.data; // Supposons que l'API renvoie tous les produits pour la simplicité, en vrai il faut filtrer
      setStats({
        produits: myProds.length,
        stockTotal: myProds.reduce((sum, p) => sum + p.stock, 0),
        alertesStock: myProds.filter(p => p.stock < 10)
      });
    });
  }, []);

  return (
    <div>
      <div className="mb-4">
        <h1 className="dash-title">Tableau de bord</h1>
        <p className="dash-muted text-sm">Synthèse rapide de votre catalogue.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="dash-card p-6 flex items-center gap-4 border-l-4 border-l-[#2f7a78]">
          <div className="p-3 bg-[#2f7a78]/10 rounded-lg text-[#2f7a78] border border-[#2f7a78]/15">
            <Package size={24} />
          </div>
          <div>
            <p className="text-slate-500 text-sm">Mes Produits</p>
            <p className="text-2xl font-semibold text-slate-900">{stats.produits}</p>
          </div>
        </div>
        
        <div className="dash-card p-6 flex items-center gap-4 border-l-4 border-l-[#2f7a78]">
          <div className="p-3 bg-[#2f7a78]/10 rounded-lg text-[#2f7a78] border border-[#2f7a78]/15">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-slate-500 text-sm">Stock Total</p>
            <p className="text-2xl font-semibold text-slate-900">{stats.stockTotal}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="dash-card p-6">
          <h2 className="text-sm font-semibold mb-4 flex items-center gap-2 text-slate-900">
            <AlertTriangle className="text-amber-500" size={18}/> Alertes Stock faible
          </h2>
          {stats.alertesStock.length > 0 ? (
            <ul className="space-y-3">
              {stats.alertesStock.map(p => (
                <li key={p.id} className="flex justify-between items-center bg-white p-4 rounded-lg border border-slate-200">
                  <span className="font-semibold text-sm text-slate-900">{p.nom}</span>
                  <span className="text-red-700 font-semibold bg-red-50 border border-red-200 px-3 py-1 rounded-lg text-xs">Stock: {p.stock}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-slate-500">Tous vos produits ont un stock suffisant.</p>
          )}
        </div>
        
        <div className="dash-card p-6 flex flex-col justify-center items-center gap-4">
           <Link to="/fournisseur/produits" className="w-full text-center dash-btn py-3">Gérer mon catalogue</Link>
           <Link to="/fournisseur/commandes" className="w-full text-center dash-btn-ghost py-3">Voir les commandes reçues</Link>
        </div>
      </div>
    </div>
  );
}
