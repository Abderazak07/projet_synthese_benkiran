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
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-black mb-8 uppercase text-primary">Mon Espace Fournisseur</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="glass-card p-6 flex items-center gap-4 border-l-4 border-l-primary">
          <div className="p-3 bg-primary/20 rounded-lg text-primary">
            <Package size={24} />
          </div>
          <div>
            <p className="text-gray-400 text-sm">Mes Produits</p>
            <p className="text-2xl font-bold">{stats.produits}</p>
          </div>
        </div>
        
        <div className="glass-card p-6 flex items-center gap-4 border-l-4 border-l-accent">
          <div className="p-3 bg-accent/20 rounded-lg text-accent">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-gray-400 text-sm">Stock Total</p>
            <p className="text-2xl font-bold">{stats.stockTotal}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass-card p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <AlertTriangle className="text-yellow-500" size={20}/> Alertes Stock Faible
          </h2>
          {stats.alertesStock.length > 0 ? (
            <ul className="space-y-3">
              {stats.alertesStock.map(p => (
                <li key={p.id} className="flex justify-between items-center bg-white/5 p-3 rounded">
                  <span className="font-semibold text-sm">{p.nom}</span>
                  <span className="text-red-400 font-bold bg-red-500/20 px-2 rounded">Stock: {p.stock}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400">Tous vos produits ont un stock suffisant.</p>
          )}
        </div>
        
        <div className="glass-card p-6 flex flex-col justify-center items-center gap-4">
           <Link to="/fournisseur/produits" className="w-full text-center glow-btn py-3 rounded-lg font-bold">Gérer mon catalogue</Link>
           <Link to="/fournisseur/commandes" className="w-full text-center border border-primary text-primary hover:bg-primary/20 transition-colors py-3 rounded-lg font-bold">Voir les commandes reçues</Link>
        </div>
      </div>
    </div>
  );
}
